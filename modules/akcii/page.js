import React from 'react';
import { useHeaderStore, useHomeStore } from '@/components/store';

import AkciiPC from './PC/akciiPC';
import AkciiMobile from './mobile/akciiMobile';

import ModalCardItemPC from '../home/cardItem/modalCardItemPC';
import ModalItemPC from '../home/cardItem/modal_item_PC';
import ModalCardItemMobile from '../home/cardItem/modalCardItemMobile';
import ModalItemMobile from '../home/cardItem/modal_item_Mobile';

import AkciiItemPC from './PC/akciiItemPC';
//import AkciiItemMobile from './mobile/akciiItemMobile';

import Meta from '@/components/meta.js';

export default function AkciiPage({ page }) {
  const [matches] = useHeaderStore((state) => [state?.matches]);

  const [ pageBanner ] = useHomeStore((state) => [state.pageBanner]);

  if( page?.is_one_actia == true ){
    return (
      <Meta title={page.title} description={page.description}>
        {matches ? 
          <div className="akciiMobile onePage">
            <AkciiItemPC actia={pageBanner} /> 
          </div>
            : 
          <div className="akciiPC onePage">
            <AkciiItemPC actia={pageBanner} />
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
}
