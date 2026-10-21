import PropTypes from 'prop-types';
import './ModalItemPCset.scss';
import { getItemImageSrcSet } from '@/utils/itemImage';

export const ModalItemPCset = ({
  number,
  img_app,
  title,
  marc_desc,
  tmp_desc,
}) => {
  return (
    <div className="setItem">
      <span className="itemNumber">{number}.</span>

      <picture>
        <source
          type="image/webp"
          srcSet={getItemImageSrcSet(
            img_app,
            'webp',
            'thumbnail',
            'https://cdnimg.jacofood.ru'
          )}
          sizes="146px"
        />
        <source
          type="image/jpeg"
          srcSet={getItemImageSrcSet(
            img_app,
            'jpg',
            'thumbnail',
            'https://cdnimg.jacofood.ru'
          )}
          sizes="146px"
        />

        <img
          alt={title}
          src={`https://cdnimg.jacofood.ru/${img_app}_366x366.jpg`}
          loading="lazy"
        />
      </picture>

      <div className="itemDesc">
        <span>{title}</span>
        <span>{marc_desc.length > 0 ? marc_desc : tmp_desc}</span>
      </div>
    </div>
  );
};

ModalItemPCset.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  img_app: PropTypes.string.isRequired,
  marc_desc: PropTypes.string.isRequired,
  tmp_desc: PropTypes.string.isRequired,
};
