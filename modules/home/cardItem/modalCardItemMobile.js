import React, { useState, useEffect } from 'react';

//import Image from 'next/image';
import Link from 'next/link';

import { useHomeStore, useCartStore, useFooterStore, useCitiesStore } from '@/components/store';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import { IconInfoWhiteMobile } from '@/ui/Icons';

import BadgeItem from './badge';

import { roboto } from '@/ui/Font';

//import {placeholder_img} from '@/public/placeholder_img';

export default function ModalCardItemMobile() {
  const [isOpenModal, openItem, setActiveModalCardItemMobile] = useHomeStore((state) => [state.isOpenModal, state.openItem, state.setActiveModalCardItemMobile]);
  const [links] = useFooterStore((state) => [state.links]);
  const [minus, plus] = useCartStore((state) => [state.minus, state.plus]);
  const [thisCityRu] = useCitiesStore((state) => [ state.thisCityRu ]);

  const [count, setCount] = useState(0);
  const [shadowSet, setShadowSet] = useState(0);
  const [shadowValue, setShadowValue] = useState(0);
  const [activeSet, setActiveSet] = useState(false);
  const [activeValue, setActiveValue] = useState(false);

  const metrica_param = {
    city: thisCityRu, 
    tovar: openItem?.name, 
    category: openItem?.cat_name,
    platform: 'mobile',
    view: 'Модалка товара'
  };

  useEffect(() => {
    const items = useCartStore.getState().items;

    const findItems = items.find((it) => it.item_id === openItem?.id);

    if (findItems) {
      setCount(findItems.count);
    } else {
      setCount(0);
    }
  }, [isOpenModal]);

  const changeCountPlus = (id) => {
    setCount(count + 1);
    plus(id, openItem?.cat_id);
  };

  const changeCountMinus = (id) => {
    setCount(count - 1);
    minus(id);
  };

  const desc = openItem?.marc_desc.length > 0 ? openItem?.marc_desc : openItem?.tmp_desc;

  const listenScrollSet = (event) => setShadowSet(event.target.scrollTop);
  const listenScrollValue = (event) => setShadowValue(event.target.scrollTop);

  /**
   * 
   * <Image 
                  alt={openItem?.name} 
                  src={'https://cdnimg.jacofood.ru/' + openItem?.img_app + '_732x732.jpg'} 
                  width={732} 
                  height={732} 
                  quality={100}
                  //loading="lazy"
                  priority={true} 
                  placeholder="blur"
                  blurDataURL={placeholder_img}
                />
   */

  const img_name = openItem?.img_app;

  return (
    <>
      {/* стартовая */}
      <SwipeableDrawer
        anchor={'bottom'}
        open={isOpenModal}
        onClose={() => setActiveModalCardItemMobile(false)}
        onOpen={() => setActiveModalCardItemMobile(true)}
        id="modalCardItemMobile"
        className={roboto.variable}
        disableSwipeToOpen
      >
        <div className="containerLine">
          <div className="lineModalCardMobile"></div>
        </div>

        <div className="ContainerModalCardMobile">
          <div className="ItemModalCardMobile">
            <div className="ItemContainer">
              <div className="ImgModalCardMobile">
                <picture>
                  <source 
                    type="image/webp" 
                    srcSet={`
                      https://cdnimg.jacofood.ru/${img_name}_292x292.webp 138w,
                      https://cdnimg.jacofood.ru/${img_name}_366x366.webp 146w,
                      https://cdnimg.jacofood.ru/${img_name}_466x466.webp 183w,
                      https://cdnimg.jacofood.ru/${img_name}_585x585.webp 233w,
                      https://cdnimg.jacofood.ru/${img_name}_732x732.webp 292w,
                      https://cdnimg.jacofood.ru/${img_name}_1168x1168.webp 366w,
                      https://cdnimg.jacofood.ru/${img_name}_1420x1420.webp 584w,
                      https://cdnimg.jacofood.ru/${img_name}_2000x2000.webp 760w,
                      https://cdnimg.jacofood.ru/${img_name}_2000x2000.webp 1875w`} 
                    sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />
                  <source 
                    type="image/jpeg" 
                    srcSet={`
                      https://cdnimg.jacofood.ru/${img_name}_292x292.jpg 138w,
                      https://cdnimg.jacofood.ru/${img_name}_366x366.jpg 146w,
                      https://cdnimg.jacofood.ru/${img_name}_466x466.jpg 183w,
                      https://cdnimg.jacofood.ru/${img_name}_585x585.jpg 233w,
                      https://cdnimg.jacofood.ru/${img_name}_732x732.jpg 292w,
                      https://cdnimg.jacofood.ru/${img_name}_1168x1168.jpg 366w,
                      https://cdnimg.jacofood.ru/${img_name}_1420x1420.jpg 584w,
                      https://cdnimg.jacofood.ru/${img_name}_2000x2000.jpg 760w,
                      https://cdnimg.jacofood.ru/${img_name}_2000x2000.jpg 1875w`} 
                    sizes="(max-width=1439px) 233px, (max-width=1279px) 218px, 292px" />

                  <img 
                    alt={openItem?.name} 
                    title={openItem?.name} 
                    src={`https://cdnimg.jacofood.ru/${img_name}_292x292.jpg`} 
                    //style={{ minHeight: GRID * 1.125, minWidth: GRID * 1.125 }}
                    loading="lazy"
                  />
                </picture>

                {parseInt(openItem?.is_new) == 0 ? parseInt(openItem?.is_hit) == 0 ? null :
                  <BadgeItem size={'big'} type={'hit'} view={'pc'} />
                      :
                  <BadgeItem size={'big'} type={'new'} view={'pc'} />
                }
              </div>

              <div className="TitleModalCardMobile" style={{ height: openItem?.name.length > 26 ? '13.675213675214vw' : '6.8376068376068vw' }}>
                <span>{openItem?.name}</span>
              </div>

              <div className="DopModalCardMobile">
                <div className="dop_text">
                  {parseInt(openItem?.cat_id) != 4 ? null : (
                    <span className="first_text" style={{ width: parseInt(openItem?.count_part_new) > 9 ? '15.384615384615vw' : '13.675213675214vw' }}
                      onClick={() => setActiveSet(true)}
                    >
                      {openItem?.count_part_new}
                    </span>
                  )}

                  {parseInt(openItem?.cat_id) == 5 || parseInt(openItem?.cat_id) == 6 || parseInt(openItem?.cat_id) == 7 || parseInt(openItem?.cat_id) == 15 ? null : (
                    <span className="second_text">
                      {parseInt(openItem?.cat_id) == 14 ? openItem?.size_pizza : openItem?.count_part}
                      {parseInt(openItem?.cat_id) == 14 ? ' см' : parseInt(openItem?.cat_id) == 6 ? ' л' : ' шт.'}
                    </span>
                  )}

                  <span className="third_text" style={{ justifyContent: parseInt(openItem?.cat_id) == 4 ? 'flex-end' : 'center' }}>
                    {new Intl.NumberFormat('ru-RU').format(openItem?.weight)}
                    {parseInt(openItem?.id) == 17 || parseInt(openItem?.id) == 237 ? ' шт.' : parseInt(openItem?.cat_id) == 6 ? ' л' : ' г'}
                  </span>
                </div>

                <div className="dop_icon" onClick={() => setActiveValue(true)} style={{ visibility: openItem?.id === '17' || openItem?.id === '237' ? 'hidden' : 'visible'}}>
                  <IconInfoWhiteMobile />
                </div>
              </div>

              <div className="DescModalCardMobile" 
                style={{ minHeight: desc?.length > 89 ? desc?.length > 131 ? '23.931623931624vw' : '15.384615384615vw' : '10.25641025641vw' }}
              >
                <span>{desc}</span>
              </div>
            </div>
          </div>

          <div className="blockShadowModalCardItem" />

          {count == 0 ? (
            <div className="containerBTN_ModalMObile">
              <Button variant="outlined" onClick={() => { changeCountPlus(openItem?.id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); } }>
                {new Intl.NumberFormat('ru-RU').format(openItem?.price)} ₽
              </Button>
            </div>
          ) : (
            <div className="containerBTN_ModalMObile">
              <div>
                <button className="minus" onClick={() => { changeCountMinus(openItem?.id); ym(47085879, 'reachGoal', 'remove_from_cart', metrica_param); } }>–</button>
                <span>{count + ' ' + 'за' + ' ' + count * parseInt(openItem?.price)}{' '}₽</span>
                <button className="plus" onClick={() => { changeCountPlus(openItem?.id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); } }>+</button>
              </div>
            </div>
          )}
        </div>
      </SwipeableDrawer>

      {/* Сет товара */}
      <SwipeableDrawer
        anchor={'bottom'}
        open={activeSet}
        onClose={() => setActiveSet(false)}
        onOpen={() => setActiveSet(true)}
        id="modalCardItemMobileSet"
        className={roboto.variable}
        disableSwipeToOpen
      >
        <div className="ContainerModalCardMobileSet">
          {shadowSet ? <div className="blockShadowModalCardItemSet" /> : null}

          <div className="lineModalCardMobileSet"></div>

          <div className="TitleModalCardModileSet">
            <span>{openItem?.name}</span>
          </div>

          <div className="dop_text">
            {parseInt(openItem?.cat_id) != 4 ? null : (
              <span className="first_text" style={{ width: parseInt(openItem?.count_part_new) > 9 ? '15.384615384615vw' : '13.675213675214vw' }}
                onClick={() => setActiveSet(true)}
              >
                {openItem?.count_part_new}
              </span>
            )}

            {parseInt(openItem?.cat_id) == 5 || parseInt(openItem?.cat_id) == 6 || parseInt(openItem?.cat_id) == 7 || parseInt(openItem?.cat_id) == 15 ? null : (
              <span className="second_text">
                {parseInt(openItem?.cat_id) == 14 ? openItem?.size_pizza : openItem?.count_part}
                {parseInt(openItem?.cat_id) == 14 ? ' см' : parseInt(openItem?.cat_id) == 6 ? ' л' : ' шт.'}
              </span>
            )}

            <span className="third_text" style={{ justifyContent: parseInt(openItem?.cat_id) == 4 ? 'flex-end' : 'center' }}>
              {new Intl.NumberFormat('ru-RU').format(openItem?.weight)}
              {parseInt(openItem?.id) == 17 || parseInt(openItem?.id) == 237 ? ' шт.' : parseInt(openItem?.cat_id) == 6 ? ' л' : ' г'}
            </span>
          </div>

          <div className="lineModalCardMobileSet2"></div>

          <div className="ContainerSet">
            <div className="ItemModalCardMobileSet" onScroll={listenScrollSet}>
              <div className="ListSet">
                {openItem?.items.map((item, key) => (
                  <React.Fragment key={key}>
                    <div className="SetItem" style={{ marginTop: key === 0 ? '1.7094017094017vw' : '0.85470085470085vw' }} >
                      <div className="itemIndex">
                        <span>{key + 1}.</span>
                      </div>

                      <div className="ImgSet">
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
                        <Typography component="span">{item.name}</Typography>

                        <div className="dop_text_set">
                          <span>{item.count_part + ' шт.'}</span>
                          <span>{new Intl.NumberFormat('ru-RU').format(item?.weight) + ' г'}</span>
                        </div>

                        <Typography component="span">
                          {item.marc_desc?.length > 0 ? item.marc_desc : item.tmp_desc}
                        </Typography>
                      </div>
                    </div>

                    {item === openItem?.items.at(-1) ? null : <div className="SetDivider"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SwipeableDrawer>

      {/* БЖУ товара */}
      <SwipeableDrawer
        anchor={'bottom'}
        open={activeValue}
        onClose={() => setActiveValue(false)}
        onOpen={() => setActiveValue(true)}
        id="modalCardItemMobileValue"
        className={roboto.variable}
        disableSwipeToOpen
      >
        <div className="ContainerModalCardMobileValue">
          {shadowValue ? <div className="blockShadowModalCardItemValue" /> : null}

          <div className="lineModalCardMobileValue"></div>

          <div className="TitleModalCardModileValue">
            <span>Пищевая ценность</span>
          </div>

          <div className="dop_text_value" style={{ marginBottom: openItem?.items.length < 2 ? '10.25641025641vw' : '5.1282051282051vw' }}>
            <span>
              Указана на 100 г. Полное описание состава всех блюд, калорийности
              и возможных аллергенов можно{' '}
              <Link href={links?.link_allergens ?? links} target="_blank"
                ref={(node) => {
                  if (node) {
                    node.style.setProperty('color', '#DD1A32', 'important');
                  }
                }}
              >
                скачать в формате PDF
              </Link>
            </span>
          </div>

          {openItem?.items.length > 1 ? <div className="lineModalCardMobileValue2"></div> : null}

          <div className="ContainerValue"
            style={{ marginRight: openItem?.items.length < 2 ? '6.8376068376068vw' : 0, marginBottom: openItem?.items.length < 2 ? '17.094017094017vw' : 0 }}
          >
            <div className="ItemModalCardMobileValue" style={{ overflowY: openItem?.items.length < 2 ? 'hidden' : 'auto' }} onScroll={listenScrollValue}>
              {openItem?.items.length > 1 ? (
                <div className="ListValue">
                  {openItem?.items.map((item, key) => (
                    <div key={key} className="ValueItem" style={{ marginTop: key === 0 ? '5.1282051282051vw' : '3.4188034188034vw' }}>
                      <div className="itemIndex">
                        <span>{key + 1}.</span>
                      </div>

                      <div className="itemValueColumn">
                        <div className="itemValueRowMain">
                          <div>
                            <span>{item.name}</span>
                          </div>

                          <div>
                            <span>{item.kkal}</span>
                            <span>ккал</span>
                          </div>
                        </div>

                        <div className="itemValueRow">
                          <div>
                            <span>Состав: {item.tmp_desc}</span>
                          </div>

                          <div>
                            <div>
                              <span>белки</span>
                              <span className="dot"></span>
                              <span>{item.protein} г</span>
                            </div>

                            <div>
                              <span>жиры</span>
                              <span className="dot"></span>
                              <span>{item.fat} г</span>
                            </div>

                            <div>
                              <span>углеводы</span>
                              <span className="dot"></span>
                              <span>{item.carbohydrates} г</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ListValueOne">
                  {openItem?.items.map((item, key) => (
                    <div key={key} className="ValueItemOne">
                      <div className="itemValueColumn">
                        <div className="itemValueRowMain">
                          <div>
                            <span>{item.name}</span>
                          </div>

                          <div>
                            <span>{item.kkal}</span>
                            <span>ккал</span>
                          </div>
                        </div>

                        <div className="itemValueRow">
                          <div>
                            <span>Состав: {item.tmp_desc}</span>
                          </div>

                          <div>
                            <div>
                              <span>белки</span>
                              <span className="dot"></span>
                              <span>{item.protein} г</span>
                            </div>

                            <div>
                              <span>жиры</span>
                              <span className="dot"></span>
                              <span>{item.fat} г</span>
                            </div>

                            <div>
                              <span>углеводы</span>
                              <span className="dot"></span>
                              <span>{item.carbohydrates} г</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SwipeableDrawer>
    </>
  );
}
