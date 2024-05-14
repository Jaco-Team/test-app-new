import { useRef, useEffect } from 'react';

import PropTypes from 'prop-types';
import {YMaps, Map, Placemark, Polygon, SearchControl, ZoomControl} from '@pbe/react-yandex-maps';
import './MapPC.scss';

// ymaps в storybook не работает, сделал костыль для активной иконки, но не совсем работает

export const MapPC = ({ center_map, zones, points_zone, type_map }) => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current && center_map?.center) {
      ref.current.setCenter([zones[0].xy_center_map['latitude'], zones[0].xy_center_map['longitude']]);
    }
  }, [zones]);

  return (
    <div className="mapPC">
      <YMaps query={{lang: 'ru_RU', apikey: 'f600fbbd-6500-4bf7-a0ab-ec9336f6c7d8'}}>
        <Map
          defaultState={center_map}
          instanceRef={ref}
          width="100%"
          height="100%"
          className="mapPC"
        >
          <SearchControl options={{ float: 'left' }} />
          <ZoomControl options={{ float: 'left' }} />

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
        </Map>
      </YMaps>
      {type_map !== 'active' ? null : (
        <div class="my-img">
          <img alt="" src="/Favikon.png" />
        </div>
      )}
    </div>
  );
};

MapPC.propTypes = {
  center_map: PropTypes.object,
  zones: PropTypes.object,
  points_zone: PropTypes.object,
  type_map: PropTypes.string.isRequired,
};
