import Meta from '@/components/meta.js';

import CartMobile from './cartMobile';
import CartMenuMobile from './cartMenuMobile';
import CartMapPoints from './cartMapPoints';
import PayForm from './payForm';
import DataTimePicker from '@/modules/cartForm/dataTimePicker';

import { useHeaderStore } from '@/components/store';

export default function CartPage({ page, cityName }) {

  const [matches] = useHeaderStore((state) => [state.matches]);

  return (
    <Meta title={page.title} description={page.description}>
      {matches ?
      <>
        <CartMobile cityName={cityName} /> 
        <CartMenuMobile cityName={cityName} />
        <CartMapPoints />
        <DataTimePicker />
      </>
      : null}

      <PayForm />
    </Meta>
  );
}
