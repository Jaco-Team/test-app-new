import PropTypes from 'prop-types';
import Image from 'next/image';

import './BannerItemPC.scss';

export const BannerItemPC = ({number, title, img_app, desc, typePrice, price, count}) => {

  return (
    <div className="itemBannerPCNew BannerFontPC">
      <span className="number">{number}.</span>
      
      <Image
        alt={title}
        src={'https://cdnimg.jacofood.ru/' + img_app + '_1420x1420.jpg'}
        width={1420}
        height={1420}
        priority={true}
      />
      
      <div className="itemDesc">
        <span className="title">{title}</span>
        <span className="desc">{desc}</span>

        { typePrice == 'text' ?
          <div className="price text">
            <span>{new Intl.NumberFormat('ru-RU').format(price)} ₽</span>
          </div>
            :
          false
        }

        { typePrice == 'active' ?
          parseInt(count) == 0 ?
            <button className="price button">
              {new Intl.NumberFormat('ru-RU').format(price)} ₽
            </button>
              :
            <div className="price button">
              <button className="minus">–</button>
              <span>{count}</span>
              <button className="plus">+</button>
            </div>
            :
          false
        }

      </div>
    </div>
  );
};

BannerItemPC.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  img_app: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  count: PropTypes.number,
  typePrice: PropTypes.oneOf(['active', 'text'])
};
