import React, { useState } from 'react';

import Link from 'next/link'
import Image from 'next/image';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import JacoLogo from '@/public/jaco-logo.png'
import { shallow } from 'zustand/shallow'

import { Link as ScrollLink } from "react-scroll";

import { useHeaderStore } from '@/components/store.js';

export default React.memo(function NavBarPC(props){
  
  const { city, cityRu, catList, active_page } = props;

  const [ mainCatActive, setMainCatActive ] = useState(0);
  const [ setActiveModalCity, setActiveModalAuth ] = useHeaderStore( state => [state.setActiveModalCity, state.setActiveModalAuth], shallow );

  if( city == '' ){
    return null;
  }

  console.log( 'catList', catList )

  return (
    <AppBar position="fixed" className='headerNew' id='headerNew' elevation={2} sx={{ display: { xs: 'none', md: 'block' } }}>
      <Toolbar>
        <div style={{ width: '4.51%' }} />
        <Link href={"/"+city} style={{ width: '14.8%' }}>
          <Image alt="Жако доставка роллов и пиццы" src={JacoLogo} width={200} height={50} priority={true} />
        </Link> 
        <div style={{ width: '2.53%' }} />

        <div style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }} onClick={ () => setActiveModalCity(true) }>
          <span className={'headerCat'}>{cityRu}</span>
        </div>
        <div style={{ width: '0.36%' }} />

        { active_page == 'home' ?
          catList.map( (item, key) =>
            <React.Fragment key={key}>
              <ScrollLink 
                style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}
                to={"cat"+item.id}
                spy={true} 
                isDynamic={true}
                smooth={false} 
                offset={-100}
              >
                <span className='headerCat' id={'link_'+item.id}>{item.name}</span>
              </ScrollLink> 
              <div style={{ width: '0.36%' }} />
            </React.Fragment>
          ) 
            :
          catList.map( (item, key) =>
            <React.Fragment key={key}>
              <Link 
                href={"/"+city} 
                style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}
                onClick={() => { typeof window !== 'undefined' ? localStorage.setItem('goTo', item.id) : {} }}
              >
                <span className={'headerCat'}>{item.name}</span>
              </Link> 
              <div style={{ width: '0.36%' }} />
            </React.Fragment>
          ) 
        }
        
        <Link href={"/"+city+"/akcii"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}>
          <span className={active_page == 'akcii' ? 'headerCat activeCat' : 'headerCat'}>Акции</span>
        </Link>
        <div style={{ width: '0.36%' }} />

        <Link href={"/"+city+"/"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }} onClick={ () => setActiveModalAuth(true) } >
          <span className={active_page == 'profile' ? 'headerCat activeCat' : 'headerCat'}>Профиль</span>
        </Link>
                
        <div style={{ width: '3.25%' }} />

        <div style={{ width: '4.51%' }} />
        
      </Toolbar>
    </AppBar>
  )
})