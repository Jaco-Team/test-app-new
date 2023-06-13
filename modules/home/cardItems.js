import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';

import useMediaQuery from '@mui/material/useMediaQuery';

import { useHomeStore, useCartStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow';

import CardItemPc from './cardItemPc.js';
import CardItemMobile from './cardItemMobile.js';
import useCheckCat from './hooks.js';

import * as Scroll from 'react-scroll';

var Element = Scroll.Element;
var Events = Scroll.Events;
var scroller = Scroll.scroller;

export default React.memo(function CatItems() {
  console.log('CatItems render');

  const [cats, setCats] = useState([]);

  const [CatsItems] = useHomeStore((state) => [state.CatsItems], shallow);
  const [items] = useCartStore((state) => [state.items], shallow);

  let activeId = useCheckCat(CatsItems);

  console.log('activeId', activeId);

  useEffect(() => {
    const catsCount = CatsItems.map((cat) => {
      cat.items.map((item) => {
        item.count = 0;
        if (items.length) {
          items.map((it) => {
            if (it.id === item.id) {
              item.count = it.count;
              return it;
            }
          });
        }
        return item;
      });
      return cat;
    });

    setCats(catsCount);
  }, [items, CatsItems]);

  useEffect(() => {
    setTimeout(() => {
      if (localStorage.getItem('goTo')) {
        let hash = localStorage.getItem('goTo');

        localStorage.removeItem('goTo');

        let offset = 100;

        if (document.querySelector('.scrollCat.mobile')) {
          offset += 100;
        }

        setTimeout(() => {
          scroller.scrollTo('cat' + hash, {
            duration: 200,
            delay: 0,
            smooth: 'easeInOutQuart',
            offset: -offset,
          });
        }, 150);
      }
    }, 300);
  }, []);

  const matches = useMediaQuery('screen and (min-width: 40em)', { noSsr: true });

  if (!cats.length) return <div style={{ height: 1000 }} />;

  if (!matches) {
    return cats.map((cat, key) => (
      <Grid
        container
        spacing={2}
        key={key}
        name={'cat' + cat.main_id}
        id={'cat' + cat.id}
        sx={{ padding: { xs: '0px 5%', sm: '0px 20px' } }}
        style={{ margin: 0, flexWrap: 'wrap', width: '100%' }}
        className="MainItems mainContainer"
      >
        {cat.items.map((it, k) => (
          <CardItemMobile key={k} data={it} />
        ))}
      </Grid>
    ));
  }

  return cats.map((cat, key) => (
    <Grid
      container
      spacing={2}
      key={key}
      name={'cat' + cat.main_id}
      id={'cat' + cat.id}
      className='Container'
      style={{ marginTop: key === 0 ? '1.4440433212996vw' : 0, marginBottom: cat === cats.at(-1) ? '10.108303249097vw' : 0}}
    >
      {cat.items.map((it, k) => (
        <CardItemPc key={k} index={k} item={it} count={it.count} />
      ))}
    </Grid>
  ));
});
