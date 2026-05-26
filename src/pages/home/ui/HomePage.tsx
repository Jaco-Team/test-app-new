'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCartStore } from '@src/entities/cart';
import { useHomeStore } from '@src/entities/home';
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
import { mapHomeCatalogView } from '../model/mapHomePageViewModel';
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
  const [activeCategoryTarget, setActiveCategoryTarget] = useState<
    string | undefined
  >();
  const items = useCartStore((state) => state.items);
  const plus = useCartStore((state) => state.plus);
  const setCount = useCartStore((state) => state.setCount);
  const storeCategories = useHomeStore((state) => state.categories);
  const storeCatalogItems = useHomeStore((state) => state.catalogItems);
  const getItemsCat = useHomeStore((state) => state.getItemsCat);

  const countByProductId = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item) => {
      if (item.item_id !== undefined && item.item_id !== null) {
        map.set(String(item.item_id), Number(item.count ?? 0));
      }
    });
    return map;
  }, [items]);

  useEffect(() => {
    if (model.citySlug) {
      void getItemsCat('home', model.citySlug);
    }
  }, [getItemsCat, model.citySlug]);

  const liveCatalog = useMemo(() => {
    if (!storeCatalogItems.length) {
      return null;
    }

    return mapHomeCatalogView(storeCategories, storeCatalogItems);
  }, [storeCatalogItems, storeCategories]);
  const categoryPrimary = liveCatalog?.categoryPrimary ?? model.categoryPrimary;
  const categorySecondary =
    liveCatalog?.categorySecondary ?? model.categorySecondary;
  const products = liveCatalog?.products ?? model.products;
  const productGroupsSource = liveCatalog?.productGroups ?? model.productGroups;

  const getCount = (product: HomeProduct) =>
    countByProductId.get(product.id) ?? 0;
  const addProduct = (product: HomeProduct) => plus(product.id, product.catId);
  const changeProductCount = (product: HomeProduct, value: number) => {
    setCount(product.id, value, product.catId);
  };
  const productGroups = productGroupsSource.length
    ? productGroupsSource
    : [{ id: 'cat-all', label: 'Каталог', products }];
  const scrollToCategory = useCallback((targetId?: string) => {
    setActiveCategoryTarget(targetId);
    if (!targetId) {
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    const headerOffset =
      document.getElementById('headerNew')?.getBoundingClientRect().height ?? 0;
    const categoryOffset =
      document.querySelector('.ui-category-menu')?.getBoundingClientRect()
        .height ?? 0;
    const top =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerOffset -
      categoryOffset -
      8;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

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
          primaryItems={categoryPrimary}
          secondaryItems={categorySecondary}
          activeTargetId={
            activeCategoryTarget ??
            categorySecondary[0]?.targetId ??
            categoryPrimary[0]?.targetId
          }
          onItemSelect={(item) => scrollToCategory(item.targetId)}
        />

        <TagFilter items={model.tags} />

        <section className="home-page__catalog" aria-label="Каталог">
          {productGroups.map((group) => (
            <section
              key={group.id}
              id={group.id}
              className="home-page__category-section"
              aria-label={group.label}
            >
              {/* <h2 className="home-page__category-title">{group.label}</h2> */}
              <div className="home-page__grid">
                {group.products.map((product, index) => (
                  <ProductCard
                    key={`${product.id}-${index}`}
                    {...product}
                    count={getCount(product)}
                    onAdd={() => addProduct(product)}
                    onQuantityChange={(value) =>
                      changeProductCount(product, value)
                    }
                    onDetailsClick={() => setActiveProduct(product)}
                  />
                ))}
              </div>
            </section>
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
