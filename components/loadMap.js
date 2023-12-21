//'use_client'

import Script from 'next/script';

import { useContactStore } from '@/components/store.js';

export default function LoadMap({ city }) {

  const [getMap] = useContactStore(state => [state.getMap]);
  
  const gt_data = () => {
    setTimeout(() => {
      getMap('contacts', city);
    }, 300)
  }

  return (
    <Script 
      src="https://api-maps.yandex.ru/2.1/?apikey=ae2bad1f-486e-442b-a9f7-d84fff6296db&lang=ru_RU" 
      onLoad={ gt_data } 
    />
  );
}
