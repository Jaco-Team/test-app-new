import React, { useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import ProfileBreadcrumbs from '../profileBreadcrumbs.jsx';
//import PromoCard from './promoCard.jsx';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import MyTextInput from '@/../ui/MyTextInput.js';
import MySwitch from '@/../ui/Switch.js';
import { CloseIconMin } from '@/../ui/Icons.js';

import Meta from '@/components/meta.js';

import { useProfileStore } from '@/../components/store.js';

export default function ProfilePage(props){

  const { page, this_module, city } = props;

  const { getUserInfo } = useProfileStore( state => state );

  useEffect(() => {
    getUserInfo(this_module, city, 'ODk4NzkzNDAzOTEtXy0xNzYyMg');
  }, [getUserInfo]);

  return (
    <Meta title={page.title} description={''}>
      <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
        <Grid item className="Profile mainContainer">
          
          <Grid item xs={12}>
            <Typography variant="h5" component="h1">Личные данные</Typography>
          </Grid>

          <Grid item xs={12} className="main_data">
            <div>
              <div>
                ММ
              </div>
            </div>
            <div>
              <div style={{ marginTop: '0.1vw', marginRight: '6%' }}>
                <MyTextInput />
              </div>
              <div style={{ marginTop: '0.1vw' }}>
                <MyTextInput />
              </div>
              <div style={{ marginTop: '-1.2vw', marginRight: '6%' }}>
                <MyTextInput />
              </div>
              <div style={{ marginTop: '-1.2vw' }}>
                <MyTextInput />
              </div>
            </div>
          </Grid>

          <Grid item xs={12} className="check_data">
            <div>
              <div>
                <span>Хочу получать СМС с акциями и скидками</span>
                <MySwitch />
              </div>
              <div>
                <span>Хочу получать цифровые чеки на электронную почту</span>
                <MySwitch />
              </div>
            </div>
          </Grid>

          <Grid item xs={12} className="date_data">
            <div>
              
              <div>
                <span>Подарим промокод на бесплатный ролл ко дню рождения.</span>
                
              </div>

            </div>
            <div>
              <div>
                Дата вашего рождения
              </div>
              <div>
                <div>
                  <MyTextInput />
                </div>
                <div>
                  <MyTextInput />
                </div>
                
              </div>
              <div>
                Дату рождения можно выбрать только один раз. Будьте внимательны, так как изменить её позже не получится. Если вам нужна помощь — напишите в поддержку.
              </div>
            </div>
          </Grid>

          <Grid item xs={12} className="bank_table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={3} className="headTable">Мои карты</TableCell>
                  <TableCell colSpan={2} className="headAddTable">
                    <span>
                      Добавить
                    </span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                
                <TableRow>
                  <TableCell>Банк</TableCell>
                  <TableCell>ХХХ</TableCell>
                  <TableCell>ФОТО</TableCell>
                  <TableCell className='chooseCart'><span>Основная</span></TableCell>
                  <TableCell><CloseIconMin /></TableCell>
                </TableRow> 
                <TableRow>
                  <TableCell>Банк</TableCell>
                  <TableCell>ХХХ</TableCell>
                  <TableCell>ФОТО</TableCell>
                  <TableCell></TableCell>
                  <TableCell><CloseIconMin /></TableCell>
                </TableRow> 
                <TableRow>
                  <TableCell>Банк</TableCell>
                  <TableCell>ХХХ</TableCell>
                  <TableCell>ФОТО</TableCell>
                  <TableCell></TableCell>
                  <TableCell><CloseIconMin /></TableCell>
                </TableRow> 

              </TableBody>
            </Table>
          </Grid>

          <Grid item xs={12} className="addr_table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={3} className="headTable">Мои адреса</TableCell>
                  <TableCell colSpan={2} className="headAddTable">
                    <span>
                      Добавить
                    </span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                
                <TableRow>
                  <TableCell style={{ width: '23%' }}>Тольятти</TableCell>
                  <TableCell style={{ width: '65%' }}>Льва Яшина 10-85</TableCell>
                  <TableCell style={{ width: '12%' }} className='ChooseAddr'><span>Основной</span></TableCell>
                  <TableCell style={{ width: '1%' }} className='ChangeAddr'><span>Изменить</span></TableCell>
                  <TableCell style={{ width: '0%', maxWidth: '2.2vw' }}><CloseIconMin /></TableCell>
                </TableRow> 
                <TableRow>
                  <TableCell>Самара</TableCell>
                  <TableCell>Молодогвардейская 45 - 56</TableCell>
                  <TableCell></TableCell>
                  <TableCell className='ChangeAddr'><span>Изменить</span></TableCell>
                  <TableCell><CloseIconMin /></TableCell>
                </TableRow> 
                

              </TableBody>
            </Table>
          </Grid>

        </Grid>
        <ProfileBreadcrumbs />
      </Grid>
    </Meta>
  )
}