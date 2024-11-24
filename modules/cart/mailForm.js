import { useState } from 'react';

import {useCartStore, useHeaderStore, useProfileStore } from '@/components/store.js';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';

import { IconClose } from '@/ui/Icons';
import { roboto } from '@/ui/Font.js';
import MyTextInput from '@/ui/MyTextInput';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';

export default function MailForm({cityName}) {
  // console.log('render MailForm');

  const [mail, setMail] = useState('');

  const [userInfo, setUser, updateUser] = useProfileStore((state) => [state.userInfo, state.setUser, state.updateUser]);
  const [matches, token] = useHeaderStore((state) => [state?.matches, state?.token]);
  const [openMailForm, setMailForm] = useCartStore((state) => [state.openMailForm, state.setMailForm]);

  const changeMail = (event) => {
    if(event === '') {
      setMail(event);
    } else {
      const mail = event?.target?.value ?? event;
      setMail(mail);
    }
  }

  const saveData = () => {
    userInfo.mail = mail;

    setUser(userInfo);

    updateUser('profile', cityName, token);

    handleClose();
  }

  const handleClose = () => {
    setMail('');
    setMailForm(false);
  }

  return (
    <>
      {matches ? (
        <SwipeableDrawer
          anchor={'bottom'}
          open={openMailForm}
          onClose={handleClose}
          onOpen={() => setMailForm(true)}
          className={'cartMailFormMobile ' + roboto.variable}
          disableSwipeToOpen
        >
          <div className="container">

            <div className="line" />
            <span className="mailHeader">Введите</span>
            <span className="mailHeader mailHeader_2">электронную почту</span>

            <span className="mailText">Электронная почта необходима для онлайн оплаты</span>
            <span className="mailText mailText_2">На электронную почту будет направлен чек об оплате</span>

            <div className="mailInput">
              <MyTextInput
                autoFocus
                placeholder="электронная @ почта"
                func={(event) => changeMail(event)}
                value={mail}
                type="email"
                className="mail"
                autoComplete="off"
              />
            </div>

            <Button className="mailButton" variant="contained" onClick={saveData}>
              <span>Сохранить</span>
            </Button>

          </div>
        </SwipeableDrawer>
      ) : (
        <Dialog
          onClose={handleClose}
          className={'cartMailFormPC ' + roboto.variable}
          open={openMailForm}
          slots={Backdrop}
          slotProps={{ timeout: 500 }}
        >
          <DialogContent>
            <IconButton className="closeButton" onClick={handleClose}>
              <IconClose />
            </IconButton>
              
            <span className="mailHeader mailHeader_2">Введите</span>
            <span className="mailHeader mailHeader_3">электронную почту</span>

            <span className="mailText">Электронная почта необходима для онлайн оплаты</span>
            <span className="mailText">На электронную почту будет направлен чек об оплате</span>

            <div className='mailInput'>
              <MyTextInput
                 autoFocus
                 placeholder="электронная @ почта"
                 func={(event) => changeMail(event)}
                 value={mail}
                 type="email"
                 className="mail"
                 autoComplete="off"
              />
            </div>

            <button className="mailBTN" onClick={saveData}>Сохранить</button>

          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
