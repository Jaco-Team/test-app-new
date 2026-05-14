import { PromotionDetail } from '@stories/widgets/promotions/ui/promotion-detail/PromotionDetail';
import type { PromotionDetailProps } from '@stories/widgets/promotions/ui/promotion-detail/PromotionDetail';
import type { ResponsiveViewport } from '@stories/shared/lib/storybook/responsive';

import './PromotionsPage.scss';

interface PromotionsPageProps {
  header?: unknown;
  actia: PromotionDetailProps;
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

  return (
    <>
      {header ? null : null}
      <div className={`promotions-page promotions-page--${viewport}`}>
        <h1 className="promotions-page__title">Выгодные предложения</h1>
        <div className="promotions-page__list">
          {bannerList?.map((item, key) => (
            <PromotionDetail key={key} {...item} viewport={viewport} />
          ))}
        </div>
      </div>
      {footer ? null : null}
    </>
  );
};
