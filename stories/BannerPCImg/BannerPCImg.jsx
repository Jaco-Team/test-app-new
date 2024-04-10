import PropTypes from 'prop-types';
import Image from 'next/image';
import './BannerPCImg.scss';

export const BannerPCImg = ({ img, title }) => {
  return (
    <Image 
      alt={title} 
      src={img} 
      width={ 3700 } 
      height={ 1000 } 
      priority={true}
      className='BannerPCImg'
    />  
  );
};

BannerPCImg.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
