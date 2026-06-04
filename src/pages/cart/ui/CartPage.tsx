'use client';

import { useEffect, useMemo, type ReactNode } from 'react';
import { format } from 'date-fns';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import NoSsr from '@mui/material/NoSsr';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
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
import { PreviewPageFrame } from '@src/widgets/layout';
import {
  Button,
  MuiAutocompleteField,
  MuiDatePickerField,
  MuiSelectField,
  MuiTextField,
  Price,
  QuantityControl,
} from '@src/shared/ui';
import { useCartCheckoutDraft } from '../model/useCartCheckoutDraft';
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

export function CartPage() {
  const compact = useMediaQuery(`(max-width: ${BREAKPOINTS.compactMax}px)`, {
    noSsr: true,
  });
  const regular = useMediaQuery(
    `(min-width: ${BREAKPOINTS.regularMin}px) and (max-width: ${BREAKPOINTS.regularMax}px)`,
    { noSsr: true }
  );
  const citySlug = useCityStore((state) => state.slug);
  const cityLabel = useCityStore((state) => state.labelRu);
  const closeBasket = useHeaderStore((state) => state.setActiveBasket);
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
  const fieldRange = compact ? 'compact' : regular ? 'regular' : 'expanded';
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
    () =>
      checkout.paymentOptions.map((option) => ({
        value: option.id,
        label: option.label,
      })),
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

  return (
    <PreviewPageFrame
      className="cart-page"
      intro={
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
      }
    >
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
              <div className="cart-page__field cart-page__field--readonly">
                <span className="cart-page__field-label">Город</span>
                <span className="cart-page__field-main">
                  <span className="cart-page__field-icon">
                    <PlaceOutlinedIcon />
                  </span>
                  <span className="cart-page__field-value">{cityLabel}</span>
                </span>
              </div>

              {checkout.orderType === 'delivery' ? (
                <label className="cart-page__field cart-page__field--stacked">
                  <span className="cart-page__field-label">Адрес доставки</span>
                  <span className="cart-page__field-main">
                    <span className="cart-page__field-icon">
                      <PlaceOutlinedIcon />
                    </span>
                    {clientOnlyControl(
                      <MuiAutocompleteField
                        id="cart-delivery-address"
                        name="deliveryAddress"
                        className="cart-page__autocomplete"
                        textFieldClassName="cart-page__control-field"
                        range={fieldRange}
                        freeSolo
                        value={null}
                        inputValue={checkout.addressQuery}
                        onInputChange={(_, value, reason) => {
                          if (reason === 'input' || reason === 'clear') {
                            checkout.changeAddressQuery(value);
                          }
                        }}
                        onChange={(_, value) => {
                          if (typeof value === 'string') {
                            checkout.selectAddress(value);
                            return;
                          }

                          if (value) {
                            checkout.selectAddress(value.value);
                          }
                        }}
                        options={checkout.addressSuggestions}
                        getOptionLabel={(option) =>
                          typeof option === 'string' ? option : option.value
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        filterOptions={(options) => options}
                        loading={checkout.addressLoading}
                        placeholder="Улица, дом, подъезд"
                        noOptionsText={
                          checkout.addressQuery.trim().length < 3
                            ? 'Начните вводить адрес'
                            : 'Совпадений не найдено'
                        }
                        loadingText="Ищем адрес..."
                        renderOption={(props, option) => (
                          <li {...props} key={option.value}>
                            <div className="cart-page__autocomplete-option">
                              <span>{option.value}</span>
                              {option.subtitle ? (
                                <small>{option.subtitle}</small>
                              ) : null}
                            </div>
                          </li>
                        )}
                      />
                    )}
                  </span>
                  {checkout.addressLoading ? (
                    <span className="cart-page__field-note">Ищем адрес...</span>
                  ) : null}
                </label>
              ) : (
                <label className="cart-page__field cart-page__field--stacked">
                  <span className="cart-page__field-label">Кафе</span>
                  <span className="cart-page__field-main">
                    <span className="cart-page__field-icon">
                      <StorefrontOutlinedIcon />
                    </span>
                    {clientOnlyControl(
                      <MuiSelectField
                        id="cart-pickup-point"
                        name="pickupPoint"
                        className="cart-page__control-field"
                        range={fieldRange}
                        value={checkout.pickupPointId}
                        options={pickupPointOptions}
                        onChange={(event) =>
                          checkout.setPickupPointId(event.target.value)
                        }
                      />
                    )}
                  </span>
                </label>
              )}

              <div className="cart-page__field cart-page__field--stacked">
                <span className="cart-page__field-label">Время</span>
                {checkout.orderType === 'delivery' ? (
                  <span className="cart-page__field-main">
                    <span className="cart-page__field-icon">
                      <AccessTimeOutlinedIcon />
                    </span>
                    <span className="cart-page__field-value">
                      В ближайшее время
                    </span>
                  </span>
                ) : (
                  <div className="cart-page__field-stack">
                    <span className="cart-page__field-main">
                      <span className="cart-page__field-icon">
                        <ScheduleRoundedIcon />
                      </span>
                      {clientOnlyControl(
                        <MuiSelectField
                          id="cart-schedule-mode"
                          name="scheduleMode"
                          className="cart-page__control-field"
                          range={fieldRange}
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
                    </span>
                    {checkout.scheduleMode === 'planned' ? (
                      <div className="cart-page__time-grid">
                        {clientOnlyControl(
                          <MuiDatePickerField
                            className="cart-page__control-field"
                            range={fieldRange}
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
                            range={fieldRange}
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

              <label className="cart-page__field cart-page__field--stacked">
                <span className="cart-page__field-label">Оплата</span>
                <span className="cart-page__field-main">
                  <span className="cart-page__field-icon">
                    <CreditCardOutlinedIcon />
                  </span>
                  {clientOnlyControl(
                    <MuiSelectField
                      id="cart-payment"
                      name="paymentMethod"
                      className="cart-page__control-field"
                      range={fieldRange}
                      value={checkout.paymentId}
                      options={paymentOptions}
                      onChange={(event) =>
                        checkout.setPaymentId(event.target.value)
                      }
                    />
                  )}
                </span>
              </label>

              <label className="cart-page__field cart-page__field--textarea">
                <span className="cart-page__field-label">
                  {checkout.orderType === 'delivery'
                    ? 'Сообщение курьеру'
                    : 'Комментарий к заказу'}
                </span>
                <span className="cart-page__field-main cart-page__field-main--textarea">
                  <span className="cart-page__field-icon">
                    {checkout.orderType === 'delivery' ? (
                      <ChatOutlinedIcon />
                    ) : (
                      <ApartmentRoundedIcon />
                    )}
                  </span>
                  {clientOnlyControl(
                    <MuiTextField
                      id="cart-comment"
                      name="comment"
                      className="cart-page__control-field cart-page__control-field--textarea"
                      range={fieldRange}
                      value={checkout.comment}
                      onChange={(event) =>
                        checkout.setComment(event.target.value)
                      }
                      multiline
                      minRows={3}
                      placeholder={
                        checkout.orderType === 'delivery'
                          ? 'Код домофона, этаж, ориентир'
                          : 'Комментарий для кухни или кассы'
                      }
                    />,
                    'cart-page__control-placeholder cart-page__control-placeholder--textarea'
                  )}
                </span>
              </label>
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
                    range={fieldRange}
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
    </PreviewPageFrame>
  );
}
