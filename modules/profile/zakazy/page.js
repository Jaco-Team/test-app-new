import Meta from '@/components/meta.js';

import OrderPC from './PC/orderPC';
import OrderMobile from './mobile/orderMobile';

import { useHeaderStoreNew } from '@/components/store';

export default function OrderPage({ page, this_module, city }) {
  const [matches] = useHeaderStoreNew((state) => [state.matches]);

  return (
    <Meta title={page?.title ?? ''} description={''}>
      {matches ? 
        <OrderMobile this_module={this_module} city={city} /> 
          : 
        <OrderPC this_module={this_module} city={city} />
      }
    </Meta>
  );
}
