'use client';

import { useMemo, useState } from 'react';
import { useCartStore } from '@src/entities/cart';
import { BannerSlider, CategoryMenu, Footer } from '@ui/widgets';
import { HomeHeaderConnected } from '@src/features/header/ui/HomeHeaderConnected';
import { HomeHeaderShell } from './HomeHeaderShell';
import { TagFilter } from '@ui/patterns';
import { ProductCard } from '@ui/patterns/ProductCard/ProductCard';
import type {
  HomeBannerSlide,
  HomePageViewModel,
  HomeProduct,
} from '../model/types';
import { BannerDetailsModal } from './modals/BannerDetailsModal';
import { ProductDetailsModal } from './modals/ProductDetailsModal';
import './HomePage.scss';

export type HomePageProps = {
  model: HomePageViewModel;
  useConnectedHeader?: boolean;
};

export function HomePage({ model, useConnectedHeader = false }: HomePageProps) {
  const [activeProduct, setActiveProduct] = useState<HomeProduct | null>(null);
  const [activeBanner, setActiveBanner] = useState<HomeBannerSlide | null>(
    null
  );
  const items = useCartStore((state) => state.items);
  const plus = useCartStore((state) => state.plus);
  const setCount = useCartStore((state) => state.setCount);

  const countByProductId = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item) => {
      if (item.item_id !== undefined && item.item_id !== null) {
        map.set(String(item.item_id), Number(item.count ?? 0));
      }
    });
    return map;
  }, [items]);

  const getCount = (product: HomeProduct) =>
    countByProductId.get(product.id) ?? 0;
  const addProduct = (product: HomeProduct) => plus(product.id, product.catId);
  const changeProductCount = (product: HomeProduct, value: number) => {
    setCount(product.id, value, product.catId);
  };

  return (
    <div className="home-page">
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
      <main className="home-page__main">
        <BannerSlider
          slides={model.banners}
          onSlideClick={(slide) => setActiveBanner(slide as HomeBannerSlide)}
        />

        <CategoryMenu
          primaryItems={model.categoryPrimary}
          secondaryItems={model.categorySecondary}
        />

        <TagFilter items={model.tags} />

        <section className="home-page__grid" aria-label="Каталог">
          {model.products.map((product, index) => (
            <ProductCard
              key={`${product.title}-${product.price}-${index}`}
              {...product}
              count={getCount(product)}
              onAdd={() => addProduct(product)}
              onQuantityChange={(value) => changeProductCount(product, value)}
              onDetailsClick={() => setActiveProduct(product)}
            />
          ))}
        </section>
      </main>

      <ProductDetailsModal
        product={activeProduct}
        count={activeProduct ? getCount(activeProduct) : 0}
        onClose={() => setActiveProduct(null)}
        onAdd={() => activeProduct && addProduct(activeProduct)}
        onQuantityChange={(value) =>
          activeProduct && changeProductCount(activeProduct, value)
        }
      />

      <BannerDetailsModal
        banner={activeBanner}
        getCount={getCount}
        onClose={() => setActiveBanner(null)}
        onAdd={addProduct}
        onQuantityChange={changeProductCount}
        onProductOpen={(product) => setActiveProduct(product)}
      />

      <Footer
        citySlug={model.citySlug}
        cityLabel={model.cityLabel}
        linkGroups={model.footerLinks}
        socialLinks={model.footerSocialLinks}
      />
    </div>
  );
}
