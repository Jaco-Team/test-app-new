import React, { useState } from 'react';

import { MyCatLink } from '@stories/shared/MyTextLink/MyCatLink';
import { MyMenu } from '@stories/shared/MyMenu/MyMenu';

import './CategoryMenu.scss';

export interface CategoryMenuItem {
  id: string;
  name: string;
  link: string;
  short_name?: string;
  cats?: CategoryMenuItem[];
}

interface CategoryMenuProps {
  items: CategoryMenuItem[];
  withPromo?: boolean;
}

export function CategoryMenu({ items, withPromo = false }: CategoryMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openItems, setOpenItems] = useState<CategoryMenuItem[]>([]);
  const [activeItem, setActiveItem] = useState<CategoryMenuItem | null>(
    items[0] ?? null
  );
  const activeChildren = activeItem?.cats ?? [];

  const closeMenu = () => {
    setAnchorEl(null);
    setOpenItems([]);
  };

  return (
    <>
      <nav className="categoryMenu category-menu" aria-label="Категории меню">
        <div className="category-menu__row category-menu__primary">
          {items.map((item) => {
            const children = item.cats ?? [];
            const isActive = activeItem?.id === item.id;

            return (
              <button
                key={item.id}
                className={
                  isActive
                    ? 'category-menu__chip category-menu__chip--active'
                    : 'category-menu__chip'
                }
                type="button"
                onClick={(event) => {
                  setActiveItem(item);
                  setAnchorEl(event.currentTarget);
                  setOpenItems(children);
                }}
              >
                {item.short_name ?? item.name}
              </button>
            );
          })}

          {withPromo && (
            <button className="category-menu__filter" type="button">
              Акции
            </button>
          )}
        </div>

        {activeChildren.length > 0 && (
          <div className="category-menu__row category-menu__secondary">
            {activeChildren.map((item) => (
              <button
                key={item.id}
                className="category-menu__chip"
                type="button"
              >
                {item.short_name ?? item.name}
              </button>
            ))}
          </div>
        )}

        <div className="category-menu__row category-menu__desktop">
          {items.map((item) => {
            const children = item.cats ?? [];

            return (
              <MyCatLink
                key={item.id}
                arrow={children.length > 0}
                onClick={(event) => {
                  setAnchorEl(event.currentTarget);
                  setOpenItems(children);
                }}
              >
                {item.name}
              </MyCatLink>
            );
          })}

          {withPromo && (
            <a className="akcia">
              <MyCatLink bordered>Акции</MyCatLink>
            </a>
          )}
        </div>
      </nav>

      <MyMenu
        list={openItems}
        isOpen={openItems.length > 0}
        anchorEl={anchorEl}
        onClose={closeMenu}
        type="cat"
      />
    </>
  );
}
