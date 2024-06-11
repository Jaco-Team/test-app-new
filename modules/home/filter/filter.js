import { useState, useEffect } from 'react';

import { useHomeStore, useHeaderStore } from '@/components/store';

const tags_data = [
  {
    id: '1',
    name: 'Лосось',
  },
  {
    id: '2',
    name: 'Креветка',
  },
  {
    id: '7',
    name: 'Угорь',
  },
  {
    id: '3',
    name: 'Шампиньоны',
  },
  {
    id: '4',
    name: 'Курица',
  },
  {
    id: '5',
    name: 'Ананас',
  },
  {
    id: '6',
    name: 'Песто',
  },
  {
    id: '9',
    name: 'Пепперони',
  },
  {
    id: '8',
    name: 'Мандарины',
  },
];

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
  {
    id: '3',
    name: 'Выгодно',
    bg: 'rgb(221, 26, 50)',
  },
];

export default function Filter() {
  const [tags, setTags] = useState(tags_data);

  const [filterActive, isOpenFilter, filterItems] = useHomeStore((state) => [state.filterActive, state.isOpenFilter, state.filterItems]);
  const [matches] = useHeaderStore((state) => [state.matches]);

  const handleTag = (id) => {
    const tags_active = tags.map((item) => {
      if (parseInt(item.id) === parseInt(id)) {
        item.active = item?.active ? false : true;
      }
      return item;
    });

    setTags(tags_active);

    const res = tags_active.reduce((res, tag) => res + (tag.active ? 1 : 0), 0);

    filterItems(res);
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

  return (
    <div className={matches ? 'filterMobile' : 'filterPC'} style={{ visibility: filterActive ? 'visible' : 'hidden' }}>
      {matches ? (
        <>
          <div className="filterBadge">
            <div>
              {badges?.map((badg, key) => (
                <span key={key} style={{ backgroundColor: badg.bg }}>
                  {badg.name}
                </span>
              ))}
            </div>
          </div>
          <div className="filterDivider" />
          <div className="filterTag">
            <div>
              {tags?.map((tag, key) => (
                <span key={key} onClick={() => handleTag(tag.id)} className={tag?.active ? 'active' : null}>
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="filterTag">
            <div>
              {tags?.map((tag, key) => (
                <span key={key} onClick={() => handleTag(tag.id)} className={tag?.active ? 'active' : null}>
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          <div className="filterDivider" />
          <div className="filterBadge">
            <div>
              {badges?.map((badg, key) => (
                <span key={key} style={{ backgroundColor: badg.bg }}>
                  {badg.name}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
