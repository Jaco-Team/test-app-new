import { useState } from 'react';
import { shallow } from 'zustand/shallow';

import { useRouter } from 'next/router';
import Image from 'next/image';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { roboto } from '@/ui/Font.js';
import { IconClose } from '@/ui/Icons.js';
import { Fade } from '@/ui/Fade.js';
import { useHeaderStore } from '@/components/store.js';
import { useCitiesStore } from '@/components/store.js';

export default function ModalCity() {

  const { push } = useRouter();

  const [thisCityList, thisCityRu, setThisCityRu] = useCitiesStore((state) => [state.thisCityList, state.thisCityRu, state.setThisCityRu], shallow);

  const [openCityModal, setActiveModalCity] = useHeaderStore((state) => [state.openCityModal, state.setActiveModalCity], shallow);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const openMenu = (event) => setAnchorEl(event.currentTarget);

  const chooseCity = (id) => {
    
    const city = thisCityList.find(city => city.id === id);
    
    push(`/${city.link}`);
    
    setThisCityRu(city.name);
    
    setAnchorEl(null);
    
    setActiveModalCity(false);
   
  }

  return (
    <Dialog
      onClose={() => setActiveModalCity(false)}
      className={'modalOpenCity ' + roboto.variable}
      open={openCityModal}
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={openCityModal} style={{ overflow: 'auto' }}>
        <Box className={'modalCity '}>
          <IconButton style={{ position: 'absolute', top: -50, left: 10, backgroundColor: 'transparent' }} onClick={() => setActiveModalCity(false)}>
            <IconClose style={{ width: 35, height: 35, overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)' }} />
          </IconButton>

          <div className="loginIMG">
            <Image alt="Город" src="/Favikon.png" width={240} height={240} priority={true}/>
          </div>

          <div className="loginHeader">
            <Typography component="h2">Вы в городе</Typography>
          </div>

          <div className="loginCity">
            <Typography component="h1">{thisCityRu}</Typography>
          </div>

          <Button className={'active'} onClick={() => setActiveModalCity(false)}>
            <Typography variant="h5" component="span">Да, верно</Typography>
          </Button>

          <Button className={'chooseCity'} onClick={openMenu} endIcon={<KeyboardArrowDownIcon />}>
            <Typography variant="h5" component="span">Нет, выберу город</Typography>
          </Button>

          <Menu id={'chooseCityModal'} anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
            {thisCityList.map((city, key) => <MenuItem key={key} onClick={() => chooseCity(city.id)}>{city.name}</MenuItem>)}
          </Menu>
        </Box>
      </Fade>
    </Dialog>
  );
}
