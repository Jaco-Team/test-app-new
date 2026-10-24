// Одинаковые запросы объединяются; старые ответы не заменяют свежую историю.
export function createOrderHistoryActions({ set, get, request, getToken, getCity }) {
  let revision = 0;
  let scope = '';
  let pending = null;
  return {
    orderList: [], orderListState: 'idle', orderListError: '',
    getOrderList(module, city, token, { force = false } = {}) {
      if (!token || token !== getToken()) return Promise.resolve(false);
      const key = `${module}:${city}:${token}`;
      if (pending?.key === key && !force) return pending.promise;
      const changed = scope !== key;
      scope = key;
      const id = ++revision;
      set({ ...(changed ? { orderList: [] } : {}), orderListState: 'loading', orderListError: '' });
      const current = () => revision === id && scope === key && getToken() === token && (!getCity() || getCity() === city);
      const promise = Promise.resolve().then(async () => {
        try {
          const response = await request(module, { type: 'get_my_orders_new_', city_id: city, user_id: token });
          if (!current()) return false;
          if (response?.st === false || !Array.isArray(response?.order_list) || response?.$user === null) throw new Error('history_unavailable');
          set({ orderList: response.order_list, city, orderListState: 'ready', orderListError: '' });
          return true;
        } catch {
          if (current()) set({ orderListState: 'error', orderListError: 'Не удалось загрузить историю заказов. Попробуйте ещё раз.' });
          return false;
        } finally {
          if (pending?.promise === promise) pending = null;
        }
      });
      pending = { key, promise };
      return promise;
    },
    clearOrderList() {
      revision += 1; scope = ''; pending = null;
      set({ orderList: [], orderListState: 'idle', orderListError: '', countsPending: null, count_orders: 0, count_promo: 0 });
    },
  };
}
