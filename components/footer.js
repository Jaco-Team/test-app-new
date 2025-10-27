import {memo, useEffect} from 'react';
import FooterPC from '@/modules/footer/footerPC';
import FooterMobile from '@/modules/footer/footerMobile';
import {useHeaderStoreNew, useFooterStore} from './store';

export default memo(function Footer({ cityName, active_page, links }) {
  const [matches] = useHeaderStoreNew((state) => [state?.matches]);
  const [storeLinks, getData] = useFooterStore((state) => [state.links, state.getData]);

  useEffect(() => {
    if (JSON.stringify(storeLinks) === JSON.stringify({})) {
      getData('contacts', cityName);
    }
    
  }, [cityName, getData, storeLinks]);

  if( matches ){
    return (
      <FooterMobile cityName={cityName} active_page={active_page} links={links} />
    );
  }

  return (
    <FooterPC cityName={cityName} active_page={active_page} links={links} />
  );
})
