import { useState, useEffect } from 'react';

//import Image from 'next/image';
import Link from 'next/link';

import { useHomeStore, useCartStore, useFooterStore, useCitiesStore } from '@/components/store';

import BadgeItem from './badge';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
//import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { IconClose, IconInfo } from '@/ui/Icons';

import { roboto } from '@/ui/Font';

import { reachGoalSplit } from '@/utils/metrika';

export default function ModalCardItemPC() {
  const [isOpenModal, closeModal, typeModal, openItem, foodValue, navigate, closeTypeModal, getItem] = useHomeStore((state) => {
    return [state.isOpenModal, state.closeModal, state.typeModal, state.openItem, state.foodValue, state.navigate, state.closeTypeModal, state.getItem];
  });

  const [links] = useFooterStore((state) => [state.links]);
  const [thisCity, thisCityRu] = useCitiesStore((state) => [state.thisCity, state.thisCityRu]);
  const [minus, plus] = useCartStore((state) => [state.minus, state.plus]);
  const [count, setCount] = useState(0);
  const [valueMode, setValueMode] = useState('per100');
  
  const metrica_param = {
    city: thisCityRu, 
    tovar: openItem?.name, 
    category: openItem?.cat_name,
    platform: 'pc',
    view: 'Модалка товара'
  };

  const metrica_param_min = {
    city: thisCityRu, 
    tovar: openItem?.name, 
    category: openItem?.cat_name,
  };

  useEffect( () => {

    const items = useCartStore.getState().items;
  
    const findItems = items.find(it => it.item_id === openItem?.id)
      
    if(findItems) {
      setCount(findItems.count)
    } else {
      setCount(0)
    }
    
  }, [isOpenModal] )
  
  const changeCountPlus = (id) => {
    plus(id, openItem?.cat_id);

    const items = useCartStore.getState().items;
    const found = items.find(it => parseInt(it.item_id) === parseInt(id));
    setCount(found ? found.count : 0);
  };

  const changeCountMinus = (id) => {
    minus(id);

    const items = useCartStore.getState().items;
    const found = items.find(it => parseInt(it.item_id) === parseInt(id));
    setCount(found ? found.count : 0);
  };

  const img_name = openItem?.img_app;

  const add_to_cart = () => {
    changeCountPlus(openItem?.id);
    reachGoalSplit('add_to_cart', metrica_param, metrica_param_min);

    ymDataLayer.push({
      "ecommerce": {
        "currencyCode": "RUB",    
        "add": {
          "products": [
            {
              "id": openItem?.id,
              "name": openItem?.name,
              "price": openItem?.price,
              //"brand": "Яндекс / Яndex",
              "category": openItem?.cat_name,
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
      //   id: openItem?.id,
      //   name: openItem?.name,
      //   price: openItem?.price,
      //   quantity: 1,
      //   category: {
      //     "level1": openItem?.cat_name,
      //   },
      // });
    } catch(e){ console.log(e) }
  }

  const remove_from_cart = () => {
    changeCountMinus(openItem?.id);
    reachGoalSplit('remove_from_cart', metrica_param, metrica_param_min);

    ymDataLayer.push({
      "ecommerce": {
        "currencyCode": "RUB",
        "remove": {
          "products": [
            {
              "id": openItem?.id,
              "name": openItem?.name,
              "category": openItem?.cat_name,
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

  const sostav_seta = () => {
    navigate('set')

    reachGoalSplit('sostav_seta', metrica_param, metrica_param_min);

    try{
      // roistat.event.send('sostav_seta');
    } catch(e){ console.log(e) }
  }

  useEffect(() => {
    if (isOpenModal) setValueMode('per100');
  }, [isOpenModal, openItem?.id]);

  const toNum = (v) => {
    if (v === null || v === undefined) return NaN;
    if (typeof v === 'number') return v;
    return parseFloat(String(v).replace(',', '.'));
  };

  const fmtKcal = (n) => {
    if (!Number.isFinite(n)) return '';
    return new Intl.NumberFormat('ru-RU').format(Math.round(n));
  };

  const fmtMacro = (n) => {
    if (!Number.isFinite(n)) return '';
    return new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);
  };

  // пересчёт "на всё блюдо" из значения "на 100 г"
  const byWeight = (valStr, weightStr, kind = 'macro') => {
    const val = toNum(valStr);
    const w = toNum(weightStr); // граммы
    if (!Number.isFinite(val) || !Number.isFinite(w)) return '';
    const res = (val * w) / 100;
    return kind === 'kcal' ? fmtKcal(res) : fmtMacro(res);
  };

  const valueItems = (openItem?.items?.length ?? 0) > 0 ? openItem.items : (openItem ? [openItem] : []);
  const getWeight = (item) => item?.weight ?? openItem?.weight;

  return (
    <Dialog
      onClose={(event, reason) => reason === 'backdropClick' && typeModal === 'start' ? closeModal() : navigate('start')}
      className={'modalCardItemPC ' + roboto.variable}
      open={isOpenModal}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      scroll="body"
    >
      <DialogContent style={{ padding: 0, borderRadius: '1.444045vw', overflow: 'hidden', background: typeModal === 'start' ? '#FFFFFF' : '#E6E6E6'}}>
        <Box component="div" className="modalItemPC ModalFontPC">

          <IconButton className="closeButton" onClick={closeModal}>
            <IconClose />
          </IconButton>

          <Grid container>
            {typeModal !== 'start' ? null : (
              <div className="ImgItem">
                <picture>
                  <source 
                    type="image/webp" 
                    srcSet={`

                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_366x366.webp 138w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_466x466.webp 146w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_585x585.webp 183w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_1168x1168.webp 233w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_1420x1420.webp 292w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_2000x2000.webp 366w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_2000x2000.webp 584w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_2000x2000.webp 760w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_2000x2000.webp 1875w`} 

                    sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
                  <source 
                    type="image/jpeg" 
                    srcSet={`

                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_366x366.jpg 138w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_466x466.jpg 146w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_585x585.jpg 183w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_1168x1168.jpg 233w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_1420x1420.jpg 292w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_2000x2000.jpg 366w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_2000x2000.jpg 584w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_2000x2000.jpg 760w,
                      ${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_2000x2000.jpg 1875w`} 
                    sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

                  <img 
                    alt={openItem?.name} 

                    src={`${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_292x292.jpg`} 

                    //src={`https://cdnimg.jacofood.ru/${img_name}_292x292.jpg`} 

                    loading="lazy"
                  />
                </picture>

                <div className='badgecontainer'>
                  {parseInt(openItem?.is_hit) == 1 ? 
                    <BadgeItem size={'big'} type={'hit'} view={'pc'} />
                      :
                    false
                  }

                  {parseInt(openItem?.is_new) == 1 ? 
                    <BadgeItem size={'big'} type={'new'} view={'pc'} />
                      :
                    false
                  }

                  {parseInt(openItem?.is_updated) == 1 ? 
                    <BadgeItem size={'big'} type={'updated'} view={'pc'} />
                      :
                    false
                  }
      
                  { openItem?.tags?.includes(14) === true ?
                    <BadgeItem size={'bigshort'} type={'hot'} view={'pc'} />
                      :
                    false
                  }
                </div>
              </div>
            )}

            {typeModal !== 'set' ? null : (
              <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={(event) => closeTypeModal(event)}>
                <div className="FirstItem">
                  <div className="Table">
                    <div className="Title">
                      <Typography variant="h5" component="h2" className="ItemTitleSet">Сет состоит из {openItem?.items.length} роллов:</Typography>
                    </div>

                    <div className="List">
                      {(openItem?.items ?? []).map((item, idx, arr) => (
                        <div
                          key={idx}
                          className="SetItem"
                          style={{
                            paddingBottom: idx === arr[arr.length - 1] ? '8vw' : '1.444045vw'
                          }}
                        >
                          <div
                            className="itemNumber"
                            onClick={() => getItem('home', thisCity, item.id, 'set')}
                          >
                            <span className="ItemDesk">{idx + 1}.</span>
                          </div>

                          <div className="itemImg">
                            <picture>
                              <source
                                type="image/webp"
                                srcSet={`
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_292x292.webp 138w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_366x366.webp 146w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_466x466.webp 183w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_585x585.webp 233w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_732x732.webp 292w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_1168x1168.webp 366w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_1420x1420.webp 584w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_2000x2000.webp 760w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_2000x2000.webp 1875w
                                `}
                                sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px"
                              />
                              <source
                                type="image/jpeg"
                                srcSet={`
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_292x292.jpg 138w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_366x366.jpg 146w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_466x466.jpg 183w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_585x585.jpg 233w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_732x732.jpg 292w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_1168x1168.jpg 366w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_1420x1420.jpg 584w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_2000x2000.jpg 760w,
                                  ${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_2000x2000.jpg 1875w
                                `}
                                sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px"
                              />
                              <img
                                alt={item?.name}
                                src={`${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_292x292.jpg`}
                                loading="lazy"
                                onClick={() => getItem('home', thisCity, item.id, 'set')}
                              />
                            </picture>
                          </div>

                          <div
                            className="itemDesc"
                            onClick={() => getItem('home', thisCity, item.id, 'set')}
                          >
                            <Typography className="ItemName" variant="h5" component="span">
                              {item?.name}
                            </Typography>
                            <Typography variant="h5" component="span" className="ItemDesk">
                              {(item?.marc_desc?.length ?? 0) > 0 ? item.marc_desc : item?.tmp_desc}
                            </Typography>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ClickAwayListener>
            )}

            {typeModal !== 'value' ? null : (
              <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={(event) => closeTypeModal(event)}>
                <div className="FirstItem">
                  <div className="Table">
                    <div className="Title">
                      <Typography variant="h5" component="h2" className="ItemTitleSet">
                        Таблица пищевой ценности
                      </Typography>

                      <div className="ValueTitle">
                        <Typography variant="h5" component="h2" className="ItemTitleValue">
                          Полное описание состава блюд, калорийности и возможных аллергенов можно{' '}
                          <Link href={links?.link_allergens ?? links} target="_blank" style={{ color: '#DD1A32', cursor: 'pointer'}}>скачать в формате PDF</Link>
                        </Typography>
                      </div>

                      <div className="ValueModeButtons">
                        <button
                          type="button"
                          className={'ValueModeBtn ItemTitleValue ' + (valueMode === 'per100' ? 'active' : '')}
                          onClick={() => setValueMode('per100')}
                        >
                          на 100 г
                        </button>

                        <button
                          type="button"
                          className={'ValueModeBtn ItemTitleValue ' + (valueMode === 'perDish' ? 'active' : '')}
                          onClick={() => setValueMode('perDish')}
                        >
                          на всё блюдо
                        </button>
                      </div>
                    </div>

                    <div className="List">
                     {valueItems.map((item, idx, arr) => (
                        <div
                          key={idx}
                          className="ValueItem"
                          style={{
                            marginBottom: idx === arr.length - 1 ? '11.552346570397vw' : '0.72202vw'
                          }}
                        >
                          <div className="itemNumber">
                            <span className="ItemDesk">{idx + 1}.</span>
                          </div>

                          <div className="itemValueColumn">
                            <div className="itemValueRowMain">
                              <div className="ItemTitleSet">{item?.name}</div>

                              <div>
                                <span className="ItemTitleStart">
                                  {valueMode === 'per100' ? item?.kkal : byWeight(item?.kkal, getWeight(item), 'kcal')}
                                </span>
                                <span className="ItemTitleValue">ккал</span>
                              </div>
                            </div>

                            <div className="itemValueRow">
                              <div className="ItemTitleValue">Состав: {item?.tmp_desc}</div>

                              <div>
                                <div>
                                  <span className="ItemTitleValue">белки</span>
                                  <span className="dot"></span>
                                  <span className="ItemTitleValue">
                                    {valueMode === 'per100' ? item?.protein : byWeight(item?.protein, getWeight(item))} г
                                  </span>
                                </div>

                                <div>
                                  <span className="ItemTitleValue">жиры</span>
                                  <span className="dot"></span>
                                 <span className="ItemTitleValue">
                                   {valueMode === 'per100' ? item?.fat : byWeight(item?.fat, getWeight(item))} г
                                 </span>
                                </div>

                                <div>
                                  <span className="ItemTitleValue">углеводы</span>
                                  <span className="dot"></span>
                                  <span className="ItemTitleValue">
                                    {valueMode === 'per100' ? item?.carbohydrates : byWeight(item?.carbohydrates, getWeight(item))} г
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </ClickAwayListener>
            )}

            <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={(event) => closeTypeModal(event)}>
              <Grid className="SecondItem">
                <Typography variant="h5" component="h1" className="ItemTitleStart">{openItem?.name}</Typography>

                <div className="dop">
                  <div className="dop_text">
                    {parseInt(openItem?.cat_id) != 4 ? null : <span className="first_text" onClick={typeModal === 'start' ? sostav_seta : () => navigate('start')}
                        style={{ cursor: typeModal === 'start' ? 'pointer' : null}}
                      >{openItem?.count_part_new}</span>
                    }

                    {parseInt(openItem?.cat_id) == 5 || parseInt(openItem?.cat_id) == 6 || parseInt(openItem?.cat_id) == 7 || parseInt(openItem?.cat_id) == 15 ? null : (
                      <span className="second_text" style={{padding: parseInt(openItem?.cat_id) == 4 ? '0 0.577vw' : '0 1.444045vw 0 0' }}>
                        {parseInt(openItem?.cat_id) == 14 ? openItem?.size_pizza : openItem?.count_part}
                        {parseInt(openItem?.cat_id) == 14 ? ' см' : parseInt(openItem?.cat_id) == 6 ? ' л' : ' шт.'}
                      </span>
                    )}

                    <span className="third_text" style={{paddingLeft: parseInt(openItem?.count_part) == 1 && parseInt(openItem?.cat_id) !== 20 && parseInt(openItem?.cat_id) !== 21 ? 0 : '1.444045vw'}}>
                      {new Intl.NumberFormat('ru-RU').format(openItem?.weight)}
                      {parseInt(openItem?.id) == 17 || parseInt(openItem?.id) == 237 ? ' шт.' : parseInt(openItem?.cat_id) == 6 ? ' л' : ' г'}
                    </span>
                  </div>

                  <div className="dop_icon" style={{ cursor: typeModal === 'start' ? 'pointer' : null, visibility: openItem?.id === '17' || openItem?.id === '237' || openItem?.id === '351' ? 'hidden' : 'visible' }} 
                    onClick={typeModal === 'start' ? () => navigate('value') : () => navigate('start')}
                  >
                    {foodValue === true ? <IconInfo fill='#DD1A32' /> : <IconInfo fill='rgba(0, 0, 0, 0.2)' />}
                  </div>

                </div>

                <Typography variant="h5" component="div" className="desc ItemDescStart">
                  {(openItem?.marc_desc_full?.length ?? 0) > 0 ? openItem?.marc_desc_full : openItem?.tmp_desc}
                </Typography>

                {count == 0 ? (
                  <div className="containerBTN">
                    <Button variant="outlined" onClick={typeModal === 'start' ? add_to_cart : () => navigate('start')}
                      disabled={typeModal === 'start' ? false : true}
                    >
                      {new Intl.NumberFormat('ru-RU').format(openItem?.price)} ₽
                    </Button>
                  </div>
                ) : (
                  <div className="containerBTN">
                    <div style={{ backgroundColor: typeModal === 'start' ? '#ffff' : '#E6E6E6' }}
                      onClick={typeModal === 'start' ? null : () => navigate('start')}
                    >
                      <button className="minus" onClick={typeModal === 'start' ? remove_from_cart : () => navigate('start')}
                        style={{cursor: typeModal === 'start' ? 'pointer' : null}}>–</button>

                      <span>{count}</span>

                      <button className="plus" onClick={typeModal === 'start' ? add_to_cart : () => navigate('start')}
                        style={{cursor: typeModal === 'start' ? 'pointer' : null}}>+</button>
                    </div>
                  </div>
                )}
              </Grid>
            </ClickAwayListener>

          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
