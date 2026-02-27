import Link from 'next/link';
import { useCartStore, useProfileStore } from '@/components/store.js';
import { BasketIconMobile } from '@/ui/Icons.js';
import ListItem from '@mui/material/ListItem';
import { reachGoal } from '@/utils/metrika';

export default function BasketIconHeaderMobile({ setActiveMenu, active_page, city }) {
  const [itemsCount] = useCartStore((state) => [state.itemsCount]);
  const [ saveUserActions ] = useProfileStore((state) => [state.saveUserActions]);
  
  const openCart = () => {
    setActiveMenu(false);
    saveUserActions('open_card', '', 0);
    reachGoal('open_basket');
  }

  return (
    <ListItem onClick={openCart}>
      <Link href={`/${city}/cart`} style={{ background: active_page === 'cart' ? 'rgba(0, 0, 0, 0.03)' : null}}>
        <BasketIconMobile />
        <span style={{ color: active_page === 'cart' ? ' #dd1a32' : null }}>Корзина</span>
        {itemsCount ? <span className="count">{itemsCount}</span> : null}
      </Link>
    </ListItem>
  );
}
