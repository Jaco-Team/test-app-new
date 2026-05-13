import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import './ProductModal.scss';
import { ModalItemPCvalue } from '@stories/entities/product/ui/nutrition/ModalItemPCvalue';

interface RelatedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rollsCount: number;
  piecesCount: number;
  weight: number;
}

interface RollItem {
  id: number;
  name: string;
  description: string;
  image: string;
  calories?: number;
  ingredients?: string;
  nutrition?: {
    proteins: number;
    fats: number;
    carbohydrates: number;
  };
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productImage?: string;
  productName?: string;
  rollsCount?: number;
  piecesCount?: number;
  weight?: number;
  productDescription?: string;
  price?: number;
  relatedProducts?: RelatedProduct[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productImage = '/images/sushi-product.jpg',
  productName = 'Атлантида сет',
  rollsCount = 4,
  piecesCount = 32,
  weight = 1129,
  productDescription = 'Цезарь с курицей запечённый унаги, Филадельфия Лайт, Аквиланг запечённый унаги, Калифорния с лососем Люкс',
  price = 1429,
  relatedProducts = [],
}) => {
  const [activeView, setActiveView] = useState<'main' | 'rolls' | 'nutrition'>(
    'main'
  );
  const [nutritionView, setNutritionView] = useState<'per100' | 'perDish'>(
    'per100'
  );

  // Sample data for rolls in the set
  const rollsData: RollItem[] = [
    {
      id: 1,
      name: 'Цезарь с курицей запечённый унаги',
      description:
        'Куринное филе, запечённое со специями, салат айсберг, творожный сыр, румяная сырная шапочка с унаги и кунжутом',
      image: 'https://mainimg.jacofood.ru/Filadelfiia_Lait_292x292.jpg',
      calories: 191,
      ingredients:
        'куриное филе, салат айсберг, творожный сыр, соус с сыром, соус унаги, кунжут',
      nutrition: {
        proteins: 7.1,
        fats: 8.0,
        carbohydrates: 22.9,
      },
    },
    {
      id: 2,
      name: 'Филадельфия Лайт',
      description:
        'Нежное сочетание тающего во рту слабосолёного лосося и творожного сыра с приятным сливочным послевкусием',
      image: 'https://mainimg.jacofood.ru/Filadelfiia_Lait_292x292.jpg',
      calories: 175,
      ingredients: 'слабосолёный лосось, творожный сыр',
      nutrition: {
        proteins: 5.9,
        fats: 9.6,
        carbohydrates: 16.3,
      },
    },
    {
      id: 3,
      name: 'Аквиланг запечённый унаги',
      description:
        'Отборная креветка, нежный творожный сыр, румяная сырная шапочка с сладким унаги и ароматным кунжутом',
      image: 'https://mainimg.jacofood.ru/Filadelfiia_Lait_292x292.jpg',
      calories: 220,
      ingredients:
        'отборная креветка, творожный сыр, соус с сыром, соус унаги, кунжут',
      nutrition: {
        proteins: 6.7,
        fats: 11.7,
        carbohydrates: 22.1,
      },
    },
    {
      id: 4,
      name: 'Калифорния с лососем Люкс',
      description:
        'Классический ролл с лососем, авокадо и огурцом в икре тобико',
      image: 'https://mainimg.jacofood.ru/Filadelfiia_Lait_292x292.jpg',
      calories: 185,
      ingredients: 'лосось, авокадо, огурец, икра тобико, рис, нори',
      nutrition: {
        proteins: 6.2,
        fats: 7.5,
        carbohydrates: 24.3,
      },
    },
  ];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeView !== 'main') {
          setActiveView('main');
        } else {
          onClose();
        }
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
  }, [isOpen, activeView, onClose]);

  const handleOverlayClick = () => {
    if (activeView !== 'main') {
      setActiveView('main');
    } else {
      onClose();
    }
  };

  const handleRollsClick = () => {
    setActiveView('rolls');
  };

  const handleInfoClick = () => {
    setActiveView('nutrition');
  };

  const handleBack = () => {
    setActiveView('main');
  };

  const handleNutritionToggle = (view: 'per100' | 'perDish') => {
    setNutritionView(view);
  };

  if (!isOpen) return null;

  const renderMainView = () => (
    <>
      <div className="ProductModal-image">
        <Image
          src={productImage}
          alt={productName}
          width={585}
          height={585}
          priority
          className="ProductModal-image-main"
        />
      </div>

      <div className="ProductModal-content">
        <h2 className="ProductModal-title">{productName}</h2>

        <div className="ProductModal-meta">
          <div className="ProductModal-meta-text">
            <span
              className="ProductModal-meta-link"
              onClick={handleRollsClick}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleRollsClick()}
            >
              {rollsCount} ролла
            </span>
            <span className="ProductModal-meta-divider">|</span>
            <span className="ProductModal-meta-item">{piecesCount} шт.</span>
            <span className="ProductModal-meta-divider">|</span>
            <span className="ProductModal-meta-item">{weight} г</span>
          </div>
          <button
            className="ProductModal-info-btn"
            onClick={handleInfoClick}
            aria-label="Информация"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="10"
                r="9"
                stroke="rgba(0, 0, 0, 0.2)"
                strokeWidth="1.5"
              />
              <path
                d="M10 6.5V7"
                stroke="rgba(0, 0, 0, 0.2)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M10 9V14"
                stroke="rgba(0, 0, 0, 0.2)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <p className="ProductModal-description">{productDescription}</p>

        <button className="ProductModal-price-btn">
          {new Intl.NumberFormat('ru-RU').format(price)} ₽
        </button>
      </div>
    </>
  );

  const renderRollsView = () => (
    <div className="ProductModal-rolls-view">
      <div className="ProductModal-rolls-header">
        <h2 className="ProductModal-rolls-title">
          Сет состоит из {rollsCount} роллов:
        </h2>
        <button
          className="ProductModal-back-btn"
          onClick={handleBack}
          aria-label="Назад"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="ProductModal-rolls-list">
        {rollsData.map((roll, index) => (
          <div key={roll.id} className="ProductModal-roll-item">
            <span className="ProductModal-roll-number">{index + 1}.</span>
            <div className="ProductModal-roll-image">
              <Image
                src={roll.image}
                alt={roll.name}
                width={120}
                height={120}
              />
            </div>
            <div className="ProductModal-roll-content">
              <h3 className="ProductModal-roll-name">{roll.name}</h3>
              <p className="ProductModal-roll-description">
                {roll.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNutritionView = () => (
    <div className="ProductModal-nutrition-view">
      <div className="ProductModal-nutrition-header">
        <h2 className="ProductModal-nutrition-title">
          Таблица пищевой ценности
        </h2>
        <button
          className="ProductModal-back-btn"
          onClick={handleBack}
          aria-label="Назад"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <p className="ProductModal-nutrition-subtitle">
        Полное описание состава блюда, калорийности и возможных аллергенов можно{' '}
        <a href="#" className="ProductModal-nutrition-link">
          скачать в формате PDF
        </a>
      </p>

      <div className="ProductModal-nutrition-toggle">
        <button
          className={`ProductModal-nutrition-toggle-btn ${nutritionView === 'per100' ? 'active' : ''}`}
          onClick={() => handleNutritionToggle('per100')}
        >
          на 100 г
        </button>
        <button
          className={`ProductModal-nutrition-toggle-btn ${nutritionView === 'perDish' ? 'active' : ''}`}
          onClick={() => handleNutritionToggle('perDish')}
        >
          на всё блюдо
        </button>
      </div>

      <div className="ProductModal-nutrition-list">
        {rollsData.map((roll, index) => (
          <ModalItemPCvalue
            number={index + 1}
            kkal={roll.calories}
            tmp_desc={roll.ingredients}
            protein={roll.nutrition?.proteins}
            fat={roll.nutrition?.fats}
            carbohydrates={roll.nutrition?.carbohydrates}
            title={roll.name}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="ProductModal-overlay" onClick={handleOverlayClick}>
      <button
        className="ProductModal-close"
        onClick={activeView !== 'main' ? handleBack : onClose}
        aria-label="Закрыть"
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="rgba(0, 0, 0, 0.5)" />
          <path
            d="M13 13L27 27"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M27 13L13 27"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="ProductModal" onClick={(e) => e.stopPropagation()}>
        {renderMainView()}
        {activeView === 'rolls' && renderRollsView()}
        {activeView === 'nutrition' && renderNutritionView()}
      </div>
    </div>
  );
};

export default ProductModal;
