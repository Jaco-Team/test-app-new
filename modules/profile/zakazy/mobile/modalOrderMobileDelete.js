import { useState } from 'react';

import { useProfileStore, useHeaderStore } from '@/components/store.js';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';

import { roboto } from '@/ui/Font.js';
import MyTextInput from '@/ui/MyTextInput';

const answers = [
  { id: 1, val: 'Хочу отредактировать заказ' },
  { id: 2, val: 'Изменились планы' },
  { id: 3, val: 'Долгое время ожидания' },
  { id: 4, val: 'Недостаточно средств' },
  { id: 5, val: 'Просто отмените' },
  { id: 6, val: 'Другое' },
];

export default function ModalOrderMobileDelete() {
  const [active, setActive] = useState(0);
  const [text, setText] = useState('');

  const [token] = useHeaderStore( state => [state.token] )

  const [openModalDelete, closeModalDel, orderDel] = useProfileStore((state) => [state.openModalDelete, state.closeModalDel, state.orderDel]);

  const close = () => {
    setActive(0);
    setText('');
    closeModalDel();
  };

  const changeComment = (event) => {

    if(event === '') {
      setText(event);
    } else {
      const comment = event?.target?.value ?? event;

      const len = comment.split(/\r?\n|\r|\n/g)

      if(len?.length > 2) {
        return ;
      }

      if (comment?.length > 50) {
        return ;
      }

      setText(comment);
    }

  }

  return (
    <SwipeableDrawer
      anchor={'bottom'}
      open={openModalDelete}
      onClose={close}
      onOpen={() => {}}
      className={'ZakazyModalOrderDelete ' + roboto.variable}
      disableSwipeToOpen
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

          {active && active !== 6 ? (
            <div className="dopText">
              <span>Спасибо, что рассказали!</span>
              <span>Удачи с планами, пусть всё получится :)</span>
            </div>
          ) : null}

          {active && active === 6 ?
            <div className="zakazyText">
              <MyTextInput
                autoFocus
                type="text"
                value={text}
                func={(event) => changeComment(event)}
                multiline
                maxRows={3}
                variant="outlined"
                className="message"
                placeholder="Опишите причину отмены"
              />
            </div>
          : null}

          <Button className="buttonBack" variant="contained" onClick={close} style={{ marginTop: active ? null : '19.230769230769vw' }}>
            <span>Вернуться к заказу</span>
          </Button>
          <Button className="buttonDelete" variant="outlined"
            onClick={ () => orderDel( 'zakazy', token, active === 6 ? text : answers[active].val ?? '') }
          >
            <span>Отменить заказ</span>
          </Button>
        </div>
      </DialogContent>
    </SwipeableDrawer>
  );
}
