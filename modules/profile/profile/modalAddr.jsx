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

import { useProfileStore } from '@/components/store.js';

import { useSession } from 'next-auth/react';

export default function ModalAddr(){
  const ref = useRef();
  const ref2 = useRef();
  const ymaps = React.useRef(null);

  const [ chooseAddrStreet, center_map, zones, isOpenModalAddr, closeModalAddr, allStreets, checkStreet, saveNewAddr, infoAboutAddr, cityList, updateStreetList, active_city, updateAddr ] = 
    useProfileStore( state => [ state.chooseAddrStreet, state.center_map, state.zones, state.isOpenModalAddr, state.closeModalAddr, state.allStreets, state.checkStreet, state.saveNewAddr, state.infoAboutAddr, state.cityList, state.updateStreetList, state.active_city, state.updateAddr ] );

  console.log( center_map, zones )

  const session = useSession();

  const [ street, setStreet ] = useState('');
  const [ street_, setStreet_ ] = useState('');
  const [ home, setHome ] = useState('');
  const [ pd, setPd ] = useState('');
  const [ domophome, setDomophome ] = useState('');
  const [ et, setEt ] = useState('');
  const [ kv, setKv ] = useState('');
  const [ comment, setComment ] = useState('');
  const [ check, setCheck ] = useState(false);
  const [ nameAddr, setNameAddr ] = useState('');
  const [ cityID, setCityID ] = useState(active_city);

  useEffect(() => {
    if( street && street.length > 0 && home.length > 0 ){
      checkStreet(street, home, cityID);
    }
  }, [street, home]);

  useEffect( () => {

    if( infoAboutAddr != null ){
      setStreet_(infoAboutAddr.street);
      setStreet(infoAboutAddr.street);
      setHome(infoAboutAddr.home);
      setPd(infoAboutAddr.pd);
      setDomophome(infoAboutAddr.domophome);
      setEt(infoAboutAddr.et);
      setKv(infoAboutAddr.kv);
      setComment(infoAboutAddr.comment);
      setCheck( parseInt(infoAboutAddr.is_main) == 1 ? true : false )
      setNameAddr(infoAboutAddr.name)
      setCityID(infoAboutAddr.city_id);
    }
  }, [infoAboutAddr] )

  useEffect( () => {
    //updateStreetList(cityID);
  }, [cityID] )

  useEffect( () => {
    //setCityID(active_city);
  }, [active_city] )

  useEffect(() => {
    if( isOpenModalAddr == false ){
      setStreet('');
      setStreet_('')
      setHome('');
      setPd('');
      setDomophome('');
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
    //console.log( key, item.zone )

    new_zone.push( item.zone )
  })

  //console.log( 'new_zone', center_map )

  

  useEffect( () => {
    if( ref2.current && chooseAddrStreet?.xy ){
      ref2.current.setCenter(chooseAddrStreet?.xy);
    }

    console.log( 'chooseAddrStreet', ref2.current, chooseAddrStreet )
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
            <div className='map unic_map_key' id='unic_map_key'>
              <YMaps query={{ lang: 'ru_RU', apikey: 'ae2bad1f-486e-442b-a9f7-d84fff6296db' }}>
                <Map defaultState={center_map} instanceRef={ref2} width="100%" height="100%">

                  { !chooseAddrStreet?.xy ? false :
                    <Placemark geometry={chooseAddrStreet?.xy} />
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
                <MySelect variant="standard" className="city" data={cityList} value={cityID} func={ e => setCityID(e.target.value) } />
              </div>
              <div className='street'>
                <MyAutocomplete placeholder={'Улица'} className="city" data={allStreets} val={street_} onChange={ val => setStreet(val) } variant={'standard'} />
              </div>
              <div className='street_dop_3'>
                <MyTextInput variant="standard" value={home} placeholder={'Дом'} func={ e => setHome(e.target.value) } />
                <MyTextInput variant="standard" value={pd} placeholder={'Подъезд'} type={'nember'} func={ e => setPd(e.target.value) } />
                <MyTextInput variant="standard" value={domophome} placeholder={'Домофон'} func={ e => setDomophome(e.target.value) } />
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
                  <span>Сделать главным</span>
                  <div>
                    <HomeModalAddrIcon />
                  </div>
                </div>
                <MySwitch onClick={ (event) => { setCheck(event.target.checked) } } checked={check} />
              </div>
              <div className='btnSave'>
                <div onClick={ () => { infoAboutAddr != null ? updateAddr(pd, domophome, et, kv, comment, session.data?.user?.token, check, nameAddr, cityID) : saveNewAddr(pd, domophome, et, kv, comment, session.data?.user?.token, check, nameAddr, cityID) } }>
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
