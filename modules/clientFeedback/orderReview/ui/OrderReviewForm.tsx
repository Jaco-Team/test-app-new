import { useEffect, useMemo, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
  buildOrderReviewResponses,
  getTargetRating,
  isOrderReviewElementVisible,
  orderReviewAnswerKey,
  orderReviewText,
  validateOrderReview,
} from '../model/orderReview';
import type {
  OrderReviewAnswers,
  OrderReviewElement,
  OrderReviewFormData,
  OrderReviewOption,
  OrderReviewResponse,
  OrderReviewTarget,
  OrderReviewValue,
} from '../model/types';

const ratingLabels = ['Ужасно', 'Плохо', 'Можно лучше', 'Хорошо', 'Отлично'];

type OrderReviewFormProps = {
  form: OrderReviewFormData;
  submitting?: boolean;
  submitError?: string;
  onDirtyChange?: (dirty: boolean) => void;
  onSubmit: (responses: OrderReviewResponse[]) => void | Promise<void>;
};

function normalizeOptions(element: OrderReviewElement) {
  return (element.data?.checkboxes || [])
    .map((option: string | OrderReviewOption) => {
      if (typeof option === 'string') {
        return { label: option, param: option };
      }

      return {
        label: String(option.label || option.name || option.param || ''),
        param: String(option.param || option.value || ''),
      };
    })
    .filter((option) => option.param && option.label);
}

function ElementField({
  element,
  target,
  rating,
  value,
  onChange,
}: {
  element: OrderReviewElement;
  target: OrderReviewTarget;
  rating: number;
  value?: OrderReviewValue;
  onChange: (value: OrderReviewValue) => void;
}) {
  if (!isOrderReviewElementVisible(element, target, rating)) return null;

  const data = element.data || {};
  const label = orderReviewText(
    data,
    ['title', 'label'],
    element.type === 'rating' ? 'Оценка' : 'Ваш ответ'
  );

  if (element.type === 'heading') {
    return (
      <Typography component="h3" variant="h6">
        {orderReviewText(data, ['title', 'label', 'text', 'value'], '')}
      </Typography>
    );
  }

  if (element.type === 'discount') return null;

  if (element.type === 'rating') {
    const ratingValue = Number(value) || 0;

    return (
      <FormControl required={data.required === true}>
        <FormLabel>{label}</FormLabel>
        <Rating
          aria-label={label}
          getLabelText={(nextValue) =>
            `${nextValue} из 5, ${ratingLabels[nextValue - 1]}`
          }
          onChange={(_, nextValue) => onChange(nextValue || 0)}
          size="large"
          value={ratingValue}
          sx={{ color: '#cc0033', fontSize: { xs: '2.5rem', sm: '3rem' } }}
        />
        <FormHelperText aria-live="polite">
          {ratingValue ? ratingLabels[ratingValue - 1] : 'Поставьте оценку'}
        </FormHelperText>
      </FormControl>
    );
  }

  if (element.type === 'tagCloud') {
    const selected = Array.isArray(value) ? value : [];

    return (
      <FormControl component="fieldset" required={data.required === true}>
        <FormLabel component="legend">{label}</FormLabel>
        <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
          {(data.availableTags || []).map((tag) => {
            const isSelected = selected.includes(tag);
            return (
              <Chip
                clickable
                color={isSelected ? 'primary' : 'default'}
                key={tag}
                label={tag}
                onClick={() =>
                  onChange(
                    isSelected
                      ? selected.filter((item) => item !== tag)
                      : [...selected, tag]
                  )
                }
                variant={isSelected ? 'filled' : 'outlined'}
              />
            );
          })}
        </Stack>
      </FormControl>
    );
  }

  if (element.type === 'checkboxGroup') {
    const selected = Array.isArray(value) ? value : [];

    return (
      <FormControl component="fieldset" required={data.required === true}>
        <FormLabel component="legend">{label}</FormLabel>
        <FormGroup>
          {normalizeOptions(element).map((option) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selected.includes(option.param)}
                  onChange={(event) =>
                    onChange(
                      event.target.checked
                        ? [...selected, option.param]
                        : selected.filter((item) => item !== option.param)
                    )
                  }
                />
              }
              key={option.param}
              label={option.label}
            />
          ))}
        </FormGroup>
      </FormControl>
    );
  }

  if (element.type === 'checkbox') {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={value === true}
            onChange={(event) => onChange(event.target.checked)}
          />
        }
        label={label}
      />
    );
  }

  if (element.type === 'input' || element.type === 'textarea') {
    return (
      <TextField
        fullWidth
        label={label}
        maxRows={element.type === 'textarea' ? 8 : undefined}
        minRows={element.type === 'textarea' ? 3 : undefined}
        multiline={element.type === 'textarea'}
        onChange={(event) => onChange(event.target.value)}
        placeholder={data.placeholder}
        required={data.required === true}
        slotProps={{
          htmlInput: {
            maxLength: element.type === 'textarea' ? 5000 : 500,
          },
        }}
        value={typeof value === 'string' ? value : ''}
      />
    );
  }

  return null;
}

