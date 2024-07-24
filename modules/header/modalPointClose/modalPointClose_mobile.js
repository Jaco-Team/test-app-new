import React from 'react';

import Image from 'next/image';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';

import { roboto } from '@/ui/Font.js';
import { useHeaderStore } from '@/components/store.js';

export default function ModalPointClose_mobile() {
  const [showClosePoint, setShowClosePoint] = useHeaderStore((state) => [state.showClosePoint, state.setShowClosePoint]);

  function closeModal() {
    setShowClosePoint(false)
  }

  return (
    <SwipeableDrawer
      anchor={'bottom'}
      open={showClosePoint}
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

        <div className="loginHeader">
          <Typography component="span">Подпишитесь на, где мы рассказываем о новинках, проводим конкурсы и разыгрываем вкусные призы.</Typography>
        </div>

        <a className="buttons" target='_blank' onClick={closeModal}>Жако Вконтакте</a>
      </div>
    </SwipeableDrawer>
  );
}
