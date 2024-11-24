import Meta from '@/components/meta.js';

import AccountMobile from './accountMobile';
import AccountModalMobile from './modalAccountMobile';

import { useHeaderStore } from '@/components/store';

export default function AccountPage({ page, this_module, city }) {
  const [matches] = useHeaderStore((state) => [state?.matches]);

  return (
    <Meta title={page.title} description={''}>
      {matches ? (
        <>
          <AccountMobile city={city} this_module={this_module} />
          <AccountModalMobile />
        </>
      ) : null }
    </Meta>
  );
}
