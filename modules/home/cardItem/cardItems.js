import React, { useEffect, useMemo, useRef } from 'react';

import Grid from '@mui/material/Grid';

import {
  useHomeStore,
  useCartStore,
  useCitiesStore,
} from '@/components/store.js';
import { useHomeMobileLayout } from '@/utils/useHomeMobileLayout';

import CardItemPc from './cardItemPc';
import CardItemMobile from './cardItemMobile.js';

import * as Scroll from 'react-scroll';
var scroller = Scroll.scroller;

import { useRouter } from 'next/router';
import {
  getLocalStorageItem,
  removeLocalStorageItem,
} from '@/utils/browserStorage';
import { isHomeCatalogItemVisible } from '@/utils/homeCatalogFilter';

const NOVINKI_BADGE_ID = 2;
const NOVINKI_SCROLL_DELAY_MS = 2500;
const NOVINKI_SCROLL_EXTRA_MS = 150;
const NOVINKI_SCROLL_DURATION_MS = 200;
const HOME_CATALOG_MENU_ID = 'homeCatalogMenu';

const findNovinkiTagId = (allTags) => {
  if (!Array.isArray(allTags)) {
    return null;
  }

  const tag = allTags.find((item) => {
    const name = String(item?.name || '')
      .trim()
      .toLowerCase();
    return name === 'новинки' || name === 'новинка' || name.includes('новин');
  });

  return tag?.id ?? null;
};

const applyNovinkiFilter = () => {
  const homeState = useHomeStore.getState();
  const novinkiTagId = findNovinkiTagId(homeState.all_tags);

  if (novinkiTagId != null) {
    useHomeStore.setState({
      tag_filter: novinkiTagId,
      badge_filter: '',
      text_filter: '',
    });
    return;
  }

  useHomeStore.setState({
    badge_filter: NOVINKI_BADGE_ID,
    tag_filter: '',
    text_filter: '',
  });
};

const isNovinkiFilterActive = (homeState) => {
  const tagId = parseInt(homeState?.tag_filter, 10);
  const badgeId = parseInt(homeState?.badge_filter, 10);

  if (badgeId === NOVINKI_BADGE_ID) {
    return true;
  }

  if (!Number.isFinite(tagId) || tagId <= 0) {
    return false;
  }

  const novinkiTagId = findNovinkiTagId(homeState?.all_tags);
  return novinkiTagId != null && tagId === parseInt(novinkiTagId, 10);
};

const scrollToNovinkiCatalogMenu = () => {
  let offset = 200;

  if (document.querySelector('.ContainerCardItemMobile')) {
    offset += 200;
  }

  const firstCard = document.querySelector(
    '.CardItemPC[name], .ContainerCardItemMobile [name]'
  );

  if (firstCard?.getAttribute('name')) {
    scroller.scrollTo(firstCard.getAttribute('name'), {
      duration: NOVINKI_SCROLL_DURATION_MS,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -offset,
      isDynamic: true,
    });
    return;
  }

  const filterEl = document.getElementById(HOME_CATALOG_MENU_ID);
  const headerEl =
    document.querySelector('.headerNew') ||
    document.querySelector('.headerMobile');

  if (!filterEl || !headerEl) {
    return;
  }

  const headerHeight = headerEl.getBoundingClientRect().height;
  const filterHeight = Math.round(filterEl.getBoundingClientRect().height);

  scroller.scrollTo(HOME_CATALOG_MENU_ID, {
    duration: NOVINKI_SCROLL_DURATION_MS,
    delay: 0,
    smooth: 'easeInOutQuart',
    offset: -filterHeight,
    isDynamic: true,
  });
};

const runNovinkiScrollAndCleanup = (onUrlClean) => {
  if (typeof window === 'undefined') {
    onUrlClean?.();
    return () => {};
  }

  let cancelled = false;
  const timers = [];

  const timerId = setTimeout(() => {
    if (cancelled) {
      return;
    }

    const scrollTimerId = setTimeout(() => {
      if (cancelled) {
        return;
      }

      scrollToNovinkiCatalogMenu();

      const cleanTimerId = setTimeout(() => {
        if (!cancelled) {
          onUrlClean?.();
        }
      }, NOVINKI_SCROLL_DURATION_MS + 50);

      timers.push(cleanTimerId);
    }, NOVINKI_SCROLL_EXTRA_MS);

    timers.push(scrollTimerId);
  }, NOVINKI_SCROLL_DELAY_MS);

  timers.push(timerId);

  return () => {
    cancelled = true;
    timers.forEach(clearTimeout);
  };
};

