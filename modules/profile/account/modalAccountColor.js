import { useEffect, useState } from 'react';

import { useProfileStore } from '@/components/store.js';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';

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

export default function ModalAccountColor() {
  //console.log('render ModalAccountMobile');

  const [value, setValue] = useState('');

  const [openModalAccountColor, setActiveAccountColor, colorAccount, setAccountColor] = 
    useProfileStore((state) => [state.openModalAccountColor, state.setActiveAccountColor, state.colorAccount, state.setAccountColor]);

  useEffect(() => {
    const color = colorList.find(color => color.id === colorAccount.id)

    setValue(color);

  }, [colorAccount]);

  const checkColor = (color) => {
    setAccountColor(color);
    setActiveAccountColor(false);
  }

  return (
    <Dialog
      onClose={() => setActiveAccountColor(false)}
      className={'AccountColor ' + roboto.variable}
      open={openModalAccountColor}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      fullWidth
    >
      <DialogContent>
        <div className="ContainerAccountColor">
          <div className="Line"></div>
          <div className="loginHeader">Выберите свой цвет</div>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
