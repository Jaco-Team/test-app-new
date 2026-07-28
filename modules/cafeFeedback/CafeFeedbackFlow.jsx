import { useCallback, useEffect, useRef, useState } from 'react';
import AirRoundedIcon from '@mui/icons-material/AirRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import CleaningServicesRoundedIcon from '@mui/icons-material/CleaningServicesRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import PlumbingRoundedIcon from '@mui/icons-material/PlumbingRounded';
import SoapRoundedIcon from '@mui/icons-material/SoapRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import WaterDamageRoundedIcon from '@mui/icons-material/WaterDamageRounded';

import {
  CafeFeedbackApiError,
  completeCafeReview,
  getCafeFeedbackForm,
  isSemanticCafeFeedbackCooldown,
  startCafeReview,
} from './cafeFeedbackApi';
import styles from './CafeFeedbackFlow.module.scss';

const RATINGS = [
  { value: 5, color: '#4ba45d', label: 'Чисто, без замечаний' },
  {
    value: 4,
    color: '#ffdb0c',
    label: 'Чисто, но есть небольшие недостатки',
    starsLabel: 'Чисто, но есть незначительные недостатки',
  },
  {
    value: 3,
    color: '#f68d02',
    label: 'Есть недостатки, но помещение пригодно',
  },
  { value: 2, color: '#ff292d', label: 'Требуется срочная уборка' },
  { value: 1, color: '#333333', label: 'Критическое санитарное состояние' },
];

const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ISSUE_ICONS = {
  toilet_paper: ArticleRoundedIcon,
  soap: SoapRoundedIcon,
  dirt: CleaningServicesRoundedIcon,
  bin_full: DeleteOutlineRoundedIcon,
  fixture_broken: PlumbingRoundedIcon,
  clog: WaterDamageRoundedIcon,
  smell: AirRoundedIcon,
  other: MoreHorizRoundedIcon,
};
const PHOTO_REQUIREMENTS = ['required', 'optional', 'not_required'];

function createIdempotencyKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function normalizeError(error) {
  if (error instanceof CafeFeedbackApiError) return error;
  return new CafeFeedbackApiError(
    error?.message || 'Не удалось выполнить запрос. Проверьте интернет.',
    {
      kind: error?.kind,
      status: error?.status,
      fields: error?.fields,
      retryAfter: error?.retryAfter,
      code: error?.code,
    }
  );
}

function normalizeFeedbackForm(result) {
  const seenRatings = new Set();
  const ratingRules = Array.isArray(result?.rating_rules)
    ? result.rating_rules
        .map((rule) => {
          const flags = [
            'shows_issue_section',
            'shows_photo_section',
            'shows_comment_section',
            'creates_incident',
          ];
          if (flags.some((field) => typeof rule?.[field] !== 'boolean')) {
            return null;
          }
          return {
            rating: Number(rule?.rating),
            scenario: rule?.scenario,
            shows_issue_section: rule.shows_issue_section,
            shows_photo_section: rule.shows_photo_section,
            shows_comment_section: rule.shows_comment_section,
            creates_incident: rule.creates_incident,
          };
        })
        .filter((rule) => {
          const valid =
            rule &&
            Number.isInteger(rule.rating) &&
            RATINGS.some((item) => item.value === rule.rating) &&
            ['incident', 'positive'].includes(rule.scenario) &&
            !seenRatings.has(rule.rating);
          if (valid) seenRatings.add(rule.rating);
          return valid;
        })
    : [];

  const seenIssues = new Set();
  const issues = Array.isArray(result?.issues)
    ? result.issues
        .map((issue) => ({
          code: typeof issue?.code === 'string' ? issue.code.trim() : '',
          label: typeof issue?.label === 'string' ? issue.label.trim() : '',
          ratings: Array.isArray(issue?.ratings)
            ? [
                ...new Set(
                  issue.ratings
                    .map(Number)
                    .filter(
                      (rating) =>
                        Number.isInteger(rating) &&
                        RATINGS.some((item) => item.value === rating)
                    )
                ),
              ]
            : [],
          is_other: issue?.is_other === true,
          photo_requirement: issue?.photo_requirement,
        }))
        .filter((issue) => {
          const valid =
            issue.code &&
            issue.label &&
            issue.ratings.length > 0 &&
            PHOTO_REQUIREMENTS.includes(issue.photo_requirement) &&
            !seenIssues.has(issue.code);
          if (valid) seenIssues.add(issue.code);
          return valid;
        })
    : [];

  return {
    ...result,
    rating_rules: ratingRules,
    issues,
  };
}

function locationText(cafe) {
  const address = String(cafe?.address || '').trim();
  const city = String(cafe?.city || '').trim();
  const name = String(cafe?.name || '').trim();

  if (!address) return name;
  return [city, address].filter(Boolean).join(', ');
}

function formatServerDate(value) {
  if (typeof value !== 'string') return '';
  const source = value.trim();
  if (!source) return '';

  const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|[T\s])/.exec(source);
  if (!match) return source;

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  const isValid =
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(day);

  return isValid ? `${day}.${month}.${year}` : source;
}

