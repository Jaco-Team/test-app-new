import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';

import { useHomeStore, useCartStore, useHeaderStore, useCitiesStore } from '@/components/store.js';

import CardItemPc from './cardItemPc';
import CardItemMobile from './cardItemMobile.js';

import * as Scroll from 'react-scroll';
var scroller = Scroll.scroller;

import { usePathname, useSearchParams } from 'next/navigation'

export default React.memo(function CatItems() {
  const [cats, setCats] = useState([]);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get('item')

  let catygory = '';

  if(pathname.split('menu/')[1] && pathname.split('menu/')[1].length > 0) {
    catygory = pathname.split('menu/')[1];
  }
  
  const [CatsItems, getItem, closeModal] = useHomeStore((state) => [state.CatsItems, state.getItem, state.closeModal]);
  const [items] = useCartStore((state) => [state.items]);
  const [matches] = useHeaderStore((state) => [state.matches]);
  const [thisCity] = useCitiesStore( state => [state.thisCity]);

  useEffect(() => {
    const catsCount = CatsItems.map((cat) => {
      cat.items.map((item) => {
        item.count = 0;
        if (items.length) {
          items.map((it) => {
            if (it.item_id === item.id) {
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

    if( search && search.length > 0 && CatsItems.length > 0 ){
      let find_item = null;

      CatsItems.map((cat) => {
        cat.items.map((item) => {

          if (item.link === search) {
            find_item = item;
          }
        });
      });

      if( find_item ){
        getItem('home', thisCity, find_item.id);

        let offset = 200;

        if (document.querySelector('.scrollCat.mobile')) {
          offset += 200;
        }

        setTimeout(() => {
          scroller.scrollTo(search, {
            duration: 200,
            delay: 0,
            smooth: 'easeInOutQuart',
            offset: -offset,
          });
        }, 150);
      }else{
        closeModal();
      }
    }
  }, [search, CatsItems]);

  useEffect(() => {
    setTimeout(() => {
      if (localStorage.getItem('goTo')) {
        let hash = localStorage.getItem('goTo');

        localStorage.removeItem('goTo');

        let offset = 70;

        if (document.querySelector('.scrollCat.mobile')) {
          offset += 70;
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

  if (cats.length == 0) return <div style={{ height: 1000 }} />;

  let newCats = [];

  if( catygory.length > 0 ) {
    newCats = cats.filter( item => item.link == catygory || item.main_link == catygory );
  }else{
    newCats = cats
  }

  if (matches) {
    return newCats.map((cat, key) => (
      <Grid
        container
        spacing={2}
        key={key}
        name={'cat' + cat.main_id}
        id={'cat' + cat.id}
        className="ContainerCardItemMobile"
      >
        {cat.items.map((it, k) => <CardItemMobile key={k} item={it} count={it.count} />)}
      </Grid>
    ));
  }
    
  return newCats.map((cat, key) => (
    <Grid
      container
      spacing={2}
      key={key}
      name={'cat' + cat.main_id}
      id={'cat' + cat.id}
      className="ContainerCardItemPC"
      ref={(node) => {
        if (node && key === 0) {
          node.style.setProperty(
            'margin-top',
            '1.1552346570397vw',
            'important'
          );
        }
        if (node && cat === newCats.at(-1)) {
          node.style.setProperty(
            'margin-bottom',
            '2.1660649819495vw',
            'important'
          );
        }
      }}
    >
      {cat.items.map((it, k) => (
        <CardItemPc key={k} index={k} item={it} count={it.count} />
      ))}
    </Grid>
  ));

});
