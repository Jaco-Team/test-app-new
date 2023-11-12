import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import { useContactStore, useCitiesStore, useHeaderStore } from '@/components/store.js';

import { MapPointIcon } from '@/ui/Icons.js';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';


import MySwitch from '@/ui/Switch.js';
export default function ContactsPagePC({ city }) {
  const [thisCityList, thisCityRu, setThisCityRu] = useCitiesStore((state) => [state.thisCityList, state.thisCityRu, state.setThisCityRu]);

  const [getData, myAddr, phone, disablePointsZone, disable, chooseAddr] = useContactStore((state) => [
    state.getData, state.myAddr, state.phone, state.disablePointsZone, state.disable, state.chooseAddr, state.myMap]);

  const [activePage] = useHeaderStore((state) => [state.activePage]);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const openMenu = (event) => {
    //setActiveModalCity(true); // временно, чтобы открыть модалку города

    setAnchorEl(event.currentTarget); // временно, чтобы открыть модалку города
  };

  const chooseCity = (city) => {
    setThisCityRu(city.name);

    setAnchorEl(null);

    getData(activePage, city.link);
  };

  useEffect(() => {
    //getData('contacts', city);
  }, []);

  return (
    <Box className="Contact_" sx={{ display: { xs: 'none', md: 'none', lg: 'block' } }}>
      <div className="Contact">
        <Button className="chooseCity" onClick={openMenu} endIcon={<KeyboardArrowDownIcon />}>
          <Typography variant="h5" component="span">
            {thisCityRu}
          </Typography>
        </Button>

        <Menu id="chooseCityContact" anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          {thisCityList.map((city, key) => (
            <MenuItem key={key}>
              <Link href={`/${city.link}/${activePage}`} onClick={() => chooseCity(city)}>
                {city.name}
              </Link>
            </MenuItem>
          ))}
        </Menu>

        <div className="listAddrPoint">
          <Typography variant="h5" component="h2">Адреса кафе:</Typography>
          <List>
            {myAddr.map((point, key) => (
              <ListItemButton key={key} disableRipple={false} onClick={() => chooseAddr(point.id)}>
                <MapPointIcon />
                <ListItemText primary={
                    <Typography style={{color: point?.color ? point.color ? point.color : null : null}}>
                      {point.addr}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </List>
          <Divider />
        </div>

        <div className="listInfo">
          <Typography variant="h5" component="span">
            Телефон для заказа
          </Typography>
          <Typography variant="h5" component="h2">
            {phone}
          </Typography>
          <Typography variant="h5" component="span">
            Работаем ежедневно
          </Typography>
          <Typography variant="h5" component="h2">
            10:00 - 21:30
          </Typography>
          <Divider />
        </div>

        <div className="switch">
          <Typography variant="h5" component="span">Показать зону доставки</Typography>
          <MySwitch checked={disable} onClick={disablePointsZone} />
        </div>
      </div>

      <Grid item xs={12} id="ForMap">
        <div style={{width: '100%', height: '100%', marginRight: 12, backgroundColor: '#e5e5e5' }}/>
      </Grid>
    </Box>
  );
}
