import { useState, useEffect } from 'react';

import { useHomeStore, useHeaderStoreNew, useCartStore } from '@/components/store';

import { motion } from 'framer-motion';

import {
  //Search,
  Close
} from '@/ui/Icons.js';
//import MyTextInput from '@/ui/MyTextInput';
//import InputAdornment from '@mui/material/InputAdornment';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import { roboto } from '@/ui/Font';

const badges = [
  /*{
    id: '1',
    name: 'Хит',
    bg: 'rgb(175, 0, 219)',
  },*/
  {
    id: '2',
    name: 'Новинка',
    bg: 'rgb(238, 121, 0)',
  },
  /*{
    id: '3',
    name: 'Выгодно',
    bg: 'rgb(221, 26, 50)',
  },*/
];

export default function Filter() {
  const [tags, setTags] = useState([]);

  // список доступных badges (на category будем фильтровать)
  const [badgesAvailable, setBadgesAvailable] = useState(badges);

  const [
    filterActive,
    resetFilter,
    scrollToTargetAdjusted,
    //isOpenFilter,
    filterItems,
    all_tags,
    filterItemsBadge,
    setActiveFilter,
    tag_filter,
    text_filter,
    //filterText,
    badge_filter
  ] = useHomeStore((state) => [
    state.filterActive,
    state.resetFilter,
    state.scrollToTargetAdjusted,
    //state.isOpenFilter,
    state.filterItems,
    state.all_tags,
    state.filterItemsBadge,
    state.setActiveFilter,
    state.tag_filter,
    state.text_filter,
    //state.filterText,
    state.badge_filter
  ]);

  const [matches, activePage] = useHeaderStoreNew((state) => [state?.matches, state?.activePage]);

  const allItems = useCartStore((s) => s.allItems);

  // фильтр показываем только на страницах с карточками товаров
  const canShowFilter = activePage === 'home' || activePage === 'category';

  const resetTags = () => {
    setTags(prev => prev.map(t => ({ ...t, active: false })));
  };

  //утилита закрытия именно мобильной модалки фильтра
  const closeMobileFilter = () => {
    if (matches) setActiveFilter(false);
  };

  const handleBadge = (id) => {
    filterItemsBadge(parseInt(id));

    if (tag_filter) {
      resetTags();
    }
   
    closeMobileFilter();
  };

  // const handleText = (event) => {
  //   filterText(event);
  //
  //   if (tag_filter) {
  //     resetTags();
  //   }
  // };

  const handleTag = (id) => {
    if (Number(id) === -1) {
      resetTags();
      resetFilter();
      scrollToTargetAdjusted();

      closeMobileFilter();
      return;
    }

    setTags(prev => prev.map(t => ({
      ...t,
      active: Number(t.id) === Number(id) ? !t.active : false,
    })));

    filterItems(Number(id));

    closeMobileFilter();
  };

  useEffect(() => {
    if (badge_filter == '' && text_filter == '' && tag_filter == '') {
      resetTags();
      resetFilter();
    }
  }, [badge_filter, tag_filter, text_filter]);

  /*useEffect(() => {
    if (!isOpenFilter) {
      resetTags();
    }
  }, [isOpenFilter]);*/

  // - home: теги все, badges все
  // - category: теги только доступные + badges только доступные
  useEffect(() => {
    // если на этой странице фильтр не нужен — закрываем
    if (!canShowFilter) {
      setActiveFilter(false);
      return;
    }

    if (!all_tags?.length) {
      setTags([]);
      setBadgesAvailable(badges);
      return;
    }

    if (activePage !== 'category') {
      setTags(all_tags.map(t => ({
        ...t,
        active: Number(t.id) === Number(tag_filter),
      })));

      setBadgesAvailable(badges);
      return;
    }

    if (typeof window === 'undefined') {
      setTags(all_tags.map(t => ({
        ...t,
        active: Number(t.id) === Number(tag_filter),
      })));
      setBadgesAvailable(badges);
      return;
    }

    let tries = 0;
    const MAX_TRIES = 15;

    const computeAvailable = () => {
      const availableTags = new Set();
      const availableBadges = new Set();

      (allItems || []).forEach((item) => {
        if (!item?.link) return;

        // товар считается “на странице”, если его карточка реально в DOM
        if (document.getElementById(item.link)) {
          (item.tags || []).forEach((t) => availableTags.add(Number(t)));

          // "Новинка" доступна только если на странице есть хотя бы один is_new=1
          if (parseInt(item.is_new) === 1) {
            availableBadges.add('2');
          }

          // если вернуть "Хит"
          // if (parseInt(item.is_hit) === 1) availableBadges.add('1');
        }
      });

      if (availableTags.size === 0) return false;

      // теги только доступные
      const filteredTags = all_tags
        .filter((t) => availableTags.has(Number(t.id)))
        .map((t) => ({
          ...t,
          active: Number(t.id) === Number(tag_filter),
        }));

      setTags(filteredTags);

      // badges только доступные на category
      const filteredBadges = badges.filter(b => availableBadges.has(String(b.id)));
      setBadgesAvailable(filteredBadges);

      return true;
    };

    const ok = computeAvailable();

    if (!ok) {
      const timer = setInterval(() => {
        tries += 1;

        const done = computeAvailable();
        if (done || tries >= MAX_TRIES) {
          clearInterval(timer);

          // если так и не нашли карточки
          if (!done) {
            setTags(all_tags.map(t => ({
              ...t,
              active: Number(t.id) === Number(tag_filter),
            })));
            setBadgesAvailable(badges);
          }
        }
      }, 100);

      return () => clearInterval(timer);
    }
  }, [all_tags, allItems, activePage, tag_filter, canShowFilter, setActiveFilter]);

  useEffect(() => {
    if (activePage !== 'home' && activePage != '') {
      setActiveFilter(false);
    }
  }, [activePage]);

  const showClear = badge_filter !== '' || text_filter !== '' || tag_filter !== '';

  if (!canShowFilter) return null;

  return (
    <>
      {matches ? (
        <SwipeableDrawer
          anchor={'bottom'}
          open={filterActive}
          onClose={() => setActiveFilter(false)}
          onOpen={() => setActiveFilter(false)}
          id="modalFilterMobile"
          className={roboto.variable}
          disableSwipeToOpen
        >
          <div className="containerLine">
            <div className="lineModalCardMobile"></div>
          </div>

          <div className="filterMobile">
            <div className="filterTag">
              <div className="tags">

                {badgesAvailable?.map((badg, key) => (
                  <div key={key} style={{ backgroundColor: badg.bg }} className={'tag_'} onClick={() => handleBadge(badg.id)}>
                    <span>{badg.name}</span>
                  </div>
                ))}

                {tags?.map((tag, key) => (
                  <div key={key} onClick={() => handleTag(tag.id)} className={tag?.active ? 'tag active' : 'tag'}>
                    <span>{tag.name}</span>
                    {tag?.active ? <Close /> : false}
                  </div>
                ))}

                {showClear && (
                  <div onClick={() => handleTag(-1)} className={'search_clear tag'}>
                    <span>Очистить</span>
                  </div>
                )}
              </div>

              {/* <MyTextInput
                type="text"
                value={text_filter}
                func={(event) => handleText(event)}
                className="inputSearch"
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
              /> */}
            </div>
          </div>
        </SwipeableDrawer>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="filterPC"
        >
          <div className="filterTag" style={{ width: '100%' }}>
            <div style={{ width: '100%' }}>

              {badgesAvailable?.map((badg, key) => (
                <div key={key} style={{ backgroundColor: badg.bg, color: '#fff' }} className={'tag_'} onClick={() => handleBadge(badg.id)}>
                  <span style={{ color: '#fff' }}>{badg.name}</span>
                </div>
              ))}

              {tags?.map((tag, key) => (
                <div key={key} onClick={() => handleTag(tag.id)} className={tag?.active ? 'tag active' : 'tag'}>
                  <span>{tag.name}</span>
                  {tag?.active ? <Close /> : false}
                </div>
              ))}
            </div>

            <div className='search_clear'>
              {/* <MyTextInput
                type="text"
                value={text_filter}
                func={(event) => handleText(event)}
                className="inputSearch"
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
              /> */}

              {showClear && (
                <div onClick={() => handleTag(-1)} className={'tag'}>
                  <span>Очистить</span>
                </div>
              )}

            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
