import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CHECKOUT_WIDGET_SCRIPT_CONTEXT,
  ensureYooMoneyCheckoutWidget,
  getPaymentWidgetErrorCode,
} from '@/utils/checkoutWidgetLoader';
import {
  beginPaymentFlow,
  endPaymentFlow,
  getPaymentFlowId,
  trackPaymentClientEvent,
} from '@/components/api';

export default function OnlyPayPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState('loading');

  useEffect(() => {
    if (!token || token.length <= 8) return undefined;
    let cancelled = false;
    let failed = false;
    let succeeded = false;
    let checkout;
    let renderDeadline;
    const paymentFlowId = getPaymentFlowId({ create: false }) || beginPaymentFlow();
    const eventBase = {
      payment_flow_id: paymentFlowId,
      payment_action: 'widget',
      payment_method: 'pay_page',
    };
    const fail = (event, reason, details = {}) => {
      if (cancelled || failed || succeeded) return;
      failed = true;
      setState('error');
      trackPaymentClientEvent(event, { ...eventBase, ...details, outcome: 'error', reason });
      endPaymentFlow();
    };
    setState('loading');
    const scriptStartedAt = Date.now();
    let scriptFailure = 'script_error';
    trackPaymentClientEvent('widget_script_started', { ...eventBase, ...CHECKOUT_WIDGET_SCRIPT_CONTEXT, outcome: 'pending' });
    (async () => {
      const Widget = await ensureYooMoneyCheckoutWidget(12000, (reason) => { scriptFailure = reason; });
      if (cancelled) return;
      if (!Widget) {
        fail('widget_script_failed', scriptFailure, {
          ...CHECKOUT_WIDGET_SCRIPT_CONTEXT, duration_ms: Date.now() - scriptStartedAt,
        });
        return;
      }
      trackPaymentClientEvent('widget_script_loaded', {
        ...eventBase, ...CHECKOUT_WIDGET_SCRIPT_CONTEXT, duration_ms: Date.now() - scriptStartedAt, outcome: 'success',
      });
      try {
        checkout = new Widget({
          confirmation_token: token,
          error_callback: (error) => fail('widget_error', 'widget_callback', {
            provider_error_code: getPaymentWidgetErrorCode(error),
          }),
        });
        if (failed) { checkout.destroy(); return; }
        trackPaymentClientEvent('widget_constructed', { ...eventBase, outcome: 'success' });
        checkout.on('success', () => {
          if (cancelled) return;
          succeeded = true;
          clearTimeout(renderDeadline);
          setState('complete');
          trackPaymentClientEvent('widget_success', { ...eventBase, outcome: 'success' });
          try { checkout.destroy(); } catch {}
          endPaymentFlow();
        });
        checkout.on('fail', (error) => fail('widget_fail', 'widget_callback', {
          provider_error_code: getPaymentWidgetErrorCode(error),
        }));
        trackPaymentClientEvent('widget_render_started', { ...eventBase, widget_target: 'payment-form', outcome: 'pending' });
        await Promise.race([
          Promise.resolve(checkout.render('payment-form')),
          new Promise((_, reject) => {
            renderDeadline = setTimeout(() => reject(new Error('widget_render_timeout')), 12000);
          }),
        ]);
        if (cancelled || failed || succeeded) return;
        setState('ready');
        trackPaymentClientEvent('widget_rendered', { ...eventBase, widget_target: 'payment-form', outcome: 'success' });
      } catch {
        fail('widget_render_failed', 'widget_callback');
      } finally {
        clearTimeout(renderDeadline);
      }
    })();
    return () => {
      cancelled = true;
      clearTimeout(renderDeadline);
      try { checkout?.destroy(); } catch {}
    };
  }, [token, attempt]);

  if (!token || token.length <= 8) return null;
  return (
    <>
      {state === 'loading' ? <p role="status">Загружаем форму оплаты…</p> : null}
      {state === 'error' ? (
        <div role="alert">
          <p>Не удалось загрузить форму оплаты. Проверьте интернет и попробуйте ещё раз.</p>
          <button type="button" onClick={() => setAttempt((value) => value + 1)}>Повторить</button>
        </div>
      ) : null}
      <div id="payment-form" />
    </>
  );
}
