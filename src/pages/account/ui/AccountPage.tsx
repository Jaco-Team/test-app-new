'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@src/features/auth/model/authStore';
import { cityBase, cityPath } from '@src/shared/lib/sitePaths';
import { useCabinetAccess } from '@src/pages/profile/model/useCabinetAccess';
import { useAccountPage } from '../model/useAccountPage';
import './AccountPage.scss';

export function AccountPage() {
  const router = useRouter();
  const { citySlug, compact, ready, token } = useCabinetAccess();
  const { userInfo, shortName, countPromo, countOrders } = useAccountPage(
    citySlug,
    token
  );
  const signOut = useAuthStore((state) => state.signOut);

  useEffect(() => {
    if (ready && !compact) {
      router.replace(cityPath(citySlug, 'profile'));
    }
  }, [citySlug, compact, ready, router]);

  if (!ready || !compact) {
    return null;
  }

  return (
    <section className="account-page">
      <div className="account-page__hero">
        <div className="account-page__avatar" aria-hidden="true">
          {shortName || 'Ж'}
        </div>
        <div className="account-page__identity">
          <h1 className="account-page__name">
            {String(userInfo.name ?? 'Мой Жако')}
          </h1>
          <p className="account-page__phone">{String(userInfo.login ?? '')}</p>
        </div>
      </div>

      <div className="account-page__links">
        <Link
          href={cityPath(citySlug, 'address')}
          className="account-page__link"
        >
          <span>Адреса доставки</span>
        </Link>
        <Link
          href={cityPath(citySlug, 'profile')}
          className="account-page__link"
        >
          <span>Личные данные</span>
        </Link>
        <Link
          href={cityPath(citySlug, 'promokody')}
          className="account-page__link"
        >
          <span>Промокоды и подарки</span>
          {countPromo > 0 ? (
            <span className="account-page__marker" aria-hidden="true" />
          ) : null}
        </Link>
        <Link
          href={cityPath(citySlug, 'zakazy')}
          className="account-page__link"
        >
          <span>История заказов</span>
          {countOrders > 0 ? (
            <span className="account-page__marker" aria-hidden="true" />
          ) : null}
        </Link>
      </div>

      <button
        type="button"
        className="account-page__logout"
        onClick={() => {
          signOut(citySlug);
          router.replace(cityBase(citySlug));
        }}
      >
        Выйти
      </button>
    </section>
  );
}
