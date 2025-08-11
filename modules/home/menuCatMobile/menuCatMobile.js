import React, { useState, useEffect } from 'react';
import { useHomeStore } from '@/components/store.js';
import { Link as ScrollLink } from 'react-scroll';
import Box from '@mui/material/Box';

import {Filter} from '@/ui/Icons.js';

import useCheckCat from '../hooks';

import * as Scroll from 'react-scroll';
var scroller = Scroll.scroller;

export default function MenuCatMobile({ city }) {

  const [category, cat_position, setActiveFilter, isOpenFilter, resetFilter] = useHomeStore((state) => [state.category, state.cat_position,  state.setActiveFilter, state.isOpenFilter, state.resetFilter]);

  const [catMenu, setCatMenu] = useState(category);
  const [catDopMenu, setCatDopMenu] = useState([]);
  const [offset, setOffset] = useState(null);

  let activeID = useCheckCat(category);
  
  useEffect(() => {
    if( parseInt(activeID.id) !== parseInt(activeID.parent_id) ){
      let chooseItem = catMenu.find( item => parseInt(item.id) == parseInt(activeID.parent_id) );

      if( chooseItem ){
        setCatDopMenu(chooseItem.cats);
      }else{
        setCatDopMenu([]);
      }
    }else{
      setCatDopMenu([]);
    }
  }, [activeID]);

  useEffect(() => {
    setCatMenu(category);
  }, [category]);

  if (city == '') return null;

  const chooseCat = (id, scroll) => {
    localStorage.setItem('goTo', id);

    resetFilter();
    setActiveFilter(false);

    const menuCatDop = document.querySelector('.menuCatDop');

    if (menuCatDop) {
      menuCatDop.scrollLeft = 0;
    }

    const newCatMenu = catMenu.map((cat) => {
      if (cat.id === id) {
        if(cat.cats.length > 0) {
          setCatDopMenu(cat.cats);
        } else {
          setCatDopMenu([]);
        }
      } 
      return cat;
    });

    setCatMenu(newCatMenu);

    if (scroll) {
      getScroll(id);
    }
  };

  const chooseDopCat = (id, scroll) => {
    localStorage.setItem('goTo', id);
    

    if (scroll) {
      resetFilter();
      setActiveFilter(false);

      getScroll(id);
    }
  };

  const getScroll = (id) => {
    const header = document.querySelector('.headerMobile').getBoundingClientRect().height;

    const menu = document.querySelector('.menuCatMobile').getBoundingClientRect().height;

    const offset = -(header + menu);

    setOffset(offset);

    scroller.scrollTo('cat' + id, {
      duration: 0,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset,
    });
  };

  return (
    <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className="menuCatMobile"
     style={{position: cat_position ? 'fixed' : 'sticky'}}
    >
      <div className="menuCat" style={{ marginBottom: catDopMenu.length == 0 ? '1.7094017094017vw' : '2.5641025641026vw' }}>
        {catMenu.map((item, key) => (
          <ScrollLink
            key={key}
            className={'Cat'}
            to={'cat' + item.id}
            id={'link_' + item.id}
            spy={true}
            isDynamic={true}
            smooth={false}
            offset={offset}
            onClick={() => chooseCat(item.id, 'scroll')}
            //onSetActive={() => chooseCat(item.id, null)}
          >
            <span>{item.name}</span>
          </ScrollLink>
        ))}
        <div className={isOpenFilter ? 'filterSVG activeFilter' : 'filterSVG'} onClick={() => setActiveFilter(!isOpenFilter)}>
          <Filter />
        </div>
      </div>
      {catDopMenu.length == 0 ? false : (
        <div className="menuCatDopContainer">
          <div className="menuCatDop" id="menuCatDop" >
            {catDopMenu.map((cat, key, arr) => (
              <ScrollLink
                key={key}
                className={'CatDop'}
                style={{minWidth: cat.name.length > 8 ? '27.350427350427vw' : '21.367521367521vw',
                  marginLeft: key === 0 ? '3.4188034188vw' : '1.7094017094017vw',
                  marginRight: cat === arr[arr.length - 1] ? '3.4188034188vw' : 0}}
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

                  if( cat?.id && document.querySelector('#linkDOP_'+cat?.id) ) {
                    let data = document.querySelector('#linkDOP_'+cat.id).getBoundingClientRect()

                    scrollContainer.scroll({
                        left: data['x'] + data['width'] - 150,
                        behavior: 'smooth'
                    });
                  }
                  
                } }
              >
                <span>{cat.short_name}</span>
              </ScrollLink>
            ))}
          </div>
        </div>
      )}

      <div className="blockShadowMenuCatMobile" style={{ position: 'sticky', top: catDopMenu.length != 0 ? '43.735042735043vw' : '31.5786vw' }} /> 
      
    </Box>
  );
}
