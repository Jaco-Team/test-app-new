import React, { useState, useEffect } from 'react';
import { useHeaderStore, useHomeStore } from '@/components/store.js';
import { Link as ScrollLink } from 'react-scroll';
import Box from '@mui/material/Box';

import * as Scroll from 'react-scroll';
var scroller = Scroll.scroller;

let catList = [{id: '1', name: 'Роллы', link: 'rolly', count_2: '107', count: '0', list: [{id: '1', name: 'Сеты роллов'}, { id: '2', name: 'Фирменные' }, {id: '3', name: 'Жареные'}, 
{id: '4', name: 'Запеченные'}, {id: '5', name: 'Классика'}]}, {id: '14', name: 'Пицца', link: 'pizza', count_2: '0', count: '12'}, {id: '15', name: 'Блюда', link: null, count_2: '0',
count: '4', list: [{id: '5', name: 'Закуски', link: 'zakuski', count_2: '0', count: '9'}, {id: '7', name: 'Соусы', link: 'sousy', count_2: '0', count: '9'}, {id: '1', name: 'Салаты и фри', link: 'salat'}, {id: '2', name: 'Десерты', link: 'desert'}]}, {id: '6', name: 'Напитки', link: 'napitki', count_2: '0', count: '10'}];

export default function MenuCatMobile({ city }) {

  const [ category, setCategory ] = useHomeStore((state) => [ state.category, state.setCategory ]);

  const [catMenu, setCatMenu] = useState(category);
  const [catDopMenu, setCatDopMenu] = useState([]);
  const [scrollMenuCat, setScrollMenuCat] = useState(0);
  const [offset, setOffset] = useState(null);

  useEffect(() => {
    setCatMenu(category);
  }, [category]);

  console.log( 'category', catMenu, catDopMenu )

  if (city == '') return null;

  const [activePage] = useHeaderStore((state) => [state.activePage]);

  const handleScroll = () => setScrollMenuCat(window.scrollY > 100);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // так оставить сброс состояния выбора категории товара при переходе на другие страницы ??
  useEffect(() => {
    if(activePage === 'home') {
      setCatMenu(category)
    } else {
      const cat = category.map(item => item.choice = false)
      setCatMenu(cat)
    }
  }, [activePage]);

  const chooseCat = (id, scroll) => {
    localStorage.setItem('goTo', id);

    const menuCatDop = document.querySelector('.menuCatDop');

    if (menuCatDop) {
      menuCatDop.scrollLeft = 0;
    }

    const newCatMenu = catMenu.map((cat) => {
      if (cat.id === id) {
        cat.choice = true;

        if (cat?.cats) {
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
      getScroll(id);
    }
  };

  const chooseDopCat = (id, scroll) => {
    localStorage.setItem('goTo', id);

    const newCatDopMenu = catDopMenu.map((cat) => {
      if (cat.id === id) {
        cat.choice = true;
      } else {
        cat.choice = false;
      }
      return cat;
    });

    setCatDopMenu(newCatDopMenu);

    if (scroll) {
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
    <>
      <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className="menuCatMobile">
        <div className="menuCat" style={{ marginBottom: catDopMenu.length == 0 ? '1.7094017094017vw' : '2.5641025641026vw' }}>
          {catMenu.map((item, key) => (
            <ScrollLink
              key={key}
              className={item?.choice ? (item.choice ? 'Cat activeCat' : 'Cat') : 'Cat'}
              to={'cat' + item.id}
              spy={true}
              isDynamic={true}
              smooth={false}
              offset={offset}
              onClick={() => chooseCat(item.id, 'scroll')}
              onSetActive={() => chooseCat(item.id, null)}
            >
              <span id={'link_' + item.id}>{item.name}</span>
            </ScrollLink>
          ))}
        </div>
        {catDopMenu.length == 0 ? false : (
          <div className="menuCatDopContainer">
            <div className="menuCatDop">
              {catDopMenu.map((cat, key) => (
                <ScrollLink
                  key={key}
                  className={cat?.choice ? (cat.choice ? 'CatDop activeCatDop' : 'CatDop') : 'CatDop'}
                  style={{minWidth: cat.name.length > 8 ? '27.350427350427vw' : '21.367521367521vw',
                    marginLeft: key === 0 ? '4.7008547008547vw' : '1.7094017094017vw',
                    marginRight: cat === catDopMenu.at(-1) ? '4.7008547008547vw' : 0}}
                  to={'cat' + cat.id}
                  spy={true}
                  isDynamic={true}
                  smooth={false}
                  offset={offset}
                  onClick={() => chooseDopCat(cat.id, 'scroll')}
                  onSetActive={() => chooseDopCat(cat.id, null)}
                >
                  <span id={'link_' + cat.id}>{cat.short_name}</span>
                </ScrollLink>
              ))}
            </div>
          </div>
        )}
      </Box>
      {scrollMenuCat ? 
        <div className="blockShadowMenuCatMobile" style={{ top: catDopMenu.length != 0 ? '43.735042735043vw' : '32.478632478632vw' }} /> 
          : 
        false
      }
    </>
  );
}
