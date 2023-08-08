import { useState, useEffect } from 'react';

import Image from 'next/image';

import { useHeaderStore, useCitiesStore, useCartStore } from '@/components/store.js';

import MyTextInput from '@/ui/MyTextInput';
import CartItemMobile from './cartItemsMobile';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { SwitchBasketMobile as MySwitch } from '@/ui/MySwitch.js';

import { ArrowDownCartMobile, CityBasketModalPC, HomeBasketModalPC, PointBasketModalPC, TimeBasketModalPC, CardBasketModalPC, GroupCircleCartMobile, 
  MessageBasketModalPC } from '@/ui/Icons.js';

import MasterCard from '@/public/masterCard.png';

const dopText = {
  text: 'Выберите столько приправ и приборов, сколько необходимо',
};

export default function CartMobile() {
  //console.log('render CartMobile');

  const [form, setForm] = useState(false);
  const [promo, setPromo] = useState('');

  //const [nameList, setNameList] = useState('');

  const [setActiveModalCityList] = useHeaderStore((state) => [state.setActiveModalCityList]);
  const [thisCity, thisCityRu] = useCitiesStore((state) => [state.thisCity, state.thisCityRu]);
  const [itemsCount, promoInfo, allPriceWithoutPromo, promoItemsFind, itemsOnDops, itemsOffDops, allPrice, getInfoPromo, checkPromo] = 
    useCartStore((state) => [state.itemsCount, state.promoInfo, state.allPriceWithoutPromo, state.promoItemsFind, state.itemsOnDops, state.itemsOffDops, state.allPrice,
    state.getInfoPromo, state.checkPromo]);

  useEffect(() => {
    if (localStorage.getItem('promo_name') && localStorage.getItem('promo_name').length > 0) {
      setPromo(localStorage.getItem('promo_name'));
    }
  }, []);

  const openMenu = (event, nameList) => {
    if (nameList === 'city') {
      setActiveModalCityList(true);
    }
  };
 
  function getWord(int, array) {
    return ((array = array || ['позиция', 'позиции', 'позиций']) && array[int % 100 > 4 && int % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][int % 10 < 5 ? int % 10 : 5]]);
  }

  return (
    <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className="CartMobile">
      <div className="CartMobileContainer">
        <div className="CartMobileText">Оформить заказ</div>

        <Stack direction="row" alignItems="center" style={{ width: '86.324786324786vw', marginBottom: '6.8376068376068vw' }}>
          <MySwitch onClick={(event) => setForm(event.target.checked)} />
        </Stack>

        <Button className="CartChoose" onClick={(event) => openMenu(event, 'city')} endIcon={<ArrowDownCartMobile />}>
          <div>
            <Typography component="span"><CityBasketModalPC /></Typography>
            <Typography component="span">{thisCityRu}</Typography>
          </div>
        </Button>

        {form ? (
          <Button className="CartChoose" onClick={(event) => openMenu(event, 'point')} endIcon={<ArrowDownCartMobile />}>
            <div>
              <Typography component="span"><PointBasketModalPC /></Typography>
              <Typography component="span">Ворошилова, 12а</Typography>
            </div>
          </Button>
        ) : (
          <Button className="CartChoose" endIcon={<ArrowDownCartMobile />}
            //onClick={openMenu}
          >
            <div>
              <Typography component="span"><HomeBasketModalPC /></Typography>
              <Typography component="span" style={{ textTransform: 'uppercase' }}>ДОМ</Typography>
              <Typography component="span">Юбилейная 287, кв. 365</Typography>
            </div>
          </Button>
        )}

        {form ? (
          <Button className="CartChoose" endIcon={<ArrowDownCartMobile />}
            //onClick={openMenu}
          >
            <div>
              <Typography component="span"><TimeBasketModalPC /></Typography>
              <Typography component="span">В ближайшее время</Typography>
            </div>
          </Button>
        ) : (
          <Button className="CartChoose" endIcon={<ArrowDownCartMobile />}
            //onClick={openMenu}
          >
            <div>
              <Typography component="span"><TimeBasketModalPC /></Typography>
              <Typography component="span">Сегодня к 17:15</Typography>
            </div>
          </Button>
        )}

        {form ? (
          <Button className="CartChoose" endIcon={<ArrowDownCartMobile />} style={{ marginBottom: '6.8376068376068vw' }}
            //onClick={openMenu}
          >
            <div>
              <Typography component="span"><CardBasketModalPC /></Typography>
              <Typography component="span">Оплачу наличными</Typography>
            </div>
          </Button>
        ) : (
          <Button className="CartChoose" endIcon={<ArrowDownCartMobile />}
            //onClick={openMenu}
          >
            <div>
              <Typography component="span"><CardBasketModalPC /></Typography>
              <Image alt="Банковская карта" src={MasterCard} width={49} height={40} priority={true}/>
              <Typography component="span" style={{ marginRight: '6.8376068376068vw' }}><GroupCircleCartMobile /></Typography>
              <Typography component="span">8472</Typography>
            </div>
          </Button>
        )}

        {form ? null : (
          <Button className="CartChoose" endIcon={<ArrowDownCartMobile />} style={{ marginBottom: '6.8376068376068vw' }}
            //onClick={openMenu}
          >
            <div>
              <Typography component="span"><MessageBasketModalPC /></Typography>
              <Typography component="span">Сообщение курьеру</Typography>
            </div>
          </Button>
        )}

        {itemsOffDops.map((item, key) => (
          <CartItemMobile key={key} count={item.count} item={item} last={item === itemsOffDops.at(-1) && itemsOnDops.length ? 'last' : ''}/>
        ))}

        {itemsOnDops.length ? (
          <>
            <div className="CartItemDopText">
              <span>{dopText.text}</span>
            </div>
            {itemsOnDops.map((item, key) => (
              <CartItemMobile key={key} count={item.count} item={item} last={''}/>
            ))}
          </>
        ) : null}

        {form ? null : (
          <div className="CartDelivery">
            <span>Доставка:</span>
            <span>
              119 ₽
              {/* {new Intl.NumberFormat('ru-RU').format(allPriceWithoutPromo)} ₽ */}
            </span>
          </div>
        )}

        <div className="CartTotal" style={{ marginTop: form ? '5.1282051282051vw' : 0 }}>
          <span>Итого: {itemsCount} {getWord(itemsCount)}</span>
          <div>
          <span className={promoInfo?.items_on_price?.length ? promoItemsFind ? 'promoInfo' : null : promoInfo?.status_promo && itemsOffDops.length ? 'promoInfo' : null}>
            {new Intl.NumberFormat('ru-RU').format(allPriceWithoutPromo)}{' '}₽
          </span>
            {/* {new Intl.NumberFormat('ru-RU').format(
              allPrice ? allPrice : allPriceWithoutPromo
            )}{' '}
            ₽ */}
          </div>
        </div>

        <div className="CartPromo">
            <MyTextInput
              placeholder="Есть промокод"
              value={promo}
              label=""
              onBlur={() => getInfoPromo(promo, thisCity)}
              func={(event) => setPromo(event.target.value)}
              inputAdornment={
                <InputAdornment position="end">
                  {promoInfo ? promoInfo.status_promo ? <div className="circleInput"></div> : <div className="circleInput" style={{ background: '#DD1A32' }}></div> : null}
                </InputAdornment>
              }
            />
            {promoInfo?.items_on_price?.length ? promoItemsFind ? <div>{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</div> : null 
              : promoInfo?.status_promo && itemsCount ? <div>{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</div> : null}
          </div>

          <div className="CartItemDescPromo">
            <span style={{ color: promoInfo?.status_promo ? 'rgba(0, 0, 0, 0.80)' : '#DD1A32'}}>{checkPromo?.text}</span>
          </div>

        <Button className="CartOrder" variant="contained" disabled={!itemsCount}
        //onClick={closeBasket}
        >
          <span>Заказать</span>
        </Button>

      </div>
    </Box>
  );
}
