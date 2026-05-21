import BannersMobile from './banners/bannersMobile';
import BannersPC from './banners/bannersPC';
import CardItems from './cardItem/cardItems.js';
import ModalCardItemPC from './cardItem/modalCardItemPC.js';
import ModalItemPC from './cardItem/modal_item_PC';
import ModalCardItemMobile from './cardItem/modalCardItemMobile';
import ModalItemMobile from './cardItem/modal_item_Mobile';
import ModalBannerPC from './banners/modalBannersPC';
import ModalBannerMobile from './banners/modalBannersMobile';
import MenuCatMobile from './menuCatMobile/menuCatMobile'
import Filter from './filter/filter';

import Meta from '@/components/meta.js';

import { useHomeMobileLayout } from '@/utils/useHomeMobileLayout';

export default function HomePage({ page, city } ) {

  const isHomeMobile = useHomeMobileLayout();

  return (
    <Meta title={page?.title ?? ''} description={page?.description ?? ''}>
      <div style={{ minHeight: isHomeMobile ? '50vh' : '70vh' }}>
        {isHomeMobile ?
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

        { isHomeMobile ?
          <>
            <ModalItemMobile />
            <ModalCardItemMobile /> 
          </>
          : 
          <>
            <ModalItemPC /> 
            <ModalCardItemPC /> 
          </>
        }

        <Filter />

        <CardItems />
      </div>

    </Meta>
  );
}
