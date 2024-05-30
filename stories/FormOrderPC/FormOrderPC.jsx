import { useState } from 'react';
import PropTypes from 'prop-types';

import { MySwitch } from '../MySwitch/MySwitch';
import { FormOrderPC_btn } from '../FormOrderPC_btn/FormOrderPC_btn';
import { MyButton } from '../MyButton/MyButton';
import { MyMenu } from '../MyMenu/MyMenu';

import './FormOrderPC.scss';

export const FormOrderPC = ({typeOrder, summ, itemsCount, allPrice, allPriceWithoutPromo_new, hours, list, list_address, address, online, comment}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenCat, setIsOpenCat] = useState(false);
  const [type, setType] = useState('default');

  function openMenu(event, type) {
    setType(type);
    setAnchorEl(event.currentTarget);
    setIsOpenCat(true);
  }

  function closeMenu() {
    setAnchorEl(null);
    setIsOpenCat(false);
  }

  function getWord(int, array) {
    return ((array = array || ['позиция', 'позиции', 'позиций']) && array[int % 100 > 4 && int % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][int % 10 < 5 ? int % 10 : 5]]);
  }

  return (
    <>
      <div className="modalFormOrderPC">
        <span className="loginHeader">Оформить заказ</span>
        <MySwitch type="cart" checked={typeOrder === 'pickup' ? true : false}/>
        <FormOrderPC_btn
          text="тольятти"
          icon="city"
          onClick={(e) => openMenu(e, 'default')}
          open={isOpenCat}
        />
        <FormOrderPC_btn
          text={address}
          icon={typeOrder === 'pickup' ? 'point' : 'home'}
          placeholder={!address ? typeOrder === 'pickup' ? 'Выберите кафе' : 'Выберите адрес' : ''}
          onClick={(e) => openMenu(e, typeOrder === 'pickup' ? 'default' : 'address')}
          open={isOpenCat}
        />
        <FormOrderPC_btn
          icon="time"
          text="В ближайшее время"
          onClick={(e) => openMenu(e, 'default')}
          open={isOpenCat}
        />
        <FormOrderPC_btn
          icon="card"
          placeholder={!online ? typeOrder === 'pickup' ? '' : 'Способо оплаты' : ''}
          text={typeOrder === 'pickup' ? 'В кафе' : online ? online : ''}
          onClick={(e) => openMenu(e, 'default')}
          open={isOpenCat}
        />
        {typeOrder === 'delivery' && online === 'Наличными курьеру' ?
          <FormOrderPC_btn
            icon="sdacha"
            placeholder='Без сдачи'
            text={online ? online : ''}
          />
        : null}
        {typeOrder === 'pickup' ? null : (
          <FormOrderPC_btn icon="comment" placeholder={comment ? '' : 'Сообщение курьеру'} text={comment ? comment : ''} />
        )}
        <span className="divider" />
        {typeOrder === 'pickup' ? null : (
          <div className="delivery">
            <span>Доставка:</span>
            <span>{new Intl.NumberFormat('ru-RU').format(summ)} ₽</span>
          </div>
        )}

        <div className="total" style={{marginTop: typeOrder == 'pickup' ? '2.1660649819495vw' : '0.72202166064982vw'}}>
          <span>Итого: {itemsCount} {getWord(itemsCount)}</span>
          <span>{new Intl.NumberFormat('ru-RU').format(allPrice ? parseInt(allPrice) + parseInt(summ) : parseInt(allPriceWithoutPromo_new) + parseInt(summ))}{' '}₽</span>
        </div>

        {typeOrder == 'pickup' ? (
          <span className="dopTextForm">{parseInt(hours) >= 21 ? 'Заказы на самовывоз выдаются до 22:00' : ''}</span>
        ) : (
          <span className="dopTextForm">
            Уважаемые клиенты, на сайте указано приблизительное время готовности
            заказа и доставки. В зависимости от ситуации на дорогах время
            доставки может быть увеличено. Благодарим за понимание!
          </span>
        )}
        <MyButton children="Заказать" variant="cart" size="big" />
      </div>

      <MyMenu
        list={type === 'default' ? list : list_address}
        isOpen={isOpenCat}
        anchorEl={anchorEl}
        onClose={closeMenu}
        type="form_order"
      />

    </>
  );
};

FormOrderPC.propTypes = {
  typeOrder: PropTypes.string.isRequired,
  summ: PropTypes.string.isRequired,
  itemsCount: PropTypes.string.isRequired,
  allPrice: PropTypes.string.isRequired,
  allPriceWithoutPromo_new: PropTypes.string.isRequired,
  hours: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  online: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
};
