import Meta from '@/components/meta.js';

import OrderPC from './PC/orderPC';
import OrderMobile from './mobile/orderMobile';

import { useHeaderStore } from '@/components/store';

export default function OrderPage({ page, this_module, city }) {
  const [matches] = useHeaderStore((state) => [state.matches]);

  console.log( 'city', city )

  return (
    <Meta title={page.title} description={''}>
      {matches ? 
        <OrderMobile this_module={this_module} city={city} /> 
          : 
        <OrderPC page={page} this_module={this_module} city={city} />
      }
    </Meta>
  );
}
