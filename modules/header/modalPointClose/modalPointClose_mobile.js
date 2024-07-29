import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';

import { useCartStore, useHeaderStore } from '@/components/store.js';

import { roboto } from '@/ui/Font.js';

export default function ModalPointClose_mobile() {
  const [ checkFreeDrive, show_checkFreeDrive ] = useCartStore( state => [ state.checkFreeDrive, state.show_checkFreeDrive ] );

  const [open, setOpen] = useState(false);
  const [ token ] = useHeaderStore( state => [ state.token ] );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if( localStorage.getItem('setCity') && (!localStorage.getItem('free_drive') || localStorage.getItem('free_drive').length == 0) ) {
        checkFreeDrive(token);
      }
    }
  }, []);

  useEffect(() => {
    if( show_checkFreeDrive === true ) {
      setOpen(true);
    }
  }, [show_checkFreeDrive]);

  function closeModal() {
    localStorage.setItem('free_drive', 'show');
    setOpen(false);
  }

  return (
    <SwipeableDrawer
      anchor={'bottom'}
      open={open}
      onClose={closeModal}
      onOpen={() => {}}
      id="modalVKMobileMain"
      className={roboto.variable}
      disableSwipeToOpen
    >
      <div className="ContainerMain">
        <div className="loginIMG">
          <Image alt="Город" src="/Favikon.png" width={240} height={240} priority={true}/>
        </div>

        <div className="loginHeader" style={{ textAlign: 'center' }}>
          <Typography component="span">С 1 августа в кафе на ул. Победы 10 проводятся ремонтные работы.<br />Зал и самовывоз пока не работают, но для вас мы сделали бесплатную доставку.<br />Спасибо за понимание!</Typography>
        </div>
      </div>
    </SwipeableDrawer>
  );
}
