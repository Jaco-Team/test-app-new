import React, { useEffect } from 'react';
import {
  useHomeStore,
  useAkciiStore,
  useCitiesStore,
} from '@/components/store';

import AkciiItemPC from './akciiItemPC';

export default function AkciiPC({ initialBanners = [] }) {
  const [bannerList, getBanners, bannersCity] = useHomeStore((state) => [
    state.bannerList,
    state.getBanners,
    state.bannersCity,
  ]);

  const [thisCity] = useCitiesStore((state) => [state.thisCity]);

  useEffect(() => {
    if (thisCity && thisCity.length > 0) {
      getBanners('home', thisCity);
    }
  }, [thisCity]);

  const currentBanners =
    bannersCity === thisCity && bannerList?.length
      ? bannerList
      : initialBanners;
  const akcijaBanners = currentBanners.filter(
    (item) => parseInt(item?.is_active_actii) === 1
  );

  return (
    <div className="akciiPC">
      <span className="login">Выгодные предложения</span>
      {akcijaBanners?.map((item, key) =>
        parseInt(item?.is_active_actii) === 1 ? (
          <AkciiItemPC key={item.id} actia={item} />
        ) : (
          false
        )
      )}
    </div>
  );
}
