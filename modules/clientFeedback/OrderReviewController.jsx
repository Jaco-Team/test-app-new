import { useEffect, useRef, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import useMediaQuery from '@mui/material/useMediaQuery';

import { OrderReviewForm, OrderReviewState } from './orderReview';
import { BREAKPOINTS } from '@/utils/breakpoints';
import {
  getClientFeedbackForm,
  submitClientFeedback,
} from './clientFeedbackApi';
import {
  isOrderReviewEligible,
  normalizeOrderReviewOrder,
} from './clientFeedbackEligibility';
import { createClientFeedbackRequestGuard } from './clientFeedbackRequestGuard';

export { isOrderReviewEligible } from './clientFeedbackEligibility';

function requestErrorMessage(error, fallback) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export default function OrderReviewController({ order, token }) {
  const isMobile = useMediaQuery(
    `screen and (max-width: ${BREAKPOINTS.mobileMax}px)`
  );
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [form, setForm] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [dirty, setDirty] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const requestGuard = useRef(createClientFeedbackRequestGuard());
  const restoreFocusTimer = useRef(null);
  const triggerRef = useRef(null);
  const normalizedOrder = normalizeOrderReviewOrder(order);
  const eligible = isOrderReviewEligible(normalizedOrder);

  const invalidateRequests = () => {
    requestGuard.current.invalidate();
  };

  const reset = () => {
    setForm(null);
    setLoadError('');
    setSubmitError('');
    setDirty(false);
    setPhase('idle');
  };

  const closeImmediately = () => {
    invalidateRequests();
    requestGuard.current.reset();
    setConfirmClose(false);
    setOpen(false);
    reset();
    window.clearTimeout(restoreFocusTimer.current);
    restoreFocusTimer.current = window.setTimeout(() => {
      triggerRef.current?.focus();
    }, 300);
  };

  const requestClose = (event) => {
    if (phase === 'submitting') return;
    if (dirty && phase === 'ready') {
      event?.currentTarget?.blur?.();
      setConfirmClose(true);
      return;
    }
    closeImmediately();
  };

  const loadForm = async () => {
    const requestId = requestGuard.current.begin();
    setPhase('loading');
    setForm(null);
    setLoadError('');
    setSubmitError('');
    setDirty(false);

    try {
      const result = await getClientFeedbackForm({
        pointId: normalizedOrder.point_id,
        orderId: normalizedOrder.order_id,
        token,
      });
      if (!requestGuard.current.isCurrent(requestId)) return;

      if (result.submitted === true) {
        setPhase('already_existed');
        return;
      }
      if (!Array.isArray(result.targets) || result.targets.length === 0) {
        setPhase('empty');
        return;
      }

      setForm(result);
      setPhase('ready');
    } catch (error) {
      if (!requestGuard.current.isCurrent(requestId)) return;
      setLoadError(
        requestErrorMessage(error, 'Не удалось загрузить форму отзыва')
      );
      setPhase('error');
    }
  };

  const openReview = (event) => {
    if (!eligible || !token) return;
    window.clearTimeout(restoreFocusTimer.current);
    event.currentTarget.blur();
    setOpen(true);
    void loadForm();
  };

  const submit = async (responses) => {
    if (phase !== 'ready') return;

    const requestId = requestGuard.current.beginSubmit();
    if (requestId === null) return;
    setSubmitError('');
    setPhase('submitting');

    try {
      const result = await submitClientFeedback({
        pointId: normalizedOrder.point_id,
        orderId: normalizedOrder.order_id,
        responses,
        token,
      });
      if (!requestGuard.current.isCurrent(requestId)) return;

      setDirty(false);
      setPhase(
        result.already_existed === true ? 'already_existed' : 'submitted'
      );
    } catch (error) {
      if (!requestGuard.current.isCurrent(requestId)) return;
      setSubmitError(requestErrorMessage(error, 'Не удалось отправить отзыв'));
      setPhase('ready');
    } finally {
      requestGuard.current.finishSubmit(requestId);
    }
  };

  useEffect(() => {
    if (open && !eligible) closeImmediately();
  }, [eligible, open]);

  useEffect(() => {
    if (!open) return;
    closeImmediately();
  }, [normalizedOrder?.order_id, normalizedOrder?.point_id]);

  useEffect(
    () => () => {
      window.clearTimeout(restoreFocusTimer.current);
      invalidateRequests();
      requestGuard.current.reset();
    },
    []
  );

  if (!eligible) return null;

  const content = (
    <>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 2.5 },
        }}
      >
        <DialogTitle id="order-review-title" sx={{ p: 0 }}>
          Отзыв о заказе №{normalizedOrder.order_id}
        </DialogTitle>
        <IconButton
          aria-label="Закрыть форму отзыва"
          disabled={phase === 'submitting'}
          onClick={requestClose}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent
        dividers
        sx={{
          mt: 2,
          px: { xs: 2, sm: 3 },
          py: 3,
        }}
      >
        {phase === 'loading' ? <OrderReviewState kind="loading" /> : null}
        {phase === 'error' ? (
          <OrderReviewState
            kind="error"
            message={loadError}
            onClose={requestClose}
            onRetry={loadForm}
          />
        ) : null}
        {phase === 'empty' ? (
          <OrderReviewState kind="empty" onClose={requestClose} />
        ) : null}
        {phase === 'submitted' ? (
          <OrderReviewState kind="submitted" onClose={requestClose} />
        ) : null}
        {phase === 'already_existed' ? (
          <OrderReviewState kind="already_existed" onClose={requestClose} />
        ) : null}
        {form && (phase === 'ready' || phase === 'submitting') ? (
          <OrderReviewForm
            form={form}
            onDirtyChange={setDirty}
            onSubmit={submit}
            submitError={submitError}
            submitting={phase === 'submitting'}
          />
        ) : null}
        {phase === 'idle' ? (
          <Alert severity="info">Откройте форму отзыва ещё раз.</Alert>
        ) : null}
      </DialogContent>
    </>
  );

  return (
    <>
      <Button
        disabled={!token}
        onClick={openReview}
        ref={triggerRef}
        size="large"
        variant="outlined"
      >
        Оценить заказ
      </Button>

      {isMobile ? (
        <SwipeableDrawer
          anchor="bottom"
          disableSwipeToOpen
          onClose={requestClose}
          onOpen={() => {}}
          open={open}
          slotProps={{
            paper: {
              'aria-labelledby': 'order-review-title',
              sx: {
                borderRadius: '20px 20px 0 0',
                maxHeight: '92dvh',
              },
            },
          }}
        >
          {content}
        </SwipeableDrawer>
      ) : (
        <Dialog
          aria-labelledby="order-review-title"
          disableEscapeKeyDown={phase === 'submitting'}
          fullWidth
          maxWidth="sm"
          onClose={requestClose}
          open={open}
          scroll="paper"
        >
          {content}
        </Dialog>
      )}

      <Dialog
        aria-describedby="order-review-close-description"
        aria-labelledby="order-review-close-title"
        maxWidth="xs"
        onClose={() => setConfirmClose(false)}
        open={confirmClose}
      >
        <DialogTitle id="order-review-close-title">Закрыть форму?</DialogTitle>
        <DialogContent>
          <Box id="order-review-close-description">
            Введённые ответы не сохранятся.
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClose(false)}>Продолжить</Button>
          <Button color="error" onClick={closeImmediately} variant="contained">
            Закрыть без сохранения
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
