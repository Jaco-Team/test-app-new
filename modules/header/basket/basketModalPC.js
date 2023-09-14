import { useState, useEffect } from 'react';

import { useCartStore, useCitiesStore } from '@/components/store.js';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

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

export default function BasketModalPC() {

  const { push } = useRouter();
  const session = useSession();

  const [allPriceWithoutPromo, itemsCount, setActiveModalBasket, openModalBasket, allPrice, pointList, getTimesPred, getMySavedAddr, createOrder] = useCartStore(
    (state) => [state.allPriceWithoutPromo, state.itemsCount, state.setActiveModalBasket, state.openModalBasket, state.allPrice, state.pointList, state.getTimesPred, state.getMySavedAddr, state.createOrder]);
  const [thisCityList, thisCity, thisCityRu, setThisCityRu] = useCitiesStore((state) => [state.thisCityList, state.thisCity, state.thisCityRu, state.setThisCityRu]);

  const [form, setForm] = useState(false);
  const [list, setList] = useState([]);
  const [nameList, setNameList] = useState('');
  const [point, setPoint] = useState(null);
  const [datePred, setDatePred] = useState(null);
  const [timePred, setTimePred] = useState({ name: 'В ближайшее время', id: -1 });
  const [typePay, setTypePay] = useState(null);
  const [addrDiv, setAddrDiv] = useState(null);
  const [summDiv, setSummDiv] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [comment, setComment] = useState('');
  const [sdacha, setSdacha] = useState(0);

  const type_pay_pic = [
    {id: 'cash', name: 'В кафе'}
  ];

  const type_pay_div = [
    {id: 'cash', name: 'Наличными курьеру'},
    {id: 'online', name: 'Онлайн на сайте'},
  ];

  const open = Boolean(anchorEl);

  useEffect(() => {
    if( form ){
      setTypePay(type_pay_pic[0]);
      setSummDiv(0);
    }else{
      setTypePay(null);
      setSummDiv(0);
    }
  }, [form]);

  const openMenu = async(event, nameList) => {
    setNameList(nameList);

    if (nameList === 'city') {
      setList(thisCityList);
      setAnchorEl(event.currentTarget);
    }
    
    if (nameList === 'point') {
      const points = pointList.filter( point_ => point_.name_ru == thisCityRu )

      setList(points);
      setAnchorEl(event.currentTarget);
    }

    if (nameList === 'time') {
      const point_id = form ? point?.id : addrDiv.point_id;

      if( point_id ){
        setAnchorEl(event.currentTarget);
        
        const res = await getTimesPred(point_id, datePred, !form ? 0 : 1, []);

        setList(res);
      }else{
        //вывести ошибку
      }
    }

    if (nameList === 'pay') {
      if( form ){
        setList(type_pay_pic);
      }else{
        setList(type_pay_div);
      }

      setAnchorEl(event.currentTarget);
    }

    if (nameList === 'addr') {
      setAnchorEl(event.currentTarget);

      const res = await getMySavedAddr(thisCity, session.data.user.token);

      setList(res);
    }
    
  };
  
  const chooseItem = (item) => {

    if (nameList === 'city') {
      setThisCityRu(item.name);
      setAnchorEl(null);
      localStorage.setItem('setCity', JSON.stringify(item));
      push(`/${item.link}`);

      setPoint(null);
    }
    
    if (nameList === 'point') {
      setPoint(item);
      setSummDiv(0);
      setAnchorEl(null);
    }

    if (nameList === 'time') {
      setTimePred(item);
      setAnchorEl(null);
    }

    if (nameList === 'pay') {
      setTypePay(item);
      setAnchorEl(null);
    }

    if (nameList === 'addr') {
      setAddrDiv(item);
      setSummDiv(item.sum_div);
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

  function create_order(){
    //token, typeOrder, city_id, point_id, addr, typePay, dateTimeOrder, comment, sdacha, promoName

    createOrder(
      session.data.user.token,
      form ? 1 : 0,
      thisCity,
      point['id'],
      addrDiv,
      typePay['id'],
      timePred['id'],
      comment,
      sdacha,
      ''
    );
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
                  <Typography component="span">{point?.name}</Typography>
                </div>
              </Button>
            ) : (
              <Button className="basketChoose" endIcon={<ArrowDownBasketModalPC />}
                onClick={(event) => openMenu(event, 'addr')}
              >
                <div>
                  <Typography component="span"><HomeBasketModalPC /></Typography>
                  { addrDiv?.addr_name.length == 0 ? false :
                    <Typography component="span" style={{ textTransform: 'uppercase' }}>{addrDiv?.addr_name}</Typography> }
                  <Typography component="span">{addrDiv?.name}</Typography>
                </div>
              </Button>
            )}

            
            <Button className="basketChoose" endIcon={<ArrowDownBasketModalPC />}
              onClick={(event) => openMenu(event, 'time')}
            >
              <div>
                <Typography component="span"><TimeBasketModalPC /></Typography>
                <Typography component="span">{timePred?.name}</Typography>
              </div>
            </Button>
            
            <Button className="basketChoose" endIcon={<ArrowDownBasketModalPC />} style={{ marginBottom: '2.8880866425993vw' }}
              onClick={(event) => openMenu(event, 'pay')}
            >
              <div>
                <Typography component="span"><CardBasketModalPC /></Typography>
                <Typography component="span">{typePay?.name}</Typography>
              </div>
            </Button>
            
            {form || typePay?.id != 'cash' ? null : (
              <Button className="basketChoose" endIcon={<ArrowDownBasketModalPC />} style={{ marginBottom: '2.8880866425993vw' }}
                //onClick={openMenu}
              >
                <div>
                  <Typography component="span"><MessageBasketModalPC /></Typography>
                  <Typography component="span" style={{ color: 'rgba(0, 0, 0, 0.40)' }}>Без сдачи</Typography>
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
                  {new Intl.NumberFormat('ru-RU').format(summDiv)} ₽
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

            <Button className="basketOrder" variant="contained" onClick={ () => create_order() }>
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
