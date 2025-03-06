import React, { useEffect, useState } from 'react';

import Link from 'next/link'

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useForm, Controller } from "react-hook-form";

import ProfileBreadcrumbs from '../profileBreadcrumbs.jsx';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import MyTextInput from '@/ui/MyTextInput.js';
import { SwitchIOS as MySwitch } from '@/ui/MySwitch.js';
import MySelect from '@/ui/MySelect.js';

import { CloseIconMin, ProfileIconNew } from '@/ui/Icons.js';

import ModalAddr from './modalAddr.jsx';

import { useProfileStore, useHeaderStoreNew } from '@/components/store.js';


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { ru } from 'date-fns/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import dayjs from 'dayjs';
//import 'dayjs/locale/ru';

import { DialogActions, Button } from '@mui/material';

function CustomActionBar(props) {
  const { onAccept, onCancel, actions, className } = props;
  //const { onAccept, onClear, onCancel, onSetToday, actions, className } = props;
  return (
    <DialogActions className={className} style={{ justifyContent: 'space-between', paddingBottom: '1.8vw', paddingLeft: '1.8vw', paddingRight: '1.8vw' }}>
      {actions.includes('cancel') && (
        <Button
          onClick={onCancel}
          sx={{
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: 100,
            color: 'black',
            width: '100%',
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
        >
          Отмена
        </Button>
      )}

      {actions.includes('accept') && (
        <Button
          onClick={onAccept}
          sx={{
            backgroundColor: '#cc0033',
            border: '1px solid #cc0033',
            color: 'white',
            borderRadius: 100,
            width: '100%',
            '&:hover': { backgroundColor: '#cc0033' },
          }}
        >
          Выбрать
        </Button>
      )}
    </DialogActions>
  );
}

export default function ProfilePC({ page, this_module, city }){
  const [date, setDate] = useState();

  const [ getUserInfo, setUser, userInfo, streets, shortName, updateUser, openModalAddr, delAddr ] = useProfileStore( state => [ state.getUserInfo, state.setUser, state.userInfo, state.streets, state.shortName, state.updateUser, state.openModalAddr, state.delAddr ] );

  const [ token, signOut ] = useHeaderStoreNew( state => [ state?.token, state?.signOut ] )

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      name: '',
      fam: '',
      login: '',
      mail: ''
    }
  });

  const [ isSpam, setIsSpam ] = useState(0);

  const [ user_d, setUser_d ] = useState('');
  const [ user_m, setUser_m ] = useState('');

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

  // if( arr_d.length == 0 ){
    
  //   let arr_d = [];

  //   for(let i = 1; i <= 31; i ++){
  //     arr_d.push({
  //       name: i,
  //       id: i
  //     })
  //   }

  //   setArr_d(arr_d);
  // }

  const now = new Date();
  const minDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
  const maxDate = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());

  useEffect(() => {
    if( token && token.length > 0 ){
      getUserInfo(this_module, city, token);
    }
  }, [token]);

  useEffect(() => {
    setValue("name", userInfo?.name)
    setValue("fam", userInfo?.fam)
    setValue("login", userInfo?.login)
    setValue("mail", userInfo?.mail)

    setIsSpam(userInfo?.spam)
    setUser_d(userInfo?.date_bir_d)  
    setUser_m(userInfo?.date_bir_m)

    if( userInfo?.date_bir_full ){
      setDate( new Date(userInfo?.date_bir_full) );
    }
    

  }, [userInfo]);

  function saveMainData(userInfo){
    let userData = getValues();

    userInfo.name = userData?.name;
    userInfo.fam = userData?.fam;
    userInfo.mail = userData?.mail;

    setUser(userInfo);

    updateUser(this_module, city, token);
  }

  function changeOtherData(type, data, userInfo){
    userInfo[ [type] ] = data === true ? 1 : 0;

    setUser(userInfo);

    setIsSpam(data === true ? 1 : 0)

    updateUser(this_module, city, token);
  }  

  function changeUserData(data, value, userInfo){
    userInfo[ [data] ] = value;

    setUser(userInfo);

    if( data == 'date_bir_d' ){
      setUser_d(value)
    }

    if( data == 'date_bir_m' ){
      setUser_m(value)
    }

    if( userInfo?.date_bir_m > 0 && userInfo?.date_bir_d > 0 ){
      updateUser(this_module, city, token);
    }
  }

  function setUserDate(date, userInfo){
    let newdate = dayjs(date).format('YYYY-MM-DD')
    
    const [year, month, day] = newdate.split('-');

    userInfo[ 'date_bir_d' ] = day;
    userInfo[ 'date_bir_m' ] = month;
    userInfo[ 'date_bir_y' ] = year;

    userInfo.date_bir = newdate;

    setUser(userInfo);

    updateUser(this_module, city, token);
  }
  
  // <div>
  //             <div>
  //               <MySelect 
  //                 data={arr_d}
  //                 className="date_d"
  //                 disabled={ userInfo?.date_bir_m > 0 && userInfo?.date_bir_d > 0 ? true : false }
  //                 value={ user_d }
  //                 func={ (event) => changeUserData('date_bir_d', event.target.value, userInfo) }
  //               />
  //             </div>
  //             <div>
  //               <MySelect 
  //                 data={arr_m}
  //                 className="date_m"
  //                 disabled={ userInfo?.date_bir_m > 0 && userInfo?.date_bir_d > 0 ? true : false }
  //                 value={ user_m }
  //                 func={ (event) => changeUserData('date_bir_m', event.target.value, userInfo) }
  //               />
  //             </div>
  //           </div>

  return (
    <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
      <Grid item className="Profile mainContainer">
        
        <Grid item xs={12}>
          <Typography variant="h5" component="h1">Личные данные</Typography>
        </Grid>

        <Grid item xs={12} className="main_data">
          <div>
            <span>
              {shortName ? shortName : <ProfileIconNew />}
            </span>
          </div>
          <div>
            <div style={{ marginTop: '0.1vw' }}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MyTextInput
                    placeholder="Имя"
                    onBlur={ () => saveMainData(userInfo) }
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
                    onBlur={ () => saveMainData(userInfo) }
                    func={onChange}
                    value={value}
                  />
                )}
                name="fam"
              />
            </div>
            <div style={{ marginTop: '-1.2vw' }}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MyTextInput
                    placeholder=""
                    readOnly={true}
                    func={onChange}
                    value={value}
                    style={{ cursor: 'default' }}
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
                    onBlur={ () => saveMainData(userInfo) }
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
              <MySwitch checked={ parseInt(isSpam) == 1 ? true : false } onClick={ event => { changeOtherData('spam', event.target.checked, userInfo) } } />
            </div>
            <div style={{ display: 'none' }}>
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
              <span>Дата вашего рождения</span>
            </div>
            <div>
              <LocalizationProvider 
                dateAdapter={AdapterDateFns} 
                adapterLocale={ru}
                localeText={{
                  cancelButtonLabel: 'Отмена',
                  okButtonLabel: 'Выбрать',
                  todayButtonLabel: 'Сегодня',
                  datePickerToolbarTitle: 'Выбрать дату'
                }}
              >
                <MobileDatePicker
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  format="d MMMM yyyy"
                  minDate={minDate}
                  maxDate={maxDate}
                  disabled={ userInfo?.date_bir_full ? true : false }
                  onAccept={ (newValue) => setUserDate(newValue, userInfo) }
                  //showToolbar         // Включаем верхнюю панель
                  //toolbarFormat="d MMMM yyyy"
                  slots={{
                    actionBar: CustomActionBar,
                  }}
                  views={['year', 'month', 'day']}
                  slotProps={{
                    field: { shouldRespectLeadingZeros: true },
                    actionBar: {
                      actions: ['cancel', 'accept'],
                    },
                    toolbar: {
                      toolbarFormat: 'd MMMM yyyy',
                      //toolbarPlaceholder: '??',
                      sx: {
                        '& span': {
                          textAlign: 'center',
                          width: '100%'
                        },
                        '& h4': {
                          textAlign: 'center',
                          width: '100%'
                        },
                      },
                    },
                    mobilePaper: {
                      sx: {
                        borderRadius: '1.4880866426vw', // задаём нужный radius
                        width: '20vw', // Ширина
                      },
                    },
                    textField: {
                      placeholder: "Выберите дату", // Добавляем placeholder
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderWidth: '0.1083032491vw', // Толстый бордер
                            borderColor: 'rgba(0, 0, 0, 0.23)',  // Цвет бордера
                          },
                          borderRadius: '100px', // Скругление
                        },
                      },
                    },
                    day: {
                      sx: {
                        // Стили для выбранного дня
                        '&.Mui-selected': {
                          backgroundColor: '#cc0033',
                          color: '#fff', // цвет текста
                        },
                        // При желании можно задать стили при наведении на выбранный день
                        '&.Mui-selected:hover': {
                          backgroundColor: '#cc0033',
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
            
            <div>
              Дату рождения можно выбрать только один раз. Будьте внимательны, так как изменить её позже не получится.
            </div>
          </div>
        </Grid>

        <Grid item xs={12} className="addr_table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={3} className="headTable">Мои адреса</TableCell>
                <TableCell colSpan={2} className="headAddTable">
                  <div className="headAddTable__" onClick={ () => openModalAddr(0, city) }>
                    <span>Добавить</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              
              {streets?.map( (item, key) =>
                <TableRow key={key}>
                  <TableCell>{item.city_name}</TableCell>
                  <TableCell>{item.name_street}, д. {item.home}, кв. {item.kv}</TableCell>
                  <TableCell className={ parseInt(item.is_main) == 1 ? 'ChooseAddr' : '' }>{ parseInt(item.is_main) == 1 ? <div>Основной</div> : false }</TableCell>
                  <TableCell className='ChangeAddr'><span onClick={ () => openModalAddr(item.id, item.city) }>Изменить</span></TableCell>
                  <TableCell><CloseIconMin onClick={ () => delAddr(item.id, token) } /></TableCell>
                </TableRow> 
              )}
            
            </TableBody>
          </Table>
        </Grid>

        <Grid item xs={12} className="log_out">
          <span style={{ visibility: 'hidden' }}>Удалить аккаунт</span>
          <Link href={"/"+city} onClick={ () => signOut(city) }>Выйти</Link>
        </Grid>

      </Grid>
      
      <ProfileBreadcrumbs />
      <ModalAddr />

    </Grid>
  )
}
