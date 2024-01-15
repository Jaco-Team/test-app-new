import { useRef, useEffect } from 'react';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import { useCartStore, useCitiesStore } from '@/components/store.js';

import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { roboto } from '@/ui/Font.js';
import { LocationCartMobile } from '@/ui/Icons.js';

export default function CartMapPoints() {
  //console.log('render CartMapPoints');

  const ref = useRef();

  const [openMapPoints, setActiveCartMap, orderPic, center_map, zones, changePointClick] = useCartStore((state) => [state.openMapPoints, state.setActiveCartMap, state.orderPic, state.center_map, state.zones, state.changePointClick]);
  const [thisCityRu] = useCitiesStore((state) => [state.thisCityRu]);

  useEffect(() => {
    if(ref.current && center_map?.center){
      ref.current.setCenter([zones[0].xy_center_map['latitude'], zones[0].xy_center_map['longitude']]);
    }
  }, [zones]);

  return (
    <SwipeableDrawer
      anchor={'bottom'}
      open={openMapPoints}
      onClose={() => setActiveCartMap(false)}
      onOpen={() => setActiveCartMap(true)}
      id="CartMapPoints"
      className={roboto.variable}
      disableSwipeToOpen
    >
      <div className="ContainerCartMap">
        <div className="Line"></div>
        <div className="loginHeader">
          <Typography component="span">Кафе в городе {thisCityRu}</Typography>
        </div>

        {!center_map ? null :
          <div style={{ minHeight: '80.34188034188vw', width: '100%', marginBottom: '6.8376068376068vw' }} >
            <YMaps query={{ lang: 'ru_RU', apikey: 'f600fbbd-6500-4bf7-a0ab-ec9336f6c7d8' }}>
              <Map 
                defaultState={center_map} 
                instanceRef={ref} 
                width="100%" 
                height="100%" 
                style={{ minHeight: '80.34188034188vw' }}
              >

                {zones?.map((point, key) => (
                    <Placemark key={key}
                      geometry={[point.xy_point.latitude, point.xy_point.longitude]}
                      options={{ 
                        iconLayout: point.image, 
                        iconImageHref: '/Favikon.png', 
                        iconImageSize: [65, 65], 
                        iconImageOffset: [-12, -20], 
                      }} 
                      onClick={() => changePointClick(point.addr)}
                    />
                  ))
                }

              </Map>
            </YMaps>
          </div>
        }

        <div className="CartPoint">
          <Typography component="span"><LocationCartMobile /></Typography>
          <Typography component="span">{orderPic?.name}</Typography>
        </div>

        <Button className="CartButton" variant="contained" onClick={() => setActiveCartMap(false)}>
          <span>Заберу здесь</span>
        </Button>
      </div>
    </SwipeableDrawer>
  );
}
