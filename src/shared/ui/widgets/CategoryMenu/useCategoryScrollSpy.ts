import { useEffect, type RefObject } from 'react';
import type { CategoryMenuItem } from './CategoryMenu';

function collectScrollTargets(
  primaryItems: CategoryMenuItem[]
): CategoryMenuItem[] {
  return primaryItems.flatMap((item) =>
    item.children?.length ? item.children : [item]
  );
}

function resolveActiveTargetId(
  candidates: CategoryMenuItem[],
  marker: number
): string | undefined {
  let nextTargetId: string | undefined;
  let bestTop = Number.NEGATIVE_INFINITY;

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
    return candidates[0]?.targetId;
  }

  return nextTargetId;
}

function readScrollMarker(): number {
  const menuHeight =
    document.querySelector('.ui-category-menu')?.getBoundingClientRect()
      .height ?? 0;
  const headerHeight =
    document.getElementById('headerNew')?.getBoundingClientRect().height ?? 0;

  return headerHeight + menuHeight + 12;
}

export function useCategoryScrollSpy(
  primaryItems: CategoryMenuItem[],
  onActiveTargetChange?: (targetId: string | undefined) => void,
  pinnedTargetIdRef?: RefObject<string | undefined>,
  onPinnedArrival?: () => void
): void {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const candidates = collectScrollTargets(primaryItems);
    let frameId = 0;
    let lastScrollY = window.scrollY;

    const updateActive = (force = false) => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        frameId = 0;
        const scrollY = window.scrollY;

        if (!force && Math.abs(scrollY - lastScrollY) <= 4) {
          return;
        }

        lastScrollY = scrollY;
        const resolved = resolveActiveTargetId(candidates, readScrollMarker());
        const pinned = pinnedTargetIdRef?.current;

        if (pinned && resolved === pinned) {
          onPinnedArrival?.();
        }

        onActiveTargetChange?.(resolved);
      });
    };

    const onScroll = () => updateActive(false);
    const onResize = () => updateActive(true);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    updateActive(true);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [onActiveTargetChange, onPinnedArrival, pinnedTargetIdRef, primaryItems]);
}
