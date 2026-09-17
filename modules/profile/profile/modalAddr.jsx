import React, { useEffect, useState, useRef } from 'react';

import MySwitch from '@/ui/Switch.js';

import { YMaps, Map, Placemark, Polygon } from '@pbe/react-yandex-maps';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import useMediaQuery from '@mui/material/useMediaQuery';

import { roboto } from '@/ui/Font.js';
import {
  IconClose,
  PencilModalAddrIcon,
  HomeModalAddrIcon,
} from '@/ui/Icons.js';
import { BREAKPOINTS } from '@/utils/breakpoints';
import MyTextInput from '@/ui/MyTextInput';
import MyAutocomplete from '@/ui/MyAutocomplete';
import useAddressInput from '@/ui/useAddressInput';
import MySelect from '@/ui/MySelect';

import {
  useProfileStore,
  useHeaderStoreNew,
  useCitiesStore,
} from '@/components/store.js';

export default function ModalAddr() {
  const ref2 = useRef();

  const [
    clearAddr,
    chooseAddrStreet,
    center_map,
    zones,
    isOpenModalAddr,
    closeModalAddr,
    saveNewAddr,
    infoAboutAddr,
    cityList,
    active_city,
    updateAddr,
    setClearAddr,
    openModalAddr,
    street_list,
  ] = useProfileStore((state) => [
    state.clearAddr,
    state.chooseAddrStreet,
    state.center_map,
    state.zones,
    state.isOpenModalAddr,
    state.closeModalAddr,
    state.saveNewAddr,
    state.infoAboutAddr,
    state.cityList,
    state.active_city,
    state.updateAddr,
    state.setClearAddr,
    state.openModalAddr,
    state.street_list,
  ]);

  const [thisCityList] = useCitiesStore((state) => [state.thisCityList]);
  const [token] = useHeaderStoreNew((state) => [state?.token]);
  const isMobileAutocomplete = useMediaQuery(
    `screen and (max-width: ${BREAKPOINTS.mobileMax}px)`
  );

  // const [ street, setStreet ] = useState('');
  // const [ street_, setStreet_ ] = useState('');
  // const [ home, setHome ] = useState( '' );
  const {
    addressInput,
    pd,
    changeInput,
    changeEntrance,
    select,
    commit,
    cancel,
  } = useAddressInput(isOpenModalAddr, active_city);
  const [domophome, setDomophome] = useState(true);
  const [et, setEt] = useState('');
  const [kv, setKv] = useState('');
  const [comment, setComment] = useState('');
  const [check, setCheck] = useState(false);
  const [nameAddr, setNameAddr] = useState('');
  const [cityID, setCityID] = useState(active_city);

  useEffect(() => {
    if (infoAboutAddr) {
      // setStreet_(infoAboutAddr.street);
      // setStreet({id: infoAboutAddr?.id, name: infoAboutAddr?.street });
      // setHome(infoAboutAddr.home);
      setDomophome(parseInt(infoAboutAddr.domophome) == 1 ? true : false);
      setEt(infoAboutAddr.et);
      setKv(infoAboutAddr.kv);
      setComment(infoAboutAddr.comment);
      setCheck(parseInt(infoAboutAddr.is_main) == 1 ? true : false);
      setNameAddr(infoAboutAddr.name);
      setCityID(infoAboutAddr.city_id);
    } else {
      // setHome('');
      // setStreet('');
      // setStreet_('')
      setDomophome(true);
      setEt('');
      setKv('');
      setComment('');
      setCheck(false);
    }
  }, [infoAboutAddr]);

  function changeCity(city) {
    cancel();
    const city_id = thisCityList.find(
      ({ id }) => parseInt(id) === parseInt(city)
    );

    setClearAddr();
    clearAddr();
    setCityID(city);
    if (city_id) {
      openModalAddr(0, city_id?.link);
    }
  }

  useEffect(() => {
    setCityID(active_city);
  }, [active_city]);

  useEffect(() => {
    if (isOpenModalAddr == false) {
      // setStreet('');
      // setStreet_('')
      // setHome('');
      setDomophome(true);
      setEt('');
      setKv('');
      setComment('');
      setCheck(false);
      setNameAddr('');
      setCityID(active_city);
    }
  }, [isOpenModalAddr]);

  let new_zone = [];

  zones.map((item, key) => {
    new_zone.push(item.zone);
  });

  useEffect(() => {
    if (ref2.current && center_map?.center) {
      ref2.current.setCenter([
        zones[0].xy_center_map['latitude'],
        zones[0].xy_center_map['longitude'],
      ]);
    }
  }, [zones]);

  useEffect(() => {
    if (ref2.current && chooseAddrStreet?.xy) {
      ref2.current.setCenter(chooseAddrStreet?.xy);
    }
  }, [chooseAddrStreet]);

  const changeComment = (event) => {
    if (event === '') {
      setComment('');
    } else {
      const comment = event?.target?.value ?? event;

      const len = comment.split(/\r?\n|\r|\n/g);

      if (len.length > 2) {
        return;
      }

      if (comment.length > 50) {
        return;
      }

      setComment(comment);
    }
  };

  return (
    <Dialog
      onClose={() => {
        cancel();
        closeModalAddr();
      }}
      className={'modalAddrPC ' + roboto.variable}
      open={isOpenModalAddr}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
    >
      <DialogContent>
        <div className="container">
          <IconButton
            className="closeButton"
            onClick={() => {
              cancel();
              closeModalAddr();
            }}
          >
            <IconClose />
          </IconButton>

          <div className="mainGrid">
            <div className="map">
              <YMaps
                query={{
                  lang: 'ru_RU',
                  apikey: process.env.NEXT_PUBLIC_YANDEX_TOKEN_MAP,
                }}
              >
                <Map
                  defaultState={center_map}
                  instanceRef={ref2}
                  width="100%"
                  height="100%"
                >
                  {!chooseAddrStreet ||
                  Object.entries(chooseAddrStreet).length === 0 ? null : (
                    <Placemark
                      geometry={chooseAddrStreet?.xy}
                      options={{
                        iconLayout: 'default#image',
                        iconImageHref: '/Frame.png',
                        iconImageSize: [35, 50],
                        iconImageOffset: [-15, -50],
                      }}
                    />
                  )}

                  <Polygon
                    geometry={new_zone}
                    options={{
                      fillColor: 'rgba(53, 178, 80, 0.15)',
                      strokeColor: '#35B250',
                      strokeWidth: 5,
                      hideIconOnBalloonOpen: false,
                    }}
                  />
                </Map>
              </YMaps>
            </div>
            <div className="form">
              <div className="nameAddr">
                <MyTextInput
                  variant="standard"
                  placeholder={'Новый адрес'}
                  inputAdornment={<PencilModalAddrIcon />}
                  value={nameAddr}
                  func={(e) => setNameAddr(e.target.value)}
                />
              </div>
              <div className="city">
                <MySelect
                  variant="standard"
                  className="city"
                  data={cityList}
                  value={cityID}
                  func={(e) => changeCity(e.target.value)}
                />
              </div>
              <div className="street">
                <MyAutocomplete
                  placeholder={'Улица и номер дома'}
                  variant={'standard'}
                  data={street_list}
                  inputValue={addressInput || ''}
                  onInputValueChange={changeInput}
                  onChange={select}
                  onCommit={commit}
                  matches={isMobileAutocomplete}
                />
              </div>
              <div className="street_dop_2">
                {/* <MyTextInput variant="standard" value={home} placeholder={'Дом'} func={ e => setHome(e.target.value) } /> */}
                <MyTextInput
                  variant="standard"
                  value={pd}
                  placeholder={'Подъезд'}
                  type={'number'}
                  func={changeEntrance}
                  onBlur={commit}
                />
                <MyTextInput
                  variant="standard"
                  value={et}
                  placeholder={'Этаж'}
                  type={'number'}
                  func={(e) => setEt(e.target.value)}
                />
                <MyTextInput
                  variant="standard"
                  value={kv}
                  placeholder={'Квартира'}
                  type={'number'}
                  func={(e) => setKv(e.target.value)}
                />
              </div>
              {/* <div className='street_dop_2'>
                <MyTextInput variant="standard" value={et} placeholder={'Этаж'} type={'nember'} func={ e => setEt(e.target.value) } />
                <MyTextInput variant="standard" value={kv} placeholder={'Квартира'} type={'nember'} func={ e => setKv(e.target.value) } />
              </div> */}
              <div className="comment">
                <MyTextInput
                  variant="standard"
                  value={comment}
                  placeholder={'Комментарий курьеру'}
                  func={(event) => changeComment(event)}
                />
              </div>
              <div className="chooseMain">
                <div>
                  <span>Домофон работает</span>
                </div>
                <MySwitch
                  onClick={(event) => setDomophome(event.target.checked)}
                  checked={domophome}
                />
              </div>
              <div className="chooseMain">
                <div>
                  <span>Сделать главным</span>
                  <div>
                    <HomeModalAddrIcon />
                  </div>
                </div>
                <MySwitch
                  onClick={(event) => {
                    setCheck(event.target.checked);
                  }}
                  checked={check}
                />
              </div>
              <div className="btnSave">
                <div
                  onClick={() => {
                    infoAboutAddr != null
                      ? updateAddr(
                          pd,
                          domophome,
                          et,
                          kv,
                          comment,
                          token,
                          check,
                          nameAddr,
                          cityID
                        )
                      : saveNewAddr(
                          pd,
                          domophome,
                          et,
                          kv,
                          comment,
                          token,
                          check,
                          nameAddr,
                          cityID
                        );
                  }}
                >
                  <span>Сохранить</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
