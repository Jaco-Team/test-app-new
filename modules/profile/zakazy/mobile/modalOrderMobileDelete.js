import { useState } from 'react';

import { useSession } from 'next-auth/react';

import { useProfileStore } from '@/components/store.js';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';

import { roboto } from '@/ui/Font.js';
import MyTextInput from '@/ui/MyTextInput';

const answers = [
  { id: 1, val: 'Хочу отредактировать заказ' },
  { id: 2, val: 'Изменились планы' },
  { id: 3, val: 'Долгое время ожидания' },
  { id: 4, val: 'Недостаточно средств' },
  { id: 5, val: 'Другое' },
];

export default function ModalOrderMobileDelete() {
  //console.log('render ModalOrderMobileDelete');

  const [active, setActive] = useState(0);
  const [text, setText] = useState('');

  const session = useSession();

  const [openModalDelete, closeModalDel, orderDel] = useProfileStore((state) => [state.openModalDelete, state.closeModalDel, state.orderDel]);

  const close = () => {
    setActive(0);
    setText('');
    closeModalDel();
  };

  return (
    <Dialog
      onClose={close}
      className={'ZakazyModalOrderDelete ' + roboto.variable}
      open={openModalDelete}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      fullWidth
    >
      <DialogContent>
        <div className="ContainerZakazyModalOrderDelete">
          <div className="Line" />
          <div className="loginHeader">Отменить заказ?</div>
          <div className="loginText">
            <span>Вы можете отменить в любой момент.</span>
            <span>Почему решили отменить?</span>
          </div>
          {answers.map((answer, key) => (
            <div key={key} className="zakazyAnswer" style={{ background: active === answer.id ? 'rgba(0, 0, 0, 0.05)' : null }} onClick={() => setActive(answer.id)}>
              {answer.val}
            </div>
          ))}

          {active && active !== 5 ? (
            <div className="dopText">
              <span>Спасибо, что рассказали!</span>
              <span>Удачи с планами, пусть всё получится :)</span>
            </div>
          ) : null}

          {active && active === 5 ? (
            <div className="zakazyText">
              <MyTextInput
                variant="standard"
                value={text}
                func={(e) => setText(e.target.value)}
              />
            </div>
          ) : null}

          <Button className="buttonBack" variant="contained" onClick={close} style={{ marginTop: active ? null : '19.230769230769vw' }}>
            <span>Вернуться к заказу</span>
          </Button>
          <Button className="buttonDelete" variant="outlined"
            //onClick={() => orderDel('zakazy', session.data?.user?.token, active === 5 ? text : active ? answers[active - 1].val : answers[active].val)}
          >
            <span>Отменить заказ</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
