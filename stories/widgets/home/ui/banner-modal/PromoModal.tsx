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
    <div className="PromoModal-overlay" onClick={onClose}>
      <div className="PromoModal" onClick={(e) => e.stopPropagation()}>
        <button
          className="PromoModal-close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <div
          className="PromoModal-banner"
          style={{ background: `url('${bannerImage}') no-repeat center/cover` }}
        >
          <div className="PromoModal-banner-content">
            <div className="PromoModal-banner-text">
              <div className="PromoModal-conditions">
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

        <div className="PromoModal-body">
          <div className="PromoModal-composition">
            <h3 className="PromoModal-section-title">Состав</h3>
            <div className="PromoModal-composition-item">
              <span className="PromoModal-composition-number">1.</span>
              <div className="PromoModal-composition-image">
                <Image
                  src={productImage}
                  alt={productName}
                  width={120}
                  height={120}
                />
              </div>
              <div className="PromoModal-composition-info">
                <h4 className="PromoModal-composition-name">{productName}</h4>
                <p className="PromoModal-composition-description">
                  {productDescription}
                </p>
                <span className="PromoModal-composition-price">{price} ₽</span>
              </div>
            </div>
          </div>

          <div className="PromoModal-description">
            <h3 className="PromoModal-description-title">{marketingTitle}</h3>
            <div
              className="PromoModal-description-text"
              dangerouslySetInnerHTML={{ __html: marketingDescription }}
            />
            {endDate && (
              <p className="PromoModal-end-date">
                Новинка доступна для заказа до {endDate} г.
              </p>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="PromoModal-related">
            <h3 className="PromoModal-related-title">Попробуйте также</h3>
            <div className="PromoModal-related-list">
              {relatedProducts.map((product) => (
                <div key={product.id} className="PromoModal-related-item">
                  <div className="PromoModal-related-image">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={150}
                      height={150}
                    />
                  </div>
                  <p className="PromoModal-related-meta">
                    {product.rollsCount} ролла | {product.piecesCount} шт. |{' '}
                    {product.weight} г
                  </p>
                  <p className="PromoModal-related-name">{product.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
