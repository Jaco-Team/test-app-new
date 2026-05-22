'use client';

import { useEffect } from 'react';
import { useCatalogStore } from '@src/entities/catalog';
import { useCartStore } from '@src/entities/cart';
import { useCityStore } from '@src/entities/city';
import type { CityRecord } from '@src/entities/city';
import { useFooterStore } from '@src/entities/footer';
import { useHeaderStore } from '@src/entities/header';
import { useHomeStore } from '@src/entities/home';
import { useProfileStore } from '@src/entities/profile';
import { hitAll } from '@src/shared/lib/analytics/metrika';

export type PreviewBootstrapProps = {
  city: string;
  cities: unknown[];
  cats: unknown[];
  allItems: unknown[];
  tags: unknown[];
  links: Record<string, unknown>;
  freeItems?: unknown[];
  needDop?: unknown[];
};

function resolveCityLabel(city: string, cities: unknown[]): string {
  const found = (cities as CityRecord[]).find(
    (item) => String(item?.link ?? '') === city
  );
  return found?.name ? String(found.name) : city;
}

/**
 * Client bootstrap for preview home — mirrors legacy `pages/[city]/index.jsx` effects.
 */
export function PreviewBootstrap({
  city,
  cities,
  cats,
  allItems,
  tags,
  links,
  freeItems = [],
  needDop = [],
}: PreviewBootstrapProps) {
  useEffect(() => {
    const label = resolveCityLabel(city, cities);

    useCityStore.getState().setCity(city, label, cities as CityRecord[]);
    useCatalogStore.getState().seedFromPage(cats, allItems, city, tags);
    useHomeStore.getState().seedFromPage(cats, allItems, city);
    useHomeStore.getState().setAllTags(tags);
    useFooterStore.getState().setLinks(links, city);

    useCartStore.getState().setAllItems(allItems);
    useCartStore.getState().setFreeItems(freeItems);
    useCartStore.getState().setNeedDops(needDop);
    useCartStore.getState().hydrateFromLocalStorage();

    const priceTimer = window.setTimeout(() => {
      useCartStore.getState().changeAllItems();
    }, 300);

    useHeaderStore.getState().setActivePage('home');

    void (async () => {
      await useHeaderStore.getState().hydrateSession(city);
      const token = useHeaderStore.getState().token;

      await Promise.all([
        useHomeStore.getState().getBanners('home', city),
        useHomeStore.getState().getItemsCat('home', city),
        useProfileStore.getState().getCountPromosOrders(city, token),
      ]);
    })();

    if (typeof window !== 'undefined') {
      hitAll(window.location.href, {
        title: document.title,
        referer: document.referrer || undefined,
        city,
      });
    }

    const promoInterval = window.setInterval(() => {
      const token = useHeaderStore.getState().token;
      void useProfileStore.getState().getCountPromosOrders(city, token);
    }, 30_000);

    return () => {
      window.clearTimeout(priceTimer);
      window.clearInterval(promoInterval);
    };
  }, [allItems, cats, city, cities, freeItems, links, needDop, tags]);

  return null;
}
