import { useState, useEffect } from 'react';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  beginPaymentFlow,
  endPaymentFlow,
  getPaymentFlowId,
  trackPaymentClientEvent,
} from '@/components/api';

export default function OnlyPayPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  //console.log( 'token', token )

  function onLoadFunc(token) {
    //console.log( 'token 11', token, searchParams.get('token') )
    if (token?.length > 8 && typeof window != 'undefined') {
      const paymentFlowId =
        getPaymentFlowId({ create: false }) || beginPaymentFlow();
      const eventBase = {
        payment_flow_id: paymentFlowId,
        payment_action: 'widget',
        payment_method: 'pay_page',
      };
      trackPaymentClientEvent('widget_script_loaded', {
        ...eventBase,
        outcome: 'success',
      });

      //console.log( 'token 55', token )

      if (typeof window.YooMoneyCheckoutWidget !== 'function') {
        trackPaymentClientEvent('widget_script_failed', {
          ...eventBase,
          outcome: 'error',
          reason: 'script_error',
        });
        endPaymentFlow();
        return;
      }

      let checkout;
      try {
        checkout = new window.YooMoneyCheckoutWidget({
          confirmation_token: token,

          error_callback: function (error) {
            trackPaymentClientEvent('widget_error', {
              ...eventBase,
              outcome: 'error',
              reason: 'widget_callback',
              provider_status: String(
                error?.error?.code ||
                  error?.code ||
                  error?.status ||
                  error?.type ||
                  ''
              )
                .toLowerCase()
                .slice(0, 64),
            });
          },
        });
        trackPaymentClientEvent('widget_constructed', {
          ...eventBase,
          outcome: 'success',
        });
      } catch {
        trackPaymentClientEvent('widget_error', {
          ...eventBase,
          outcome: 'error',
          reason: 'constructor_error',
        });
        endPaymentFlow();
        return;
      }

      checkout.on('success', () => {
        trackPaymentClientEvent('widget_success', {
          ...eventBase,
          outcome: 'success',
        });
        checkout.destroy();
        endPaymentFlow();
        //funcClose();

        console.log('success');
      });

      checkout.on('fail', (error) => {
        trackPaymentClientEvent('widget_fail', {
          ...eventBase,
          outcome: 'failure',
          reason: 'widget_callback',
          provider_status: String(
            error?.error?.code ||
              error?.code ||
              error?.status ||
              error?.type ||
              ''
          )
            .toLowerCase()
            .slice(0, 64),
        });
        checkout.destroy();
        endPaymentFlow();
        //return 'nothing';

        console.log('fail');
      });

      setTimeout(() => {
        trackPaymentClientEvent('widget_render_started', {
          ...eventBase,
          widget_target: 'payment-form',
          outcome: 'pending',
        });
        try {
          Promise.resolve(checkout.render('payment-form'))
            .then(() =>
              trackPaymentClientEvent('widget_rendered', {
                ...eventBase,
                widget_target: 'payment-form',
                outcome: 'success',
              })
            )
            .catch(() =>
              trackPaymentClientEvent('widget_render_failed', {
                ...eventBase,
                widget_target: 'payment-form',
                outcome: 'error',
                reason: 'widget_callback',
              })
            );
        } catch {
          trackPaymentClientEvent('widget_render_failed', {
            ...eventBase,
            widget_target: 'payment-form',
            outcome: 'error',
            reason: 'widget_callback',
          });
        }
      }, 300);
    }
  }

  if (!token) {
    return false;
  }

  return (
    <>
      <Script
        src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js"
        onLoad={() => onLoadFunc(token)}
        onError={() => {
          const paymentFlowId =
            getPaymentFlowId({ create: false }) || beginPaymentFlow();
          trackPaymentClientEvent('widget_script_failed', {
            payment_flow_id: paymentFlowId,
            payment_action: 'widget',
            payment_method: 'pay_page',
            outcome: 'error',
            reason: 'script_error',
          });
          endPaymentFlow();
        }}
      />

      <div id="payment-form" />
    </>
  );
}
