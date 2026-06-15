'use client';

import Link from 'next/link';
import { useCabinetAccess } from '@src/features/cabinet-access';
import { Button } from '@src/shared/ui';
import { cityPath } from '@src/shared/lib/sitePaths';
import { CompactCabinetGate } from '@src/widgets/cabinet';
import { useAddressPage } from '../model/useAddressPage';
import './AddressPage.scss';

function isMainAddress(value: unknown): boolean {
  return parseInt(String(value ?? 0), 10) === 1;
}

function addressTitle(address: Record<string, unknown>): string {
  const title = String(address.addr_name ?? '').trim();
  if (title.length) {
    return title;
  }

  const city = String(address.city_name ?? '').trim();
  const street = String(address.street ?? address.name_street ?? '').trim();

  return [city, street].filter(Boolean).join(', ') || 'Адрес доставки';
}

function addressText(address: Record<string, unknown>): string {
  const city = String(address.city_name ?? '').trim();
  const street = String(address.street ?? address.name_street ?? '').trim();
  const home = String(address.home ?? '').trim();
  const kv = String(address.kv ?? '').trim();

  return [
    city.length ? `г. ${city}` : '',
    street,
    home.length ? `д. ${home}` : '',
    kv.length ? `кв. ${kv}` : '',
  ]
    .filter(Boolean)
    .join(', ');
}

export function AddressPage() {
  const { citySlug, compact, ready, token } = useCabinetAccess();
  const { streets, openModalAddr, delAddr } = useAddressPage(citySlug, token);

  return (
    <CompactCabinetGate
      ready={ready}
      compact={compact}
      fallbackHref={cityPath(citySlug, 'profile')}
    >
      <section className="address-page">
        <div className="address-page__toolbar">
          <Link
            className="address-page__back"
            href={cityPath(citySlug, 'account')}
          >
            Назад
          </Link>
        </div>

        <h1 className="address-page__title">Мои адреса</h1>

        {streets.length ? (
          <div className="address-page__list">
            {streets.map((street) => (
              <article
                key={String(street.id)}
                className={
                  'address-page__card' +
                  (isMainAddress(street.is_main)
                    ? ' address-page__card--main'
                    : '')
                }
              >
                <div className="address-page__head">
                  <h2 className="address-page__name">
                    {addressTitle(street as Record<string, unknown>)}
                  </h2>
                  {isMainAddress(street.is_main) ? (
                    <span className="address-page__badge">Основной</span>
                  ) : null}
                </div>
                <p className="address-page__text">
                  {addressText(street as Record<string, unknown>)}
                </p>
                <div className="address-page__actions">
                  <button
                    type="button"
                    className="address-page__action"
                    onClick={() => void openModalAddr(street.id)}
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    className="address-page__action address-page__action--danger"
                    onClick={() => void delAddr(street.id, token)}
                  >
                    Удалить
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="address-page__empty">Сохраненных адресов пока нет.</p>
        )}

        <Button
          className="address-page__add"
          tone="primary"
          size="lg"
          range="compact"
          fullWidth
          onClick={() => void openModalAddr(0)}
        >
          Добавить адрес
        </Button>
      </section>
    </CompactCabinetGate>
  );
}
