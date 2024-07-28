import Link from 'next/link';
import { useCartStore, 
  // useHeaderStore 
} from '@/components/store.js';
import { BasketIconMobile } from '@/ui/Icons.js';
import ListItem from '@mui/material/ListItem';

export default function BasketIconHeaderMobile({ setActiveMenu, active_page, city }) {
  const [itemsCount] = useCartStore((state) => [state.itemsCount]);

  // const [setActiveModalAuth] = useHeaderStore((state) => [state.setActiveModalAuth]);

  // function openBasketModal(event){
  //   // if( isAuth == 'auth' ){
      
  //   // }else{
  //     event.preventDefault();
  //     setActiveModalAuth(true);
  //   //}
  // }

  return (
    <ListItem onClick={() => setActiveMenu(false)}>
      <Link href={`/${city}/cart`} style={{ background: active_page === 'cart' ? 'rgba(0, 0, 0, 0.03)' : null}}>
        <BasketIconMobile />
        <span style={{ color: active_page === 'cart' ? ' #dd1a32' : null }}>Корзина</span>
        {itemsCount ? <span className="count">{itemsCount}</span> : null}
      </Link>
    </ListItem>
  );
}
