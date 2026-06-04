'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { api, apiAddress } from '@src/shared/api';
import { useCartStore } from '@src/entities/cart';

export type CartOrderType = 'delivery' | 'pickup';
export type CartScheduleMode = 'asap' | 'planned';
export type CartStatusTone = 'default' | 'success' | 'error';

export type CartStatusMessage = {
  tone: CartStatusTone;
  text: string;
};

export type PickupPoint = {
  id: string;
  label: string;
};

export type AddressSuggestion = {
  value: string;
  subtitle?: string;
};

export type DateOption = {
  id: string;
  label: string;
  rawDate: string;
  value: Date;
};

export type TimeOption = {
  id: string;
  label: string;
};

export type PaymentOption = {
  id: string;
  label: string;
};

type PickupPointResponse = {
  id?: number | string;
  name?: string;
  name_ru?: string;
};

type DateResponse = {
  id?: number | string;
  text?: string;
  name?: string;
  date?: string;
};

type TimeResponse = {
  id?: number | string;
  name?: string;
  text?: string;
};

type SuggestionResponse = {
  title?: { text?: string };
  subtitle?: { text?: string };
};

type DraftState = {
  orderType: CartOrderType;
  addressQuery: string;
  selectedAddress: string;
  pickupPointId: string;
  paymentId: string;
  comment: string;
  promoCode: string;
  scheduleMode: CartScheduleMode;
  scheduleDateId: string;
  scheduleTimeId: string;
};

const DRAFT_STORAGE_PREFIX = 'preview-cart-checkout:';

const DELIVERY_PAYMENTS: PaymentOption[] = [
  { id: 'cash', label: 'Наличными курьеру' },
  { id: 'online', label: 'Картой на сайте' },
];

const PICKUP_PAYMENTS: PaymentOption[] = [
  { id: 'cash', label: 'В кафе' },
  { id: 'online', label: 'Картой на сайте' },
];

const DEFAULT_TIME_OPTION: TimeOption = {
  id: 'asap',
  label: 'В ближайшее время',
};

function storageKey(citySlug: string): string {
  return DRAFT_STORAGE_PREFIX + citySlug;
}

function readDraft(citySlug: string): Partial<DraftState> | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey(citySlug));
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as Partial<DraftState>;
  } catch {
    return null;
  }
}

function writeDraft(citySlug: string, draft: DraftState): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey(citySlug), JSON.stringify(draft));
}

function isPromoAccepted(response: Record<string, unknown> | null): boolean {
  if (!response) {
    return false;
  }

  if (response.status_promo === false) {
    return false;
  }

  if (response.st === false && typeof response.text === 'string') {
    return false;
  }

  return true;
}

function mapPoint(point: PickupPointResponse): PickupPoint | null {
  const id = point.id;
  const label = String(point.name ?? '').trim();

  if (id === undefined || id === null || !label.length) {
    return null;
  }

  return {
    id: String(id),
    label,
  };
}

function mapDateOption(item: DateResponse): DateOption | null {
  const rawDate = String(item.date ?? '').trim();
  const labelBase = String(item.text ?? '').trim();
  const labelTime = String(item.name ?? '').trim();
  const label = [labelBase, labelTime].filter(Boolean).join(' ');
  const value = rawDate.length ? new Date(rawDate + 'T00:00:00') : null;

  if (
    !rawDate.length ||
    !label.length ||
    !(value instanceof Date) ||
    Number.isNaN(value.getTime())
  ) {
    return null;
  }

  return {
    id: rawDate,
    rawDate,
    label,
    value,
  };
}

function mapTimeOption(item: TimeResponse): TimeOption | null {
  const name = String(item.name ?? '').trim();
  const text = String(item.text ?? '').trim();
  const label = text.length ? [text, name].filter(Boolean).join(' к ') : name;

  if (!name.length) {
    return null;
  }

  return {
    id: name,
    label,
  };
}

