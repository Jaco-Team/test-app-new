'use client';

import { useCallback, useMemo, useState } from 'react';
import { useHomeStore } from '@src/entities/home';
import { mapHomeCatalogView, mapTags } from '../model/mapHomePageViewModel';
import type {
  HomePageViewModel,
  HomeProduct,
  HomeProductGroup,
  HomeTagFilterItem,
} from '../model/types';
import { scrollToCategorySection } from '@src/shared/lib/scroll/scrollToCategorySection';
import type { CategoryMenuItem } from '@ui/widgets/CategoryMenu/CategoryMenu';

export type UseHomeCatalogResult = {
  catalogLoaded: boolean;
  categoryPrimary: CategoryMenuItem[];
  categorySecondary: CategoryMenuItem[];
  tagItems: HomeTagFilterItem[];
  productGroups: HomeProductGroup[];
  products: HomeProduct[];
  activeCategoryTarget: string | undefined;
  setActiveCategoryTarget: (targetId: string | undefined) => void;
  scrollToCategory: (targetId?: string) => void;
  handleTagChange: (tag: HomeTagFilterItem, index: number) => void;
  clearTagFilter: () => void;
};

function isCatalogLoadedForCity(
  city: string,
  itemsCatCity: string,
  itemsCatSource: string,
  catalogItems: unknown[]
): boolean {
  if (!city || itemsCatCity !== city || !catalogItems.length) {
    return false;
  }

  return itemsCatSource === 'api' || itemsCatSource === 'cache';
}

export function useHomeCatalog(model: HomePageViewModel): UseHomeCatalogResult {
  const [activeCategoryTarget, setActiveCategoryTarget] = useState<
    string | undefined
  >();
  const [activeTag, setActiveTag] = useState<HomeTagFilterItem | null>(null);

  const storeCategories = useHomeStore((state) => state.categories);
  const storeCatalogItems = useHomeStore((state) => state.catalogItems);
  const storeTags = useHomeStore((state) => state.allTags);
  const catalogLoaded = useHomeStore((state) =>
    isCatalogLoadedForCity(
      model.citySlug,
      state.itemsCatCity,
      state.itemsCatSource,
      state.catalogItems
    )
  );

  const liveCatalog = useMemo(() => {
    if (!catalogLoaded) {
      return null;
    }

    return mapHomeCatalogView(storeCategories, storeCatalogItems);
  }, [catalogLoaded, storeCatalogItems, storeCategories]);

  const categoryPrimary = liveCatalog?.categoryPrimary ?? model.categoryPrimary;
  const categorySecondary =
    liveCatalog?.categorySecondary ?? model.categorySecondary;
  const tags = storeTags.length ? mapTags(storeTags) : model.tags;
  const products = liveCatalog?.products ?? [];
  const productGroupsSource = liveCatalog?.productGroups ?? [];

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

  const productGroups = useMemo(() => {
    if (!catalogLoaded) {
      return [];
    }

    return productGroupsSource
      .map((group) => ({
        ...group,
        products: group.products.filter(productMatchesActiveTag),
      }))
      .filter((group) => group.products.length > 0);
  }, [catalogLoaded, productGroupsSource, productMatchesActiveTag]);

  const handleTagChange = useCallback(
    (_tag: HomeTagFilterItem, index: number) => {
      setActiveTag(index < 0 ? null : _tag);
    },
    []
  );

  const clearTagFilter = useCallback(() => {
    setActiveTag(null);
  }, []);

  const scrollToCategory = useCallback((targetId?: string) => {
    setActiveCategoryTarget(targetId);
    if (targetId) {
      scrollToCategorySection(targetId);
    }
  }, []);

  return {
    catalogLoaded,
    categoryPrimary,
    categorySecondary,
    tagItems,
    productGroups,
    products,
    activeCategoryTarget,
    setActiveCategoryTarget,
    scrollToCategory,
    handleTagChange,
    clearTagFilter,
  };
}
