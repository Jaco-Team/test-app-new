'use client';

import { Footer } from '@ui/widgets';
import { HomeHeaderConnected } from '@src/features/header/ui/HomeHeaderConnected';
import { AboutHeaderShell } from './AboutHeaderShell';
import type { AboutPageViewModel } from '../model/types';
import './AboutPage.scss';
import AboutUs from '@src/pages/about/ui/tabs/AboutUs';
import ExcellentDishes from '@src/pages/about/ui/tabs/ExcellentDishes';
import AffordablePrices from '@src/pages/about/ui/tabs/AffordablePrices';
import CafeLooks from '@src/pages/about/ui/tabs/CafeLooks';
import OrderTime from '@src/pages/about/ui/tabs/OrderTime';
import WeOptimism from '@src/pages/about/ui/tabs/WeOptimism';
import Responsibility from '@src/pages/about/ui/tabs/Responsibility';
import Feedback from '@src/pages/about/ui/tabs/Feedback';
import Cooperation from '@src/pages/about/ui/tabs/Cooperation';
import AboutBreadcrumbs from '@ui/components/AboutBreadcrumbs/AboutBreadcrumbs';

export type AboutPageProps = {
  model: AboutPageViewModel;
  useConnectedHeader?: boolean;
};

export function AboutPage({
  model,
  useConnectedHeader = false,
}: AboutPageProps) {
  return (
    <div className="about-page">
      {useConnectedHeader ? (
        <HomeHeaderConnected
          fallbackNav={model.headerNav}
          fallbackCityLabel={model.cityLabel}
          fallbackCitySlug={model.citySlug}
        />
      ) : (
        <AboutHeaderShell
          navItems={model.headerNav}
          cityLabel={model.cityLabel}
        />
      )}

      <main className="about-page__main">
        <div className="about-page__container">
          <div className="about-page__content">
            <AboutUs cityName={model.cityLabel} />
            <ExcellentDishes />
            <AffordablePrices />
            <CafeLooks />
            <OrderTime />
            <WeOptimism />
            <Responsibility />
            <Feedback />
            <Cooperation />
          </div>
          <AboutBreadcrumbs />
        </div>
      </main>

      <Footer
        citySlug={model.citySlug}
        cityLabel={model.cityLabel}
        linkGroups={model.footerLinks}
        socialLinks={model.footerSocialLinks}
      />
    </div>
  );
}
