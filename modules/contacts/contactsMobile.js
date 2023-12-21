import { useRef, useEffect } from 'react';

import Link from 'next/link';

import { YMaps, Map, Placemark, Polygon } from '@pbe/react-yandex-maps';

import { useContactStore, useCitiesStore, useHeaderStore } from '@/components/store.js';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { MapContactsMobile, LocationIconMobile, VectorRightMobile, LocationMapMobile } from '@/ui/Icons.js';

import { SwitchContactsMobile as MySwitch } from '@/ui/MySwitch.js';

import ModalError from '@/modules/cartForm/modalError';

export default function ContactsPageMobile() {
  //console.log('render ContactsPageMobile');

  const ref = useRef();

  const [thisCityRu] = useCitiesStore((state) => [state.thisCityRu]);

  const [setActiveModalCityList] = useHeaderStore((state) => [state.setActiveModalCityList]);

  const [point, phone, disablePointsZone, disable, setActiveModalChoose, getUserPosition, center_map, zones, points_zone, changePointClick, location_user] = useContactStore((state) => [state.point, state.phone, state.disablePointsZone, state.disable, state.setActiveModalChoose, state.getUserPosition, state.center_map, state.zones, state.points_zone, state.changePointClick, state.location_user]);

  useEffect(() => {
    if(ref.current && center_map?.center){
      ref.current.setCenter([zones[0].xy_center_map['latitude'], zones[0].xy_center_map['longitude']]);
    }
  }, [zones])

  return (
    <Box sx={{ display: { xs: 'block', md: 'block', lg: 'none' } }} className="ContactsMobile" >

      {!center_map ? null :
        <div style={{ minHeight: '100vw', width: '100%', marginBottom: '10.25641025641vw' }} >
          <YMaps query={{ lang: 'ru_RU', apikey: 'ae2bad1f-486e-442b-a9f7-d84fff6296db' }}>
            <Map 
              defaultState={center_map} 
              instanceRef={ref} 
              width="100%" 
              height="100%" 
              style={{ minHeight: '100vw' }}
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
                    onClick={() => changePointClick(point.addr, 'mobile')}
                  />
                ))
              }

              {points_zone?.map((point, key) => (
                  <Polygon key={key}
                    geometry={[point.zone]}
                    options={point.options}
                    onClick={() => changePointClick(point.addr, 'mobile')}
                  />
                ))
              }

              {!location_user ? null :
                <Placemark
                  geometry={location_user}
                  options={{ 
                    preset: 'islands#redStretchyIcon',
                  }} 
                  properties={{
                    iconContent: 'Вы находитесь здесь'
                  }}
                />
              }

            </Map>
          </YMaps>
        </div>
      }
      
      <div className="ContactsLocation">
        <LocationMapMobile onClick={getUserPosition} />
      </div>

      <div className="ContactsMobileContainer">
        <div className="ContactPoint" onClick={() => setActiveModalCityList(true)}>
          <div className="spanContainer">
            <Typography component="span">
              <MapContactsMobile />
            </Typography>
            <Typography component="span">{thisCityRu}</Typography>
          </div>

          <div className="svgContainer">
            <VectorRightMobile />
          </div>
        </div>

        <div className="ContactPoint" style={{ marginBottom: '5.982905982906vw' }} onClick={() => setActiveModalChoose(true)}>
          <div className="spanContainer">
            <Typography component="span">
              <LocationIconMobile />
            </Typography>
            <Typography component="span">{point}</Typography>
          </div>
          <div className="svgContainer">
            <VectorRightMobile />
          </div>
        </div>

        <div className="ContactsInfo">
          <Typography component="span">Работаем ежедневно с 10:00 до 21:30</Typography>
        </div>

        <div className="ContactsInfo" style={{ marginBottom: '2.5641025641026vw' }}>
          <Typography component="span">Позвонить и заказать:</Typography>
        </div>

        <div className="ContactsPhone">
          <Link href={`tel:${phone.split(/[\s,(),-]+/).join('')}`} component="span">{phone}</Link>
        </div>

        <div className="ContactsLine"></div>

        <div className="ContactsSwitch">
          <Typography component="span">Показать зону доставки</Typography>
          <MySwitch checked={disable} onClick={disablePointsZone} />
        </div>
      </div>

      <ModalError />
    </Box>
  );
}
