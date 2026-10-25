import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { api } from '@/components/api';
import { useCartStore, useHeaderStoreNew, useCitiesStore, useProfileStore } from '@/components/store';
import { readSbpReturn, samePaidOrder, sbpOrdersPath } from '@/utils/sbpReturn';
import PaidOrderStatus from './paidOrderStatus';

// Один обработчик для карты и СБП на всех размерах экрана.
export default function SbpReturnHandler({ city }) {
  const router = useRouter();
  const activeCity = useCitiesStore((store) => store.thisCity);
  const token = useHeaderStoreNew((state) => state.token);
  const [pending, state, openConfirmForm, navigate] = useCartStore((store) => [store.pendingPaidOrder, store.paidConfirmationState, store.openConfirmForm, store.paidConfirmationNavigate]);
  const [dismissed, setDismissed] = useState(false);
  const [notice, setNotice] = useState(null);
  const returnInfo = readSbpReturn(router.query, router.asPath);
  const returned = router.isReady && returnInfo.requested;
  const ordersPath = `/${city}/zakazy`;
  const scope = `${token}:${activeCity}:${router.asPath}`;
  const activeScope = useRef(scope);
  activeScope.current = scope;
  const mounted = useRef(false);
  const isolatedRequest = useRef(null);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const pathname = router.asPath.split(/[?#]/, 1)[0];
  useEffect(() => { setNotice(null); setDismissed(false); }, [token, city, activeCity, pathname]);
  const pendingIdentity = `${pending?.pointId}:${pending?.orderId}`;
  const previousPending = useRef(pendingIdentity);
  useEffect(() => {
    if (previousPending.current !== pendingIdentity) setNotice(null);
    previousPending.current = pendingIdentity;
  }, [pendingIdentity]);

  const refreshHistory = () => {
    const profile = useProfileStore.getState();
    void profile.getOrderList('zakazy', city, token, { force: true });
    void profile.getCountPromos_Orders(city, { force: true });
  };
  const cleanReturn = () => void router.replace(sbpOrdersPath(router.asPath, city, true), undefined, { shallow: true, scroll: false });

  // Не прерываем подтверждение другого заказа ради старой ссылки возврата.
  const verifySeparateReference = (reference) => {
    if (isolatedRequest.current?.scope === scope) return isolatedRequest.current.promise;
    const current = () => mounted.current && activeScope.current === scope &&
      useHeaderStoreNew.getState().token === token && useCitiesStore.getState().thisCity === city;
    setNotice({ text: `Проверяем заказ №${reference.orderId}…`, reference, busy: true });
    const promise = Promise.resolve().then(async () => {
      let response;
      try { response = await api('cart', { type: 'confirm_paid_order', token, point_id: reference.pointId, order_id: reference.orderId, __retryAttempts: 1 }); }
      catch { response = null; }
      if (!current()) return;
      if (response?.st === true && ['confirmed', 'canceled'].includes(response.status)) {
        refreshHistory();
        setNotice({ text: response.status === 'confirmed' ? `Заказ №${reference.orderId} подтверждён. Его статус указан в истории.` : `Заказ №${reference.orderId} или его оплата отменены. Проверьте историю заказов.`, status: response.status });
        cleanReturn();
      } else {
        setNotice({ reference, text: 'Пока не удалось подтвердить заказ. Проверьте ещё раз — повторно оплачивать его не нужно.' });
      }
    }).finally(() => { if (isolatedRequest.current?.promise === promise) isolatedRequest.current = null; });
    isolatedRequest.current = { scope, promise };
    return promise;
  };

  useEffect(() => {
    if (!router.isReady || !city || !token || activeCity !== city) return;
    const store = useCartStore.getState();
    if (returned && router.asPath.split(/[?#]/, 1)[0] !== ordersPath) {
      void router.replace(sbpOrdersPath(router.asPath, city));
      return;
    }
    const restored = !store.pendingPaidOrder;
    let order = store.restorePaidOrder(city);
    if (returned && returnInfo.reference) {
      if (order && !samePaidOrder(order, returnInfo.reference, city)) {
        void verifySeparateReference(returnInfo.reference);
        return;
      }
      if (!order) order = store.registerPaidOrder({ ...returnInfo.reference, city, method: 'sbp', trackPurchase: false }, token);
    } else if (returned && returnInfo.legacy && !order) {
      const legacy = store.restorePendingSbpOrder(city);
      if (legacy?.city === city) order = store.registerPaidOrder({ ...legacy, method: 'sbp', trackPurchase: false }, token);
    }
    if (returned && (returnInfo.invalid || !order || order.city !== city || (returnInfo.legacy && order.method !== 'sbp'))) {
      refreshHistory();
      setNotice({ text: 'Вы вернулись с оплаты. Актуальный статус ваших заказов указан в истории ниже.' });
      cleanReturn();
      return;
    }
    if (returned) setNotice(null);
    if (order?.city === city && (restored || returned || order.startedAt)) {
      void store.startPaidConfirmation();
    }
  }, [city, activeCity, token, returned, router.isReady, router.asPath]);

  useEffect(() => { setDismissed(false); }, [pending?.orderId, pending?.pointId, state]);

  useEffect(() => {
    if (!router.isReady || !pending || pending.city !== city || state !== 'confirmed' || (!navigate && !returned)) return;
    if (returned && (returnInfo.invalid || (returnInfo.reference && !samePaidOrder(pending, returnInfo.reference, city)))) return;
    useCartStore.setState({ paidConfirmationNavigate: false });
    if (router.asPath.split(/[?#]/, 1)[0] !== ordersPath || returned) cleanReturn();
  }, [state, pending, city, navigate, returned, router.isReady, router.asPath]);

  useEffect(() => {
    if (returned && pending && pending.city === city && state === 'canceled' &&
      (!returnInfo.reference || samePaidOrder(pending, returnInfo.reference, city))) cleanReturn();
  }, [state, pending, city, returned, router.isReady, router.asPath]);

  const loginRequired = returned && !token;
  const activeNotice = notice?.reference && (!returned || !samePaidOrder({ ...notice.reference, city }, returnInfo.reference, city)) ? null : notice;
  if (dismissed || openConfirmForm || (!activeNotice && !loginRequired && (!pending || pending.city !== city || state === 'idle'))) return null;
  return (
    <Alert severity={(activeNotice ? activeNotice.status === 'confirmed' : state === 'confirmed') ? 'success' : 'info'} variant="outlined" icon={false} role="status"
      onClose={() => setDismissed(true)} closeText="Закрыть уведомление"
      sx={{ position: 'fixed', zIndex: 1500, top: 112, left: '50%', transform: 'translateX(-50%)', width: 'min(560px, calc(100vw - 32px))', boxSizing: 'border-box', px: 2, py: 1.5, alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '14px', bgcolor: '#fff', color: '#30343a', boxShadow: '0 12px 36px rgba(24, 29, 35, 0.18)', fontFamily: 'var(--inter-font)', fontSize: 14, lineHeight: 1.45,
        '& .MuiAlert-message': { flex: 1, minWidth: 0, py: 0 }, '& .MuiAlert-action': { alignItems: 'center', p: 0, ml: 1 }, '& .MuiIconButton-root': { width: 34, height: 34, color: '#5c626a' },
        '@media (min-width: 668px) and (max-width: 990px)': { top: 96, width: 'min(520px, calc(100vw - 32px))' },
        '@media (max-width: 667px)': { top: 'calc(76px + env(safe-area-inset-top, 0px))', width: 'calc(100vw - 24px)', px: 1.5, py: 1.25, borderRadius: '12px' } }}>
      {loginRequired ? 'Войдите в аккаунт, чтобы проверить оплату заказа.' : activeNotice ? <>
        {activeNotice.text}
        {activeNotice.reference && <Button disabled={activeNotice.busy} sx={{ fontSize: 14, minHeight: 40 }} onClick={() => { void verifySeparateReference(activeNotice.reference); }}>Проверить ещё раз</Button>}
      </> : <PaidOrderStatus />}
    </Alert>
  );
}
