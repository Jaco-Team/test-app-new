import Button from '@mui/material/Button';

import { useVarioqubFlag } from '@/utils/varioqub';

export default function CartCtaButton({ price, onClick, disabled = false, className = '' }) {
  const ctaVariant = useVarioqubFlag('cart_cta_variant', 'control');
  const formattedPrice = new Intl.NumberFormat('ru-RU').format(price ?? 0);
  const isExperiment = ctaVariant === 'cta_text_price';
  // const isExperiment = true;

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
