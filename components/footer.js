import {memo, useEffect} from 'react';
import FooterPC from '@/modules/footer/footerPC';
import FooterMobile from '@/modules/footer/footerMobile';
import {useHeaderStoreNew, useFooterStore} from './store';

export default memo(function Footer({ cityName, active_page, links }) {
  const [matches] = useHeaderStoreNew((state) => [state?.matches]);
  const [storeLinks, getData, setLinks] = useFooterStore((state) => [state.links, state.getData, state.setLinks]);
  const hasStoreLinks = Boolean(storeLinks && Object.keys(storeLinks).length > 0);
  const hasPropLinks = Boolean(links && Object.keys(links).length > 0);

  useEffect(() => {
    if (hasPropLinks) {
      setLinks(links, cityName);
      return;
    }

    if (!hasStoreLinks && cityName) {
      getData('contacts', cityName);
    }

  }, [cityName, getData, hasPropLinks, hasStoreLinks, links, setLinks]);

  const resolvedLinks = hasPropLinks ? links : storeLinks;

  if( matches ){
    return (
      <FooterMobile cityName={cityName} active_page={active_page} links={resolvedLinks} />
    );
  }

  return (
    <FooterPC cityName={cityName} active_page={active_page} links={resolvedLinks} />
  );
})
