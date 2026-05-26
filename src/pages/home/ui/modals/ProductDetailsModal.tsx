'use client';

import { Button, ModalWrapper, Price, QuantityControl } from '@src/shared/ui';
import type { HomeProduct } from '../../model/types';
import './ProductDetailsModal.scss';

export type ProductDetailsModalProps = {
  product: HomeProduct | null;
  count: number;
  onClose: () => void;
  onAdd: () => void;
  onQuantityChange: (value: number) => void;
};

export function ProductDetailsModal({
  product,
  count,
  onClose,
  onAdd,
  onQuantityChange,
}: ProductDetailsModalProps) {
  if (!product) {
    return null;
  }

  return (
    <ModalWrapper
      open={Boolean(product)}
      onClose={onClose}
      className="home-product-modal"
      paperClassName="home-product-modal__paper"
      contentClassName="home-product-modal__content"
      closeOutside
      closeOnBackdrop
      variant="responsive"
      labelledBy="home-product-modal-title"
    >
      <div className="home-product-modal__layout">
        <div className="home-product-modal__media">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="home-product-modal__body">
          <div className="home-product-modal__heading">
            <h2 id="home-product-modal-title">{product.title}</h2>
            {product.meta ? (
              <p>
                {Array.isArray(product.meta)
                  ? product.meta.join(' · ')
                  : product.meta}
              </p>
            ) : null}
          </div>

          {product.detailText ? (
            <p className="home-product-modal__description">
              {product.detailText}
            </p>
          ) : null}

          {product.composition ? (
            <section className="home-product-modal__section">
              <h3>Состав</h3>
              <p>{product.composition}</p>
            </section>
          ) : null}

          <div className="home-product-modal__facts">
            {product.weight ? <span>{product.weight} г</span> : null}
            {product.nutrition?.map((item) => (
              <span key={item.label}>
                {item.label}: {item.value}
              </span>
            ))}
          </div>

          <div className="home-product-modal__action">
            {count > 0 ? (
              <QuantityControl value={count} onChange={onQuantityChange} />
            ) : (
              <Button
                tone="primary"
                size="lg"
                density="regular"
                onClick={onAdd}
              >
                <Price
                  value={product.price}
                  oldValue={product.oldPrice}
                  size="md"
                />
              </Button>
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
