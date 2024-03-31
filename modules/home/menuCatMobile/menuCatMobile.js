import React, { useState, useEffect, memo } from 'react';
import { useHeaderStore, useHomeStore } from '@/components/store.js';
import { Link as ScrollLink } from 'react-scroll';
import Box from '@mui/material/Box';

import useCheckCat from '../hooks';

import * as Scroll from 'react-scroll';
var scroller = Scroll.scroller;

const ChooseCat1 = memo( ({ category, offset, chooseCat }) => {
  return(
    <div className="menuCat" style={{ marginBottom: '1.7094017094017vw' }}>
      {category.map((item, key) => (
        <a
          key={item.id}
          className={'Cat'}
          //to={'cat' + item.id}
          id={'link_' + item.id}
          //spy={true}
          //isDynamic={true}
          //smooth={false}
          //offset={offset}
          onClick={() => chooseCat(item.id, 'scroll') }
          //onSetActive={() => chooseCat(item.id, null)}
        >
          <span>{item.name}</span>
        </a>
      ))}
    </div>
  )
} );

function areEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps.category) === JSON.stringify(nextProps.category);
}

export default memo(function MenuCatMobile({ city }) {

  const [ category, setCategory ] = useHomeStore((state) => [ state.category, state.setCategory ]);

  const [catMenu, setCatMenu] = useState(category);
  //const [catDopMenu, setCatDopMenu] = useState([]);
  const [offset, setOffset] = useState(null);

  //const [activePage] = useHeaderStore((state) => [state.activePage]);

  /**
   * 
   * {catDopMenu.length == 0 ? false : (
        <div className="menuCatDopContainer">
          <div className="menuCatDop" id="menuCatDop" >
            {catDopMenu.map((cat, key) => (
              <ScrollLink
                key={key}
                className={'CatDop'}
                style={{minWidth: cat.name.length > 8 ? '27.350427350427vw' : '21.367521367521vw',
                  marginLeft: key === 0 ? '3.4188034188vw' : '1.7094017094017vw',
                  marginRight: cat === catDopMenu.at(-1) ? '3.4188034188vw' : 0}}
                to={'cat' + cat.id}
                id={'linkDOP_' + cat.id}
                spy={true}
                isDynamic={true}
                smooth={false}
                offset={offset}
                onClick={() => chooseDopCat(cat.id, 'scroll')}
                //onSetActive={() => chooseDopCat(cat.id, null)}
                onSetActive={ () => {

                  chooseDopCat(cat.id, null);

                  let scrollContainer = document.querySelector("#menuCatDop");

                  let data = document.querySelector('#linkDOP_'+cat.id).getBoundingClientRect()

                  scrollContainer.scroll({
                      left: data['x'] + data['width'] - 150,
                      behavior: 'smooth'
                  });
                } }
              >
                <span>{cat.short_name}</span>
              </ScrollLink>
            ))}
          </div>
        </div>
      )}
   */

      const chooseCat = (id, scroll) => {
        localStorage.setItem('goTo', id);
    
        const menuCatDop = document.querySelector('.menuCatDop');
    
        if (menuCatDop) {
          //menuCatDop.scrollLeft = 0;
        }
    
        const newCatMenu = catMenu.map((cat) => {
          if (cat.id === id) {
            cat.choice = true;
    
            if(cat.cats.length > 0) {
              cat.cats.map((cat) => (cat.choice = false));
              setCatDopMenu(cat.cats);
            } else {
              setCatDopMenu([]);
            }
          } else {
            cat.choice = false;
          }
    
          return cat;
        });
    
        setCatMenu(newCatMenu);
    
        if (scroll) {
          //getScroll(id);
        }
      };

  return (
    <Box className="menuCatMobile">
      <ChooseCat1 category={category} offset={offset} chooseCat={chooseCat} />
      
      

      <div className="blockShadowMenuCatMobile" style={{ position: 'sticky', top: '31.5786vw' }} /> 
      
    </Box>
  );
})