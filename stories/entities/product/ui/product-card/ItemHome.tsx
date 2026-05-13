import React from 'react';
import Image from 'next/image';

import './ItemHome.scss';
import { placeholder_img } from '@/public/placeholder_img';
import { Badge } from '../badge/Badge';
import { ProductItem } from '@stories/entities/product/ui/product-card/model/types';
import { useEffect, useState } from 'react';
import { ProductModal } from '@stories/entities/product/ui/product-modal/ProductModal';

export const ItemHome = ({
  name,
  img_app,
  weight,
  marc_desc,
  price,
  count,
  is_new,
  is_hit,
  count_part,
}: ProductItem) => {
  return (
    <div
      className={['ItemHomePc', parseInt(count) > 0 ? 'active' : ''].join(' ')}
    >
      <div className="BlockIMG">
        <Image
          alt={name}
          src={
            img_app?.length > 0
              ? 'https://cdnimg.jacofood.ru/' + img_app + '_732x732.jpg'
              : placeholder_img
          }
          width={732}
          height={732}
          priority={false}
          quality={75}
          loading={'lazy'}
          placeholder="blur"
          blurDataURL={placeholder_img}
        />

        {parseInt(is_new) == 0 ? (
          parseInt(is_hit) == 0 ? null : (
            <Badge size={'big'} type={'hit'} view={'pc'} />
          )
        ) : (
          <Badge size={'big'} type={'new'} view={'pc'} />
        )}
      </div>

      <div className="content-wrapper">
        <span className="title">{name}</span>
        <span className="weight">
          {count_part} ролла | {count_part} шт. | {weight} г
        </span>
        <span className="description">{marc_desc}</span>

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
    </div>
  );
};
