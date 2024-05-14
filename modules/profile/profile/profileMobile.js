import { useEffect, useState } from 'react';

import { useProfileStore, useHeaderStore } from '@/components/store.js';
import Link from 'next/link';

import ProfileModalMobile from './modalProfileMobile';
import AccountModalMobile from '../account/modalAccountMobile';

import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';

import MyTextInput from '@/ui/MyTextInput';
import { SwitchContactsMobile as MySwitch } from '@/ui/MySwitch.js';
import { ArrowLeftMobile, EditPencilMobile, LockMobile } from '@/ui/Icons.js';

export default function ProfileMobile({ city, this_module }) {
  
  const [userDate, setUserDate] = useState('');
  const [isSpam, setIsSpam] = useState(0);
  
  const [setActiveProfileModal, setUser, userInfo, getUserInfo, updateUser] = useProfileStore((state) => [state.setActiveProfileModal, state.setUser, state.userInfo, state.getUserInfo, state.updateUser]);
  const [token] = useHeaderStore( state => [ state.token] )

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      name: '',
      fam: '',
      mail: '',
      login: '',
    },
  });

  useEffect(() => {

    setValue('name', userInfo?.name ?? '');
    setValue('fam', userInfo?.fam ?? '');
    setValue('mail', userInfo?.mail ?? '');
    setIsSpam(userInfo?.spam);
    setUserDate( userInfo?.date_bir?.length ? userInfo?.date_bir.toLowerCase() : '');

  }, [setValue, userInfo]);

  useEffect(() => {
    if( token && token.length > 0 ) {
      getUserInfo(this_module, city, token);
    }
  }, [token]);

  function saveMainData() {
    let userData = getValues();

    userInfo.name = userData.name;
    userInfo.fam = userData.fam;
    userInfo.mail = userData.mail;

    setUser(userInfo);

    updateUser(this_module, city, token);
  }

  function changeOtherData(type, data){
    userInfo[ [type] ] = data === true ? 1 : 0;

    setUser(userInfo);

    setIsSpam(data === true ? 1 : 0);

    updateUser(this_module, city, token);
  } 

  //<div className="profileDelete profileMain" onClick={() => setActiveAccountModal(true, 'exit')}>Удалить профиль навсегда</div>

  /*
    <div className="dataItem profileMain">
          <span className="itemSwitch" style={{ color: 'rgba(0, 0, 0, 0.40)' }}
          //style={{ color: check ? 'rgba(0, 0, 0, 0.80)' : 'rgba(0, 0, 0, 0.40)' }}
          >
            Хочу получать цифровые чеки на электронную почту
          </span>
          <MySwitch />
        </div>
  */

  return (
    <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className="ProfileMobile">
      <div className="profileLogin">
        <Link href={'/' + city + '/account'}>
          <ArrowLeftMobile />
        </Link>
        <span>Личные данные</span>
      </div>

      <div className="profileData profileMain">
        <div className="dataItem profileMain">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                placeholder="Имя"
                onBlur={() => saveMainData()}
                func={onChange}
                value={value}
              />
            )}
            name="name"
          />
          <EditPencilMobile />
        </div>
        <div className="dataItem profileMain">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                placeholder="Фамилия"
                onBlur={() => saveMainData()}
                func={onChange}
                value={value}
              />
            )}
            name="fam"
          />
          <EditPencilMobile />
        </div>
        <div className="dataItem profileMain" /*onClick={() => setActiveProfileModal(true, 'phone')}*/>
          <span className="itemSpan">{userInfo?.login ?? ''}</span>
          <LockMobile />
        </div>
        <div className="dataItem profileMain" onClick={() => userDate ? /*setActiveProfileModal(true, 'date_change')*/ () => {} : setActiveProfileModal(true, 'date_first')}>
          <span className={userDate ? 'itemSpan' : 'itemSpan notDate'}>
            {userDate ? userDate : 'Дата рождения'}
          </span>
          {userDate ? (
            <LockMobile />
          ) : (
            <div className="dateText">Подарим промокод ко дню рождения</div>
          )}
        </div>
        <div className="dataItem profileMain">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <MyTextInput
                placeholder="Электронная @ почта"
                onBlur={() => saveMainData()}
                func={onChange}
                value={value}
                type="email"
                autocomplete="off"
              />
            )}
            name="mail"
          />
          <EditPencilMobile />
        </div>
        <div className="dataItem profileMain">
          <span className="itemSwitch" style={{ color: parseInt(userInfo?.spam) === 1 ? 'rgba(0, 0, 0, 0.80)' : 'rgba(0, 0, 0, 0.40)' }}>
            Хочу получать СМС с акциями, скидками и подарками
          </span>
          <MySwitch
            checked={parseInt(isSpam) == 1 ? true : false} onClick={ event => { changeOtherData('spam', event.target.checked) } }
          />
        </div>
        
      </div>

      <ProfileModalMobile city={city} this_module={this_module} setUserDate={setUserDate} />
      <AccountModalMobile />
    </Box>
  );
}
