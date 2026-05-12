// @ts-nocheck
import { BannerListPC } from '../../../widgets/home/ui/banner-list/BannerListPC';
import { BoxItemHomePC } from '../../../widgets/home/ui/product-grid/BoxItemHomePC';

import './HomePage.scss';

export const HomePage = ({ header, banners, container, footer }) => {
  return (
    <div className="homePC">
      {header ? null : null}
      <div className="containerBanner">
        <BannerListPC {...banners} />
      </div>
      <BoxItemHomePC {...container} />
      {footer ? null : null}
    </div>
  );
};

