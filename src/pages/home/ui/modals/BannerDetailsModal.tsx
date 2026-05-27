'use client';

import { Button, ModalWrapper, Price, QuantityControl } from '@src/shared/ui';
import type { HomeBannerSlide, HomeProduct } from '../../model/types';
import './BannerDetailsModal.scss';

export type BannerDetailsModalProps = {
  banner: HomeBannerSlide | null;
  getCount: (product: HomeProduct) => number;
  onClose: () => void;
  onAdd: (product: HomeProduct) => void;
  onQuantityChange: (product: HomeProduct, value: number) => void;
  onProductOpen: (product: HomeProduct) => void;
};

export function BannerDetailsModal({
  banner,
  getCount,
  onClose,
  onAdd,
  onQuantityChange,
  onProductOpen,
}: BannerDetailsModalProps) {
  if (!banner) {
    return null;
  }

  const products = banner.products ?? [];
  const title = banner.title ?? banner.alt ?? 'Акция';

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
            onClick={onClose}
          >
            Условия акции
            <span aria-hidden="true">⌃</span>
          </button>
        </div>

        <div className="home-banner-modal__details">
          <section
            className="home-banner-modal__promo"
            aria-labelledby="home-banner-modal-title"
          >
            <h2 id="home-banner-modal-title">{title}</h2>
            {banner.text ? <p>{banner.text}</p> : null}
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
                          {count > 0 ? (
                            <QuantityControl
                              value={count}
                              size="md"
                              onChange={(value) =>
                                onQuantityChange(product, value)
                              }
                            />
                          ) : (
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
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </ModalWrapper>
  );
}
