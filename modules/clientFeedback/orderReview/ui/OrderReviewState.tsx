import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

type OrderReviewStateKind =
  'loading' | 'empty' | 'error' | 'submitted' | 'already_existed';

type OrderReviewStateProps = {
  kind: OrderReviewStateKind;
  message?: string;
  onClose?: () => void;
  onRetry?: () => void;
};

const content: Record<
  Exclude<OrderReviewStateKind, 'loading' | 'error'>,
  { title: string; description: string }
> = {
  empty: {
    title: 'Отзыв сейчас недоступен',
    description: 'Для этого заказа нет активной формы отзыва.',
  },
  submitted: {
    title: 'Спасибо за отзыв!',
    description: 'Скоро станем ещё лучше благодаря вам.',
  },
  already_existed: {
    title: 'Отзыв уже отправлен',
    description: 'Спасибо — мы уже получили вашу оценку этого заказа.',
  },
};

export function OrderReviewState({
  kind,
  message,
  onClose,
  onRetry,
}: OrderReviewStateProps) {
  if (kind === 'loading') {
    return (
      <Stack
        alignItems="center"
        aria-live="polite"
        gap={2}
        justifyContent="center"
        minHeight={220}
      >
        <CircularProgress aria-label="Загрузка формы отзыва" />
        <Typography>Загружаем форму…</Typography>
      </Stack>
    );
  }

  if (kind === 'error') {
    return (
      <Stack gap={2} minHeight={180} justifyContent="center">
        <Alert severity="error">
          {message || 'Не удалось загрузить форму. Попробуйте ещё раз.'}
        </Alert>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
          {onRetry ? (
            <Button fullWidth onClick={onRetry} variant="contained">
              Попробовать снова
            </Button>
          ) : null}
          {onClose ? (
            <Button fullWidth onClick={onClose} variant="outlined">
              Закрыть
            </Button>
          ) : null}
        </Stack>
      </Stack>
    );
  }

  const state = content[kind];

  return (
    <Stack
      alignItems="center"
      aria-live="polite"
      gap={2}
      justifyContent="center"
      minHeight={220}
      textAlign="center"
    >
      {kind === 'submitted' || kind === 'already_existed' ? (
        <CheckCircleOutlineIcon
          aria-hidden="true"
          color="primary"
          sx={{ fontSize: 56 }}
        />
      ) : (
        <Box aria-hidden="true" sx={{ fontSize: 42 }}>
          —
        </Box>
      )}
      <div>
        <Typography component="h2" gutterBottom variant="h5">
          {state.title}
        </Typography>
        <Typography color="text.secondary">
          {message || state.description}
        </Typography>
      </div>
      {onClose ? (
        <Button onClick={onClose} variant="contained">
          Закрыть
        </Button>
      ) : null}
    </Stack>
  );
}
