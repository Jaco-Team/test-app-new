'use client';

import { useEffect } from 'react';
import { useProfileStore } from '@src/entities/profile';

const ORDERS_MODULE = 'zakazy';

export function useOrdersPage(citySlug: string, token: string) {
  const orderList = useProfileStore((state) => state.orderList);
  const getOrderList = useProfileStore((state) => state.getOrderList);

  useEffect(() => {
    if (!token.length) {
      return;
    }

    void getOrderList(ORDERS_MODULE, citySlug, token);
  }, [citySlug, getOrderList, token]);

  useEffect(() => {
    if (!token.length) {
      return;
    }

    const timer = window.setInterval(() => {
      void getOrderList(ORDERS_MODULE, citySlug, token);
    }, 30_000);

    return () => window.clearInterval(timer);
  }, [citySlug, getOrderList, token]);

  return {
    orderList,
  };
}