function getRatingRule(form, rating) {
  return form?.rating_rules?.find((rule) => rule.rating === rating) || null;
}

function getApplicableIssues(form, rating) {
  return (form?.issues || []).filter((issue) => issue.ratings.includes(rating));
}

function getIssueLimit(form, applicableCount) {
  const configured = Math.floor(Number(form?.limits?.max_issues));
  if (!Number.isFinite(configured)) return applicableCount;
  return Math.min(Math.max(0, configured), applicableCount);
}

function getPhotoLimits(form) {
  const configuredPhotos = Math.floor(Number(form?.limits?.max_photos));
  const configuredBytes = Math.floor(Number(form?.limits?.max_photo_bytes));

  return {
    maxPhotos:
      Number.isFinite(configuredPhotos) && configuredPhotos >= 0
        ? Math.min(4, configuredPhotos)
        : 4,
    maxPhotoBytes:
      Number.isFinite(configuredBytes) && configuredBytes > 0
        ? configuredBytes
        : 35 * 1024 * 1024,
  };
}

function getFlowSteps(rule) {
  if (!rule) return [];
  if (rule.scenario === 'positive') {
    return rule.shows_comment_section ? ['comment'] : [];
  }

  return [
    rule.shows_issue_section ? 'issues' : null,
    rule.shows_photo_section ? 'photos' : null,
    rule.shows_comment_section ? 'comment' : null,
  ].filter(Boolean);
}

function getRuleError(form, rating) {
  const rule = getRatingRule(form, rating);
  if (!rule) {
    return 'Для этой оценки сценарий формы временно недоступен. Попробуйте позже.';
  }

  if (rule.scenario === 'positive') {
    if (
      rule.shows_issue_section ||
      rule.shows_photo_section ||
      rule.creates_incident
    ) {
      return 'Сценарий формы настроен некорректно. Попробуйте позже.';
    }
    return '';
  }

  const applicableIssues = getApplicableIssues(form, rating);
  if (
    !rule.shows_issue_section ||
    !rule.shows_photo_section ||
    !rule.shows_comment_section ||
    !rule.creates_incident
  ) {
    return 'Сценарий формы для этой оценки настроен некорректно. Попробуйте позже.';
  }
  if (
    applicableIssues.length === 0 ||
    getIssueLimit(form, applicableIssues.length) < 1
  ) {
    return 'Для этой оценки сейчас нет доступных пунктов проблемы. Отправить отзыв временно нельзя.';
  }

  return '';
}

function selectedIssuesRequirePhoto(selectedCodes, applicableIssues) {
  return applicableIssues.some(
    (issue) =>
      selectedCodes.includes(issue.code) &&
      issue.photo_requirement === 'required'
  );
}

function revokePhoto(photo) {
  if (photo?.url) URL.revokeObjectURL(photo.url);
}

function validatePhotoFiles(files, maxPhotoBytes) {
  if (files.some((file) => !PHOTO_TYPES.includes(file.type))) {
    return 'Поддерживаются фотографии JPG, PNG и WebP.';
  }
  if (files.some((file) => file.size < 1 || file.size > maxPhotoBytes)) {
    return `Фотография должна быть не больше ${Math.floor(
      maxPhotoBytes / 1024 / 1024
    )} МБ.`;
  }
  return '';
}

function BrandHeader({ form, compact = false }) {
  const place = locationText(form?.cafe);
  const serverDate = formatServerDate(form?.server_date);

  return (
    <header
      className={`${styles.brandHeader} ${compact ? styles.compact : ''}`}
    >
      <div className={styles.brand}>
        <img alt="Жако" src="/cafe-feedback/jaco-wordmark.svg" />
        <span>Чисто</span>
        <span aria-hidden="true" className={styles.brandSparkles}>
          ˖˖
        </span>
      </div>
      {!compact && (serverDate || place) ? (
        <div className={styles.placeMeta}>
          <span>{serverDate}</span>
          <span>{place}</span>
        </div>
      ) : null}
    </header>
  );
}

function CleanMark() {
  return (
    <span aria-hidden="true" className={styles.cleanMark}>
      <img className={styles.markAccent} src="/cafe-feedback/mark-accent.svg" />
      <img className={styles.markMain} src="/cafe-feedback/mark-main.svg" />
      <img className={styles.markDot} src="/cafe-feedback/mark-dot.svg" />
      <img
        className={styles.markSparkleLarge}
        src="/cafe-feedback/mark-sparkle-large.svg"
      />
      <img
        className={styles.markSparkleSmall}
        src="/cafe-feedback/mark-sparkle-small.svg"
      />
    </span>
  );
}

function Smiley({ rating }) {
  return (
    <span aria-hidden="true" className={styles.smiley}>
      <img src={`/cafe-feedback/smiley-${rating}-base.svg`} />
      <img src={`/cafe-feedback/smiley-${rating}-detail.svg`} />
    </span>
  );
}

function FocusHeading({ children, focusKey = 'mount' }) {
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [focusKey]);

  return (
    <h1 className={styles.focusHeading} ref={headingRef} tabIndex={-1}>
      {children}
    </h1>
  );
}

