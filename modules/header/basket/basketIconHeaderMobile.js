import Link from 'next/link';
import { useCartStore } from '@/components/store.js';
import { BasketIconMobile } from '@/ui/Icons.js';
import ListItem from '@mui/material/ListItem';

export default function BasketIconHeaderMobile({ setActiveMenu, active_page,city }) {
  //console.log('render BasketIconHeaderMobile');

  const [itemsCount] = useCartStore((state) => [state.itemsCount]);

  return (
    <ListItem onClick={() => setActiveMenu(false)}>
      <Link href={`/${city}/cart`} style={{background: active_page === 'cart' ? 'rgba(0, 0, 0, 0.03)' : null}}>
        <div>
          <div><BasketIconMobile /></div>
          <span style={{color: active_page === 'cart' ? ' #dd1a32' : null}}>Корзина</span>
          {itemsCount ? <div className="count"><span>{itemsCount}</span></div> : null}
        </div>
      </Link>
    </ListItem>
  );
}
