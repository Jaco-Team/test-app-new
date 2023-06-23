import BannersMobile from './banners/bannersMobile';
import BannersPC from './banners/bannersPC';
import CardItems from './cardItem/cardItems.js';
import ModalCardItemPC from './cardItem/modalCardItemPC.js';
import ModalBannerPC from './banners/modalBannersPC';

import Meta from '@/components/meta.js';

import { useHeaderStore } from '../../components/store';
import { shallow } from 'zustand/shallow';

export default function HomePage(props) {
  const { page, city } = props;

  const [matches] = useHeaderStore((state) => [state.matches], shallow);

  return (
    <Meta title={page.title} description={page.description}>
      {matches ? <BannersMobile /> : <BannersPC />}

      <CardItems />

      <ModalCardItemPC />

      <ModalBannerPC />
    </Meta>
  );
}
