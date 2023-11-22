import Script from 'next/script';

export default function LoadMap({ getData, city }) {
  return (
    <Script 
      src="https://api-maps.yandex.ru/2.1/?apikey=ae2bad1f-486e-442b-a9f7-d84fff6296db&lang=ru_RU" 
      onLoad={getData && city ? () => getData('contacts', city) : null} 
    />
  );
}
