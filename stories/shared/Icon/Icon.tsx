import React from 'react';
import './Icon.scss';
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
  PointBasketModalPC,
} from '../Icons';
import MoneyIcon from '@mui/icons-material/Money';

// Типы для иконок в разных элементах
type HeaderIcon = 'location' | 'profile' | 'docs' | 'basket';
type AuthIcon =
  | 'ya'
  | 'eyeShow'
  | 'eyeHide'
  | 'clear'
  | 'check'
  | 'vector_rigth'
  | 'done';
type ProductIcon = 'value';
type FormOrderIcon =
  | 'city'
  | 'home'
  | 'time'
  | 'card'
  | 'comment'
  | 'sdacha'
  | 'point';

type IconType = HeaderIcon | AuthIcon | ProductIcon | FormOrderIcon | string;

interface IconProps {
  icon: IconType;
  element:
    | 'header'
    | 'auth'
    | 'product'
    | 'form_order'
    | 'modal'
    | 'cat'
    | 'contacts'
    | string;
  count?: string;
  foodValue?: boolean;
}

export const Icon: React.FC<IconProps> = ({
  count = '0',
  icon,
  element,
  foodValue = false,
}) => {
  // Рендер для header
  if (element === 'header') {
    return (
      <div
        className={['header-icon', parseInt(count) > 0 ? 'active' : '']
          .filter(Boolean)
          .join(' ')}
      >
        {icon === 'location' && <LocationHeaderIcon />}
        {icon === 'profile' && <ProfileIconNew />}
        {icon === 'docs' && <JacoDocsIcon />}
        {icon === 'basket' && <BasketIconNew />}

        {parseInt(count) > 0 && (
          <span>
            {new Intl.NumberFormat('ru-RU').format(parseInt(count))} ₽
          </span>
        )}
      </div>
    );
  }

  // Рендер для auth
  if (element === 'auth') {
    return (
      <>
        {icon === 'ya' && <YaIcon className="auth-icon" />}
        {icon === 'eyeShow' && (
          <EyeShow_modalOrder className="auth-icon" fill="black" />
        )}
        {icon === 'eyeHide' && <EyeHide_modalOrder className="auth-icon" />}
        {icon === 'clear' && <ClearAuthMobile className="auth-icon" />}
        {icon === 'check' && <CheckAuthMobile className="auth-icon" />}
        {icon === 'vector_rigth' && (
          <div className="auth-icon__vector">
            <VectorRightAuthMobile />
          </div>
        )}
        {icon === 'done' && (
          <div className="auth-icon__done">
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
        {icon === 'home' && (
          <HomeBasketModalPC className="IconFormOrder" fill="#DD1A32" />
        )}
        {icon === 'time' && <TimeBasketModalPC className="IconFormOrder" />}
        {icon === 'card' && <CardBasketModalPC className="IconFormOrder" />}
        {icon === 'comment' && (
          <MessageBasketModalPC className="IconFormOrder" />
        )}
        {icon === 'sdacha' && <MoneyIcon className="IconFormOrder" />}
        {icon === 'point' && <PointBasketModalPC className="IconFormOrder" />}
      </>
    );
  }

  return null;
};
