import Meta from '@/components/meta.js';

import PromokodyPC from './promokodyPC';
import PromokodyMobile from './promokodyMobile';

import { useHeaderStore } from '@/components/store';

export default function PromokodyPage({ page, this_module, city }) {
  const [matches] = useHeaderStore((state) => [state.matches]);

  return (
    <Meta title={page.title} description={''}>
      {matches ? <PromokodyMobile city={city} /> : <PromokodyPC page={page} this_module={this_module} city={city} />}
    </Meta>
  );
}
