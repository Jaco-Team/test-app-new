import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import type { HTMLAttributes } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ModalWrapper } from '../../components/ModalWrapper/ModalWrapper';
import { cn } from '../../foundation/classNames';
import { TagFilter } from '../../patterns/TagFilter/TagFilter';
import type { TagFilterItem } from '../../patterns/TagFilter/TagFilter';
import { CategoryButton } from '../Header/CategoryButton';
import './CategoryMenu.scss';

export interface CategoryMenuItem {
  label: string;
  shortLabel?: string;
  active?: boolean;
  targetId?: string;
  id?: string;
  parentId?: string;
  children?: CategoryMenuItem[];
}

export interface CategoryMenuProps extends HTMLAttributes<HTMLElement> {
  primaryItems?: CategoryMenuItem[];
  secondaryItems?: CategoryMenuItem[];
  activeTargetId?: string;
  tags?: TagFilterItem[];
  onItemSelect?: (item: CategoryMenuItem) => void;
  onActiveTargetChange?: (targetId: string | undefined) => void;
  onTagChange?: (item: TagFilterItem, index: number) => void;
  onTagClear?: () => void;
}

function visibleSecondaryItems(
  primaryItems: CategoryMenuItem[],
  secondaryItems: CategoryMenuItem[],
  activeTargetId?: string
): CategoryMenuItem[] {
  const activePrimary = primaryItems.find((item) => {
    if (item.targetId && item.targetId === activeTargetId) {
      return true;
    }

    return item.children?.some((child) => child.targetId === activeTargetId);
  });

  if (activePrimary) {
    return activePrimary.children?.length ? activePrimary.children : [];
  }

  return secondaryItems;
}

function resolvePrimaryTarget(item: CategoryMenuItem): CategoryMenuItem {
  return item.children?.[0] ?? item;
}

function scrollActiveCategoryButton(row: HTMLDivElement | null) {
  const activeNode = row?.querySelector<HTMLButtonElement>(
    '.ui-category-button--active'
  );

  if (!row || !activeNode) {
    return;
  }

  const maxScroll = row.scrollWidth - row.clientWidth;
  if (maxScroll <= 0) {
    return;
  }

  const nextLeft = Math.min(activeNode.offsetLeft, maxScroll);
  row.scrollTo({ left: nextLeft, behavior: 'smooth' });
}

export function CategoryMenu({
  primaryItems = [],
  secondaryItems = [],
  className,
  activeTargetId,
  tags = [],
  onItemSelect,
  onActiveTargetChange,
  onTagChange,
  onTagClear,
  ...props
}: CategoryMenuProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const primaryRowRef = useRef<HTMLDivElement>(null);
  const secondaryRowRef = useRef<HTMLDivElement>(null);
  const resolvedSecondaryItems = visibleSecondaryItems(
    primaryItems,
    secondaryItems,
    activeTargetId
  );
  const hasContent =
    primaryItems.length > 0 || secondaryItems.length > 0 || tags.length > 0;

  useEffect(() => {
    scrollActiveCategoryButton(primaryRowRef.current);
  }, [activeTargetId, primaryItems]);

  useEffect(() => {
    scrollActiveCategoryButton(secondaryRowRef.current);
  }, [activeTargetId, resolvedSecondaryItems]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const candidates = primaryItems.flatMap((item) => {
      if (item.children?.length) {
        return item.children;
      }

      return [item];
    });

    const updateActive = () => {
      let nextTargetId: string | undefined;
      let bestTop = Number.NEGATIVE_INFINITY;
      const menuHeight =
        document.querySelector('.ui-category-menu')?.getBoundingClientRect()
          .height ?? 0;
      const headerHeight =
        document.getElementById('headerNew')?.getBoundingClientRect().height ??
        0;
      const marker = headerHeight + menuHeight + 8;

      candidates.forEach((item) => {
        if (!item.targetId) {
          return;
        }

        const node = document.getElementById(item.targetId);
        if (!node) {
          return;
        }

        const top = node.getBoundingClientRect().top - marker;
        if (top <= 1 && top > bestTop) {
          bestTop = top;
          nextTargetId = item.targetId;
        }
      });

      if (!nextTargetId && window.scrollY <= 5) {
        nextTargetId = candidates[0]?.targetId;
      }

      onActiveTargetChange?.(nextTargetId);
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    updateActive();

    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, [onActiveTargetChange, primaryItems]);

  if (!hasContent) {
    return null;
  }

  return (
    <>
      <nav
        className={cn('ui-category-menu', className)}
        aria-label="Категории"
        {...props}
      >
        <div
          className="ui-category-menu__row ui-category-menu__row--primary"
          ref={primaryRowRef}
        >
          {primaryItems.map((item) => {
            const active = activeTargetId
              ? activeTargetId === item.targetId ||
                item.children?.some(
                  (child) => child.targetId === activeTargetId
                )
              : item.active;

            return (
              <CategoryButton
                key={item.id ?? item.label}
                active={Boolean(active)}
                onClick={() => onItemSelect?.(resolvePrimaryTarget(item))}
              >
                {item.shortLabel ?? item.label}
              </CategoryButton>
            );
          })}
          {tags.length > 0 ? (
            <CategoryButton
              iconOnly
              active={filterOpen}
              aria-label="Фильтры"
              onClick={() => setFilterOpen(true)}
            >
              <TuneRoundedIcon aria-hidden="true" />
            </CategoryButton>
          ) : null}
        </div>
        <div
          className={cn(
            'ui-category-menu__row ui-category-menu__row--secondary',
            resolvedSecondaryItems.length === 0 &&
              'ui-category-menu__row--empty'
          )}
          ref={secondaryRowRef}
          aria-hidden={resolvedSecondaryItems.length === 0 ? true : undefined}
        >
          {resolvedSecondaryItems.map((item) => (
            <CategoryButton
              key={item.id ?? item.label}
              secondary
              active={
                activeTargetId ? activeTargetId === item.targetId : item.active
              }
              onClick={() => onItemSelect?.(item)}
            >
              {item.shortLabel ?? item.label}
            </CategoryButton>
          ))}
        </div>
      </nav>

      <ModalWrapper
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Фильтры"
        variant="responsive"
        className="ui-category-menu__filter-modal"
        closeOutside
      >
        <TagFilter
          items={tags}
          className="ui-category-menu__filter-tags"
          onChange={onTagChange}
          onClear={onTagClear}
        />
      </ModalWrapper>
    </>
  );
}
