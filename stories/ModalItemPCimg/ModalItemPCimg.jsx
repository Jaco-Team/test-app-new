import PropTypes from 'prop-types';
import './ModalItemPCimg.scss';

export const ModalItemPCimg = ({ img_name, title }) => {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={` https://cdnimg.jacofood.ru/${img_name}_366x366.webp 138w,
                  https://cdnimg.jacofood.ru/${img_name}_466x466.webp 146w,
                  https://cdnimg.jacofood.ru/${img_name}_585x585.webp 183w,
                  https://cdnimg.jacofood.ru/${img_name}_1168x1168.webp 233w,
                  https://cdnimg.jacofood.ru/${img_name}_1420x1420.webp 292w,
                  https://cdnimg.jacofood.ru/${img_name}_2000x2000.webp 366w,
                  https://cdnimg.jacofood.ru/${img_name}_2000x2000.webp 584w,
                  https://cdnimg.jacofood.ru/${img_name}_2000x2000.webp 760w,
                  https://cdnimg.jacofood.ru/${img_name}_2000x2000.webp 1875w`}
        sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px"
      />
      <source
        type="image/jpeg"
        srcSet={` https://cdnimg.jacofood.ru/${img_name}_366x366.jpg 138w,
                  https://cdnimg.jacofood.ru/${img_name}_466x466.jpg 146w,
                  https://cdnimg.jacofood.ru/${img_name}_585x585.jpg 183w,
                  https://cdnimg.jacofood.ru/${img_name}_1168x1168.jpg 233w,
                  https://cdnimg.jacofood.ru/${img_name}_1420x1420.jpg 292w,
                  https://cdnimg.jacofood.ru/${img_name}_2000x2000.jpg 366w,
                  https://cdnimg.jacofood.ru/${img_name}_2000x2000.jpg 584w,
                  https://cdnimg.jacofood.ru/${img_name}_2000x2000.jpg 760w,
                  https://cdnimg.jacofood.ru/${img_name}_2000x2000.jpg 1875w`}
        sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px"
      />

      <img
        alt={title}
        title={title}
        src={`https://cdnimg.jacofood.ru/${img_name}_292x292.jpg`}
        loading="lazy"
      />
    </picture>
  );
};

ModalItemPCimg.propTypes = {
  img_name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
