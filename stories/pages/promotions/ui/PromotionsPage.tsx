import { PromotionDetail } from '@stories/widgets/promotions/ui/promotion-detail/PromotionDetail';
import type { ResponsiveViewport } from '@stories/shared/lib/storybook/responsive';

import './PromotionsPage.scss';

interface PromotionsPageProps {
  header?: unknown;
  actia: Record<string, any>;
  footer?: unknown;
  viewport?: ResponsiveViewport;
}

export const PromotionsPage = ({
  header,
  actia,
  footer,
  viewport = 'desktop',
}: PromotionsPageProps) => {
  const bannerList = Array.from({ length: 4 }, () => actia);
  const productionClassName = viewport === 'mobile' ? 'akciiMobile' : 'akciiPC';

  return (
    <>
      {header ? null : null}
      <div
        className={`${productionClassName} akciiPage akciiPage--${viewport}`}
      >
        <span className="login">Выгодные предложения</span>
        {bannerList?.map((item, key) => (
          <PromotionDetail key={key} {...item} viewport={viewport} />
        ))}
      </div>
      {footer ? null : null}
    </>
  );
};
