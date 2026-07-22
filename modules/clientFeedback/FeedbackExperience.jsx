import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

import { getLocalStorageItem } from '@/utils/browserStorage';
import {
  getClientFeedbackForm,
  submitClientFeedback,
} from './clientFeedbackApi';
import { mockOrderHistory } from './mockFeedback';
import styles from './FeedbackExperience.module.scss';

const ratingLabels = ['Ужасно', 'Плохо', 'Можно лучше', 'Хорошо', 'Отлично'];

function answerKey(targetId, elementId) {
  return `${targetId}:${elementId}`;
}

function dataText(data, keys, fallback = '') {
  for (const key of keys) {
    const value = data?.[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return fallback;
}

function checkboxOptions(element) {
  return (element?.data?.checkboxes || [])
    .map((option) => {
      if (typeof option === 'string') {
        return { param: option, label: option };
      }

      return {
        param: String(option?.param || option?.value || ''),
        label: String(option?.label || option?.name || option?.param || ''),
      };
    })
    .filter((option) => option.param);
}

function StarRating({ value = 0, onChange, label }) {
  return (
    <fieldset className={styles.ratingFieldset}>
      <legend className={styles.visuallyHidden}>{label}</legend>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            aria-label={`${rating} из 5`}
            aria-pressed={rating <= value}
            className={`${styles.star} ${rating <= value ? styles.starActive : ''}`}
            key={rating}
            onClick={() => onChange(rating)}
            type="button"
          >
            <span aria-hidden="true">★</span>
          </button>
        ))}
      </div>
      <div aria-live="polite" className={styles.ratingLabel}>
        {value ? ratingLabels[value - 1] : 'Поставьте оценку'}
      </div>
    </fieldset>
  );
}

