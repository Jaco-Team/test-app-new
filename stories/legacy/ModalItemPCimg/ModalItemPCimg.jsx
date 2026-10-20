import PropTypes from 'prop-types';
import './ModalItemPCimg.scss';
import { getItemImageSrcSet } from '@/utils/itemImage';

export const ModalItemPCimg = ({ img_name, title }) => {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={getItemImageSrcSet(
          img_name,
          'webp',
          'hero',
          'https://cdnimg.jacofood.ru'
        )}
        sizes="(max-width: 768px) 100vw, 715px"
      />
      <source
        type="image/jpeg"
        srcSet={getItemImageSrcSet(
          img_name,
          'jpg',
          'hero',
          'https://cdnimg.jacofood.ru'
        )}
        sizes="(max-width: 768px) 100vw, 715px"
      />

      <img
        alt={title}
        src={`https://cdnimg.jacofood.ru/${img_name}_732x732.jpg`}
        loading="lazy"
      />
    </picture>
  );
};

ModalItemPCimg.propTypes = {
  img_name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
