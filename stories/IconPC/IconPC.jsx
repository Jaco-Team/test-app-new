import PropTypes from 'prop-types';
import './IconPC.scss';
import {LocationHeaderIcon, ProfileIconNew, JacoDocsIcon, BasketIconNew, YaIcon, EyeShow_modalOrder, EyeHide_modalOrder, ClearAuthMobile, CheckAuthMobile, VectorRightAuthMobile, DoneAuthMobile, IconInfo} from '../Icons';

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
        { icon == 'eyeShow' ? <EyeShow_modalOrder className="IconAuthPC" /> : false }
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
};

IconPC.propTypes = {
  element: PropTypes.string.isRequired,
  count: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  foodValue: PropTypes.bool,
  // icon: PropTypes.oneOf(['location', 'profile', 'docs', 'basket', 'ya', 'eyeShow', 'eyeHide', 'clear', 'check']),
};
