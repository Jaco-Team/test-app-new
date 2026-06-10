'use client';

import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { api } from '@src/shared/api';
import { captureMapStateIssue } from '@src/shared/lib/monitoring/sentryAccount';
import { withYMapsReady } from '@src/shared/lib/maps/yandexMaps';
import { reuseAppStore } from '@src/shared/store/hotStore';
import { BREAKPOINTS } from '@src/shared/ui/foundation/breakpoints';
import type { IMapState, IPlacemarkOptions } from 'yandex-maps';

export type MapCenter = {
  center: [number, number];
  zoom: number;
  controls: IMapState['controls'];
  behaviors?: IMapState['behaviors'];
  duration?: number;
};

export type ContactPolygonOptions = {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  fillOpacity?: number;
};

export type ContactZone = {
  addr: string;
  raion?: string;
  phone?: string;
  color?: string | null;
  image?: IPlacemarkOptions['iconLayout'];
  zone_origin?: string;
  xy_point: { latitude: number; longitude: number };
  xy_center_map?: { latitude: number; longitude: number };
};

export type ContactPolygonZone = {
  zone: number[][];
  addr: string;
  options: ContactPolygonOptions;
};

const POLYGON_OPTIONS_DEFAULT: ContactPolygonOptions = {
  fillColor: 'rgba(53, 178, 80, 0.15)',
  strokeColor: '#35B250',
  strokeWidth: 5,
  fillOpacity: 1,
};

const POLYGON_OPTIONS_ACTIVE: ContactPolygonOptions = {
  strokeColor: '#DD1A32',
  fillColor: 'rgba(221, 26, 50, 0.15)',
  fillOpacity: 1,
  strokeWidth: 5,
};

const POLYGON_OPTIONS_NONE: ContactPolygonOptions = {
  fillColor: '#000000',
  strokeColor: '#000000',
  fillOpacity: 0.001,
  strokeWidth: 0,
};

function mapZoomForViewport(): number {
  if (typeof window === 'undefined') {
    return 11.5;
  }

  return window.innerWidth < 601 ? 10.6 : 11.5;
}

function pointZoomForViewport(): number {
  if (typeof window === 'undefined') {
    return 12;
  }

  return window.innerWidth < 601 ? 11 : 12;
}

function shouldAutoSelectPoint(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  return window.innerWidth < BREAKPOINTS.expandedMin;
}

function buildPointsZone(zones: ContactZone[]): ContactPolygonZone[] {
  const pointsZone: ContactPolygonZone[] = [];

  zones.forEach((point) => {
    const origin = point.zone_origin;
    if (!origin || origin.length === 0) {
      return;
    }

    try {
      pointsZone.push({
        zone: JSON.parse(origin) as number[][],
        addr: point.addr,
        options: POLYGON_OPTIONS_DEFAULT,
      });
    } catch {
      captureMapStateIssue('Failed to parse contacts zone_origin', {
        source: 'useContactStore.buildPointsZone',
        addr: point.addr,
      });
    }
  });

  return pointsZone;
}

export type ContactState = {
  myAddr: ContactZone[];
  phone: string;
  disable: boolean;
  point: string;
  openModalChoose: boolean;
  locationUser: [number, number] | null;
  zones: ContactZone[] | null;
  centerMap: MapCenter | null;
  pointsZone: ContactPolygonZone[] | null;
  getMap: (module: string, city: string) => Promise<void>;
  setActiveModalChoose: (active: boolean) => void;
  choosePointMap: (point: string | false) => void;
  changePointClick: (addr: string) => void;
  changePointNotHover: (event: { get?: (name: string) => unknown }) => void;
  disablePointsZone: () => void;
  getUserPosition: () => void;
  clickPhoneMobile: () => void;
};

