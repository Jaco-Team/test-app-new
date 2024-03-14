import React, { useEffect } from 'react';
import { useHomeStore, useAkciiStore, useCitiesStore } from '@/components/store';

import AkciiItemMobile from './akciiItemMobile.js';

export default function AkciiMobile() {
  const [bannerList, getBanners] = useHomeStore((state) => [state.bannerList, state.getBanners]);

  const [thisCity] = useCitiesStore((state) => [state.thisCity]);

  useEffect(() => {
    if( thisCity && thisCity.length > 0 ) {
      getBanners('home', thisCity);
    }
  }, [thisCity]);

  return (
    <div className="akciiMobile">
      <span className="login">Выгодные предложения</span>
      {bannerList?.map((item, key) => (
        <AkciiItemMobile key={key} actia={item} />
      ))}
    </div>
  );
}
