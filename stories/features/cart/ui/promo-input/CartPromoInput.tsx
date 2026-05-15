import MyTextInput from '@stories/shared/ui/text-input/MyTextInput';
import InputAdornment from '@mui/material/InputAdornment';
import './CartPromoInput.scss';
import { CartPromoInputProps } from '@stories/features/cart/ui/promo-input/model/types';

export const CartPromoInput = ({
  promo = '',
  checkPromo = null,
  items_on_price = [],
  status_promo = false,
  itemsCount = 0,
  allPrice = 0,
  promoItemsFind = false,
}: CartPromoInputProps) => {
  // Определяем цвет индикатора
  const getAdornmentColor = (): string | undefined => {
    if (!checkPromo) return undefined;
    return checkPromo.st === true ? '#76ec3f' : '#DD1A32';
  };

  // Проверяем, нужно ли показывать цену
  const shouldShowPrice = (): boolean => {
    if (items_on_price?.length) {
      return promoItemsFind || false;
    }
    return status_promo && itemsCount > 0;
  };

  // Форматируем цену
  const formattedPrice = new Intl.NumberFormat('ru-RU').format(
    Number(allPrice)
  );

  return (
    <div className="promoInput">
      <MyTextInput
        placeholder="Есть промокод"
        value={promo}
        inputAdornment={
          <InputAdornment
            position="end"
            style={{ backgroundColor: getAdornmentColor() }}
          />
        }
      />
      {shouldShowPrice() && <span>{formattedPrice} ₽</span>}
    </div>
  );
};
