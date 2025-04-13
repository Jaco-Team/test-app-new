import React, { useEffect, memo } from 'react';
import { useHeaderStoreNew, useHomeStore } from '@/components/store';

import AkciiPC from './PC/akciiPC';
import AkciiMobile from './mobile/akciiMobile';

import ModalCardItemPC from '../home/cardItem/modalCardItemPC';
import ModalItemPC from '../home/cardItem/modal_item_PC';
import ModalCardItemMobile from '../home/cardItem/modalCardItemMobile';
import ModalItemMobile from '../home/cardItem/modal_item_Mobile';

import AkciiItemPC from './PC/akciiItemPC';
import AkciiItemMobile from './mobile/akciiItemMobile';

import Meta from '@/components/meta.js';

import { useSearchParams } from 'next/navigation'
//import { set } from 'lodash';

let click = false;

export default memo(function AkciiPage({ page }) {
  const [matches] = useHeaderStoreNew((state) => [state?.matches]);

  const [ pageBanner, bannerList ] = useHomeStore((state) => [state.pageBanner, state.bannerList]);

  const searchParams = useSearchParams();
  
  const search = searchParams.get('akcia')

  useEffect(() => {
    if( bannerList.length > 0 && search?.length > 0 ) {
      const targetEl = document.getElementById(`${search}`);
      if (!targetEl) return;
    
      const observer = new ResizeObserver(() => {
        targetEl.scrollIntoView({ behavior: 'smooth', offset: 100 });
      });
      observer.observe(targetEl);
    
      let state = { },
        title = '',
        url = window.location.pathname;

      window.history.pushState(state, title, url)

      return () => observer.disconnect();
    }
  }, [search, bannerList]);

  useEffect(() => {
    if( page?.is_one_actia == true && pageBanner && click == false ){
      dataLayer.push({
        "ecommerce": {
          "promoClick": {
            "promotions": [
              {
                "id": pageBanner?.id,          
                "name": pageBanner?.title,
                "creative": pageBanner?.name,
                "position": 1
              }
            ]
          }
        }
      });

      click = true;

      setTimeout(() => {
        click = false;
      }, 3000)
    }
  }, [pageBanner])

  if( page?.is_one_actia == true ){
    return (
      <Meta title={page.title} description={page.description}>
        {matches ? 
          <div className="akciiMobile onePage" style={{ marginTop: 100 }}>
            <AkciiItemMobile actia={pageBanner} is_one_actia={page?.is_one_actia} /> 
          </div>
            : 
          <div className="akciiPC onePage">
            <AkciiItemPC actia={pageBanner} is_one_actia={page?.is_one_actia} />
          </div>
        }
      </Meta>
    );
  }

  return (
    <Meta title={page.title} description={page.description}>
      {matches ?
        <>
          <AkciiMobile /> 
          <ModalItemMobile />
          <ModalCardItemMobile /> 
        </>
        : 
        <>
          <AkciiPC />
          <ModalCardItemPC />
          <ModalItemPC />
        </>
      }
    </Meta>
  );
})
