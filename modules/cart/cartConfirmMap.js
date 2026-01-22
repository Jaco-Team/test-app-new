import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { useCartStore, useHeaderStoreNew } from '@/components/store.js';

const BRAND = '#cc0033';

function parseXY(xy) {
  if (!xy) return null;
  try {
    const arr = typeof xy === 'string' ? JSON.parse(xy) : xy;
    if (!Array.isArray(arr) || arr.length < 2) return null;

    const lat = Number(arr[0]);
    const lon = Number(arr[1]);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;

    return [lat, lon];
  } catch {
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
  const cleaned = svg.replace(/\n/g, '').replace(/\t/g, '').replace(/\s{2,}/g, ' ').trim();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cleaned)}`;
}

function makeTargetSvg() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="12" fill="none" stroke="${BRAND}" stroke-width="6"/>
      <circle cx="16" cy="16" r="8.5" fill="white"/>
      <circle cx="16" cy="16" r="5.5" fill="${BRAND}"/>
    </svg>
  `;
}

export default function CartConfirmMap({ open = true, checkNewOrder }) {
  const mapRef = useRef(null);
  const fittedRef = useRef(false);
  const readyRef = useRef(false);

  const [visible, setVisible] = useState(false);

  const [matches] = useHeaderStoreNew((s) => [s.matches]);
  const [typePay] = useCartStore((s) => [s.typePay]);

  const wrapWidth = matches ? (typePay?.id === 'cash' ? '93%' : '100%') : '84%';
  const wrapMB = matches ? '3.4188034188vw' : '0.7220216606vw';
  const radius = matches ? '4.2735042735vw' : '1.4440433213vw';
 
  const mapH = matches ? 'clamp(120px, 18svh, 240px)' : 'clamp(160px, 19vh, 300px)';

  const fromCoord = useMemo(() => parseXY(checkNewOrder?.point_xy), [checkNewOrder?.point_xy]);
  const toCoord = useMemo(() => parseXY(checkNewOrder?.order?.xy), [checkNewOrder?.order?.xy]);

  const cafeSize = matches ? 32 : 34;
  const cafeOffset = useMemo(() => {
    const half = Math.round(cafeSize / 2);
    const tweakY = 2;
    return [-half, -half + tweakY];
  }, [cafeSize]);

  const targetHref = useMemo(() => svgToDataUrl(makeTargetSvg()), []);
  const targetSize = matches ? 28 : 28;

  const initialState = useMemo(() => {
    if (fromCoord && toCoord) {
      return {
        center: [(fromCoord[0] + toCoord[0]) / 2, (fromCoord[1] + toCoord[1]) / 2],
        zoom: 8,
        controls: [],
      };
    }
    if (toCoord) return { center: toCoord, zoom: 13, controls: [] };
    if (fromCoord) return { center: fromCoord, zoom: 13, controls: [] };
    return { center: [53.195873, 50.100193], zoom: 12, controls: [] };
  }, [fromCoord, toCoord]);

  const disableBehaviors = useCallback((m) => {
    try {
      m.behaviors?.disable('drag');
      m.behaviors?.disable('scrollZoom');
      m.behaviors?.disable('dblClickZoom');
      m.behaviors?.disable('multiTouch');
      m.behaviors?.disable('rightMouseButtonMagnifier');
    } catch {}
  }, []);

  const fitOnce = useCallback(() => {
    const m = mapRef.current;
    if (!open || !m) return;
    if (!readyRef.current) return;
    if (fittedRef.current) return;

    setVisible(false);
    disableBehaviors(m);

    const delay = matches ? 260 : 120;

    setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            try { m.container?.fitToViewport?.(); } catch {}

            if (fromCoord && toCoord) {
              const bounds = calcBounds(fromCoord, toCoord);

              const top = cafeSize + (matches ? 10 : 10);
              const bottom = matches ? 34 : 28;
              const side = matches ? 12 : 12;

              const onEnd = () => {
                try { m.events?.remove('actionend', onEnd); } catch {}
                fittedRef.current = true;
                setVisible(true);
              };

              try { m.events?.add('actionend', onEnd); } catch {}

              m.setBounds(bounds, {
                checkZoomRange: true,
                duration: 0,
                zoomMargin: [top, side, bottom, side],
              });

              setTimeout(() => {
                if (!fittedRef.current) {
                  fittedRef.current = true;
                  setVisible(true);
                }
              }, matches ? 700 : 450);

              return;
            }

            if (toCoord) m.setCenter(toCoord, 13, { duration: 0 });
            else if (fromCoord) m.setCenter(fromCoord, 13, { duration: 0 });

            fittedRef.current = true;
            setVisible(true);
          } catch {
            fittedRef.current = true;
            setVisible(true);
          }
        });
      });
    }, delay);
  }, [open, matches, fromCoord, toCoord, cafeSize, disableBehaviors]);

  useEffect(() => {
    fittedRef.current = false;
    readyRef.current = false;
    setVisible(false);
  }, [open, fromCoord, toCoord]);

  if (!open) return null;

  return (
    <div style={{ width: wrapWidth, margin: `0 auto ${wrapMB}` }}>
      <div
        style={{
          height: mapH,
          width: '100%',
          borderRadius: radius,
          overflow: 'hidden',
          pointerEvents: 'none',
          position: 'relative',
          background: '#ebebeb',
        }}
      >
        {/* SKELETON поверх карты, пока visible=false */}
        {!visible ? (
          <div
            className="cc_map_skeleton"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              background: '#ebebeb',
              overflow: 'hidden',
            }}
          >
            {/* лёгкая shimmer-полоска */}
            <div
              className="cc_map_shimmer"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '40%',
                transform: 'translateX(-60%)',
                background:
                  'linear-gradient(90deg, rgba(235,235,235,0) 0%, rgba(255,255,255,0.55) 50%, rgba(235,235,235,0) 100%)',
              }}
            />
          </div>
        ) : null}

        {/* КАРТА (плавное появление) */}
        <div style={{ height: '100%', opacity: visible ? 1 : 0, transition: 'opacity 160ms ease' }}>
          <YMaps query={{ lang: 'ru_RU', apikey: process.env.NEXT_PUBLIC_YANDEX_TOKEN_MAP }}>
            <Map
              defaultState={initialState}
              instanceRef={(ref) => {
                mapRef.current = ref;
                fitOnce();
              }}
              onLoad={() => {
                readyRef.current = true;
                fitOnce();
              }}
              width="100%"
              height="100%"
              style={{ height: mapH }}
              options={{
                suppressMapOpenBlock: true,
                avoidFractionalZoom: true,
              }}
            >
              {/* Кафе */}
              {fromCoord ? (
                <Placemark
                  geometry={fromCoord}
                  options={{
                    iconLayout: 'default#image',
                    iconImageHref: '/Favikon.png',
                    iconImageSize: [cafeSize, cafeSize],
                    iconImageOffset: cafeOffset,
                  }}
                />
              ) : null}

              {/* Точка доставки */}
              {toCoord ? (
                <Placemark
                  geometry={toCoord}
                  options={{
                    iconLayout: 'default#image',
                    iconImageHref: targetHref,
                    iconImageSize: [targetSize, targetSize],
                    iconImageOffset: [-targetSize / 2, -targetSize / 2],
                  }}
                />
              ) : null}
            </Map>
          </YMaps>
        </div>

        <style jsx global>{`
          .cc_map_shimmer {
            animation: ccMapShimmer 1.1s ease-in-out infinite;
          }
          @keyframes ccMapShimmer {
            0% { transform: translateX(-60%); }
            100% { transform: translateX(260%); }
          }
        `}</style>
        
      </div>
    </div>
  );
}





