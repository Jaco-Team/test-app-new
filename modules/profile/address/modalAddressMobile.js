import { useEffect, useState, useRef } from 'react';

import { useProfileStore } from '@/components/store.js';

import { YMaps, Map, Placemark, Polygon } from '@pbe/react-yandex-maps';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';

import MyPopper from '@/ui/MyPopper';
import MyTextInput from '@/ui/MyTextInput';
import MyAutocomplete from '@/ui/MyAutocomplete';
import { roboto } from '@/ui/Font.js';
import { LoupeMobile, EditPencilMobile, HomeCartMobile } from '@/ui/Icons.js';
import { SwitchContactsMobile as MySwitch } from '@/ui/MySwitch.js';

import { useSession } from 'next-auth/react';

export default function AddressModalMobile() {
  const ref2 = useRef();

  const [openModalAddress, setActiveAddressModal] = useProfileStore((state) => [state.openModalAddress, state.setActiveAddressModal]);

  const [ clearAddr, chooseAddrStreet, center_map, zones, isOpenModalAddr, closeModalAddr, allStreets, checkStreet, saveNewAddr, infoAboutAddr, cityList, updateStreetList, active_city, updateAddr ] = 
  useProfileStore( state => [ state.clearAddr, state.chooseAddrStreet, state.center_map, state.zones, state.isOpenModalAddr, state.closeModalAddr, state.allStreets, state.checkStreet, state.saveNewAddr, state.infoAboutAddr, state.cityList, state.updateStreetList, state.active_city, state.updateAddr ] );


  //const [mapChange, setMapChange] = useState(false);
  //const [street, setStreet] = useState('');
  //const [form, setForm] = useState({home: '', corpus: '', pd: '', domophome: '', et: '', kv: '', comment: '', check: false, nameAddr: ''});

  const session = useSession();

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
      setEt('');
      setKv('');
      setComment('');
      setCheck(false);
      setDomophome(true);
    }
  }, [infoAboutAddr] )

  useEffect(() => {
    if( street && street.length > 0 && home.length > 0 ){
      checkStreet(street, home, pd, cityID);
    }
  }, [street, home, pd]);

  useEffect( () => {
    //updateStreetList(cityID);
  }, [cityID] )

  function chengeCity(city){
    setCityID(city);
    clearAddr();
  }

  useEffect( () => {
    setCityID(active_city);
  }, [active_city] )

  useEffect(() => {
    if( openModalAddress == false ){
      setStreet('');
      setStreet_('')
      setHome('');
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
  }, [zones] )

  useEffect( () => {
    if( ref2.current && chooseAddrStreet?.xy ){
      ref2.current.setCenter(chooseAddrStreet?.xy);
    }
  }, [chooseAddrStreet] )


  console.log('AddressModalMobile new_zone', new_zone);
  console.log('AddressModalMobile zones', zones);


  /*useEffect(() => {
    if (street && street.length > 0 && form.home.length > 0) {
      checkStreet(street, form.home, active_city);
    }
  }, [street, form.home]);

  const handleChange = (event) => {
    const name = event.target.name;

    if (name) {
      setForm({ ...form, [name]: event.target.value });
    } else {
      setForm({ ...form, check: event.target.checked });
    }
  };

  const close = () => {
    setForm({home: '', corpus: '', pd: '', domophome: '', et: '', kv: '', comment: '', check: false, nameAddr: ''});
    setActiveAddressModal(false, 0, '');
    setMapChange(false);
    setStreet('');
  };

  const handleSave = () => {
    console.log(form);
    console.log(street);

    //saveNewAddr(form, street)
    close();
  };*/

  console.log(  )

  return (
    <Dialog
      onClose={close}
      className={'AddressModalmodile ' + roboto.variable}
      open={openModalAddress}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      fullWidth
    >
      <DialogContent>
        <div className="ContainerAddressModal">
          <div className="Line"></div>
          <div className="loginHeader">Новый адрес</div>

          <div className="map" style={{ minHeight: '93.162393162393vw' }} >
            <YMaps query={{ lang: 'ru_RU', apikey: 'f600fbbd-6500-4bf7-a0ab-ec9336f6c7d8' }}>
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

          <div className="addressForm">
            <div className="address_street">
              <MyAutocomplete
                placeholder="Улица"
                data={allStreets}
                val={street}
                onChange={(val) => setStreet(val)}
                inputAdornment={<LoupeMobile />}
                customPopper={MyPopper}
                stylePaper={{ paper: { style: { width: '82.051282051282vw' } } }}
              />
            </div>
            <div className="address_dop">
              <MyTextInput
                value={home}
                name="home"
                placeholder="Дом"
                type="number"
                func={ e => setHome(e.target.value) }
              />
              <MyTextInput
                value={pd}
                name="pd"
                placeholder="Подьезд"
                type="number"
                func={ e => setPd(e.target.value) }
              />
            </div>

            <div className="address_dop">
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
                func={ e => setComment(e.target.value) }
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
                name="nameAddr"
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

            <Button className="address_button" variant="contained" onClick={ () => {} }>
              <span>Сохранить</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
