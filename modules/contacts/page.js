import React, { useState } from 'react';

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
  width: '4.2vw',
  height: '2.1vw',
  borderRadius: '2vw',
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: '0.1vw',
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(2.1vw)',
      color: '#fff',
      marginTop: '0.1vw',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#57DC35',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
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
    //paddingTop: '0.1vw',
    boxSizing: 'border-box',
    width: '1.9vw',
    height: '1.9vw',
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

    setAnchorEl(null);

    setThisCityRu(city.name)
    getData(activePage, city.link);
  };

  return (
    <Meta title={page.title} description={page.description}>
      
      <div className="Contact_">
        <div className="Contact">

          <Button className='chooseCity' onClick={openMenu} endIcon={<KeyboardArrowDownIcon />}>
            <Typography variant="h5" component="span">{thisCityRu}</Typography>
          </Button>

          <Menu id='chooseCityContact' anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
            {thisCityList.map((city, key) => (
              <MenuItem key={key}>
                <Link href={`/${city.link}/${activePage}`} onClick={() => chooseCity(city.id)}>{city.name}</Link>
              </MenuItem>
            ))}
          </Menu>

          <div className="listAddrPoint">
            <Typography variant="h5" component="h2">Адреса кафе:</Typography>
            <List>
              {myAddr.map((point, key) => (
                <ListItemButton key={key} disableRipple={false} onClick={() => chooseAddr(point.id)}>
                  <MapPointIcon style={{ width: '2vw', height: '2.4vw' }} />
                  <ListItemText primary={<Typography style={{ color: point?.color ? point.color ? point.color : null : null }}>{point.addr}</Typography>}/>
                </ListItemButton>
              ))}
            </List>
            <Divider />
          </div>

          <div className="listInfo">
            <Typography variant="h5" component="span">Телефон для заказа</Typography>
            <Typography variant="h5" component="h2">{phone}</Typography>
            <Typography variant="h5" component="span">Работаем ежедневно</Typography>
            <Typography variant="h5" component="h2">10:00 - 21:30</Typography>
            <Divider />
          </div>

          <div className="switch">
            <Typography variant="h5" component="span">Показать зону доставки</Typography>
            <FormControlLabel control={<IOSSwitch checked={disable} onClick={disablePointsZone}/>}/>
          </div>

        </div>
        

        <Grid item xs={12} id="ForMap">
          <div style={{ width: '100%', height: '100%', marginRight: 12, backgroundColor: '#e5e5e5' }}/>
        </Grid>
      </div>
    </Meta>
  );
}
