import React from 'react';

import Image from 'next/image';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useHomeStore, useCitiesStore, useCartStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow';

export default React.memo(function CardItemMobile({ item, count }) {
  const [getItem] = useHomeStore((state) => [state.getItem], shallow);
  const [thisCity] = useCitiesStore((state) => [state.thisCity], shallow);
  const [minus, plus] = useCartStore((state) => [state.minus, state.plus], shallow);

  return (
    <Grid item className={'CardItemMobile ' + (count > 0 ? 'active' : '')} style={{ width: '93.162393162393vw' }} sx={{ display: { xs: 'flex', md: 'flex', sm: 'none' } }}>
      <div className="CardContainer">
        <div className="CardImg">
          <Image alt={item.name} src={'https://cdnimg.jacofood.ru/' + item.img_app + '_1420x1420.jpg'}
            width={1420}
            height={1420}
            priority={true}
            onClick={() => getItem('home', thisCity, item.id)}
          />
        </div>

        <div className="CardInfoItem">
          <Typography className="CardNameItem" component="span">
            {item.name}
          </Typography>

          <div className="dop_text">
            {parseInt(item.cat_id) != 4 ? null : (
              <span className="first_text" style={{ width: parseInt(item.count_part_new) > 9 ? '10.25641025641vw' : '8.5470085470085vw' }}>
                {item.count_part_new}
              </span>
            )}

            {parseInt(item.cat_id) == 5 || parseInt(item.cat_id) == 6 || parseInt(item.cat_id) == 7 || parseInt(item.cat_id) == 15 ? null : (
              <span className="second_text"
                style={{justifyContent: parseInt(item.cat_id) == 4 ? 'center' : 'flex-start',
                  width: parseInt(item.cat_id) == 4 ? '8.5470085470085vw' : parseInt(item.cat_id) != 14 ? '5.982905982906vw' : '6.8376068376068vw' }}
              >
                {parseInt(item.cat_id) == 14 ? item.size_pizza : item.count_part}{' '}
                {parseInt(item.cat_id) == 14 ? 'см' : parseInt(item.cat_id) == 6 ? 'л' : 'шт.'}{' '}
              </span>
            )}

            <span className="third_text"
              style={{ justifyContent: parseInt(item.cat_id) == 5 || parseInt(item.cat_id) == 6 || parseInt(item.cat_id) == 7 || parseInt(item.cat_id) == 15
                    ? 'flex-start' : 'center' }}>
              {new Intl.NumberFormat('ru-RU').format(item.weight)}{' '}
              {parseInt(item.id) == 17 || parseInt(item.id) == 237 ? 'шт.' : parseInt(item.cat_id) == 6 ? 'л' : 'г'}
            </span>
          </div>

          <div className="desc_text">
            {item.marc_desc.length > 0 ? item.marc_desc : item.tmp_desc}
          </div>

          {count ? (
            <div className="containerBTNMobile">
              <div variant="contained">
                <button className="minus" onClick={() => minus(item.id)}>–</button>
                <span>{count}</span>
                <button className="plus" onClick={() => plus(item.id, item.cat_id)}>+</button>
              </div>
            </div>
          ) : (
            <div className="containerBTNMobile">
              <Button variant="outlined" onClick={() => plus(item.id, item.cat_id)}>
                {new Intl.NumberFormat('ru-RU').format(item.price)} ₽
              </Button>
            </div>
          )}
        </div>
      </div>
    </Grid>
  );
});
