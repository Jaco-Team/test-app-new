import { useEffect, memo} from 'react';

import FooterPC from '@/modules/footer/footerPC';
import FooterMobile from '@/modules/footer/footerMobile';

import { useHeaderStore, useFooterStore } from './store';
import { shallow } from 'zustand/shallow';

const this_module = 'contacts';

export default memo(function Footer({ cityName }) {
  const [matches] = useHeaderStore((state) => [state.matches], shallow);
  const [links, getData] = useFooterStore((state) => [state.links, state.getData]);

  useEffect(() => {
    if (JSON.stringify(links) === JSON.stringify({})) {
      getData(this_module, cityName);
    }
    
  }, [cityName, getData, links]);

  return <>{matches ? <FooterMobile cityName={cityName} /> : <FooterPC cityName={cityName} />}</>;
})
