import { useState } from 'react';

import Image from 'next/image';

import { useHomeStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow';

import { IconClose, IconInfoRed, IconInfoWhite } from '@/ui/Icons';

import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Start() {
  console.log('render ModalStart');

  const [openItem, closeModal, foodValue, openFoodValue, openSet] = useHomeStore(
    (state) => [state.openItem, state.closeModal, state.foodValue, state.openFoodValue, state.openSet],
    shallow
  );

  const [count, setCount] = useState(0);

  return (
    <Box component="div" className="pcItem NewModal">
      <IconButton style={{ position: 'absolute', top: -50, left: 10, backgroundColor: 'transparent' }} onClick={closeModal}>
        <IconClose style={{ width: 35, height: 35, overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)' }}/>
      </IconButton>

      <Grid container className="MainItem">
        <Grid className="FirstMainItem">
          <Image alt={openItem.name} src={'https://cdnimg.jacofood.ru/' + openItem.img_app + '_1420x1420.jpg'} width={1420} height={1420} priority={true}/>
        </Grid>

        <Grid className="SecondMainItem">
          <Typography variant="h5" component="h1" className="ModalItemTitle">{openItem.name}</Typography>

          <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} sx={{ paddingLeft: { xs: parseInt(openItem.cat_id) == 4 ? 0 : '7%' }}}>
            <div className="dop_text">
              {parseInt(openItem.cat_id) != 4 ? null : <span className="first_text" onClick={openSet}>{openItem.count_part_new}</span>}
              
              {parseInt(openItem.cat_id) == 5 || parseInt(openItem.cat_id) == 6 || parseInt(openItem.cat_id) == 7 || parseInt(openItem.cat_id) == 15 ? null :
                <span className="second_text" style={{ padding: parseInt(openItem.cat_id) == 4 ? '0 4%' : '0 9% 0 0' }}>
                  {parseInt(openItem.cat_id) == 14 ? openItem.size_pizza : openItem.count_part}
                  {parseInt(openItem.cat_id) == 14 ? 'см' : parseInt(openItem.cat_id) == 6 ? 'л' : 'шт.'}
                </span>
              }

              <span className="third_text" style={{ paddingLeft: parseInt(openItem.count_part) == 1 ? 0 : '9%' }}>
                {new Intl.NumberFormat('ru-RU').format(openItem.weight)}
                {parseInt(openItem.id) == 17 || parseInt(openItem.id) == 237 ? 'шт.' : parseInt(openItem.cat_id) == 6 ? 'л' : 'г'}
              </span>
            </div>

            <div style={{ width: 30, height: 30, cursor: 'pointer' }} onClick={openFoodValue}>
              {foodValue === true ? <IconInfoRed /> : <IconInfoWhite />}
            </div>
          </Grid>

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
      </Grid>
    </Box>
  );
}
