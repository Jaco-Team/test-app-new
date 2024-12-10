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

//import {placeholder_img} from '@/public/placeholder_img';

export default function ModalItemPC() {
  const [openItemCard, closeItemModal, typeModal_dop, item_card, foodValue, navigate_dop, closeTypeModal_dop] = useHomeStore((state) => [state.openItemCard, state.closeItemModal, state.typeModal_dop, state.item_card, state.foodValue, state.navigate_dop, state.closeTypeModal_dop]);

  const [links] = useFooterStore((state) => [state.links]);
  const [thisCityRu] = useCitiesStore((state) => [state.thisCityRu]);
  const [minus, plus] = useCartStore((state) => [state.minus, state.plus]);
  const [count, setCount] = useState(0);
  
  const metrica_param = {
    city: thisCityRu, 
    tovar: item_card?.name, 
    category: item_card?.cat_name,
    platform: 'pc',
    view: 'Модалка товара'
  };

  useEffect( () => {

    const items = useCartStore.getState().items;
  
    const findItems = items.find(it => it.item_id === item_card?.id)
      
    if(findItems) {
      setCount(findItems.count)
    } else {
      setCount(0)
    }
    
  }, [openItemCard] )
  
  const changeCountPlus = (id) => {
    setCount(count + 1);
    plus(id, item_card?.cat_id);
  };

  const changeCountMinus = (id) => {
    setCount(count - 1);
    minus(id);
  };

  const img_name = item_card?.img_app;

  return (
    <Dialog
      onClose={(event, reason) => reason === 'backdropClick' && typeModal_dop === 'start' ? closeItemModal() : navigate_dop('start')}
      className={'modalCardItemPC ' + roboto.variable}
      open={openItemCard}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      scroll="body"
    >
      <DialogContent style={{ padding: 0, borderRadius: '1.444045vw', overflow: 'hidden', background: typeModal_dop === 'start' ? '#FFFFFF' : '#E6E6E6'}}>
        <Box component="div" className="modalItemPC ModalFontPC">

          <IconButton className="closeButton" onClick={closeItemModal}>
            <IconClose />
          </IconButton>

          <Grid container>
            {typeModal_dop !== 'start' ? null : (
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
                    alt={item_card?.name} 
                    title={item_card?.name} 
                    src={`${process.env.NEXT_PUBLIC_YANDEX_IMG}${img_name}_292x292.jpg`} 

                    //src={`https://cdnimg.jacofood.ru/${img_name}_292x292.jpg`} 

                    loading="lazy"
                  />
                </picture>

                <div className='badgecontainer'>
                  {parseInt(item_card?.is_hit) == 1 ? 
                    <BadgeItem size={'big'} type={'hit'} view={'pc'} />
                      :
                    false
                  }

                  {parseInt(item_card?.is_new) == 1 ? 
                    <BadgeItem size={'big'} type={'new'} view={'pc'} />
                      :
                    false
                  }

                  {parseInt(item_card?.is_updated) == 1 ? 
                    <BadgeItem size={'big'} type={'updated'} view={'pc'} />
                      :
                    false
                  }

                  { item_card?.tags?.includes(14) === true ?
                    <BadgeItem size={'bigshort'} type={'hot'} view={'pc'} />
                      :
                    false
                  }
                </div>
              </div>
            )}

            {typeModal_dop !== 'value' ? null : (
              <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={(event) => closeTypeModal_dop(event)}>
                <div className="FirstItem">
                  <div className="Table">
                    <div className="Title">
                      <Typography variant="h5" component="h2" className="ItemTitleSet">Таблица пищевой ценности (на 100 г):</Typography>
                    </div>

                    <div className="List">
                      <div className="ValueTitle">
                        <Typography variant="h5" component="h2" className="ItemTitleValue">
                          Полное описание состава блюд, калорийности и возможных аллергенов можно{' '}
                          <Link href={links?.link_allergens ?? links} target="_blank" style={{ color: '#DD1A32', cursor: 'pointer'}}>скачать в формате PDF</Link>
                        </Typography>
                      </div>
                      {item_card?.items.map((item, key) => (
                        <div key={key} className="ValueItem" style={{ marginBottom: item === item_card?.items.at(-1) ? '8vw' : '0.72202vw' }}>
                          <div className="itemNumber">
                            <span className="ItemDesk">{key + 1}.</span>
                          </div>

                          <div className="itemValueColumn">
                            <div className="itemValueRowMain">
                              <div className="ItemTitleSet">{item.name}</div>

                              <div>
                                <span className="ItemTitleStart">{item.kkal}</span>
                                <span className="ItemTitleValue">ккал</span>
                              </div>
                            </div>

                            <div className="itemValueRow">
                              <div className="ItemTitleValue">Состав: {item.tmp_desc}</div>

                              <div>
                                <div>
                                  <span className="ItemTitleValue">белки</span>
                                  <span className="dot"></span>
                                  <span className="ItemTitleValue">{item.protein} г</span>
                                </div>

                                <div>
                                  <span className="ItemTitleValue">жиры</span>
                                  <span className="dot"></span>
                                  <span className="ItemTitleValue">{item.fat} г</span>
                                </div>

                                <div>
                                  <span className="ItemTitleValue">углеводы</span>
                                  <span className="dot"></span>
                                  <span className="ItemTitleValue">{item.carbohydrates} г</span>
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

            <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={(event) => closeTypeModal_dop(event)}>
              <Grid className="SecondItem">
                <Typography variant="h5" component="h1" className="ItemTitleStart">{item_card?.name}</Typography>

                <div className="dop">
                  <div className="dop_text">
                    {parseInt(item_card?.cat_id) == 5 || parseInt(item_card?.cat_id) == 6 || parseInt(item_card?.cat_id) == 7 || parseInt(item_card?.cat_id) == 15 ? null : (
                      <span className="second_text" style={{padding: parseInt(item_card?.cat_id) == 4 ? '0 0.577vw' : '0 1.444045vw 0 0' }}>
                        {parseInt(item_card?.cat_id) == 14 ? item_card?.size_pizza : item_card?.count_part}
                        {parseInt(item_card?.cat_id) == 14 ? ' см' : parseInt(item_card?.cat_id) == 6 ? ' л' : ' шт.'}
                      </span>
                    )}

                    <span className="third_text" style={{paddingLeft: parseInt(item_card?.count_part) == 1 ? 0 : '1.444045vw'}}>
                      {new Intl.NumberFormat('ru-RU').format(item_card?.weight)}
                      {parseInt(item_card?.id) == 17 || parseInt(item_card?.id) == 237 ? ' шт.' : parseInt(item_card?.cat_id) == 6 ? ' л' : ' г'}
                    </span>
                  </div>

                  <div className="dop_icon" style={{ cursor: typeModal_dop === 'start' ? 'pointer' : null, visibility: item_card?.id === '17' || item_card?.id === '237' ? 'hidden' : 'visible' }} 
                    onClick={typeModal_dop === 'start' ? () => navigate_dop('value') : () => navigate_dop('start')}
                  >
                    {foodValue === true ? <IconInfo fill='#DD1A32' /> : <IconInfo fill='rgba(0, 0, 0, 0.2)' />}
                  </div>

                </div>

                <Typography variant="h5" component="span" className="desk ItemDescStart">
                  {item_card?.marc_desc_full.length > 0 ? item_card?.marc_desc_full : item_card?.tmp_desc}
                </Typography>

                {count == 0 ? (
                  <div className="containerBTN">
                    <Button variant="outlined" onClick={typeModal_dop === 'start' ? () => { changeCountPlus(item_card.id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); } : () => navigate_dop('start')}
                      disabled={typeModal_dop === 'start' ? false : true}
                    >
                      {new Intl.NumberFormat('ru-RU').format(item_card?.price)} ₽
                    </Button>
                  </div>
                ) : (
                  <div className="containerBTN">
                    <div style={{ backgroundColor: typeModal_dop === 'start' ? '#ffff' : '#E6E6E6' }}
                      onClick={typeModal_dop === 'start' ? null : () => navigate_dop('start')}
                    >
                      <button className="minus" onClick={typeModal_dop === 'start' ? () => { changeCountMinus(item_card.id); ym(47085879, 'reachGoal', 'remove_from_cart', metrica_param); } : () => navigate_dop('start')}
                        style={{cursor: typeModal_dop === 'start' ? 'pointer' : null}}>–</button>

                      <span>{count}</span>

                      <button className="plus" onClick={typeModal_dop === 'start' ? () => { changeCountPlus(item_card.id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); } : () => navigate_dop('start')}
                        style={{cursor: typeModal_dop === 'start' ? 'pointer' : null}}>+</button>
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
