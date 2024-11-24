import Meta from '@/components/meta.js';

import PromokodyPC from './promokodyPC';
import PromokodyMobile from './promokodyMobile';

import { useHeaderStoreNew } from '@/components/store';

export default function PromokodyPage({ page, this_module, city }) {
  const [matches] = useHeaderStoreNew((state) => [state?.matches]);

  return (
    <Meta title={page.title} description={page?.description}>
      {matches ? <PromokodyMobile page={page} this_module={this_module} city={city} /> : <PromokodyPC page={page} this_module={this_module} city={city} />}
    </Meta>
  );
}
