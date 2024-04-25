import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useHomeStore, useCartStore, useHeaderStore, useCitiesStore } from '@/components/store';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function CartItemPromo({ item, data_key, promo, typePromo, isAuth }) {
  const [thisItem, setThisItem] = useState({});
  const [CatsItems] = useHomeStore((state) => [state.CatsItems]);
  const [items, minus, plus, getInfoPromo] = useCartStore((state) => [state.items, state.minus, state.plus, state.getInfoPromo]);

  const [thisCityRu] = useCitiesStore((state) => [ state.thisCityRu ]);

  const metrica_param = {
    city: thisCityRu, 
    tovar: thisItem?.name, 
    category: thisItem?.cat_name,
    platform: 'pc',
    view: 'Акция'
  };

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
    if( promo?.name && promo?.name?.length > 0) {
      getInfoPromo(promo?.name, promo?.city_id);
    }
    
    plus(item_id, cat_id);
  }

  function this_minus(item_id) {
    if( promo?.name && promo?.name?.length > 0) {
      getInfoPromo(promo?.name, promo?.city_id);
    }

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
              <button className="minus" onClick={() => { this_minus(thisItem?.id); ym(47085879, 'reachGoal', 'remove_from_cart', metrica_param); } }>–</button>
              <span>{count}</span>
              <button className="plus" onClick={() => { this_plus(thisItem?.id, thisItem?.cat_id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); } }>+</button>
            </div>
          </div>
        : parseInt(item?.price) == 0 ? false :
          <div className="containerBTNitem">
            <Button variant="outlined" onClick={() => { this_plus(thisItem?.id, thisItem?.cat_id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); } }>
              {new Intl.NumberFormat('ru-RU').format(item?.price)} ₽
            </Button>
          </div>
        }
      </div>
    </div>
  );
}

export default function AkciiItemPC({ actia }) {
  const [dataForActia] = useHomeStore((state) => [state.dataForActia]);
  const [getInfoPromo] = useCartStore((state) => [state.getInfoPromo]);
  const [setActiveModalAlert, isAuth] = useHeaderStore((state) => [state.setActiveModalAlert, state.isAuth]);

  const data = dataForActia(actia);

  const activePromo = async(item) => {
    const res = await getInfoPromo(item.name, item.city_id);

    if( res.st === false ) {
      setActiveModalAlert(true, res.text, false);
    }else{
      setActiveModalAlert(true, 'Промокод активирован', true);
    }
  };

  return (
    <Grid container className="containerAccia">
      <Image alt={data?.banner?.title} src={'https://storage.yandexcloud.net/site-home-img/' + data?.banner?.img + '_3700x1000.jpg'} width={3700} height={1000} priority={true} />

      <Grid className="DescItem">
        <Grid className="FirstItem">
          {data?.openBannerItems?.length ? <Typography variant="h5" component="h2" className="title">Состав</Typography> : false}

          <div className="List">
            {data?.openBannerItems.map((item, key) => (
              <CartItemPromo
                key={key}
                data_key={key}
                item={item}
                typePromo={data?.typePromo}
                promo={data?.banner?.info}
                isAuth={isAuth}
              />
            ))}
          </div>

          {parseInt(data?.typePromo) == 0 ? false :
            <div className="containerBTN">
              <button onClick={() => activePromo(data?.banner?.info)}>Воспользоватся акцией</button>
            </div>
          }
        </Grid>

        <Grid className="SecondItem">
          <Typography variant="h5" component="span">{data?.banner?.title}</Typography>

          {data && data?.banner?.text ? <Grid dangerouslySetInnerHTML={{ __html: data?.banner?.text }} /> : null}
        </Grid>
      </Grid>
    </Grid>
  );
}
