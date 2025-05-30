import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';

import { useHomeStore, useCartStore, useHeaderStoreNew, useCitiesStore } from '@/components/store.js';

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
  const search_category = searchParams.get('category')

  let catygory = '';

  if(pathname.split('menu/')[1] && pathname.split('menu/')[1].length > 0) {
    catygory = pathname.split('menu/')[1];
  }
  
  const [category, CatsItems, getItem, closeModal, transition_menu_mobile] = useHomeStore((state) => [state.category, state.CatsItems, state.getItem, state.closeModal, state.transition_menu_mobile]);
  const [items] = useCartStore((state) => [state.items]);
  const [matches] = useHeaderStoreNew((state) => [state?.matches]);
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

    if( getItem && search && search.length > 0 && CatsItems.length > 0 ){
      let find_item = null;

      CatsItems.map((cat) => {
        cat.items.map((item) => {

          if (item.link === search) {
            find_item = item;
          }
        });
      });

      if( find_item && thisCity && find_item?.id ){
        getItem('home', thisCity, find_item?.id);

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
  }, [search, CatsItems, getItem]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if( category.length > 0 && search_category?.length > 0 ) {
        //console.log( 'search_category', search_category, category ) 

        let scroll_cat_id = 0;

        category.map( main_cat => {
          if( main_cat.cats.length > 0 ){
            main_cat.cats.map( cat => {
              if( cat.link === search_category ){
                console.log( 'go_to', cat.name, cat.id ) 
                scroll_cat_id = cat.id;
                //chooseCat(cat.name, cat.id)
              }
            })
          }else{
            if( main_cat.link === search_category ){
              console.log( 'go_to', main_cat.name, main_cat.id ) 
              scroll_cat_id = main_cat.id;
              //chooseCat(main_cat.name, main_cat.id)
            }
          }
        } )

        if( parseInt( scroll_cat_id ) > 0 ){
          let offset = 70;

          if (document.querySelector('.ContainerCardItemMobile')) {
            console.log('.ContainerCardItemMobile')
            offset += 120;
          }
  
          setTimeout(() => {
            scroller.scrollTo('cat' + scroll_cat_id, {
              duration: 200,
              delay: 0,
              smooth: 'easeInOutQuart',
              offset: -offset,
            });
          }, 150);

          let state = { },
            title = '',
            url = window.location.pathname;

          window.history.pushState(state, title, url)
        }

      }
    }
  }, [search_category, category]);

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
        style={{ transform: `translateY(${transition_menu_mobile})` }}
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
      // style={{ transform: `translateY(${transition_menu_pc})` }}
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
