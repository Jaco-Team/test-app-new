import React, { useState, useEffect } from 'react';

//import Image from 'next/image';
import Link from 'next/link';

import { useHomeStore, useCartStore, useFooterStore, useCitiesStore } from '@/components/store';

import Button from '@mui/material/Button';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import { IconInfoWhiteMobile } from '@/ui/Icons';

import BadgeItem from './badge';

import { roboto } from '@/ui/Font';

//import {placeholder_img} from '@/public/placeholder_img';

export default function ModalItemMobile() {
  const [openItemCard, item_card, setActiveModalCardItemMobile] = useHomeStore((state) => [state.openItemCard, state.item_card, state.setActiveModalCardItemMobile]);
  const [links] = useFooterStore((state) => [state.links]);
  const [minus, plus] = useCartStore((state) => [state.minus, state.plus]);
  const [thisCityRu] = useCitiesStore((state) => [ state.thisCityRu ]);

  const [count, setCount] = useState(0);
  const [shadowValue, setShadowValue] = useState(0);
  const [activeValue, setActiveValue] = useState(false);

  const metrica_param = {
    city: thisCityRu, 
    tovar: item_card?.name, 
    category: item_card?.cat_name,
    platform: 'mobile',
    view: 'Модалка товара'
  };

  useEffect(() => {
    const items = useCartStore.getState().items;

    const findItems = items.find((it) => it.item_id === item_card?.id);

    if (findItems) {
      setCount(findItems.count);
    } else {
      setCount(0);
    }
  }, [openItemCard]);

  const changeCountPlus = (id) => {
    setCount(count + 1);
    plus(id, item_card?.cat_id);
  };

  const changeCountMinus = (id) => {
    setCount(count - 1);
    minus(id);
  };

  const desc = item_card?.marc_desc.length > 0 ? item_card?.marc_desc : item_card?.tmp_desc;

  //const listenScrollSet = (event) => setShadowSet(event.target.scrollTop);
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

  const img_name = item_card?.img_app;

  return (
    <>
      {/* стартовая */}
      <SwipeableDrawer
        anchor={'bottom'}
        open={openItemCard}
        onClose={() => setActiveModalCardItemMobile(false, 'dop')}
        onOpen={() => setActiveModalCardItemMobile(true, 'dop')}
        id="modalCardItemMobile"
        className={roboto.variable}
        disableSwipeToOpen
        style={{ zIndex: 3000 }}
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
                    alt={item_card?.name} 
                    title={item_card?.name} 
                    src={`https://cdnimg.jacofood.ru/${img_name}_292x292.jpg`} 
                    //style={{ minHeight: GRID * 1.125, minWidth: GRID * 1.125 }}
                    loading="lazy"
                  />
                </picture>

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
              </div>

              <div className="TitleModalCardMobile" style={{ height: item_card?.name.length > 26 ? '13.675213675214vw' : '6.8376068376068vw' }}>
                <span>{item_card?.name}</span>
              </div>

              <div className="DopModalCardMobile">
                <div className="dop_text">

                  {parseInt(item_card?.cat_id) == 5 || parseInt(item_card?.cat_id) == 6 || parseInt(item_card?.cat_id) == 7 || parseInt(item_card?.cat_id) == 15 ? null : (
                    <span className="second_text">
                      {parseInt(item_card?.cat_id) == 14 ? item_card?.size_pizza : item_card?.count_part}
                      {parseInt(item_card?.cat_id) == 14 ? ' см' : parseInt(item_card?.cat_id) == 6 ? ' л' : ' шт.'}
                    </span>
                  )}

                  <span className="third_text" style={{ justifyContent: parseInt(item_card?.cat_id) == 4 ? 'flex-end' : 'center' }}>
                    {new Intl.NumberFormat('ru-RU').format(item_card?.weight)}
                    {parseInt(item_card?.id) == 17 || parseInt(item_card?.id) == 237 ? ' шт.' : parseInt(item_card?.cat_id) == 6 ? ' л' : ' г'}
                  </span>
                </div>

                <div className="dop_icon" onClick={() => setActiveValue(true)} style={{ visibility: item_card?.id === '17' || item_card?.id === '237' ? 'hidden' : 'visible'}}>
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
              <Button variant="outlined" onClick={() => { changeCountPlus(item_card?.id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); } }>
                {new Intl.NumberFormat('ru-RU').format(item_card?.price)} ₽
              </Button>
            </div>
          ) : (
            <div className="containerBTN_ModalMObile">
              <div>
                <button className="minus" onClick={() => { changeCountMinus(item_card?.id); ym(47085879, 'reachGoal', 'remove_from_cart', metrica_param); } }>–</button>
                <span>{count + ' ' + 'за' + ' ' + count * parseInt(item_card?.price)}{' '}₽</span>
                <button className="plus" onClick={() => { changeCountPlus(item_card?.id); ym(47085879, 'reachGoal', 'add_to_cart', metrica_param); } }>+</button>
              </div>
            </div>
          )}
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
        style={{ zIndex: 3000 }}
      >
        <div className="ContainerModalCardMobileValue">
          {shadowValue ? <div className="blockShadowModalCardItemValue" /> : null}

          <div className="lineModalCardMobileValue"></div>

          <div className="TitleModalCardModileValue">
            <span>Пищевая ценность</span>
          </div>

          <div className="dop_text_value" style={{ marginBottom: item_card?.items.length < 2 ? '10.25641025641vw' : '5.1282051282051vw' }}>
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

          {item_card?.items.length > 1 ? <div className="lineModalCardMobileValue2"></div> : null}

          <div className="ContainerValue"
            style={{ marginRight: item_card?.items.length < 2 ? '6.8376068376068vw' : 0, marginBottom: item_card?.items.length < 2 ? '17.094017094017vw' : 0 }}
          >
            <div className="ItemModalCardMobileValue" style={{ overflowY: item_card?.items.length < 2 ? 'hidden' : 'auto' }} onScroll={listenScrollValue}>
              {item_card?.items.length > 1 ? (
                <div className="ListValue">
                  {item_card?.items.map((item, key) => (
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
                  {item_card?.items.map((item, key) => (
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