export const useContactStore = reuseAppStore(
  'contact',
  createWithEqualityFn<ContactState>(
    (set, get) => ({
      myAddr: [],
      phone: '',
      disable: true,
      point: '',
      openModalChoose: false,
      locationUser: null,
      zones: null,
      centerMap: null,
      pointsZone: null,

      getMap: async (module, city) => {
        if (!city) {
          return;
        }

        const json = await api(module, {
          type: 'get_addr_zone_web',
          city_id: city,
        });

        if (!Array.isArray(json?.zones) || json.zones.length === 0) {
          captureMapStateIssue('Contacts map response does not contain zones', {
            source: 'useContactStore.getMap',
            city,
            module,
          });
          set({
            centerMap: null,
            zones: [],
            pointsZone: [],
            myAddr: [],
            phone: '',
          });
          return;
        }

        const zones = (json.zones as ContactZone[]).map((point) => ({
          ...point,
          image: 'default#image',
        }));
        const pointsZone = buildPointsZone(zones);
        const first = zones[0];

        const myAddr = zones.filter(
          (value, index, self) =>
            index === self.findIndex((item) => item.addr === value.addr)
        );

        set({
          centerMap: {
            center: [
              Number(first?.xy_center_map?.latitude ?? 0),
              Number(first?.xy_center_map?.longitude ?? 0),
            ],
            zoom: mapZoomForViewport(),
            controls: [],
            behaviors: [
              'drag',
              'dblClickZoom',
              'rightMouseButtonMagnifier',
              'multiTouch',
            ],
          },
          zones,
          pointsZone,
          phone: String(first?.phone ?? ''),
          myAddr,
        });

        if (shouldAutoSelectPoint()) {
          window.setTimeout(() => {
            get().choosePointMap(false);
          }, 300);
        }
      },

      setActiveModalChoose: (active) => set({ openModalChoose: active }),

      choosePointMap: (point) => {
        const pointList = get().myAddr;

        if (point) {
          const pointFind = pointList.find((item) => item.addr === point);
          set({ openModalChoose: false });
          get().changePointClick(pointFind?.addr ?? point);
          return;
        }

        const firstPoint = pointList[0];
        if (!firstPoint?.addr) {
          captureMapStateIssue('Contacts map has no default point to select', {
            source: 'useContactStore.choosePointMap',
          });
          return;
        }

        get().changePointClick(firstPoint.addr);
      },

      changePointClick: (addr) => {
        if (
          !withYMapsReady(
            () => {
              const disable = get().disable;
              const zones = (get().zones ?? []).map((item) => {
                if (item.addr !== addr) {
                  return { ...item, image: 'default#image' as const };
                }

                const ymapsApi = (
                  window as typeof window & {
                    ymaps?: {
                      templateLayoutFactory?: {
                        createClass: (html: string) => unknown;
                      };
                    };
                  }
                ).ymaps;

                const img = (ymapsApi?.templateLayoutFactory?.createClass(
                  "<div class='my-img'><img alt='' src='/Favikon.png' /></div>"
                ) ?? 'default#image') as IPlacemarkOptions['iconLayout'];

                return { ...item, image: img };
              });

              const selected = zones.find((item) => item.addr === addr);
              if (!selected) {
                return;
              }

              const center: [number, number] = [
                Number(selected.xy_point.latitude),
                Number(selected.xy_point.longitude),
              ];

              const pointsZone = (get().pointsZone ?? []).map((item) => {
                if (!disable) {
                  return item;
                }

                return {
                  ...item,
                  options:
                    item.addr === addr
                      ? POLYGON_OPTIONS_ACTIVE
                      : POLYGON_OPTIONS_DEFAULT,
                };
              });

              const myAddr = get().myAddr.map((item) => ({
                ...item,
                color: item.addr === addr ? '#DD1A32' : null,
              }));

              set({
                pointsZone,
                zones,
                myAddr,
                point: addr,
                centerMap: {
                  center,
                  zoom: pointZoomForViewport(),
                  controls: [],
                  behaviors: [
                    'drag',
                    'dblClickZoom',
                    'rightMouseButtonMagnifier',
                    'multiTouch',
                  ],
                  duration: 1000,
                },
              });
            },
            {
              source: 'useContactStore.changePointClick',
              addr,
            }
          )
        ) {
          return;
        }
      },

      changePointNotHover: (event) => {
        const target = event.get?.('target') as
          | { getType?: () => string }
          | undefined;
        const type = target?.getType?.();

        if (type !== 'yandex#map') {
          return;
        }

        const disable = get().disable;
        const zones = (get().zones ?? []).map((item) => ({
          ...item,
          image: 'default#image',
        }));
        const myAddr = get().myAddr.map((addr) => ({ ...addr, color: null }));
        const pointsZone = (get().pointsZone ?? []).map((item) => ({
          ...item,
          options: disable ? POLYGON_OPTIONS_DEFAULT : item.options,
        }));

        set({ myAddr, zones, pointsZone });
      },

      disablePointsZone: () => {
        const nextDisable = !get().disable;
        set({ disable: nextDisable });

        const myAddr = get().myAddr;
        const pointsZone = (get().pointsZone ?? []).map((item) => {
          if (nextDisable) {
            const chooseAddr = myAddr.find((addr) => addr.color);
            return {
              ...item,
              options:
                chooseAddr?.addr === item.addr
                  ? POLYGON_OPTIONS_ACTIVE
                  : POLYGON_OPTIONS_DEFAULT,
            };
          }

          return { ...item, options: POLYGON_OPTIONS_NONE };
        });

        set({ pointsZone });
      },

      getUserPosition: () => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
          return;
        }

        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            set({ locationUser: [coords.latitude, coords.longitude] });
            window.setTimeout(() => {
              set({ locationUser: null });
            }, 300000);
          },
          ({ message }) => {
            window.alert(`Не удалось определить местоположение. ${message}`);
          },
          { enableHighAccuracy: true }
        );
      },

      clickPhoneMobile: () => {
        const phone = get().phone;
        if (!phone || typeof window === 'undefined') {
          return;
        }

        window.location.href = `tel:${phone.split(/[\s,(),-]+/).join('')}`;
      },
    }),
    shallow
  )
);
