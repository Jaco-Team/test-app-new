'use client';

import { useEffect } from 'react';
import { ModalWrapper } from '@src/shared/ui';
import { useAuthStore } from '@src/features/auth/model/authStore';
import { useHeaderStore } from '@src/entities/header';
import { AuthModalBody } from './AuthModalBody';
import './AuthModal.scss';

export type AuthModalProps = {
  city: string;
};

export function AuthModal({ city }: AuthModalProps) {
  const open = useHeaderStore((state) => state.openAuthModal);
  const isAuth = useHeaderStore((state) => state.isAuth);
  const closeModalAuth = useAuthStore((state) => state.closeModalAuth);
  const yandexAuthCheck = useAuthStore((state) => state.yandexAuthCheck);

  useEffect(() => {
    if (isAuth === 'auth' && open) {
      closeModalAuth();
    }
  }, [closeModalAuth, isAuth, open]);

  useEffect(() => {
    const search = window.location.search;
    const match = search.split('?code=');
    if (match[1]) {
      window.history.replaceState(null, '', window.location.pathname);
      void yandexAuthCheck(match[1]);
    }
  }, [yandexAuthCheck]);

  return (
    <ModalWrapper
      open={open}
      onClose={closeModalAuth}
      variant="responsive"
      className="auth-modal"
      contentClassName="auth-modal__content"
      closeOutside
      closeOnBackdrop
      labelledBy="auth-modal-title"
    >
      <AuthModalBody city={city} />
    </ModalWrapper>
  );
}
