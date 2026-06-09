'use client';

import { useEffect, useRef } from 'react';
import { Map, Placemark, Polygon, YMaps } from '@pbe/react-yandex-maps';
import type { AddressPickerZone } from '../model/types';

type AddressPickerMapProps = {
  open: boolean;
  center: [number, number] | null;
  point: [number, number] | null;
  zoom: number;
  zones: AddressPickerZone[];
  disabled?: boolean;
  onPick: (coords: [number, number]) => Promise<void> | void;
};

const MAP_POINT_OPTIONS = {
  iconLayout: 'default#image',
  iconImageHref: '/Frame.png',
  iconImageSize: [35, 50],
  iconImageOffset: [-15, -50],
};

const MAP_POLYGON_OPTIONS = {
  fillColor: 'rgba(53, 178, 80, 0.15)',
  strokeColor: '#35B250',
  strokeWidth: 5,
  hideIconOnBalloonOpen: false,
};

export function AddressPickerMap({
  open,
  center,
  point,
  zoom,
  zones,
  disabled = false,
  onPick,
}: AddressPickerMapProps) {
  const mapRef = useRef<{
    setCenter?: (
      coords: [number, number],
      zoom?: number,
      options?: Record<string, unknown>
    ) => void;
    container?: {
      fitToViewport?: () => void;
    };
    events?: {
      add?: (name: string, handler: (event: unknown) => void) => void;
      remove?: (name: string, handler: (event: unknown) => void) => void;
    };
  } | null>(null);

  useEffect(() => {
    if (!open || !mapRef.current?.container?.fitToViewport) {
      return;
    }

    const timer = window.setTimeout(() => {
      mapRef.current?.container?.fitToViewport?.();
    }, 60);

    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!center || !mapRef.current?.setCenter) {
      return;
    }

    mapRef.current.setCenter(center, zoom, {
      duration: 180,
      checkZoomRange: true,
    });
  }, [center, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.events?.add || !map.events.remove || disabled) {
      return;
    }

    const handleClick = (event: unknown) => {
      const coords = (
        event as {
          get?: (name: string) => unknown;
        }
      )?.get?.('coords');

      if (!Array.isArray(coords) || coords.length < 2) {
        return;
      }

      void onPick([Number(coords[0]), Number(coords[1])]);
    };

    map.events.add('click', handleClick);

    return () => {
      map.events?.remove?.('click', handleClick);
    };
  }, [disabled, onPick]);

  return (
    <div className="address-picker-modal__map-shell">
      <YMaps
        query={{
          lang: 'ru_RU',
          apikey: process.env.NEXT_PUBLIC_YANDEX_TOKEN_MAP,
        }}
      >
        <Map
          defaultState={{
            center: center ?? [53.1959, 50.1008],
            zoom,
            controls: [],
          }}
          instanceRef={(value) => {
            mapRef.current = value ?? null;
          }}
          width="100%"
          height="100%"
          className="address-picker-modal__map-canvas"
        >
          {zones.map((zone, index) => (
            <Polygon
              key={String(index)}
              geometry={[zone.zone]}
              options={MAP_POLYGON_OPTIONS}
            />
          ))}

          {point ? (
            <Placemark geometry={point} options={MAP_POINT_OPTIONS} />
          ) : null}
        </Map>
      </YMaps>
    </div>
  );
}
