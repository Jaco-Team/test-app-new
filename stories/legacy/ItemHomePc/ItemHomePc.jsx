import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

import './ItemHomePc.scss';
import { placeholder_img } from '@/public/placeholder_img';
import { Badge } from '../Badge/Badge';

export const ItemHomePc = ({title, img, weight, description, price, count, is_new, is_hit}) => {
  return (
    <div
      className={['ItemHomePc', parseInt(count) > 0 ? 'active' : ''].join(' ')}
    >
      <div className="BlockIMG">
        <Image
          alt={title}
          src={img.length > 0 ? 'https://cdnimg.jacofood.ru/' + img + '_732x732.jpg' : placeholder_img}
          width={732}
          height={732}
          priority={false}
          quality={75}
          loading={'lazy'}
          //onClick={() => getItem('home', thisCity, item.id)}
          placeholder="blur"
          blurDataURL={placeholder_img}
        />

        {parseInt(is_new) == 0 ? parseInt(is_hit) == 0 ? null : (
            <Badge size={'big'} type={'hit'} view={'pc'} />
          ) : (
            <Badge size={'big'} type={'new'} view={'pc'} />
        )}

      </div>
      <span className="title">{title}</span>
      <span className="weight">{weight}</span>
      <span className="description">{description}</span>
      {parseInt(count) > 0 ? (
        <div className="btn_count">
          <button className="minus">–</button>
          <span>{count}</span>
          <button className="plus">+</button>
        </div>
      ) : (
        <button className="btn_price">
          {new Intl.NumberFormat('ru-RU').format(price)} ₽
        </button>
      )}
    </div>
  );
};

ItemHomePc.propTypes = {
  title: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  weight: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  count: PropTypes.string.isRequired,
  is_new: PropTypes.string.isRequired,
  is_hit: PropTypes.string.isRequired,
};
