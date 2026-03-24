import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';

import { roboto } from '@/ui/Font.js';
import { useFooterStore } from '@/components/store.js';
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/browserStorage';

export default function ModalActiveVK_mobile() {
  const [links] = useFooterStore((state) => [state.links]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const city = getLocalStorageItem('setCity');
      const modalGroupVK = getLocalStorageItem('modalGoupVK');

      if( city && (!modalGroupVK || modalGroupVK.length == 0) ) {
        setOpen(true);
      }
    }
  }, []);

  function closeModal() {
    setLocalStorageItem('modalGoupVK', 'show');
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

        <div className="loginHeader">
          <Typography component="span">Подпишитесь на <a href={links?.link_vk ?? ''} target='_blank'>нашу группу Вконтакте</a>, где мы рассказываем о новинках, проводим конкурсы и разыгрываем вкусные призы.</Typography>
        </div>

        <a className="buttons" href={links?.link_vk ?? ''} target='_blank' onClick={closeModal}>Жако Вконтакте</a>
      </div>
    </SwipeableDrawer>
  );
}
