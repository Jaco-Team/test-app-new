import { useState } from 'react';
import PropTypes from 'prop-types';
import './MenuContactsPC.scss';

import { MyMenu } from '../MyMenu/MyMenu';
import { MySwitch } from '../MySwitch/MySwitch';
import { ArrowDownHeaderPC, MapPointIcon } from '../Icons';

const cityList = [
  { title: 'Тольятти' },
  { title: 'Самара' },
  { title: 'Комсомольск-на-Амуре' },
];

export const MenuContactsPC = ({ city, points, phone, disable, active }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  function openMenu(event) {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  }

  function closeMenu() {
    setAnchorEl(null);
    setIsOpen(false);
  }

  return (
    <div className="сontactPC">
      <div className="chooseCity" onClick={openMenu}>
        <span>{city}</span>
        <ArrowDownHeaderPC />
      </div>

      <div className="listAddr">
        <h2>Адреса кафе:</h2>
        <ul>
          {points.map((point, key) => (
            <li key={key}>
              <MapPointIcon />
              <span style={{ color: key === 0 && active ? '#dd1a32' : null }}>
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

MenuContactsPC.propTypes = {
  city: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  points: PropTypes.array,
  disable: PropTypes.bool,
  active: PropTypes.bool,
};
