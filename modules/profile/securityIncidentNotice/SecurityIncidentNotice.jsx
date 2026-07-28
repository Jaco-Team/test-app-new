import { useCallback, useEffect, useRef, useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';

import { api } from '@/components/api';
import { useHeaderStoreNew, useProfileStore } from '@/components/store';
import { IconClose } from '@/ui/Icons';

import {
  clearPendingSecurityNoticeAck,
  hasPendingSecurityNoticeAck,
  isSecurityNoticeAccountRoute,
  markSecurityNoticeAckPending,
  normalizeSecurityNotice,
} from './securityIncidentNotice';
import styles from './SecurityIncidentNotice.module.scss';

const TITLE_ID = 'security-incident-notice-title';
const DESCRIPTION_ID = 'security-incident-notice-description';

export default function SecurityIncidentNotice({ city, pathname }) {
  const [open, setOpen] = useState(false);
  const acknowledgementAttemptsRef = useRef(new Set());
  const acknowledgedNoticesRef = useRef(new Set());

  const [isAuth, token] = useHeaderStoreNew((state) => [
    state.isAuth,
    state.token,
  ]);
  const [
    userInfo,
    securityNotice,
    securityNoticeUserId,
    markSecurityNoticeRead,
  ] = useProfileStore((state) => [
    state.userInfo,
    state.securityNotice,
    state.securityNoticeUserId,
    state.markSecurityNoticeRead,
  ]);

  const userId = userInfo?.id;
  const notice = normalizeSecurityNotice(securityNotice);
  const noticeId = notice?.id;
  const isNoticePending = notice?.pending === true;
  const isAccountRoute = isSecurityNoticeAccountRoute(pathname);
  const isCurrentUserNotice =
    String(securityNoticeUserId || '') === String(userId || '');

  const acknowledgeNotice = useCallback(
    async ({ noticeId, accountId, requestToken }) => {
      const attemptKey = `${accountId}:${noticeId}`;

      if (acknowledgementAttemptsRef.current.has(attemptKey)) return;
      acknowledgementAttemptsRef.current.add(attemptKey);

      const response = await api('profile', {
        type: 'set_security_notice_read',
        city_id: city,
        user_id: requestToken,
        notice_id: noticeId,
        __disableRetry: true,
      });

      if (response?.st === false) {
        acknowledgementAttemptsRef.current.delete(attemptKey);

        Sentry.captureMessage('Security notice acknowledgement failed', {
          level: 'warning',
          tags: {
            kind: 'security_notice_ack_failed',
            notice_id: noticeId,
          },
          extra: {
            city: city || null,
            accountId: String(accountId),
            responseText: response?.text || null,
          },
        });
        return;
      }

      acknowledgedNoticesRef.current.add(attemptKey);
      clearPendingSecurityNoticeAck(accountId, noticeId);
      markSecurityNoticeRead(noticeId, accountId);
    },
    [city, markSecurityNoticeRead]
  );

  useEffect(() => {
    if (
      !isAccountRoute ||
      isAuth !== 'auth' ||
      !token ||
      !userId ||
      !isCurrentUserNotice ||
      !noticeId
    ) {
      setOpen(false);
      return;
    }

    if (!isNoticePending) {
      clearPendingSecurityNoticeAck(userId, noticeId);
      setOpen(false);
      return;
    }

    const noticeKey = `${userId}:${noticeId}`;
    if (acknowledgedNoticesRef.current.has(noticeKey)) {
      markSecurityNoticeRead(noticeId, userId);
      setOpen(false);
      return;
    }

    if (hasPendingSecurityNoticeAck(userId, noticeId)) {
      setOpen(false);
      acknowledgeNotice({
        noticeId,
        accountId: userId,
        requestToken: token,
      });
      return;
    }

    setOpen(true);
  }, [
    acknowledgeNotice,
    isAccountRoute,
    isAuth,
    isCurrentUserNotice,
    isNoticePending,
    markSecurityNoticeRead,
    noticeId,
    token,
    userId,
  ]);

  const closeNotice = useCallback(() => {
    if (!open || !isNoticePending || !noticeId || !userId || !token) return;

    markSecurityNoticeAckPending(userId, noticeId);
    setOpen(false);

    acknowledgeNotice({
      noticeId,
      accountId: userId,
      requestToken: token,
    });
  }, [acknowledgeNotice, isNoticePending, noticeId, open, token, userId]);

  return (
    <Dialog
      open={open}
      onClose={closeNotice}
      scroll="paper"
      aria-labelledby={TITLE_ID}
      aria-describedby={DESCRIPTION_ID}
      className={styles.root}
      classes={{ paper: styles.paper }}
    >
      <DialogTitle id={TITLE_ID} className={styles.title}>
        Уважаемый клиент!
      </DialogTitle>

      <IconButton
        type="button"
        className={styles.closeButton}
        onClick={closeNotice}
        aria-label="Закрыть уведомление"
      >
        <IconClose aria-hidden="true" focusable="false" />
      </IconButton>

      <DialogContent dividers className={styles.content}>
        <div id={DESCRIPTION_ID}>
          <p>
            Вы получили сообщение о возможной компрометации нашего сервиса. Мы
            понимаем, что эта ситуация могла вызвать у вас беспокойство, и
            приносим извинения за доставленные неудобства.
          </p>
          <p>
            В настоящее время мы проводим расследование и устанавливаем все
            обстоятельства произошедшего. О результатах проверки мы сообщим
            дополнительно.
          </p>
          <p className={styles.important}>
            <strong>Важно:</strong> компания не хранит реквизиты банковских карт
            клиентов, включая номера карт, CVV/CVC-коды и PIN-коды.
          </p>
          <p className={styles.recommendationTitle}>
            Рекомендуем в целях безопасности:
          </p>
          <ul className={styles.recommendations}>
            <li>изменить пароль от личного кабинета;</li>
            <li>не переходить по ссылкам из подозрительных сообщений;</li>
            <li>
              не сообщать никому SMS-коды, CVV/CVC-коды, PIN-коды и пароли.
            </li>
          </ul>
          <p>
            Если у вас возникли вопросы, пожалуйста, свяжитесь с нами по
            телефону, указанному на сайте, или напишите в официальное сообщество
            Жако ВКонтакте.
          </p>
          <p>
            Спасибо за понимание и доверие. Мы уже сделали всё возможное, чтобы
            как можно быстрее завершить проверку и обеспечить безопасность наших
            клиентов.
          </p>
        </div>
      </DialogContent>

      <DialogActions className={styles.actions}>
        <Button
          type="button"
          variant="contained"
          className={styles.closeAction}
          onClick={closeNotice}
          autoFocus
        >
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
}