export function useCartCheckoutDraft(citySlug: string, cityLabel: string) {
  const cartItems = useCartStore((state) => state.items);

  const initialDraft = useMemo(() => readDraft(citySlug), [citySlug]);

  const [orderType, setOrderType] = useState<CartOrderType>(
    initialDraft?.orderType === 'pickup' ? 'pickup' : 'delivery'
  );
  const [addressQuery, setAddressQuery] = useState(
    String(initialDraft?.addressQuery ?? '')
  );
  const [selectedAddress, setSelectedAddress] = useState(
    String(initialDraft?.selectedAddress ?? '')
  );
  const [pickupPointId, setPickupPointId] = useState(
    String(initialDraft?.pickupPointId ?? '')
  );
  const [paymentId, setPaymentId] = useState(
    String(initialDraft?.paymentId ?? 'cash')
  );
  const [comment, setComment] = useState(String(initialDraft?.comment ?? ''));
  const [promoCode, setPromoCode] = useState(
    String(initialDraft?.promoCode ?? '')
  );
  const [scheduleMode, setScheduleMode] = useState<CartScheduleMode>(
    initialDraft?.scheduleMode === 'planned' ? 'planned' : 'asap'
  );
  const [scheduleDateId, setScheduleDateId] = useState(
    String(initialDraft?.scheduleDateId ?? '')
  );
  const [scheduleTimeId, setScheduleTimeId] = useState(
    String(initialDraft?.scheduleTimeId ?? '')
  );
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [pickupLoading, setPickupLoading] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
  const [timeOptions, setTimeOptions] = useState<TimeOption[]>([]);
  const [timeLoading, setTimeLoading] = useState(false);
  const [promoStatus, setPromoStatus] = useState<CartStatusMessage | null>(
    null
  );
  const [submitStatus, setSubmitStatus] = useState<CartStatusMessage | null>(
    null
  );

  const paymentOptions =
    orderType === 'pickup' ? PICKUP_PAYMENTS : DELIVERY_PAYMENTS;

  const selectedPickupPoint = useMemo(
    () => pickupPoints.find((point) => point.id === pickupPointId) ?? null,
    [pickupPointId, pickupPoints]
  );
  const selectedScheduleDate = useMemo(
    () =>
      dateOptions.find((option) => option.id === scheduleDateId)?.value ?? null,
    [dateOptions, scheduleDateId]
  );

  const timeLabel = useMemo(() => {
    if (orderType === 'delivery') {
      return DEFAULT_TIME_OPTION.label;
    }

    if (scheduleMode === 'asap') {
      return DEFAULT_TIME_OPTION.label;
    }

    const dateLabel =
      dateOptions.find((option) => option.id === scheduleDateId)?.label ?? '';
    const slotLabel =
      timeOptions.find((option) => option.id === scheduleTimeId)?.label ?? '';

    return [dateLabel, slotLabel].filter(Boolean).join(', ');
  }, [
    dateOptions,
    orderType,
    scheduleDateId,
    scheduleMode,
    scheduleTimeId,
    timeOptions,
  ]);

  useEffect(() => {
    writeDraft(citySlug, {
      orderType,
      addressQuery,
      selectedAddress,
      pickupPointId,
      paymentId,
      comment,
      promoCode,
      scheduleMode,
      scheduleDateId,
      scheduleTimeId,
    });
  }, [
    addressQuery,
    citySlug,
    comment,
    orderType,
    paymentId,
    pickupPointId,
    promoCode,
    scheduleDateId,
    scheduleMode,
    scheduleTimeId,
    selectedAddress,
  ]);

  useEffect(() => {
    setPaymentId((current) => {
      const options =
        orderType === 'pickup' ? PICKUP_PAYMENTS : DELIVERY_PAYMENTS;
      if (options.some((option) => option.id === current)) {
        return current;
      }

      return options[0]?.id ?? 'cash';
    });
  }, [orderType]);

  useEffect(() => {
    let active = true;

    void (async () => {
      setPickupLoading(true);
      const response = await api('cart', {
        type: 'get_point_list',
      });

      if (!active) {
        return;
      }

      const rawPoints = Array.isArray(response?.points)
        ? (response.points as PickupPointResponse[])
        : [];
      const cityPoints = rawPoints.filter((point) => {
        const pointCity = String(point.name_ru ?? '').trim();
        return !pointCity.length || pointCity === cityLabel;
      });
      const resolved = (cityPoints.length ? cityPoints : rawPoints)
        .map(mapPoint)
        .filter((point): point is PickupPoint => point !== null);

      setPickupPoints(resolved);
      setPickupLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [cityLabel]);

  useEffect(() => {
    if (orderType !== 'delivery') {
      setAddressSuggestions([]);
      setAddressLoading(false);
      return;
    }

    const query = addressQuery.trim();
    if (query.length < 3) {
      setAddressSuggestions([]);
      setAddressLoading(false);
      return;
    }

    let active = true;
    setAddressLoading(true);
    const timer = window.setTimeout(() => {
      void (async () => {
        const response = await apiAddress(cityLabel, query);
        if (!active) {
          return;
        }

        const results = Array.isArray(response?.results)
          ? (response.results as SuggestionResponse[])
          : [];

        const nextSuggestions = results
          .map((item): AddressSuggestion | null => {
            const value = String(item.title?.text ?? '').trim();
            const subtitle = String(item.subtitle?.text ?? '').trim();
            if (!value.length) {
              return null;
            }

            return {
              value: subtitle.length ? value + ', ' + subtitle : value,
              subtitle,
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null);

        setAddressSuggestions(nextSuggestions);
        setAddressLoading(false);
      })();
    }, 260);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [addressQuery, cityLabel, orderType]);

  useEffect(() => {
    if (
      orderType !== 'pickup' ||
      scheduleMode !== 'planned' ||
      !pickupPointId
    ) {
      setDateOptions([]);
      return;
    }

    let active = true;

    void (async () => {
      const dateResponse = await api('cart', {
        type: 'get_date_pred',
      });

      if (!active) {
        return;
      }

      const nextDates = Array.isArray(dateResponse)
        ? dateResponse
            .map((item) => mapDateOption(item as DateResponse))
            .filter((item): item is DateOption => item !== null)
        : [];

      setDateOptions(nextDates);

      const resolvedDate =
        nextDates.find((item) => item.id === scheduleDateId)?.rawDate ??
        nextDates[0]?.rawDate ??
        '';

      if (!resolvedDate.length) {
        setScheduleDateId('');
        return;
      }

      setScheduleDateId(resolvedDate);
    })();

    return () => {
      active = false;
    };
  }, [orderType, pickupPointId, scheduleDateId, scheduleMode]);

  useEffect(() => {
    if (
      orderType !== 'pickup' ||
      scheduleMode !== 'planned' ||
      !pickupPointId
    ) {
      setTimeOptions([]);
      setTimeLoading(false);
      return;
    }

    const resolvedDate = scheduleDateId || dateOptions[0]?.rawDate || '';
    if (!resolvedDate.length) {
      setTimeOptions([]);
      setTimeLoading(false);
      return;
    }

    let active = true;

    void (async () => {
      setTimeLoading(true);
      const cartPayload = cartItems.map((item) => ({
        item_id: item.item_id ?? item.id,
        count: item.count,
      }));
      const timeResponse = await api('cart', {
        type: 'get_times_pred',
        date: resolvedDate,
        point_id: pickupPointId,
        type_order: 1,
        cart: JSON.stringify(cartPayload),
      });

      if (!active) {
        return;
      }

      const nextTimes = Array.isArray(timeResponse)
        ? timeResponse
            .filter(
              (item) =>
                String((item as TimeResponse).name ?? '') !==
                DEFAULT_TIME_OPTION.label
            )
            .map((item) => mapTimeOption(item as TimeResponse))
            .filter((item): item is TimeOption => item !== null)
        : [];

      setTimeOptions(nextTimes);
      setScheduleTimeId((current) => {
        if (nextTimes.some((item) => item.id === current)) {
          return current;
        }

        return nextTimes[0]?.id ?? '';
      });
      setTimeLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [
    cartItems,
    dateOptions,
    orderType,
    pickupPointId,
    scheduleDateId,
    scheduleMode,
  ]);

  function selectAddress(value: string) {
    setAddressQuery(value);
    setSelectedAddress(value);
    setAddressSuggestions([]);
  }

  function changeAddressQuery(value: string) {
    setAddressQuery(value);
    if (value.trim() !== selectedAddress.trim()) {
      setSelectedAddress('');
    }
  }

  function setScheduleDateValue(value: Date | null) {
    if (!value || Number.isNaN(value.getTime())) {
      setScheduleDateId('');
      return;
    }

    const nextId = format(value, 'yyyy-MM-dd');
    if (!dateOptions.some((option) => option.id === nextId)) {
      return;
    }

    setScheduleDateId(nextId);
  }

  async function applyPromo() {
    const code = promoCode.trim();
    if (!code.length) {
      setPromoStatus({
        tone: 'error',
        text: 'Введите промокод.',
      });
      return;
    }

    setPromoStatus({
      tone: 'default',
      text: 'Проверяем промокод...',
    });

    const response = (await api('cart', {
      type: 'get_promo',
      city_id: citySlug,
      promo_name: code,
    })) as Record<string, unknown> | null;

    const accepted = isPromoAccepted(response);
    setPromoStatus({
      tone: accepted ? 'success' : 'error',
      text: String(
        response?.text ??
          (accepted ? 'Промокод принят.' : 'Промокод не применился.')
      ),
    });
  }

  function reviewOrder() {
    const hasLocation =
      orderType === 'pickup'
        ? Boolean(pickupPointId)
        : Boolean(selectedAddress || addressQuery.trim());

    if (!hasLocation) {
      setSubmitStatus({
        tone: 'error',
        text:
          orderType === 'pickup'
            ? 'Выберите кафе для самовывоза.'
            : 'Укажите адрес доставки.',
      });
      return;
    }

    if (!paymentId.length) {
      setSubmitStatus({
        tone: 'error',
        text: 'Выберите способ оплаты.',
      });
      return;
    }

    if (
      orderType === 'pickup' &&
      scheduleMode === 'planned' &&
      !scheduleTimeId
    ) {
      setSubmitStatus({
        tone: 'error',
        text: 'Выберите время получения заказа.',
      });
      return;
    }

    setSubmitStatus({
      tone: 'success',
      text: 'Форма заполнена. Отправку заказа подключим следующим этапом.',
    });
  }

  return {
    orderType,
    setOrderType,
    addressQuery,
    changeAddressQuery,
    selectedAddress,
    selectAddress,
    addressSuggestions,
    addressLoading,
    pickupPoints,
    pickupLoading,
    pickupPointId,
    setPickupPointId,
    selectedPickupPoint,
    paymentId,
    setPaymentId,
    paymentOptions,
    comment,
    setComment,
    promoCode,
    setPromoCode,
    promoStatus,
    applyPromo,
    scheduleMode,
    setScheduleMode,
    dateOptions,
    selectedScheduleDate,
    scheduleDateId,
    setScheduleDateId,
    setScheduleDateValue,
    timeOptions,
    scheduleTimeId,
    setScheduleTimeId,
    timeLoading,
    timeLabel,
    submitStatus,
    reviewOrder,
  };
}
