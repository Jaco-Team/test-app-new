import { useState } from 'react';

import { useRouter } from 'next/router';

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
import { useHeaderStoreNew, useCitiesStore } from '@/components/store.js';

import Cookies from 'js-cookie';
import { setLocalStorageItem } from '@/utils/browserStorage';
import { switchCity } from '@/utils/switchCity';

export default function ModalCityPC() {
  const router = useRouter();

  const [thisCityList, thisCityRu] = useCitiesStore((state) => [
    state.thisCityList,
    state.thisCityRu,
  ]);
  const [openCityModal, setActiveModalCity] = useHeaderStoreNew((state) => [
    state?.openCityModal,
    state?.setActiveModalCity,
  ]);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const openMenu = (event) => setAnchorEl(event.currentTarget);

  const rightCity = () => {
    setActiveModalCity(false);
    const city = thisCityList.find((city) => city.name === thisCityRu);
    setLocalStorageItem('setCity', JSON.stringify(city));
    Cookies.set('city', city?.link || '', {
      expires: 365,
      path: '/',
      sameSite: 'Lax',
    });
  };

  const chooseCity = async (city) => {
    if (await switchCity(city, router)) {
      setAnchorEl(null);
      setActiveModalCity(false);
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
        <Box component="div" className="modalCityPC">
          <IconButton
            className="closeButton"
            onClick={() => setActiveModalCity(false)}
          >
            <IconClose />
          </IconButton>

          <div
            className={
              'loginIMG' + (thisCityRu?.length > 12 ? ' loginIMG--long' : '')
            }
          >
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
            <Typography component="span">Вы в городе</Typography>
          </div>

          <div
            className={
              'loginCity' + (thisCityRu?.length > 12 ? ' loginCity--long' : '')
            }
          >
            <Typography component="span">{thisCityRu}</Typography>
          </div>

          <Button className="buttons" onClick={rightCity}>
            <Typography variant="h5" component="span">
              Да, верно
            </Typography>
          </Button>

          <Button
            className="buttons choose"
            onClick={openMenu}
            endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            style={{ backgroundColor: open ? 'rgba(0, 0, 0, 0.05)' : '#fff' }}
          >
            <Typography variant="h5" component="span">
              Нет, выберу город
            </Typography>
          </Button>

          <Menu
            id={'chooseCityModal'}
            className={roboto.variable}
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
          >
            {thisCityList.map((city, key) => (
              <MenuItem key={key} onClick={() => chooseCity(city)}>
                {city.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
