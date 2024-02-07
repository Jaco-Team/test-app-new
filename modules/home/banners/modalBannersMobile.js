import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import { useHomeStore, useCartStore, useHeaderStore } from '@/components/store';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Button from '@mui/material/Button';

import { roboto } from '@/ui/Font';

function CartItemPromo({ item, data_key, promo, typePromo, isAuth }){

  const [ thisItem, setThisItem ] = useState({});
  const [ CatsItems ] = useHomeStore( state => [ state.CatsItems ]);
  const [ items, minus, plus, getInfoPromo ] = useCartStore( state => [ state.items, state.minus, state.plus, state.getInfoPromo ]);

  let count = 0;

  useEffect(() => {
    CatsItems.map((cat) => {
      cat.items.map((item_) => {

        if( parseInt( item_.id ) == parseInt( item?.id ) || parseInt( item_.id ) == parseInt( item?.item_id ) ){
          setThisItem(item_)
        }

      });
    });
  }, [items, CatsItems]);

  function this_plus(item_id, cat_id){
    getInfoPromo(promo?.name, promo?.city_id);

    plus(item_id, cat_id)
  }

  function this_minus(item_id){
    getInfoPromo(promo?.name, promo?.city_id);

    minus(item_id)
  }

  count = items.find( f_item => parseInt(f_item?.item_id) == parseInt( item?.id ) || parseInt(f_item?.item_id) == parseInt( item?.item_id ) );

  count = count ? count['count'] : 0;

  return (
    <div>
      <div className="itemNumber">
        <span className="ItemOther">{data_key + 1}.</span>
      </div>

      <div className="itemImg">
        {thisItem?.img_app ? (
          <Image alt={item?.name} src={'https://cdnimg.jacofood.ru/' + thisItem?.img_app + '_1420x1420.jpg'}
            width={1420}
            height={1420}
            priority={true}
          />
        ) : false}
      </div>

      <div className="itemDesc">
        <Typography className="ItemName" variant="h5" component="span">
          {thisItem?.name}
        </Typography>
        <Typography variant="h5" component="span" className="ItemDesk">
          {thisItem?.marc_desc?.length > 0 ? thisItem?.marc_desc : thisItem?.tmp_desc}
        </Typography>

        { parseInt(typePromo) == 2 ?
          parseInt(item?.price) == 0 ? false :
            <div className="containerBTNItemMobile">
              <span className="ModalItemButtonCartPC">
                {new Intl.NumberFormat('ru-RU').format(item?.price)} ₽
              </span>
            </div>
              :
            false
        }

        { parseInt(typePromo) == 2 ? false :
          count ? (
            <div className="containerBTNItemMobile">
              <div variant="contained">
                <button className="minus" onClick={() => this_minus(thisItem?.id)}>–</button>
                <span>{count}</span>
                <button className="plus" onClick={() => this_plus(thisItem?.id, thisItem?.cat_id)}>+</button>
              </div>
            </div>
          ) : (
            parseInt(item?.price) == 0 ? false :
              <div className="containerBTNItemMobile">
                <Button variant="outlined" className="ModalItemButtonCartPC" onClick={() => this_plus(thisItem?.id, thisItem?.cat_id)}>
                  {new Intl.NumberFormat('ru-RU').format(item?.price)} ₽
                </Button>
              </div>
          )
        }
      </div>

    </div>
  );
}

export default function ModalBannerMobile() {
  // console.log('render ModalBannerMobile');

  const [ getInfoPromo ] = useCartStore( state => [ state.getInfoPromo ] )
  const [ setActiveModalAlert, isAuth ] = useHeaderStore( state => [ state.setActiveModalAlert, state.isAuth ]);

  const [ setActiveBanner, openModalBanner, banner, openBannerItems, typePromo ] = useHomeStore((state) => [state.setActiveBanner, state.openModalBanner, state.banner, state.openBannerItems, state.typePromo]);

  const activePromo = (item) => {
    setActiveModalAlert(true, 'Промокод активирован', true);
    getInfoPromo(item.name, item.city_id);
    setActiveBanner(false, null);
  }

  console.log(openBannerItems);

  /*
    <Grid className="erid">
            <Typography variant="h5" component="h2" className="ItemTime" style={{ color: 'rgba(0, 0, 0, 0.20)' }}>
              {`Реклама, Jacofood.ru, erid: ${banner?.erid}`}
            </Typography>
          </Grid>
  */

  return (
    <SwipeableDrawer
      anchor={'bottom'}
      open={openModalBanner}
      onClose={() => setActiveBanner(false, null)}
      onOpen={() => {}}
      id="modalBannerMobile"
      className={roboto.variable}
      disableSwipeToOpen
    >
      <Box component="div" className="BannerMobile BannerFontMobile">
        <Grid container justifyContent="center">
          <Grid className="ImgItemMobile">
            <Image alt={banner?.title} src={'https://storage.yandexcloud.net/site-home-img/' + banner?.img + '1000х500.jpg'}
              width={1000}
              height={500}
              priority={true}
            />
            <Typography className="ItemTime" variant="h5" component="span" onClick={() => setActiveBanner(false, null)}>
              Условия акции
              <KeyboardArrowUpIcon />
            </Typography>
          </Grid>

          

          <Grid className="DescItemMobile">
            <Grid className="FirstItemMobile">
              <Typography className="ItemTitle" variant="h5" component="span">{banner?.title}</Typography>
              {banner && banner?.text ? <Grid dangerouslySetInnerHTML={{ __html: banner?.text }} /> : null}
            </Grid>

            <Grid className="SecondItemMobile">
              <div className="Title">
                {openBannerItems?.length > 0 ? <Typography variant="h5" component="h2" className="ItemTitle">Состав</Typography> : false}
              </div>

              <div className="List">
                {openBannerItems?.map((item, key) => (
                  <CartItemPromo key={item.item_id} data_key={key} item={item} typePromo={typePromo} promo={banner?.info} isAuth={isAuth} />
                ))}
              </div>

              { parseInt(typePromo) == 0 ? false :
                <div className='containerBTN'>
                  <button onClick={ () => activePromo(banner?.info) }>Воспользоватся акцией</button>
                </div>
              }
            </Grid>

          </Grid>
        </Grid>
      </Box>
    </SwipeableDrawer>
  );
}
