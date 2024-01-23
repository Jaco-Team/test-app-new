import React, { useEffect, useState, useRef } from 'react';

import MySwitch from '@/ui/Switch.js';

import { YMaps, Map, Placemark, Polygon } from '@pbe/react-yandex-maps';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';

import { roboto } from '@/ui/Font.js';
import { IconClose, PencilModalAddrIcon, HomeModalAddrIcon } from '@/ui/Icons.js';
import MyTextInput from '@/ui/MyTextInput';
import MyAutocomplete from '@/ui/MyAutocomplete';
import MySelect from '@/ui/MySelect';

import { useProfileStore, useHeaderStore } from '@/components/store.js';

export default function ModalAddr(){
  const ref2 = useRef();

  const [ clearAddr, chooseAddrStreet, center_map, zones, isOpenModalAddr, closeModalAddr, allStreets, checkStreet, saveNewAddr, infoAboutAddr, cityList, updateStreetList, active_city, updateAddr ] = 
    useProfileStore( state => [ state.clearAddr, state.chooseAddrStreet, state.center_map, state.zones, state.isOpenModalAddr, state.closeModalAddr, state.allStreets, state.checkStreet, state.saveNewAddr, state.infoAboutAddr, state.cityList, state.updateStreetList, state.active_city, state.updateAddr ] );

  const [ token, signOut ] = useHeaderStore( state => [ state.token, state.signOut ] )

  const [ street, setStreet ] = useState('');
  const [ street_, setStreet_ ] = useState('');
  const [ home, setHome ] = useState( '' );
  const [ pd, setPd ] = useState( '' );
  const [ domophome, setDomophome ] = useState(true);
  const [ et, setEt ] = useState('');
  const [ kv, setKv ] = useState('');
  const [ comment, setComment ] = useState('');
  const [ check, setCheck ] = useState(false);
  const [ nameAddr, setNameAddr ] = useState('');
  const [ cityID, setCityID ] = useState(active_city);

  useEffect(() => {
    if( street && street.length > 0 && home.length > 0 ){
      checkStreet(street, home, pd, cityID);
    }
  }, [street, home, pd]);

  useEffect( () => {
    if( infoAboutAddr ){
      setStreet_(infoAboutAddr.street);
      setStreet({id: infoAboutAddr?.id, name: infoAboutAddr?.street });
      setHome(infoAboutAddr.home);
      setPd(infoAboutAddr.pd);
      setDomophome(infoAboutAddr.domophome ? true : false);
      setEt(infoAboutAddr.et);
      setKv(infoAboutAddr.kv);
      setComment(infoAboutAddr.comment);
      setCheck( parseInt(infoAboutAddr.is_main) == 1 ? true : false )
      setNameAddr(infoAboutAddr.name)
      setCityID(infoAboutAddr.city_id);
    }else{
      setHome('');
      setStreet('');
      setStreet_('')
      
      setPd('');
      setDomophome(true);
      setEt('');
      setKv('');
      setComment('');
      setCheck(false)
    }
  }, [infoAboutAddr] )

  useEffect( () => {
    updateStreetList(cityID);
  }, [cityID] )

  function chengeCity(city){
    setCityID(city);
    clearAddr();
  }

  //???
  useEffect( () => {
    setCityID(active_city);
  }, [active_city] )

  useEffect(() => {
    if( isOpenModalAddr == false ){
      setStreet('');
      setStreet_('')
      setHome('');
      setPd('');
      setDomophome(true);
      setEt('');
      setKv('');
      setComment('');
      setCheck(false)
      setNameAddr('');
      setCityID(active_city)
    }else{
      setTimeout( () => {
        //render_map_model();
      }, 1000 )
    }
  }, [isOpenModalAddr]);

  let new_zone = [];

  zones.map( (item, key) => {
    new_zone.push( item.zone )
  })

  useEffect( () => {
    if( ref2.current && center_map?.center ){
      ref2.current.setCenter([zones[0].xy_center_map['latitude'], zones[0].xy_center_map['longitude']]);
    }
  }, [zones] )

  useEffect( () => {
    if( ref2.current && chooseAddrStreet?.xy ){
      ref2.current.setCenter(chooseAddrStreet?.xy);
    }
  }, [chooseAddrStreet] )

  return (
    <Dialog
      onClose={closeModalAddr}
      className={'modalAddrPC ' + roboto.variable}
      open={isOpenModalAddr}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
    >
      <DialogContent>
        <div className="container">
          <IconButton style={{position: 'absolute', left: '-3.3vw', paddingTop: '0', backgroundColor: 'transparent'}} onClick={closeModalAddr}>
            <IconClose style={{width: '2.1661vw', height: '2.1661vw', overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)'}}/>
          </IconButton>

          <div className='mainGrid'>
            <div className='map'>
              <YMaps query={{ lang: 'ru_RU', apikey: 'f600fbbd-6500-4bf7-a0ab-ec9336f6c7d8' }}>
                <Map defaultState={center_map} instanceRef={ref2} width="100%" height="100%">

                  { !chooseAddrStreet || Object.entries(chooseAddrStreet).length === 0 ? false :
                    <Placemark geometry={chooseAddrStreet?.xy} options={{ iconLayout: 'default#image', iconImageHref: '/Frame.png', iconImageSize: [35, 50], iconImageOffset: [-15, -50] }} />
                  }

                  <Polygon
                    geometry={new_zone}
                    options={{
                      fillColor: 'rgba(53, 178, 80, 0.15)',
                      strokeColor: '#35B250',
                      strokeWidth: 5,
                      hideIconOnBalloonOpen: false
                    }}
                  />
                </Map>
              </YMaps>
            </div>
            <div className='form'>

              <div className='nameAddr'>
                <MyTextInput variant="standard" placeholder={'Новый адрес'} inputAdornment={ <PencilModalAddrIcon /> } value={nameAddr} func={ e => setNameAddr(e.target.value) } />
              </div>
              <div className='city'>
                <MySelect variant="standard" className="city" data={cityList} value={cityID} func={ e => chengeCity(e.target.value) } />
              </div>
              <div className='street'>
                <MyAutocomplete placeholder={'Улица'} className="city" data={allStreets} val={street_} onChange={ val => setStreet(val) } variant={'standard'} />
              </div>
              <div className='street_dop_2'>
                <MyTextInput variant="standard" value={home} placeholder={'Дом'} func={ e => setHome(e.target.value) } />
                <MyTextInput variant="standard" value={pd} placeholder={'Подъезд'} type={'nember'} func={ e => setPd(e.target.value) } />
              </div>
              <div className='street_dop_2'>
                <MyTextInput variant="standard" value={et} placeholder={'Этаж'} type={'nember'} func={ e => setEt(e.target.value) } />
                <MyTextInput variant="standard" value={kv} placeholder={'Квартира'} type={'nember'} func={ e => setKv(e.target.value) } />
              </div>
              <div className='comment'>
                <MyTextInput variant="standard" value={comment} placeholder={'Комментарий курьеру'} func={ e => setComment(e.target.value) } />
              </div>
              <div className='chooseMain'>
                <div>
                  <span>Домофон работает</span>
                </div>
                <MySwitch onClick={(event) => setDomophome(event.target.checked)} checked={domophome} />
              </div>
              <div className='chooseMain'>
                <div>
                  <span>Сделать главным</span>
                  <div>
                    <HomeModalAddrIcon />
                  </div>
                </div>
                <MySwitch onClick={ (event) => { setCheck(event.target.checked) } } checked={check} />
              </div>
              <div className='btnSave'>
                <div onClick={ () => { infoAboutAddr != null ? updateAddr(pd, domophome, et, kv, comment, token, check, nameAddr, cityID) : saveNewAddr(pd, domophome, et, kv, comment, token, check, nameAddr, cityID) } }>
                  <span>Сохранить</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
