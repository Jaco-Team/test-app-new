import { memo } from 'react';

import Image from 'next/image';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useHomeStore, useCitiesStore, useCartStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow';

export default memo(function CardItem(props) {
  console.log('CardItemPc render');

  const item = props.data;
  const count = props.count;

  const desc = item.marc_desc.length > 0 ? item.marc_desc : item.tmp_desc;

  const [getItem] = useHomeStore((state) => [state.getItem], shallow);
  const [thisCity] = useCitiesStore((state) => [state.thisCity], shallow);
  const [minus, plus] = useCartStore((state) => [state.minus, state.plus], shallow);

  return (
    <Grid item className={'CardItemPC ' + (count > 0 ? 'active' : '')} xs={12} sm={6} md={4} lg={3} sx={{ display: { xs: 'none', sm: 'flex' } }}>
      <div>
        <Image
          alt={item.name}
          src={'https://cdnimg.jacofood.ru/' + item.img_app + '_1420x1420.jpg'}
          width={1420}
          height={1420}
          priority={true}
          onClick={() => getItem('home', thisCity, item.id)}
          style={{ cursor: 'pointer' }}
        />

        <Typography className="CardNameItem" variant="h5" component="h3">{item.name}</Typography>

        <div className="dop_text">
          {parseInt(item.cat_id) != 4 ? null : <span className="first_text">{item.count_part_new}</span>}

          {parseInt(item.cat_id) == 5 || parseInt(item.cat_id) == 6 || parseInt(item.cat_id) == 7 || parseInt(item.cat_id) == 15 ? null : (
            <span className="second_text" style={{ flex: parseInt(item.cat_id) == 4 ? 2 : 3 }}>
              {parseInt(item.cat_id) == 14 ? item.size_pizza : item.count_part}{' '}
              {parseInt(item.cat_id) == 14 ? 'см' : parseInt(item.cat_id) == 6 ? 'л' : 'шт.'}{' '}
            </span>
          )}

          <span className="third_text">
            {new Intl.NumberFormat('ru-RU').format(item.weight)}{' '}
            {parseInt(item.id) == 17 || parseInt(item.id) == 237 ? 'шт.' : parseInt(item.cat_id) == 6 ? 'л' : 'г'}
          </span>
        </div>

        <div className="desc_text">{desc}</div>

        {count ? (
          <div className="containerBTN">
            <div variant="contained">
              <button className="minus" onClick={() => minus(item.id)}>–</button>
              <span>{count}</span>
              <button className="plus" onClick={() => plus(item.id)}>+</button>
            </div>
          </div>
        ) : (
          <div className="containerBTN">
            <Button variant="outlined" className="ModalItemButtonCartPC" onClick={() => plus(item.id)}>
              {new Intl.NumberFormat('ru-RU').format(item.price)} ₽
            </Button>
          </div>
        )}
      </div>
    </Grid>
  );
});
