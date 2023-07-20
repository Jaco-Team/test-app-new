import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import Box from '@mui/material/Box';

let catList = [{id: '1', name: 'Роллы', link: 'rolly', count_2: '107', count: '0', list: [{id: '1', name: 'Сеты роллов'}, { id: '2', name: 'Фирменные' }, {id: '3', name: 'Жареные'}, 
{id: '4', name: 'Запеченные'}, {id: '5', name: 'Классика'}]}, {id: '14', name: 'Пицца', link: 'pizza', count_2: '0', count: '12'}, {id: '15', name: 'Блюда', link: null, count_2: '0',
count: '4', list: [{id: '5', name: 'Закуски', link: 'zakuski', count_2: '0', count: '9'}, {id: '7', name: 'Соусы', link: 'sousy', count_2: '0', count: '9'}, {id: '1', name: 'Салаты и фри', link: 'salat'}, {id: '2', name: 'Десерты', link: 'desert'}]}, {id: '6', name: 'Напитки', link: 'napitki', count_2: '0', count: '10'}];

export default function MenuCatMobile({ city }) {

  const [catMenu, setCatMenu] = useState(catList);
  const [catDopMenu, setCatDopMenu] = useState(null);
  const [scrollMenuCat, setScrollMenuCat] = useState(0);

  if (city == '') return null;

  const handleScroll = () => setScrollMenuCat(window.scrollY > 386);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const chooseCat = (id) => {
    localStorage.setItem('goTo', id);

    const menuCatDop = document.querySelector('.menuCatDop');

    if (menuCatDop) {
      menuCatDop.scrollLeft = 0;
    }

    const newCatMenu = catMenu.map((cat) => {
      if (cat.id === id) {
        cat.choice = true;

        if (cat?.list) {
          cat.list.map((cat) => (cat.choice = false));
          setCatDopMenu(cat.list);
        } else {
          setCatDopMenu(null);
        }
      } else {
        cat.choice = false;
      }

      return cat;
    });

    setCatMenu(newCatMenu);
  };

  const chooseDopCat = (id) => {
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
  };

  return (
    <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className="menuCatMobile">
      <div className="menuCat">
        {catMenu.map((item, key) => (
          <ScrollLink
            key={key}
            className={item?.choice ? (item.choice ? 'Cat activeCat' : 'Cat') : 'Cat'}
            to={'cat' + item.id}
            spy={true}
            isDynamic={true}
            smooth={false}
            offset={-100}
            onClick={() => chooseCat(item.id)}
          >
            <span id={'link_' + item.id}>{item.name}</span>
          </ScrollLink>
        ))}
      </div>
      {!catDopMenu ? null : (
        <div className="menuCatDopContainer">
          <div className="menuCatDop">
            {catDopMenu.map((cat, key) => (
              <ScrollLink
                className="CatDop"
                style={{ minWidth: cat.name.length > 8 ? '24.273504273504vw' : '20.854700854701vw',
                  marginLeft: key === 0 ? '4.7008547008547vw' : '1.7094017094017vw',
                  marginRight: cat === catDopMenu.at(-1) ? '4.7008547008547vw' : 0,
                  background: cat?.choice ? cat.choice ? 'rgba(0, 0, 0, 0.07)' : null : null,
                }}
                to={'cat' + cat.id}
                spy={true}
                isDynamic={true}
                smooth={false}
                offset={-100}
                onClick={() => chooseDopCat(cat.id)}
              >
                <span id={'link_' + cat.id}>{cat.name}</span>
              </ScrollLink>
            ))}
          </div>
        </div>
      )}
      {scrollMenuCat ? <div className="blockShadowMenuCatMobile" style={{ top: catDopMenu ? '46.153846153846vw' : '34.188034188034vw' }} /> : null}
    </Box>
  );
}
