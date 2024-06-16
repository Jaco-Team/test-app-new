import { useState, useEffect } from 'react';

import { useHomeStore, useHeaderStore } from '@/components/store';

const badges = [
  {
    id: '1',
    name: 'Хит',
    bg: 'rgb(175, 0, 219)',
  },
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

  const [filterActive, isOpenFilter, filterItems, all_tags, filterItemsBadge] = useHomeStore((state) => [state.filterActive, state.isOpenFilter, state.filterItems, state.all_tags, state.filterItemsBadge]);
  const [matches] = useHeaderStore((state) => [state.matches]);

  const handleBadge  =  (id)  =>  {

    filterItemsBadge( parseInt(id) );
  }

  const handleTag = (id) => {
    const tags_active = tags.map((item) => {
      if (parseInt(item.id) === parseInt(id)) {
        item.active = item?.active ? false : true;
      }
      return item;
    });

    setTags(tags_active);

    const res = tags_active.reduce((res, tag) => res + (tag.active ? 1 : 0), 0);

    filterItems( parseInt(id) );
  };

  useEffect(() => {
    if (!isOpenFilter) {
      const tags_active = tags.map((item) => {
        item.active = false;
        return item;
      });
      setTags(tags_active);

      filterItems(0);
    }
  }, [isOpenFilter]);

  useEffect(() => {
    setTags(all_tags)
  }, [all_tags]);

  return (
    <div className={matches ? 'filterMobile' : 'filterPC'} style={{ visibility: filterActive ? 'visible' : 'hidden' }}>
      {matches ? (
        <>
          <div className="filterBadge">
            <div>
              {badges?.map((badg, key) => (
                <div key={key} style={{ backgroundColor: badg.bg }} className={'tag'} onClick={ () =>  handleBadge(badg.id) }>
                  <span>
                    {badg.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="filterDivider" />
          <div className="filterTag">
            <div>
              {tags?.map((tag, key) => (
                <div key={key} onClick={() => handleTag(tag.id)} className={tag?.active ? 'tag active' : 'tag'}>
                  <span>
                    {tag.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="filterTag">
            <div>
              {tags?.map((tag, key) => (
                <div key={key} onClick={() => handleTag(tag.id)} className={tag?.active ? 'tag active' : 'tag'}>
                  <span>
                    {tag.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="filterDivider" />
          <div className="filterBadge">
            <div>
              {badges?.map((badg, key) => (
                <div key={key} style={{ backgroundColor: badg.bg }} className={'tag'} onClick={ () =>  handleBadge(badg.id) }>
                  <span>
                    {badg.name}
                  </span>
                </div>
                
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
