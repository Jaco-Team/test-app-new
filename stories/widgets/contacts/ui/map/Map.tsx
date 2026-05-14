import { useRef, useEffect } from 'react';

import {
  YMaps,
  Map as YandexMap,
  Placemark,
  Polygon,
  SearchControl,
  ZoomControl,
} from '@pbe/react-yandex-maps';
import './Map.scss';

// ymaps в storybook не работает, сделал костыль для активной иконки, но не совсем работает

export const Map = ({
  center_map,
  zones,
  points_zone,
  type_map,
}: Record<string, any>) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current && center_map?.center) {
      ref.current.setCenter([
        zones[0].xy_center_map['latitude'],
        zones[0].xy_center_map['longitude'],
      ]);
    }
  }, [zones]);

  return (
    <div className="mapPC">
      <YMaps
        query={{
          lang: 'ru_RU',
          apikey: `${process.env.NEXT_PUBLIC_YANDEX_TOKEN_MAP}`,
        }}
      >
        <YandexMap
          defaultState={center_map}
          instanceRef={ref}
          width="100%"
          height="100%"
          className="mapPC"
        >
          <SearchControl options={{ float: 'left' } as any} />
          <ZoomControl options={{ float: 'left' } as any} />

          {zones?.map((point, key) => (
            <Placemark
              key={key}
              geometry={[point.xy_point.latitude, point.xy_point.longitude]}
              options={{
                iconLayout: point.image,
                iconImageHref: '/Favikon.png',
                iconImageSize: [65, 65],
                iconImageOffset: [-12, -20],
              }}
            />
          ))}

          {points_zone?.map((point, key) => (
            <Polygon
              key={key}
              geometry={[point.zone]}
              options={point.options}
            />
          ))}
        </YandexMap>
      </YMaps>
      {type_map !== 'active' ? null : (
        <div className="my-img">
          <img alt="" src="/Favikon.png" />
        </div>
      )}
    </div>
  );
};
