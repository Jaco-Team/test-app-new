'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { format } from 'date-fns';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import NoSsr from '@mui/material/NoSsr';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import Link from 'next/link';
import {
  formatCartLabel,
  formatCartTotalLine,
  getCartExtrasIntroText,
  useCartStore,
} from '@src/entities/cart';
import { useCityStore } from '@src/entities/city';
import { useHeaderStore } from '@src/entities/header';
import {
  isValidMediaKey,
  resolveProductImageUrl,
} from '@src/shared/lib/mediaUrls';
import { cityBase } from '@src/shared/lib/sitePaths';
import { BREAKPOINTS } from '@src/shared/ui/foundation/breakpoints';
import {
  Button,
  MuiDatePickerField,
  MuiSelectField,
  MuiTextField,
  Price,
  QuantityControl,
} from '@src/shared/ui';
import {
  type SavedAddress,
  useCartCheckoutDraft,
} from '../model/useCartCheckoutDraft';
import { CartAddressModal } from './CartAddressModal';
import { CartCommentModal } from './CartCommentModal';
import { CartSelectorModal } from './CartSelectorModal';
import { CartFieldTrigger } from './cartFieldControls';
import './CartPage.scss';

const allergyText =
  'Блюда могут содержать ингредиенты, обладающие аллергенными свойствами. Если у вас есть аллергия на какой-либо продукт, пожалуйста, уточняйте состав в меню или на кассе.';

function lineTitle(
  line: Record<string, unknown>,
  catalogItem?: Record<string, unknown>
): string {
  return String(
    line.name ?? line.item_name ?? line.title ?? catalogItem?.name ?? 'Товар'
  );
}

function lineId(line: Record<string, unknown>): string {
  return String(line.item_id ?? line.id ?? '');
}

function lineImage(line: Record<string, unknown>): string | undefined {
  const image = line.img_app ?? line.img ?? line.image;
  if (!isValidMediaKey(image)) {
    return undefined;
  }

  const src = String(image);
  return src.startsWith('http')
    ? src
    : resolveProductImageUrl(src, '_138x138.jpg');
}

function addressFieldValue(address: SavedAddress | null | undefined): string {
  if (!address) {
    return 'Выберите адрес';
  }

  return address.title || address.name || address.label;
}

function compactAddressFieldValue(
  address: SavedAddress | null | undefined
): string {
  if (!address) {
    return 'Выберите адрес';
  }

  return address.title || address.name || address.label;
}

function clientOnlyControl(
  node: ReactNode,
  placeholderClassName = 'cart-page__control-placeholder'
) {
  return (
    <NoSsr
      fallback={<span className={placeholderClassName} aria-hidden="true" />}
    >
      {node}
    </NoSsr>
  );
}

export function CartPageIntro() {
  const citySlug = useCityStore((state) => state.slug);

  return (
    <div className="cart-page__hero">
      <Link className="cart-page__back-link" href={cityBase(citySlug)}>
        <Button
          className="cart-page__back"
          tone="muted"
          size="sm"
          range="expanded"
          leadingIcon={<ArrowBackRoundedIcon />}
        >
          Назад
        </Button>
      </Link>
      <div className="cart-page__hero-copy">
        <h1 className="cart-page__title">Оформить заказ</h1>
        <p className="cart-page__subtitle">
          Корзина, условия заказа и итог на одной странице.
        </p>
      </div>
    </div>
  );
}

