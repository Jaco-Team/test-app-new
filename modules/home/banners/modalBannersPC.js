import React, { useEffect, useState } from 'react';

//import Image from 'next/image';

import { useHomeStore, useCartStore, useHeaderStoreNew, useCitiesStore } from '@/components/store';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Button from '@mui/material/Button';

import { IconClose } from '@/ui/Icons';

import { roboto } from '@/ui/Font';

function CartItemPromo({ item, data_key, promo, typePromo, isAuth, bannerTitle }){

  const [ thisItem, setThisItem ] = useState({});
  const [ CatsItems, getItem ] = useHomeStore( state => [ state.CatsItems, state.getItem ]);
  const [ items, minus, plus, getInfoPromo ] = useCartStore( state => [ state.items, state.minus, state.plus, state.getInfoPromo ]);

  const [thisCity, thisCityRu] = useCitiesStore((state) => [ state.thisCity, state.thisCityRu ]);

  let count = 0;

  const metrica_param = {
    city: thisCityRu, 
    tovar: thisItem?.name, 
    category: thisItem?.cat_name,
    platform: 'pc',
    view: 'Баннер'
  };

  const metrica_param_min = {
    city: thisCityRu, 
    tovar: thisItem?.name, 
    category: thisItem?.cat_name,
  };

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
    if( promo?.name && promo?.name?.length > 0) {
      getInfoPromo(promo?.name, promo?.city_id);
    }

    plus(item_id, cat_id)
  }

  function this_minus(item_id){
    if( promo?.name && promo?.name?.length > 0) {
      getInfoPromo(promo?.name, promo?.city_id);
    }

    minus(item_id)
  }

  count = items.find( f_item => parseInt(f_item?.item_id) == parseInt( item?.id ) || parseInt(f_item?.item_id) == parseInt( item?.item_id ) );

  count = count ? count['count'] : 0;

  const add_to_cart = () => {
    this_plus(thisItem?.id, thisItem?.cat_id); 
    ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); 

    ymDataLayer.push({
      "ecommerce": {
        "currencyCode": "RUB",    
        "add": {
          "products": [
            {
              "id": thisItem?.id,
              "name": thisItem?.name,
              "price": item?.price,
              //"brand": "Яндекс / Яndex",
              "category": thisItem?.cat_name,
              "quantity": 1,
              //"list": "Выдача категории",
              "position": 1
            }
          ]
        }
      }
    });

    if( thisCityRu == 'Самара' ){
      ym(100325084, 'reachGoal', 'add_to_cart', metrica_param_min); 

      ym(100325084, 'reachGoal', 'active_actia_all', {akcia_name: bannerTitle}); 
      ym(100325084, 'reachGoal', 'active_actia_home', {akcia_name: bannerTitle}); 
    }

    if( thisCityRu == 'Тольятти' ){
      ym(100601350, 'reachGoal', 'add_to_cart', metrica_param_min); 

      ym(100601350, 'reachGoal', 'active_actia_all', {akcia_name: bannerTitle}); 
      ym(100601350, 'reachGoal', 'active_actia_home', {akcia_name: bannerTitle}); 
    }

    try{
      // roistat.event.send('active_actia_all');
      // roistat.event.send('active_actia_home');

      // roistat.event.send('add_to_cart', {
      //   id: thisItem?.id,
      //   name: thisItem?.name,
      //   price: thisItem?.price,
      //   quantity: 1,
      //   category: {
      //     "level1": thisItem?.cat_name,
      //   },
      // });
    } catch(e){ console.log(e) }
  }

  const remove_from_cart = () => {
    this_minus(thisItem?.id); 
    ym(47085879, 'reachGoal', 'remove_from_cart', metrica_param); 

    ymDataLayer.push({
      "ecommerce": {
        "currencyCode": "RUB",
        "remove": {
          "products": [
            {
              "id": thisItem?.id,
              "name": thisItem?.name,
              "category": thisItem?.cat_name,
              "quantity": 1,
              //"list": "Аксессуары",
              "position": 1
            }
          ]
        }
      }
    });

    if( thisCityRu == 'Самара' ){
      ym(100325084, 'reachGoal', 'remove_from_cart', metrica_param_min);
    }

    if( thisCityRu == 'Тольятти' ){
      ym(100601350, 'reachGoal', 'remove_from_cart', metrica_param_min);
    }

    try{
      // roistat.event.send('remove_from_cart', {
      //   id: thisItem?.item_id,
      //   name: thisItem?.name,
      //   price: thisItem?.price,
      //   quantity: 1,
      //   category: {
      //     "level1": thisItem?.cat_name,
      //   },
      // });
    } catch(e){ console.log(e) }
  }

  return (
    <div>
      <div className="itemNumber">
        <span className="ItemOther">{data_key + 1}.</span>
      </div>

      <div className="itemImg">
        {thisItem?.img_app ? (

          // <Image alt={item?.name} src={'${process.env.NEXT_PUBLIC_YANDEX_IMG}' + thisItem?.img_app + '_1420x1420.jpg'}

          // <Image alt={item?.name} src={'https://cdnimg.jacofood.ru/' + thisItem?.img_app + '_1420x1420.jpg'}
          //   width={1420}
          //   height={1420}
          //   priority={true}
          // />
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
        ) : false}
      </div>

      <div className="itemDesc">
        <Typography className="ItemName" variant="h5" component="span" onClick={() => getItem('home', thisCity, thisItem?.id)}>
          {thisItem?.name}
        </Typography>
        <Typography variant="h5" component="span" className="ItemDesk" onClick={() => getItem('home', thisCity, thisItem?.id)}>
          {thisItem?.marc_desc?.length > 0 ? thisItem?.marc_desc : thisItem?.tmp_desc}
        </Typography>

        { parseInt(typePromo) == 2 ?
          parseInt(item?.price) == 0 ? false :
            <div className="containerBTNitem">
              <span className="ModalItemButtonCartPC">
                {new Intl.NumberFormat('ru-RU').format(item?.price)} ₽
              </span>
            </div>
              :
            false
        }

        { parseInt(typePromo) == 2 ? false :
          count ? (
            <div className="containerBTNitem">
              <div variant="contained">
                <button className="minus" onClick={remove_from_cart}>–</button>
                <span>{count}</span>
                <button className="plus" onClick={add_to_cart}>+</button>
              </div>
            </div>
          ) : (
            parseInt(item?.price) == 0 ? false :
              <div className="containerBTNitem">
                <Button variant="outlined" className="ModalItemButtonCartPC" onClick={add_to_cart}>
                  {new Intl.NumberFormat('ru-RU').format(item?.price)} ₽
                </Button>
              </div>
          )
        }
      </div>

    </div>
  );
}

