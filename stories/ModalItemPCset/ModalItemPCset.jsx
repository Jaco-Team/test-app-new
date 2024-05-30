import PropTypes from 'prop-types';
import './ModalItemPCset.scss';

export const ModalItemPCset = ({number, img_app, title, marc_desc, tmp_desc}) => {
  return (
    <div className="setItem">
      <span className="itemNumber">{number}.</span>

      <picture>
        <source 
          type="image/webp" 
          srcSet={`
            https://cdnimg.jacofood.ru/${img_app}_292x292.webp 138w,
            https://cdnimg.jacofood.ru/${img_app}_366x366.webp 146w,
            https://cdnimg.jacofood.ru/${img_app}_466x466.webp 183w,
            https://cdnimg.jacofood.ru/${img_app}_585x585.webp 233w,
            https://cdnimg.jacofood.ru/${img_app}_732x732.webp 292w,
            https://cdnimg.jacofood.ru/${img_app}_1168x1168.webp 366w,
            https://cdnimg.jacofood.ru/${img_app}_1420x1420.webp 584w,
            https://cdnimg.jacofood.ru/${img_app}_2000x2000.webp 760w,
            https://cdnimg.jacofood.ru/${img_app}_2000x2000.webp 1875w`} 
          sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
        <source 
          type="image/jpeg" 
          srcSet={`
            https://cdnimg.jacofood.ru/${img_app}_292x292.jpg 138w,
            https://cdnimg.jacofood.ru/${img_app}_366x366.jpg 146w,
            https://cdnimg.jacofood.ru/${img_app}_466x466.jpg 183w,
            https://cdnimg.jacofood.ru/${img_app}_585x585.jpg 233w,
            https://cdnimg.jacofood.ru/${img_app}_732x732.jpg 292w,
            https://cdnimg.jacofood.ru/${img_app}_1168x1168.jpg 366w,
            https://cdnimg.jacofood.ru/${img_app}_1420x1420.jpg 584w,
            https://cdnimg.jacofood.ru/${img_app}_2000x2000.jpg 760w,
            https://cdnimg.jacofood.ru/${img_app}_2000x2000.jpg 1875w`} 
          sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

        <img 
          alt={title} 
          title={title} 
          src={`https://cdnimg.jacofood.ru/${img_app}_292x292.jpg`} 
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

