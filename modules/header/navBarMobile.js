import React, { useState } from 'react';

import Link from 'next/link'
import Image from 'next/image';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { BurgerIcon } from '../../ui/Icons.js'
import JacoLogoMini from '../../public/Logomini.png'
import { roboto } from '../../ui/Font.js'

import { shallow } from 'zustand/shallow'

import { useHeaderStore } from '../../components/store.js';

export default React.memo(function NavBarMobile(props){
  
  const { city, cityRu } = props;

  const [ activeMenu, setActiveMenu ] = useState(false);
  const [ token, setToken ] = useState('');

  const { setActiveModalCity, setActiveModalAuth } = useHeaderStore( state => state, shallow );

  console.log( 'render navbar mobile' )

  if( city == '' ){
    return null;
  }

  return (
    <AppBar position="fixed" className='headerNewMobile' id='headerNewMobile' elevation={2} sx={{ display: { xs: 'block', md: 'none' } }}>
      <Toolbar>
        <Link href={"/"}>
          <Image alt="Жако доставка роллов и пиццы" src={JacoLogoMini} width={40} height={40} priority={true} />
        </Link> 

        <React.Fragment>
          <BurgerIcon onClick={ () => setActiveMenu(true) } style={{ padding: 20, marginRight: -20 }} />
          <SwipeableDrawer
            anchor={'right'}
            open={activeMenu}
            onClose={() => setActiveMenu(false)}
            onOpen={() => setActiveMenu(true)}
          >
            <List className={'LinkList '+roboto.variable}>
              <ListItem disablePadding onClick={ () => { setActiveModalCity(true); setActiveMenu(false); } }>
                <a>{cityRu}</a> 
              </ListItem>
              <ListItem disablePadding onClick={ () => setActiveMenu(false) }>
                <Link href={"/"+city}>Меню</Link> 
              </ListItem>
              <ListItem disablePadding onClick={ () => setActiveMenu(false) }>
                <Link href={"/"+city+"/akcii"}>Акции</Link> 
              </ListItem>
              { token.length == 0 ? 
                <ListItem disablePadding onClick={ () => { setActiveMenu(false); setActiveModalAuth(true); } }>
                  <a>Профиль</a> 
                </ListItem>
                  :
                <ListItem disablePadding onClick={ () => setActiveMenu(false) }>
                  <Link href={"/"+city+"/profile"}>Профиль</Link> 
                </ListItem>
              }
              <ListItem disablePadding onClick={ () => setActiveMenu(false) }>
                <Link href={"/"+city+"/contacts"}>Контакты</Link> 
              </ListItem>
            </List>
          </SwipeableDrawer>
        </React.Fragment>
      </Toolbar>
    </AppBar>
  )
})