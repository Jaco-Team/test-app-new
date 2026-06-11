'use client';

import { useEffect, useRef } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Map,
  Placemark,
  Polygon,
  SearchControl,
  ZoomControl,
} from '@pbe/react-yandex-maps';
import type { ContactZone } from '@src/entities/contact';
import { useContactStore } from '@src/entities/contact';
import { BREAKPOINTS } from '@ui/foundation/breakpoints';
import type { IPlacemarkOptions } from 'yandex-maps';
import './ContactsMap.scss';

const MAP_CONTROL_POSITION = { left: 10, top: 10 } as const;

const DEFAULT_PLACEMARK_OPTIONS: IPlacemarkOptions = {
  iconLayout: 'default#image',
  iconImageHref: '/Favikon.png',
  iconImageSize: [65, 65],
  iconImageOffset: [-12, -20],
};

function buildPlacemarkOptions(image: ContactZone['image']): IPlacemarkOptions {
  if (typeof image === 'string') {
    return {
      ...DEFAULT_PLACEMARK_OPTIONS,
      iconLayout: image,
    };
  }

  if (image) {
    return { iconLayout: image };
  }

  return DEFAULT_PLACEMARK_OPTIONS;
}

type YMapInstance = {
  setCenter?: (
    coords: [number, number],
    zoom?: number,
    options?: Record<string, unknown>
  ) => void;
};

export function ContactsMap() {
  const expanded = useMediaQuery(`(min-width: ${BREAKPOINTS.expandedMin}px)`, {
    noSsr: true,
  });
  const mapRef = useRef<YMapInstance | null>(null);
  const centerMap = useContactStore((state) => state.centerMap);
  const zones = useContactStore((state) => state.zones);
  const pointsZone = useContactStore((state) => state.pointsZone);
  const locationUser = useContactStore((state) => state.locationUser);
  const changePointClick = useContactStore((state) => state.changePointClick);
  const changePointNotHover = useContactStore(
    (state) => state.changePointNotHover
  );

  useEffect(() => {
    if (!mapRef.current || !centerMap?.center) {
      return;
    }

    mapRef.current.setCenter?.(centerMap.center, centerMap.zoom, {
      duration: centerMap.duration ?? 0,
    });
  }, [centerMap]);

  if (!centerMap) {
    return (
      <div className="contacts-map contacts-map--empty" aria-hidden="true" />
    );
  }

  return (
    <div className="contacts-map">
      <Map
        defaultState={centerMap}
        instanceRef={(value) => {
          mapRef.current = (value as YMapInstance | null) ?? null;
        }}
        width="100%"
        height="100%"
        className="contacts-map__canvas"
        onClick={(event) => changePointNotHover(event)}
      >
        {expanded ? (
          <>
            <SearchControl
              options={{ position: MAP_CONTROL_POSITION }}
              key="contacts-search"
            />
            <ZoomControl
              options={{ position: { left: 10, top: 60 } }}
              key="contacts-zoom"
            />
          </>
        ) : null}

        {zones?.map((zonePoint, index) => (
          <Placemark
            key={`placemark-${index}-${zonePoint.addr}-${zonePoint.xy_point.latitude},${zonePoint.xy_point.longitude}`}
            geometry={[
              zonePoint.xy_point.latitude,
              zonePoint.xy_point.longitude,
            ]}
            options={buildPlacemarkOptions(zonePoint.image)}
            onClick={() => changePointClick(zonePoint.addr)}
          />
        ))}

        {pointsZone?.map((point, key) => (
          <Polygon
            key={`${point.addr}-${key}`}
            geometry={[point.zone]}
            options={point.options}
            onClick={() => changePointClick(point.addr)}
          />
        ))}

        {locationUser ? (
          <Placemark
            geometry={locationUser}
            options={{ preset: 'islands#redStretchyIcon' }}
            properties={{ iconContent: 'Вы находитесь здесь' }}
          />
        ) : null}
      </Map>
    </div>
  );
}
