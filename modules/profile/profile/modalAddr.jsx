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
// import MyAutocomplete from '@/ui/MyAutocomplete';
import MySelect from '@/ui/MySelect';

import { useProfileStore, useHeaderStore, useCitiesStore } from '@/components/store.js';

export default function ModalAddr(){
  const ref2 = useRef();

  const [ clearAddr, chooseAddrStreet, center_map, zones, isOpenModalAddr, closeModalAddr, allStreets, checkStreet, saveNewAddr, infoAboutAddr, cityList, updateStreetList, active_city, updateAddr, setClearAddr, openModalAddr, setActiveGetAddressModal] = 
    useProfileStore( state => [ state.clearAddr, state.chooseAddrStreet, state.center_map, state.zones, state.isOpenModalAddr, state.closeModalAddr, state.allStreets, state.checkStreet, state.saveNewAddr, state.infoAboutAddr, state.cityList, state.updateStreetList, state.active_city, state.updateAddr, state.setClearAddr, state.openModalAddr, state.setActiveGetAddressModal] );

  const [thisCityList] = useCitiesStore((state) => [state.thisCityList]);
  const [ token ] = useHeaderStore( state => [ state.token ] )

  // const [ street, setStreet ] = useState('');
  // const [ street_, setStreet_ ] = useState('');
  // const [ home, setHome ] = useState( '' );
  const [ pd, setPd ] = useState( '' );
  const [ domophome, setDomophome ] = useState(true);
  const [ et, setEt ] = useState('');
  const [ kv, setKv ] = useState('');
  const [ comment, setComment ] = useState('');
  const [ check, setCheck ] = useState(false);
  const [ nameAddr, setNameAddr ] = useState('');
  const [ cityID, setCityID ] = useState(active_city);

  useEffect(() => {
    if (chooseAddrStreet?.street && chooseAddrStreet?.street?.length > 0 && chooseAddrStreet?.home?.length > 0) {
      checkStreet(chooseAddrStreet?.city_name_dop + ' ' +chooseAddrStreet?.street, chooseAddrStreet?.home, pd, cityID);
    }
  }, [pd]);

  // useEffect(() => {
  //   if(street && street.length > 0 && home.length > 0){
  //     checkStreet(street, home, pd, cityID);
  //   } else {
  //     checkStreet(null);
  //   }
  // }, [street, home, pd]);

  useEffect( () => {
    if( infoAboutAddr ){
      // setStreet_(infoAboutAddr.street);
      // setStreet({id: infoAboutAddr?.id, name: infoAboutAddr?.street });
      // setHome(infoAboutAddr.home);
      setPd(infoAboutAddr.pd);
      setDomophome(parseInt(infoAboutAddr.domophome) == 1 ? true : false);
      setEt(infoAboutAddr.et);
      setKv(infoAboutAddr.kv);
      setComment(infoAboutAddr.comment);
      setCheck( parseInt(infoAboutAddr.is_main) == 1 ? true : false )
      setNameAddr(infoAboutAddr.name)
      setCityID(infoAboutAddr.city_id);
    }else{
      // setHome('');
      // setStreet('');
      // setStreet_('')
      setPd('');
      setDomophome(true);
      setEt('');
      setKv('');
      setComment('');
      setCheck(false)
    }
  }, [infoAboutAddr] )

  // useEffect( () => {
  //   updateStreetList(cityID);
  // }, [cityID] )

  function changeCity(city){
    const city_id = thisCityList.find(({ id }) => parseInt(id) === parseInt(city));

    if(city_id) {
      openModalAddr(0, city_id?.link);
    }

    setClearAddr();
    setCityID(city);
    clearAddr();
  }

  useEffect( () => {
    setCityID(active_city);
  }, [active_city] )

  useEffect(() => {
    if( isOpenModalAddr == false ){
      // setStreet('');
      // setStreet_('')
      // setHome('');
      setPd('');
      setDomophome(true);
      setEt('');
      setKv('');
      setComment('');
      setCheck(false)
      setNameAddr('');
      setCityID(active_city);
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

  const changeComment = (event) => {

    if(event === '') {
      setComment('')
    } else {
      const comment = event?.target?.value ?? event;

      const len = comment.split(/\r?\n|\r|\n/g)

      if(len.length > 2) {
        return ;
      }

      if (comment.length > 50) {
        return ;
      }

      setComment(comment)
    }
  }

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

          <IconButton className="closeButton" onClick={closeModalAddr}>
            <IconClose />
          </IconButton>

          <div className='mainGrid'>
            <div className='map'>
              <YMaps query={{ lang: 'ru_RU', apikey: 'f600fbbd-6500-4bf7-a0ab-ec9336f6c7d8' }}>
                <Map defaultState={center_map} instanceRef={ref2} width="100%" height="100%">

                  { !chooseAddrStreet || Object.entries(chooseAddrStreet).length === 0 ? null :
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
                <MySelect variant="standard" className="city" data={cityList} value={cityID} func={ e => changeCity(e.target.value) } />
              </div>
              <div className='street' onClick={() => setActiveGetAddressModal(true)}>
                <MyTextInput variant="standard" placeholder={'Улица и номер дома'} value={!chooseAddrStreet?.street ? '' : chooseAddrStreet?.city_name_dop+( chooseAddrStreet?.city_name_dop?.length > 0 ? ', ' : '' )+chooseAddrStreet?.street+', '+chooseAddrStreet?.home} readOnly/>
              </div>
              <div className='street_dop_2'>
                {/* <MyTextInput variant="standard" value={home} placeholder={'Дом'} func={ e => setHome(e.target.value) } /> */}
                <MyTextInput variant="standard" value={pd} placeholder={'Подъезд'} type={'nember'} func={ e => setPd(e.target.value) } />
                <MyTextInput variant="standard" value={et} placeholder={'Этаж'} type={'nember'} func={ e => setEt(e.target.value) } />
                <MyTextInput variant="standard" value={kv} placeholder={'Квартира'} type={'nember'} func={ e => setKv(e.target.value) } />
              </div>
              {/* <div className='street_dop_2'>
                <MyTextInput variant="standard" value={et} placeholder={'Этаж'} type={'nember'} func={ e => setEt(e.target.value) } />
                <MyTextInput variant="standard" value={kv} placeholder={'Квартира'} type={'nember'} func={ e => setKv(e.target.value) } />
              </div> */}
              <div className='comment'>
                <MyTextInput variant="standard" value={comment} placeholder={'Комментарий курьеру'} func={ event => changeComment(event) } />
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
