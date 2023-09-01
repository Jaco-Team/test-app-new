import Meta from '@/components/meta.js';

import CartMobile from './cartMobile';
import CartMenuMobile from './cartMenuMobile';
import CartMapPoints from './cartMapPoints';
import CartDataTimePicker from './cartDataTimePicker';

import { useHeaderStore } from '@/components/store';

export default function CartPage({ page, cityName }) {

  const [matches] = useHeaderStore((state) => [state.matches]);

  return (
    <Meta title={page.title} description={page.description}>
      {matches ?
      <>
      <CartMobile /> 
      <CartMenuMobile cityName={cityName} />
      <CartDataTimePicker />
      <CartMapPoints cityName={cityName}/>
      </>
      : null}
    </Meta>
  );
}
