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

let click = false;

export default memo(function AkciiPage({ page }) {
  const [matches] = useHeaderStoreNew((state) => [state?.matches]);

  const [ pageBanner ] = useHomeStore((state) => [state.pageBanner]);

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
