import { useEffect, useState } from 'react';

import { useProfileStore, useHeaderStoreNew } from '@/components/store.js';
import Link from 'next/link';

import ProfileModalMobile from './modalProfileMobile';
import AccountModalMobile from '../account/modalAccountMobile';

import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';

import MyTextInput from '@/ui/MyTextInput';
import { SwitchContactsMobile as MySwitch } from '@/ui/MySwitch.js';
import { ArrowLeftMobile, EditPencilMobile, LockMobile } from '@/ui/Icons.js';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { ru } from 'date-fns/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { parseISO } from 'date-fns';

import dayjs from 'dayjs';

import { DialogActions, Button } from '@mui/material';

function CustomActionBar(props) {
  const { onAccept, onCancel, actions, className } = props;
  //const { onAccept, onClear, onCancel, onSetToday, actions, className } = props;
  return (
    <DialogActions className={className} style={{ paddingBottom: '7vw', paddingLeft: '7vw', paddingRight: '7vw', flexDirection: 'column' }}>
      {actions.includes('cancel') && (
        <Button
          onClick={onCancel}
          sx={{
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: 100,
            color: 'black',
            width: '100%',
            marginBottom: '3vw',
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
            marginLeft: '0px!important',
            '&:hover': { backgroundColor: '#cc0033' },
          }}
        >
          Выбрать
        </Button>
      )}
    </DialogActions>
  );
}

export default function ProfileMobile({ city, this_module }) {
  const [date, setDate] = useState();

  //const [userDate, setUserDate] = useState('');
  const [isSpam, setIsSpam] = useState(0);
  
  const [setActiveProfileModal, setUser, userInfo, getUserInfo, updateUser] = useProfileStore((state) => [state.setActiveProfileModal, state.setUser, state.userInfo, state.getUserInfo, state.updateUser]);
  const [token] = useHeaderStoreNew( state => [ state?.token] )

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      name: '',
      // fam: '',
      mail: '',
      login: '',
    },
  });

  const now = new Date();
  const minDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
  const maxDate = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());

  useEffect(() => {

    setValue('name', userInfo?.name ?? '');
    // setValue('fam', userInfo?.fam ?? '');
    setValue('mail', userInfo?.mail ?? '');
    setIsSpam(userInfo?.spam);
    //setUserDate( userInfo?.date_bir?.length ? userInfo?.date_bir.toLowerCase() : '');

    if( userInfo?.date_bir_full ){
      setDate( parseISO(userInfo?.date_bir_full) );
    }

  }, [setValue, userInfo]);

  useEffect(() => {
    if( token && token?.length > 0 ) {
      getUserInfo(this_module, city, token);
    }
  }, [token]);

  function saveMainData() {
    let userData = getValues();

    userInfo.name = userData?.name;
    // userInfo.fam = userData?.fam;
    userInfo.mail = userData?.mail;

    setUser(userInfo);

    updateUser(this_module, city, token);
  }

  function changeOtherData(type, data){
    userInfo[ [type] ] = data === true ? 1 : 0;

    setUser(userInfo);

    setIsSpam(data === true ? 1 : 0);

    updateUser(this_module, city, token);
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

      //   <span className={userDate ? 'itemSpan' : 'itemSpan notDate'}>
      //   {userDate ? userDate : 'Дата рождения'}
      // </span>
      // {userDate ? (
      //   <LockMobile />
      // ) : (
      //   <div className="dateText">Подарим промокод ко дню рождения</div>
      // )}

  //onClick={() => userDate ? /*setActiveProfileModal(true, 'date_change')*/ () => {} : setActiveProfileModal(true, 'date_first')}

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
        {/* <div className="dataItem profileMain">
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
        </div> */}
        <div className="dataItem profileMain" /*onClick={() => setActiveProfileModal(true, 'phone')}*/>
          <span className="itemSpan">{userInfo?.login ?? ''}</span>
          <LockMobile />
        </div>
        <div className="dataItem_ profileMain_">
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
              inputFormat="d MMMM yyyy"
              minDate={minDate}
              maxDate={maxDate}
              disabled={ userInfo?.date_bir_full ? true : false }
              onAccept={ (newValue) => setUserDate(newValue, userInfo) }
              shouldRespectLeadingZeros={true}
              onClose={() => {
                document.activeElement.blur();
              }}
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
                    borderRadius: '5vw', // задаём нужный radius
                    width: '20vw', // Ширина
                  },
                },
                textField: {
                  placeholder: "День рождения", // Добавляем placeholder
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        //backgroundColor: 'red',
                        borderWidth: 0, // Толстый бордер
                        //borderColor: 'rgba(0, 0, 0, 0.23)',  // Цвет бордера
                      },
                      //borderRadius: '100px', // Скругление
                    },
                    '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                      borderColor: 'transparent', // любой цвет
                    },
                    '& .MuiOutlinedInput-input': {
                      fontWeight: 500,
                      userSelect: 'none',
                      WebkitUserSelect: 'none',  // Safari
                      MozUserSelect: 'none',     // Firefox
                      msUserSelect: 'none',
                    }
                    
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
          { !userInfo?.date_bir_full ? <div className="dateText">Подарим промокод ко дню рождения</div> : <LockMobile /> }
          
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
                autoComplete="off"
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
