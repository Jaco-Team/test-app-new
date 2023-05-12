import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useForm, Controller } from "react-hook-form";

import ProfileBreadcrumbs from '../profileBreadcrumbs.jsx';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import MyTextInput from '@/../ui/MyTextInput.js';
import MySwitch from '@/../ui/Switch.js';
import MySelect from '@/../ui/MySelect.js';

import { CloseIconMin } from '@/../ui/Icons.js';

import Meta from '@/components/meta.js';

import { useProfileStore } from '@/../components/store.js';

export default function ProfilePage(props){
  const { page, this_module, city } = props;

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      name: '',
      fam: '',
      login: '',
      mail: ''
    }
  });

  const [ arr_d, setArr_d ] = useState([]);
  const [ arr_m, setArr_m ] = useState([ 
    {name: 'Января', id: 1},
    {name: 'Февраля', id: 2},
    {name: 'Марта', id: 3},
    {name: 'Апреля', id: 4},
    {name: 'Мая', id: 5},
    {name: 'Июня', id: 6},
    {name: 'Июля', id: 7},
    {name: 'Августа', id: 8},
    {name: 'Сентября', id: 9},
    {name: 'Октября', id: 10},
    {name: 'Ноября', id: 11},
    {name: 'Декабря', id: 12}
  ]);

  

  if( arr_d.length == 0 ){
    
    console.log( 'arr_d' )
    let arr_d = [];

    for(let i = 1; i <= 31; i ++){
      if( i < 10 ){
        arr_d.push({
          name: '0'+i,
          id: i
        })
      }else{
        arr_d.push({
          name: i,
          id: i
        })
      }
    }

    setArr_d(arr_d);
    
  }

  const [ getUserInfo, setUser, userInfo, streets, shortName, updateUser ] = useProfileStore( state => [ state.getUserInfo, state.setUser, state.userInfo, state.streets, state.shortName, state.updateUser ] );

  useEffect(() => {
    getUserInfo(this_module, city, 'ODk4NzkzNDAzOTEtXy0xNzYyMg');
  }, [getUserInfo]);

  useEffect(() => {
    setValue("name", userInfo.name)
    setValue("fam", userInfo.fam)
    setValue("login", userInfo.login)
    setValue("mail", userInfo.mail)
  }, [userInfo]);

  function saveMainData(){
    let userData = getValues();

    userInfo.name = userData.name;
    userInfo.fam = userData.fam;
    userInfo.mail = userData.mail;

    setUser(userInfo);

    updateUser(this_module, city, 'ODk4NzkzNDAzOTEtXy0xNzYyMg');
  }

  function changeOtherData(type, data){
    userInfo[ [type] ] = data === true ? 1 : 0;

    console.log( type, data )

    setUser(userInfo);
    updateUser(this_module, city, 'ODk4NzkzNDAzOTEtXy0xNzYyMg');
  }  

  function changeUserData(data, value){
    userInfo[ [data] ] = value;

    setUser(userInfo);

    if( userInfo?.date_bir_m > 0 && userInfo?.date_bir_d > 0 ){
      updateUser(this_module, city, 'ODk4NzkzNDAzOTEtXy0xNzYyMg');
    }
  }

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
                {shortName}
              </div>
            </div>
            <div>
              <div style={{ marginTop: '0.1vw', marginRight: '6%' }}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <MyTextInput
                      placeholder="Имя"
                      onBlur={ () => saveMainData() }
                      func={onChange}
                      value={value}
                    />
                  )}
                  name="name"
                />
              </div>
              <div style={{ marginTop: '0.1vw' }}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <MyTextInput
                      placeholder="Фамилия"
                      onBlur={ () => saveMainData() }
                      func={onChange}
                      value={value}
                    />
                  )}
                  name="fam"
                />
              </div>
              <div style={{ marginTop: '-1.2vw', marginRight: '6%' }}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <MyTextInput
                      placeholder=""
                      readOnly={true}
                      func={onChange}
                      value={value}
                    />
                  )}
                  name="login"
                />
              </div>
              <div style={{ marginTop: '-1.2vw' }}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <MyTextInput
                      placeholder="name@mail.ru"
                      onBlur={ () => saveMainData() }
                      func={onChange}
                      value={value}
                    />
                  )}
                  name="mail"
                />
              </div>
            </div>
          </Grid>

          <Grid item xs={12} className="check_data">
            <div>
              <div>
                <span>Хочу получать СМС с акциями и скидками</span>
                <MySwitch checked={ parseInt(userInfo.spam) == 1 ? true : false } onClick={ event => { changeOtherData('spam', event.target.checked) } } />
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
                  <MySelect 
                    data={arr_d}
                    disabled={ userInfo?.date_bir_m > 0 && userInfo?.date_bir_d > 0 ? true : false }
                    value={ userInfo?.date_bir_d ?? '' }
                    func={ (event) => changeUserData('date_bir_d', event.target.value) }
                  />
                </div>
                <div>
                  <MySelect 
                    data={arr_m}
                    disabled={ userInfo?.date_bir_m > 0 && userInfo?.date_bir_d > 0 ? true : false }
                    value={ userInfo?.date_bir_m ?? '' }
                    func={ (event) => changeUserData('date_bir_m', event.target.value) }
                  />
                </div>
               </div>
              <div>
                Дату рождения можно выбрать только один раз. Будьте внимательны, так как изменить её позже не получится. Если вам нужна помощь — напишите в поддержку.
              </div>
            </div>
          </Grid>

          { false ? null :
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
          }

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
                
                {streets.map( (item, key) =>
                  <TableRow key={key}>
                    <TableCell style={{ width: '23%' }}>{item.city_name}</TableCell>
                    <TableCell style={{ width: '65%' }}>{item.city_name_dop} {item.street}, д. {item.home}, кв. {item.kv}</TableCell>
                    <TableCell style={{ width: '12%' }} className='ChooseAddr'></TableCell>
                    <TableCell style={{ width: '1%' }} className='ChangeAddr'><span>Изменить</span></TableCell>
                    <TableCell style={{ width: '0%', maxWidth: '2.2vw' }}><CloseIconMin /></TableCell>
                  </TableRow> 
                )}
              
              </TableBody>
            </Table>
          </Grid>

        </Grid>
        <ProfileBreadcrumbs />
      </Grid>
    </Meta>
  )
}