'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cityPath } from '@src/shared/lib/sitePaths';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/utils/browserStorage';
import './FooterCookie.scss';

export type FooterCookieProps = {
  citySlug: string;
};

export function FooterCookie({ citySlug }: FooterCookieProps) {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const saved = getLocalStorageItem('setCookie');
    setAccepted(Boolean(saved?.length));
  }, []);

  if (accepted) {
    return null;
  }

  return (
    <div className="ui-footer-cookie">
      <div className="ui-footer-cookie__inner">
        <p className="ui-footer-cookie__text">
          Мы{' '}
          <Link
            className="ui-footer-cookie__link"
            href={cityPath(citySlug, 'politika-legal')}
          >
            используем
          </Link>{' '}
          файлы «Cookie» и метрическую систему «Яндекс.Метрика» для сбора и
          анализа информации о производительности и использовании сайта.
          Продолжая пользоваться сайтом, вы соглашаетесь на размещение файлов
          «Cookie» и обработку данных метрических систем.
        </p>
        <button
          className="ui-footer-cookie__accept"
          type="button"
          onClick={() => {
            setLocalStorageItem('setCookie', '1');
            setAccepted(true);
          }}
        >
          Согласен
        </button>
      </div>
    </div>
  );
}
