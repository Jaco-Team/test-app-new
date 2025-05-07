import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';

import { useCartStore, useHeaderStoreNew } from '@/components/store.js';

import { roboto } from '@/ui/Font.js';

const datesToCheck = [
  '2025-05-07',
  '2025-05-08',
  '2025-05-09',
];

// 2. Получаем сегодняшнюю дату в том же формате
function getTodayString() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function ModalPointClose_mobile() {
  const [ checkFreeDrive, show_checkFreeDrive ] = useCartStore( state => [ state.checkFreeDrive, state.show_checkFreeDrive ] );

  const [open, setOpen] = useState(false);
  const [ token ] = useHeaderStoreNew( state => [ state?.token ] );

  const todayStr = getTodayString();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if( localStorage.getItem('setCity') && (!localStorage.getItem('7_9_may') || localStorage.getItem('7_9_may').length == 0) ) {
        if (datesToCheck.includes(todayStr)) {
          //checkFreeDrive(token);
          setOpen(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    if( show_checkFreeDrive === true ) {
      setOpen(true);
    }
  }, [show_checkFreeDrive]);

  function closeModal() {
    localStorage.setItem('7_9_may', 'show');
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
      <div className="ContainerMain_1">
        <div className="loginIMG">
          <Image alt="Город" src="/Favikon.png" width={240} height={240} priority={true}/>
        </div>

        <div className="loginHeader" style={{ textAlign: 'center' }}>
          <Typography component="span">Возможны сбои в работе сайта, кафе и доставки.<br /><br />Уважаемые клиенты! С 7 по 9 мая 2025 года возможны ограничения мобильного интернета на фоне проведения мероприятий, посвященных 80-летию Победы. Это может отразиться на стабильности работы сайта, доставки и оплаты в кафе.<br />Спасибо за понимание!</Typography>
        </div>
      </div>
    </SwipeableDrawer>
  );
}
