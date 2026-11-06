import { useRouter } from 'next/router';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCartStore, useCitiesStore } from '@/components/store.js';
import { BREAKPOINTS } from '@/utils/breakpoints';
import PaidOrderStatus from './paidOrderStatus';

export default function CardPaymentPreflight({ open, onClose }) {
  const router = useRouter();
  const mobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobileMax}px)`);
  const city = useCitiesStore((state) => state.thisCity);
  const [state, failures, retry, hosted, url, redirect, verify, confirmation, message] = useCartStore((value) => [
    value.cardPreflightState, value.cardScriptFailures, value.cardPreflightRetry,
    value.cardPreflightHosted, value.cardHostedUrl, value.startHostedCardRedirect,
    value.startPaidConfirmation, value.paidConfirmationState, value.cardPreflightMessage,
  ]);
  const busy = state === 'loading' || state === 'creating';
  const existing = state === 'existing' || state === 'hosted';
  const content = (
    <DialogContent sx={{ p: { xs: 2.5, sm: 3 }, overflowWrap: 'anywhere' }}>
      <h2 id="card-preflight-title">Оплата заказа</h2>
      <div role="status" aria-live="polite">
        {state === 'loading' ? <p>Проверяем доступность формы оплаты…</p> : null}
        {state === 'creating' ? <p>Готовим оплату…</p> : null}
        {state === 'error' ? <p>Форма оплаты не загрузилась. {failures >= 2 ? 'Можно оплатить заказ на защищённой странице ЮKassa.' : 'Попробуйте загрузить её ещё раз.'}</p> : null}
        {state === 'storage_error' ? <p>Не удалось безопасно подготовить переход к оплате. Попробуйте загрузить форму ещё раз или выберите другой способ оплаты.</p> : null}
        {state === 'uncertain' ? <p>{message || 'Ответ о создании заказа не получен. Чтобы не создать повторный заказ, проверьте историю.'}</p> : null}
        {state === 'rejected' ? <p>{message || 'Проверьте данные заказа и попробуйте ещё раз.'}</p> : null}
        {existing ? <><p>{message || 'Оплата текущего заказа подготовлена.'}</p><PaidOrderStatus /></> : null}
      </div>
      {(state === 'error' || state === 'storage_error') && retry ? (
        <Button fullWidth variant="outlined" sx={{ mt: 1, minHeight: 44 }} onClick={() => { void retry(); }}>
          Повторить загрузку формы оплаты
        </Button>
      ) : null}
      {state === 'error' && failures >= 2 && hosted ? (
        <Button fullWidth variant="contained" sx={{ mt: 1, minHeight: 44 }} onClick={() => { void hosted(); }}>
          Оплатить на сайте ЮKassa
        </Button>
      ) : null}
      {existing && url ? (
        <Button fullWidth variant="contained" sx={{ mt: 1, minHeight: 44 }} onClick={() => redirect()}>
          Открыть оплату на сайте ЮKassa
        </Button>
      ) : null}
      {existing ? (
        <Button fullWidth variant="outlined" disabled={confirmation === 'checking'} sx={{ mt: 1, minHeight: 44 }} onClick={() => { void verify({ retry: true }); }}>
          Проверить заказ
        </Button>
      ) : null}
      {state === 'uncertain' ? (
        <Button fullWidth variant="outlined" sx={{ mt: 1, minHeight: 44 }} onClick={() => { onClose(); void router.push(`/${city}/zakazy`); }}>
          Проверить историю заказов
        </Button>
      ) : null}
      <Button fullWidth disabled={busy} sx={{ mt: 1, minHeight: 44 }} onClick={onClose}>Вернуться к заказу</Button>
    </DialogContent>
  );
  return mobile ? (
    <SwipeableDrawer anchor="bottom" open={open} onClose={busy ? () => {} : onClose} onOpen={() => {}} disableSwipeToOpen
      sx={{ '& .MuiDrawer-paper': { maxHeight: '90dvh', borderRadius: '16px 16px 0 0' } }}>
      {content}
    </SwipeableDrawer>
  ) : (
    <Dialog open={open} onClose={busy ? undefined : onClose} aria-labelledby="card-preflight-title" fullWidth maxWidth="sm"
      sx={{ '& .MuiDialog-paper': { m: 2, width: 'calc(100% - 32px)', maxWidth: { sm: 520, lg: 560 }, borderRadius: 3 } }}>
      {content}
    </Dialog>
  );
}
