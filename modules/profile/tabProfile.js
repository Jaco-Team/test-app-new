import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';

import MyCheckBox from '../../ui/MyCheckBox.js';
import MyTextInput from '../../ui/MyTextInput.js';
import MySelect from '../../ui/MySelect.js';

import { useProfileStore } from '../../components/store.js';

export default function TabPromo(props){

  const {this_module, city} = props;
  
  const { userInfo, getUserInfo, setUser, updateUser } = useProfileStore( state => state );
  
  const [ user, setUserInfo ] = useState({});
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

  useEffect(() => {
    getUserInfo(this_module, city, 'ODk4NzkzNDAzOTEtXy0xNzYyMg');

    console.log( 'load getUserInfo' )
  }, [getUserInfo]);
  
  useEffect(() => {
    setUserInfo(userInfo);
  }, [userInfo]);

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

  function changeUserData(data, value){
    user[ [data] ] = value;

    setUser(user);

    if( data == 'spam' ){
      setTimeout( () => {
        saveUserData()
      }, 200 )
    }

    if( user?.date_bir_m > 0 && user?.date_bir_d > 0 ){
      setTimeout( () => {
        saveUserData()

        setTimeout( () => {
          getUserInfo(this_module, city, 'ODk4NzkzNDAzOTEtXy0xNzYyMg');
        }, 200 )
      }, 200 )
    }
  }

  function saveUserData(){
    updateUser(this_module, city, 'ODk4NzkzNDAzOTEtXy0xNzYyMg', user);
  }

  return (
    <Grid container spacing={3} className="TableUserForm">

      <Grid item xs={12} sm={6}>
        <MyTextInput label={'Имя'} value={ user?.name ?? '' } func={ (event) => changeUserData('name', event.target.value) } onBlur={ () => saveUserData() } />
      </Grid>
      <Grid item xs={12} sm={6}>
        <MyTextInput label={'Номер телефона'} value={ user?.login ?? '' } func={ (event) => changeUserData('login', event.target.value) } readOnly={true} />
      </Grid>

      { (user?.date_bir ?? '').length > 0 ? null :
        <>
          <Grid item xs={12} sm={2}>
            <MySelect label={'День рождения'} value={ user?.date_bir_d ?? '' } data={arr_d} func={ (event) => changeUserData('date_bir_d', event.target.value) } />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MySelect label={'Месяц'} value={ user?.date_bir_m ?? '' } data={arr_m} func={ (event) => changeUserData('date_bir_m', event.target.value) } />
          </Grid>
        </>
      }
      
      { (user?.date_bir ?? '').length == 0 ? null :
        <Grid item xs={12} sm={6}>
          <MyTextInput label={'День рождения'} value={ user?.date_bir ?? '' } func={ (event) => changeUserData('date_bir', event.target.value) } readOnly={true} />
        </Grid>
      }
      <Grid item xs={12} sm={6}>
        <MyTextInput label={'E-mail'} value={ user?.mail ?? '' } func={ (event) => changeUserData('mail', event.target.value) } onBlur={ () => saveUserData() } />
      </Grid>

      <Grid item xs={12} sm={6}>
        <MyCheckBox label={'Получать сообщения с акциями'} value={ parseInt(user?.spam ?? 1) == 1 ? true : false } func={ (event) => changeUserData('spam', event.target.checked ? 1 : 0) } />
      </Grid>

    </Grid>
  )
}