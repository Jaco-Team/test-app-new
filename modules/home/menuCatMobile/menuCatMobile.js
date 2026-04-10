import React, { useState, useEffect } from 'react';
import { useHomeStore } from '@/components/store.js';
import Box from '@mui/material/Box';

import {Filter} from '@/ui/Icons.js';

import useCheckCat from '../hooks';

import { setLocalStorageItem } from '@/utils/browserStorage';

export default function MenuCatMobile({ city }) {

  const [
    category,
    cat_position,
    setActiveFilter,
    isOpenFilter,
    resetFilter,
    tag_filter,
    text_filter,
    badge_filter
  ] = useHomeStore((state) => [
    state.category,
    state.cat_position,
    state.setActiveFilter,
    state.isOpenFilter,
    state.resetFilter,
    state.tag_filter,
    state.text_filter,
    state.badge_filter
  ]);

  const [catDopMenu, setCatDopMenu] = useState([]);
  const [pressedCatId, setPressedCatId] = useState(null);
  const [pressedSubId, setPressedSubId] = useState(null);

  const isFilterSelected = badge_filter !== '' || tag_filter !== '' || text_filter !== '';
  const isFilterIconActive = isOpenFilter || isFilterSelected;

  const activeID = useCheckCat(category);
  const activeIdNum = Number(activeID?.id) || 0;
  const activeParentIdNum = Number(activeID?.parent_id) || 0;
  const resolvedActiveCatId = pressedCatId;
  const resolvedActiveSubId = pressedSubId;

  useEffect(() => {
    if (!activeIdNum && !activeParentIdNum) {
      const top =
        typeof window !== 'undefined'
          ? (window.scrollY || document.documentElement.scrollTop || 0)
          : 0;

      if (top <= 5) {
        setPressedCatId(null);
        setPressedSubId(null);

        const firstCatWithSubs = (category || []).find(
          (item) => Array.isArray(item?.cats) && item.cats.length > 0,
        );
        setCatDopMenu(firstCatWithSubs?.cats || []);
      }

      return;
    }

    if (activeParentIdNum > 0 && activeParentIdNum !== activeIdNum) {
      setPressedCatId(activeParentIdNum);
      setPressedSubId(activeIdNum || null);
      return;
    }

    if (activeIdNum > 0) {
      setPressedCatId(activeIdNum);
      setPressedSubId(null);
    }
  }, [activeIdNum, activeParentIdNum, category]);
  
  useEffect(() => {
    if (!Number(activeID?.id) && !Number(activeID?.parent_id)) {
      return;
    }

    if( parseInt(activeID.id) !== parseInt(activeID.parent_id) ){
      let chooseItem = category.find( item => parseInt(item.id) == parseInt(activeID.parent_id) );

      if( chooseItem ){
        setCatDopMenu(chooseItem.cats);
      }else{
        setCatDopMenu([]);
      }
    }else{
      setCatDopMenu([]);
    }
  }, [activeID, category]);

  useEffect(() => {
    if (!resolvedActiveSubId) {
      return;
    }

    const scrollContainer = document.querySelector('#menuCatDop');
    const activeNode = document.querySelector('#linkDOP_' + resolvedActiveSubId);

    if (scrollContainer && activeNode?.getBoundingClientRect) {
      const data = activeNode.getBoundingClientRect();

      scrollContainer.scroll({
        left: data['x'] + data['width'] - 150,
        behavior: 'smooth'
      });
    }
  }, [resolvedActiveSubId, catDopMenu.length]);

  if (city == '') return null;

  const chooseCat = (id, scroll) => {
    setLocalStorageItem('goTo', id);
    setPressedCatId(Number(id) || null);

    resetFilter();
    setActiveFilter(false);

    const menuCatDop = document.querySelector('.menuCatDop');

    if (menuCatDop) {
      menuCatDop.scrollLeft = 0;
    }

    const selectedCat = category.find((cat) => parseInt(cat.id) == parseInt(id));
    const selectedSubs = Array.isArray(selectedCat?.cats) ? selectedCat.cats : [];

    if(selectedSubs.length > 0) {
      setCatDopMenu(selectedSubs);
      setPressedSubId(Number(selectedSubs[0]?.id) || null);
    } else {
      setCatDopMenu([]);
      setPressedSubId(null);
    }

    if (scroll) {
      const targetId = Number(selectedSubs[0]?.id) || Number(id);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => getScroll(targetId));
      });
    }
  };

  const chooseDopCat = (id, scroll) => {
    setLocalStorageItem('goTo', id);
    setPressedSubId(Number(id) || null);

    const selectedSub = category
      .flatMap((cat) => (Array.isArray(cat?.cats) ? cat.cats : []))
      .find((cat) => parseInt(cat.id) == parseInt(id));

    if (selectedSub?.parent_id) {
      setPressedCatId(Number(selectedSub.parent_id) || null);
    }
    

    if (scroll) {
      resetFilter();
      setActiveFilter(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => getScroll(id));
      });
    }
  };

  const getScroll = (id, attempt = 0) => {
    if (!id) {
      return;
    }

    const header = document.querySelector('.headerMobile')?.getBoundingClientRect?.().height || 0;
    const menuElement = document.querySelector('.menuCatMobile');
    const menu = menuElement?.getBoundingClientRect?.().height || 0;

    const target =
      document.getElementById('cat' + id) ||
      document.getElementsByName('cat' + id)?.[0];

    if (!target?.getBoundingClientRect) {
      return;
    }

    const desiredTop = header + menu;
    const currentTop = target.getBoundingClientRect().top;
    const delta = currentTop - desiredTop;

    if (Math.abs(delta) > 1) {
      window.scrollBy({
        top: delta,
        left: 0,
        behavior: 'auto',
      });
    }

    if (attempt < 4) {
      requestAnimationFrame(() => getScroll(id, attempt + 1));
    }
  };

  return (
    <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className="menuCatMobile"
     style={{position: cat_position ? 'fixed' : 'sticky'}}
    >
      <div className="menuCat" style={{ marginBottom: catDopMenu.length == 0 ? '1.7094017094017vw' : '2.5641025641026vw' }}>
        {category.map((item, key) => (
          <div
            key={key}
            className={resolvedActiveCatId === Number(item.id) ? 'Cat active' : 'Cat'}
            id={'link_' + item.id}
            onClick={() => chooseCat(item.id, 'scroll')}
          >
            <span>{item.name}</span>
          </div>
        ))}
        <div
          className={isFilterIconActive ? 'filterSVG activeFilter' : 'filterSVG'}
          onClick={() => setActiveFilter(!isOpenFilter)}
        >
          <Filter />
        </div>
      </div>
      {catDopMenu.length == 0 ? false : (
        <div className="menuCatDopContainer">
          <div className="menuCatDop" id="menuCatDop" >
            {catDopMenu.map((cat, key, arr) => (
              <div
                key={key}
                className={resolvedActiveSubId === Number(cat.id) ? 'CatDop active' : 'CatDop'}
                style={{minWidth: cat.name.length > 8 ? '27.350427350427vw' : '21.367521367521vw',
                  marginLeft: key === 0 ? '3.4188034188vw' : '1.7094017094017vw',
                  marginRight: cat === arr[arr.length - 1] ? '3.4188034188vw' : 0}}
                id={'linkDOP_' + cat.id}
                onClick={() => chooseDopCat(cat.id, 'scroll')}
              >
                <span>{cat.short_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* <div className="blockShadowMenuCatMobile" style={{ position: 'sticky', top: catDopMenu.length != 0 ? '43.735042735043vw' : '31.5786vw' }} />  */}
      
    </Box>
  );
}
