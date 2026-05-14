import { BreadСrumbsPC } from '@stories/shared/ui/breadcrumbs/BreadСrumbsPC';
import type { BreadCrumbsPCProps } from '@stories/pages/about/model/types';
import type { ResponsiveViewport } from '@stories/shared/lib/storybook/responsive';
import { AboutIntro } from '@stories/widgets/about/ui/about-intro/AboutIntro';
import { AboutExcellentDishes } from '@stories/widgets/about/ui/about-excellent-dishes/AboutExcellentDishes';
import { AboutAffordablePrices } from '@stories/widgets/about/ui/about-affordable-prices/AboutAffordablePrices';
import { AboutCafeLooks } from '@stories/widgets/about/ui/about-cafe-looks/AboutCafeLooks';
import { AboutOrderTime } from '@stories/widgets/about/ui/about-order-time/AboutOrderTime';
import { AboutWeOptimism } from '@stories/widgets/about/ui/about-we-optimism/AboutWeOptimism';
import { AboutResponsibility } from '@stories/widgets/about/ui/about-responsibility/AboutResponsibility';
import { AboutFeedback } from '@stories/widgets/about/ui/about-feedback/AboutFeedback';
import { AboutCooperation } from '@stories/widgets/about/ui/about-cooperation/AboutCooperation';
import { AboutClosing } from '@stories/widgets/about/ui/about-closing/AboutClosing';

import './AboutPage.scss';

export interface AboutPageProps {
  header?: unknown;
  /** Аргументы для бокового оглавления (как в сторис хлебных крошек «О компании»). */
  data: BreadCrumbsPCProps;
  footer?: unknown;
  cityName?: string;
  viewport?: ResponsiveViewport;
}

export const AboutPage = ({
  header,
  data,
  footer,
  cityName = 'togliatti',
  viewport = 'desktop',
}: AboutPageProps) => {
  return (
    <>
      {header ? null : null}
      <div className={`about-page about-page--${viewport}`}>
        <div className="about-page__row">
          <main className="about-page__main">
            <AboutIntro cityName={cityName} viewport={viewport} />
            <AboutExcellentDishes />
            <AboutAffordablePrices />
            <AboutCafeLooks />
            <AboutOrderTime />
            <AboutWeOptimism />
            <AboutResponsibility />
            <AboutFeedback />
            <AboutCooperation />
            <AboutClosing />
          </main>
          <aside
            className="about-page__sidebar"
            aria-label="Оглавление раздела"
          >
            <BreadСrumbsPC {...data} />
          </aside>
        </div>
      </div>
      {footer ? null : null}
    </>
  );
};