export function CartPage() {
  const compactMedia = useMediaQuery(
    `(max-width: ${BREAKPOINTS.compactMax}px)`,
    {
      noSsr: true,
    }
  );
  const [hydrated, setHydrated] = useState(false);
  const compact = hydrated ? compactMedia : false;
  const citySlug = useCityStore((state) => state.slug);
  const cityLabel = useCityStore((state) => state.labelRu);
  const closeBasket = useHeaderStore((state) => state.setActiveBasket);
  const openAuthModal = useHeaderStore((state) => state.setActiveModalAuth);
  const openCityModal = useHeaderStore((state) => state.setActiveModalCity);
  const items = useCartStore((state) => state.itemsOffDops);
  const dopListCart = useCartStore((state) => state.dopListCart);
  const cartIntroKind = useCartStore((state) => state.cartIntroKind);
  const checkPromo = useCartStore((state) => state.checkPromo);
  const allPrice = useCartStore((state) => state.allPrice);
  const allPriceWithoutPromo = useCartStore(
    (state) => state.allPriceWithoutPromo
  );
  const itemsCount = useCartStore((state) => state.itemsCount);
  const allItems = useCartStore((state) => state.allItems);
  const setCount = useCartStore((state) => state.setCount);
  const checkout = useCartCheckoutDraft(citySlug, cityLabel);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectorModal, setSelectorModal] = useState<
    null | 'payment' | 'pickupPoint' | 'deliveryTime'
  >(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    closeBasket(false);
  }, [closeBasket]);

  const totalLabel = formatCartLabel(
    items,
    dopListCart,
    checkPromo,
    allPrice,
    allPriceWithoutPromo
  );

  const summaryTitle = useMemo(
    () => formatCartTotalLine(itemsCount),
    [itemsCount]
  );
  const pickupPointOptions = useMemo(
    () => [
      {
        value: '',
        label: checkout.pickupLoading ? 'Загружаем кафе...' : 'Выберите кафе',
        disabled: checkout.pickupLoading,
      },
      ...checkout.pickupPoints.map((point) => ({
        value: point.id,
        label: point.label,
      })),
    ],
    [checkout.pickupLoading, checkout.pickupPoints]
  );
  const scheduleModeOptions = useMemo(
    () => [
      { value: 'asap', label: 'В ближайшее время' },
      { value: 'planned', label: 'Запланировать' },
    ],
    []
  );
  const paymentOptions = useMemo(
    () => [
      { value: '', label: 'Способ оплаты' },
      ...checkout.paymentOptions.map((option) => ({
        value: option.id,
        label: option.label,
      })),
    ],
    [checkout.paymentOptions]
  );
  const timeOptions = useMemo(
    () => [
      {
        value: '',
        label: checkout.timeLoading ? 'Загружаем время...' : 'Выберите время',
        disabled: checkout.timeLoading,
      },
      ...checkout.timeOptions.map((option) => ({
        value: option.id,
        label: option.label,
      })),
    ],
    [checkout.timeLoading, checkout.timeOptions]
  );
  const allowedScheduleDates = useMemo(
    () => new Set(checkout.dateOptions.map((option) => option.id)),
    [checkout.dateOptions]
  );
  const savedAddressOptions = useMemo(
    () =>
      checkout.savedAddresses.map((address) => ({
        value: address.id,
        label: address.title || address.name || address.label,
      })),
    [checkout.savedAddresses]
  );
  const selectedPaymentLabel =
    paymentOptions.find((option) => option.value === checkout.paymentId)
      ?.label ?? 'Способ оплаты';
  const pickupPointModalOptions = useMemo(
    () =>
      checkout.pickupPoints.map((point) => ({
        value: point.id,
        label: point.label,
      })),
    [checkout.pickupPoints]
  );
  const deliveryTimeModalOptions = useMemo(
    () => [{ value: 'asap', label: 'В ближайшее время' }],
    []
  );
  const commentFieldLabel =
    checkout.orderType === 'delivery'
      ? 'Сообщение курьеру'
      : 'Комментарий к заказу';
  const commentPlaceholder =
    checkout.orderType === 'delivery'
      ? 'Код домофона, этаж, ориентир'
      : 'Комментарий для кухни или кассы';
  const commentTriggerValue = checkout.comment.trim() || commentFieldLabel;
  const compactAddressValue = compactAddressFieldValue(
    checkout.selectedDeliveryAddress
  );
  const compactAddressUsesTitle = Boolean(
    checkout.selectedDeliveryAddress?.title?.trim().length
  );

  function openAddressSelector() {
    if (checkout.isAddressAuthRequired) {
      openAuthModal(true);
      return;
    }

    setAddressModalOpen(true);
  }

  function closeSelectorModal() {
    setSelectorModal(null);
  }

  return (
    <div className="cart-page">
      <div className="cart-page__layout">
        <section className="cart-page__main">
          <section className="cart-page__section cart-page__section--controls">
            <div
              className="cart-page__order-type"
              role="tablist"
              aria-label="Тип заказа"
            >
              <button
                className={
                  'cart-page__order-tab' +
                  (checkout.orderType === 'delivery'
                    ? ' cart-page__order-tab--active'
                    : '')
                }
                type="button"
                onClick={() => checkout.setOrderType('delivery')}
              >
                Доставка
              </button>
              <button
                className={
                  'cart-page__order-tab' +
                  (checkout.orderType === 'pickup'
                    ? ' cart-page__order-tab--active'
                    : '')
                }
                type="button"
                onClick={() => checkout.setOrderType('pickup')}
              >
                Самовывоз
              </button>
            </div>

            <div className="cart-page__fields">
              <button
                className="cart-page__field cart-page__field--action cart-page__field--readonly"
                type="button"
                onClick={() => openCityModal(true)}
              >
                {compact ? null : (
                  <span className="cart-page__field-label">Город</span>
                )}
                <span className="cart-page__field-main">
                  <span className="cart-page__field-icon">
                    <PlaceOutlinedIcon />
                  </span>
                  <span className="cart-page__field-copy">
                    <span className="cart-page__field-value cart-page__field-value--strong">
                      {cityLabel}
                    </span>
                    {compact ? null : (
                      <span className="cart-page__field-note">
                        Выбрать другой город
                      </span>
                    )}
                  </span>
                  <span className="cart-page__field-chevron" aria-hidden="true">
                    <KeyboardArrowDownRoundedIcon />
                  </span>
                </span>
              </button>

              {checkout.orderType === 'delivery' ? (
                checkout.isAddressAuthRequired ? (
                  <CartFieldTrigger
                    label={compact ? undefined : 'Адрес доставки'}
                    icon={<HomeOutlinedIcon />}
                    value="Выберите адрес"
                    placeholder
                    onClick={() => openAuthModal(true)}
                  />
                ) : checkout.savedAddresses.length > 0 ? (
                  compact ? (
                    <CartFieldTrigger
                      label={undefined}
                      icon={<HomeOutlinedIcon />}
                      value={compactAddressValue}
                      valueClassName={
                        compactAddressUsesTitle
                          ? 'cart-page__field-value--address-title'
                          : undefined
                      }
                      placeholder={!checkout.selectedDeliveryAddress}
                      onClick={openAddressSelector}
                    />
                  ) : (
                    <label className="cart-page__field cart-page__field--stacked">
                      <span className="cart-page__field-label">
                        Адрес доставки
                      </span>
                      {clientOnlyControl(
                        <MuiSelectField
                          id="cart-delivery-address"
                          name="deliveryAddress"
                          className="cart-page__control-field"
                          range="responsive"
                          surface="plain"
                          startAdornment={<HomeOutlinedIcon />}
                          value={checkout.selectedAddressId}
                          options={[
                            {
                              value: '',
                              label: checkout.savedAddressesLoading
                                ? 'Загружаем адреса...'
                                : 'Выберите адрес',
                              disabled: checkout.savedAddressesLoading,
                            },
                            ...savedAddressOptions,
                          ]}
                          onChange={(event) =>
                            checkout.selectAddress(event.target.value)
                          }
                        />
                      )}
                      <span className="cart-page__field-note">
                        {checkout.selectedDeliveryAddress?.note ||
                          'Адреса доставки из профиля'}
                      </span>
                    </label>
                  )
                ) : (
                  <CartFieldTrigger
                    label={compact ? undefined : 'Адрес доставки'}
                    icon={<HomeOutlinedIcon />}
                    value="Выберите адрес"
                    placeholder
                    onClick={openAddressSelector}
                  />
                )
              ) : compact ? (
                <CartFieldTrigger
                  icon={<StorefrontOutlinedIcon />}
                  value={checkout.selectedPickupPoint?.label || 'Выберите кафе'}
                  valueClassName="cart-page__field-value--semibold"
                  placeholder={!checkout.selectedPickupPoint}
                  onClick={() => setSelectorModal('pickupPoint')}
                />
              ) : (
                <label className="cart-page__field cart-page__field--stacked">
                  <span className="cart-page__field-label">Кафе</span>
                  {clientOnlyControl(
                    <MuiSelectField
                      id="cart-pickup-point"
                      name="pickupPoint"
                      className="cart-page__control-field"
                      range="responsive"
                      surface="plain"
                      startAdornment={<StorefrontOutlinedIcon />}
                      value={checkout.pickupPointId}
                      options={pickupPointOptions}
                      onChange={(event) =>
                        checkout.setPickupPointId(event.target.value)
                      }
                    />
                  )}
                </label>
              )}

              <div className="cart-page__field cart-page__field--stacked">
                {compact ? null : (
                  <span className="cart-page__field-label">Время</span>
                )}
                {checkout.orderType === 'delivery' ? (
                  compact ? (
                    <button
                      className="cart-page__field-main cart-page__field-main--action"
                      type="button"
                      onClick={() => setSelectorModal('deliveryTime')}
                    >
                      <span className="cart-page__field-icon">
                        <AccessTimeOutlinedIcon />
                      </span>
                      <span className="cart-page__field-copy">
                        <span className="cart-page__field-value cart-page__field-value--strong">
                          В ближайшее время
                        </span>
                      </span>
                      <span
                        className="cart-page__field-chevron"
                        aria-hidden="true"
                      >
                        <KeyboardArrowDownRoundedIcon />
                      </span>
                    </button>
                  ) : (
                    <span className="cart-page__field-main">
                      <span className="cart-page__field-icon">
                        <AccessTimeOutlinedIcon />
                      </span>
                      <span className="cart-page__field-value cart-page__field-value--strong">
                        В ближайшее время
                      </span>
                    </span>
                  )
                ) : (
                  <div className="cart-page__field-stack">
                    {clientOnlyControl(
                      <MuiSelectField
                        id="cart-schedule-mode"
                        name="scheduleMode"
                        className="cart-page__control-field"
                        range="responsive"
                        surface="plain"
                        startAdornment={<ScheduleRoundedIcon />}
                        value={checkout.scheduleMode}
                        options={scheduleModeOptions}
                        onChange={(event) =>
                          checkout.setScheduleMode(
                            event.target.value === 'planned'
                              ? 'planned'
                              : 'asap'
                          )
                        }
                      />
                    )}
                    {checkout.scheduleMode === 'planned' ? (
                      <div className="cart-page__time-grid">
                        {clientOnlyControl(
                          <MuiDatePickerField
                            className="cart-page__control-field"
                            range="responsive"
                            surface="plain"
                            startAdornment={<AccessTimeOutlinedIcon />}
                            value={checkout.selectedScheduleDate}
                            onChange={(value) =>
                              checkout.setScheduleDateValue(value)
                            }
                            disabled={
                              !checkout.dateOptions.length ||
                              checkout.timeLoading
                            }
                            shouldDisableDate={(value) => {
                              const key = format(value, 'yyyy-MM-dd');
                              return !allowedScheduleDates.has(key);
                            }}
                            format="dd.MM.yyyy"
                            slotProps={{
                              textField: {
                                id: 'cart-schedule-date',
                                name: 'scheduleDate',
                              },
                            }}
                          />
                        )}
                        {clientOnlyControl(
                          <MuiSelectField
                            id="cart-schedule-time"
                            name="scheduleTime"
                            className="cart-page__control-field"
                            range="responsive"
                            surface="plain"
                            startAdornment={<ScheduleRoundedIcon />}
                            value={checkout.scheduleTimeId}
                            options={timeOptions}
                            onChange={(event) =>
                              checkout.setScheduleTimeId(event.target.value)
                            }
                            disabled={!checkout.timeOptions.length}
                          />
                        )}
                      </div>
                    ) : null}
                    {!checkout.pickupPointId ? (
                      <span className="cart-page__field-note">
                        Сначала выберите кафе.
                      </span>
                    ) : null}
                  </div>
                )}
              </div>

              {compact ? (
                <div className="cart-page__field cart-page__field--stacked">
                  <button
                    className="cart-page__field-main cart-page__field-main--action"
                    type="button"
                    onClick={() => setSelectorModal('payment')}
                  >
                    <span className="cart-page__field-icon">
                      <CreditCardOutlinedIcon />
                    </span>
                    <span className="cart-page__field-copy">
                      <span
                        className={
                          'cart-page__field-value cart-page__field-value--semibold' +
                          (!checkout.paymentId.length
                            ? ' cart-page__field-value--placeholder'
                            : '')
                        }
                      >
                        {selectedPaymentLabel}
                      </span>
                    </span>
                    <span
                      className="cart-page__field-chevron"
                      aria-hidden="true"
                    >
                      <KeyboardArrowDownRoundedIcon />
                    </span>
                  </button>
                </div>
              ) : (
                <label className="cart-page__field cart-page__field--stacked">
                  <span className="cart-page__field-label">Оплата</span>
                  {clientOnlyControl(
                    <MuiSelectField
                      id="cart-payment"
                      name="paymentMethod"
                      className="cart-page__control-field"
                      range="responsive"
                      surface="plain"
                      startAdornment={<CreditCardOutlinedIcon />}
                      value={checkout.paymentId}
                      options={paymentOptions}
                      onChange={(event) =>
                        checkout.setPaymentId(event.target.value)
                      }
                    />
                  )}
                </label>
              )}

              {checkout.orderType === 'delivery' || !compact ? (
                <div className="cart-page__field cart-page__field--stacked">
                  {compact ? null : (
                    <span className="cart-page__field-label">
                      {commentFieldLabel}
                    </span>
                  )}
                  {compact ? (
                    <button
                      className="cart-page__field-main cart-page__field-main--action"
                      type="button"
                      onClick={() => {
                        if (checkout.isAddressAuthRequired) {
                          openAuthModal(true);
                          return;
                        }

                        setCommentModalOpen(true);
                      }}
                    >
                      <span className="cart-page__field-icon">
                        {checkout.orderType === 'delivery' ? (
                          <ChatOutlinedIcon />
                        ) : (
                          <ApartmentRoundedIcon />
                        )}
                      </span>
                      <span className="cart-page__field-copy">
                        <span
                          className={
                            'cart-page__field-value' +
                            ' cart-page__field-value--semibold' +
                            (checkout.comment.trim().length
                              ? ''
                              : ' cart-page__field-value--placeholder')
                          }
                        >
                          {commentTriggerValue}
                        </span>
                      </span>
                      <span
                        className="cart-page__field-chevron"
                        aria-hidden="true"
                      >
                        <KeyboardArrowDownRoundedIcon />
                      </span>
                    </button>
                  ) : (
                    clientOnlyControl(
                      <MuiTextField
                        id="cart-comment"
                        name="comment"
                        className="cart-page__control-field"
                        range="responsive"
                        surface="plain"
                        startAdornment={
                          checkout.orderType === 'delivery' ? (
                            <ChatOutlinedIcon />
                          ) : (
                            <ApartmentRoundedIcon />
                          )
                        }
                        value={checkout.comment}
                        onChange={(event) =>
                          checkout.setComment(event.target.value)
                        }
                        placeholder={commentPlaceholder}
                      />
                    )
                  )}
                </div>
              ) : null}
            </div>
          </section>

          <Accordion className="cart-page__notice" disableGutters elevation={0}>
            <AccordionSummary
              className="cart-page__notice-summary"
              expandIcon={<ExpandMoreIcon />}
            >
              Об аллергенах
            </AccordionSummary>
            <AccordionDetails className="cart-page__notice-details">
              {allergyText}
            </AccordionDetails>
          </Accordion>

          <section className="cart-page__section cart-page__section--items">
            {items.length === 0 ? (
              <div className="cart-page__empty">
                <h2>Корзина пуста</h2>
                <p>Добавьте блюда из меню, и здесь появится состав заказа.</p>
                <Link
                  className="ui-button ui-button--tone-primary ui-button--size-lg ui-button--range-regular cart-page__empty-action"
                  href={cityBase(citySlug)}
                >
                  <span className="ui-button__label">Перейти в меню</span>
                </Link>
              </div>
            ) : (
              <div className="cart-page__item-list">
                {items.map((line, index) => {
                  const id = lineId(line);
                  const count = Number(line.count ?? 0);
                  const image = lineImage(line);
                  const catalogItem = allItems.find(
                    (item) => String(item.id) === id
                  );
                  const price = Number(
                    line.one_price ?? catalogItem?.price ?? 0
                  );

                  return (
                    <article className="cart-page__item" key={id + '-' + index}>
                      {image ? (
                        <img
                          className="cart-page__item-image"
                          src={image}
                          alt=""
                        />
                      ) : null}
                      <div className="cart-page__item-copy">
                        <h2>{lineTitle(line, catalogItem)}</h2>
                        <Price value={price * count} size="sm" />
                      </div>
                      <QuantityControl
                        className="cart-page__item-quantity"
                        value={count}
                        size="xs"
                        onChange={(value) =>
                          setCount(id, value, Number(line?.cat_id))
                        }
                      />
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {dopListCart.length ? (
            <section className="cart-page__section cart-page__section--extras">
              <header className="cart-page__section-header">
                <h2>{getCartExtrasIntroText(cartIntroKind)}</h2>
              </header>
              <div className="cart-page__extra-list">
                {dopListCart.map((line, index) => {
                  const id = lineId(line);
                  const count = Number(line.count ?? 0);
                  const price = Number(line.one_price ?? line.price ?? 0);
                  const image = lineImage(line);

                  return (
                    <article
                      className="cart-page__extra"
                      key={id + '-' + index}
                    >
                      {image ? (
                        <img
                          className="cart-page__extra-image"
                          src={image}
                          alt=""
                        />
                      ) : null}
                      <div className="cart-page__extra-copy">
                        <h3>{lineTitle(line)}</h3>
                        <Price value={price} size="sm" />
                      </div>
                      <QuantityControl
                        className="cart-page__item-quantity"
                        value={count}
                        size="xs"
                        onChange={(value) =>
                          setCount(id, value, Number(line?.cat_id))
                        }
                      />
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
        </section>

        <aside className="cart-page__summary">
          <div className="cart-page__summary-card">
            <div className="cart-page__summary-row">
              <span>Доставка</span>
              <strong>0 ₽</strong>
            </div>
            <div className="cart-page__summary-row cart-page__summary-row--total">
              <span>{summaryTitle}</span>
              <strong>{items.length > 0 ? totalLabel : '0 ₽'}</strong>
            </div>
            <label className="cart-page__promo">
              <span className="cart-page__promo-label">Промокод</span>
              <div className="cart-page__promo-row">
                {clientOnlyControl(
                  <MuiTextField
                    id="cart-promo-code"
                    name="promoCode"
                    className="cart-page__promo-input"
                    range="responsive"
                    surface="outlined"
                    placeholder="Есть промокод"
                    value={checkout.promoCode}
                    onChange={(event) =>
                      checkout.setPromoCode(event.target.value)
                    }
                  />,
                  'cart-page__control-placeholder cart-page__control-placeholder--promo'
                )}
                <Button
                  className="cart-page__promo-button"
                  tone="neutral"
                  size="xs"
                  range="regular"
                  onClick={checkout.applyPromo}
                >
                  Применить
                </Button>
              </div>
            </label>
            {checkout.promoStatus ? (
              <p
                className={
                  'cart-page__status cart-page__status--' +
                  checkout.promoStatus.tone
                }
              >
                {checkout.promoStatus.text}
              </p>
            ) : null}
            <p className="cart-page__summary-note">
              Указано ориентировочное время приготовления и доставки. При
              высокой нагрузке время может увеличиться.
            </p>
            {checkout.submitStatus ? (
              <p
                className={
                  'cart-page__status cart-page__status--' +
                  checkout.submitStatus.tone
                }
              >
                {checkout.submitStatus.text}
              </p>
            ) : null}
            <Button
              className="cart-page__submit"
              tone="primary"
              size="lg"
              range="regular"
              fullWidth
              onClick={checkout.reviewOrder}
              disabled={items.length === 0}
            >
              Проверить заказ
            </Button>
          </div>
        </aside>
      </div>

      <CartAddressModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        citySlug={citySlug}
        addresses={checkout.savedAddresses}
        selectedAddressId={checkout.selectedAddressId}
        loading={checkout.savedAddressesLoading}
        onSelect={checkout.selectAddress}
      />
      <CartCommentModal
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        title={commentFieldLabel}
        placeholder={commentPlaceholder}
        value={checkout.comment}
        onChange={checkout.setComment}
      />
      <CartSelectorModal
        open={selectorModal === 'payment'}
        onClose={closeSelectorModal}
        title="Способ оплаты"
        options={paymentOptions}
        selectedValue={checkout.paymentId}
        onSelect={checkout.setPaymentId}
      />
      <CartSelectorModal
        open={selectorModal === 'pickupPoint'}
        onClose={closeSelectorModal}
        title="Выберите кафе"
        options={pickupPointModalOptions}
        selectedValue={checkout.pickupPointId}
        onSelect={checkout.setPickupPointId}
      />
      <CartSelectorModal
        open={selectorModal === 'deliveryTime'}
        onClose={closeSelectorModal}
        title="Дата и время"
        options={deliveryTimeModalOptions}
        selectedValue="asap"
        onSelect={() => undefined}
      />
    </div>
  );
}
