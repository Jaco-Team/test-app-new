import {memo, useEffect} from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import FooterPC from '@/modules/footer/footerPC';
import FooterMobile from '@/modules/footer/footerMobile';
import {useFooterStore} from './store';
import { BREAKPOINTS } from '@/utils/breakpoints';

export default memo(function Footer({ cityName, active_page, links }) {
  const isFooterMobile = useMediaQuery(`screen and (max-width: ${BREAKPOINTS.mobileMax}px)`);
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

  // Планшет (668-990) использует FooterPC с tablet-only стилями.
  // FooterMobile оставляем только для мобильного диапазона.
  if (isFooterMobile) {
    return (
      <FooterMobile cityName={cityName} active_page={active_page} links={resolvedLinks} />
    );
  }

  return (
    <FooterPC cityName={cityName} active_page={active_page} links={resolvedLinks} />
  );
})
