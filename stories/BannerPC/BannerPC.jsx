import PropTypes from 'prop-types';
import Image from 'next/image';
import './BannerPC.scss';

export const BannerPC = ({ title, img }) => {
  return (
    <div className="bannerIMG">
      <Image
        alt={title}
        src={'https://storage.yandexcloud.net/site-home-img/' + img + '3700х1000.jpg'}
        width={3700}
        height={1000}
        priority={true}
      />
    </div>
  );
};

BannerPC.propTypes = {
  title: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
};
