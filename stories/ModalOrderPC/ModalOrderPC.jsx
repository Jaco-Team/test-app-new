import PropTypes from 'prop-types';

import { MyButton } from '../MyButton/MyButton';
import {SharpIcon, CalendarIcon, MyAddrLocationIcon, EyeHide_modalOrder, EyeShow_modalOrder, CartModalOrderIcon, CookModalOrderIcon, DeliveryModalOrderIcon, HomeModalOrderIcon, AddrDotsModalOrderIcon, PicupModalOrderIcon} from '../Icons';
import LinearProgress from '@mui/material/LinearProgress';
import './ModalOrderPC.scss';

function ModalOrderStatusIconDelivery({ types }) {
  return (
    <div className="header_status_icon">
      <div className={parseInt(types?.type1) == 1 || parseInt(types?.type1) == 0 ? 'active' : ''}>
        <CartModalOrderIcon fill={'#fff'} />
      </div>
      {parseInt(types?.type2) == 1 || parseInt(types?.type2) == -1 ? (
        <LinearProgress variant="determinate" className={parseInt(types?.type2) == -1 ? '' : 'active'} value={parseInt(types?.type2) == 1 ? 100 : 0} />
      ) : (
        <LinearProgress />
      )}

      <div className={parseInt(types?.type2) == 1 || parseInt(types?.type2) == 0 ? 'active' : ''}>
        <CookModalOrderIcon fill={'#fff'} />
      </div>
      {parseInt(types?.type3) == 1 || parseInt(types?.type3) == -1 ? (
        <LinearProgress variant="determinate" className={parseInt(types?.type3) == -1 ? '' : 'active'} value={parseInt(types?.type3) == 1 ? 100 : 0} />
      ) : (
        <LinearProgress />
      )}

      <div className={parseInt(types?.type3) == 1 || parseInt(types?.type3) == 0 ? 'active' : ''}>
        <DeliveryModalOrderIcon fill={'#fff'} />
      </div>
      {parseInt(types?.type4) == 1 || parseInt(types?.type4) == -1 ? (
        <LinearProgress variant="determinate" className={parseInt(types?.type4) == -1 ? '' : 'active'} value={parseInt(types?.type4) == 1 ? 100 : 0} />
      ) : (
        <LinearProgress />
      )}
      <div className={parseInt(types?.type4) == 1 || parseInt(types?.type4) == 0 ? 'active' : ''}>
        <HomeModalOrderIcon fill={'#fff'} />
      </div>
    </div>
  );
}

function ModalOrderStatusIconPicup({ types }) {
  return (
    <div className="header_status_icon">
      <div className={parseInt(types?.type1) == 1 || parseInt(types?.type1) == 0 ? 'active' : ''}>
        <CartModalOrderIcon fill={'#fff'} />
      </div>
      {parseInt(types?.type2) == 1 || parseInt(types?.type2) == -1 ? (
        <LinearProgress variant="determinate" className={parseInt(types?.type2) == -1 ? '' : 'active'} value={parseInt(types?.type2) == 1 ? 100 : 0} />
      ) : (
        <LinearProgress />
      )}

      <div className={parseInt(types?.type2) == 1 || parseInt(types?.type2) == 0 ? 'active' : ''}>
        <CookModalOrderIcon fill={'#fff'} />
      </div>
      {parseInt(types?.type3) == 1 || parseInt(types?.type3) == -1 ? (
        <LinearProgress variant="determinate" className={parseInt(types?.type3) == -1 ? '' : 'active'} value={parseInt(types?.type3) == 1 ? 100 : 0} />
      ) : (
        <LinearProgress />
      )}

      <div className={parseInt(types?.type3) == 1 || parseInt(types?.type3) == 0 ? 'active' : ''}>
        <PicupModalOrderIcon fill={'#fff'} />
      </div>
      {parseInt(types?.type4) == 1 || parseInt(types?.type4) == -1 ? (
        <LinearProgress variant="determinate" className={parseInt(types?.type4) == -1 ? '' : 'active'} value={parseInt(types?.type4) == 1 ? 100 : 0} />
      ) : (
        <LinearProgress />
      )}
      <div className={parseInt(types?.type4) == 1 || parseInt(types?.type4) == 0 ? 'active' : ''}>
        <HomeModalOrderIcon fill={'#fff'} />
      </div>
    </div>
  );
}

