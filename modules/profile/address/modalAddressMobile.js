import { useEffect, useState } from 'react';

import { useProfileStore } from '@/components/store.js';

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

export default function AddressModalMobile() {
  //console.log('render AddressModalMobile');

  const [allStreets, saveNewAddr, checkStreet, active_city, infoAboutAddr, openModalAddress, setActiveAddressModal] = useProfileStore((state) => [state.allStreets, state.saveNewAddr, state.checkStreet, state.active_city, state.infoAboutAddr, state.openModalAddress, state.setActiveAddressModal]);

  const [mapChange, setMapChange] = useState(false);
  const [street, setStreet] = useState('');
  const [form, setForm] = useState({home: '', corpus: '', pd: '', domophome: '', et: '', kv: '', comment: '', check: false, nameAddr: ''});

  useEffect(() => {
    if (street && !mapChange) {
      setMapChange(true);
    }
  }, [street, mapChange]);

  useEffect(() => {
    if (infoAboutAddr !== null) {
      //setStreet_(infoAboutAddr.street);
      setStreet(infoAboutAddr.street);
      setForm({
        home: infoAboutAddr?.home ?? '',
        corpus: infoAboutAddr?.corpus ?? '',
        pd: infoAboutAddr?.pd ?? '',
        domophome: infoAboutAddr?.domophome ?? '',
        et: infoAboutAddr?.et ?? '',
        kv: infoAboutAddr?.kv ?? '',
        comment: infoAboutAddr?.comment ?? '',
        check: parseInt(infoAboutAddr.is_main) == 1 ? true : false,
        nameAddr: infoAboutAddr?.name ?? '',
      });
    }
  }, [infoAboutAddr]);

  useEffect(() => {
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
  };

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

          <div className="map" id="map" style={{ minHeight: street ? '93.162393162393vw' : '20.512820512821vw' }} />

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
                value={form.home}
                name="home"
                placeholder="Дом"
                type="number"
                func={handleChange}
              />
              <MyTextInput
                value={form.corpus}
                name="corpus"
                placeholder="Корпус"
                type="number"
                func={handleChange}
              />
            </div>

            <div className="address_dop">
              <MyTextInput
                value={form.pd}
                name="pd"
                placeholder="Подьезд"
                type="number"
                func={handleChange}
              />
              <MyTextInput
                value={form.domophome}
                name="domophome"
                placeholder="Домофон"
                func={handleChange}
              />
            </div>

            <div className="address_dop">
              <MyTextInput
                value={form.et}
                name="et"
                placeholder="Этаж"
                type="number"
                func={handleChange}
              />
              <MyTextInput
                value={form.kv}
                name="kv"
                placeholder="Квартира"
                type="number"
                func={handleChange}
              />
            </div>

            <div className="address_comment">
              <MyTextInput
                value={form.comment}
                name="comment"
                placeholder="Комментарий"
                func={handleChange}
              />
            </div>

            <div className="address_name">
              <MyTextInput
                value={form.nameAddr}
                name="nameAddr"
                placeholder="Дать короткое название"
                func={handleChange}
              />
              <EditPencilMobile />
            </div>

            <div className="address_main">
              <div className="divGroup">
                <span>Сделать главным</span>
                <div className="circleDiv">
                  <HomeCartMobile />
                </div>
              </div>
              <MySwitch checked={form.check} onClick={handleChange} />
            </div>

            <Button className="address_button" variant="contained" onClick={handleSave}>
              <span>Сохранить</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
