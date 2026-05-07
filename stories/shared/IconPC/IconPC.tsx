import React from 'react';
import './IconPC.scss';
import {
  LocationHeaderIcon,
  ProfileIconNew,
  JacoDocsIcon,
  BasketIconNew,
  YaIcon,
  EyeShow_modalOrder,
  EyeHide_modalOrder,
  ClearAuthMobile,
  CheckAuthMobile,
  VectorRightAuthMobile,
  DoneAuthMobile,
  IconInfo,
  CityBasketModalPC,
  HomeBasketModalPC,
  TimeBasketModalPC,
  CardBasketModalPC,
  MessageBasketModalPC,
  PointBasketModalPC
} from '../Icons.js';
import MoneyIcon from '@mui/icons-material/Money';

// Типы для иконок в разных элементах
type HeaderIcon = 'location' | 'profile' | 'docs' | 'basket';
type AuthIcon = 'ya' | 'eyeShow' | 'eyeHide' | 'clear' | 'check' | 'vector_rigth' | 'done';
type ProductIcon = 'value';
type FormOrderIcon = 'city' | 'home' | 'time' | 'card' | 'comment' | 'sdacha' | 'point';

type IconType = HeaderIcon | AuthIcon | ProductIcon | FormOrderIcon;

interface IconPCProps {
  icon: IconType;
  element: 'header' | 'auth' | 'product' | 'form_order';
  count?: string;
  foodValue?: boolean;
}

export const IconPC: React.FC<IconPCProps> = ({ count = '0', icon, element, foodValue = false }) => {

  // Рендер для header
  if (element === 'header') {
    return (
      <div className={['IconHeaderPC', parseInt(count) > 0 ? 'active' : ''].filter(Boolean).join(' ')}>
        {icon === 'location' && <LocationHeaderIcon />}
        {icon === 'profile' && <ProfileIconNew />}
        {icon === 'docs' && <JacoDocsIcon />}
        {icon === 'basket' && <BasketIconNew />}

        {parseInt(count) > 0 && (
          <span>{new Intl.NumberFormat('ru-RU').format(parseInt(count))} ₽</span>
        )}
      </div>
    );
  }

  // Рендер для auth
  if (element === 'auth') {
    return (
      <>
        {icon === 'ya' && <YaIcon className="IconAuthPC" />}
        {icon === 'eyeShow' && <EyeShow_modalOrder className="IconAuthPC" fill="black" />}
        {icon === 'eyeHide' && <EyeHide_modalOrder className="IconAuthPC" />}
        {icon === 'clear' && <ClearAuthMobile className="IconAuthPC" />}
        {icon === 'check' && <CheckAuthMobile className="IconAuthPC" />}
        {icon === 'vector_rigth' && (
          <div className="IconAuthPC_vector">
            <VectorRightAuthMobile />
          </div>
        )}
        {icon === 'done' && (
          <div className="IconAuthPC_done">
            <DoneAuthMobile />
          </div>
        )}
      </>
    );
  }

  // Рендер для product
  if (element === 'product' && icon === 'value') {
    return (
      <>
        {foodValue ? (
          <IconInfo fill="#DD1A32" className="IconItemValue" />
        ) : (
          <IconInfo fill="rgba(0, 0, 0, 0.2)" className="IconItemValue" />
        )}
      </>
    );
  }

  // Рендер для form_order
  if (element === 'form_order') {
    return (
      <>
        {icon === 'city' && <CityBasketModalPC className="IconFormOrder" />}
        {icon === 'home' && <HomeBasketModalPC className="IconFormOrder" fill="#DD1A32" />}
        {icon === 'time' && <TimeBasketModalPC className="IconFormOrder" />}
        {icon === 'card' && <CardBasketModalPC className="IconFormOrder" />}
        {icon === 'comment' && <MessageBasketModalPC className="IconFormOrder" />}
        {icon === 'sdacha' && <MoneyIcon className="IconFormOrder" />}
        {icon === 'point' && <PointBasketModalPC className="IconFormOrder" />}
      </>
    );
  }

  return null;
};
