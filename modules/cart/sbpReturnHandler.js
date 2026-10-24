import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';
import { useCartStore, useHeaderStoreNew, useCitiesStore } from '@/components/store';
import PaidOrderStatus from './paidOrderStatus';

// Один обработчик для карты и СБП на всех размерах экрана.
export default function SbpReturnHandler({ city }) {
  const router = useRouter();
  const activeCity = useCitiesStore((store) => store.thisCity);
  const token = useHeaderStoreNew((state) => state.token);
  const [pending, state, openConfirmForm, navigate] = useCartStore((store) => [store.pendingPaidOrder, store.paidConfirmationState, store.openConfirmForm, store.paidConfirmationNavigate]);
  const [dismissed, setDismissed] = useState(false);
  const [missing, setMissing] = useState(false);
  const returned = router.isReady && router.query.sbp_return === '1';
  const ordersPath = `/${city}/zakazy`;

  useEffect(() => {
    if (!router.isReady || !city || !token || activeCity !== city) return;
    const store = useCartStore.getState();
    const restored = !store.pendingPaidOrder;
    let order = store.restorePaidOrder(city);
    if (!order && returned) {
      const legacy = store.restorePendingSbpOrder(city);
      if (legacy?.city === city) order = store.registerPaidOrder({ ...legacy, method: 'sbp' }, token);
    }
    if (returned && router.asPath.split(/[?#]/, 1)[0] !== ordersPath) {
      void router.replace(`${ordersPath}?sbp_return=1`);
    }
    setMissing(returned && !order);
    if (order?.city === city && (restored || returned || order.startedAt)) {
      void store.startPaidConfirmation();
    }
  }, [city, activeCity, token, returned, router.isReady]);

  useEffect(() => { setDismissed(false); }, [pending?.orderId, pending?.pointId, state]);

  useEffect(() => {
    if (!router.isReady || !pending || pending.city !== city || state !== 'confirmed' || !navigate) return;
    useCartStore.setState({ paidConfirmationNavigate: false });
    if (router.asPath.split(/[?#]/, 1)[0] !== ordersPath || returned) void router.replace(ordersPath);
  }, [state, pending, city, navigate, returned, router.isReady]);

  if (dismissed || openConfirmForm || (!missing && (!pending || pending.city !== city || state === 'idle'))) return null;
  return (
    <Alert severity={state === 'confirmed' ? 'success' : 'info'} variant="outlined" icon={false} role="status"
      onClose={() => setDismissed(true)} closeText="Закрыть уведомление"
      sx={{ position: 'fixed', zIndex: 1500, top: 112, left: '50%', transform: 'translateX(-50%)', width: 'min(560px, calc(100vw - 32px))', boxSizing: 'border-box', px: 2, py: 1.5, alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '14px', bgcolor: '#fff', color: '#30343a', boxShadow: '0 12px 36px rgba(24, 29, 35, 0.18)', fontFamily: 'var(--inter-font)', fontSize: 14, lineHeight: 1.45,
        '& .MuiAlert-message': { flex: 1, minWidth: 0, py: 0 }, '& .MuiAlert-action': { alignItems: 'center', p: 0, ml: 1 }, '& .MuiIconButton-root': { width: 34, height: 34, color: '#5c626a' },
        '@media (min-width: 668px) and (max-width: 990px)': { top: 96, width: 'min(520px, calc(100vw - 32px))' },
        '@media (max-width: 667px)': { top: 'calc(76px + env(safe-area-inset-top, 0px))', width: 'calc(100vw - 24px)', px: 1.5, py: 1.25, borderRadius: '12px' } }}>
      {missing ? 'Не удалось найти заказ для проверки оплаты. Проверьте историю заказов или обратитесь в поддержку.' : <PaidOrderStatus />}
    </Alert>
  );
}
