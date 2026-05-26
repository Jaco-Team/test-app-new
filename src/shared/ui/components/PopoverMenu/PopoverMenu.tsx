import type { MouseEvent, ReactNode } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import type { MenuProps } from '@mui/material/Menu';
import { cn } from '../../foundation/classNames';
import './PopoverMenu.scss';

export type PopoverMenuItem = {
  label: ReactNode;
  value?: string;
  href?: string;
  selected?: boolean;
  disabled?: boolean;
  target?: string;
  rel?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

export type PopoverMenuProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  items: PopoverMenuItem[];
  className?: string;
  menuListClassName?: string;
  itemClassName?: string;
  labelledBy?: string;
  placement?: 'bottom' | 'top';
  closeOnSelect?: boolean;
  menuProps?: Partial<Omit<MenuProps, 'open' | 'anchorEl' | 'onClose'>>;
};

export function PopoverMenu({
  anchorEl,
  open,
  onClose,
  items,
  className,
  menuListClassName,
  itemClassName,
  labelledBy,
  placement = 'bottom',
  closeOnSelect = true,
  menuProps,
}: PopoverMenuProps) {
  const verticalOrigin = placement === 'bottom' ? 'bottom' : 'top';
  const transformVerticalOrigin = placement === 'bottom' ? 'top' : 'bottom';

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      aria-labelledby={labelledBy}
      className={cn('ui-popover-menu', className)}
      anchorOrigin={{ vertical: verticalOrigin, horizontal: 'center' }}
      transformOrigin={{
        vertical: transformVerticalOrigin,
        horizontal: 'center',
      }}
      slotProps={{
        paper: {
          className: 'ui-popover-menu__paper',
        },
        list: {
          className: cn('ui-popover-menu__list', menuListClassName),
        },
      }}
      {...menuProps}
    >
      {items.map((item, index) => {
        const key =
          item.value ?? (typeof item.label === 'string' ? item.label : index);
        const handleClick = (event: MouseEvent<HTMLElement>) => {
          item.onClick?.(event);
          if (!event.defaultPrevented && closeOnSelect) {
            onClose();
          }
        };

        return (
          <MenuItem
            key={key}
            className={cn(
              'ui-popover-menu__item',
              item.selected && 'ui-popover-menu__item--selected',
              itemClassName
            )}
            selected={item.selected}
            disabled={item.disabled}
            component={item.href ? 'a' : 'button'}
            href={item.href}
            target={item.target}
            rel={item.rel}
            onClick={handleClick}
          >
            {item.label}
          </MenuItem>
        );
      })}
    </Menu>
  );
}
