import Button from '@mui/material/Button';

import { useFlagContext } from 'yandex-metrica-ab-react';

export default function CartCtaButton({ price, onClick, disabled = false, className = '' }) {
  const { ready, value } = useFlagContext('cart_cta_variant', true);
  const ctaVariant = ready && value ? value : 'control';
  const formattedPrice = new Intl.NumberFormat('ru-RU').format(price ?? 0);
  const isExperiment = ctaVariant === 'cta_text_price';
  // const isExperiment = true;

  // console.log('CartCtaButton', ready, value)

  return (
    <Button
      variant={isExperiment ? 'contained' : 'outlined'}
      onClick={onClick}
      disabled={disabled}
      className={className}
      sx={
        isExperiment
          ? {
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '999px',
              backgroundColor: '#CC0033',
              color: '#FFFFFF !important',
              fontWeight: 500,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#B8002E',
                boxShadow: 'none',
              },
            }
          : {
              textTransform: 'none',
            }
      }
    >
      {isExperiment ? `В корзину за ${formattedPrice} ₽` : `${formattedPrice} ₽`}
    </Button>
  );
}
