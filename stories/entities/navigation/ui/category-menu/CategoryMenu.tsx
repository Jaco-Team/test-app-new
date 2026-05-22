import React, { useState } from 'react';

import { MyCatLink } from '@stories/shared/MyTextLink/MyCatLink';
import { MyMenu } from '@stories/shared/MyMenu/MyMenu';

export interface CategoryMenuItem {
  id: string;
  name: string;
  link: string;
  cats?: CategoryMenuItem[];
}

interface CategoryMenuProps {
  items: CategoryMenuItem[];
  withPromo?: boolean;
}

export function CategoryMenu({ items, withPromo = false }: CategoryMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openItems, setOpenItems] = useState<CategoryMenuItem[]>([]);

  const closeMenu = () => {
    setAnchorEl(null);
    setOpenItems([]);
  };

  return (
    <>
      <nav className="categoryMenu" aria-label="Категории меню">
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
