import { useEffect, useState } from 'react';

import { useProfileStore } from '@/components/store.js';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';

import { roboto } from '@/ui/Font.js';

import { CheckAccountColor } from '@/ui/Icons.js';

const colorList = [
  { login: "rgba(248, 111, 111, 1)", id: 1, item: 'rgba(248, 111, 111, 0.1)' },
  { login: 'rgba(248, 152, 111, 1)', id: 2, item: 'rgba(248, 152, 111, 0.1)' },
  { login: 'rgba(248, 209, 111, 1)', id: 3, item: 'rgba(248, 209, 111, 0.1)' },
  { login: 'rgba(176, 233, 120, 1)', id: 4, item: 'rgba(176, 233, 120, 0.1)' },
  { login: 'rgba(119, 229, 156, 1)', id: 5, item: 'rgba(119, 229, 156, 0.1)' },
  { login: 'rgba(111, 190, 248, 1)', id: 6, item: 'rgba(111, 190, 248, 0.1)' },
  { login: 'rgba(112, 170, 238, 1)', id: 7, item: 'rgba(112, 170, 238, 0.1)' },
  { login: 'rgba(111, 109, 235, 1)', id: 8, item: 'rgba(111, 109, 235, 0.1)' },
  { login: 'rgba(188, 111, 248, 1)', id: 9, item: 'rgba(188, 111, 248, 0.1)' },
  { login: 'rgba(230, 115, 233, 1)', id: 10, item: 'rgba(230, 115, 233, 0.1)' },
  { login: 'rgba(248, 111, 177, 1)', id: 11, item: 'rgba(248, 111, 177, 0.1)' },
  { login: 'rgba(164, 164, 164, 1)', id: 12, item: 'rgba(164, 164, 164, 0.1)' },
];

export default function AccountModalMobile() {
  const [value, setValue] = useState('');

  const [openModalAccount, setActiveAccountModal, colorAccount, setAccountColor, modalName] = 
    useProfileStore((state) => [state.openModalAccount, state.setActiveAccountModal, state.colorAccount, state.setAccountColor, state.modalName]);

  useEffect(() => {
    const color = colorList.find(color => color.id === colorAccount.id)

    setValue(color);

  }, [colorAccount]);

  const checkColor = (color) => {
    setAccountColor(color);
    setActiveAccountModal(false, null);
  }

  return (
    <Dialog
      onClose={() => setActiveAccountModal(false, null)}
      className={'AccountModal ' + roboto.variable}
      open={openModalAccount}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      fullWidth
    >
      <DialogContent>
        <div className="ContainerAccountModal">
          <div className="Line"></div>
          <div className="loginHeader" style={{ marginBottom: modalName === 'color' ? '9.0598290598291vw' : '5.1282051282051vw' }}>
            {modalName === 'color' ? 'Выберите свой цвет' : 'Выйти из профиля'}
          </div>
          {modalName === 'color' ?
            <div className="listColor">
              {colorList.map((item, key) => (
                <div className='itemColor' key={key} 
                  style={{ background: item.login, border: value.id === item.id ? '1.7094017094017vw solid rgba(0, 0, 0, 0.20)' : 'none',
                  width: value.id === item.id ? '14.051282051282vw' : '17.470085470085vw', height: value.id === item.id ? '14.051282051282vw' : '17.470085470085vw'}} 
                  onClick={() => checkColor(item)}>
                    {value.id === item.id ? <CheckAccountColor /> : null}
                </div>
              ))}
            </div>
          : 
          <>
            <div className="infoExit">
              <span>Ян,</span>
              <span>вы уверены, что хотите выйти из профиля? Мы не сможем идентифицировать ваши адреса для доставки, удобно подгружать банковские карты, использовать промокоды со скидками и показывать историю ваших заказов для быстрого повтора.</span>
            </div>
            <Button className="buttonModalClose" variant="contained" onClick={() => setActiveAccountModal(false, null)}>
              <span>Остаться</span>
            </Button>
            <Button className="buttonModalExit" variant="outlined" 
            //onClick={}
            >
              <span>Выйти</span>
            </Button>
          </>
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}
