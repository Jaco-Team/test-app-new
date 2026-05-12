// @ts-nocheck
import { BannerList } from '@stories/widgets/home/ui/banner-list/BannerList';
import { BoxItemHome } from '@stories/widgets/home/ui/product-grid/BoxItemHome';

import './HomePage.scss';

export const HomePage = ({
  header,
  banners,
  container,
  footer,
}: Record<string, any>) => {
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
