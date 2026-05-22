import { BannerSlider, CategoryMenu, Footer } from '@ui/widgets';
import { HomeHeaderShell } from './HomeHeaderShell';
import { TagFilter } from '@ui/patterns';
import { ProductCard } from '@ui/patterns/ProductCard/ProductCard';
import type { HomePageViewModel } from '../model/types';
import './HomePage.scss';

export type HomePageProps = {
  model: HomePageViewModel;
};

export function HomePage({ model }: HomePageProps) {
  return (
    <div className="preview-home">
      <HomeHeaderShell navItems={model.headerNav} cityLabel={model.cityLabel} />
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
