'use client';

import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { api } from '@src/shared/api';
import { captureMapStateIssue } from '@src/shared/lib/monitoring/sentryAccount';
import { reuseAppStore } from '@src/shared/store/hotStore';

export type MapCenter = {
  center: [number, number];
  zoom: number;
  controls: unknown[];
};

export type ContactState = {
  zones: unknown[] | null;
  centerMap: MapCenter | null;
  pointsZone: unknown[] | null;
  phone: string;
  getMap: (module: string, city: string) => Promise<void>;
};

export const useContactStore = reuseAppStore(
  'contact',
  createWithEqualityFn<ContactState>(
    (set) => ({
      zones: null,
      centerMap: null,
      pointsZone: null,
      phone: '',

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
            phone: '',
          });
          return;
        }

        const zones = json.zones as Record<string, unknown>[];
        zones.forEach((point) => {
          point.image = 'default#image';
        });

        const pointsZone: unknown[] = [];
        zones.forEach((point) => {
          const sub = point.sub_points as unknown[] | undefined;
          if (Array.isArray(sub)) {
            sub.forEach((row) => pointsZone.push(row));
          }
        });

        const zoom =
          typeof window !== 'undefined' && window.innerWidth < 601
            ? 10.6
            : 11.5;
        const first = zones[0] as {
          xy_center_map?: { latitude?: number; longitude?: number };
          phone?: string;
        };

        set({
          centerMap: {
            center: [
              Number(first?.xy_center_map?.latitude ?? 0),
              Number(first?.xy_center_map?.longitude ?? 0),
            ],
            zoom,
            controls: [],
          },
          zones,
          pointsZone,
          phone: String(first?.phone ?? ''),
        });
      },
    }),
    shallow
  )
);
