import Image from 'next/image';
import './TableCart_row.scss';
import { TableCartRowProps } from '@stories/entities/cart/ui/cart-row/model/types';

export const TableCart_row = ({
  last = '',
  title = '',
  img_app = '',
  status_promo = false,
  new_one_price = '',
  all_price = '',
  one_price = '0',
  count = '1',
  disabled = false,
}: TableCartRowProps) => {
  // Вычисляем итоговую цену
  const totalPrice = Number(one_price) * Number(count);
  const formattedTotalPrice = new Intl.NumberFormat('ru-RU').format(totalPrice);

  // Проверяем, нужно ли показывать промо стиль
  const showPromoStyle = status_promo && (new_one_price || disabled);

  // Форматируем полную цену для промо
  const formattedAllPrice = new Intl.NumberFormat('ru-RU').format(
    Number(all_price)
  );

  // Определяем стили для кнопок
  const minusButtonStyle = {
    backgroundColor: disabled ? '#fff' : 'rgba(0, 0, 0, 0.05)',
    color: disabled ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.8)',
  };

  const plusButtonStyle = {
    backgroundColor:
      disabled || Number(count) > 98 ? '#fff' : 'rgba(0, 0, 0, 0.05)',
    color:
      disabled || Number(count) > 98
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.8)',
  };

  const isPlusDisabled = disabled || Number(count) > 98;

  return (
    <tr
      className="rowTableCart"
      style={{
        borderBottom:
          last === 'last'
            ? 'none'
            : '0.072202166064982vw solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <td>
        <Image
          alt={title}
          src={`https://cdnimg.jacofood.ru/${img_app}_584x584.jpg`}
          width={584}
          height={584}
          priority={true}
        />
      </td>
      <td>
        <span>{title}</span>
        <div>
          <span className={showPromoStyle ? 'promoInfo' : undefined}>
            {formattedTotalPrice} ₽
          </span>

          {showPromoStyle && (
            <span>
              {disabled ? 'В подарок за ' : null}
              {formattedAllPrice} ₽
            </span>
          )}
        </div>
      </td>
      <td>
        <button className="minus" style={minusButtonStyle} disabled={disabled}>
          –
        </button>
        <span>{count}</span>
        <button
          className="plus"
          style={plusButtonStyle}
          disabled={isPlusDisabled}
        >
          +
        </button>
      </td>
    </tr>
  );
};
