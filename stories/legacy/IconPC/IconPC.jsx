import PropTypes from 'prop-types';
import './IconPC.scss';
import {LocationHeaderIcon, ProfileIconNew, JacoDocsIcon, BasketIconNew, YaIcon, EyeShow_modalOrder, EyeHide_modalOrder, ClearAuthMobile, CheckAuthMobile, VectorRightAuthMobile, DoneAuthMobile, IconInfo, CityBasketModalPC, HomeBasketModalPC, TimeBasketModalPC, CardBasketModalPC, MessageBasketModalPC, PointBasketModalPC} from '../Icons';
import MoneyIcon from '@mui/icons-material/Money';

export const IconPC = ({ count, icon, element, foodValue }) => {

  if(element === 'header') {
    return (
      <div className={['IconHeaderPC', parseInt(count) > 0 ? 'active' : ''].join(' ')}>
        
        { icon == 'location' ? <LocationHeaderIcon /> : false }
        { icon == 'profile' ? <ProfileIconNew /> : false }
        { icon == 'docs' ? <JacoDocsIcon /> : false }
        { icon == 'basket' ? <BasketIconNew /> : false }
  
        {parseInt(count) > 0 ?
          <span>{new Intl.NumberFormat('ru-RU').format(count)} ₽</span>
            :
          false
        }
      </div>
    );
  }

  if(element === 'auth') {
    return (
      <>
        { icon == 'ya' ? <YaIcon className="IconAuthPC" /> : false }
        { icon == 'eyeShow' ? <EyeShow_modalOrder className="IconAuthPC" fill="black" /> : false }
        { icon == 'eyeHide' ? <EyeHide_modalOrder className="IconAuthPC" /> : false }
        { icon == 'clear' ? <ClearAuthMobile className="IconAuthPC" /> : false }
        { icon == 'check' ? <CheckAuthMobile className="IconAuthPC" /> : false }
        { icon == 'vector_rigth' ? <div className="IconAuthPC_vector"><VectorRightAuthMobile /></div> : false }
        { icon == 'done' ? <div className="IconAuthPC_done"><DoneAuthMobile /></div> : false }
      </>
    );
  }

  if(element === 'product' && icon == 'value') {
    return (
      <>
        {foodValue === true ? (
          <IconInfo fill="#DD1A32" className='IconItemValue' />
        ) : (
          <IconInfo fill="rgba(0, 0, 0, 0.2)" className='IconItemValue' />
        )}
      </>
    );
  }

  if(element === 'form_order') {
    return (
      <>
        { icon == 'city' ? <CityBasketModalPC className="IconFormOrder" /> : false }
        { icon == 'home' ? <HomeBasketModalPC className="IconFormOrder" fill='#DD1A32' /> : false }
        { icon == 'time' ? <TimeBasketModalPC className="IconFormOrder" /> : false }
        { icon == 'card' ? <CardBasketModalPC className="IconFormOrder" /> : false }
        { icon == 'comment' ? <MessageBasketModalPC className="IconFormOrder" /> : false }
        { icon == 'sdacha' ? <MoneyIcon className="IconFormOrder" /> : false }
        { icon == 'point' ? <PointBasketModalPC className="IconFormOrder" /> : false }
      </>
    );
  }
};

IconPC.propTypes = {
  element: PropTypes.string.isRequired,
  count: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  foodValue: PropTypes.bool,
  // icon: PropTypes.oneOf(['location', 'profile', 'docs', 'basket', 'ya', 'eyeShow', 'eyeHide', 'clear', 'check']),
};
