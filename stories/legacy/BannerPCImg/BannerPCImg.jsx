import PropTypes from 'prop-types';
import Image from 'next/image';
import './BannerPCImg.scss';

export const BannerPCImg = ({ img, title, type }) => {
  return (
    <Image 
      alt={title} 
      src={img} 
      width={ 3700 } 
      height={ 1000 } 
      priority={true}
      className='BannerPCImg'
      style={{ borderRadius: type === 'banner' ? '1.1552346570397vw' : '1.1552346570397vw 1.1552346570397vw 0 0' }}
    />  
  );
};

BannerPCImg.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
