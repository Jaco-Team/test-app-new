import BannersMobile from './banners/bannersMobile';
import BannersPC from './banners/bannersPC';
import CardItems from './cardItem/cardItems.js';
import ModalCardItemPC from './cardItem/modalCardItemPC.js';
import ModalCardItemMobile from './cardItem/modalCardItemMobile';
import ModalBannerPC from './banners/modalBannersPC';
import ModalBannerMobile from './banners/modalBannersMobile';
import MenuCatMobile from './menuCatMobile/menuCatMobile'
import Filter from './filter/filter';

import Meta from '@/components/meta.js';

import { useHeaderStore } from '@/components/store';

export default function HomePage({ page, city } ) {

  const [matches] = useHeaderStore((state) => [state.matches]);

  return (
    <Meta title={page.title} description={page.description}>
      <div style={{ minHeight: matches ? '50vh' : '70vh' }}>
        {matches ?
          <>
            <BannersMobile />
            <MenuCatMobile city={city}/>
            <ModalBannerMobile />
          </>
        : 
          <>
            <BannersPC />
            <ModalBannerPC />
          </>
        }

        { matches ? <ModalCardItemMobile /> : <ModalCardItemPC /> }

        <Filter />

        <CardItems />
      </div>

    </Meta>
  );
}
