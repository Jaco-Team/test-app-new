import React from 'react';

//import Image from 'next/image';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useHomeStore, useCitiesStore, useCartStore } from '@/components/store.js';

import BadgeItem from './badge';

import {placeholder_img} from '@/public/placeholder_img';

export default React.memo(function CardItemMobile({ item, count }) {
  const [getItem] = useHomeStore((state) => [state.getItem]);
  const [thisCity, thisCityRu] = useCitiesStore((state) => [state.thisCity, state.thisCityRu]);
  const [minus, plus] = useCartStore((state) => [state.minus, state.plus]);

  const metrica_param = {
    city: thisCityRu, 
    tovar: item.name, 
    category: item.cat_name,
    platform: 'mobile',
    view: 'Главная'
  };

  /**
   * 
   * <Image 
            alt={item.name} 
            src={'https://cdnimg.jacofood.ru/' + item.img_app + '_585x585.jpg'}
            width={585}
            height={585}
            priority={false}
            quality={75}
            loading="lazy"
            onClick={() => getItem('home', thisCity, item.id)}
            placeholder="blur"
            blurDataURL={placeholder_img}
          />
   * 
   */

  return (
    <Grid item className={'CardItemMobile ' + (count > 0 ? 'active' : '')} sx={{ display: { xs: 'flex', md: 'flex', sm: 'flex' } }} id={item.link} name={item.link}>
      <div className="CardContainer">

        <div className="CardImg">
          <picture>
            <source 
              type="image/webp" 
              srcSet={`
                https://cdnimg.jacofood.ru/${item.img_app}_366x366.webp 138w,
                https://cdnimg.jacofood.ru/${item.img_app}_466x466.webp 146w,
                https://cdnimg.jacofood.ru/${item.img_app}_585x585.webp 183w,
                https://cdnimg.jacofood.ru/${item.img_app}_585x585.webp 233w,
                https://cdnimg.jacofood.ru/${item.img_app}_585x585.webp 292w,
                https://cdnimg.jacofood.ru/${item.img_app}_732x732.webp 366w,
                https://cdnimg.jacofood.ru/${item.img_app}_732x732.webp 584w,
                https://cdnimg.jacofood.ru/${item.img_app}_732x732.webp 760w,
                https://cdnimg.jacofood.ru/${item.img_app}_1168x1168.webp 1875w`} 
              sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
            <source 
              type="image/jpeg" 
              srcSet={`
                https://cdnimg.jacofood.ru/${item.img_app}_366x366.jpg 138w,
                https://cdnimg.jacofood.ru/${item.img_app}_466x466.jpg 146w,
                https://cdnimg.jacofood.ru/${item.img_app}_585x585.jpg 183w,
                https://cdnimg.jacofood.ru/${item.img_app}_585x585.jpg 233w,
                https://cdnimg.jacofood.ru/${item.img_app}_585x585.jpg 292w,
                https://cdnimg.jacofood.ru/${item.img_app}_585x585.jpg 366w,
                https://cdnimg.jacofood.ru/${item.img_app}_732x732.jpg 584w,
                https://cdnimg.jacofood.ru/${item.img_app}_732x732.jpg 760w,
                https://cdnimg.jacofood.ru/${item.img_app}_1168x1168.jpg 1875w`} 
              sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

            <img 
              alt={item?.name} 
              title={item?.name} 
              src={`https://cdnimg.jacofood.ru/${item.img_app}_292x292.jpg`} 
              loading="lazy"
              onClick={() => getItem('home', thisCity, item.id)}
              style={{ cursor: 'pointer' }}
            />
          </picture>

          {parseInt(item.is_new) == 0 ? parseInt(item.is_hit) == 0 ? null :
            <BadgeItem size={'small'} type={'hit'} view={'mobile'} />
              :
            <BadgeItem size={'small'} type={'new'} view={'mobile'} />
          }
        </div>

        <div className="CardInfoItem">
          <Typography className="CardNameItem" component="span" onClick={() => getItem('home', thisCity, item.id)}>
            {item.name}
          </Typography>

          <div className="dop_text" onClick={() => getItem('home', thisCity, item.id)}>

            {parseInt(item.cat_id) != 4 ? null : (
              <span className="first_text" 
              style={{ width: parseInt(item.count_part_new) > 4 && parseInt(item.count_part_new) < 9 ? '11.965811965812vw' : parseInt(item.count_part_new) > 9 ? '13.675213675214vw' : '10.25641025641vw' }}
              >
                {item.count_part_new}
              </span>
            )}

            {parseInt(item.cat_id) == 5 || parseInt(item.cat_id) == 6 || parseInt(item.cat_id) == 7 || parseInt(item.cat_id) == 15 ? null : (
              <span className="second_text"
                style={{
                  justifyContent: parseInt(item.cat_id) == 4 ? 'center' : 'flex-start',
                  width: parseInt(item.cat_id) == 4 ? '10.25641025641vw' : parseInt(item.cat_id) != 14 ? '7.6923076923077vw' : '8.5470085470085vw' 
                }}
              >
                {parseInt(item.cat_id) == 14 ? item.size_pizza : item.count_part}{' '}
                {parseInt(item.cat_id) == 14 ? 'см' : parseInt(item.cat_id) == 6 ? 'л' : 'шт.'}{' '}
              </span>
            )}

            <span className="third_text"
              style={{ justifyContent: parseInt(item.cat_id) == 5 || parseInt(item.cat_id) == 6 || parseInt(item.cat_id) == 7 || parseInt(item.cat_id) == 15 ? 'flex-start' : 'center' }}>
              {new Intl.NumberFormat('ru-RU').format(item.weight)}{' '}
              {parseInt(item.id) == 17 || parseInt(item.id) == 237 ? 'шт.' : parseInt(item.cat_id) == 6 ? 'л' : 'г'}
            </span>
          </div>

          <div className="desc_text" onClick={() => getItem('home', thisCity, item.id)}>
            {item.marc_desc.length > 0 ? item.marc_desc : item.tmp_desc}
          </div>

          {count ? (
            <div className="containerBTNMobile">
              <div variant="contained">
                <button className="minus" onClick={() => { minus(item.id); ym(47085879, 'reachGoal', 'remove_from_cart', metrica_param); } }>–</button>
                <span>{count}</span>
                <button className="plus" onClick={() => { plus(item.id, item.cat_id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); } }>+</button>
              </div>
            </div>
          ) : (
            <div className="containerBTNMobile">
              <Button variant="outlined" onClick={() => { plus(item.id, item.cat_id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); } }>
                {new Intl.NumberFormat('ru-RU').format(item.price)} ₽
              </Button>
            </div>
          )}
        </div>
      </div>
    </Grid>
  );
});