function StateScreen({
  title,
  text,
  action,
  actionLabel = 'Попробовать снова',
}) {
  return (
    <main className={styles.page}>
      <section
        aria-live="polite"
        className={`${styles.card} ${styles.stateCard}`}
      >
        <div aria-hidden="true" className={styles.stateIcon}>
          !
        </div>
        <FocusHeading focusKey={title}>{title}</FocusHeading>
        <p>{text}</p>
        {action ? (
          <button
            className={styles.primaryButton}
            onClick={action}
            type="button"
          >
            {actionLabel}
          </button>
        ) : null}
      </section>
    </main>
  );
}

function RatingSelector({
  form,
  uiVariant,
  rating,
  pending,
  error,
  honeypot,
  onHoneypot,
  onSelect,
}) {
  const disabled = pending || error?.kind === 'network';

  return (
    <>
      <BrandHeader form={form} />
      <div className={styles.selectorBody}>
        <div className={styles.intro}>
          <CleanMark />
          <h1>Помогите нам поддерживать идеальную чистоту</h1>
          <p>
            Если всё хорошо или что-то не так —<br />
            сообщите нам.
          </p>
        </div>

        <fieldset className={styles.ratingFieldset} disabled={disabled}>
          <legend className={styles.visuallyHidden}>
            Оцените санитарное состояние
          </legend>
          <div className={styles.ratingRows}>
            {RATINGS.map((item) => {
              const label =
                uiVariant === 'stars' && item.starsLabel
                  ? item.starsLabel
                  : item.label;
              return (
                <button
                  className={`${styles.ratingRow} ${
                    rating === item.value ? styles.ratingSelected : ''
                  }`}
                  disabled={disabled}
                  key={item.value}
                  onClick={() => onSelect(item.value)}
                  style={{ '--rating-color': item.color }}
                  type="button"
                >
                  {uiVariant === 'emoji' ? (
                    <Smiley rating={item.value} />
                  ) : (
                    <span aria-hidden="true" className={styles.stars}>
                      {[1, 2, 3, 4, 5].map((star) =>
                        star <= item.value ? (
                          <StarRoundedIcon key={star} />
                        ) : (
                          <StarBorderRoundedIcon key={star} />
                        )
                      )}
                    </span>
                  )}
                  <span className={styles.ratingLabel}>{label}</span>
                  <span aria-hidden="true" className={styles.chevron}>
                    ›
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div aria-hidden="true" className={styles.honeypot} inert="">
          <span>Не заполняйте это поле</span>
          <input
            aria-hidden="true"
            autoComplete="off"
            name="website"
            onChange={(event) => onHoneypot(event.target.value)}
            tabIndex={-1}
            value={honeypot}
          />
        </div>
        {pending ? (
          <p aria-live="polite" className={styles.pendingText}>
            Сохраняем оценку…
          </p>
        ) : null}
        {error ? (
          <div
            aria-live="assertive"
            className={styles.requestError}
            role="alert"
          >
            <p>{error.message}</p>
            {error.kind === 'network' ? (
              <>
                <p>
                  Выбранная оценка зафиксирована для безопасного повтора.
                  Изменить её можно после перезагрузки страницы.
                </p>
                <button
                  disabled={pending}
                  onClick={() => onSelect(rating)}
                  type="button"
                >
                  Повторить
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}

function SelectedState({
  form,
  uiVariant,
  rating,
  rule,
  onBack,
  onContinue,
  onFinish,
  submitting,
  error,
}) {
  const selected = RATINGS.find((item) => item.value === rating);
  const selectedLabel =
    uiVariant === 'stars' && selected?.starsLabel
      ? selected.starsLabel
      : selected?.label;
  const incident = rule.scenario === 'incident';
  const canAddComment =
    rule.scenario === 'positive' && rule.shows_comment_section;

  return (
    <>
      <BrandHeader form={form} />
      <div className={styles.selectedBackRow}>
        <button
          aria-label="Вернуться к выбору оценки"
          onClick={onBack}
          type="button"
        >
          <span aria-hidden="true">
            <ChevronLeftRoundedIcon />
          </span>
        </button>
      </div>
      <div
        className={`${styles.selectedState} ${
          uiVariant === 'emoji'
            ? styles.selectedStateEmoji
            : styles.selectedStateStars
        }`}
      >
        <div className={styles.selectedSummary}>
          <CleanMark />
          <FocusHeading>
            {uiVariant === 'stars'
              ? 'Спасибо за вашу оценку!'
              : 'Спасибо за оценку!'}
          </FocusHeading>
          {uiVariant === 'stars' ? (
            <>
              <span
                aria-label={`Оценка: ${rating} из 5`}
                className={styles.selectedStars}
                role="img"
                style={{ '--rating-color': selected?.color }}
              >
                {[1, 2, 3, 4, 5].map((star) =>
                  star <= rating ? (
                    <StarRoundedIcon key={star} />
                  ) : (
                    <StarBorderRoundedIcon key={star} />
                  )
                )}
              </span>
              <p>{selectedLabel}</p>
            </>
          ) : (
            <p className={styles.selectedEmojiLabel}>
              Вы отметили:
              <strong>«{selectedLabel}»</strong>
            </p>
          )}
        </div>

        <div className={styles.selectedInvitation}>
          <h2>
            {incident
              ? 'Расскажите, что случилось'
              : 'Хотите добавить комментарий?'}
          </h2>
          <p>
            {incident
              ? 'Отметьте проблему и при необходимости добавьте фото. Мы передадим информацию сотрудникам.'
              : 'Комментарий поможет нам понять, что особенно понравилось.'}
          </p>
        </div>

        {error ? (
          <p aria-live="assertive" className={styles.inlineError} role="alert">
            {error.message}
          </p>
        ) : null}

        <div className={styles.selectedActions}>
          {incident || canAddComment ? (
            <button
              className={styles.selectedPrimaryButton}
              disabled={submitting}
              onClick={onContinue}
              type="button"
            >
              {incident ? 'Продолжить' : 'Добавить комментарий'}
            </button>
          ) : null}
          {!incident ? (
            <button
              className={
                canAddComment
                  ? styles.selectedSecondaryButton
                  : styles.selectedPrimaryButton
              }
              disabled={submitting}
              onClick={onFinish}
              type="button"
            >
              {submitting
                ? 'Отправляем…'
                : canAddComment
                  ? 'Пропустить'
                  : 'Отправить отзыв'}
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}

function IssuesStep({
  availableIssues,
  selected,
  other,
  maxIssues,
  error,
  onToggle,
  onOther,
}) {
  const otherInputRef = useRef(null);
  const selectedOther = availableIssues.find(
    (issue) => issue.is_other && selected.includes(issue.code)
  );
  const hintId = 'cafe-feedback-issues-hint';
  const errorId = 'cafe-feedback-issues-error';

  useEffect(() => {
    if (selectedOther) {
      window.requestAnimationFrame(() => otherInputRef.current?.focus());
    }
  }, [selectedOther?.code]);

  return (
    <fieldset
      aria-describedby={`${hintId}${error ? ` ${errorId}` : ''}`}
      aria-invalid={Boolean(error)}
      className={styles.stepFieldset}
    >
      <legend className={styles.visuallyHidden}>Проблемные пункты</legend>
      <div className={styles.issueTags}>
        {availableIssues.map((issue) => {
          const IssueIcon = ISSUE_ICONS[issue.code];

          return (
            <label
              className={`${styles.issueTag} ${
                selected.includes(issue.code) ? styles.issueTagSelected : ''
              }`}
              key={issue.code}
            >
              {IssueIcon ? <IssueIcon aria-hidden="true" /> : null}
              <input
                checked={selected.includes(issue.code)}
                onChange={() => onToggle(issue)}
                type="checkbox"
              />
              <span>{issue.label}</span>
            </label>
          );
        })}
      </div>
      <p className={styles.photoHint} id={hintId}>
        Выберите от 1 до {maxIssues} пунктов
      </p>
      {error ? (
        <p className={styles.inlineError} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
      {selectedOther ? (
        <label className={styles.textField}>
          <span>Что ещё нужно исправить?</span>
          <input
            maxLength={300}
            onChange={(event) => onOther(event.target.value)}
            placeholder="Опишите проблему"
            ref={otherInputRef}
            type="text"
            value={other}
          />
        </label>
      ) : null}
    </fieldset>
  );
}

function PhotosStep({
  photos,
  maxPhotos,
  maxPhotoBytes,
  required,
  error,
  onAdd,
  onRemove,
  onRetake,
}) {
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);
  const retakeRef = useRef(null);
  const retakeIndexRef = useRef(-1);
  const galleryButtonRef = useRef(null);
  const hintId = 'cafe-feedback-photos-hint';
  const errorId = 'cafe-feedback-photos-error';

  const removePhoto = (index) => {
    onRemove(index);
    window.requestAnimationFrame(() => {
      galleryButtonRef.current?.focus();
    });
  };

  return (
    <fieldset
      aria-describedby={`${hintId}${error ? ` ${errorId}` : ''}`}
      aria-invalid={Boolean(error)}
      className={`${styles.stepFieldset} ${styles.photosStep}`}
    >
      <legend className={styles.visuallyHidden}>Фотографии проблемы</legend>
      <div className={styles.photoActions}>
        <button
          disabled={photos.length >= maxPhotos}
          onClick={() => cameraRef.current?.click()}
          type="button"
        >
          <span aria-hidden="true">◎</span>
          Сделать фото
        </button>
        <button
          disabled={photos.length >= maxPhotos}
          onClick={() => galleryRef.current?.click()}
          ref={galleryButtonRef}
          type="button"
        >
          <span aria-hidden="true">＋</span>
          Из галереи
        </button>
      </div>
      <p className={styles.photoHint} id={hintId}>
        {required ? 'Нужно добавить хотя бы одно фото. ' : ''}
        До {maxPhotos} фото, каждое не более{' '}
        {Math.max(1, Math.floor(maxPhotoBytes / 1024 / 1024))} МБ
      </p>
      <p aria-live="polite" className={styles.visuallyHidden} role="status">
        Добавлено фотографий: {photos.length} из {maxPhotos}
      </p>
      <input
        accept={PHOTO_TYPES.join(',')}
        capture="environment"
        className={styles.hiddenInput}
        onChange={(event) => {
          onAdd(event.target.files);
          event.target.value = '';
        }}
        ref={cameraRef}
        type="file"
      />
      <input
        accept={PHOTO_TYPES.join(',')}
        className={styles.hiddenInput}
        multiple
        onChange={(event) => {
          onAdd(event.target.files);
          event.target.value = '';
        }}
        ref={galleryRef}
        type="file"
      />
      <input
        accept={PHOTO_TYPES.join(',')}
        capture="environment"
        className={styles.hiddenInput}
        onChange={(event) => {
          onRetake(retakeIndexRef.current, event.target.files);
          event.target.value = '';
        }}
        ref={retakeRef}
        type="file"
      />
      {error ? (
        <p className={styles.inlineError} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
      {photos.length ? (
        <div className={styles.photoGrid}>
          {photos.map((photo, index) => (
            <figure className={styles.photoPreview} key={photo.url}>
              <img alt={`Фото проблемы ${index + 1}`} src={photo.url} />
              <figcaption>
                <button
                  aria-label={`Переснять фото ${index + 1}`}
                  onClick={() => {
                    retakeIndexRef.current = index;
                    retakeRef.current?.click();
                  }}
                  type="button"
                >
                  Переснять
                </button>
                <button
                  aria-label={`Удалить фото ${index + 1}`}
                  onClick={() => removePhoto(index)}
                  type="button"
                >
                  Удалить
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </fieldset>
  );
}

function CommentStep({ comment, onChange }) {
  return (
    <label className={styles.textField}>
      <span>Ваш комментарий</span>
      <textarea
        maxLength={1000}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Расскажите подробнее"
        rows={7}
        value={comment}
      />
      <span className={styles.counter}>{comment.length}/1000</span>
    </label>
  );
}

function SurveyRatingSummary({ rating, uiVariant }) {
  const selected = RATINGS.find((item) => item.value === rating);

  if (uiVariant !== 'stars') {
    return (
      <p className={styles.selectedCaption}>Вы отметили: «{selected?.label}»</p>
    );
  }

  return (
    <div className={styles.surveyRatingSummary}>
      <span>Ваша оценка</span>
      <span
        aria-label={`Оценка: ${rating} из 5`}
        className={styles.surveyStars}
        role="img"
        style={{ '--rating-color': selected?.color }}
      >
        {[1, 2, 3, 4, 5].map((star) =>
          star <= rating ? (
            <StarRoundedIcon key={star} />
          ) : (
            <StarBorderRoundedIcon key={star} />
          )
        )}
      </span>
    </div>
  );
}

function getStepCopy(stepName, photoRequired) {
  if (stepName === 'issues') {
    return {
      title: 'Отметьте проблемные пункты',
      text: 'Можно выбрать несколько пунктов',
    };
  }
  if (stepName === 'photos') {
    return {
      title: 'Добавьте фотографии',
      text: photoRequired
        ? 'Для выбранной проблемы нужна фотография'
        : 'Фото поможет нам быстрее разобраться',
    };
  }
  return {
    title: 'Расскажите подробнее',
    text: 'Комментарий можно оставить пустым',
  };
}

function Survey({
  form,
  uiVariant,
  rating,
  steps,
  step,
  availableIssues,
  issues,
  issueError,
  issueOther,
  photos,
  photoError,
  comment,
  submitting,
  submitError,
  onBack,
  onContinue,
  onToggleIssue,
  onIssueOther,
  onAddPhotos,
  onRemovePhoto,
  onRetakePhoto,
  onComment,
}) {
  const { maxPhotos, maxPhotoBytes } = getPhotoLimits(form);
  const maxIssues = getIssueLimit(form, availableIssues.length);
  const stepName = steps[step];
  const photoRequired = selectedIssuesRequirePhoto(issues, availableIssues);
  const copy = getStepCopy(stepName, photoRequired);
  const isLast = step === steps.length - 1;
  const canSkip =
    (stepName === 'photos' && !photoRequired && photos.length === 0) ||
    (stepName === 'comment' && comment.trim() === '');

  return (
    <>
      <BrandHeader compact form={form} />
      <SurveyRatingSummary rating={rating} uiVariant={uiVariant} />
      <div className={styles.stepHeader}>
        <button aria-label="Назад" onClick={onBack} type="button">
          <span aria-hidden="true">
            <ChevronLeftRoundedIcon />
          </span>
        </button>
        <span aria-live="polite">
          Шаг {step + 1} из {steps.length}
        </span>
      </div>
      <section className={styles.stepBody}>
        <div className={styles.stepTitle}>
          <FocusHeading focusKey={stepName}>{copy.title}</FocusHeading>
          <p>{copy.text}</p>
        </div>
        {stepName === 'issues' ? (
          <IssuesStep
            availableIssues={availableIssues}
            error={issueError}
            maxIssues={maxIssues}
            onOther={onIssueOther}
            onToggle={onToggleIssue}
            other={issueOther}
            selected={issues}
          />
        ) : null}
        {stepName === 'photos' ? (
          <PhotosStep
            error={photoError}
            maxPhotoBytes={maxPhotoBytes}
            maxPhotos={maxPhotos}
            onAdd={onAddPhotos}
            onRemove={onRemovePhoto}
            onRetake={onRetakePhoto}
            photos={photos}
            required={photoRequired}
          />
        ) : null}
        {stepName === 'comment' ? (
          <CommentStep comment={comment} onChange={onComment} />
        ) : null}
        {submitError ? (
          <p aria-live="assertive" className={styles.inlineError} role="alert">
            {submitError.message}
          </p>
        ) : null}
      </section>
      <footer className={styles.actionFooter}>
        <button
          className={styles.primaryButton}
          disabled={submitting}
          onClick={onContinue}
          type="button"
        >
          {submitting ? 'Отправляем…' : isLast ? 'Отправить' : 'Продолжить'}
        </button>
        <button
          className={styles.secondaryButton}
          disabled={submitting || !canSkip}
          onClick={onContinue}
          type="button"
        >
          Пропустить
        </button>
      </footer>
    </>
  );
}

function SuccessState({ form, result }) {
  const alreadySubmitted = result?.already_submitted === true;
  const scenario = String(result?.scenario || '').toLowerCase();
  const incident =
    !alreadySubmitted &&
    (scenario === 'incident' || result?.incident_created === true);
  const incidentCreated = result?.incident_created === true;

  return (
    <>
      <BrandHeader compact form={form} />
      <div className={styles.successState}>
        <span
          aria-hidden="true"
          className={`${styles.successIcon} ${
            incident ? styles.incidentSuccessIcon : ''
          }`}
        >
          ✓
        </span>
        <FocusHeading>
          {alreadySubmitted
            ? 'Отзыв уже сохранён'
            : incident
              ? 'Спасибо, что сообщили'
              : 'Спасибо за отзыв!'}
        </FocusHeading>
        {alreadySubmitted ? (
          <p>Ваш отзыв уже сохранён. Повторно отправлять его не нужно.</p>
        ) : incident ? (
          <>
            <p>Нам жаль, что вы столкнулись с этой ситуацией.</p>
            <p className={styles.incidentConfirmation}>
              {incidentCreated
                ? 'Заявка передана сотрудникам.'
                : 'Ваш отзыв сохранён и будет проверен сотрудниками.'}
            </p>
          </>
        ) : (
          <p>Ваш ответ сохранён и поможет нам поддерживать чистоту.</p>
        )}
      </div>
    </>
  );
}

export default function CafeFeedbackFlow({ token, uiVariant }) {
  const mountedAt = useRef(null);
  const startKey = useRef('');
  const completeKey = useRef('');
  const photosRef = useRef([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewToken, setReviewToken] = useState('');
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState(null);
  const [view, setView] = useState('selected');
  const [step, setStep] = useState(0);
  const [issues, setIssues] = useState([]);
  const [issueError, setIssueError] = useState('');
  const [issueOther, setIssueOther] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photoError, setPhotoError] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [honeypot, setHoneypot] = useState('');

  photosRef.current = photos;

  useEffect(() => {
    mountedAt.current = Date.now();

    return () => {
      const current = photosRef.current;
      photosRef.current = [];
      current.forEach(revokePhoto);
    };
  }, []);

  const clearPhotos = useCallback(() => {
    const current = photosRef.current;
    photosRef.current = [];
    setPhotos([]);
    current.forEach(revokePhoto);
  }, []);

  const showSemanticCooldown = useCallback(() => {
    clearPhotos();
    setFatalError(null);
    setSuccess({
      already_submitted: true,
    });
    setView('success');
  }, [clearPhotos]);

  const loadForm = useCallback(async () => {
    setLoading(true);
    setFatalError(null);
    try {
      const result = normalizeFeedbackForm(await getCafeFeedbackForm(token));
      if (
        !result.form_token ||
        !result.cafe ||
        result.cafe.active === false ||
        String(result.cafe.status || '').toLowerCase() === 'inactive' ||
        result.rating_rules.length === 0
      ) {
        const kind =
          result.cafe?.active === false ||
          String(result.cafe?.status || '').toLowerCase() === 'inactive'
            ? 'inactive'
            : 'field';
        throw new CafeFeedbackApiError(
          kind === 'inactive'
            ? 'Эта точка сейчас не принимает отзывы.'
            : 'Сервер вернул неполные данные формы.',
          { kind }
        );
      }
      setForm(result);
    } catch (error) {
      const normalized = normalizeError(error);
      if (isSemanticCafeFeedbackCooldown(normalized)) {
        showSemanticCooldown();
      } else {
        setFatalError(normalized);
      }
    } finally {
      setLoading(false);
    }
  }, [showSemanticCooldown, token]);

  useEffect(() => {
    loadForm();
  }, [loadForm]);

  const selectRating = async (nextRating) => {
    if (!form || starting || !nextRating) return;
    if (startError?.kind === 'network' && nextRating !== rating) return;

    const ruleError = getRuleError(form, nextRating);
    if (ruleError) {
      setRating(nextRating);
      setStartError(
        new CafeFeedbackApiError(ruleError, {
          kind: 'field',
        })
      );
      return;
    }

    setRating(nextRating);
    setStarting(true);
    setStartError(null);
    if (!startKey.current || (rating && nextRating !== rating)) {
      startKey.current = createIdempotencyKey();
    }

    try {
      const result = await startCafeReview({
        token,
        formToken: form.form_token,
        uiVariant,
        rating: nextRating,
        idempotencyKey: startKey.current,
        honeypot,
        timeOnPageMs:
          mountedAt.current === null
            ? 0
            : Math.max(0, Date.now() - mountedAt.current),
      });
      const startStatus = String(result.status || '').toLowerCase();
      if (startStatus === 'completed' && result.idempotent === true) {
        setView('replay');
        return;
      }
      if (
        startStatus !== 'partial' ||
        typeof result.idempotent !== 'boolean' ||
        !/^[a-f0-9]{64}$/.test(String(result.review_token || ''))
      ) {
        throw new CafeFeedbackApiError('Не удалось получить номер отзыва.', {
          kind: 'field',
        });
      }
      setReviewToken(result.review_token);
      setView('selected');
    } catch (error) {
      const normalized = normalizeError(error);
      if (isSemanticCafeFeedbackCooldown(normalized)) {
        showSemanticCooldown();
      } else if (normalized.kind === 'replay') setView('replay');
      else setStartError(normalized);
    } finally {
      setStarting(false);
    }
  };

  const selectedRule = getRatingRule(form, rating);
  const availableIssues = getApplicableIssues(form, rating);
  const flowSteps = getFlowSteps(selectedRule);

  const submit = async () => {
    if (!form || !reviewToken || !selectedRule || submitting) return;

    if (selectedRule.scenario === 'incident') {
      if (issues.length < 1) {
        setIssueError('Выберите минимум один проблемный пункт.');
        setStep(flowSteps.indexOf('issues'));
        setView('survey');
        return;
      }
      if (
        selectedIssuesRequirePhoto(issues, availableIssues) &&
        !photos.length
      ) {
        setPhotoError('Для выбранной проблемы нужно добавить фотографию.');
        setStep(flowSteps.indexOf('photos'));
        setView('survey');
        return;
      }
    }

    setSubmitting(true);
    setSubmitError(null);
    if (!completeKey.current) completeKey.current = createIdempotencyKey();

    const selectedOther = availableIssues.some(
      (issue) => issue.is_other && issues.includes(issue.code)
    );

    try {
      const result = await completeCafeReview({
        token,
        formToken: form.form_token,
        reviewToken,
        idempotencyKey: completeKey.current,
        rating,
        uiVariant,
        issues: selectedRule.scenario === 'incident' ? issues : [],
        issueOther:
          selectedRule.scenario === 'incident' && selectedOther
            ? issueOther.trim()
            : '',
        comment: comment.trim(),
        photos:
          selectedRule.scenario === 'incident'
            ? photos.map((photo) => photo.file)
            : [],
      });
      if (
        String(result.status || '').toLowerCase() !== 'completed' ||
        typeof result.idempotent !== 'boolean' ||
        !['incident', 'positive'].includes(
          String(result.scenario || '').toLowerCase()
        ) ||
        typeof result.incident_created !== 'boolean'
      ) {
        throw new CafeFeedbackApiError(
          'Сервер не подтвердил завершение отзыва.',
          { kind: 'field' }
        );
      }
      clearPhotos();
      setSuccess(result);
      setView('success');
    } catch (error) {
      const normalized = normalizeError(error);
      if (isSemanticCafeFeedbackCooldown(normalized)) {
        showSemanticCooldown();
      } else if (normalized.kind === 'replay') {
        clearPhotos();
        setView('replay');
      } else setSubmitError(normalized);
    } finally {
      setSubmitting(false);
    }
  };

  const continueStep = () => {
    const stepName = flowSteps[step];
    if (stepName === 'issues' && issues.length < 1) {
      setIssueError('Выберите минимум один проблемный пункт.');
      return;
    }
    if (
      stepName === 'photos' &&
      selectedIssuesRequirePhoto(issues, availableIssues) &&
      !photos.length
    ) {
      setPhotoError('Для выбранной проблемы нужно добавить фотографию.');
      return;
    }
    setSubmitError(null);
    if (step < flowSteps.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    submit();
  };

  const addPhotos = (fileList) => {
    const files = Array.from(fileList || []);
    const { maxPhotos, maxPhotoBytes } = getPhotoLimits(form);
    const current = photosRef.current;
    const available = maxPhotos - current.length;

    if (!files.length) return;
    const candidates = files.slice(0, Math.max(0, available));
    const accepted = candidates.filter(
      (file) =>
        PHOTO_TYPES.includes(file.type) &&
        file.size >= 1 &&
        file.size <= maxPhotoBytes
    );
    const unsupportedCount = candidates.filter(
      (file) => !PHOTO_TYPES.includes(file.type)
    ).length;
    const invalidSizeCount = candidates.filter(
      (file) =>
        PHOTO_TYPES.includes(file.type) &&
        (file.size < 1 || file.size > maxPhotoBytes)
    ).length;
    const excessCount = Math.max(0, files.length - candidates.length);
    const messages = [];

    if (excessCount) {
      messages.push(
        `Можно добавить не больше ${maxPhotos} фотографий: лишние файлы не добавлены.`
      );
    }
    if (unsupportedCount) {
      messages.push(
        `${unsupportedCount} файл(а) не добавлено: поддерживаются только JPG, PNG и WebP.`
      );
    }
    if (invalidSizeCount) {
      messages.push(
        `${invalidSizeCount} файл(а) не добавлено: размер должен быть не больше ${Math.floor(
          maxPhotoBytes / 1024 / 1024
        )} МБ.`
      );
    }

    setPhotoError(messages.join(' '));
    if (accepted.length) {
      const added = accepted.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      const next = [...current, ...added];
      photosRef.current = next;
      setPhotos(next);
    }
  };

  const retakePhoto = (index, fileList) => {
    const file = Array.from(fileList || [])[0];
    const current = photosRef.current;
    if (!file || index < 0 || index >= current.length) return;
    const { maxPhotoBytes } = getPhotoLimits(form);
    const validationError = validatePhotoFiles([file], maxPhotoBytes);
    if (validationError) {
      setPhotoError(validationError);
      return;
    }

    const previous = current[index];
    const replacement = { file, url: URL.createObjectURL(file) };
    const next = current.map((photo, photoIndex) =>
      photoIndex === index ? replacement : photo
    );
    photosRef.current = next;
    setPhotoError('');
    setPhotos(next);
    revokePhoto(previous);
  };

  const removePhoto = (index) => {
    const current = photosRef.current;
    if (index < 0 || index >= current.length) return;
    const removed = current[index];
    const next = current.filter((photo, photoIndex) => photoIndex !== index);
    photosRef.current = next;
    setPhotos(next);
    revokePhoto(removed);
    setPhotoError('');
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <section
          aria-busy="true"
          aria-live="polite"
          className={`${styles.card} ${styles.loading}`}
          role="status"
        >
          <span aria-hidden="true" className={styles.spinner} />
          <p>Загружаем форму…</p>
        </section>
      </main>
    );
  }

  if (fatalError) {
    const canRetry = !['invalid', 'inactive'].includes(fatalError.kind);
    const title =
      fatalError.kind === 'invalid'
        ? 'Ссылка недействительна'
        : fatalError.kind === 'inactive'
          ? 'Точка временно неактивна'
          : fatalError.kind === 'rate'
            ? 'Слишком много попыток'
            : 'Не удалось открыть форму';
    return (
      <StateScreen
        action={canRetry ? loadForm : null}
        text={fatalError.message}
        title={title}
      />
    );
  }

  if (view === 'replay') {
    return (
      <StateScreen
        text="Повторно отправлять данные не нужно."
        title="Отзыв уже отправлен"
      />
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        {!reviewToken && view !== 'success' ? (
          <RatingSelector
            error={startError}
            form={form}
            honeypot={honeypot}
            onHoneypot={setHoneypot}
            onSelect={selectRating}
            pending={starting}
            rating={rating}
            uiVariant={uiVariant}
          />
        ) : null}
        {reviewToken && view === 'selected' ? (
          <SelectedState
            error={submitError}
            form={form}
            onBack={() => window.location.reload()}
            onContinue={() => {
              setSubmitError(null);
              setStep(0);
              setView('survey');
            }}
            onFinish={submit}
            rating={rating}
            rule={selectedRule}
            submitting={submitting}
            uiVariant={uiVariant}
          />
        ) : null}
        {reviewToken && view === 'survey' ? (
          <Survey
            availableIssues={availableIssues}
            comment={comment}
            form={form}
            uiVariant={uiVariant}
            issueError={issueError}
            issueOther={issueOther}
            issues={issues}
            onAddPhotos={addPhotos}
            onBack={() => {
              setSubmitError(null);
              if (step === 0) setView('selected');
              else setStep((current) => current - 1);
            }}
            onComment={setComment}
            onContinue={continueStep}
            onIssueOther={setIssueOther}
            onRemovePhoto={removePhoto}
            onRetakePhoto={retakePhoto}
            onToggleIssue={(issue) => {
              const maxIssues = getIssueLimit(form, availableIssues.length);
              if (issues.includes(issue.code)) {
                setIssueError('');
                setIssues((current) =>
                  current.filter((item) => item !== issue.code)
                );
                if (issue.is_other) setIssueOther('');
                return;
              }
              if (issues.length >= maxIssues) {
                setIssueError(`Можно выбрать не больше ${maxIssues} пунктов.`);
                return;
              }
              setIssueError('');
              setIssues((current) => [...current, issue.code]);
            }}
            photoError={photoError}
            photos={photos}
            rating={rating}
            step={step}
            steps={flowSteps}
            submitError={submitError}
            submitting={submitting}
          />
        ) : null}
        {view === 'success' ? (
          <SuccessState form={form} result={success} />
        ) : null}
      </section>
    </main>
  );
}