function PhotoField({ photos, onChange }) {
  const inputRef = useRef(null);

  const addPhotos = (event) => {
    const nextFiles = Array.from(event.target.files || []).slice(
      0,
      3 - photos.length
    );
    const nextPhotos = nextFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    onChange([...photos, ...nextPhotos].slice(0, 3));
    event.target.value = '';
  };

  const removePhoto = (index) => {
    URL.revokeObjectURL(photos[index].url);
    onChange(photos.filter((_, photoIndex) => photoIndex !== index));
  };

  return (
    <div className={styles.photoField}>
      <div className={styles.photoTitle}>Добавить фото</div>
      <div className={styles.photoGrid}>
        <button
          aria-label="Выбрать фотографии"
          className={styles.addPhoto}
          disabled={photos.length >= 3}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <span aria-hidden="true" className={styles.cameraIcon}>
            ◎
          </span>
          <span>{photos.length}/3</span>
        </button>
        {photos.map((photo, index) => (
          <div className={styles.photoPreview} key={photo.url}>
            <img alt={`Фото отзыва ${index + 1}`} src={photo.url} />
            <button
              aria-label={`Удалить фото ${index + 1}`}
              onClick={() => removePhoto(index)}
              type="button"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input
        accept="image/jpeg,image/png,image/webp"
        className={styles.hiddenInput}
        multiple
        onChange={addPhotos}
        ref={inputRef}
        type="file"
      />
    </div>
  );
}

function ElementField({ element, targetId, rating, value, onChange }) {
  const data = element?.data || {};

  if (element.type === 'rating') {
    return (
      <StarRating
        label="Оценка"
        onChange={onChange}
        value={Number(value) || 0}
      />
    );
  }

  if (element.type === 'heading') {
    return (
      <h3 className={styles.elementHeading}>
        {dataText(data, ['title', 'label', 'value', 'text'])}
      </h3>
    );
  }

  if (element.type === 'discount') return null;

  if (data.showWhen === 'positive' && rating > 0 && rating < 4) return null;
  if (data.showWhen === 'negative' && rating >= 4) return null;
  if (
    (element.type === 'tagCloud' || element.type === 'checkboxGroup') &&
    !rating
  )
    return null;

  if (element.type === 'tagCloud') {
    const selected = Array.isArray(value) ? value : [];
    const tags = Array.isArray(data.availableTags) ? data.availableTags : [];

    return (
      <fieldset className={styles.tagsFieldset}>
        <legend>
          {dataText(data, ['title', 'label'], 'Расскажите подробнее')}
        </legend>
        <div className={styles.tags}>
          {tags.map((tag) => {
            const isSelected = selected.includes(tag);
            return (
              <button
                aria-pressed={isSelected}
                className={`${styles.tag} ${isSelected ? styles.tagSelected : ''}`}
                key={tag}
                onClick={() =>
                  onChange(
                    isSelected
                      ? selected.filter((item) => item !== tag)
                      : [...new Set([...selected, tag])]
                  )
                }
                type="button"
              >
                {tag}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (element.type === 'checkboxGroup') {
    const selected = Array.isArray(value) ? value : [];
    return (
      <fieldset className={styles.checkboxFieldset}>
        <legend>
          {dataText(data, ['title', 'label'], 'Выберите варианты')}
        </legend>
        {checkboxOptions(element).map((option) => (
          <label className={styles.checkboxLabel} key={option.param}>
            <input
              checked={selected.includes(option.param)}
              onChange={(event) =>
                onChange(
                  event.target.checked
                    ? [...new Set([...selected, option.param])]
                    : selected.filter((item) => item !== option.param)
                )
              }
              type="checkbox"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
    );
  }

  if (element.type === 'checkbox') {
    return (
      <label className={styles.checkboxLabel}>
        <input
          checked={value === true}
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
        />
        <span>{dataText(data, ['label', 'title'], 'Да')}</span>
      </label>
    );
  }

  if (element.type === 'input' || element.type === 'textarea') {
    const label = dataText(data, ['label', 'title'], 'Ваш комментарий');
    const sharedProps = {
      'aria-label': label,
      maxLength: element.type === 'textarea' ? 5000 : 500,
      onChange: (event) => onChange(event.target.value),
      placeholder: dataText(data, ['placeholder'], 'Напишите подробнее'),
      value: typeof value === 'string' ? value : '',
    };

    return (
      <label className={styles.textField}>
        <span>{label}</span>
        {element.type === 'textarea' ? (
          <textarea {...sharedProps} rows={3} />
        ) : (
          <input {...sharedProps} type="text" />
        )}
      </label>
    );
  }

  return null;
}

function TargetCards({ targets, currentTarget, onSelect }) {
  const products = targets.filter((target) => target.target_type === 'product');
  const delivery = targets.find(
    (target) => target.target_type === 'order_type'
  );

  if (currentTarget.target_type !== 'order') {
    return (
      <div className={styles.targetPagination}>
        {targets.map((target) => (
          <button
            aria-current={
              target.target_id === currentTarget.target_id ? 'step' : undefined
            }
            className={
              target.target_id === currentTarget.target_id
                ? styles.targetDotActive
                : ''
            }
            key={target.target_id}
            onClick={() => onSelect(target.target_id)}
            type="button"
          >
            {target.target_type === 'order' ? 'Заказ' : target.name}
          </button>
        ))}
      </div>
    );
  }

  if (!products.length && !delivery) return null;

  return (
    <section className={styles.separateTargets}>
      <h3>Вы можете оценить отдельно</h3>
      <div className={styles.targetCards}>
        {products.length ? (
          <button
            className={styles.targetCard}
            onClick={() => onSelect(products[0].target_id)}
            type="button"
          >
            <span className={styles.targetCardTitle}>
              <span aria-hidden="true">☆</span> Блюда в заказе
            </span>
            <Image
              alt="Блюда в заказе"
              height={134}
              src="/feedback/dishes.png"
              width={145}
            />
          </button>
        ) : null}
        {delivery ? (
          <button
            className={styles.targetCard}
            onClick={() => onSelect(delivery.target_id)}
            type="button"
          >
            <span className={styles.targetCardTitle}>
              <span aria-hidden="true">✦</span> Доставка
            </span>
            <Image
              alt="Курьер с заказом"
              height={134}
              src="/feedback/delivery.png"
              width={145}
            />
          </button>
        ) : null}
      </div>
    </section>
  );
}

function FeedbackDialog({ form, onClose, onSubmit, submitting }) {
  const [answers, setAnswers] = useState({});
  const [photos, setPhotos] = useState({});
  const [currentTargetId, setCurrentTargetId] = useState(
    form.targets.find((target) => target.target_type === 'order')?.target_id ??
      form.targets[0]?.target_id
  );
  const panelRef = useRef(null);

  const currentTarget =
    form.targets.find((target) => target.target_id === currentTargetId) ||
    form.targets[0];

  const currentRating = currentTarget?.elements.find(
    (element) => element.type === 'rating'
  );
  const ratingValue = currentRating
    ? Number(answers[answerKey(currentTarget.target_id, currentRating.id)]) || 0
    : 0;

  const responses = useMemo(
    () =>
      form.targets.flatMap((target) =>
        target.elements.flatMap((element) => {
          if (!element.answerable) return [];
          const value = answers[answerKey(target.target_id, element.id)];
          if (typeof value === 'undefined' || value === null) return [];
          if (typeof value === 'string' && !value.trim()) return [];
          if (Array.isArray(value) && value.length === 0) return [];

          return [
            {
              target_id: target.target_id,
              element_id: element.id,
              value: typeof value === 'string' ? value.trim() : value,
            },
          ];
        })
      ),
    [answers, form.targets]
  );

  useEffect(() => {
    const previousFocus = document.activeElement;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = Array.from(
        panelRef.current?.querySelectorAll(
          'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
        ) || []
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector('button')?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);

  const selectTarget = (targetId) => {
    setCurrentTargetId(targetId);
    panelRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setElementValue = (elementId, value) => {
    setAnswers((current) => ({
      ...current,
      [answerKey(currentTarget.target_id, elementId)]: value,
    }));
  };

  const title =
    currentTarget.target_type === 'order'
      ? 'Ваша оценка'
      : currentTarget.target_type === 'order_type'
        ? 'Ваша оценка доставки'
        : currentTarget.name;

  return (
    <div
      aria-label="Форма отзыва"
      aria-modal="true"
      className={styles.backdrop}
      role="dialog"
    >
      <section className={styles.dialog} ref={panelRef} tabIndex={-1}>
        <div className={styles.grabber} aria-hidden="true">
          <span />
        </div>
        <header className={styles.dialogHeader}>
          {currentTarget.target_type !== 'order' ? (
            <button
              aria-label="Вернуться к общей оценке"
              className={styles.backButton}
              onClick={() => selectTarget(-100)}
              type="button"
            >
              ←
            </button>
          ) : (
            <span className={styles.headerSpacer} />
          )}
          <h2>{title}</h2>
          <button
            aria-label="Закрыть форму"
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        {currentTarget.target_type === 'product' ? (
          <div className={styles.productHero}>
            <Image
              alt={currentTarget.name}
              height={112}
              src={currentTarget.image || '/feedback/dishes.png'}
              width={112}
            />
          </div>
        ) : null}

        <div className={styles.formBody}>
          {currentTarget.elements.map((element) => (
            <ElementField
              element={element}
              key={element.id}
              onChange={(value) => setElementValue(element.id, value)}
              rating={ratingValue}
              targetId={currentTarget.target_id}
              value={answers[answerKey(currentTarget.target_id, element.id)]}
            />
          ))}

          {ratingValue ? (
            <PhotoField
              onChange={(value) =>
                setPhotos((current) => ({
                  ...current,
                  [currentTarget.target_id]: value,
                }))
              }
              photos={photos[currentTarget.target_id] || []}
            />
          ) : null}

          <TargetCards
            currentTarget={currentTarget}
            onSelect={selectTarget}
            targets={form.targets}
          />
        </div>

        <footer className={styles.dialogFooter}>
          <button
            className={styles.submitButton}
            disabled={!responses.length || submitting}
            onClick={() => onSubmit(responses)}
            type="button"
          >
            {submitting ? 'Отправляем…' : 'Отправить'}
          </button>
        </footer>
      </section>
    </div>
  );
}

function OrderHistoryBackground({ onOpen, orderId }) {
  return (
    <main className={styles.page}>
      <header className={styles.siteHeader}>
        <Image
          alt="Жако"
          height={44}
          priority
          src="/Jaco-Logo-PC.png"
          width={120}
        />
        <nav aria-label="Основная навигация">
          <span>Пицца</span>
          <span>Роллы</span>
          <span>Блюда</span>
          <span>Акции</span>
        </nav>
        <span className={styles.city}>Тольятти</span>
      </header>
      <div className={styles.mobileHeader}>
        <Image
          alt="Жако"
          height={36}
          priority
          src="/jaco-logo-mobile.png"
          width={112}
        />
        <span aria-hidden="true">☰</span>
      </div>
      <div className={styles.historyLayout}>
        <section className={styles.historyContent}>
          <h1>История заказов</h1>
          <div className={styles.historyTabs}>
            <span className={styles.activeTab}>Активные заказы</span>
            <span>Последние 3 месяца</span>
            <span>Архив</span>
          </div>
          <div className={styles.orders}>
            {mockOrderHistory.map((order, index) => {
              const visibleOrder =
                index === 0 ? { ...order, order_id: orderId } : order;
              return (
                <article className={styles.orderCard} key={order.order_id}>
                  <div>
                    <h2>Заказ №{visibleOrder.order_id}</h2>
                    <p>{visibleOrder.status}</p>
                    <div className={styles.miniStars}>
                      {visibleOrder.rating ? '★★★★★' : '☆☆☆☆☆'}
                    </div>
                  </div>
                  <strong>{visibleOrder.total}</strong>
                  {index === 0 ? (
                    <button onClick={onOpen} type="button">
                      Оценить заказ
                    </button>
                  ) : (
                    <span className={styles.doneLabel}>Отзыв отправлен</span>
                  )}
                </article>
              );
            })}
          </div>
        </section>
        <aside className={styles.profileMenu}>
          <h2>Личные данные</h2>
          <strong>История заказов</strong>
          <span>Любимые блюда</span>
          <span>Личные данные</span>
          <span>Мои адреса</span>
        </aside>
      </div>
    </main>
  );
}

export default function FeedbackExperience({ orderId, pointId, useMocks }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const loadForm = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getClientFeedbackForm({
        pointId,
        orderId,
        token: getLocalStorageItem('token') || '',
        useMocks,
      });
      if (!Array.isArray(result.targets) || result.targets.length === 0) {
        throw new Error('Для этого заказа пока нет активной формы отзыва');
      }
      setForm(result);
      setSuccess(result.submitted ? { already_existed: true } : null);
    } catch (requestError) {
      setError(requestError.message || 'Не удалось загрузить форму');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForm();
  }, [orderId, pointId, useMocks]);

  const submit = async (responses) => {
    setSubmitting(true);
    setError('');
    try {
      const result = await submitClientFeedback({
        pointId,
        orderId,
        responses,
        token: getLocalStorageItem('token') || '',
        useMocks,
      });
      setSuccess(result);
    } catch (requestError) {
      setError(requestError.message || 'Не удалось отправить отзыв');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <OrderHistoryBackground
        onOpen={() => setIsOpen(true)}
        orderId={orderId}
      />
      {isOpen && loading ? (
        <div aria-live="polite" className={styles.stateBackdrop}>
          <div className={styles.stateCard}>Загружаем форму…</div>
        </div>
      ) : null}
      {isOpen && error && !form ? (
        <div className={styles.stateBackdrop}>
          <div className={styles.stateCard}>
            <h2>Не удалось открыть отзыв</h2>
            <p>{error}</p>
            <button onClick={loadForm} type="button">
              Попробовать снова
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Закрыть
            </button>
          </div>
        </div>
      ) : null}
      {isOpen && success ? (
        <div className={styles.stateBackdrop}>
          <div className={styles.stateCard}>
            <div aria-hidden="true" className={styles.successIcon}>
              ♧
            </div>
            <h2>Спасибо за отзыв!</h2>
            <p>
              {success.already_existed
                ? 'Ваш отзыв уже был отправлен.'
                : 'Скоро станем ещё лучше благодаря вам.'}
            </p>
            <button onClick={() => setIsOpen(false)} type="button">
              Закрыть
            </button>
          </div>
        </div>
      ) : null}
      {isOpen && form && !success ? (
        <FeedbackDialog
          form={form}
          onClose={() => setIsOpen(false)}
          onSubmit={submit}
          submitting={submitting}
        />
      ) : null}
      {error && form ? (
        <div aria-live="assertive" className={styles.toast}>
          {error}
        </div>
      ) : null}
    </>
  );
}
