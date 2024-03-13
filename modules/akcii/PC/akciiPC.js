import React, { useEffect } from 'react';
import { useHomeStore, useAkciiStore, useCitiesStore } from '@/components/store';

import AkciiItemPC from './akciiItemPC';

export default function AkciiPC() {
  const [bannerList, getBanners] = useHomeStore((state) => [state.bannerList, state.getBanners]);
  
  const [thisCity] = useCitiesStore((state) => [state.thisCity]);

  useEffect(() => {
    getBanners('home', thisCity);
  }, [thisCity]);

  return (
    <div className="akciiPC">
      <span className="login">Выгодные предложения</span>
      {bannerList?.map((item, key) => (
        <AkciiItemPC key={key} actia={item} />
      ))}
    </div>
  );
}
