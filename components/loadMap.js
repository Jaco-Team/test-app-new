'use_client'

import Script from 'next/script';

import { useContactStore } from '@/components/store.js';

export default function LoadMap({ city }) {

  const [ getData ] = useContactStore( state => [ state.getData ] );

  const gt_data = () => {
    setTimeout( () => {
      getData('contacts', city)
    }, 300 )
  }

  return (
    <Script 
      src="https://api-maps.yandex.ru/2.1/?apikey=ae2bad1f-486e-442b-a9f7-d84fff6296db&lang=ru_RU" 
      onLoad={ gt_data } 
    />
  );
}
