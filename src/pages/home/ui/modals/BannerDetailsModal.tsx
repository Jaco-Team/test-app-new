'use client';

import { useCallback, useRef } from 'react';
import { api } from '@src/shared/api';
import { Button, ModalWrapper, Price, QuantityControl } from '@src/shared/ui';
import type { HomeBannerSlide, HomeProduct } from '../../model/types';
import './BannerDetailsModal.scss';

export type BannerDetailsModalProps = {
  banner: HomeBannerSlide | null;
  citySlug: string;
  getCount: (product: HomeProduct) => number;
  onClose: () => void;
  onAdd: (product: HomeProduct) => void;
  onQuantityChange: (product: HomeProduct, value: number) => void;
  onProductOpen: (product: HomeProduct) => void;
};

export function BannerDetailsModal({
  banner,
  citySlug,
  getCount,
  onClose,
  onAdd,
  onQuantityChange,
  onProductOpen,
}: BannerDetailsModalProps) {
  const promoRef = useRef<HTMLElement>(null);

  const scrollToPromo = useCallback(() => {
    const promo = promoRef.current;
    if (!promo) {
      return;
    }

    const scrollParent = promo.closest('.MuiDialogContent-root');
    if (scrollParent instanceof HTMLElement) {
      const offset =
        promo.getBoundingClientRect().top -
        scrollParent.getBoundingClientRect().top +
        scrollParent.scrollTop;

      scrollParent.scrollTo({ top: offset, behavior: 'smooth' });
      return;
    }

    promo.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const activatePromo = useCallback(async () => {
    if (!banner?.promoInfo?.name) {
      return;
    }

    const response = (await api('cart', {
      type: 'get_promo',
      city_id: banner.promoInfo.cityId || citySlug,
      promo_name: banner.promoInfo.name,
    })) as { st?: boolean };

    if (response?.st !== false) {
      onClose();
    }
  }, [banner, citySlug, onClose]);

  if (!banner) {
    return null;
  }

  const products = banner.products ?? [];
  const title = banner.title ?? banner.alt ?? 'Акция';
  const promoAction = banner.promoAction ?? 0;
  const showPromoCta = promoAction !== 0 && Boolean(banner.promoInfo?.name);
  const priceOnlyRows = promoAction === 2;

  return (
    <ModalWrapper
      open={Boolean(banner)}
      onClose={onClose}
      className="home-banner-modal"
      paperClassName="home-banner-modal__paper"
      contentClassName="home-banner-modal__content"
      closeOutside
      closeOnBackdrop
      variant="responsive"
      labelledBy="home-banner-modal-title"
    >
      <div className="home-banner-modal__shell">
        <div className="home-banner-modal__media">
          <picture>
            {banner.imageWide ? (
              <source media="(min-width: 991px)" srcSet={banner.imageWide} />
            ) : null}
            <img src={banner.image} alt={banner.alt ?? title} />
          </picture>
          <button
            className="home-banner-modal__conditions"
            type="button"
            onClick={scrollToPromo}
          >
            Условия акции
            <span aria-hidden="true">⌃</span>
          </button>
        </div>

        <div className="home-banner-modal__details">
          <section
            ref={promoRef}
            className="home-banner-modal__promo"
            aria-labelledby="home-banner-modal-title"
          >
            <h2 id="home-banner-modal-title">{title}</h2>
            {banner.text ? (
              <div
                className="home-banner-modal__promo-html"
                dangerouslySetInnerHTML={{ __html: banner.text }}
              />
            ) : null}
          </section>

          <section className="home-banner-modal__composition">
            {products.length ? <h3>Состав</h3> : null}
            {products.length ? (
              <div className="home-banner-modal__products">
                {products.map((product, index) => {
                  const count = getCount(product);
                  return (
                    <article
                      className="home-banner-modal__product"
                      key={product.id}
                    >
                      <span className="home-banner-modal__product-number">
                        {index + 1}
                      </span>
                      <button
                        className="home-banner-modal__product-media"
                        type="button"
                        onClick={() => onProductOpen(product)}
                      >
                        <img src={product.image} alt={product.title} />
                      </button>
                      <div className="home-banner-modal__product-body">
                        <button
                          className="home-banner-modal__product-title"
                          type="button"
                          onClick={() => onProductOpen(product)}
                        >
                          {product.title}
                        </button>
                        {product.detailText ? (
                          <p className="home-banner-modal__product-text">
                            {product.detailText}
                          </p>
                        ) : null}
                        <div className="home-banner-modal__product-action">
                          {priceOnlyRows ? (
                            product.price > 0 ? (
                              <span className="home-banner-modal__product-price">
                                <Price value={product.price} size="sm" />
                              </span>
                            ) : null
                          ) : count > 0 ? (
                            <QuantityControl
                              value={count}
                              size="md"
                              onChange={(value) =>
                                onQuantityChange(product, value)
                              }
                            />
                          ) : product.price > 0 ? (
                            <Button
                              tone="muted"
                              size="md"
                              density="regular"
                              onClick={() => onAdd(product)}
                            >
                              <Price
                                value={product.price}
                                oldValue={product.oldPrice}
                                size="sm"
                              />
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : null}

            {showPromoCta ? (
              <div className="home-banner-modal__cta">
                <button type="button" onClick={() => void activatePromo()}>
                  {banner.buttonLabel ?? 'Воспользоваться акцией'}
                </button>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </ModalWrapper>
  );
}
