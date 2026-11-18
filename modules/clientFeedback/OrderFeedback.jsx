import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { FeedbackDialog } from './FeedbackExperience';
import { useClientFeedback } from './useClientFeedback';
import dialogStyles from './FeedbackExperience.module.scss';
import styles from './OrderFeedback.module.scss';

/**
 * «Оценить заказ» в карточке завершённого заказа.
 *
 * Показывается, только если бэк сайта вернул `order.feedback.available`
 * (включено в Шефе: «Формы отзывов» → «Оценка заказов клиентами» → «Сайт»).
 * Сценарий по макету: кнопка → «Вам понравился заказ?» → форма с уже
 * выбранной оценкой → «Спасибо за отзыв!». После отправки кнопка становится
 * «Моя оценка заказа».
 *
 * Оверлеи выносятся порталом в body: мобильная модалка заказа — это
 * SwipeableDrawer со сдвигом через transform и свайпами. Чтобы поле комментария
 * получало фокус, у модалок заказа выключен `disableEnforceFocus`. События из
 * портала всплывают по дереву React, поэтому Escape перехватывается здесь и не
 * закрывает саму модалку заказа.
 */

const STEP_CLOSED = 'closed';
const STEP_INTRO = 'intro';
const STEP_FORM = 'form';
const STEP_DONE = 'done';

function orderSubtitle(order) {
  const typeOrder = Number(order?.type_order_ ?? order?.type_order);
  const when = order?.date_time_order_new
    ? ` ${order.date_time_order_new}`
    : '';
  if (typeOrder === 1) return `Доставлен курьером${when}`;
  if (typeOrder === 2) return `Получен в кафе${when}`;
  return `Заказ выполнен${when}`;
}

function Sheet({ children, onClose, labelledBy }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  return (
    <div
      className={dialogStyles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby={labelledBy}
        aria-modal="true"
        className={`${dialogStyles.dialog} ${styles.sheet}`}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className={dialogStyles.grabber} aria-hidden="true">
          <span />
        </div>
        <button
          aria-label="Закрыть"
          className={styles.close}
          onClick={onClose}
          type="button"
        >
          ×
        </button>
        {children}
      </section>
    </div>
  );
}

export default function OrderFeedback({ order }) {
  const pointId = Number(order?.point_id);
  const orderId = Number(order?.order_id);
  const available =
    Boolean(order?.feedback?.available) && pointId > 0 && orderId > 0;

  const [step, setStep] = useState(STEP_CLOSED);
  const [rating, setRating] = useState(0);
  const [submittedHere, setSubmittedHere] = useState(false);
  const { form, loading, error, submitting, success, loadForm, submit } =
    useClientFeedback({ pointId, orderId });

  const submitted =
    Boolean(order?.feedback?.submitted) ||
    submittedHere ||
    Boolean(form?.submitted);

  useEffect(() => {
    setStep(STEP_CLOSED);
    setRating(0);
    setSubmittedHere(false);
  }, [orderId, pointId]);

  useEffect(() => {
    if (success) {
      setSubmittedHere(true);
      if (step === STEP_FORM) setStep(STEP_DONE);
    }
  }, [success]);

  if (!available) return null;

  const close = () => setStep(STEP_CLOSED);

  const open = () => {
    if (submitted) {
      setStep(STEP_DONE);
      return;
    }
    setStep(STEP_INTRO);
    if (!form) loadForm();
  };

  const chooseRating = async (value) => {
    setRating(value);
    const loaded = form || (await loadForm());
    if (!loaded) return;
    setStep(loaded.submitted ? STEP_DONE : STEP_FORM);
  };

  return (
    <div
      className={styles.card}
      onKeyDown={(event) => {
        // Escape закрывает только оценку, а не всю модалку заказа.
        if (event.key === 'Escape' && step !== STEP_CLOSED) {
          event.stopPropagation();
          close();
        }
      }}
    >
      <div className={styles.cardTitle}>Заказ №{order.order_id}</div>
      <div className={styles.cardSubtitle}>{orderSubtitle(order)}</div>
      <button
        className={submitted ? styles.mineButton : styles.rateButton}
        onClick={open}
        type="button"
      >
        {submitted ? 'Моя оценка заказа' : 'Оценить заказ'}
      </button>

      {step !== STEP_CLOSED && typeof document !== 'undefined'
        ? createPortal(overlay(), document.body)
        : null}
    </div>
  );

  function overlay() {
    return (
      <>
        {step === STEP_INTRO ? (
          <Sheet labelledBy="order-feedback-intro" onClose={close}>
            <div className={styles.intro}>
              <h2 id="order-feedback-intro">Заказ №{order.order_id}</h2>
              <p className={styles.introSubtitle}>{orderSubtitle(order)}</p>
              <h3>Вам понравился заказ?</h3>
              <div
                className={styles.introStars}
                role="group"
                aria-label="Оценка заказа"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    aria-label={`${value} из 5`}
                    className={`${styles.introStar} ${value <= rating ? styles.introStarActive : ''}`}
                    disabled={loading && rating > 0}
                    key={value}
                    onClick={() => chooseRating(value)}
                    type="button"
                  >
                    <span aria-hidden="true">★</span>
                  </button>
                ))}
              </div>
              {error && !form ? (
                <div className={styles.introError} role="alert">
                  <span>{error}</span>
                  <button onClick={loadForm} type="button">
                    Повторить
                  </button>
                </div>
              ) : (
                <p className={styles.introHint}>
                  {loading && rating > 0
                    ? 'Открываем форму…'
                    : 'Поделитесь своим мнением. Это поможет нам стать лучше.'}
                </p>
              )}
            </div>
          </Sheet>
        ) : null}

        {step === STEP_FORM && form ? (
          <>
            <FeedbackDialog
              form={form}
              allowPhotos={false}
              initialRating={rating}
              onClose={close}
              onSubmit={submit}
              submitting={submitting}
            />
            {error ? (
              <div aria-live="assertive" className={dialogStyles.toast}>
                {error}
              </div>
            ) : null}
          </>
        ) : null}

        {step === STEP_DONE ? (
          <Sheet labelledBy="order-feedback-done" onClose={close}>
            <div className={styles.done}>
              <div aria-hidden="true" className={styles.doneIcon}>
                ♡
              </div>
              <h2 id="order-feedback-done">Спасибо за отзыв!</h2>
              <p>
                {submittedHere && success && !success.already_existed
                  ? 'Отправим ваш отзыв в отдел контроля качества.'
                  : 'Вы уже оценили этот заказ. Отзыв передан в отдел контроля качества.'}
              </p>
            </div>
          </Sheet>
        ) : null}
      </>
    );
  }
}
