import React, { useState } from 'react';

import { useHomeStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow';

import { IconClose, IconInfoRed, IconInfoWhite } from '@/ui/Icons';

import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import useMediaQuery from '@mui/material/useMediaQuery';

export default function Value() {
  console.log('render ModalValue');

  const [openItem, closeModal, foodValue, openFoodValue, openSet] =
    useHomeStore((state) => [state.openItem, state.closeModal, state.foodValue, state.openFoodValue, state.openSet], shallow);

  const [count, setCount] = useState(0);

  const matches = useMediaQuery('screen and (min-width: 40em)', { noSsr: true });

  return (
    <Box component="div" className="pcItem NewModal">
       <IconButton style={{ position: 'absolute', top: -50, left: 10, backgroundColor: 'transparent' }} onClick={closeModal}>
        <IconClose style={{ width: 35, height: 35, overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)' }}/>
      </IconButton>

      <Grid container className="MainItem">
        <Grid item className="ValueMainItem">
          <Grid sx={{ minHeight: { xs: 2, sm: 4 }, width: { xs: 100, sm: 150 }, margin: '3% 0 5% 0', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 10 }}></Grid>

          {matches ? (
            <Typography variant="h5" component="h2" className="ModalItemTitleSet">
              {matches ? 'Таблица пищевой ценности (на 100 г):' : 'Пищевая ценность'}
            </Typography>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '3%', width: '90%', marginLeft: '10%' }}>
              <Typography style={{ textAlign: 'center', marginBottom: 0, marginRight: '10%' }} variant="h5" component="h2" className="ModalItemTitleSet">
                {matches ? 'Таблица пищевой ценности (на 100 г):' : 'Пищевая ценность'}
              </Typography>
              <div style={{ width: 20, height: 20, cursor: 'pointer' }} onClick={openFoodValue}>
                {foodValue === true ? <IconInfoRed /> : <IconInfoWhite />}
              </div>
            </div>
          )}

          <Typography variant="h5" component="h2" className="ModalItemTitleValue">
            {matches ? null : 'Указана на 100 г. '}Полное описание состава блюд, калорийности и возможных аллергенов можно{' '}
            <span style={{ color: '#DD1A32', textDecoration: 'underline', cursor: 'pointer' }}>скачать в формате PDF</span>{' '}(9 Мб)
          </Typography>

          <div className="ListValue">
            {openItem.items.map((item, key) => (
              <Grid key={key} style={{ display: 'flex' }} sx={{ marginBottom: { xs: key + 1 === openItem.items.length ? '20%' : 0, sm: 0 }, width: { xs: '95%', sm: '85%' } }}>
                <Grid style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', paddingTop: '5%' }}
                  sx={{ width: { xs: '2%', sm: '5%' } }}
                >
                  <span className="ModalItemNumber">{key + 1}.</span>
                </Grid>

                <Grid style={{ width: '95%', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px solid #B2B2B2', borderRadius: '20px', marginBottom: '5%'}}
                  sx={{ marginLeft: { xs: '3%', sm: '5%' } }}
                >
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '2px solid #B2B2B2' }}>
                    <div className="ModalItemTitleSet" style={{ width: '85%', display: 'flex', justifyContent: 'flex-start', textAlign: 'left', alignItems: 'center', padding: '5%',
                        borderRight: '2px solid #B2B2B2'}}
                    >{item.name}
                    </div>

                    <div style={{ width: '15%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '0 5%' }}>
                      <span className="ModalItemTitleSet">{item.kkal}</span>
                      <span className="ModalItemOtherValue">ккал</span>
                    </div>
                  </div>

                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="ModalItemOtherValue" 
                      style={{ width: '70%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'left', padding: '5%', borderRight: '2px solid #B2B2B2' }}
                    >
                      Состав: {item.tmp_desc}
                    </div>
                    <div
                      className="ModalItemOtherValue"
                      style={{ width: '30%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'flex-start', padding: '0 5%' }}
                    >
                      <span className="ModalItemOtherValue">
                        белки................{item.protein}
                      </span>
                      <span className="ModalItemOtherValue">
                        жиры................{item.fat}
                      </span>
                      <span className="ModalItemOtherValue">
                        углеводы........{item.carbohydrates}
                      </span>
                    </div>
                  </div>
                </Grid>
              </Grid>
            ))}
          </div>
        </Grid>

        {!matches ? null : (
          <Grid item className="SecondMainItem">
            <Typography variant="h5" component="h1" className="ModalItemTitle">
              {openItem.name}
            </Typography>

            <div style={{ justifyContent: 'space-between' }}>
              <div className="dop_text">
                {parseInt(openItem.cat_id) != 4 ? null : <span className="first_text" onClick={openSet}>{openItem.count_part_new}</span>}
                {parseInt(openItem.cat_id) == 5 || parseInt(openItem.cat_id) == 6 || parseInt(openItem.cat_id) == 7 || parseInt(openItem.cat_id) == 15 ? null :
                  <span className="second_text" style={{ padding: parseInt(openItem.cat_id) == 4 ? '0 4%' : '0 9% 0 0' }}>
                    {parseInt(openItem.cat_id) == 14 ? openItem.size_pizza : openItem.count_part}
                    {parseInt(openItem.cat_id) == 14 ? 'см' : parseInt(openItem.cat_id) == 6 ? ' л' : ' шт.'}
                  </span>
                }

                <span className="third_text" style={{ paddingLeft: parseInt(openItem.count_part) == 1 ? 0 : '9%' }}>
                  {new Intl.NumberFormat('ru-RU').format(openItem.weight)}
                  {parseInt(openItem.id) == 17 || parseInt(openItem.id) == 237 ? 'шт.' : parseInt(openItem.cat_id) == 6 ? ' л' : ' г'}
                </span>
              </div>

              <div style={{ width: 30, height: 30, cursor: 'pointer' }} onClick={openFoodValue}>
                {foodValue === true ? <IconInfoRed /> : <IconInfoWhite />}
              </div>
            </div>

            <Typography variant="h5" component="span" style={{ marginBottom: 20, minHeight: 200 }} className="ModalItemDesc">
              {openItem.marc_desc.length > 0 ? openItem.marc_desc : openItem.tmp_desc}
            </Typography>

            {count == 0 ? (
              <div className="containerBTN">
                <Button variant="outlined" className="ModalItemButtonCartPC" onClick={() => setCount((prev) => prev + 1)}>
                  {new Intl.NumberFormat('ru-RU').format(openItem.price)} ₽
                </Button>
              </div>
            ) : (
              <div className="containerBTN">
                <div variant="contained">
                  <button className="minus" onClick={() => setCount((prev) => prev - 1)}>
                    –
                  </button>
                  <span>{count}</span>
                  <button className="plus" onClick={() => setCount((prev) => prev + 1)}>
                    +
                  </button>
                </div>
              </div>
            )}
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
