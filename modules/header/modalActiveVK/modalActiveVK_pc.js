import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import { roboto } from '@/ui/Font.js';
import { IconClose } from '@/ui/Icons.js';
import { useFooterStore } from '@/components/store.js';

export default function ModalActiveVK_pc() {

  const [links] = useFooterStore((state) => [state.links]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if( localStorage.getItem('setCity') && (!localStorage.getItem('modalGoupVK') || localStorage.getItem('modalGoupVK').length == 0) ) {
        setOpen(true);
      }
    }
  }, []);

  function closeModal() {
    localStorage.setItem('modalGoupVK', 'show');
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

          <div className="loginHeader">
            <Typography component="span">Подпишитесь на <a href={links?.link_vk ?? ''} target='_blank'>нашу группу Вконтакте</a>, где мы рассказываем о новинках, проводим конкурсы и разыгрываем вкусные призы.</Typography>
          </div>

          <a className="buttons" href={links?.link_vk ?? ''} target='_blank' onClick={closeModal}>Жако Вконтакте</a>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