const normalizeCategoryLink = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return '';

  const withoutHash = raw.split('#')[0];
  const withoutQuery = withoutHash.split('?')[0];
  const withoutOrigin = withoutQuery.replace(/^https?:\/\/[^/]+/i, '');
  const withoutLeadingSlash = withoutOrigin.replace(/^\/+/, '');
  const withoutCityMenu = withoutLeadingSlash
    .replace(/^[^/]+\/menu\//i, '')
    .replace(/^menu\//i, '');

  const segment = withoutCityMenu.split('/').filter(Boolean).pop() || '';

  try {
    return decodeURIComponent(segment).toLowerCase();
  } catch {
    return segment.toLowerCase();
  }
};

export default React.memo(function CatItems({ showCategoryHeadings = false }) {
  const novinkiScrollStopRef = useRef(null);
  const router = useRouter();
  const isRouterReady = router.isReady;
  const replaceRoute = router.replace;
  const pathname =
    typeof router.asPath === 'string' ? router.asPath.split('?')[0] : '';
  const search =
    typeof router.query?.item === 'string' ? router.query.item : '';
  const search_category =
    typeof router.query?.category === 'string' ? router.query.category : '';
  const hasNovinkiQuery =
    isRouterReady &&
    Object.prototype.hasOwnProperty.call(router.query, 'novinki');

  let catygory = '';
  const skipMenuCategoryOnce =
    typeof window !== 'undefined' &&
    getLocalStorageItem('ignoreMenuCategoryOnce') === '1';

  if (
    !skipMenuCategoryOnce &&
    pathname.split('menu/')[1] &&
    pathname.split('menu/')[1].length > 0
  ) {
    catygory = pathname.split('menu/')[1];
  }

  const [
    category,
    CatsItems,
    all_tags,
    getItem,
    closeModal,
    transition_menu_mobile,
    badge_filter,
    tag_filter,
    text_filter,
  ] = useHomeStore((state) => [
    state.category,
    state.CatsItems,
    state.all_tags,
    state.getItem,
    state.closeModal,
    state.transition_menu_mobile,
    state.badge_filter,
    state.tag_filter,
    state.text_filter,
  ]);
  const [items, allItems] = useCartStore((state) => [
    state.items,
    state.allItems,
  ]);
  const isHomeMobile = useHomeMobileLayout();
  const [thisCity] = useCitiesStore((state) => [state.thisCity]);

  const cartCountById = useMemo(
    () =>
      new Map(
        (items || []).map((item) => [
          Number(item?.item_id),
          Number(item?.count) || 0,
        ])
      ),
    [items]
  );

  const catalogFilter = useMemo(
    () => ({ badge_filter, tag_filter, text_filter }),
    [badge_filter, tag_filter, text_filter]
  );

  const cats = useMemo(
    () =>
      (CatsItems || []).map((cat) => ({
        ...cat,
        items: (cat?.items || []).map((item) => ({
          ...item,
          count: cartCountById.get(Number(item?.id)) || 0,
        })),
      })),
    [CatsItems, cartCountById]
  );

  const visibleCats = useMemo(() => {
    const sourceCats =
      catygory.length > 0
        ? cats.filter(
            (item) => item.link == catygory || item.main_link == catygory
          )
        : cats;

    return sourceCats
      .map((cat) => ({
        ...cat,
        items: (cat.items || []).filter((item) =>
          isHomeCatalogItemVisible(item, catalogFilter)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [cats, catygory, catalogFilter]);

  const mainCategoryTitleById = useMemo(() => {
    const result = new Map();

    (category || []).forEach((mainCat) => {
      const mainId = String(mainCat?.id ?? '').trim();
      const mainName = String(mainCat?.name ?? '').trim();

      if (mainId && mainName) {
        result.set(mainId, mainName);
      }
    });

    return result;
  }, [category]);

  useEffect(() => {
    if (!isRouterReady) {
      return;
    }

    if (getItem && search && search.length > 0 && CatsItems.length > 0) {
      let find_item = null;

      CatsItems.map((cat) => {
        cat.items.map((item) => {
          if (item.link === search) {
            find_item = item;
          }
        });
      });

      if (find_item && thisCity && find_item?.id) {
        getItem('home', thisCity, find_item?.id);

        let offset = 200;

        if (document.querySelector('.scrollCat.mobile')) {
          offset += 200;
        }

        setTimeout(() => {
          scroller.scrollTo(search, {
            duration: 200,
            delay: 0,
            smooth: 'easeInOutQuart',
            offset: -offset,
          });
        }, 150);
      } else {
        closeModal();
      }
    }
  }, [isRouterReady, search, CatsItems, getItem, thisCity, closeModal]);

  useEffect(() => {
    if (!isRouterReady) {
      return;
    }

    if (!Array.isArray(CatsItems) || CatsItems.length === 0) {
      return;
    }

    if (typeof window !== 'undefined') {
      const pendingCategoryLink = getLocalStorageItem('goToCategoryLink');
      const effectiveCategoryLink =
        search_category?.length > 0 ? search_category : pendingCategoryLink;
      const normalizedTargetLink = normalizeCategoryLink(effectiveCategoryLink);

      if (category.length > 0 && normalizedTargetLink.length > 0) {
        //console.log( 'search_category', search_category, category )

        let scroll_cat_id = 0;

        category.map((main_cat) => {
          if (main_cat.cats.length > 0) {
            main_cat.cats.map((cat) => {
              if (normalizeCategoryLink(cat.link) === normalizedTargetLink) {
                scroll_cat_id = cat.id;
                //chooseCat(cat.name, cat.id)
              }
            });
          } else {
            if (normalizeCategoryLink(main_cat.link) === normalizedTargetLink) {
              scroll_cat_id = main_cat.id;
              //chooseCat(main_cat.name, main_cat.id)
            }
          }
        });

        if (parseInt(scroll_cat_id) > 0) {
          const targetNodeId = 'cat' + scroll_cat_id;
          let attemptsLeft = 12;

          const cleanupCategoryState = () => {
            if (
              search_category?.length > 0 &&
              typeof replaceRoute === 'function'
            ) {
              replaceRoute(window.location.pathname, undefined, {
                shallow: true,
                scroll: false,
              });
            } else {
              let state = {},
                title = '',
                url = window.location.pathname;

              window.history.pushState(state, title, url);
            }

            removeLocalStorageItem('goToCategoryLink');
            removeLocalStorageItem('ignoreMenuCategoryOnce');
          };

          const tryScrollToCategory = () => {
            const targetNode = document.getElementById(targetNodeId);

            if (!targetNode && attemptsLeft > 0) {
              attemptsLeft -= 1;
              setTimeout(tryScrollToCategory, 120);
              return;
            }

            if (!targetNode) {
              return;
            }

            let offset = 70;

            if (document.querySelector('.ContainerCardItemMobile')) {
              offset += 120;
            }

            setTimeout(() => {
              scroller.scrollTo(targetNodeId, {
                duration: 200,
                delay: 0,
                smooth: 'easeInOutQuart',
                offset: -offset,
              });
            }, 150);

            cleanupCategoryState();
          };

          tryScrollToCategory();
        } else if (normalizedTargetLink.length > 0) {
          removeLocalStorageItem('goToCategoryLink');
          removeLocalStorageItem('ignoreMenuCategoryOnce');
        }
      }
    }
  }, [isRouterReady, replaceRoute, search_category, category, CatsItems]);

  useEffect(() => {
    if (!hasNovinkiQuery) {
      novinkiScrollStopRef.current?.();
      novinkiScrollStopRef.current = null;
      return;
    }

    if (!Array.isArray(CatsItems) || CatsItems.length === 0) {
      return;
    }

    const homeState = useHomeStore.getState();
    const novinkiTagId = findNovinkiTagId(homeState.all_tags);
    const tagFilter = parseInt(homeState.tag_filter, 10);
    const badgeFilter = parseInt(homeState.badge_filter, 10);

    const needsTagFilter =
      novinkiTagId != null &&
      (tagFilter !== parseInt(novinkiTagId, 10) ||
        badgeFilter === NOVINKI_BADGE_ID);
    const needsBadgeFilter =
      novinkiTagId == null && badgeFilter !== NOVINKI_BADGE_ID;

    if (needsTagFilter || needsBadgeFilter) {
      applyNovinkiFilter();
      return;
    }

    if (!isNovinkiFilterActive(homeState)) {
      return;
    }

    if (novinkiScrollStopRef.current) {
      return;
    }

    const cleanNovinkiUrl = () => {
      novinkiScrollStopRef.current = null;

      if (
        typeof replaceRoute === 'function' &&
        pathname &&
        Object.prototype.hasOwnProperty.call(router.query, 'novinki')
      ) {
        replaceRoute(pathname, undefined, { shallow: true, scroll: false });
      }
    };

    novinkiScrollStopRef.current = runNovinkiScrollAndCleanup(cleanNovinkiUrl);

    return () => {
      novinkiScrollStopRef.current?.();
      novinkiScrollStopRef.current = null;
    };
  }, [
    hasNovinkiQuery,
    CatsItems.length,
    all_tags,
    tag_filter,
    badge_filter,
    pathname,
    replaceRoute,
  ]);

  useEffect(() => {
    setTimeout(() => {
      const hash = getLocalStorageItem('goTo');

      if (hash) {
        removeLocalStorageItem('goTo');

        let offset = 70;

        if (document.querySelector('.scrollCat.mobile')) {
          offset += 70;
        }

        setTimeout(() => {
          scroller.scrollTo('cat' + hash, {
            duration: 200,
            delay: 0,
            smooth: 'easeInOutQuart',
            offset: -offset,
          });
        }, 150);
      }
    }, 300);
  }, []);

  if (cats.length == 0) return <div style={{ height: 1000 }} />;

  if (visibleCats.length === 0) {
    return <div style={{ height: 1000 }} />;
  }

  if (isHomeMobile) {
    const renderedMainCategoryIds = new Set();

    return visibleCats.map((cat, key) => {
      const mainCategoryId = String(cat?.main_id ?? cat?.id ?? '').trim();
      const mainCategoryTitle =
        mainCategoryTitleById.get(mainCategoryId) ||
        String(cat?.main_name ?? '').trim();
      const shouldShowMainTitle =
        showCategoryHeadings &&
        mainCategoryId.length > 0 &&
        mainCategoryTitle.length > 0 &&
        !renderedMainCategoryIds.has(mainCategoryId);

      if (shouldShowMainTitle) {
        renderedMainCategoryIds.add(mainCategoryId);
      }

      return (
        <Grid
          container
          //spacing={2}
          key={key}
          name={'cat' + cat.main_id}
          id={'cat' + cat.id}
          className="ContainerCardItemMobile"
          style={{ transform: `translateY(${transition_menu_mobile})` }}
        >
          {shouldShowMainTitle ? (
            <h2 className="HomeCategoryTitle HomeCategoryTitle--mobile">
              {mainCategoryTitle}
            </h2>
          ) : null}

          {cat.items.map((it, k) => (
            <CardItemMobile key={k} item={it} count={it.count} />
          ))}
        </Grid>
      );
    });
  }

  const renderedMainCategoryIds = new Set();

  return visibleCats.map((cat, key) => {
    const mainCategoryId = String(cat?.main_id ?? cat?.id ?? '').trim();
    const mainCategoryTitle =
      mainCategoryTitleById.get(mainCategoryId) ||
      String(cat?.main_name ?? '').trim();
    const shouldShowMainTitle =
      showCategoryHeadings &&
      mainCategoryId.length > 0 &&
      mainCategoryTitle.length > 0 &&
      !renderedMainCategoryIds.has(mainCategoryId);

    if (shouldShowMainTitle) {
      renderedMainCategoryIds.add(mainCategoryId);
    }

    return (
      <Grid
        container
        //spacing={2}
        key={key}
        name={'cat' + cat.main_id}
        id={'cat' + cat.id}
        className={`ContainerCardItemPC ${key === 0 ? 'ContainerCardItemPC--first' : ''} ${key === (visibleCats?.length ?? 0) - 1 ? 'ContainerCardItemPC--last' : ''}`}
      >
        {shouldShowMainTitle ? (
          <h2 className="HomeCategoryTitle HomeCategoryTitle--desktop">
            {mainCategoryTitle}
          </h2>
        ) : null}

        {cat.items.map((it, k) => (
          <CardItemPc key={k} item={it} count={it.count} />
        ))}
      </Grid>
    );
  });
});
