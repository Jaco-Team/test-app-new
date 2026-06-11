'use client';

import { useEffect, useLayoutEffect } from 'react';
import { useCartStore } from '@src/entities/cart';
import type { CityRecord } from '@src/entities/city';
import { useCityStore } from '@src/entities/city';
import { useFooterStore } from '@src/entities/footer';
import { useHeaderStore } from '@src/entities/header';
import { useHomeStore } from '@src/entities/home';
import { useProfileStore } from '@src/entities/profile';
import { hitAll } from '@src/shared/lib/analytics/metrika';
import { resolveCityLabel } from '@src/shared/lib/resolveCityLabel';
import { setLocalStorageItem } from '@/utils/browserStorage';
import type { StoreBootstrapProps } from './model/types';

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
