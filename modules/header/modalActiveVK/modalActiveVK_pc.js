import React, { useEffect, useState } from 'react';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import { roboto } from '@/ui/Font.js';
import { IconClose } from '@/ui/Icons.js';
import { useFooterStore } from '@/components/store.js';
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/browserStorage';

export default function ModalActiveVK_pc() {

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
    <Dialog
      onClose={closeModal}
      className={'modalVKPCMain ' + roboto.variable}
      open={open}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
    >
      <DialogContent>
        <Box component="div" className='modalCityPC'>
          <IconButton className='closeButton' onClick={closeModal}>
            <IconClose/>
          </IconButton>

          <div className="loginIMG" style={{  marginBottom: '2.5270758122744vw' }}>
            <img
              alt="Город"
              src="/Favicon_city.png"
              width={240}
              height={240}
              loading="eager"
              decoding="async"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/jaco-logo-mobile.png';
              }}
            />
          </div>

          <div className="loginHeader">
            <Typography component="span">Подпишитесь на <a href={links?.link_vk ?? ''} target='_blank'>нашу группу Вконтакте</a>, где мы рассказываем о новинках, проводим конкурсы и разыгрываем вкусные призы.</Typography>
          </div>

          <a className="buttons" href={links?.link_vk ?? ''} target='_blank' onClick={closeModal}>Жако Вконтакте</a>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
