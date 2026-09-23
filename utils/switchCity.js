import Cookies from 'js-cookie';

import { api } from '@/components/api';
import {
  useCartStore,
  useCitiesStore,
  useHeaderStoreNew,
} from '@/components/store';
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/utils/browserStorage';
import { buildCityDestination, isSupportedCity } from '@/utils/cityCart';

let activeSwitch = null;

function restoreStorage(key, value) {
  if (value == null) removeLocalStorageItem(key);
  else setLocalStorageItem(key, value);
}

function unavailableMessage(items, cityName) {
  const names = items.map(
    (item) => item?.name || `Товар №${item?.item_id ?? item?.id}`
  );
  return `В меню города ${cityName} нет: ${names.join(', ')}. Эти товары удалены из корзины.`;
}

export function switchCity(city, router) {
  if (!isSupportedCity(city?.link) || !router?.isReady) {
    return Promise.resolve(false);
  }

  if (activeSwitch) return activeSwitch;

  const header = useHeaderStoreNew.getState();
  const cities = useCitiesStore.getState();
  if (cities.thisCity === city.link) return Promise.resolve(true);

  activeSwitch = (async () => {
    header.showLoad(true);

    try {
      const catalog = await api('home', {
        type: 'get_page_info',
        city_id: city.link,
        page: 'menu',
      });

      if (!catalog?.page || !Array.isArray(catalog.all_items)) {
        throw new Error('Каталог выбранного города недоступен');
      }

      const target = buildCityDestination(router.asPath, city.link, catalog);
      const previousCity = getLocalStorageItem('setCity');
      const previousCart = getLocalStorageItem('setCart');
      const previousCookie = Cookies.get('city');
      const previousCityState = useCitiesStore.getState();
      const previousCartState = useCartStore.getState();
      let committed = false;

      try {
        const cityList =
          Array.isArray(catalog.cities) && catalog.cities.length
            ? catalog.cities
            : previousCityState.thisCityList;
        useCitiesStore.setState({
          thisCity: city.link,
          thisCityRu: city.name,
          thisCityList: cityList,
        });
        setLocalStorageItem('setCity', JSON.stringify(city));
        Cookies.set('city', city.link, {
          expires: 365,
          path: '/',
          sameSite: 'Lax',
        });

        const removed = useCartStore.getState().applyCityCatalog(catalog);
        const navigated = await router.replace(target, undefined, {
          shallow: false,
        });
        if (!navigated)
          throw new Error('Переход в выбранный город не завершился');
        committed = true;

        if (previousCartState.global_checkout) {
          try {
            previousCartState.global_checkout.destroy();
          } catch (e) {}
        }

        if (removed.length) {
          useHeaderStoreNew
            .getState()
            .setActiveModalAlert(
              true,
              unavailableMessage(removed, city.name),
              false
            );
        }

        return true;
      } finally {
        if (!committed) {
          restoreStorage('setCity', previousCity);
          restoreStorage('setCart', previousCart);
          if (previousCookie == null) Cookies.remove('city', { path: '/' });
          else
            Cookies.set('city', previousCookie, {
              expires: 365,
              path: '/',
              sameSite: 'Lax',
            });
          useCitiesStore.setState(previousCityState);
          useCartStore.setState(previousCartState);
        }
      }
    } catch (error) {
      useHeaderStoreNew
        .getState()
        .setActiveModalAlert(
          true,
          'Не удалось переключить город. Корзина не изменилась, попробуйте ещё раз.',
          false
        );
      return false;
    } finally {
      useHeaderStoreNew.getState().showLoad(false);
      activeSwitch = null;
    }
  })();

  return activeSwitch;
}
