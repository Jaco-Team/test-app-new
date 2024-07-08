import { memo } from 'react';

import { motion } from "framer-motion";

//import Image from 'next/image';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useHomeStore, useCitiesStore, useCartStore } from '@/components/store.js';

import BadgeItem from './badge';

// import {placeholder_img} from '@/public/placeholder_img';

export default memo(function CardItem({ item, count, index}) {
  const [getItem] = useHomeStore((state) => [state.getItem]);
  const [thisCity, thisCityRu] = useCitiesStore( state => [state.thisCity, state.thisCityRu]);
  const [minus, plus] = useCartStore((state) => [state.minus, state.plus]);

  //732
  //1420

  const metrica_param = {
    city: thisCityRu, 
    tovar: item.name, 
    category: item.cat_name,
    platform: 'pc',
    view: 'Главная'
  };

  /**
   *  
   * <Image
            alt={item.name}
            src={'https://cdnimg.jacofood.ru/' + item.img_app + '_732x732.jpg'}
            width={732}
            height={732}
            priority={false}
            quality={75}
            loading={'lazy'}
            onClick={() => getItem('home', thisCity, item.id)}
            style={{ cursor: 'pointer' }}
            placeholder="blur"
            blurDataURL={placeholder_img}
          />
   * 
   */

  console.log( item )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9 }}
    >
      <Grid item className={'CardItemPC ' + (count > 0 ? 'active' : '')} style={{ marginRight: (index + 1) % 4 === 0 ? 0 : '1.4440433212996vw' }} sx={{ display: { xs: 'none', sm: 'flex' } }} id={item.link} name={item.link}>
        <div>

          <div className='imgItem'>
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
                  https://cdnimg.jacofood.ru/${item.img_app}_1168x1168.webp 584w,
                  https://cdnimg.jacofood.ru/${item.img_app}_1168x1168.webp 760w,
                  https://cdnimg.jacofood.ru/${item.img_app}_1420x1420.webp 1875w`} 
                sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
              <source 
                type="image/jpeg" 
                srcSet={`
                  https://cdnimg.jacofood.ru/${item.img_app}_366x366.jpg 138w,
                  https://cdnimg.jacofood.ru/${item.img_app}_466x466.jpg 146w,
                  https://cdnimg.jacofood.ru/${item.img_app}_585x585.jpg 183w,
                  https://cdnimg.jacofood.ru/${item.img_app}_585x585.jpg 233w,
                  https://cdnimg.jacofood.ru/${item.img_app}_585x585.jpg 292w,
                  https://cdnimg.jacofood.ru/${item.img_app}_732x732.jpg 366w,
                  https://cdnimg.jacofood.ru/${item.img_app}_1168x1168.jpg 584w,
                  https://cdnimg.jacofood.ru/${item.img_app}_1168x1168.jpg 760w,
                  https://cdnimg.jacofood.ru/${item.img_app}_1420x1420.jpg 1875w`} 
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

            
            {parseInt(item.is_hit) == 1 ? 
              <BadgeItem size={'big'} type={'hit'} view={'pc'} />
                :
              false
            }

            {parseInt(item.is_new) == 1 ? 
              <BadgeItem size={'big'} type={'new'} view={'pc'} />
                :
              false
            }

            {parseInt(item?.is_updated) == 1 ? 
              <BadgeItem size={'big'} type={'updated'} view={'pc'} />
                :
              false
            }
          </div>

          <Typography className="CardNameItem" variant="h5" component="h3" style={{ cursor: 'pointer' }} onClick={() => getItem('home', thisCity, item.id)}>{item.name}</Typography>
          
          <div className="dop_text" style={{ cursor: 'pointer', justifyContent: parseInt(item.cat_id) == 4 ?  'space-evenly' : 'center' }} onClick={() => getItem('home', thisCity, item.id)}>
            {parseInt(item.cat_id) != 4 ? null : <span className="first_text">{item.count_part_new}</span>}

            {parseInt(item.cat_id) == 4 ? <span className="divider"/> : null}

            {parseInt(item.cat_id) == 5 || parseInt(item.cat_id) == 6 || parseInt(item.cat_id) == 7 || parseInt(item.cat_id) == 15 ? null : (
              <span className="second_text"  style={{ marginRight: parseInt(item.cat_id) !== 4 ? '0.36101083032491vw' : null }}>
                {parseInt(item.cat_id) == 14 ? item.size_pizza : item.count_part}{' '}
                {parseInt(item.cat_id) == 14 ? 'см' : parseInt(item.cat_id) == 6 ? 'л' : 'шт.'}{' '}
              </span>
            )}

            {parseInt(item.cat_id) == 5 || parseInt(item.cat_id) == 6 || parseInt(item.cat_id) == 7 || parseInt(item.cat_id) == 15 ? null : <span className="divider"/>}

            <span className="third_text" style={{ marginLeft: parseInt(item.cat_id) !== 4 ? '0.36101083032491vw' : null }}>
              {new Intl.NumberFormat('ru-RU').format(item.weight)}{' '}
              {parseInt(item.id) == 17 || parseInt(item.id) == 237 ? 'шт.' : parseInt(item.cat_id) == 6 ? 'л' : 'г'}
            </span>
          </div>

          <div className="desc_text" style={{ cursor: 'pointer' }} onClick={() => getItem('home', thisCity, item.id)}>{item.marc_desc.length > 0 ? item.marc_desc : item.tmp_desc}</div>

          {count ? (
            <div className="containerBTN">
              <div variant="contained">
                <button className="minus" onClick={() => { minus(item.id); ym(47085879, 'reachGoal', 'remove_from_cart', metrica_param); } }>–</button>
                <span>{count}</span>
                <button className="plus" onClick={() => { plus(item.id, item.cat_id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); }} >+</button>
              </div>
            </div>
          ) : (
            <div className="containerBTN">
              <Button variant="outlined" onClick={() => { plus(item.id, item.cat_id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); }} >
                {new Intl.NumberFormat('ru-RU').format(item.price)} ₽
              </Button>
            </div>
          )}
        </div>
      </Grid>
    </motion.div>
  );
});
