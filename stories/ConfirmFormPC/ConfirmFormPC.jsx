import PropTypes from 'prop-types';
import './ConfirmFormPC.scss';

import { MyButton } from '../MyButton/MyButton';
import { ArrowLeftMobile, Cloud, CheckAuthMobile } from '@/ui/Icons';

export const ConfirmFormPC = ({city, address, data, time, items, itemsCount, allPrice, promo, sdacha}) => {
  function getWord(int, array) {
    return (
      (array = array || ['позиция', 'позиции', 'позиций']) && array[int % 100 > 4 && int % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][int % 10 < 5 ? int % 10 : 5]]
    );
  }

  return (
    <div className="containerConfirmPC">
      <div className="confirmHeader">
        <ArrowLeftMobile />
        <span>Подтверждение заказа</span>
      </div>

      <span className="confirmText">Чтобы всё прошло по плану, проверьте, пожалуйста, условия получения и состав вашего заказа:</span>

      <div className="confirmAddr">
        <span>Доставим по адресу:</span>
        <span>{city + ', ' + address}</span>
      </div>

      <span className="confirmTime">{`Время доставки: ${data + ', '}${time}`}</span>

      <span className="confirmText_2">Указано примерное время доставки, может меняться в зависимости от погодных условий и трафика.</span>

      <div className="confirmMessage">
        <Cloud />
        <span>Из-за погодных условий сегодня курьер может ехать дольше, чем обычно</span>
      </div>

      <div className="cofirmDivider" />

      <div className="cofirmTable">
        {items?.map((item, key) => (
          <div key={key}>
            <span>{item.name}</span>
            <span>{item.count}</span>
            <span>{item.one_price} ₽</span>
          </div>
        ))}
      </div>

      <div className="confirmTotal">
        <span>Итого: {itemsCount} {getWord(itemsCount)}</span>
        <span>{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</span>
      </div>

      {promo ? (
        <div className="confirmPromo promo">
          <CheckAuthMobile />
          <span>{`Применили промокод ${promo}`}</span>
        </div>
      ) : null}

      {sdacha ? (
        <div className={promo ? 'confirmPromo' : 'confirmPromo promo'}>
          <CheckAuthMobile />
          <span>{`Привезём сдачу с ${sdacha} ₽`}</span>
        </div>
      ) : null}

      <MyButton children="Заказать" variant="cart" size="big" />
    </div>
  );
};

ConfirmFormPC.propTypes = {
  city: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  items: PropTypes.array,
  itemsCount: PropTypes.string.isRequired,
  allPrice: PropTypes.string.isRequired,
  promo: PropTypes.string.isRequired,
  sdacha: PropTypes.string.isRequired,
};
