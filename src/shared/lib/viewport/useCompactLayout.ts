'use client';

import useMediaQuery from '@mui/material/useMediaQuery';

import { BREAKPOINTS } from '@src/shared/ui/foundation/breakpoints';

/**
 * Компактная раскладка (burger-header, sheet-модалки, drawer-корзина): ≤990px.
 * Только сетка каталога на regular использует `ui-product-grid`; остальной UI — как на mobile.
 */
export function useCompactLayout() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.regularMax}px)`, {
    noSsr: true,
  });
}
