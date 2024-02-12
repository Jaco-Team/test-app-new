import { memo } from 'react';

import Image from 'next/image';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useHomeStore, useCitiesStore, useCartStore } from '@/components/store.js';

import BadgeItem from './badge';

import {placeholder_img} from '@/public/placeholder_img';

export default memo(function CardItem({ item, count, index}) {
  //console.log('CardItemPc render');

  const [getItem] = useHomeStore((state) => [state.getItem]);
  const [thisCity] = useCitiesStore((state) => [state.thisCity]);
  const [minus, plus] = useCartStore((state) => [state.minus, state.plus]);

  return (
    <Grid item className={'CardItemPC ' + (count > 0 ? 'active' : '')}
      style={{ marginRight: (index + 1) % 4 === 0 ? 0 : '1.4440433212996vw', marginBottom: count > 0 ? '1.4440433212996vw' : '2.8880866425993vw', height: count > 0 ? '35.740072202166vw' : '34.296028880866vw'}}
      sx={{ display: { xs: 'none', sm: 'flex' } }}
    >
      <div>

        <div style={{ position: 'relative' }}>
          <Image
            alt={item.name}
            src={'https://cdnimg.jacofood.ru/' + item.img_app + '_1420x1420.jpg'}
            width={1420}
            height={1420}
            priority={false}
            quality={75}
            loading={'lazy'}
            onClick={() => getItem('home', thisCity, item.id)}
            style={{ cursor: 'pointer' }}
            placeholder="blur"
            blurDataURL={placeholder_img}
          />

          {parseInt(item.is_new) == 0 ? parseInt(item.is_hit) == 0 ? null :
            <BadgeItem size={'big'} type={'hit'} view={'pc'} />
                :
            <BadgeItem size={'big'} type={'new'} view={'pc'} />
          }
        </div>

        <Typography className="CardNameItem" variant="h5" component="h3">{item.name}</Typography>
        
        <div className="dop_text">
          {parseInt(item.cat_id) != 4 ? null : <span className="first_text">{item.count_part_new}</span>}

          {parseInt(item.cat_id) == 5 || parseInt(item.cat_id) == 6 || parseInt(item.cat_id) == 7 || parseInt(item.cat_id) == 15 ? null : (
            <span className="second_text" 
            style={{ flex: parseInt(item.cat_id) == 4 ? 2 : 0.2 }}
            >
              {parseInt(item.cat_id) == 14 ? item.size_pizza : item.count_part}{' '}
              {parseInt(item.cat_id) == 14 ? 'см' : parseInt(item.cat_id) == 6 ? 'л' : 'шт.'}{' '}
            </span>
          )}

          <span className="third_text"  
          style={{ flex: parseInt(item.cat_id) == 4 ? 3 : 0.2 }}
          >
            {new Intl.NumberFormat('ru-RU').format(item.weight)}{' '}
            {parseInt(item.id) == 17 || parseInt(item.id) == 237 ? 'шт.' : parseInt(item.cat_id) == 6 ? 'л' : 'г'}
          </span>
        </div>

        <div className="desc_text">{item.marc_desc.length > 0 ? item.marc_desc : item.tmp_desc}</div>

        {count ? (
          <div className="containerBTN">
            <div variant="contained">
              <button className="minus" onClick={() => minus(item.id)}>–</button>
              <span>{count}</span>
              <button className="plus" onClick={() => plus(item.id, item.cat_id)}>+</button>
            </div>
          </div>
        ) : (
          <div className="containerBTN">
            <Button variant="outlined" className="ModalItemButtonCartPC" onClick={() => plus(item.id, item.cat_id)}>
              {new Intl.NumberFormat('ru-RU').format(item.price)} ₽
            </Button>
          </div>
        )}
      </div>
    </Grid>
  );
});
