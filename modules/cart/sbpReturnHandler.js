import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';

import { useCartStore, useHeaderStoreNew } from '@/components/store.js';
import {
  buildPurchasePayload,
  reachGoal,
  trackPurchase,
} from '@/utils/metrika';

const POLL_INTERVAL_MS = 3000;
const MAX_CHECKS = 20;

export default function SbpReturnHandler({ city }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const token = useHeaderStoreNew((state) => state.token);
  const setActiveModalAlert = useHeaderStoreNew(
    (state) => state.setActiveModalAlert
  );
  const restorePendingSbpOrder = useCartStore(
    (state) => state.restorePendingSbpOrder
  );
  const checkSbpPaymentStatus = useCartStore(
    (state) => state.checkSbpPaymentStatus
  );
  const returnedFromSbp = router.isReady && router.query.sbp_return === '1';
  const ordersPath = `/${city}/zakazy`;
  const isOrdersPage =
    router.isReady && router.asPath.split(/[?#]/, 1)[0] === ordersPath;

  useEffect(() => {
    if (returnedFromSbp) setDismissed(false);
  }, [returnedFromSbp]);

  useEffect(() => {
    if (returnedFromSbp && city && !isOrdersPage) {
      void router.replace(`${ordersPath}?sbp_return=1`);
    }
  }, [returnedFromSbp, city, isOrdersPage, ordersPath, router]);

  useEffect(() => {
    if (!returnedFromSbp || !city || !isOrdersPage) return;

    const pending = restorePendingSbpOrder(city);
    if (!pending || pending.city !== city) {
      setMessage(
        'Не удалось найти заказ для проверки оплаты. Проверьте его в личном кабинете.'
      );
      return;
    }

    if (!token) {
      setMessage('Войдите в аккаунт, чтобы проверить оплату заказа.');
      return;
    }

    let active = true;
    let finished = false;
    let inFlight = false;
    let checks = 0;
    let timer;
    let initialCheck;
    setMessage(`Проверяем оплату заказа №${pending.orderId}…`);

    const stop = () => {
      finished = true;
      clearTimeout(initialCheck);
      clearInterval(timer);
    };

    const showResult = (text, success = false) => {
      if (!active || finished) return;
      stop();
      setMessage('');
      setActiveModalAlert(true, text, success);
      void router.replace(ordersPath, undefined, { shallow: true });
    };

    const onSuccess = () => {
      if (!active || finished) return;
      const order = pending.check?.order;
      const orderType = Number(order?.type_order_) === 2 ? 'pic' : 'dev';
      const goalParams = {
        city: city === 'samara' ? 'Самара' : 'Тольятти',
        type_pay: 'СБП',
        typeOrder: orderType === 'pic' ? 'Самовывоз' : 'Доставка',
      };
      try {
        reachGoal('pay_order', goalParams);
        reachGoal(`pay_order_${orderType}_sbp`, goalParams);
        trackPurchase(
          buildPurchasePayload({
            order,
            items: (pending.check?.items ?? []).map((item, index) => ({
              id: item?.id ?? 0,
              name: item?.name ?? '',
              price: item?.price ?? 0,
              category: item?.cat_name ?? '',
              quantity: item?.count ?? 0,
              position: index,
            })),
            goalParams,
          })
        );
      } catch {
        // Аналитика не должна мешать показу результата оплаты.
      }
      showResult('Оплата СБП прошла успешно. Открываем ваши заказы.', true);
    };

    const check = async () => {
      if (!active || finished || inFlight) return;
      inFlight = true;
      checks += 1;
      const status = await checkSbpPaymentStatus(token, onSuccess);
      inFlight = false;
      if (!active || finished) return;
      if (status === 'succeeded') {
        onSuccess();
      } else if (status === 'canceled') {
        showResult(
          'Оплата СБП не завершена. Для новой попытки оформите заказ заново.'
        );
      } else if (status === 'missing') {
        showResult(
          'Не удалось найти заказ для проверки оплаты. Проверьте его в личном кабинете.'
        );
      } else if (checks >= MAX_CHECKS) {
        showResult(
          'Пока не удалось подтвердить оплату. Проверьте заказ в личном кабинете позже.'
        );
      } else if (status === 'processing') {
        setMessage(
          `Банк подтвердил платёж по заказу №${pending.orderId}. Ожидаем подтверждения заказа…`
        );
      }
    };

    initialCheck = setTimeout(() => {
      void check();
    }, 0);
    timer = setInterval(check, POLL_INTERVAL_MS);
    return () => {
      active = false;
      clearTimeout(initialCheck);
      clearInterval(timer);
    };
  }, [
    returnedFromSbp,
    city,
    isOrdersPage,
    ordersPath,
    token,
    restorePendingSbpOrder,
    checkSbpPaymentStatus,
    setActiveModalAlert,
    router,
  ]);

  if (!returnedFromSbp || !message || dismissed) return null;

  return (
    <Alert
      severity="info"
      variant="outlined"
      icon={false}
      role="status"
      onClose={() => setDismissed(true)}
      closeText="Закрыть уведомление"
      sx={{
        position: 'fixed',
        zIndex: 1500,
        top: 112,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(560px, calc(100vw - 32px))',
        boxSizing: 'border-box',
        px: 2,
        py: 1.5,
        alignItems: 'center',
        border: '1px solid #e5e7eb',
        borderRadius: '14px',
        bgcolor: '#fff',
        color: '#30343a',
        boxShadow: '0 12px 36px rgba(24, 29, 35, 0.18)',
        fontFamily: 'var(--inter-font)',
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.45,
        '& .MuiAlert-message': { flex: 1, minWidth: 0, py: 0 },
        '& .MuiAlert-action': { alignItems: 'center', p: 0, ml: 1 },
        '& .MuiIconButton-root': {
          width: 34,
          height: 34,
          color: '#5c626a',
          '&:hover': { bgcolor: '#f3f4f6' },
        },
        '@media (min-width: 668px) and (max-width: 990px)': {
          top: 96,
          width: 'min(520px, calc(100vw - 32px))',
        },
        '@media (max-width: 667px)': {
          top: 'calc(76px + env(safe-area-inset-top, 0px))',
          width: 'calc(100vw - 24px)',
          px: 1.5,
          py: 1.25,
          fontSize: 14,
          borderRadius: '12px',
          '& .MuiIconButton-root': { width: 32, height: 32 },
        },
      }}
    >
      {message}
    </Alert>
  );
}
