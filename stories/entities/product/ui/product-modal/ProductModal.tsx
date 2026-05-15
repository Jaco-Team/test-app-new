import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import './ProductModal.scss';
import { ModalItemValue } from '@stories/entities/product/ui/nutrition/ModalItemValue';
import {
  ProductModalProps,
  RollItem,
} from '@stories/entities/product/ui/product-modal/model/types';

const defaultRollsData: RollItem[] = [
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
    description: 'Классический ролл с лососем, авокадо и огурцом в икре тобико',
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
  rollsData = defaultRollsData,
}) => {
  const [activeView, setActiveView] = useState<'main' | 'rolls' | 'nutrition'>(
    'main'
  );
  const [nutritionView, setNutritionView] = useState<'per100' | 'perDish'>(
    'per100'
  );

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
      <div className="product-modal-image">
        <Image
          src={productImage}
          alt={productName}
          width={585}
          height={585}
          priority
          className="product-modal-image-main"
        />
      </div>

      <div className="product-modal-content">
        <h2 className="product-modal-title">{productName}</h2>

        <div className="product-modal-meta">
          <div className="product-modal-meta-text">
            <span
              className="product-modal-meta-link"
              onClick={handleRollsClick}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleRollsClick()}
            >
              {rollsCount} ролла
            </span>
            <span className="product-modal-meta-divider">|</span>
            <span className="product-modal-meta-item">{piecesCount} шт.</span>
            <span className="product-modal-meta-divider">|</span>
            <span className="product-modal-meta-item">{weight} г</span>
          </div>
          <button
            className="product-modal-info-btn"
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

        <p className="product-modal-description">{productDescription}</p>

        <button className="product-modal-price-btn">
          {new Intl.NumberFormat('ru-RU').format(price)} ₽
        </button>
      </div>
    </>
  );

  const renderRollsView = () => (
    <div className="product-modal-rolls-view">
      <div className="product-modal-rolls-header">
        <h2 className="product-modal-rolls-title">
          Сет состоит из {rollsCount} роллов:
        </h2>
        <button
          className="product-modal-back-btn"
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

      <div className="product-modal-rolls-list">
        {rollsData.map((roll, index) => (
          <div key={roll.id} className="product-modal-roll-item">
            <span className="product-modal-roll-number">{index + 1}.</span>
            <div className="product-modal-roll-image">
              <Image
                src={roll.image}
                alt={roll.name}
                width={120}
                height={120}
              />
            </div>
            <div className="product-modal-roll-content">
              <h3 className="product-modal-roll-name">{roll.name}</h3>
              <p className="product-modal-roll-description">
                {roll.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNutritionView = () => (
    <div className="product-modal-nutrition-view">
      <div className="product-modal-nutrition-header">
        <h2 className="product-modal-nutrition-title">
          Таблица пищевой ценности
        </h2>
      </div>

      <p className="product-modal-nutrition-subtitle">
        Полное описание состава блюда, калорийности и возможных аллергенов можно{' '}
        <a href="#" className="product-modal-nutrition-link">
          скачать в формате PDF
        </a>
      </p>

      <div className="product-modal-nutrition-toggle">
        <button
          className={`product-modal-nutrition-toggle-btn ${nutritionView === 'per100' ? 'active' : ''}`}
          onClick={() => handleNutritionToggle('per100')}
        >
          на 100 г
        </button>
        <button
          className={`product-modal-nutrition-toggle-btn ${nutritionView === 'perDish' ? 'active' : ''}`}
          onClick={() => handleNutritionToggle('perDish')}
        >
          на всё блюдо
        </button>
      </div>

      <div className="product-modal-nutrition-list">
        {rollsData.map((roll, index) => (
          <ModalItemValue
            key={roll.id}
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
    <div className="product-modal-overlay" onClick={handleOverlayClick}>
      <button
        className="product-modal-close"
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

      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        {renderMainView()}
        {activeView === 'rolls' && renderRollsView()}
        {activeView === 'nutrition' && renderNutritionView()}
      </div>
    </div>
  );
};

export default ProductModal;
