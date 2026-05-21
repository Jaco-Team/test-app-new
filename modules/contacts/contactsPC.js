import React, { useState, useRef, useEffect, useMemo } from 'react';

import Link from 'next/link';

import { useContactStore, useCitiesStore, useHeaderStoreNew } from '@/components/store.js';

import { MapPointIcon } from '@/ui/Icons.js';

import { YMaps, Map, Placemark, Polygon, SearchControl, ZoomControl } from '@pbe/react-yandex-maps';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';

import MySwitch from '@/ui/Switch.js';

import Cookies from 'js-cookie';
import { setLocalStorageItem } from '@/utils/browserStorage';
import { BREAKPOINTS } from '@/utils/breakpoints';

export default function ContactsPagePC() {

  const ref = useRef();

  const [thisCityList, thisCityRu, setThisCityRu, setThisCity] = useCitiesStore((state) => [state.thisCityList, state.thisCityRu, state.setThisCityRu, state.setThisCity]);

  const [myAddr, phone, disablePointsZone, disable, center_map, zones, getMap, points_zone, changePointClick, changePointNotHover] = useContactStore((state) => [
    state.myAddr, state.phone, state.disablePointsZone, state.disable, state.center_map, state.zones, state.getMap, state.points_zone, state.changePointClick, state.changePointNotHover]);

  const [activePage] = useHeaderStoreNew((state) => [state?.activePage]);

  const [anchorEl, setAnchorEl] = useState(null);
  const isTabletContacts = useMediaQuery(
    `screen and (min-width: ${BREAKPOINTS.tabletMin}px) and (max-width: ${BREAKPOINTS.tabletMax}px)`,
  );
  const mapHeight = isTabletContacts ? '85.9090909091vw' : '68.231046931408vw';
  const mapState = useMemo(() => {
    if (!center_map) {
      return null;
    }

    const tabletZoom = Math.min(center_map?.zoom ?? 11.5, 10.9);
    const tabletLngShift = 0.08;
    const nextCenter =
      isTabletContacts && Array.isArray(center_map?.center) && center_map.center.length === 2
        ? [center_map.center[0], center_map.center[1] + tabletLngShift]
        : center_map.center;

    return {
      ...center_map,
      center: nextCenter,
      zoom: isTabletContacts ? tabletZoom : center_map?.zoom,
    };
  }, [center_map, isTabletContacts]);

  const open = Boolean(anchorEl);

  const chooseCity = (city) => {
    setLocalStorageItem('setCity', JSON.stringify(city));
    Cookies.set('city', city?.link || '', { expires: 365, path: '/', sameSite: 'Lax' });
    setThisCityRu(city.name);
    setThisCity(city.link);
    setAnchorEl(null);
    getMap(activePage, city.link);
  };

  useEffect(() => {
    if(ref.current && mapState?.center){
      const centerDuration = mapState?.duration ?? 1000;

      if (isTabletContacts) {
        if (typeof ref.current.setCenter === 'function') {
          ref.current.setCenter(mapState.center, mapState.zoom, {
            duration: 700,
            timingFunction: 'ease-out',
            checkZoomRange: false,
          });
          return;
        }
      }

      ref.current.setCenter(mapState?.center, mapState?.zoom, {
        duration: centerDuration,
        timingFunction: 'ease-in-out',
      });
    }
  }, [mapState, isTabletContacts])

  return (
    <Box className="Contact_">
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
              <ListItemButton key={key} disableRipple onClick={() => changePointClick(point.addr)}>
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
        <div style={{ height: mapHeight, width: '100%' }} >
          <YMaps query={{ lang: 'ru_RU', apikey: process.env.NEXT_PUBLIC_YANDEX_TOKEN_MAP }}>
            <Map 
              defaultState={mapState} 
              instanceRef={ref}
              width="100%" 
              height={mapHeight}
              style={{ height: mapHeight }}
              onClick={(event) => changePointNotHover(event)}
            >
              <SearchControl options={{ float: "left" }} />
              <ZoomControl options={{ float: "left" }} />

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
              ))}

              {points_zone?.map((point, key) => (
                <Polygon key={key}
                  geometry={[point.zone]}
                  options={point.options}
                  onClick={() => changePointClick(point.addr)}
                />
              ))}

            </Map>
          </YMaps>
        </div>
      }

    </Box>
  );
}
