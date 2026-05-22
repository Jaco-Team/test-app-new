'use client';

import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCartStore } from '@src/entities/cart';
import { useHeaderStore } from '@src/entities/header';
import { cityPath } from '@src/shared/lib/sitePaths';
import { formatCartLabel } from '@src/features/header/model/formatCartLabel';

export function BasketPanel({ city }: { city: string }) {
  const compact = useMediaQuery('(max-width: 800px)');
  const open = useHeaderStore((state) => state.openBasket);
  const anchor = useHeaderStore((state) => state.targetBasket);
  const setActiveBasket = useHeaderStore((state) => state.setActiveBasket);

  const items = useCartStore((state) => state.itemsOffDops);
  const dopListCart = useCartStore((state) => state.dopListCart);
  const checkPromo = useCartStore((state) => state.checkPromo);
  const allPrice = useCartStore((state) => state.allPrice);

  const label = formatCartLabel(items, dopListCart, checkPromo, allPrice);

  if (compact && open) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1300,
          background: '#fff',
          padding: 16,
          overflow: 'auto',
        }}
      >
        <Button onClick={() => setActiveBasket(false)}>Закрыть</Button>
        <h2 style={{ marginTop: 16 }}>Корзина</h2>
        <p>{label}</p>
        <ul>
          {items.map((line, index) => (
            <li key={`${line.item_id}-${index}`}>
              {String((line as { name?: string }).name ?? 'Товар')} ×{' '}
              {String(line.count ?? 1)}
            </li>
          ))}
        </ul>
        <Button
          variant="contained"
          href={cityPath(city, 'cart')}
          sx={{ mt: 2 }}
        >
          Оформить
        </Button>
      </div>
    );
  }

  return (
    <Popover
      open={open}
      anchorEl={anchor}
      onClose={() => setActiveBasket(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <div style={{ padding: 16, width: 320 }}>
        <h3 style={{ margin: '0 0 12px' }}>Корзина</h3>
        <p style={{ margin: '0 0 12px' }}>{label}</p>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {items.map((line, index) => (
            <li key={`${line.item_id}-${index}`}>
              {String((line as { name?: string }).name ?? 'Товар')} ×{' '}
              {String(line.count ?? 1)}
            </li>
          ))}
        </ul>
        <Button
          variant="contained"
          fullWidth
          href={cityPath(city, 'cart')}
          sx={{ mt: 2 }}
        >
          Оформить
        </Button>
      </div>
    </Popover>
  );
}
