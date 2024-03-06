import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useHomeStore, useCartStore, useHeaderStore } from '@/components/store';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function CartItemPromo({ item, data_key, promo, typePromo, isAuth }) {
  const [thisItem, setThisItem] = useState({});
  const [CatsItems] = useHomeStore((state) => [state.CatsItems]);
  const [items, minus, plus, getInfoPromo] = useCartStore((state) => [state.items, state.minus, state.plus, state.getInfoPromo]);

  let count = 0;

  useEffect(() => {
    CatsItems.map((cat) => {
      cat.items.map((item_) => {
        if (parseInt(item_.id) == parseInt(item?.id) || parseInt(item_.id) == parseInt(item?.item_id)) {
          setThisItem(item_);
        }
      });
    });
  }, [items, CatsItems]);

  function this_plus(item_id, cat_id) {
    getInfoPromo(promo?.name, promo?.city_id);

    plus(item_id, cat_id);
  }

  function this_minus(item_id) {
    getInfoPromo(promo?.name, promo?.city_id);

    minus(item_id);
  }

  count = items.find((f_item) => parseInt(f_item?.item_id) == parseInt(item?.id) || parseInt(f_item?.item_id) == parseInt(item?.item_id));

  count = count ? count['count'] : 0;

  return (
    <div>
      <span className="itemNumber">{data_key + 1}.</span>

      <div className="itemImg">
        {thisItem?.img_app ? <Image alt={item?.name} src={'https://cdnimg.jacofood.ru/' + thisItem?.img_app + '_1420x1420.jpg'} width={1420} height={1420} priority={true} /> : false}
      </div>

      <div className="itemDesc">
        <Typography className="ItemName" component="span">{thisItem?.name}</Typography>

        <Typography component="span" className="ItemDesk">{thisItem?.marc_desc?.length > 0 ? thisItem?.marc_desc : thisItem?.tmp_desc}</Typography>

        {parseInt(typePromo) == 2 ? parseInt(item?.price) == 0 ? false :
          <div className="containerBTNitem">
            <span>
              {new Intl.NumberFormat('ru-RU').format(item?.price)} ₽
            </span>
          </div>
        : false}

        {parseInt(typePromo) == 2 ? false : count ?
          <div className="containerBTNitem">
            <div variant="contained">
              <button className="minus" onClick={() => this_minus(thisItem?.id)}>–</button>
              <span>{count}</span>
              <button className="plus" onClick={() => this_plus(thisItem?.id, thisItem?.cat_id)}>+</button>
            </div>
          </div>
        : parseInt(item?.price) == 0 ? false :
          <div className="containerBTNitem">
            <Button variant="outlined" onClick={() => this_plus(thisItem?.id, thisItem?.cat_id)}>
              {new Intl.NumberFormat('ru-RU').format(item?.price)} ₽
            </Button>
          </div>
        }
      </div>
    </div>
  );
}

export default function AkciiItemPC({ actia }) {
  // console.log('render AkciiItemPC');

  const [getInfoPromo] = useCartStore((state) => [state.getInfoPromo]);
  const [setActiveModalAlert, isAuth] = useHeaderStore((state) => [state.setActiveModalAlert, state.isAuth]);

  const activePromo = (item) => {
    setActiveModalAlert(true, 'Промокод активирован', true);
    getInfoPromo(item.name, item.city_id);
  };

  return (
    <Grid container className="containerAccia">
      <Image alt={actia?.title} src={'https://storage.yandexcloud.net/site-home-img/' + actia?.img + '3700х1000.jpg'} width={3700} height={1000} priority={true} />

      <Grid className="DescItem">
        <Grid className="FirstItem">
          {actia?.actiItems?.length ? <Typography variant="h5" component="h2" className="title">Состав</Typography> : null}

          <div className="List">
            {actia?.actiItems.map((item, key) => (
              <CartItemPromo
                key={key}
                data_key={key}
                item={item}
                typePromo={actia?.typePromo}
                promo={actia?.info}
                isAuth={isAuth}
              />
            ))}
          </div>

          {parseInt(actia?.typePromo) == 0 ? false :
            <div className="containerBTN">
              <button onClick={() => activePromo(actia?.info)}>Воспользоватся акцией</button>
            </div>
          }
        </Grid>

        <Grid className="SecondItem">
          <Typography variant="h5" component="span">{actia?.title}</Typography>

          {actia && actia?.text ? <Grid dangerouslySetInnerHTML={{ __html: actia?.text }} /> : null}
        </Grid>
      </Grid>
    </Grid>
  );
}
