import { useEffect, memo} from 'react';

import FooterPC from '@/modules/footer/footerPC';
import FooterMobile from '@/modules/footer/footerMobile';

import { useHeaderStore, useFooterStore } from './store';

const this_module = 'contacts';

export default memo(function Footer({ cityName, active_page }) {
  const [matches] = useHeaderStore((state) => [state?.matches]);
  const [links, getData] = useFooterStore((state) => [state.links, state.getData]);

  useEffect(() => {
    if (JSON.stringify(links) === JSON.stringify({})) {
      getData(this_module, cityName);
    }
    
  }, [cityName, getData, links]);

  if( matches ){
    return (
      <FooterMobile cityName={cityName} active_page={active_page} />
    );
  }

  return (
    <FooterPC cityName={cityName} active_page={active_page} />
  );
})
