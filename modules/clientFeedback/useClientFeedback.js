import { useCallback, useRef, useState } from 'react';

import { getLocalStorageItem } from '@/utils/browserStorage';
import {
  getClientFeedbackForm,
  submitClientFeedback,
} from './clientFeedbackApi';

/**
 * Загрузка формы отзыва и его отправка.
 *
 * Повторный клик по «Отправить», пока первый запрос не завершился, ничего не
 * делает: флаг в ref меняется сразу, а не после перерисовки. Сервер Шефа тоже
 * защищён от дублей (`already_existed`).
 */
export function useClientFeedback({ pointId, orderId, useMocks = false }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const submittingRef = useRef(false);
  const loadingRef = useRef(null);

  const loadForm = useCallback(() => {
    if (loadingRef.current) return loadingRef.current;

    setLoading(true);
    setError('');
    loadingRef.current = getClientFeedbackForm({
      pointId,
      orderId,
      token: getLocalStorageItem('token') || '',
      useMocks,
    })
      .then((result) => {
        if (!Array.isArray(result.targets) || result.targets.length === 0) {
          throw new Error('Для этого заказа пока нет активной формы отзыва');
        }
        setForm(result);
        setSuccess(result.submitted ? { already_existed: true } : null);
        return result;
      })
      .catch((requestError) => {
        setError(requestError.message || 'Не удалось загрузить форму');
        return null;
      })
      .finally(() => {
        loadingRef.current = null;
        setLoading(false);
      });

    return loadingRef.current;
  }, [orderId, pointId, useMocks]);

  const submit = useCallback(
    async (responses) => {
      if (submittingRef.current) return null;
      submittingRef.current = true;
      setSubmitting(true);
      setError('');
      try {
        const result = await submitClientFeedback({
          pointId,
          orderId,
          responses,
          token: getLocalStorageItem('token') || '',
          useMocks,
        });
        setSuccess(result);
        return result;
      } catch (requestError) {
        setError(requestError.message || 'Не удалось отправить отзыв');
        return null;
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
    },
    [orderId, pointId, useMocks]
  );

  return { form, loading, error, submitting, success, loadForm, submit };
}
