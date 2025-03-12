import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useHomeStore, useCartStore, useHeaderStoreNew, useCitiesStore } from '@/components/store';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function CartItemPromo({ item, data_key, promo, typePromo, isAuth, bannerTitle }) {
  const [thisItem, setThisItem] = useState({});
  const [CatsItems, getItem] = useHomeStore((state) => [state.CatsItems, state.getItem]);
  const [items, minus, plus, getInfoPromo] = useCartStore((state) => [state.items, state.minus, state.plus, state.getInfoPromo]);

  const [thisCity, thisCityRu] = useCitiesStore((state) => [ state.thisCity, state.thisCityRu ]);

  const metrica_param = {
    city: thisCityRu, 
    tovar: thisItem?.name, 
    category: thisItem?.cat_name,
    platform: 'pc',
    view: 'Акция'
  };

  const metrica_param_min = {
    city: thisCityRu, 
    tovar: thisItem?.name, 
    category: thisItem?.cat_name,
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

  const add_to_cart = () => {
    this_plus(thisItem?.id, thisItem?.cat_id); 
    ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); 

    if( thisCityRu == 'Самара' ){
      ym(100325084, 'reachGoal', 'add_to_cart', metrica_param_min); 

      ym(100325084, 'reachGoal', 'active_actia_all', {akcia_name: bannerTitle}); 
      ym(100325084, 'reachGoal', 'active_actia_akcii', {akcia_name: bannerTitle}); 
    }
  }

  const remove_from_cart = () => {
    this_minus(thisItem?.id); 
    ym(47085879, 'reachGoal', 'remove_from_cart', metrica_param); 

    if( thisCityRu == 'Самара' ){
      ym(100325084, 'reachGoal', 'remove_from_cart', metrica_param_min);
    }
  } 

  return (
    <div>
      <span className="itemNumber">{data_key + 1}.</span>

      <div className="itemImg">
        {thisItem?.img_app ? 
          <picture>
            <source 
              type="image/webp" 
              srcSet={`
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_366x366.webp 138w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_466x466.webp 146w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_585x585.webp 183w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_585x585.webp 233w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_585x585.webp 292w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_732x732.webp 366w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_1168x1168.webp 584w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_1168x1168.webp 760w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_1420x1420.webp 1875w`}
              sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
            <source 
              type="image/jpeg" 
              srcSet={`
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_366x366.jpg 138w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_466x466.jpg 146w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_585x585.jpg 183w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_585x585.jpg 233w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_585x585.jpg 292w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_732x732.jpg 366w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_1168x1168.jpg 584w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_1168x1168.jpg 760w,
                ${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_1420x1420.jpg 1875w`} 
              sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

            <img 
              alt={thisItem?.name} 
              title={thisItem?.name} 
              src={`${process.env.NEXT_PUBLIC_YANDEX_IMG}${thisItem.img_app}_292x292.jpg`} 

              //src={`https://cdnimg.jacofood.ru/${thisItem.img_app}_292x292.jpg`} 
              loading="lazy"
              onClick={() => getItem('home', thisCity, thisItem?.id)}
            />
          </picture>
            : 
          false
        }
      </div>

      <div className="itemDesc">
        <Typography className="ItemName" component="span" onClick={() => getItem('home', thisCity, thisItem?.id)}>{thisItem?.name}</Typography>

        <Typography component="span" className="ItemDesk" onClick={() => getItem('home', thisCity, thisItem?.id)}>{thisItem?.marc_desc?.length > 0 ? thisItem?.marc_desc : thisItem?.tmp_desc}</Typography>

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
              <button className="minus" onClick={remove_from_cart}>–</button>
              <span>{count}</span>
              <button className="plus" onClick={add_to_cart}>+</button>
            </div>
          </div>
        : parseInt(item?.price) == 0 ? false :
          <div className="containerBTNitem">
            <Button variant="outlined" onClick={add_to_cart}>
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
  const [setActiveModalAlert, isAuth] = useHeaderStoreNew((state) => [state?.setActiveModalAlert, state?.isAuth]);

  const [thisCity, thisCityRu] = useCitiesStore((state) => [ state.thisCity, state.thisCityRu ]);

  const data = dataForActia(actia);

  const activePromo = async(item) => {
    const res = await getInfoPromo(item.name, item.city_id);

    if( res.st === false ) {
      setActiveModalAlert(true, res.text, false);
    }else{
      setActiveModalAlert(true, 'Промокод активирован', true);
    }
  };

  const activeActia = (item) => {
    activePromo(item);

    if( thisCityRu == 'Самара' ){
      ym(100325084, 'reachGoal', 'active_actia_all', {akcia_name: item?.title}); 
      ym(100325084, 'reachGoal', 'active_actia_akcii', {akcia_name: item?.title}); 
    }
  }

  return (
    <Grid container className="containerAccia">
      <picture>
        <source 
          type="image/webp" 
          srcSet={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}${data?.banner?.img}_3700x1000.webp`} 
          sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
        <source 
          type="image/jpeg" 
          srcSet={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}${data?.banner?.img}_3700x1000.jpg`} 
          sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

        <img 
          alt={data?.banner?.title} 
          title={data?.banner?.title} 
          src={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}${data?.banner?.img}_3700x1000.jpg`} 
          loading="lazy"
        />
      </picture>

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
                bannerTitle={data?.banner?.title}
              />
            ))}
          </div>

          {parseInt(data?.typePromo) == 0 ? false :
            <div className="containerBTN">
              <button onClick={() => activeActia(data?.banner?.info)}>Воспользоватся акцией</button>
            </div>
          }
        </Grid>

        <Grid className="SecondItem">
          <Typography variant="h5" component="span">{data?.banner?.title}</Typography>

          {data && data?.banner?.text ? <Grid className="FullText" dangerouslySetInnerHTML={{ __html: data?.banner?.text }} /> : null}
        </Grid>
      </Grid>
    </Grid>
  );
}
