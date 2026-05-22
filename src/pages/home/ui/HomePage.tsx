import { BannerSlider, CategoryMenu, Footer } from '@ui/widgets';
import { HomeHeaderConnected } from '@src/features/header/ui/HomeHeaderConnected';
import { HomeHeaderShell } from './HomeHeaderShell';
import { TagFilter } from '@ui/patterns';
import { ProductCard } from '@ui/patterns/ProductCard/ProductCard';
import type { HomePageViewModel } from '../model/types';
import './HomePage.scss';

export type HomePageProps = {
  model: HomePageViewModel;
  useConnectedHeader?: boolean;
};

export function HomePage({ model, useConnectedHeader = false }: HomePageProps) {
  return (
    <div className="preview-home">
      {useConnectedHeader ? (
        <HomeHeaderConnected
          fallbackNav={model.headerNav}
          fallbackCityLabel={model.cityLabel}
          fallbackCitySlug={model.citySlug}
        />
      ) : (
        <HomeHeaderShell
          navItems={model.headerNav}
          cityLabel={model.cityLabel}
        />
      )}
      <main className="preview-home__main">
        <BannerSlider slides={model.banners} />

        <CategoryMenu
          primaryItems={model.categoryPrimary}
          secondaryItems={model.categorySecondary}
        />

        <TagFilter items={model.tags} />

        <section className="preview-home__grid" aria-label="Каталог">
          {model.products.map((product, index) => (
            <ProductCard
              key={`${product.title}-${product.price}-${index}`}
              {...product}
            />
          ))}
        </section>
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
