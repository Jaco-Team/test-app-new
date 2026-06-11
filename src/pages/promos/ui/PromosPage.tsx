'use client';

import { useCabinetAccess } from '@src/features/cabinet-access';
import { usePromosPage } from '../model/usePromosPage';
import './PromosPage.scss';

async function copyPromoCode(code: string) {
  if (!code.trim().length || typeof navigator === 'undefined') {
    return;
  }

  await navigator.clipboard.writeText(code);
}

export function PromosPage() {
  const { citySlug, ready, token } = useCabinetAccess();
  const { promoListActive } = usePromosPage(citySlug, token);

  if (!ready) {
    return null;
  }

  return (
    <section className="promos-page">
      {promoListActive.length === 0 ? (
        <div className="promos-page__empty">
          Сейчас активных промокодов нет. Новые предложения появятся здесь.
        </div>
      ) : (
        <div className="promos-page__grid">
          {promoListActive.map((promo) => (
            <article
              key={`${promo.promo_name}-${promo.city_id ?? 'city'}`}
              className="promos-page__card"
            >
              <div className="promos-page__body">
                <h2 className="promos-page__card-title">
                  {promo.promo_action_text || 'Промокод'}
                </h2>
                <p className="promos-page__card-text">{promo.promo_text}</p>
              </div>
              <div className="promos-page__foot">
                <span className="promos-page__expiry">
                  Срок действия: {promo.diff_days_text || 'уточняется'}
                </span>
                <button
                  type="button"
                  className="promos-page__code"
                  onClick={() => void copyPromoCode(String(promo.promo_name))}
                >
                  {promo.promo_name}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