export function OrderReviewForm({
  form,
  submitting = false,
  submitError = '',
  onDirtyChange,
  onSubmit,
}: OrderReviewFormProps) {
  const firstTargetId =
    form.targets.find((target) => target.target_type === 'order')?.target_id ??
    form.targets[0]?.target_id;
  const [answers, setAnswers] = useState<OrderReviewAnswers>({});
  const [currentTargetId, setCurrentTargetId] = useState(firstTargetId);
  const [validationError, setValidationError] = useState('');
  const currentTarget =
    form.targets.find((target) => target.target_id === currentTargetId) ||
    form.targets[0];
  const responses = useMemo(
    () => buildOrderReviewResponses(form.targets, answers),
    [answers, form.targets]
  );
  const isDirty = responses.length > 0;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  if (!currentTarget) return null;

  const rating = getTargetRating(currentTarget, answers);
  const setValue = (elementId: string, value: OrderReviewValue) => {
    setValidationError('');
    setAnswers((current) => ({
      ...current,
      [orderReviewAnswerKey(currentTarget.target_id, elementId)]: value,
    }));
  };

  const submit = async () => {
    const error = validateOrderReview(form.targets, answers);
    if (error) {
      setValidationError(error);
      return;
    }

    await onSubmit(responses);
  };

  return (
    <Stack gap={3}>
      {form.targets.length > 1 ? (
        <Box
          aria-label="Разделы отзыва"
          role="navigation"
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            pb: 0.5,
          }}
        >
          {form.targets.map((target) => (
            <Chip
              aria-current={
                target.target_id === currentTarget.target_id
                  ? 'page'
                  : undefined
              }
              clickable
              color={
                target.target_id === currentTarget.target_id
                  ? 'primary'
                  : 'default'
              }
              key={`${target.target_type}:${target.target_id}`}
              label={target.name || 'Раздел'}
              onClick={() => setCurrentTargetId(target.target_id)}
              variant={
                target.target_id === currentTarget.target_id
                  ? 'filled'
                  : 'outlined'
              }
            />
          ))}
        </Box>
      ) : null}

      <Stack gap={2.5}>
        {currentTarget.elements.map((element) => (
          <ElementField
            element={element}
            key={element.id}
            onChange={(value) => setValue(element.id, value)}
            rating={rating}
            target={currentTarget}
            value={
              answers[orderReviewAnswerKey(currentTarget.target_id, element.id)]
            }
          />
        ))}
      </Stack>

      {validationError ? (
        <Alert severity="warning">{validationError}</Alert>
      ) : null}
      {submitError ? (
        <Alert aria-live="assertive" severity="error">
          {submitError}
        </Alert>
      ) : null}

      <Button
        disabled={submitting}
        fullWidth
        onClick={submit}
        size="large"
        startIcon={
          submitting ? <CircularProgress color="inherit" size={18} /> : null
        }
        variant="contained"
      >
        {submitting ? 'Отправляем…' : 'Отправить отзыв'}
      </Button>
    </Stack>
  );
}
