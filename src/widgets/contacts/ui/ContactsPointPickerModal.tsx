'use client';

import { useContactStore } from '@src/entities/contact';
import { Modal } from '@src/shared/ui';
import './ContactsPointPickerModal.scss';

export function ContactsPointPickerModal() {
  const open = useContactStore((state) => state.openModalChoose);
  const setOpen = useContactStore((state) => state.setActiveModalChoose);
  const myAddr = useContactStore((state) => state.myAddr);
  const point = useContactStore((state) => state.point);
  const choosePointMap = useContactStore((state) => state.choosePointMap);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="Выберите адрес"
      closeLabel="Закрыть"
    >
      <ul className="contacts-point-picker">
        {myAddr.map((item) => (
          <li key={item.addr}>
            <button
              type="button"
              className={
                'contacts-point-picker__item' +
                (point === item.addr
                  ? ' contacts-point-picker__item--active'
                  : '')
              }
              onClick={() => choosePointMap(item.addr)}
            >
              <span className="contacts-point-picker__addr">{item.addr}</span>
              {item.raion ? (
                <span className="contacts-point-picker__district">
                  {item.raion}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
