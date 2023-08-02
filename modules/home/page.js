import BannersMobile from './banners/bannersMobile';
import BannersPC from './banners/bannersPC';
import CardItems from './cardItem/cardItems.js';
import ModalCardItemPC from './cardItem/modalCardItemPC.js';
import ModalCardItemMobile from './cardItem/modalCardItemMobile';
import ModalBannerPC from './banners/modalBannersPC';
import MenuCatMobile from './menuCatMobile/menuCatMobile'

import Meta from '@/components/meta.js';

import { useHeaderStore } from '../../components/store';

export default function HomePage(props) {
  const { page, city } = props;

  const [matches] = useHeaderStore((state) => [state.matches]);

  return (
    <Meta title={page.title} description={page.description}>
      {matches ?
      <>
      <BannersMobile />
      <MenuCatMobile city={city} />
      <ModalCardItemMobile />
      </>
      : 
      <>
      <BannersPC />
      <ModalCardItemPC />
      <ModalBannerPC />
      </>
      }

      <CardItems />

    </Meta>
  );
}
