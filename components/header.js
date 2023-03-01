import React from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import { roboto } from '../ui/Font.js'

import ModalCity from '../modules/header/modalCity.js'
import ModalAuth from '../modules/header/modalAuth.js'
import NavBarPC from '../modules/header/navBarPC.js';
import NavBarMobile from '../modules/header/navBarMobile.js';

export default React.memo(function Header(props) {

    const { city, city_list, cats, active_page } = props;
    
    const thisCityRU = city_list.find( item => item.link == city )['name'];

    console.log('load header')
  
    const matches = useMediaQuery('(min-width:600px)');

    return (
        <div className={roboto.variable}>
            
            { !matches ? null :
                <NavBarPC city={city} cityRu={thisCityRU} catList={cats} active_page={active_page} />
            }

            { matches ? null :
                <NavBarMobile city={city} cityRu={thisCityRU} />
            }

            <ModalCity />
            <ModalAuth />

        </div>
    )
})