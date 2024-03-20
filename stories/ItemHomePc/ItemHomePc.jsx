import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

import './ItemHomePc.scss';
import { roboto } from '../Font.js'
import {placeholder_img} from '@/public/placeholder_img';

export const ItemHomePc = ({ title, img, weight, description, price, count }) => {
  return (
    <div className={[roboto.variable, 'ItemHomePc', ( parseInt(count) > 0 ? 'active' : '' )].join(' ')}>
      <div className='BlockIMG'>
        <Image
          alt={title}
          src={'https://cdnimg.jacofood.ru/' + img + '_732x732.jpg'}
          width={732}
          height={732}
          priority={false}
          quality={75}
          loading={'lazy'}
          //onClick={() => getItem('home', thisCity, item.id)}
          placeholder="blur"
          blurDataURL={placeholder_img}
        />

        
      </div>
      <span className='title'>{title}</span>
      <span className='weight'>{weight}</span>
      <span className='description'>{description}</span>
      { parseInt(count) > 0 ? 
        <div className='btn_count'>
          <button className="minus">–</button>
          <span>{count}</span>
          <button className="plus">+</button>  
        </div>
          :
        <button className='btn_price'>{new Intl.NumberFormat('ru-RU').format(price)} ₽</button>
      }
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
};