import React, { useEffect } from 'react';
import { useHomeStore, useAkciiStore } from '@/components/store';

import AkciiItemPC from './akciiItemPC';

export default function AkciiPC() {
  const [bannerList] = useHomeStore((state) => [state.bannerList]);
  const [getAktia, actii] = useAkciiStore((state) => [state.getAktia, state.actii]);

  useEffect(() => {
    getAktia(bannerList);
  }, [bannerList]);

  return (
    <div className="akciiPC">
      <span className="login">Выгодные предложения</span>
      {actii?.map((item, key) => (
        <AkciiItemPC key={key} actia={item} />
      ))}
    </div>
  );
}
