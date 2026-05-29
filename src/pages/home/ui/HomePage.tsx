'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCartStore } from '@src/entities/cart';
import { api } from '@src/shared/api';
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
  HomeTagFilterItem,
} from '../model/types';
import { BannerDetailsModal } from './modals/BannerDetailsModal';
import { ProductDetailsModal } from './modals/ProductDetailsModal';
import {
  mapHomeCatalogView,
  mapProduct,
  mapTags,
} from '../model/mapHomePageViewModel';
import { scrollToCategorySection } from '@src/shared/lib/scroll/scrollToCategorySection';
import './HomePage.scss';

function getProductLink(product: HomeProduct): string {
  return String(product.link ?? product.raw?.link ?? '').trim();
}

function writeProductQuery(product: HomeProduct): void {
  if (typeof window === 'undefined') {
    return;
  }

  const link = getProductLink(product);
  if (!link) {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set('item', link);
  window.history.pushState(
    { item_id: product.id, item_name: product.title },
    product.title,
    url
  );
}

function clearProductQuery(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  if (!url.searchParams.has('item')) {
    return;
  }

  url.searchParams.delete('item');
  window.history.pushState({}, '', url);
}

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
  const [activeTag, setActiveTag] = useState<HomeTagFilterItem | null>(null);
  const items = useCartStore((state) => state.items);
  const plus = useCartStore((state) => state.plus);
  const setCount = useCartStore((state) => state.setCount);
  const storeCategories = useHomeStore((state) => state.categories);
  const storeCatalogItems = useHomeStore((state) => state.catalogItems);
  const storeTags = useHomeStore((state) => state.allTags);
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
  const tags = storeTags.length ? mapTags(storeTags) : model.tags;
  const products = liveCatalog?.products ?? model.products;
  const tagItems = useMemo<HomeTagFilterItem[]>(() => {
    const hasNewTag = tags.some(
      (tag) => tag.tone === 'new' || tag.label.toLowerCase() === 'новинка'
    );
    const hasNewBadge = products.some((product) =>
      product.badges?.some((badge) => badge.tone === 'new')
    );
    const baseTags =
      hasNewBadge && !hasNewTag
        ? [{ label: 'НОВИНКА', tone: 'new' as const, id: 'new' }, ...tags]
        : tags;

    return baseTags.map((tag) => ({
      ...tag,
      active: activeTag
        ? (activeTag.tone === 'new' && tag.tone === 'new') ||
          (activeTag.id !== undefined && tag.id === activeTag.id) ||
          activeTag.label === tag.label
        : false,
    }));
  }, [activeTag, products, tags]);
  const productGroupsSource = liveCatalog?.productGroups ?? model.productGroups;

  const productMatchesActiveTag = useCallback(
    (product: HomeProduct) => {
      if (!activeTag) {
        return true;
      }

      if (activeTag.tone === 'new') {
        return (
          product.badges?.some((badge) => badge.tone === 'new') ||
          Number(product.raw?.is_new) === 1
        );
      }

      if (activeTag.id !== undefined) {
        return product.tagIds?.includes(String(activeTag.id)) ?? false;
      }

      return product.tagIds?.includes(activeTag.label) ?? false;
    },
    [activeTag]
  );

  const handleTagChange = useCallback(
    (tag: HomeTagFilterItem, index: number) => {
      setActiveTag(index < 0 ? null : tag);
    },
    []
  );

  const clearTagFilter = useCallback(() => {
    setActiveTag(null);
  }, []);

  const openProduct = useCallback(
    async (product: HomeProduct, options?: { writeQuery?: boolean }) => {
      setActiveProduct(product);
      if (options?.writeQuery !== false) {
        writeProductQuery(product);
      }

      const response = await api('home', {
        type: 'get_item',
        city_id: model.citySlug,
        item_id: product.id,
      });
      const detailedProduct = mapProduct(response);
      if (
        detailedProduct &&
        String(detailedProduct.id) === String(product.id)
      ) {
        setActiveProduct((current) =>
          current && String(current.id) === String(product.id)
            ? { ...product, ...detailedProduct }
            : current
        );
      }
    },
    [model.citySlug]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || activeProduct || !products.length) {
      return;
    }

    const itemLink = new URLSearchParams(window.location.search).get('item');
    if (!itemLink) {
      return;
    }

    const foundProduct = products.find(
      (product) => getProductLink(product) === itemLink
    );
    if (foundProduct) {
      void openProduct(foundProduct, { writeQuery: false });
    }
  }, [activeProduct, openProduct, products]);

  const pingHomeCatalog = useCallback(() => {
    if (model.citySlug) {
      void getItemsCat('home', model.citySlug, { force: true });
    }
  }, [getItemsCat, model.citySlug]);

  const getCount = (product: HomeProduct) =>
    countByProductId.get(product.id) ?? 0;
  const addProduct = (product: HomeProduct) => {
    plus(product.id, product.catId);
    pingHomeCatalog();
  };
  const changeProductCount = (product: HomeProduct, value: number) => {
    setCount(product.id, value, product.catId);
    pingHomeCatalog();
  };
  const productGroupsBase = productGroupsSource.length
    ? productGroupsSource
    : [{ id: 'cat-all', label: 'Каталог', products }];
  const productGroups = productGroupsBase
    .map((group) => ({
      ...group,
      products: group.products.filter(productMatchesActiveTag),
    }))
    .filter((group) => group.products.length > 0);
  const scrollToCategory = useCallback((targetId?: string) => {
    setActiveCategoryTarget(targetId);
    if (!targetId) {
      return;
    }

    scrollToCategorySection(targetId);
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
          tags={tagItems}
          onActiveTargetChange={setActiveCategoryTarget}
          onItemSelect={(item) => scrollToCategory(item.targetId)}
          onTagChange={handleTagChange}
          onTagClear={clearTagFilter}
        />

        <TagFilter
          items={tagItems}
          className="home-page__tags"
          onChange={handleTagChange}
          onClear={clearTagFilter}
        />

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
                    onDetailsClick={() => void openProduct(product)}
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
        onClose={() => {
          setActiveProduct(null);
          clearProductQuery();
        }}
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
        onProductOpen={(product) => void openProduct(product)}
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
