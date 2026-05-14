import { BannerList } from '@stories/widgets/home/ui/banner-list/BannerList';
import { BoxItemHome } from '@stories/widgets/home/ui/product-grid/BoxItemHome';

import './HomePage.scss';

interface HomePageProps {
  header?: unknown;
  banners?: {
    bannerList?: unknown[];
  };
  container?: {
    cardItem?: unknown[];
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
        <BannerList {...banners} />
      </div>
      <BoxItemHome cards={container?.cardItem} />
      {footer ? null : null}
    </div>
  );
};
