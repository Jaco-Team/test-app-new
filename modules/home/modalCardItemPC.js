import { useState } from 'react';

import Image from 'next/image';

import { shallow } from 'zustand/shallow';
import { useHomeStore } from '@/components/store';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { IconClose, IconInfoRed, IconInfoWhite } from '@/ui/Icons';

import { roboto } from '@/ui/Font';

export default function ModalCardItemPC() {
  console.log('render ModalCardItemPC');

  const [isOpenModal, closeModal, typeModal, openItem, foodValue, openFoodValue, openSet] = useHomeStore((state) => [state.isOpenModal, state.closeModal, state.typeModal, 
    state.openItem, state.foodValue, state.openFoodValue, state.openSet], shallow);

  const [count, setCount] = useState(0);

  return (
    <Dialog
      onClose={closeModal}
      className={'modalCardItemPC ' + roboto.variable}
      open={isOpenModal}
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <DialogContent style={{ padding: 0, borderRadius: '40px', overflow: 'hidden', background: typeModal === 'start' ? '#FFFFFF' : '#E6E6E6' }}>
        <Box component="div" className="modalItemPC ModalFontPC">
          <IconButton style={{ position: 'absolute', top: -5, left: -50, backgroundColor: 'transparent' }} onClick={closeModal}>
            <IconClose style={{ width: 35, height: 35, overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)' }} />
          </IconButton>

          <Grid container>
            <Grid className="FirstItem">
              
              {typeModal !== 'start' ? null : (
                <div style={{ position: 'absolute' }}>
                  <Image alt={openItem?.name} src={'https://cdnimg.jacofood.ru/' + openItem?.img_app + '_1420x1420.jpg' } width={1420} height={1420} priority={true}/>
                </div>
              )}

              {typeModal !== 'set' ? null : (
                <div className="Table">
                  <div className="Title">
                    <div></div>
                    <Typography variant="h5" component="h2" className="ItemTitleSet">Сет состоит из {openItem?.items.length} роллов:</Typography>
                  </div>

                  <div className="List">
                    {openItem?.items.map((item, key) => (
                      <div key={key} style={{ marginBottom: '5%' }}>
                        <div className="itemNumber">
                          <span className="ItemDesk">{key + 1}.</span>
                        </div>

                        <div style={{ width: '30%' }}>
                          <Image alt={item.name} src={'https://cdnimg.jacofood.ru/' + item.img_app + '_1420x1420.jpg' } width={1420} height={1420} priority={true}/>
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
              )}

              {typeModal !== 'value' ? null : (
                <div className="Table">
                  <div className="Title">
                    <div></div>
                    <Typography variant="h5" component="h2" className="ItemTitleSet" style={{ marginBottom: '2%' }}>
                      Таблица пищевой ценности (на 100 г):
                    </Typography>

                    <Typography variant="h5" component="h2" className="ItemTitleValue" style={{ width: '70%' }}>
                      Полное описание состава блюд, калорийности и возможных аллергенов можно{' '}
                      <span style={{ color: '#DD1A32', textDecoration: 'underline', cursor: 'pointer' }}>скачать в формате PDF</span>{' '}(9 Мб)
                    </Typography>
                  </div>

                  <div className="List">
                    {openItem.items.map((item, key) => (
                      <div key={key} style={{ marginBottom: '5%' }}>
                        <div className="itemNumber">
                          <span className="ItemDesk">{key + 1}.</span>
                        </div>

                        <div className="itemValue">
                          <div className="itemValueRow" style={{ borderBottom: '2px solid #b2b2b2' }}>
                            <div className="ItemTitleSet" style={{ width: '80%' }}>{item.name}</div>

                            <div style={{ width: '20%' }}>
                              <span className="ItemTitleSet">{item.kkal}</span>
                              <span className="ItemTitleValue">ккал</span>
                            </div>
                          </div>

                          <div className="itemValueRow">
                            <div className="ItemTitleValue" style={{ width: '60%' }}>Состав: {item.tmp_desc}</div>

                            <div className="ItemTitleValue" style={{ width: '40%' }}>
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
              )}
            </Grid>

            <Grid className="SecondItem">
              <Typography variant="h5" component="h1" className="ItemTitleStart">{openItem?.name}</Typography>

              <Grid>
                <div className="dop_text">
                  {parseInt(openItem?.cat_id) != 4 ? null : <span className="first_text" onClick={openSet}>{openItem?.count_part_new}</span>}

                  {parseInt(openItem?.cat_id) == 5 || parseInt(openItem?.cat_id) == 6 || parseInt(openItem?.cat_id) == 7 || parseInt(openItem?.cat_id) == 15 ? null : 
                    <span className="second_text" style={{ padding: parseInt(openItem?.cat_id) == 4 ? '0 4%' : '0 10% 0 0' }}>
                      {parseInt(openItem?.cat_id) == 14 ? openItem?.size_pizza : openItem?.count_part}
                      {parseInt(openItem?.cat_id) == 14 ? ' см' : parseInt(openItem?.cat_id) == 6 ? ' л' : ' шт.'}
                    </span>
                  }

                  <span className="third_text" style={{ paddingLeft: parseInt(openItem?.count_part) == 1 ? 0 : '10%' }}>
                    {new Intl.NumberFormat('ru-RU').format(openItem?.weight)}
                    {parseInt(openItem?.id) == 17 || parseInt(openItem?.id) == 237 ? ' шт.' : parseInt(openItem?.cat_id) == 6 ? ' л' : ' г'}
                  </span>
                </div>

                <div style={{ width: 30, height: 30, cursor: 'pointer' }} onClick={openFoodValue}>
                  {foodValue === true ? <IconInfoRed /> : <IconInfoWhite />}
                </div>
              </Grid>

              <Typography variant="h5" component="span" style={{ marginBottom: 20, minHeight: 200 }} className="ItemDescStart">
                {openItem?.marc_desc.length > 0 ? openItem?.marc_desc : openItem?.tmp_desc}
              </Typography>

              {count == 0 ? 
                <div className="containerBTN">
                  <Button variant="outlined" className="ModalItemButtonCartPC" onClick={() => setCount((prev) => prev + 1)}>
                    {new Intl.NumberFormat('ru-RU').format(openItem?.price)} ₽
                  </Button>
                </div>
                :
                <div className="containerBTN">
                  <div variant="contained">
                    <button className="minus" onClick={() => setCount((prev) => prev - 1)}>–</button>
                    <span>{count}</span>
                    <button className="plus" onClick={() => setCount((prev) => prev + 1)}>+</button>
                  </div>
                </div>
               }
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
