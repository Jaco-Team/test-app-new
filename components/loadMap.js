//'use_client'

import Script from 'next/script';
import { useEffect } from 'react';

import { useContactStore } from '@/components/store.js';

export default function LoadMap({ city }) {
  const [getMap] = useContactStore(state => [state.getMap]);

  const gt_data = () => {
    setTimeout(() => {
      getMap('contacts', city);
    }, 300)
  }

  useEffect(() => {
    gt_data();
  }, [])

  return (
    <Script 
      src="https://api-maps.yandex.ru/2.1/?apikey=f600fbbd-6500-4bf7-a0ab-ec9336f6c7d8&lang=ru_RU" 
      onLoad={gt_data} 
    />
  );
}
