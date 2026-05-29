import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import type { HTMLAttributes } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ModalWrapper } from '../../components/ModalWrapper/ModalWrapper';
import { cn } from '../../foundation/classNames';
import { TagFilter } from '../../patterns/TagFilter/TagFilter';
import type { TagFilterItem } from '../../patterns/TagFilter/TagFilter';
import { CategoryButton } from '../Header/CategoryButton';
import { scrollRowToActiveButton } from './categoryMenuScroll';
import { useCategoryScrollSpy } from './useCategoryScrollSpy';
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
  const [pinnedTargetId, setPinnedTargetId] = useState<string | undefined>();
  const pinnedTargetIdRef = useRef<string | undefined>();
  const primaryRowRef = useRef<HTMLDivElement>(null);
  const secondaryRowRef = useRef<HTMLDivElement>(null);
  const displayTargetId = pinnedTargetId ?? activeTargetId;

  pinnedTargetIdRef.current = pinnedTargetId;

  const resolvedSecondaryItems = visibleSecondaryItems(
    primaryItems,
    secondaryItems,
    displayTargetId
  );
  const hasContent =
    primaryItems.length > 0 || secondaryItems.length > 0 || tags.length > 0;

  const releasePinnedTarget = useCallback(() => {
    setPinnedTargetId(undefined);
  }, []);

  const handleItemSelect = useCallback(
    (item: CategoryMenuItem) => {
      if (item.targetId) {
        setPinnedTargetId(item.targetId);
      }
      onItemSelect?.(item);
    },
    [onItemSelect]
  );

  const hasActiveFilter = tags.some((tag) => tag.active);
  const isFilterActive = filterOpen || hasActiveFilter;

  const handleTagChange = useCallback(
    (item: TagFilterItem, index: number) => {
      onTagChange?.(item, index);
      setFilterOpen(false);
    },
    [onTagChange]
  );

  const handleTagClear = useCallback(() => {
    onTagClear?.();
    setFilterOpen(false);
  }, [onTagClear]);

  useEffect(() => {
    scrollRowToActiveButton(primaryRowRef.current, 'edge');
  }, [displayTargetId, primaryItems]);

  useEffect(() => {
    scrollRowToActiveButton(secondaryRowRef.current, 'padding');
  }, [displayTargetId, resolvedSecondaryItems]);

  useCategoryScrollSpy(
    primaryItems,
    onActiveTargetChange,
    pinnedTargetIdRef,
    releasePinnedTarget
  );

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
            const active = displayTargetId
              ? displayTargetId === item.targetId ||
                item.children?.some(
                  (child) => child.targetId === displayTargetId
                )
              : item.active;

            return (
              <CategoryButton
                key={item.id ?? item.label}
                active={Boolean(active)}
                onClick={() => handleItemSelect(resolvePrimaryTarget(item))}
              >
                {item.shortLabel ?? item.label}
              </CategoryButton>
            );
          })}
          {tags.length > 0 ? (
            <CategoryButton
              iconOnly
              active={isFilterActive}
              aria-label="Фильтры"
              aria-pressed={isFilterActive}
              onClick={() => setFilterOpen((open) => !open)}
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
                displayTargetId
                  ? displayTargetId === item.targetId
                  : item.active
              }
              onClick={() => handleItemSelect(item)}
            >
              {item.shortLabel ?? item.label}
            </CategoryButton>
          ))}
        </div>
      </nav>

      <ModalWrapper
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        variant="responsive"
        className="ui-category-menu__filter-modal"
        closeOutside
      >
        <TagFilter
          items={tags}
          className="ui-category-menu__filter-tags"
          onChange={handleTagChange}
          onClear={handleTagClear}
        />
      </ModalWrapper>
    </>
  );
}
