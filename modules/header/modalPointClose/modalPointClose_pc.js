import React from 'react';

import Image from 'next/image';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import { roboto } from '@/ui/Font.js';
import { IconClose } from '@/ui/Icons.js';
import { useHeaderStore } from '@/components/store.js';

export default function ModalPointClose_pc() {

  const [showClosePoint, setShowClosePoint] = useHeaderStore((state) => [state.showClosePoint, state.setShowClosePoint]);

  function closeModal() {
    setShowClosePoint(false)
  }

  return (
    <Dialog
      onClose={closeModal}
      className={'modalVKPCMain ' + roboto.variable}
      open={showClosePoint}
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
            <Typography component="span">Подпишитесь на, где мы рассказываем о новинках, проводим конкурсы и разыгрываем вкусные призы.</Typography>
          </div>

          <a className="buttons"  target='_blank' onClick={closeModal}>Жако Вконтакте</a>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
