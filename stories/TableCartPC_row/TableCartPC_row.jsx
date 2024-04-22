import PropTypes from 'prop-types';
import Image from 'next/image';
import './TableCartPC_row.scss';

export const TableCartPC_row = ({ last, title, img_app, status_promo, new_one_price, all_price, one_price, count, disabled}) => {
  return (
    <tr style={{ borderBottom: last ? 'none' : '0.072202166064982vw solid rgba(0, 0, 0, 0.1)' }}>
      <Image alt={title} src={'https://cdnimg.jacofood.ru/' + img_app + '_584x584.jpg'} width={584} height={584} priority={true} />
      <td>
        <span>{title}</span>
        <div>
          <span className={ status_promo && (new_one_price || disabled) ? 'promoInfo' : null}>
            {new Intl.NumberFormat('ru-RU').format(parseInt(one_price) * parseInt(count))}{' '}₽
          </span>

          {status_promo && (new_one_price || disabled) ? (
            <span>
              {disabled ? 'В подарок за ' : null}
              {new Intl.NumberFormat('ru-RU').format(all_price)} ₽
            </span>
          ) : null}
        </div>
      </td>
      <td>
        <button className="minus" style={{ backgroundColor: disabled ? '#fff' : 'rgba(0, 0, 0, 0.05)', color: disabled ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.8)'}} disabled={disabled ? true : false}>–</button>
        <span>{count}</span>
        <button className="plus" style={{ backgroundColor: disabled || count > 98 ? '#fff' : 'rgba(0, 0, 0, 0.05)', color: disabled || count > 98 ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.8)'}} disabled={disabled || count > 98 ? true : false}>+</button>
      </td>
    </tr>
  );
};

TableCartPC_row.propTypes = {
  last: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  img_app: PropTypes.string.isRequired,
  new_one_price: PropTypes.string.isRequired,
  status_promo: PropTypes.bool,
  disabled: PropTypes.bool,
  one_price: PropTypes.string.isRequired,
  all_price: PropTypes.string.isRequired,
  count: PropTypes.string.isRequired,
};
