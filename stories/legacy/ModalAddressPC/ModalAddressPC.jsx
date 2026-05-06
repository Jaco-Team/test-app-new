import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { YMaps, Map, Placemark, Polygon } from '@pbe/react-yandex-maps';

import MyTextInput from '../MyTextInput/MyTextInput';
import { MyMenu } from '../MyMenu/MyMenu';
import { MySwitch } from '../MySwitch/MySwitch';
import { PencilModalAddrIcon, HomeModalAddrIcon } from '../Icons';
import { MyButton } from '../MyButton/MyButton';

import './ModalAddressPC.scss';

const cityList = [{ title: 'Тольятти' }, { title: 'Самара' }, { title: 'Комсомольск-на-Амуре' }];

export const ModalAddressPC = ({allStreets, chooseAddrStreet, center_map, zones, nameAddr, city, street, home, pd, et, kv, comment}) => {
  const ref = useRef();

  const [anchorElCity, setAnchorElCity] = useState(null);
  const [anchorElStreet, setAnchorElStreet] = useState(null);
  const [isOpenCity, setIsOpenCity] = useState(false);
  const [isOpenStreet, setIsOpenStreet] = useState(false);

  let new_zone = [];

  zones.map((item) => new_zone.push(item.zone));

  function openMenu(event, type) {
    if (type === 'city') {
      setIsOpenCity(true);
      setAnchorElCity(event.currentTarget);
    } else {
      setIsOpenStreet(true);
      setAnchorElStreet(event.currentTarget);
    }
  }

  function closeMenu() {
    setAnchorElCity(null);
    setAnchorElStreet(null);
    setIsOpenCity(false);
    setIsOpenStreet(false);
  }

  return (
    <div className="modalAddressPC">
      <div className="map">
        <YMaps query={{ lang: 'ru_RU', apikey: `${process.env.NEXT_PUBLIC_YANDEX_TOKEN_MAP}` }}>
          <Map
            defaultState={center_map}
            instanceRef={ref}
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
        <MyTextInput
          placeholder="Новый адрес"
          variant="standard"
          value={nameAddr}
          inputAdornment={<PencilModalAddrIcon />}
          className="nameAddr"
        />
        <div className="city" style={{ borderColor: anchorElCity ? '#cc0033' : 'rgba(0, 0, 0, 0.2)' }} onClick={(e) => openMenu(e, 'city')}>
          <span>{city}</span>
        </div>

        <div className="city street" style={{ borderColor: anchorElStreet ? '#cc0033' : 'rgba(0, 0, 0, 0.2)' }} onClick={(e) => openMenu(e, 'street')}>
          {street ? <span>{street}</span> : <span style={{ color: 'rgba(0, 0, 0, 0.4)' }}>Улица</span>}
        </div>

        <div className="street_dop">
          <MyTextInput variant="standard" value={home} placeholder="Дом" />
          <MyTextInput variant="standard" value={pd} placeholder="Подъезд" />
        </div>

        <div className="street_dop">
          <MyTextInput
            variant="standard"
            type="number"
            value={et}
            placeholder="Этаж"
          />
          <MyTextInput
            variant="standard"
            type="number"
            value={kv}
            placeholder="Квартира"
          />
        </div>

        <MyTextInput
          placeholder="Комментарий курьеру"
          variant="standard"
          value={comment}
          className="comment"
        />

        <div className="check">
          <span className="text">Домофон работает</span>
          <MySwitch type="ios" checked={true} />
        </div>

        <div className="check">
          <span className="text">Сделать главным</span>
          <div><HomeModalAddrIcon /></div>
          <MySwitch type="ios" />
        </div>

        <MyButton children="Сохранить" variant="primary" size="large" />
      </div>

      <MyMenu
        list={cityList}
        isOpen={isOpenCity}
        anchorEl={anchorElCity}
        onClose={closeMenu}
        type="modal"
      />

      <MyMenu
        list={allStreets}
        isOpen={isOpenStreet}
        anchorEl={anchorElStreet}
        onClose={closeMenu}
        type="modal"
      />
    </div>
  );
};

ModalAddressPC.propTypes = {
  nameAddr: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  street: PropTypes.string.isRequired,
  home: PropTypes.string.isRequired,
  pd: PropTypes.string.isRequired,
  et: PropTypes.string.isRequired,
  kv: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
};
