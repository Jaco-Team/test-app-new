import { BannerList } from '@stories/widgets/home/ui/banner-list/BannerList';
import { BoxItemHome } from '@stories/widgets/home/ui/product-grid/BoxItemHome';
import type { Banner } from '@stories/widgets/home/ui/banner-list/model/types';
import type { ProductItem } from '@stories/entities/product/ui/product-card/model/types';

import './HomePage.scss';

interface HomePageProps {
  header?: unknown;
  banners?: {
    bannerList?: Banner[];
  };
  container?: {
    cardItem?: ProductItem[];
  };
  footer?: unknown;
}

export const HomePage = ({
  header,
  banners,
  container,
  footer,
}: HomePageProps) => {
  return (
    <div className="homePC">
      {header ? null : null}
      <div className="containerBanner">
        <BannerList bannerList={banners?.bannerList ?? []} />
      </div>
      <BoxItemHome cards={container?.cardItem ?? []} />
      {footer ? null : null}
    </div>
  );
};
