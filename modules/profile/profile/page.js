import Meta from '@/components/meta.js';

import ProfilePC from './profilePC.jsx';
import ProfileMobile from './profileMobile.js';

import { useHeaderStore } from '@/components/store';

export default function ProfilePage({ page, this_module, city }) {
  const [matches] = useHeaderStore((state) => [state?.matches]);

  return (
    <Meta title={page.title} description={''}>
      {matches ? <ProfileMobile city={city} this_module={this_module}/> : <ProfilePC page={page} this_module={this_module} city={city} />}
    </Meta>
  );
}