export default function ModalBannerPC() {
  const [ getInfoPromo ] = useCartStore( state => [ state.getInfoPromo ] )
  const [ setActiveModalAlert, isAuth ] = useHeaderStoreNew( state => [ state?.setActiveModalAlert, state?.isAuth ]);
  const [thisCity, thisCityRu] = useCitiesStore((state) => [ state.thisCity, state.thisCityRu ]);

  const [ setActiveBanner, openModalBanner, banner, openBannerItems, typePromo ] = useHomeStore((state) => [state.setActiveBanner, state.openModalBanner, state.banner, state.openBannerItems, state.typePromo]);

  const activePromo = async(item) => {
    const res = await getInfoPromo(item.name, item.city_id);

    if( res.st === false ) {
      setActiveModalAlert(true, res.text, false);
    }else{
      setActiveModalAlert(true, 'Промокод активирован', true);
      setActiveBanner(false, null);
    }
  };

  const activeActia = () => {
    activePromo(banner?.info);

    if( thisCityRu == 'Самара' ){
      ym(100325084, 'reachGoal', 'active_actia_all', {akcia_name: banner?.title}); 
      ym(100325084, 'reachGoal', 'active_actia_home', {akcia_name: banner?.title}); 
    }

    if( thisCityRu == 'Тольятти' ){
      ym(100601350, 'reachGoal', 'active_actia_all', {akcia_name: banner?.title}); 
      ym(100601350, 'reachGoal', 'active_actia_home', {akcia_name: banner?.title}); 
    }
  }

  const hasVideo = Boolean(banner?.type_illustration == 'video');

  return (
    <Dialog
      onClose={() => setActiveBanner(false, null)}
      className={'modalBannerPC ' + roboto.variable}
      open={openModalBanner}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      scroll="body"
    >
      <DialogContent style={{ padding: 0, overflow: 'hidden' }}>
        <Box component="div" className="BannerPC BannerFontPC">
          <IconButton className="iconBTN" onClick={() => setActiveBanner(false, null)}>
            <IconClose />
          </IconButton>

          <Grid container justifyContent="center">
            <Grid className="ImgItem">
              {/* <Image alt={banner?.title} src={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}` + banner?.img + '_3700x1000.jpg'}
                width={3700}
                height={1000}
                priority={true}
              /> */}
              {hasVideo ?
                <video
                  // ref={(el) => { if (el) videoRefs.current[s.key] = el; }}
                  muted
                  playsInline
                  autoPlay
                  loop
                  preload="auto"
                  // className="item_banner_image"
                  style={{
                    width: "100%",
                    height: "auto",
                    // minHeight: 300,
                    objectFit: "cover",
                    pointerEvents: "none",
                  }}
                  // onEnded={() => handleVideoEnded(s.key)}
                  // onCanPlay={() => handleVideoCanPlay(s.key)}
                >
                  <source src={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}` + banner?.img + '_video_1920x1080.mp4'} type="video/mp4" />
                  {/* <source src={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}` + banner?.img + '_video_1920x1080.webm'} type="video/webm" /> */}
                </video>
                  :
                <picture>
                  <source 
                    type="image/webp" 
                    srcSet={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}` + banner?.img + '_3700x1000.jpg'} 
                    sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
                  <source 
                    type="image/jpeg" 
                    srcSet={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}` + banner?.img + '_3700x1000.jpg'} 
                    sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

                  <img 
                    alt={banner?.title} 
                    title={banner?.title} 
                    src={`${process.env.NEXT_PUBLIC_YANDEX_STORAGE}` + banner?.img + '_3700x1000.jpg'} 
                    loading="lazy"
                  />
                </picture>
              }
              <Typography className="ItemOther" variant="h5" component="span" onClick={() => setActiveBanner(false, null)}>
                Условия акции
                <KeyboardArrowUpIcon />
              </Typography>
            </Grid>

            <Grid className="DescItem">
              <Grid className="FirstItem">
                <div className="Title">
                  {openBannerItems?.length ? <Typography variant="h5" component="h2" className="ItemTitle">Состав</Typography> : null}
                </div>

                <div className="List">
                  {openBannerItems?.map((item, key) => (
                    <CartItemPromo key={key} data_key={key} item={item} typePromo={typePromo} promo={banner?.info} isAuth={isAuth} bannerTitle={banner?.title} />
                  ))}
                </div>

                { parseInt(typePromo) == 0 ? false :
                  <div className='containerBTN'>
                    <button onClick={ activeActia }>Воспользоватся акцией</button>
                  </div>
                }
                
              </Grid>

              <Grid className="SecondItem">
                <Typography className="ItemTitle" variant="h5" component="span" style={{ marginBottom: '1.2vw' }}>
                  {banner?.title}
                </Typography>

                {banner && banner?.text ? (
                  <Grid dangerouslySetInnerHTML={{ __html: banner?.text }} />
                ) : null}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
