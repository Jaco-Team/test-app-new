import React, { useEffect } from 'react';
import { useHomeStore, useAkciiStore } from '@/components/store';

import AkciiItemMobile from './akciiItemMobile.js';

export default function AkciiMobile() {
  const [bannerList] = useHomeStore((state) => [state.bannerList]);
  const [getAktia, actii] = useAkciiStore((state) => [state.getAktia, state.actii]);

  useEffect(() => {
    getAktia(bannerList);
  }, [bannerList]);

  return (
    <div className="akciiMobile">
      <span className="login">Выгодные предложения</span>
      {actii?.map((item, key) => (
        <AkciiItemMobile key={key} actia={item} />
      ))}
    </div>
  );
}
