import React, { useEffect, useState } from 'react';

//import Image from 'next/image';

import { useHomeStore, useCartStore, useHeaderStore, useCitiesStore } from '@/components/store';

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

function CartItemPromo({ item, data_key, promo, typePromo, isAuth }){

  const [ thisItem, setThisItem ] = useState({});
  const [ CatsItems ] = useHomeStore( state => [ state.CatsItems ]);
  const [ items, minus, plus, getInfoPromo ] = useCartStore( state => [ state.items, state.minus, state.plus, state.getInfoPromo ]);

  const [thisCityRu] = useCitiesStore((state) => [ state.thisCityRu ]);

  let count = 0;

  const metrica_param = {
    city: thisCityRu, 
    tovar: thisItem?.name, 
    category: thisItem?.cat_name,
    platform: 'pc',
    view: 'Баннер'
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

  return (
    <div>
      <div className="itemNumber">
        <span className="ItemOther">{data_key + 1}.</span>
      </div>

      <div className="itemImg">
        {thisItem?.img_app ? (
          // <Image alt={item?.name} src={'https://cdnimg.jacofood.ru/' + thisItem?.img_app + '_1420x1420.jpg'}
          //   width={1420}
          //   height={1420}
          //   priority={true}
          // />
          <picture>
            <source 
              type="image/webp" 
              srcSet={`
                https://cdnimg.jacofood.ru/${thisItem.img_app}_366x366.webp 138w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_466x466.webp 146w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_585x585.webp 183w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_585x585.webp 233w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_585x585.webp 292w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_732x732.webp 366w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_1168x1168.webp 584w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_1168x1168.webp 760w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_1420x1420.webp 1875w`} 
              sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
            <source 
              type="image/jpeg" 
              srcSet={`
                https://cdnimg.jacofood.ru/${thisItem.img_app}_366x366.jpg 138w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_466x466.jpg 146w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_585x585.jpg 183w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_585x585.jpg 233w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_585x585.jpg 292w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_732x732.jpg 366w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_1168x1168.jpg 584w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_1168x1168.jpg 760w,
                https://cdnimg.jacofood.ru/${thisItem.img_app}_1420x1420.jpg 1875w`} 
              sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

            <img 
              alt={thisItem?.name} 
              title={thisItem?.name} 
              src={`https://cdnimg.jacofood.ru/${thisItem.img_app}_292x292.jpg`} 
              loading="lazy"
            />
          </picture>
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
                <button className="minus" onClick={() => { this_minus(thisItem?.id); ym(47085879, 'reachGoal', 'remove_from_cart', metrica_param); } }>–</button>
                <span>{count}</span>
                <button className="plus" onClick={() => { this_plus(thisItem?.id, thisItem?.cat_id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); } }>+</button>
              </div>
            </div>
          ) : (
            parseInt(item?.price) == 0 ? false :
              <div className="containerBTNitem">
                <Button variant="outlined" className="ModalItemButtonCartPC" onClick={() => { this_plus(thisItem?.id, thisItem?.cat_id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); } }>
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
  const [ setActiveModalAlert, isAuth ] = useHeaderStore( state => [ state.setActiveModalAlert, state.isAuth ]);

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
              {/* <Image alt={banner?.title} src={'https://storage.yandexcloud.net/site-home-img/' + banner?.img + '_3700x1000.jpg'}
                width={3700}
                height={1000}
                priority={true}
              /> */}
              <picture>
                <source 
                  type="image/webp" 
                  srcSet={'https://storage.yandexcloud.net/site-home-img/' + banner?.img + '_3700x1000.jpg'} 
                  sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
                <source 
                  type="image/jpeg" 
                  srcSet={'https://storage.yandexcloud.net/site-home-img/' + banner?.img + '_3700x1000.jpg'} 
                  sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

                <img 
                  alt={banner?.title} 
                  title={banner?.title} 
                  src={'https://storage.yandexcloud.net/site-home-img/' + banner?.img + '_3700x1000.jpg'} 
                  loading="lazy"
                />
              </picture>
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
                    <CartItemPromo key={key} data_key={key} item={item} typePromo={typePromo} promo={banner?.info} isAuth={isAuth} />
                  ))}
                </div>

                { parseInt(typePromo) == 0 ? false :
                  <div className='containerBTN'>
                    <button onClick={ () => activePromo(banner?.info) }>Воспользоватся акцией</button>
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
