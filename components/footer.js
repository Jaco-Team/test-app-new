import {memo} from 'react';
import FooterPC from '@/modules/footer/footerPC';
import FooterMobile from '@/modules/footer/footerMobile';
import {useHeaderStoreNew} from './store';

export default memo(function Footer({ cityName, active_page, links }) {
  const [matches] = useHeaderStoreNew((state) => [state?.matches]);

  if( matches ){
    return (
      <FooterMobile cityName={cityName} active_page={active_page} links={links} />
    );
  }

  return (
    <FooterPC cityName={cityName} active_page={active_page} links={links} />
  );
})
