import { useEffect, useMemo, useRef } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { useCartStore, useHeaderStoreNew } from '@/components/store.js';

function parseXY(xy) {
  if (!xy) return null;

  try {
    const arr = typeof xy === 'string' ? JSON.parse(xy) : xy;
    if (!Array.isArray(arr) || arr.length < 2) return null;

    const lat = Number(arr[0]);
    const lon = Number(arr[1]);

    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
    return [lat, lon];
  } catch (e) {
    return null;
  }
}

function calcBounds(a, b) {
  return [
    [Math.min(a[0], b[0]), Math.min(a[1], b[1])],
    [Math.max(a[0], b[0]), Math.max(a[1], b[1])],
  ];
}

function svgToDataUrl(svg) {
  const cleaned = svg
    .replace(/\n/g, '')
    .replace(/\t/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cleaned)}`;
}

export default function CartConfirmMap({ open = true, checkNewOrder }) {
  const mapRef = useRef(null);

  const [matches] = useHeaderStoreNew((s) => [s.matches]);
  const [typePay] = useCartStore((s) => [s.typePay]);

  const wrapWidth = matches ? (typePay?.id === 'cash' ? '93%' : '100%') : '84%';
  const wrapMB = matches ? '3.4188034188vw' : '0.7220216606vw';
  const radius = matches ? '4.2735042735vw' : '1.4440433213vw';

  const mapH = matches ? 'clamp(120px, 18svh, 240px)'  : 'clamp(160px, 19vh, 300px)';

  const fromCoord = useMemo(() => parseXY(checkNewOrder?.point_xy), [checkNewOrder?.point_xy]);
  const toCoord = useMemo(() => parseXY(checkNewOrder?.order?.xy), [checkNewOrder?.order?.xy]);

  const dotHref = useMemo(() => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
        <!-- внешний красный ободок -->
        <circle cx="14" cy="14" r="11" fill="none" stroke="#cc0033" stroke-width="3"/>
        <!-- зазор (белый) -->
        <circle cx="14" cy="14" r="8" fill="white"/>
        <!-- внутренний красный кружок -->
        <circle cx="14" cy="14" r="5" fill="#cc0033"/>
      </svg>
    `;
    return svgToDataUrl(svg);
  }, []);

  const defaultState = useMemo(() => {
    if (fromCoord && toCoord) {
      return {
        center: [(fromCoord[0] + toCoord[0]) / 2, (fromCoord[1] + toCoord[1]) / 2],
        zoom: 12,
        controls: [],
      };
    }

    if (toCoord) return { center: toCoord, zoom: 13, controls: [] };
    if (fromCoord) return { center: fromCoord, zoom: 13, controls: [] };

    return { center: [53.195873, 50.100193], zoom: 12, controls: [] };
  }, [fromCoord, toCoord]);

  useEffect(() => {
    if (!open) return;
    const inst = mapRef.current;
    if (!inst) return;

    try {
      inst.behaviors?.disable('drag');
      inst.behaviors?.disable('scrollZoom');
      inst.behaviors?.disable('dblClickZoom');
      inst.behaviors?.disable('multiTouch');
      inst.behaviors?.disable('rightMouseButtonMagnifier');
    } catch (e) {}

    const delay = matches ? 220 : 60;

    setTimeout(() => {
      try {
        if (fromCoord && toCoord) {
          inst.setBounds(calcBounds(fromCoord, toCoord), {
            checkZoomRange: true,
            zoomMargin: matches ? 60 : 40,
          });
        }
        inst.container?.fitToViewport?.();
      } catch (e) {}
    }, delay);
  }, [open, fromCoord, toCoord, matches]);

  if (!open) return null;

  return (
    <div style={{ width: wrapWidth, margin: `0 auto ${wrapMB}` }}>
      <div
        style={{
          height: mapH,
          width: '100%',
          borderRadius: radius,
          overflow: 'hidden',
          background: '#f3f3f3',
          pointerEvents: 'none',
        }}
      >
        <YMaps query={{ lang: 'ru_RU', apikey: process.env.NEXT_PUBLIC_YANDEX_TOKEN_MAP }}>
          <Map
            defaultState={defaultState}
            instanceRef={mapRef}
            width="100%"
            height="100%"
            style={{ height: mapH }}
            options={{ suppressMapOpenBlock: true }}
          >
            {/* Кафе */}
            {fromCoord ? (
              <Placemark
                geometry={fromCoord}
                options={{
                  iconLayout: 'default#image',
                  iconImageHref: '/Favikon.png',
                  iconImageSize: matches ? [56, 56] : [44, 44],
                  iconImageOffset: matches ? [-28, -56] : [-22, -44],
                }}
              />
            ) : null}

            {/* Точка доставки */}
            {toCoord ? (
               <Placemark
                geometry={toCoord}
                options={{
                  iconLayout: 'default#image',
                  iconImageHref: dotHref,
                  iconImageSize: [26, 26],
                  iconImageOffset: [-13, -13],
                }}
              />
            ) : null}
          </Map>
        </YMaps>
      </div>
    </div>
  );
}



