'use client';

import { useEffect, useLayoutEffect } from 'react';
import { useCatalogStore } from '@src/entities/catalog';
import { useCartStore } from '@src/entities/cart';
import { useCityStore } from '@src/entities/city';
import type { CityRecord } from '@src/entities/city';
import { useFooterStore } from '@src/entities/footer';
import { useHeaderStore } from '@src/entities/header';
import { useHomeStore } from '@src/entities/home';
import { useProfileStore } from '@src/entities/profile';
import { hitAll } from '@src/shared/lib/analytics/metrika';
import { setLocalStorageItem } from '@/utils/browserStorage';

export type StoreBootstrapProps = {
  city: string;
  cities: unknown[];
  cats: unknown[];
  allItems: unknown[];
  tags: unknown[];
  links: Record<string, unknown>;
  freeItems?: unknown[];
  needDop?: unknown;
  activePage?: string;
  page?: Record<string, unknown> | null;
};

function resolveCityLabel(city: string, cities: unknown[]): string {
  const found = (cities as CityRecord[]).find(
    (item) => String(item?.link ?? '') === city
  );
  return found?.name ? String(found.name) : city;
}

function seedStoresFromPage(props: StoreBootstrapProps): void {
  const {
    city,
    cities,
    cats,
    allItems,
    tags,
    links,
    freeItems = [],
    needDop = {},
    activePage = 'home',
  } = props;

  const label = resolveCityLabel(city, cities);

  useCityStore.getState().setCity(city, label, cities as CityRecord[]);
  setLocalStorageItem('setCity', JSON.stringify({ link: city, name: label }));
  useCatalogStore.getState().seedFromPage(cats, allItems, city, tags);
  useHomeStore.getState().seedFromPage(cats, allItems, city, tags);
  useHomeStore.getState().setAllTags(tags);
  useFooterStore.getState().setLinks(links, city);

  useCartStore.getState().setAllItems(allItems);
  useCartStore.getState().setFreeItems(freeItems);
  useCartStore.getState().setNeedDops(needDop);
  useCartStore.getState().hydrateFromLocalStorage();

  useHeaderStore.getState().setActivePage(activePage);
}

export function StoreBootstrap(props: StoreBootstrapProps) {
  const { city, freeItems = [], needDop = {}, activePage = 'home' } = props;

  useLayoutEffect(() => {
    seedStoresFromPage(props);
  }, [props]);

  useEffect(() => {
    const priceTimer = window.setTimeout(() => {
      useCartStore.getState().changeAllItems();
    }, 300);

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

    return () => window.clearTimeout(priceTimer);
  }, [
    activePage,
    city,
    freeItems,
    needDop,
    props.allItems,
    props.cats,
    props.cities,
    props.links,
    props.tags,
  ]);

  return null;
}
