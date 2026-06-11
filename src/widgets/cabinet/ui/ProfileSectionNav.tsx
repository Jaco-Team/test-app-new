'use client';

import Link from 'next/link';
import { useProfileStore } from '@src/entities/profile';
import { cityPath } from '@src/shared/lib/sitePaths';
import './ProfileSectionNav.scss';

export type ProfileSectionKey = 'profile' | 'zakazy' | 'promokody';

type ProfileSectionNavProps = {
  citySlug: string;
  activePage: ProfileSectionKey;
};

const NAV_ITEMS: Array<{
  key: ProfileSectionKey;
  label: string;
}> = [
  { key: 'profile', label: 'Личные данные' },
  { key: 'zakazy', label: 'История заказов' },
  { key: 'promokody', label: 'Мои промокоды' },
];

export function ProfileSectionNav({
  citySlug,
  activePage,
}: ProfileSectionNavProps) {
  const countPromo = useProfileStore((state) => state.countPromo);
  const countOrders = useProfileStore((state) => state.countOrders);

  return (
    <nav className="profile-section-nav" aria-label="Разделы кабинета">
      <span className="profile-section-nav__label">Личный кабинет</span>
      <div className="profile-section-nav__items">
        {NAV_ITEMS.map((item) => {
          const hasMarker =
            (item.key === 'zakazy' && countOrders > 0) ||
            (item.key === 'promokody' && countPromo > 0);

          return (
            <Link
              key={item.key}
              href={cityPath(citySlug, item.key)}
              className={
                'profile-section-nav__item' +
                (activePage === item.key
                  ? ' profile-section-nav__item--active'
                  : '')
              }
            >
              <span>{item.label}</span>
              {hasMarker ? (
                <span
                  className="profile-section-nav__marker"
                  aria-hidden="true"
                />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
