import { BannerFullPC } from '@stories/widgets/promotions/ui/promotion-detail/BannerFullPC';

import './AkciiPagePC.scss';

export const AkciiPagePC = ({ header, actia, footer }: Record<string, any>) => {
  const bannerList = Array.from({ length: 4 }, () => actia);

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

