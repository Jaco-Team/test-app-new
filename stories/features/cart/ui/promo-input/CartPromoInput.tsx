import MyTextInput from '@stories/shared/ui/text-input/MyTextInput';
import InputAdornment from '@mui/material/InputAdornment';
import './CartPromoInput.scss';

export const CartPromoInput = ({
  promo,
  checkPromo,
  items_on_price,
  status_promo,
  itemsCount,
  allPrice,
  promoItemsFind,
}: Record<string, any>) => {
  return (
    <div className="promoInput">
      <MyTextInput
        placeholder="Есть промокод"
        value={promo}
        inputAdornment={
          <InputAdornment
            position="end"
            style={{
              backgroundColor: checkPromo
                ? checkPromo.st === true
                  ? '#76ec3f'
                  : '#DD1A32'
                : null,
            }}
          />
        }
      />
      {items_on_price?.length ? (
        promoItemsFind ? (
          <span>{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</span>
        ) : null
      ) : status_promo && itemsCount ? (
        <span>{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</span>
      ) : null}
    </div>
  );
};
