import { useState, useEffect } from 'react';

import { useHomeStore, useHeaderStore } from '@/components/store';

import { motion } from 'framer-motion';

import { Search, Close } from '@/ui/Icons.js';
import MyTextInput from '@/ui/MyTextInput';
import InputAdornment from '@mui/material/InputAdornment';

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

  const [filterActive, resetFilter, scrollToTargetAdjusted, isOpenFilter, filterItems, all_tags, filterItemsBadge, setActiveFilter, tag_filter, text_filter, filterText] = useHomeStore((state) => [state.filterActive, state.resetFilter, state.scrollToTargetAdjusted, state.isOpenFilter, state.filterItems, state.all_tags, state.filterItemsBadge, state.setActiveFilter,
    state.tag_filter, state.text_filter, state.filterText]);

  const [matches, activePage] = useHeaderStore((state) => [state.matches, state.activePage]);

  const resetTags = () => {
    const tags_active = tags.map((item) => {
      item.active = false;
      return item;
    });

    setTags(tags_active);
  };

  const handleBadge = (id) => {
    filterItemsBadge(parseInt(id));

    if (tag_filter) {
      resetTags();
    }
  };

  const handleText = (event) => {
    filterText(event);

    if (tag_filter) {
      resetTags();
    }
  };

  const handleTag = (id) => {
    if(parseInt(id) == -1){
      
      resetTags();
      resetFilter();
      scrollToTargetAdjusted();

    } else {
      const tags_active = tags.map((item) => {
        if (parseInt(item.id) === parseInt(id)) {
          item.active = item?.active ? false : true;
        } else {
          item.active = false;
        }
        return item;
      });

      setTags(tags_active);

      filterItems(parseInt(id));
    }
  };

  useEffect(() => {
    if (!isOpenFilter) {
      resetTags();
    }
  }, [isOpenFilter]);

  useEffect(() => {
    setTags(all_tags);
  }, [all_tags]);

  useEffect(() => {
    if (activePage !== 'home') {
      setActiveFilter(false);
    }
  }, [activePage]);

  return (
    <>
      {matches ? (
        <div className="filterMobile" style={{ visibility: filterActive ? 'visible' : 'hidden' }}>
          
          <div className="filterTag">
            <div className="tags">

              {badges?.map((badg, key) => (
                <div key={key} style={{ backgroundColor: badg.bg }} className={'tag_'} onClick={() => handleBadge(badg.id)}>
                  <span>{badg.name}</span>
                </div>
              ))}

              {tags?.map((tag, key) => (
                <div key={key} onClick={() => handleTag(tag.id)} className={tag?.active ? 'tag active' : 'tag'}>
                  <span>{tag.name}</span>
                  { tag?.active ? <Close /> : false }
                </div>
              ))}

              <div onClick={() => handleTag(-1)} className={'search_clear tag'}>
                <span>Очистить</span>
              </div>
            </div>
            <MyTextInput
              type="text"
              value={text_filter}
              func={(event) => handleText(event)}
              className="inputSearch"
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
            />
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="filterPC"
        >
          <div className="filterTag" style={{ width: '100%' }}>
            <div style={{ width: '100%' }}>

              {badges?.map((badg, key) => (
                <div key={key} style={{ backgroundColor: badg.bg, color: '#fff' }} className={'tag_'} onClick={() => handleBadge(badg.id)}>
                  <span style={{ color: '#fff' }}>{badg.name}</span>
                </div>
              ))}

              {tags?.map((tag, key) => (
                <div key={key}  onClick={() => handleTag(tag.id)} className={tag?.active ? 'tag active' : 'tag'}>
                  <span>{tag.name}</span>
                  { tag?.active ? <Close /> : false }
                </div>
              ))}
              
            </div>

            <div className='search_clear'>
              <MyTextInput
                type="text"
                value={text_filter}
                func={(event) => handleText(event)}
                className="inputSearch"
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
              />

              <div onClick={() => handleTag(-1)} className={'tag'}>
                <span>Очистить</span>
              </div>

            </div>
          </div>
          
        </motion.div>
      )}
    </>
  );
}
