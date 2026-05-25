import { RefObject, useEffect } from 'react';

type PointerLikeEvent = MouseEvent | TouchEvent | PointerEvent;

export function useClickOutside<T extends HTMLElement>(
  refs: RefObject<T | null> | Array<RefObject<T | null>>,
  onClickOutside: (event: PointerLikeEvent) => void,
  active = true
): void {
  useEffect(() => {
    if (!active || typeof document === 'undefined') {
      return;
    }

    const watchedRefs = Array.isArray(refs) ? refs : [refs];

    const handlePointerDown = (event: PointerLikeEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      const clickedInside = watchedRefs.some((ref) => {
        const node = ref.current;
        return node ? node.contains(target) : false;
      });

      if (!clickedInside) {
        onClickOutside(event);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [active, onClickOutside, refs]);
}
