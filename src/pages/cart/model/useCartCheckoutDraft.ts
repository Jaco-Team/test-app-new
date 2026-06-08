'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { api } from '@src/shared/api';
import { useCartStore } from '@src/entities/cart';
import { useHeaderStore } from '@src/entities/header';

export type CartOrderType = 'delivery' | 'pickup';
export type CartScheduleMode = 'asap' | 'planned';
export type CartStatusTone = 'default' | 'success' | 'error';

export type CartStatusMessage = {
  tone: CartStatusTone;
  text: string;
};

export type CartOrderPreview = {
  typeLabel: string;
  paymentLabel: string;
  locationLabel: string;
  timeLabel: string;
  comment: string;
  promoCode: string;
};

export type PickupPoint = {
  id: string;
  label: string;
};

export type SavedAddress = {
  id: string;
  title: string;
  name: string;
  label: string;
  note: string;
  isMain: boolean;
  pointId: string;
  deliveryFee: number;
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

type SavedAddressResponse = {
  id?: number | string;
  addr_name?: string;
  name?: string;
  street?: string;
  home?: string;
  kv?: string;
  is_main?: string | number;
  comment?: string;
  sum_div?: number | string;
  point_id?: number | string;
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

type DraftState = {
  orderType: CartOrderType;
  selectedAddressId: string;
  pickupPointId: string;
  paymentId: string;
  comment: string;
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

function mapSavedAddress(item: SavedAddressResponse): SavedAddress | null {
  const id = item.id;
  if (id === undefined || id === null) {
    return null;
  }

  const title = String(item.addr_name ?? '').trim();
  const name = String(item.name ?? '').trim();
  const street = String(item.street ?? '').trim();
  const home = String(item.home ?? '').trim();
  const kv = String(item.kv ?? '').trim();
  const composed = [street, home, kv.length ? 'кв ' + kv : '']
    .filter(Boolean)
    .join(', ');
  const label = name.length ? name : composed.length ? composed : title;

  if (!label.length) {
    return null;
  }

  return {
    id: String(id),
    title,
    name,
    label,
    note: String(item.comment ?? '').trim(),
    isMain: String(item.is_main ?? '') === '1',
    pointId: String(item.point_id ?? ''),
    deliveryFee: Number(item.sum_div ?? 0) || 0,
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

function resolveInitialAddressId(draft: Partial<DraftState> | null): string {
  if (draft?.selectedAddressId) {
    return String(draft.selectedAddressId);
  }

  const legacyDraft = draft as { selectedAddress?: string } | null;
  return String(legacyDraft?.selectedAddress ?? '');
}

export function useCartCheckoutDraft(citySlug: string, cityLabel: string) {
  const token = useHeaderStore((state) => state.token);
  const isAuth = useHeaderStore((state) => state.isAuth);
  const isAddressAuthRequired = isAuth !== 'auth';

  const initialDraft = useMemo(() => readDraft(citySlug), [citySlug]);

  const [orderType, setOrderType] = useState<CartOrderType>(
    initialDraft?.orderType === 'pickup' ? 'pickup' : 'delivery'
  );
  const [selectedAddressId, setSelectedAddressId] = useState(
    resolveInitialAddressId(initialDraft)
  );
  const [pickupPointId, setPickupPointId] = useState(
    String(initialDraft?.pickupPointId ?? '')
  );
  const [paymentId, setPaymentId] = useState(
    String(initialDraft?.paymentId ?? '')
  );
  const [comment, setComment] = useState(String(initialDraft?.comment ?? ''));
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
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [savedAddressesLoading, setSavedAddressesLoading] = useState(false);
  const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
  const [timeOptions, setTimeOptions] = useState<TimeOption[]>([]);
  const [timeLoading, setTimeLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<CartStatusMessage | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [orderPreview, setOrderPreview] = useState<CartOrderPreview | null>(
    null
  );

  const cartItems = useCartStore((state) => state.items);
  const promoCode = useCartStore((state) => state.promoCode);
  const promoStatus = useCartStore((state) => state.promoStatus);
  const checkPromo = useCartStore((state) => state.checkPromo);
  const setPromoCode = useCartStore((state) => state.setPromoCode);
  const applyPromo = useCartStore((state) => state.applyPromo);

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
  const selectedDeliveryAddress = useMemo(
    () =>
      savedAddresses.find((address) => address.id === selectedAddressId) ??
      null,
    [savedAddresses, selectedAddressId]
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
      selectedAddressId,
      pickupPointId,
      paymentId,
      comment,
      scheduleMode,
      scheduleDateId,
      scheduleTimeId,
    });
  }, [
    citySlug,
    comment,
    orderType,
    paymentId,
    pickupPointId,
    scheduleDateId,
    scheduleMode,
    scheduleTimeId,
    selectedAddressId,
  ]);

  useEffect(() => {
    setPaymentId((current) => {
      const options =
        orderType === 'pickup' ? PICKUP_PAYMENTS : DELIVERY_PAYMENTS;
      if (!current.length) {
        return '';
      }

      if (options.some((option) => option.id === current)) {
        return current;
      }

      return '';
    });
  }, [orderType]);

  useEffect(() => {
    if (orderType !== 'delivery') {
      setSavedAddresses([]);
      setSavedAddressesLoading(false);
      return;
    }

    if (isAddressAuthRequired || !token.trim().length) {
      setSavedAddresses([]);
      setSavedAddressesLoading(false);
      setSelectedAddressId('');
      return;
    }

    let active = true;

    void (async () => {
      setSavedAddressesLoading(true);
      const response = await api('cart', {
        type: 'get_my_saved_addr',
        city_id: citySlug,
        token,
      });

      if (!active) {
        return;
      }

      const rawAddresses = Array.isArray(response)
        ? (response as SavedAddressResponse[])
        : [];
      const nextAddresses = rawAddresses
        .map(mapSavedAddress)
        .filter((address): address is SavedAddress => address !== null);

      setSavedAddresses(nextAddresses);
      setSelectedAddressId((current) => {
        if (
          current &&
          nextAddresses.some((address) => address.id === current)
        ) {
          return current;
        }

        const mainAddress =
          nextAddresses.find((address) => address.isMain) ?? nextAddresses[0];
        return mainAddress?.id ?? '';
      });
      setSavedAddressesLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [citySlug, isAddressAuthRequired, orderType, token]);

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
    setSelectedAddressId(value);

    const address = savedAddresses.find((item) => item.id === value);
    if (address?.note.length && !comment.trim().length) {
      setComment(address.note);
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

  async function submitPromo() {
    const code = promoCode.trim();

    if (!code.length) {
      setSubmitStatus(null);
      await applyPromo(citySlug);
      return;
    }

    setSubmitStatus(null);
    await applyPromo(citySlug);
  }

  function buildDateTimeOrder() {
    if (orderType === 'delivery' || scheduleMode === 'asap') {
      return {
        date: '',
        name: 'В ближайшее время',
        id: -1,
      };
    }

    const selectedTime =
      timeOptions.find((option) => option.id === scheduleTimeId)?.label ??
      scheduleTimeId;

    return {
      date: scheduleDateId,
      name: selectedTime || 'Запланировать',
      id: scheduleTimeId || -1,
    };
  }

  function buildPreview(paymentLabel: string): CartOrderPreview {
    const typeLabel = orderType === 'pickup' ? 'Самовывоз' : 'Доставка';
    const locationLabel =
      orderType === 'pickup'
        ? selectedPickupPoint?.label || 'Кафе не выбрано'
        : selectedDeliveryAddress?.title ||
          selectedDeliveryAddress?.name ||
          selectedDeliveryAddress?.label ||
          'Адрес не выбран';

    return {
      typeLabel,
      paymentLabel,
      locationLabel,
      timeLabel: timeLabel || 'В ближайшее время',
      comment: comment.trim(),
      promoCode: checkPromo?.st ? promoCode.trim() : '',
    };
  }

  function reviewOrder() {
    setOrderPreview(null);

    if (isAddressAuthRequired) {
      setSubmitStatus({
        tone: 'error',
        text: 'Войдите, чтобы оформить заказ.',
      });
      return;
    }

    const hasLocation =
      orderType === 'pickup'
        ? Boolean(pickupPointId)
        : Boolean(selectedAddressId);

    if (!hasLocation) {
      setSubmitStatus({
        tone: 'error',
        text:
          orderType === 'pickup'
            ? 'Выберите кафе для самовывоза.'
            : 'Выберите адрес доставки.',
      });
      return;
    }

    if (!cartItems.length) {
      setSubmitStatus({
        tone: 'error',
        text: 'Необходимо добавить товар в корзину.',
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

    const paymentLabel =
      paymentOptions.find((option) => option.id === paymentId)?.label ??
      paymentId;

    const payload =
      orderType === 'pickup'
        ? {
            type: 'create_order_pre',
            token,
            city_id: citySlug,
            promoName: checkPromo?.st ? promoCode.trim() : '',
            sdacha: 0,
            comment: '',
            typePay: paymentId,
            typeOrder: 1,
            point_id: pickupPointId,
            dateTimeOrder: JSON.stringify(buildDateTimeOrder()),
            cart: JSON.stringify(cartItems),
            free_drive: 0,
            rtoken: 0,
          }
        : {
            type: 'create_order_pre',
            token,
            city_id: citySlug,
            promoName: checkPromo?.st ? promoCode.trim() : '',
            sdacha: 0,
            addr: JSON.stringify(selectedDeliveryAddress ?? {}),
            point_id: selectedDeliveryAddress?.pointId ?? '',
            comment: comment.trim(),
            typePay: paymentId,
            typeOrder: 0,
            dateTimeOrder: JSON.stringify(buildDateTimeOrder()),
            cart: JSON.stringify(cartItems),
            free_drive: 0,
            rtoken: 0,
          };

    setSubmitting(true);
    setSubmitStatus({
      tone: 'default',
      text: 'Проверяем заказ...',
    });

    void api('cart', payload)
      .then((response) => {
        if (response?.st !== true) {
          setSubmitStatus({
            tone: 'error',
            text: String(
              response?.text ??
                'Не удалось проверить заказ. Попробуйте ещё раз.'
            ),
          });
          return;
        }

        setOrderPreview(buildPreview(paymentLabel));
        setSubmitStatus({
          tone: 'success',
          text: 'Заказ проверен. Финальную отправку не выполняем.',
        });
      })
      .catch(() => {
        setSubmitStatus({
          tone: 'error',
          text: 'Не удалось проверить заказ. Попробуйте ещё раз.',
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return {
    orderType,
    setOrderType,
    isAddressAuthRequired,
    savedAddresses,
    savedAddressesLoading,
    selectedAddressId,
    selectedDeliveryAddress,
    selectAddress,
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
    applyPromo: submitPromo,
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
    submitting,
    orderPreview,
    closeOrderPreview: () => setOrderPreview(null),
    submitStatus,
    reviewOrder,
  };
}
