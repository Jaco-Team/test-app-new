import { BannerList } from '@stories/widgets/home/ui/banner-list/BannerList';
import { BoxItemHome } from '@stories/widgets/home/ui/product-grid/BoxItemHome';
import { CategoryMenu } from '@stories/entities/navigation/ui/category-menu/CategoryMenu';
import type { Banner } from '@stories/widgets/home/ui/banner-list/model/types';
import type { ProductItem } from '@stories/entities/product/ui/product-card/model/types';
import type { CategoryMenuItem } from '@stories/entities/navigation/ui/category-menu/CategoryMenu';

import './HomePage.scss';

interface HomePageProps {
  header?: unknown;
  banners?: {
    bannerList?: Banner[];
  };
  container?: {
    cardItem?: ProductItem[];
  };
  categories?: CategoryMenuItem[];
  footer?: unknown;
}

export const HomePage = ({
  header,
  banners,
  container,
  footer,
  categories = [],
}: HomePageProps) => {
  return (
    <div className="home-page">
      {header ? null : null}
      <div className="home-page__banner">
        <BannerList bannerList={banners?.bannerList ?? []} />
      </div>
      <div className="home-page__categories">
        <CategoryMenu items={categories} withPromo />
      </div>
      <BoxItemHome cards={container?.cardItem ?? []} />
      {footer ? null : null}
    </div>
  );
};
