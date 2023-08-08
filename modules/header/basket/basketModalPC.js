import { useState, useEffect } from 'react';

import { useCartStore, useCitiesStore } from '@/components/store.js';

import Image from 'next/image';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';

import { roboto } from '@/ui/Font.js';
import { IconClose, ArrowDownBasketModalPC, CityBasketModalPC, HomeBasketModalPC, PointBasketModalPC, TimeBasketModalPC, CardBasketModalPC, GroupCircleBasketModalPC, 
  MessageBasketModalPC } from '@/ui/Icons.js';
import { SwitchBasketPC as MySwitch } from '@/ui/MySwitch.js';
import MasterCard from '@/public/masterCard.png';

const pointListTLT = [
  { name: 'Ленинградская 47', id: '1' },
  { name: 'Ворошилова 12а', id: '2' },
  { name: 'Цветной 1', id: '3' },
  { name: 'Матросова 32', id: '4' },
];
const pointListSMR = [
  { name: 'Молодёжная 2', id: '1' },
  { name: 'Куйбышева 113', id: '2' },
  { name: 'Победы 10', id: '3' },
];

export default function BasketModalPC() {

  //console.log('BasketModalPC render')

  const [allPriceWithoutPromo, itemsCount, setActiveModalBasket, openModalBasket, allPrice] = useCartStore(
    (state) => [state.allPriceWithoutPromo, state.itemsCount, state.setActiveModalBasket, state.openModalBasket, state.allPrice]);
  const [thisCityList, thisCityRu, setThisCityRu] = useCitiesStore((state) => [state.thisCityList, state.thisCityRu, state.setThisCityRu]);

  const [form, setForm] = useState(false);
  const [list, setList] = useState([]);
  const [nameList, setNameList] = useState('');
  const [point, setPoint] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (thisCityRu === 'Тольятти') {
      setPoint(pointListTLT[0].name);
    } else {
      setPoint(pointListSMR[0].name)
    }
  }, [thisCityRu]);

  const openMenu = (event, nameList) => {
    if (nameList === 'city') {
      setList(thisCityList);
      setNameList(nameList);
    }
    
    if (nameList === 'point') {
      setNameList(nameList);
      
      if (thisCityRu === 'Тольятти') {
        setList(pointListTLT);
      }
      
      if (thisCityRu === 'Самара') {
        setList(pointListSMR);
      }
    }

    setAnchorEl(event.currentTarget);
  };
  
  const chooseItem = (item) => {
    if (nameList === 'city') {
      setThisCityRu(item.name);
      setAnchorEl(null);
    }
    
    if (nameList === 'point') {
      setPoint(item.name);
      setAnchorEl(null);
    }
  };

  const closeBasket = () => {
    setActiveModalBasket(false);
    setForm(false);
  }

  function getWord(int, array) {
    return ((array = array || ['позиция', 'позиции', 'позиций']) && array[int % 100 > 4 && int % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][int % 10 < 5 ? int % 10 : 5]]);
  }

  return (
    <Dialog
      onClose={closeBasket}
      className={'modalBasketMainPC ' + roboto.variable}
      open={openModalBasket}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      scroll="body"
    >
      <DialogContent>
        <Box component="div" className="modalBasketPC">
          
          <IconButton className="closeButtonBasketPC" onClick={closeBasket}>
            <IconClose />
          </IconButton>

          <div className="modalBasketContainer">
            <div className="basketHeader">
              <Typography component="span">Оформление заказа</Typography>
            </div>

            <Stack direction="row" alignItems="center" style={{ width: '28.880866425993vw', marginBottom: '2.8880866425993vw' }}>
              <MySwitch onClick={(event) => setForm(event.target.checked)}/>
            </Stack>

            <Button className="basketChoose" onClick={(event) => openMenu(event, 'city')}
              endIcon={open ? nameList === 'city' ? <ArrowDownBasketModalPC style={{ transform: 'rotate(180deg)' }} /> : <ArrowDownBasketModalPC /> : <ArrowDownBasketModalPC />}>
              <div>
                <Typography component="span"><CityBasketModalPC /></Typography>
                <Typography component="span">{thisCityRu}</Typography>
              </div>
            </Button>

            {form ? (
              <Button className="basketChoose" onClick={(event) => openMenu(event, 'point')}
                endIcon={open ? nameList === 'point' ? <ArrowDownBasketModalPC style={{ transform: 'rotate(180deg)' }} /> : <ArrowDownBasketModalPC /> : <ArrowDownBasketModalPC />}>
                <div>
                  <Typography component="span"><PointBasketModalPC /></Typography>
                  <Typography component="span">{point}</Typography>
                </div>
              </Button>
            ) : (
              <Button className="basketChoose" endIcon={<ArrowDownBasketModalPC />}
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
              <Button className="basketChoose" endIcon={<ArrowDownBasketModalPC />}
                //onClick={openMenu}
              >
                <div>
                  <Typography component="span"><TimeBasketModalPC /></Typography>
                  <Typography component="span">В ближайшее время</Typography>
                </div>
              </Button>
            ) : (
              <Button className="basketChoose" endIcon={<ArrowDownBasketModalPC />}
                //onClick={openMenu}
              >
                <div>
                  <Typography component="span"><TimeBasketModalPC /></Typography>
                  <Typography component="span">Сегодня к 17:15</Typography>
                </div>
              </Button>
            )}

            {form ? (
              <Button className="basketChoose" endIcon={<ArrowDownBasketModalPC />} style={{ marginBottom: '2.8880866425993vw' }}
                //onClick={openMenu}
              >
                <div>
                  <Typography component="span"><CardBasketModalPC /></Typography>
                  <Typography component="span">Оплачу наличными</Typography>
                </div>
              </Button>
            ) : (
              <Button className="basketChoose" endIcon={<ArrowDownBasketModalPC />}
                //onClick={openMenu}
              >
                <div>
                  <Typography component="span"><CardBasketModalPC /></Typography>
                  <Image alt="Банковская карта" src={MasterCard} width={49} height={40} priority={true}/>
                  <Typography component="span" style={{ marginRight: '0.18050541516245vw' }}><GroupCircleBasketModalPC /></Typography>
                  <Typography component="span"><GroupCircleBasketModalPC /></Typography>
                  <Typography component="span">8472</Typography>
                </div>
              </Button>
            )}

            {form ? null : (
              <Button className="basketChoose" endIcon={<ArrowDownBasketModalPC />} style={{ marginBottom: '2.8880866425993vw' }}
                //onClick={openMenu}
              >
                <div>
                  <Typography component="span"><MessageBasketModalPC /></Typography>
                  <Typography component="span" style={{ color: 'rgba(0, 0, 0, 0.40)' }}>Сообщение курьеру</Typography>
                </div>
              </Button>
            )}

            <div className="basketLine"></div>

            {form ? null : (
              <div className="basketDelivery">
                <span>Доставка:</span>
                <span>
                  119 ₽
                  {/* {new Intl.NumberFormat('ru-RU').format(allPriceWithoutPromo)} ₽ */}
                </span>
              </div>
            )}
            <div className="basketTotal" style={{ marginTop: form ? '2.1660649819495vw' : '0.72202166064982vw' }}>
              <span>
                Итого: {itemsCount} {getWord(itemsCount)}
              </span>
              <span>
                {new Intl.NumberFormat('ru-RU').format(allPrice ? allPrice : allPriceWithoutPromo)} ₽
              </span>
            </div>

            <Button className="basketOrder" variant="contained" onClick={closeBasket}>
              <span>Заказать</span>
            </Button>
          </div>

          <Menu id="basketChooseModal" className={roboto.variable} anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
            {list.map((item, key) => <MenuItem key={key} onClick={() => chooseItem(item)}>{item.name}</MenuItem>)}
          </Menu>

        </Box>
      </DialogContent>
    </Dialog>
  );
}
