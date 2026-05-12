// @ts-nocheck
import { BannerFullPC } from '../../../widgets/promotions/ui/promotion-detail/BannerFullPC';

import './AkciiPagePC.scss';

export const AkciiPagePC = ({ header, actia, footer }) => {
  const bannerList = Array.from(Array(4).keys()).fill(actia);

  return (
    <>
      {header ? null : null}
      <div className="akciiPC">
        <span className="login">Выгодные предложения</span>
        {bannerList?.map((item, key) => (
          <BannerFullPC key={key} {...item} />
        ))}
      </div>
      {footer ? null : null}
    </>
  );
};

