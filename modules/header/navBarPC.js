import React from 'react';

import Link from 'next/link'
import Image from 'next/image';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import JacoLogo from '../../public/jaco-logo.png'
import { shallow } from 'zustand/shallow'

import { useHeaderStore } from '../../components/store.js';

export default React.memo(function NavBarPC(props){
  
  const { city, cityRu, catList, active_page } = props;

  const [ setActiveModalCity, setActiveModalAuth ] = useHeaderStore( state => [state.setActiveModalCity, state.setActiveModalAuth], shallow );

  console.log( 'render navbar pc' )

  if( city == '' ){
    return null;
  }

  return (
    <AppBar position="fixed" className='headerNew' id='headerNew' elevation={2} sx={{ display: { xs: 'none', md: 'block' } }}>
      <Toolbar>
        <div style={{ width: '4.51%' }} />
        <Link href={"/"+city} style={{ width: '14.8%' }}>
          <Image alt="Жако доставка роллов и пиццы" src={JacoLogo} width={200} height={50} priority={true} />
        </Link> 
        <div style={{ width: '2.53%' }} />

        <a style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }} onClick={ () => setActiveModalCity(true) }>
          <span className={'headerCat'}>{cityRu}</span>
        </a>
        <div style={{ width: '0.36%' }} />

        { catList.map( (item, key) =>
          <React.Fragment key={key}>
            <Link href={"/"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}>
              <span className={'headerCat'}>{item.name}</span>
            </Link> 
            <div style={{ width: '0.36%' }} />
          </React.Fragment>
        ) }
        
        <Link href={"/"+city+"/akcii"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}>
          <span className={active_page == 'akcii' ? 'headerCat activeCat' : 'headerCat'}>Акции</span>
        </Link>
        <div style={{ width: '0.36%' }} />

        <Link href={"/"+city+"/profile"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }} onClick={ () => setActiveModalAuth(true) } >
          <span className={active_page == 'profile' ? 'headerCat activeCat' : 'headerCat'}>Профиль</span>
        </Link>
                
        <div style={{ width: '3.25%' }} />

        <div style={{ width: '4.51%' }} />
        
      </Toolbar>
    </AppBar>
  )
})