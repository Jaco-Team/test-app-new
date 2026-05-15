import { useState, MouseEvent } from 'react';
import './MenuContacts.scss';

import { MyMenu } from '@stories/shared/MyMenu/MyMenu';
import { MySwitch } from '@stories/shared/ui/switch/MySwitch';
import { ArrowDownHeaderPC, MapPointIcon } from '@stories/shared/Icons.js';
import {
  CityItem,
  MenuContactsProps,
} from '@stories/features/contacts/ui/contacts-menu/model/types';

const cityList: CityItem[] = [
  { title: 'Тольятти' },
  { title: 'Самара' },
  { title: 'Комсомольск-на-Амуре' },
];

export const MenuContacts = ({
  city = '',
  points = [],
  phone = '',
  disable = false,
  active = false,
}: MenuContactsProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openMenu = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const closeMenu = (): void => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  return (
    <div className="сontactPC">
      <div className="chooseCity" onClick={openMenu}>
        <span>{city}</span>
        <ArrowDownHeaderPC />
      </div>

      <div className="listAddr">
        <h2>Адреса кафе:</h2>
        <ul>
          {points.map((point, key: number) => (
            <li key={key}>
              <MapPointIcon />
              <span
                style={{ color: key === 0 && active ? '#dd1a32' : undefined }}
              >
                {point.addr}
              </span>
            </li>
          ))}
        </ul>
        <div className="divider" />
      </div>

      <div className="listInfo">
        <span>Телефон для заказа</span>
        <h2>{phone}</h2>
        <span>Работаем ежедневно</span>
        <h2>10:00 - 21:30</h2>
        <div className="divider" />
      </div>

      <div className="switch">
        <span>Показать зону доставки</span>
        <MySwitch type="ios" checked={disable} />
      </div>

      <MyMenu
        list={cityList}
        isOpen={isOpen}
        anchorEl={anchorEl}
        onClose={closeMenu}
        type="contacts"
      />
    </div>
  );
};
