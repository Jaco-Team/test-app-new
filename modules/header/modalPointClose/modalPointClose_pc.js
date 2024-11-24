import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import { useCartStore, useHeaderStoreNew } from '@/components/store.js';

import { roboto } from '@/ui/Font.js';
import { IconClose } from '@/ui/Icons.js';

export default function ModalPointClose_pc() {

  const [ checkFreeDrive, show_checkFreeDrive ] = useCartStore( state => [ state.checkFreeDrive, state.show_checkFreeDrive ] );
  const [ token ] = useHeaderStoreNew( state => [ state?.token ] );

  const [open, setOpen] = useState(false);

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
            <Image alt="Город" src="/Favicon_city.png" width={240} height={240} priority={true}/>
          </div>

          <div className="loginHeader" style={{ textAlign: 'center' }}>
            <Typography component="span">С 1 августа в кафе на ул. Победы 10 проводятся ремонтные работы.<br />Зал и самовывоз пока не работают, но для вас мы сделали бесплатную доставку.<br />Спасибо за понимание!</Typography>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
