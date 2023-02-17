import React, { useEffect, useState } from 'react';

import Link from 'next/link'
import Image from 'next/image';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import { roboto } from '../../ui/Font.js'
import { IconClose } from '../../ui/Icons.js'
import AccountIcon from '../../public/account-icon-240x240.png'
import { Fade } from '../../ui/Fade.js'
import { useHeaderStore } from '../../components/store.js';
import { useCitiesStore } from '../../components/store.js';

export default React.memo(function ModalCity(){
  
  const [ modalOpen, setModalOpen ] = useState(false);
  const { thisCity, thisCityList } = useCitiesStore( state => state );
  const { openCityModal, setActiveModalCity } = useHeaderStore( state => state );

  function getNewLink(city){
    if (typeof window !== 'undefined') {
      let this_addr = window.location.pathname;
      return this_addr.replace(thisCity, city);
    }else{
      return '';
    }
  }

  function chooseCity(){
    setActiveModalCity(false)

    setTimeout(()=>{ 
      window.location.reload(); 
    }, 300)
  }

  console.log(' load ModalCity')

  useEffect( () => {
    setModalOpen(openCityModal);
  }, [openCityModal] )

  return (
    <Dialog 
      onClose={ () => setActiveModalCity(false) }
      className={"modalOpenCity "+roboto.variable} 
      open={ modalOpen }
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={ modalOpen } style={{ overflow: 'auto' }}>
        <Box className={'modalCity '}>
          <IconButton style={{ position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent' }} onClick={ () => setActiveModalCity(false) }>
            <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
          </IconButton>

          <div className='loginIMG'>
            <Image alt="Город" src={AccountIcon} width={180} height={180} priority={true}/>
          </div>
            
          <div className='loginHeader'>
            <Typography component="h2">Выберите город</Typography>
          </div>

          {thisCityList.map((item, key) => 
            <Link 
              key={key} 
              className={ thisCity == item.link ? 'active' : '' } 
              href={ getNewLink(item.link) } 
              onClick={ () => chooseCity() }
            >
              <Typography variant="h5" component="span" className={"ModalLabel"}>{item.name}</Typography>
            </Link> 
          )}
          
        </Box>
      </Fade>
    </Dialog>
  )
})