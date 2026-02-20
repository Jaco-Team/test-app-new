import React from 'react';

import { motion } from "framer-motion";

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useHomeStore, useCitiesStore, useCartStore } from '@/components/store.js';

import BadgeItem from './badge';

import { reachGoalSplit } from '@/utils/metrika';

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

  const metrica_param_min = {
    city: thisCityRu, 
    tovar: item.name, 
    category: item.cat_name,
  };

  const add_to_cart = () => {
    plus(item.id, item.cat_id)
    reachGoalSplit('add_to_cart', metrica_param, metrica_param_min);

    ymDataLayer.push({
      "ecommerce": {
        "currencyCode": "RUB",    
        "add": {
          "products": [
            {
              "id": item.id,
              "name": item.name,
              "price": item?.price,
              //"brand": "Яндекс / Яndex",
              "category": item.cat_name,
              "quantity": 1,
              //"list": "Выдача категории",
              "position": 1
            }
          ]
        }
      }
    });

    try{
      // roistat.event.send('add_to_cart', {
      //   id: item?.id,
      //   name: item?.name,
      //   price: item?.price,
      //   quantity: 1,
      //   category: {
      //     "level1": item?.cat_name,
      //   },
      // });
    } catch(e){ console.log(e) }
  }

  const remove_from_cart = () => {
    minus(item.id);
    reachGoalSplit('remove_from_cart', metrica_param, metrica_param_min);

    ymDataLayer.push({
      "ecommerce": {
        "currencyCode": "RUB",
        "remove": {
          "products": [
            {
              "id": item.id,
              "name": item.name,
              "category": item.cat_name,
              "quantity": 1,
              //"list": "Аксессуары",
              "position": 1
            }
          ]
        }
      }
    });

    try{
      // roistat.event.send('remove_from_cart');
    } catch(e){ console.log(e) }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9 }}
    >
      <Grid item className={'CardItemMobile ' + (count > 0 ? 'active' : '')} sx={{ display: { xs: 'flex', md: 'flex', sm: 'flex' } }} id={item.link} name={item.link}>
        <div className="CardContainer">

          <div className="CardImg">
            <picture>
              <source 
                type="image/webp" 
                srcSet={`
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_366x366.webp 138w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_466x466.webp 146w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_585x585.webp 183w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_585x585.webp 233w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_585x585.webp 292w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_732x732.webp 366w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_732x732.webp 584w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_732x732.webp 760w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_1168x1168.webp 1875w`} 
                sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
              <source 
                type="image/jpeg" 
                srcSet={`
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_366x366.jpg 138w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_466x466.jpg 146w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_585x585.jpg 183w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_585x585.jpg 233w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_585x585.jpg 292w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_585x585.jpg 366w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_732x732.jpg 584w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_732x732.jpg 760w,
                  ${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_1168x1168.jpg 1875w`} 
                sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

              <img 
                alt={item?.name} 
                title={item?.name} 
                src={`${process.env.NEXT_PUBLIC_VK_IMG}${item.img_app}_292x292.jpg`} 
                loading="lazy"
                onClick={() => getItem('home', thisCity, item.id)}
                style={{ cursor: 'pointer' }}
              />
            </picture>

            <div className='badgecontainer'>
              {parseInt(item.is_hit) == 1 ? 
                <BadgeItem size={'small'} type={'hit'} view={'mobile'} />
                  :
                false
              }

              {parseInt(item.is_new) == 1 ? 
                <BadgeItem size={'small'} type={'new'} view={'mobile'} />
                  :
                false
              }

              {parseInt(item?.is_updated) == 1 ? 
                <BadgeItem size={'small'} type={'updated'} view={'mobile'} />
                  :
                false
              }

              { item?.tags?.includes(14) === true ?
                <BadgeItem size={'smallshort'} type={'hot'} view={'mobile'} />
                  :
                false
              }
            </div>
          </div>

          <div className="CardInfoItem">
            <Typography className="CardNameItem" component="span" onClick={() => getItem('home', thisCity, item.id)}>
              {item.name}
            </Typography>

            <div className="dop_text" onClick={() => getItem('home', thisCity, item.id)}>

              {parseInt(item.cat_id) != 4 ? null : (
                <span className="first_text" 
                style={{ width: parseInt(item.count_part_new) > 4 && parseInt(item.count_part_new) < 9 ? '14.529914529915vw' : parseInt(item.count_part_new) > 9 ? '16.2393162393vw' : '12.820512820513vw' }}
                >
                  {item.count_part_new}
                </span>
              )}

              {parseInt(item.cat_id) == 5 || parseInt(item.cat_id) == 6 || parseInt(item.cat_id) == 7 || parseInt(item.cat_id) == 15 ? null : (
                <span className="second_text"
                  style={{
                    justifyContent: parseInt(item.cat_id) == 4 ? 'center' : 'flex-start',
                    width: parseInt(item.cat_id) == 4 ? '11.965811965812vw' : parseInt(item.cat_id) != 14 ? '8.5470085470085vw' : '10.25641025641vw' 
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
                  <button className="minus" onClick={remove_from_cart}>–</button>
                  <span>{count}</span>
                  <button className="plus" onClick={add_to_cart}>+</button>
                </div>
              </div>
            ) : (
              <div className="containerBTNMobile">
                <Button variant="outlined" onClick={add_to_cart}>
                  {new Intl.NumberFormat('ru-RU').format(item.price)} ₽
                </Button>
              </div>
            )}
          </div>
        </div>
      </Grid>
    </motion.div>
  );
});
