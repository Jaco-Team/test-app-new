import React from 'react';

import mediaQuery from 'css-mediaquery';

import { roboto } from '../ui/Font.js'

import ModalCity from '../modules/header/modalCity.js';
import ModalAuth from '../modules/header/modalAuth';
import NavBarPC from '../modules/header/navBarPC.js';
import NavBarMobile from '../modules/header/navBarMobile.js';

export default React.memo(function Header(props) {
    //const theme = useTheme();

    const { city, city_list, cats, active_page } = props;
    
    const thisCityRU = city_list.find( item => item.link == city )['name'];

    //console.log('load header', theme)
  
    //const matches = useMediaQuery('(min-width:600px)');

    const isMatch = mediaQuery.match('screen and (min-width: 40em)', {
        type : 'screen',
        width: '1024px'
    });
    
    //console.log('load header asdjasndjlasnd', isMatch); // 

    return (
        <div className={roboto.variable}>
            
            { !isMatch ? null :
                <NavBarPC city={city} cityRu={thisCityRU} catList={cats} active_page={active_page} />
            }

            { isMatch ? null :
                <NavBarMobile city={city} cityRu={thisCityRU} />
            }

            <ModalCity />
            <ModalAuth />

        </div>
    )
})
