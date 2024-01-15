import React, { useState, useRef, useEffect } from 'react';

import Link from 'next/link';

import { useContactStore, useCitiesStore, useHeaderStore } from '@/components/store.js';

import { MapPointIcon } from '@/ui/Icons.js';

import { YMaps, Map, Placemark, Polygon } from '@pbe/react-yandex-maps';

import Box from '@mui/material/Box';
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
export default function ContactsPagePC() {

  const ref = useRef();

  const [thisCityList, thisCityRu, setThisCityRu, setThisCity] = useCitiesStore((state) => [state.thisCityList, state.thisCityRu, state.setThisCityRu, state.setThisCity]);

  const [myAddr, phone, disablePointsZone, disable, center_map, zones, getMap, points_zone, changePointClick, changePointNotHover] = useContactStore((state) => [
    state.myAddr, state.phone, state.disablePointsZone, state.disable, state.center_map, state.zones, state.getMap, state.points_zone, state.changePointClick, state.changePointNotHover]);

  const [activePage] = useHeaderStore((state) => [state.activePage]);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const chooseCity = (city) => {
    localStorage.setItem('setCity', JSON.stringify(city));
    setThisCityRu(city.name);
    setThisCity(city.link);
    setAnchorEl(null);
    getMap(activePage, city.link);
  };

  useEffect(() => {
    if(ref.current && center_map?.center){
      ref.current.setCenter([zones[0].xy_center_map['latitude'], zones[0].xy_center_map['longitude']]);
    }
  }, [zones])

  return (
    <Box className="Contact_" sx={{ display: { xs: 'none', md: 'none', lg: 'block' } }}>
      <div className="Contact">
        <Button className="chooseCity" onClick={(event) => setAnchorEl(event.currentTarget)} endIcon={<KeyboardArrowDownIcon />}>
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
              <ListItemButton key={key} disableRipple={false} onClick={() => changePointClick(point.addr)}>
                <MapPointIcon />
                <ListItemText primary={
                    <Typography style={{color: point?.color ? point.color : null}}>
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

      {!center_map ? null :
        <div style={{ minHeight: '68.231046931408vw', width: '100%' }} >
          <YMaps query={{ lang: 'ru_RU', apikey: 'f600fbbd-6500-4bf7-a0ab-ec9336f6c7d8' }}>
            <Map 
              defaultState={center_map} 
              instanceRef={ref} 
              width="100%" 
              height="100%" 
              style={{ minHeight: '68.231046931408vw' }}
              onClick={(event) => changePointNotHover(event)}
            >

              {zones?.map((point, key) => (
                  <Placemark key={key}
                    geometry={[point.xy_point.latitude, point.xy_point.longitude]}
                    options={{ 
                      iconLayout: point.image, 
                      iconImageHref: '/Favikon.png', 
                      iconImageSize: [65, 65], 
                      iconImageOffset: [-12, -20], 
                    }} 
                    onClick={() => changePointClick(point.addr)}
                  />
                ))
              }

              {points_zone?.map((point, key) => (
                  <Polygon key={key}
                    geometry={[point.zone]}
                    options={point.options}
                    onClick={() => changePointClick(point.addr)}
                  />
                ))
              }

            </Map>
          </YMaps>
        </div>
      }

    </Box>
  );
}
