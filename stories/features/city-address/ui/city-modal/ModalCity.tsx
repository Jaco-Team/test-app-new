import { useState } from 'react';

import { MyButton } from '@stories/shared/ui/button/MyButton';
import { MyMenu } from '@stories/shared/MyMenu/MyMenu';

import './ModalCity.scss';

const cityList = [
  { title: 'Тольятти' },
  { title: 'Самара' },
  { title: 'Комсомольск-на-Амуре' },
];

export const ModalCity = ({ city }: Record<string, any>) => {
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
    <div className="city-modal">
      <img alt="Город" src={'/Favicon_city.png'} />
      <span>Вы в городе</span>
      <span>{city}</span>
      <div>
        <MyButton children="Да, верно" variant="primary" size="large" />
        <MyButton
          children="Нет, выберу город"
          variant="city"
          size="large"
          arrow={true}
          onClick={openMenu}
          isOpen={isOpen}
        />
      </div>

      <MyMenu
        list={cityList}
        isOpen={isOpen}
        anchorEl={anchorEl}
        onClose={closeMenu}
        type="city"
      />
    </div>
  );
};
