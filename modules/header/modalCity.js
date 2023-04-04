import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { roboto } from '../../ui/Font.js';
import { IconClose } from '../../ui/Icons.js';
import { Fade } from '../../ui/Fade.js';
import { useHeaderStore } from '../../components/store.js';
import { useCitiesStore } from '../../components/store.js';

import { shallow } from 'zustand/shallow';

import Button from '@mui/material/Button';

export default React.memo(function ModalCity() {
  const [modalOpen, setModalOpen] = useState(false);
  const [thisCity, thisCityList, thisCityRu] = useCitiesStore(
    (state) => [state.thisCity, state.thisCityList, state.thisCityRu],
    shallow
  );
  const [openCityModal, setActiveModalCity] = useHeaderStore(
    (state) => [state.openCityModal, state.setActiveModalCity],
    shallow
  );

  // function getNewLink(city){
  //   if (typeof window !== 'undefined') {
  //     let this_addr = window.location.pathname;
  //     return this_addr.replace(thisCity, city);
  //   }else{
  //     return '';
  //   }
  // }

  // function chooseCity(){
  //   setActiveModalCity(false)

  //   setTimeout(()=>{
  //     window.location.reload();
  //   }, 300)
  // }

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  console.log(thisCityRu);

  useEffect(() => {
    setModalOpen(openCityModal);

    console.log(' load ModalCity useEffect');
  }, [openCityModal]);

  return (
    <Dialog
      onClose={() => setActiveModalCity(false)}
      className={'modalOpenCity ' + roboto.variable}
      open={modalOpen}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={modalOpen} style={{ overflow: 'auto' }}>
        <Box className={'modalCity '}>
          <IconButton
            style={{
              position: 'absolute',
              top: -40,
              left: 15,
              backgroundColor: 'transparent',
            }}
            onClick={() => setActiveModalCity(false)}
          >
            <IconClose
              style={{
                width: 25,
                height: 25,
                fill: '#fff',
                color: '#fff',
                overflow: 'visible',
              }}
            />
          </IconButton>

          <div className="loginIMG">
            <Image
              alt="Город"
              src="/Favikon.png"
              width={240}
              height={240}
              priority={true}
            />
          </div>

          <div className="loginHeader">
            <Typography component="h2">Вы в городе</Typography>
          </div>

          <div className="loginCity">
            <Typography component="h1">Самара</Typography>
            {/* <Typography component="h1">Комсомольск-на-Амуре</Typography> */}
          </div>

          <Button
            className={'active'}
            // href={ getNewLink(item.link) }
            // onClick={ () => chooseCity() }
            // variant='contained'
          >
            <Typography variant="h5" component="span">
              Да, верно
            </Typography>
          </Button>

<div className={'menuButton'}>

            <Button
              className={'chooseCity'}
              // href={ getNewLink(item.link) }
              // onClick={ () => chooseCity() }
              // variant='contained'
              onClick={handleClick}
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              endIcon={<KeyboardArrowDownIcon />}
            >
              <Typography variant="h5" component="span" >
                Нет, выберу город
              </Typography>
            </Button>

            <Menu
            // PaperProps={{sx: {width: '100%'}}}
            // selected
            // classes={{ paper: 'menu' }}
            keepMounted
            className={'menu'}
            // style={{ width: '' }}
             anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem  className={'menuItem'} onClick={handleClose}>Profile</MenuItem>
              <MenuItem className={'menuItem'} onClick={handleClose}>My account</MenuItem>
              <MenuItem className={'menuItem'} onClick={handleClose}>Logout</MenuItem>
            </Menu>
</div>

          {/* <div className='loginCity'>
          </div> */}

          {/* {thisCityList.map((item, key) => 
            <Link 
              key={key} 
              className={ thisCity == item.link ? 'active' : '' } 
              href={ getNewLink(item.link) } 
              onClick={ () => chooseCity() }
            >
              <Typography variant="h5" component="span" className={"ModalLabel"}>{item.name}</Typography>
            </Link> 
          )} */}
        </Box>
      </Fade>
    </Dialog>
  );
});