export const ModalOrderPC = ({ modalOrder, isShowAddr, city }) => {
  let order_status = '';

  if (parseInt(modalOrder?.order?.is_delete) == 1) {
    order_status = `Отменили в ${modalOrder?.order?.del_date_time}`;
  } else {
    if (parseInt(modalOrder?.order?.type_order_) == 1) {
      if (parseInt(modalOrder?.order?.status_order) >= 1 && parseInt(modalOrder?.order?.status_order) <= 5) {
        order_status = `Доставим до ${modalOrder?.order?.max_time_order}`;
      } else {
        order_status = `Доставили в ${modalOrder?.order?.close_date_time}`;
      }
    } else {
      if (parseInt(modalOrder?.order?.status_order) >= 1 && parseInt(modalOrder?.order?.status_order) <= 3) {
        order_status = `Будет готов до ${modalOrder?.order?.max_time_order}`;
      } else {
        if (parseInt(modalOrder?.order?.status_order) == 4) {
          order_status = 'Ждёт в кафе, можно забирать';
        } else {
          order_status = `Отдали в ${modalOrder?.order?.close_date_time}`;
        }
      }
    }
  }
  return (
    <div className="modalOrderPC">
      <span className="header_status">Заказ {modalOrder?.order?.this_status_order}</span>
      <span className="header_time">{order_status}</span>

      {parseInt(modalOrder?.order?.type_order_) == 1 ? <ModalOrderStatusIconDelivery types={modalOrder?.order?.types} /> : <ModalOrderStatusIconPicup types={modalOrder?.order?.types} />}

      <div className="header_addr_table">
        <div>
          <SharpIcon />
          <span className="order_num">{modalOrder?.order?.order_id}</span>
          <CalendarIcon />
          <span>{modalOrder?.order?.date_time_order_new}</span>
        </div>

        <div>
          {parseInt(modalOrder?.order?.type_order_) == 1 ? <MyAddrLocationIcon /> : <PicupModalOrderIcon fill="#DD1A32" />}
          {isShowAddr ? (
            <span className="order_city">
              {city + ', '}
              {parseInt(modalOrder?.order?.type_order_) == 1 ? modalOrder?.order?.street + ', ' + modalOrder?.order?.home + ', кв. ' + modalOrder?.order?.kv : modalOrder?.order?.point_name}
            </span>
          ) : (
            <div className="order_city">
              <span>{city + ' '}</span>
              <AddrDotsModalOrderIcon className="long" />
            </div>
          )}

          {parseInt(modalOrder?.order?.type_order_) == 1 ? isShowAddr ? <EyeShow_modalOrder fill="black" /> : <EyeHide_modalOrder /> : <EyeShow_modalOrder fill="white" />}
        </div>
      </div>
      
      <div className="header_cart_table">
        <div className="table_header">
          <span>Состав и стоимость заказа:</span>
          <span>{new Intl.NumberFormat('ru-RU').format(modalOrder?.order?.sum_order)}{' '}₽</span>
        </div>

        {modalOrder?.order_items?.map((item, key) => (
          <div key={key}>
            <span>{item.count}</span>
            <span>{item.name}</span>
            <span>{new Intl.NumberFormat('ru-RU').format(item.price)} ₽</span>
          </div>
        ))}
      </div>

      <MyButton
        children={parseInt(modalOrder?.order?.status_order) > 0 && parseInt(modalOrder?.order?.status_order) < 6 && parseInt(modalOrder?.order?.is_delete) == 0 ? 'Отменить заказ' : 'Повторить заказ'}
        variant="secondary"
        size="large"
      />

    </div>
  );
};

ModalOrderPC.propTypes = {
  modalOrder: PropTypes.object,
  isShowAddr: PropTypes.bool,
  city: PropTypes.string.isRequired,
};
