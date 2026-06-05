'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@src/entities/cart';
import { api } from '@src/shared/api';
import { useHomeStore } from '@src/entities/home';
import {
  findCategoryTargetIdByLink,
  findHeaderCategoryTargetIdByLink,
} from '@src/shared/lib/categoryLink';
import {
  getLocalStorageItem,
  removeLocalStorageItem,
} from '@/utils/browserStorage';
import { BannerSlider, CategoryMenu } from '@ui/widgets';
import { TagFilter } from '@ui/patterns';
import { ProductCard } from '@ui/patterns/ProductCard/ProductCard';
import { HomeCatalogSkeleton } from './HomeCatalogSkeleton';
import type {
  HomeBannerSlide,
  HomePageViewModel,
  HomeProduct,
} from '../model/types';
import { mapBanners, mapProduct } from '../model/mapHomePageViewModel';
import { useHomeCatalog } from '../hooks/useHomeCatalog';
import { BannerDetailsModal } from './modals/BannerDetailsModal';
import { ProductDetailsModal } from './modals/ProductDetailsModal';
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
};

export function HomePage({ model }: HomePageProps) {
  const [activeProduct, setActiveProduct] = useState<HomeProduct | null>(null);
  const [activeBannerId, setActiveBannerId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const categoryQuery = searchParams?.get('category') ?? '';

  const items = useCartStore((state) => state.items);
  const plus = useCartStore((state) => state.plus);
  const setCount = useCartStore((state) => state.setCount);
  const bannerList = useHomeStore((state) => state.bannerList);
  const categories = useHomeStore((state) => state.categories);
  const getItemsCat = useHomeStore((state) => state.getItemsCat);

  const catalog = useHomeCatalog(model);
  const {
    catalogLoaded,
    productGroups,
    categoryPrimary,
    categorySecondary,
    tagItems,
    activeCategoryTarget,
    setActiveCategoryTarget,
    scrollToCategory,
    handleTagChange,
    clearTagFilter,
    products: catalogProducts,
  } = catalog;
  const liveBanners = useMemo(() => {
    if (!bannerList.length) {
      return model.banners;
    }

    return mapBanners(bannerList, catalogProducts);
  }, [bannerList, catalogProducts, model.banners]);
  const activeBanner = useMemo<HomeBannerSlide | null>(() => {
    if (!activeBannerId) {
      return null;
    }

    return (
      liveBanners.find((banner) => banner.id === activeBannerId) ??
      model.banners.find((banner) => banner.id === activeBannerId) ??
      null
    );
  }, [activeBannerId, liveBanners, model.banners]);

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

  useEffect(() => {
    if (model.citySlug) {
      void getItemsCat('home', model.citySlug);
    }
  }, [getItemsCat, model.citySlug]);

  const addProduct = (product: HomeProduct) => {
    plus(product.id, product.catId);
  };

  const changeProductCount = (product: HomeProduct, value: number) => {
    setCount(product.id, value, product.catId);
  };

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
    if (
      typeof window === 'undefined' ||
      activeProduct ||
      !catalogProducts.length
    ) {
      return;
    }

    const itemLink = new URLSearchParams(window.location.search).get('item');
    if (!itemLink) {
      return;
    }

    const foundProduct = catalogProducts.find(
      (product) => getProductLink(product) === itemLink
    );
    if (foundProduct) {
      void openProduct(foundProduct, { writeQuery: false });
    }
  }, [activeProduct, catalogProducts, openProduct]);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !catalogLoaded ||
      productGroups.length === 0
    ) {
      return;
    }

    const queryCategoryLink = categoryQuery;
    const pendingCategoryLink = getLocalStorageItem('goToCategoryLink');
    const effectiveCategoryLink =
      queryCategoryLink.length > 0 ? queryCategoryLink : pendingCategoryLink;

    if (!effectiveCategoryLink) {
      return;
    }

    const targetId =
      findCategoryTargetIdByLink(categories, effectiveCategoryLink) ??
      findHeaderCategoryTargetIdByLink(model.headerNav, effectiveCategoryLink);

    const cleanupCategoryState = () => {
      if (queryCategoryLink.length > 0) {
        const url = new URL(window.location.href);
        url.searchParams.delete('category');
        window.history.replaceState(window.history.state, '', url);
      }

      removeLocalStorageItem('goToCategoryLink');
      removeLocalStorageItem('ignoreMenuCategoryOnce');
    };

    if (!targetId) {
      cleanupCategoryState();
      return;
    }

    let attemptsLeft = 12;

    const tryScrollToCategory = () => {
      const targetNode = document.getElementById(targetId);

      if (!targetNode && attemptsLeft > 0) {
        attemptsLeft -= 1;
        window.setTimeout(tryScrollToCategory, 120);
        return;
      }

      if (!targetNode) {
        cleanupCategoryState();
        return;
      }

      setActiveCategoryTarget(targetId);
      window.setTimeout(() => {
        scrollToCategory(targetId);
        cleanupCategoryState();
      }, 150);
    };

    tryScrollToCategory();
  }, [
    categories,
    catalogLoaded,
    model.headerNav,
    productGroups.length,
    categoryQuery,
    scrollToCategory,
    setActiveCategoryTarget,
  ]);

  return (
    <div className="home-page">
      <main className="home-page__main">
        <BannerSlider
          slides={liveBanners}
          onSlideClick={(slide) =>
            setActiveBannerId((slide as HomeBannerSlide).id)
          }
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
          {!catalogLoaded ? (
            <HomeCatalogSkeleton />
          ) : (
            productGroups.map((group) => (
              <section
                key={group.id}
                id={group.id}
                className="home-page__category-section"
                aria-label={group.label}
              >
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
            ))
          )}
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
        citySlug={model.citySlug}
        getCount={getCount}
        onClose={() => setActiveBannerId(null)}
        onAdd={addProduct}
        onQuantityChange={changeProductCount}
        onProductOpen={(product) => void openProduct(product)}
      />
    </div>
  );
}
