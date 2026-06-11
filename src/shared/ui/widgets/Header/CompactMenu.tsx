import type { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { cn } from '../../foundation/classNames';
import {
  isCompactMenuAuthItem,
  type CompactMenuItem,
  type HeaderCompactMenuLink,
} from './compactMenu';

export type { CompactMenuItem, HeaderCompactMenuLink } from './compactMenu';

export type CompactMenuProps = {
  open: boolean;
  items: CompactMenuItem[];
  onClose?: () => void;
  onToggle?: () => void;
  onProfileClick?: () => void;
  onItemClick?: (
    item: HeaderCompactMenuLink,
    event: MouseEvent<HTMLElement>
  ) => void;
};

export function CompactMenu({
  open,
  items,
  onClose,
  onToggle,
  onProfileClick,
  onItemClick,
}: CompactMenuProps) {
  return (
    <SwipeableDrawer
      anchor="top"
      open={open}
      onOpen={() => {}}
      onClose={onClose ?? onToggle ?? (() => {})}
      className="ui-header__compact-drawer"
      disableSwipeToOpen
      disableDiscovery
      transitionDuration={{ enter: 180, exit: 150 }}
      ModalProps={{
        keepMounted: false,
        disableScrollLock: true,
      }}
      slotProps={{
        backdrop: {
          className: 'ui-header__compact-drawer-backdrop',
        },
        paper: {
          className: 'ui-header__compact-menu',
        },
        root: {
          sx: { zIndex: 1200 },
        },
      }}
    >
      <motion.nav
        className="ui-header__compact-menu-nav"
        aria-label="Мобильное меню"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <Icon
                aria-hidden="true"
                className="ui-header__compact-menu-icon"
              />
              <span className="ui-header__compact-menu-text">{item.label}</span>
              {item.badge ? (
                <span className="ui-header__compact-menu-badge">
                  {item.badge}
                </span>
              ) : null}
            </>
          );

          return item.button ? (
            <button
              key={item.id}
              className={cn(
                'ui-header__compact-menu-link',
                item.active && 'ui-header__compact-menu-link--active'
              )}
              type="button"
              onClick={(event) => {
                if (isCompactMenuAuthItem(item)) {
                  onProfileClick?.();
                }
                onItemClick?.(item, event);
              }}
            >
              {content}
            </button>
          ) : (
            <a
              key={item.id}
              className={cn(
                'ui-header__compact-menu-link',
                item.active && 'ui-header__compact-menu-link--active'
              )}
              href={item.href ?? '#'}
              onClick={(event) => onItemClick?.(item, event)}
            >
              {content}
            </a>
          );
        })}
      </motion.nav>
      <div className="ui-header__compact-menu-grip" aria-hidden="true" />
    </SwipeableDrawer>
  );
}
