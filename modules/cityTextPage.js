import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

import Footer from '@/components/footer.js';
import StructuredData from '@/components/structuredData';
import {
  useCartStore,
  useCitiesStore,
  useHeaderStoreNew,
} from '@/components/store.js';
import { roboto } from '@/ui/Font.js';

const DynamicPage = dynamic(() => import('@/modules/pageText'));

export default function CityTextPage({ data1, slug, presentation }) {
  const { city, cities, page, all_items, free_items, need_dop, links, schema } =
    data1;

  const [
    setAllItems,
    setFreeItems,
    allItems,
    changeAllItems,
    setNeedDops,
    getCartLocalStorage,
  ] = useCartStore((state) => [
    state.setAllItems,
    state.setFreeItems,
    state.allItems,
    state.changeAllItems,
    state.setNeedDops,
    state.getCartLocalStorage,
  ]);

  const [thisCity, setThisCity, setThisCityRu, setThisCityList] =
    useCitiesStore((state) => [
      state.thisCity,
      state.setThisCity,
      state.setThisCityRu,
      state.setThisCityList,
    ]);

  const [setActivePage] = useHeaderStoreNew((state) => [state.setActivePage]);

  useEffect(() => {
    let timer;

    if (thisCity !== city) {
      const found = Array.isArray(cities)
        ? cities.find((item) => item?.link === city)
        : null;

      setThisCity(city);
      setThisCityRu(found?.name ?? '');
      setThisCityList(cities);
      setAllItems(all_items);
      timer = setTimeout(changeAllItems, 300);
    }

    if (allItems.length === 0) setAllItems(all_items);
    setFreeItems(free_items);
    setNeedDops(need_dop);
    getCartLocalStorage();
    setActivePage(presentation.activePage || slug);

    return () => clearTimeout(timer);
  }, [city, slug]);

  const rootClassName = presentation.rootClass
    ? `${roboto.variable} ${presentation.rootClass}`
    : roboto.variable;

  const pageContent = (
    <>
      <DynamicPage
        page={page}
        classNamePC={presentation.classNamePC}
        classNameMobile={presentation.classNameMobile}
        cityName={city}
      />
      <StructuredData data={schema} />
    </>
  );

  return (
    <div className={rootClassName}>
      {presentation.contentWrapperClass ? (
        <div className={presentation.contentWrapperClass}>{pageContent}</div>
      ) : (
        pageContent
      )}
      {presentation.footerWrapperClass ? (
        <div className={presentation.footerWrapperClass}>
          <Footer
            cityName={city}
            active_page={presentation.footerActivePage}
            links={links}
          />
        </div>
      ) : (
        <Footer
          cityName={city}
          active_page={presentation.footerActivePage}
          links={links}
        />
      )}
    </div>
  );
}
