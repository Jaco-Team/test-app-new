'use client';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useContactStore } from '@src/entities/contact';
import { ModalWrapper } from '@src/shared/ui';
import { cn } from '@ui/foundation/classNames';
import './ContactsPointPickerModal.scss';

export function ContactsPointPickerModal() {
  const open = useContactStore((state) => state.openModalChoose);
  const setOpen = useContactStore((state) => state.setActiveModalChoose);
  const myAddr = useContactStore((state) => state.myAddr);
  const point = useContactStore((state) => state.point);
  const choosePointMap = useContactStore((state) => state.choosePointMap);

  return (
    <ModalWrapper
      open={open}
      onClose={() => setOpen(false)}
      variant="responsive"
      sheetHeader="hidden"
      className="contacts-point-picker-modal"
      paperClassName="contacts-point-picker-modal__paper"
      contentClassName="contacts-point-picker-modal__content"
    >
      <div className="contacts-point-picker-modal__grip" aria-hidden="true" />
      <List className="contacts-point-picker" disablePadding>
        {myAddr.map((item) => (
          <ListItem
            key={item.addr}
            className={cn(
              'contacts-point-picker__item',
              point === item.addr && 'contacts-point-picker__item--active'
            )}
            disablePadding
            onClick={() => choosePointMap(item.addr)}
          >
            <span className="contacts-point-picker__addr">{item.addr}</span>
            {item.raion ? (
              <span className="contacts-point-picker__district">
                {item.raion}
              </span>
            ) : null}
          </ListItem>
        ))}
      </List>
    </ModalWrapper>
  );
}
