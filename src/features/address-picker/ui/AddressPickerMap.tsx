'use client';

import { useEffect, useMemo, useState } from 'react';
import { Map, Placemark, Polygon } from '@pbe/react-yandex-maps';
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

type YMapInstance = {
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
  const [mapInstance, setMapInstance] = useState<YMapInstance | null>(null);

  const zoneGeometry = useMemo(
    () => zones.map((zone) => zone.zone).filter((zone) => zone.length > 0),
    [zones]
  );

  useEffect(() => {
    if (!open || !mapInstance?.container?.fitToViewport) {
      return;
    }

    const timer = window.setTimeout(() => {
      mapInstance.container?.fitToViewport?.();
    }, 60);

    return () => window.clearTimeout(timer);
  }, [mapInstance, open]);

  useEffect(() => {
    if (!center || !mapInstance?.setCenter) {
      return;
    }

    mapInstance.setCenter(center, zoom, {
      duration: 180,
      checkZoomRange: true,
    });
  }, [center, mapInstance, zoom]);

  useEffect(() => {
    if (!mapInstance?.events?.add || !mapInstance.events.remove || disabled) {
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

    mapInstance.events.add('click', handleClick);

    return () => {
      mapInstance.events?.remove?.('click', handleClick);
    };
  }, [disabled, mapInstance, onPick]);

  return (
    <div className="address-picker-modal__map-shell">
      <Map
        defaultState={{
          center: center ?? [53.1959, 50.1008],
          zoom,
          controls: [],
        }}
        instanceRef={(value) => {
          setMapInstance((value as YMapInstance | null) ?? null);
        }}
        width="100%"
        height="100%"
        className="address-picker-modal__map-canvas"
      >
        {zoneGeometry.length > 0 ? (
          <Polygon geometry={zoneGeometry} options={MAP_POLYGON_OPTIONS} />
        ) : null}

        {point ? (
          <Placemark geometry={point} options={MAP_POINT_OPTIONS} />
        ) : null}
      </Map>
    </div>
  );
}
