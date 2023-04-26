import React, { useState } from 'react';

import Script from 'next/script';
import Link from 'next/link';

import { useContactStore, useCitiesStore, useHeaderStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow';

import Meta from '@/components/meta.js';
import { MapPointIcon } from '@/ui/Icons.js';

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

import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const IOSSwitch = styled((props) => (<Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />))(({ theme }) => ({
  width: 70,
  height: 30,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(40px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#57DC35',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 26,
    height: 26,
  },
  '& .MuiSwitch-track': {
    borderRadius: 36 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export default function ContactsPage(props) {
  const { page } = props;

  const [thisCityList, thisCityRu, setThisCityRu] = useCitiesStore((state) => [state.thisCityList, state.thisCityRu, state.setThisCityRu], shallow);

  const [getData, myAddr, phone, disablePointsZone, disable, chooseAddr] = useContactStore((state) => [state.getData, state.myAddr, state.phone, state.disablePointsZone, state.disable, state.chooseAddr], shallow);

  const [activePage] = useHeaderStore((state) => [state.activePage], shallow);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const openMenu = (event) => setAnchorEl(event.currentTarget);

  const chooseCity = (id) => {
    const city = thisCityList.find((city) => city.id === id);

    setThisCityRu(city.name);

    setAnchorEl(null);

    getData(activePage, city.link);
  };

  return (
    <Meta title={page.title} description={page.description}>
      <Script src="https://api-maps.yandex.ru/2.1/?apikey=ae2bad1f-486e-442b-a9f7-d84fff6296db&lang=ru_RU" />

      {!myAddr.length ? null : 
      <Grid item lg={4} md={4} xl={4} sm={12} xs={12} className="Contact">

        <Button className='chooseCity' onClick={openMenu} endIcon={<KeyboardArrowDownIcon />}>
          <Typography variant="h5" component="span">{thisCityRu}</Typography>
        </Button>

        <Menu id='chooseCityContact' anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          {thisCityList.map((city, key) => (
            <MenuItem key={key}>
              <Link href={`/${city.link}/${activePage}`} onClick={() => chooseCity(city.id)}>
                <span>{city.name}</span>
              </Link>
            </MenuItem>
          ))}
        </Menu>

        <Grid item xs={12} sm={12} className="listAddrPoint">
          <Typography variant="h5" component="h2">Адреса кафе:</Typography>
          <List>
            {myAddr.map((point, key) => (
              <ListItemButton key={key} disableRipple={false} onClick={() => chooseAddr(point.id)}>
                <MapPointIcon style={{ width: '2vw', height: '2vw' }} />
                <ListItemText primary={<Typography style={{ color: point?.color ? point.color ? point.color : null : null }}>{point.addr}</Typography>}/>
              </ListItemButton>
            ))}
          </List>
          <Divider style={{ marginTop: 20, marginBottom: 40 }} />
        </Grid>

        <Grid item xs={12} sm={12} className="listInfo">
          <Typography variant="h5" component="span">Телефон для заказа</Typography>
          <Typography variant="h5" component="h2">{phone}</Typography>
          <Typography variant="h5" component="span">Работаем ежедневно</Typography>
          <Typography variant="h5" component="h2">с 10:00 до 21:30</Typography>
          <Divider style={{ marginTop: 40, marginBottom: 40 }} />
        </Grid>

        <Grid item xs={12} sm={12} className="switch">
          <Typography variant="h5" component="span">Показать зону доставки</Typography>
          <FormControlLabel control={<IOSSwitch checked={disable} onClick={disablePointsZone}/>}/>
        </Grid>

      </Grid>
      }

      <Grid item lg={8} md={8} xl={8} sm={12} xs={12} id="ForMap">
        <div style={{ width: '100%', height: '100%', marginRight: 12, backgroundColor: '#e5e5e5' }}/>
      </Grid>
    </Meta>
  );
}
