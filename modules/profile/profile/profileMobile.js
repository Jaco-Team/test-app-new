import { useEffect, useState } from 'react';

import { useProfileStore } from '@/components/store.js';
import Link from 'next/link';

import ProfileModalMobile from './modalProfileMobile';
import AccountModalMobile from '../account/modalAccountMobile';

import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';

import MyTextInput from '@/ui/MyTextInput';
import { SwitchContactsMobile as MySwitch } from '@/ui/MySwitch.js';
import { ArrowLeftMobile, EditPencilMobile, LockMobile } from '@/ui/Icons.js';

export default function ProfileMobile({ city }) {
  //const [userName] = useHeaderStore((state) => [state.userName]);

  const [userInfo, setUserInfo] = useState({});
  const [sms, setSMS] = useState(false);
  const [check, setCheck] = useState(false);

  const [setActiveProfileModal, setActiveAccountModal] = useProfileStore((state) => [state.setActiveProfileModal, state.setActiveAccountModal]);

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      name: '',
      fam: '',
      mail: '',
    },
  });

  useEffect(() => {
    setValue('name', userInfo.name);
    setValue('fam', userInfo.fam);
    setValue('mail', userInfo.mail);
  }, [userInfo]);

  function saveMainData() {
    let userData = getValues();

    userInfo.name = userData.name;
    userInfo.fam = userData.fam;
    userInfo.mail = userData.mail;

    console.log('saveMainData', userInfo);

    setUserInfo(userInfo);

    ///setUser(userInfo);

    //updateUser(this_module, city, session.data?.user?.token);
  }

  const userDate = ''; // временно для верстки

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
        <div className="dataItem profileMain" onClick={() => setActiveProfileModal(true, 'phone')}>
          <span className="itemSpan">+7 (916) 548-23-78</span>
          <LockMobile />
        </div>
        <div className="dataItem profileMain" onClick={() => userDate ? setActiveProfileModal(true, 'date_change') : setActiveProfileModal(true, 'date_first')}>
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
              />
            )}
            name="mail"
          />
          <EditPencilMobile />
        </div>
        <div className="dataItem profileMain">
          <span className="itemSwitch" style={{ color: sms ? 'rgba(0, 0, 0, 0.80)' : 'rgba(0, 0, 0, 0.40)' }}>
            Хочу получать СМС с акциями, скидками и подарками
          </span>
          <MySwitch
            //checked={disable}
            onClick={(event) => setSMS(event.target.checked)}
          />
        </div>
        <div className="dataItem profileMain">
          <span className="itemSwitch" style={{ color: check ? 'rgba(0, 0, 0, 0.80)' : 'rgba(0, 0, 0, 0.40)' }}>
            Хочу получать цифровые чеки на электронную почту
          </span>
          <MySwitch
            //checked={disable}
            onClick={(event) => setCheck(event.target.checked)}
          />
        </div>
      </div>

      <div className="profileDelete profileMain" onClick={() => setActiveAccountModal(true, 'exit')}>Удалить профиль навсегда</div>

      <ProfileModalMobile />
      <AccountModalMobile />
    </Box>
  );
}
