import React, { useEffect } from 'react';
import Image from 'next/image';
import './PromoModal.scss';

interface ProductItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rollsCount?: number;
  piecesCount?: number;
  weight?: number;
}

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  badgeText: string;
  price: number;
  bannerImage: string;
  productImage: string;
  productName: string;
  productDescription: string;
  marketingTitle: string;
  marketingDescription: string;
  endDate?: string;
  relatedProducts?: ProductItem[];
}

export const PromoModal: React.FC<PromoModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badgeText,
  price,
  bannerImage,
  productImage,
  productName,
  productDescription,
  marketingTitle,
  marketingDescription,
  endDate,
  relatedProducts = [],
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="promo-modal-overlay" onClick={onClose}>
      <div className="promo-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="promo-modal-close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <div
          className="promo-modal-banner"
          style={{ background: `url('${bannerImage}') no-repeat center/cover` }}
        >
          <div className="promo-modal-banner-content">
            <div className="promo-modal-banner-text">
              <div className="promo-modal-conditions">
                <span>Условия акции</span>
                <svg
                  className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-q7mezt"
                  focusable="false"
                  color="white"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="promo-modal-body">
          <div className="promo-modal-composition">
            <h3 className="promo-modal-section-title">Состав</h3>
            <div className="promo-modal-composition-item">
              <span className="promo-modal-composition-number">1.</span>
              <div className="promo-modal-composition-image">
                <Image
                  src={productImage}
                  alt={productName}
                  width={120}
                  height={120}
                />
              </div>
              <div className="promo-modal-composition-info">
                <h4 className="promo-modal-composition-name">{productName}</h4>
                <p className="promo-modal-composition-description">
                  {productDescription}
                </p>
                <span className="promo-modal-composition-price">{price} ₽</span>
              </div>
            </div>
          </div>

          <div className="promo-modal-description">
            <h3 className="promo-modal-description-title">{marketingTitle}</h3>
            <div
              className="promo-modal-description-text"
              dangerouslySetInnerHTML={{ __html: marketingDescription }}
            />
            {endDate && (
              <p className="promo-modal-end-date">
                Новинка доступна для заказа до {endDate} г.
              </p>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="promo-modal-related">
            <h3 className="promo-modal-related-title">Попробуйте также</h3>
            <div className="promo-modal-related-list">
              {relatedProducts.map((product) => (
                <div key={product.id} className="promo-modal-related-item">
                  <div className="promo-modal-related-image">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={150}
                      height={150}
                    />
                  </div>
                  <p className="promo-modal-related-meta">
                    {product.rollsCount} ролла | {product.piecesCount} шт. |{' '}
                    {product.weight} г
                  </p>
                  <p className="promo-modal-related-name">{product.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
