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
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { IconClose, IconInfo } from '@/ui/Icons';

import { roboto } from '@/ui/Font';

//import {placeholder_img} from '@/public/placeholder_img';

export default function ModalCardItemPC() {
  const [isOpenModal, closeModal, typeModal, openItem, foodValue, navigate, closeTypeModal] = useHomeStore((state) => [state.isOpenModal, state.closeModal, state.typeModal,
      state.openItem, state.foodValue, state.navigate, state.closeTypeModal]);

  const [links] = useFooterStore((state) => [state.links]);
  const [thisCityRu] = useCitiesStore((state) => [ state.thisCityRu ]);
  const [minus, plus] = useCartStore((state) => [state.minus, state.plus]);
  const [count, setCount] = useState(0);
  
  const metrica_param = {
    city: thisCityRu, 
    tovar: openItem?.name, 
    category: openItem?.cat_name,
    platform: 'pc',
    view: 'Модалка товара'
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
    setCount(count + 1);
    plus(id, openItem?.cat_id);
  };

  const changeCountMinus = (id) => {
    setCount(count - 1);
    minus(id);
  };

  

    /**
     * 
     * <Image 
                  alt={openItem?.name} 
                  src={'https://cdnimg.jacofood.ru/' + openItem?.img_app + '_1420x1420.jpg'} 
                  width={1420} height={1420} 
                  quality={100}
                  priority={true} 
                  //placeholder="blur" 
                  //blurDataURL={placeholder_img}
                />
     */

  const img_name = openItem?.img_app;

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
                      https://cdnimg.jacofood.ru/${img_name}_366x366.webp 138w,
                      https://cdnimg.jacofood.ru/${img_name}_466x466.webp 146w,
                      https://cdnimg.jacofood.ru/${img_name}_585x585.webp 183w,
                      https://cdnimg.jacofood.ru/${img_name}_1168x1168.webp 233w,
                      https://cdnimg.jacofood.ru/${img_name}_1420x1420.webp 292w,
                      https://cdnimg.jacofood.ru/${img_name}_2000x2000.webp 366w,
                      https://cdnimg.jacofood.ru/${img_name}_2000x2000.webp 584w,
                      https://cdnimg.jacofood.ru/${img_name}_2000x2000.webp 760w,
                      https://cdnimg.jacofood.ru/${img_name}_2000x2000.webp 1875w`} 
                    sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
                  <source 
                    type="image/jpeg" 
                    srcSet={`
                      https://cdnimg.jacofood.ru/${img_name}_366x366.jpg 138w,
                      https://cdnimg.jacofood.ru/${img_name}_466x466.jpg 146w,
                      https://cdnimg.jacofood.ru/${img_name}_585x585.jpg 183w,
                      https://cdnimg.jacofood.ru/${img_name}_1168x1168.jpg 233w,
                      https://cdnimg.jacofood.ru/${img_name}_1420x1420.jpg 292w,
                      https://cdnimg.jacofood.ru/${img_name}_2000x2000.jpg 366w,
                      https://cdnimg.jacofood.ru/${img_name}_2000x2000.jpg 584w,
                      https://cdnimg.jacofood.ru/${img_name}_2000x2000.jpg 760w,
                      https://cdnimg.jacofood.ru/${img_name}_2000x2000.jpg 1875w`} 
                    sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

                  <img 
                    alt={openItem?.name} 
                    title={openItem?.name} 
                    src={`https://cdnimg.jacofood.ru/${img_name}_292x292.jpg`} 
                    loading="lazy"
                  />
                </picture>

                
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
                      {openItem?.items.map((item, key) => (
                        <div key={key} className="SetItem" style={{paddingBottom: item === openItem?.items.at(-1) ? '8vw' : '1.444045vw' }}>
                          <div className="itemNumber">
                            <span className="ItemDesk">{key + 1}.</span>
                          </div>

                          <div className="itemImg">
                            <picture>
                              <source 
                                type="image/webp" 
                                srcSet={`
                                  https://cdnimg.jacofood.ru/${item.img_app}_292x292.webp 138w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_366x366.webp 146w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_466x466.webp 183w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_585x585.webp 233w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_732x732.webp 292w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_1168x1168.webp 366w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_1420x1420.webp 584w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_2000x2000.webp 760w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_2000x2000.webp 1875w`} 
                                sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
                              <source 
                                type="image/jpeg" 
                                srcSet={`
                                  https://cdnimg.jacofood.ru/${item.img_app}_292x292.jpg 138w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_366x366.jpg 146w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_466x466.jpg 183w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_585x585.jpg 233w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_732x732.jpg 292w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_1168x1168.jpg 366w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_1420x1420.jpg 584w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_2000x2000.jpg 760w,
                                  https://cdnimg.jacofood.ru/${item.img_app}_2000x2000.jpg 1875w`} 
                                sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

                              <img 
                                alt={item.name} 
                                title={item.name} 
                                src={`https://cdnimg.jacofood.ru/${item.img_app}_292x292.jpg`} 
                                //style={{ minHeight: GRID * 1.125, minWidth: GRID * 1.125 }}
                                loading="lazy"
                              />
                            </picture>
                          </div>

                          <div className="itemDesc">
                            <Typography className="ItemTitleSet" variant="h5" component="span">{item.name}</Typography>
                            <Typography variant="h5" component="span" className="ItemDesk">
                              {item.marc_desc.length > 0 ? item.marc_desc : item.tmp_desc}
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
                      <Typography variant="h5" component="h2" className="ItemTitleSet">Таблица пищевой ценности (на 100 г):</Typography>
                    </div>

                    <div className="List">
                      <div className="ValueTitle">
                        <Typography variant="h5" component="h2" className="ItemTitleValue">
                          Полное описание состава блюд, калорийности и возможных аллергенов можно{' '}
                          <Link href={links?.link_allergens ?? links} target="_blank" style={{ color: '#DD1A32', cursor: 'pointer'}}>скачать в формате PDF</Link>
                        </Typography>
                      </div>
                      {openItem?.items.map((item, key) => (
                        <div key={key} className="ValueItem" style={{ marginBottom: item === openItem?.items.at(-1) ? '8vw' : '0.72202vw' }}>
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

            <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={(event) => closeTypeModal(event)}>
              <Grid className="SecondItem">
                <Typography variant="h5" component="h1" className="ItemTitleStart">{openItem?.name}</Typography>

                <div className="dop">
                  <div className="dop_text">
                    {parseInt(openItem?.cat_id) != 4 ? null : <span className="first_text" onClick={typeModal === 'start' ? () => navigate('set') : () => navigate('start')}
                        style={{ cursor: typeModal === 'start' ? 'pointer' : null}}
                      >{openItem?.count_part_new}</span>
                    }

                    {parseInt(openItem?.cat_id) == 5 || parseInt(openItem?.cat_id) == 6 || parseInt(openItem?.cat_id) == 7 || parseInt(openItem?.cat_id) == 15 ? null : (
                      <span className="second_text" style={{padding: parseInt(openItem?.cat_id) == 4 ? '0 0.577vw' : '0 1.444045vw 0 0' }}>
                        {parseInt(openItem?.cat_id) == 14 ? openItem?.size_pizza : openItem?.count_part}
                        {parseInt(openItem?.cat_id) == 14 ? ' см' : parseInt(openItem?.cat_id) == 6 ? ' л' : ' шт.'}
                      </span>
                    )}

                    <span className="third_text" style={{paddingLeft: parseInt(openItem?.count_part) == 1 ? 0 : '1.444045vw'}}>
                      {new Intl.NumberFormat('ru-RU').format(openItem?.weight)}
                      {parseInt(openItem?.id) == 17 || parseInt(openItem?.id) == 237 ? ' шт.' : parseInt(openItem?.cat_id) == 6 ? ' л' : ' г'}
                    </span>
                  </div>

                  <div className="dop_icon" style={{ cursor: typeModal === 'start' ? 'pointer' : null, visibility: openItem?.id === '17' || openItem?.id === '237' ? 'hidden' : 'visible' }} 
                    onClick={typeModal === 'start' ? () => navigate('value') : () => navigate('start')}
                  >
                    {foodValue === true ? <IconInfo fill='#DD1A32' /> : <IconInfo fill='rgba(0, 0, 0, 0.2)' />}
                  </div>

                </div>

                <Typography variant="h5" component="span" className="desk ItemDescStart">
                  {openItem?.marc_desc_full.length > 0 ? openItem?.marc_desc_full : openItem?.tmp_desc}
                </Typography>

                {count == 0 ? (
                  <div className="containerBTN">
                    <Button variant="outlined" onClick={typeModal === 'start' ? () => { changeCountPlus(openItem.id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); } : () => navigate('start')}
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
                      <button className="minus" onClick={typeModal === 'start' ? () => { changeCountMinus(openItem.id); ym(47085879, 'reachGoal', 'remove_from_cart', metrica_param); } : () => navigate('start')}
                        style={{cursor: typeModal === 'start' ? 'pointer' : null}}>–</button>

                      <span>{count}</span>

                      <button className="plus" onClick={typeModal === 'start' ? () => { changeCountPlus(openItem.id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); } : () => navigate('start')}
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
