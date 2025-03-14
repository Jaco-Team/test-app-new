import { useEffect, useState, useRef } from 'react';
import { useProfileStore, useHeaderStoreNew, useCitiesStore } from '@/components/store.js';
import { YMaps, Map, Placemark, Polygon } from '@pbe/react-yandex-maps';

import Button from '@mui/material/Button';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import MyTextInput from '@/ui/MyTextInput';
import { roboto } from '@/ui/Font.js';
import { EditPencilMobile, HomeCartMobile, VectorRightMobile } from '@/ui/Icons.js';
import { SwitchContactsMobile as MySwitch } from '@/ui/MySwitch.js';

export default function AddressModalMobile({ city }) {
  const ref2 = useRef();

  const [token, setActiveModalCityList] = useHeaderStoreNew( state => [state?.token, state?.setActiveModalCityList]);
  const [thisCityRu] = useCitiesStore((state) => [state.thisCityRu]);
  const [openModalAddress, setActiveAddressModal, setClearAddr, clearAddr, setActiveGetAddressModal] = useProfileStore((state) => [state.openModalAddress, state.setActiveAddressModal, state.setClearAddr, state.clearAddr, state.setActiveGetAddressModal]);

  const [chooseAddrStreet, center_map, zones, checkStreet, saveNewAddr, infoAboutAddr, active_city, updateAddr, delAddr ] = 
  useProfileStore( state => [state.chooseAddrStreet, state.center_map, state.zones, state.checkStreet, state.saveNewAddr, state.infoAboutAddr, state.active_city, state.updateAddr, state.delAddr ] );

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

  /*useEffect(() => {
    if (chooseAddrStreet?.street && chooseAddrStreet?.street?.length > 0 && chooseAddrStreet?.home?.length > 0) {
      checkStreet(chooseAddrStreet?.city_name_dop + ' ' +chooseAddrStreet?.street, chooseAddrStreet?.home, pd, cityID);
    }
  }, [pd]);*/

  function clearAddress(){
    // setHome('');
    // setStreet('');
    // setStreet_('')
    setPd('');
    setEt('');
    setKv('');
    setComment('');
    setCheck(false);
    setDomophome(true);
  }

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
      setEt('');
      setKv('');
      setComment('');
      setCheck(false);
      setDomophome(true);
    }
  }, [infoAboutAddr] )
 
  // без этого при смене города, не меняется карта города
  useEffect( () => {
    
    if( openModalAddress === true ){
      setActiveAddressModal(true, 0, city)
    }
    
    clearAddress();
    setClearAddr();
    clearAddr();
  }, [city])

  useEffect( () => {
    setCityID(active_city);
  }, [active_city] )

  useEffect(() => {
    if( openModalAddress == false ){
      // setStreet('');
      // setStreet_('')
      // setHome('');
      setPd('');
      setEt('');
      setKv('');
      setComment('');
      setCheck(false)
      setNameAddr('');
      setCityID(active_city);
      setDomophome(true);
    }else{
      setTimeout( () => {
        //render_map_model();
      }, 1000 )
    }
  }, [openModalAddress]);

  let new_zone = [];

  zones.map( (item, key) => {
    new_zone.push( item.zone )
  })

  useEffect( () => {
    if( ref2.current && center_map?.center ){
      ref2.current.setCenter([zones[0].xy_center_map['latitude'], zones[0].xy_center_map['longitude']]);
    }
  }, [zones, center_map] )

  useEffect( () => {
    if( ref2.current && chooseAddrStreet?.xy ){
      ref2.current.setCenter(chooseAddrStreet?.xy);
    }
  }, [chooseAddrStreet] )

  const handleDelete = () => {
    delAddr(infoAboutAddr.id, token);
    setActiveAddressModal(false, 0, '');
  }

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

  const changePD = (event) => {
    const pd = event?.target?.value ?? event;

    setPd(pd)

    if (chooseAddrStreet?.street && chooseAddrStreet?.street?.length > 0 && chooseAddrStreet?.home?.length > 0) {
      checkStreet(chooseAddrStreet?.city_name_dop + ' ' +chooseAddrStreet?.street, chooseAddrStreet?.home, pd, cityID);
    }
  }

  return (
    <SwipeableDrawer
      anchor={'bottom'}
      open={openModalAddress}
      onClose={() => setActiveAddressModal(false, 0, '')}
      onOpen={() => {}}
      id="AddressModalmodile"
      className={roboto.variable}
      disableSwipeToOpen
    >
      <div className="ContainerAddressModal">
        {!center_map ? null :
          <div className="map" style={{ minHeight: '93.162393162393vw' }} >
            <YMaps query={{ lang: 'ru_RU', apikey: process.env.NEXT_PUBLIC_YANDEX_TOKEN_MAP }}>
              <Map defaultState={center_map} instanceRef={ref2} width="100%" height="100%" style={{ minHeight: '93.162393162393vw' }} >

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
        }

        <div className="addressForm">
          {/* <div className="address_street">
            <MyAutocomplete
              placeholder="Улица"
              data={allStreets}
              val={street}
              onChange={(val) => setStreet(val)}
              inputAdornment={<LoupeMobile />}
              customPopper={MyPopper}
              stylePaper={{ paper: { style: { width: '82.051282051282vw' } } }}
            />
          </div> */}
          <div className="address_city" onClick={() => { setActiveModalCityList(true) }}>
            <span>{thisCityRu}</span>
            <VectorRightMobile />
          </div>
          <div className="address_city" onClick={() => {  setActiveGetAddressModal(true) }}>
            <span>{ !chooseAddrStreet?.street ? '' : chooseAddrStreet?.city_name_dop+( chooseAddrStreet?.city_name_dop?.length > 0 ? ', ' : '' )+chooseAddrStreet?.street+', '+chooseAddrStreet?.home }</span>
            <VectorRightMobile />
          </div>

          {/* <div className="address_dop">
            <MyTextInput
              value={home}
              name="home"
              placeholder="Дом"
              //type="number"
              func={ e => setHome(e.target.value) }
            />
            <MyTextInput
              value={pd}
              name="pd"
              placeholder="Подьезд"
              type="number"
              func={ e => setPd(e.target.value) }
            />
          </div> */}

          <div className="address_dop">
            <MyTextInput
              value={pd}
              name="pd"
              placeholder="Подьезд"
              type="number"
              func={ e => changePD(e) }
            />
            <MyTextInput
              value={et}
              name="et"
              placeholder="Этаж"
              type="number"
              func={ e => setEt(e.target.value) }
            />
            <MyTextInput
              value={kv}
              name="kv"
              placeholder="Квартира"
              type="number"
              func={ e => setKv(e.target.value) }
            />
          </div>

          <div className="address_comment">
            <MyTextInput
              value={comment}
              name="comment"
              placeholder="Комментарий"
              func={ event => changeComment(event) }
            />
          </div>

          <div className="address_main" style={{ marginTop: '5.1282051282051vw' }}>
            <div className="divGroup">
              <span>Домофон работает</span>
            </div>
            <MySwitch checked={domophome} onClick={(event) => setDomophome(event.target.checked)} />
          </div>

          <div className="address_name">
            <MyTextInput
              value={nameAddr}
              name="customAddrName"
              placeholder="Дать короткое название"
              func={ e => setNameAddr(e.target.value) }
            />
            <EditPencilMobile />
          </div>

          <div className="address_main" style={{ marginBottom: '5.1282051282051vw' }}>
            <div className="divGroup">
              <span>Сделать главным</span>
              <div className="circleDiv">
                <HomeCartMobile />
              </div>
            </div>
            <MySwitch checked={check} onClick={ (event) => { setCheck(event.target.checked) } } />
          </div>

          <Button className="address_button" style={{ marginBottom: infoAboutAddr !== null ? '5.1282051282051vw' : '17.521367521368vw'}} variant="contained" onClick={ () => { infoAboutAddr != null ? updateAddr(pd, domophome, et, kv, comment, token, check, nameAddr, cityID) : saveNewAddr(pd, domophome, et, kv, comment, token, check, nameAddr, cityID) } }>
            <span>Сохранить</span>
          </Button>

          {infoAboutAddr !== null ?
            <Button className="address_delete" variant="outlined" onClick={handleDelete}>
              <span>Удалить</span>
            </Button>
          : null}

        </div>
      </div>
    </SwipeableDrawer>
  );
}
