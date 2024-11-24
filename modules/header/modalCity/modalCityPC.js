import { useState } from 'react';

import { useRouter } from 'next/router';
import Image from 'next/image';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { roboto } from '@/ui/Font.js';
import { IconClose } from '@/ui/Icons.js';
import { useHeaderStore, useCitiesStore, useContactStore, useCartStore, useHomeStore } from '@/components/store.js';

export default function ModalCityPC() {

  const { push } = useRouter();

  const [thisCityList, thisCityRu, setThisCityRu, setThisCity] = useCitiesStore((state) => [state.thisCityList, state.thisCityRu, state.setThisCityRu, state.setThisCity]);
  const [openCityModal, setActiveModalCity, activePage] = useHeaderStore((state) => [state?.openCityModal, state?.setActiveModalCity, state?.activePage]);
  const [getMap] = useContactStore((state) => [state.getMap]);
  const [getNewPriceItems] = useCartStore( state => [state.getNewPriceItems] )
  const [resetFilter] = useHomeStore( state => [state.resetFilter] )

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const openMenu = (event) => setAnchorEl(event.currentTarget);

  const rightCity = () => {
    setActiveModalCity(false);
    const city = thisCityList.find((city) => city.name === thisCityRu);
    localStorage.setItem('setCity', JSON.stringify(city));
  };

  const chooseCity = (city) => {
    localStorage.setItem('setCity', JSON.stringify(city));
    setThisCityRu(city.name);
    setAnchorEl(null);
    setActiveModalCity(false);
    setThisCity(city.link);
    getNewPriceItems(city.link)
    getMap('contacts', city.link);
    resetFilter();

    if(activePage && activePage !== 'home') {
      push(`/${city.link}/${activePage}`);
    } else {
      push(`/${city.link}`);
    }
  };

  return (
    <Dialog
      onClose={() => setActiveModalCity(false)}
      className={'modalOpenCityPC ' + roboto.variable}
      open={openCityModal}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
    >
      <DialogContent>
        <Box component="div" className='modalCityPC'>
          <IconButton className='closeButton' onClick={() => setActiveModalCity(false)}>
            <IconClose/>
          </IconButton>

          <div className="loginIMG" style={{  marginBottom: thisCityRu?.length > 12 ? '1.0830324909747vw' : '2.5270758122744vw' }}>
            <Image alt="Город" src="/Favicon_city.png" width={240} height={240} priority={true}/>
          </div>

          <div className="loginHeader">
            <Typography component="span">Вы в городе</Typography>
          </div>

          <div className="loginCity" style={{  marginBottom: thisCityRu?.length > 12 ? '1.4440433212996vw' : '2.5270758122744vw', 
            height: thisCityRu?.length > 12 ? '4.6931407942238vw' : '2.1660649819495vw'}}>
            <Typography component="span">{thisCityRu}</Typography>
          </div>

          <Button className='buttons'  onClick={rightCity}>
            <Typography variant="h5" component="span">Да, верно</Typography>
          </Button>

          <Button className='buttons choose' onClick={openMenu} endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} 
            style={{  backgroundColor: open ? 'rgba(0, 0, 0, 0.05)' : '#fff'}}>
            <Typography variant="h5" component="span">Нет, выберу город</Typography>
          </Button>

          <Menu id={'chooseCityModal'} className={roboto.variable} anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
            {thisCityList.map((city, key) => <MenuItem key={key} onClick={() => chooseCity(city)}>{city.name}</MenuItem>)}
          </Menu>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
