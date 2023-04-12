import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import { useAkciiStore } from '@/components/store.js';

import { roboto } from '@/ui/Font.js'
import { IconClose } from '@/ui/Icons.js'
import { Fade } from '@/ui/Fade.js'

export default React.memo(function AkciiModal(){
  //onClick={activePromo.bind(this, showItem.info, showItem.promo)}
  
  const [ actiaModal, setActiaModal ] = useState({});
  const [ modalOpen, setModalOpen ] = useState(false);

  let [ openAkcia, openModal, closeAktia ] = useAkciiStore((state) => [state.openAkcia, state.openModal, state.closeAktia])

  useEffect(() => {
    setActiaModal(openAkcia)
    setModalOpen(openModal);
  }, [openAkcia, openModal]);

  function closeDialog(){
    closeAktia();

    let state = {  },
      title = '',
      url = window.location.pathname;

    window.history.pushState(state, title, url)
  }

  /*{actiaModal !== {} && actiaModal.promo && actiaModal?.promo.length > 0 ?
            <DialogActions style={{ justifyContent: 'center', padding: '15px 0px' }}>
              <ButtonGroup disableElevation={true} disableRipple={true} variant="contained">
                <Button variant="contained" className="AkciiActivePromo" >Применить промокод</Button>
              </ButtonGroup>
            </DialogActions>
              :
            null
          }*/

  return (
    <Dialog 
      onClose={ () => closeDialog() } 
      className={"modalActii "+roboto.variable} 
      open={ modalOpen }
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={ modalOpen } style={{ overflow: 'auto' }}>
        <Box>
          <IconButton style={{ position: 'absolute', top: -43, right: 10 }} onClick={ () => closeDialog() }>
            <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
          </IconButton>

          <DialogTitle style={{ margin: 0, padding: 8 }}>
            {actiaModal?.promo_title ?? ''}
          </DialogTitle> 
            
          <DialogContent className="modalActiiContent">
            <div dangerouslySetInnerHTML={{__html: actiaModal?.text ?? ''}} />
          </DialogContent>

          
        </Box>
      </Fade>
    </Dialog>
  )
})