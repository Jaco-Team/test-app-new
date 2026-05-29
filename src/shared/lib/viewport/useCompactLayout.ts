'use client';

import useMediaQuery from '@mui/material/useMediaQuery';

import { BREAKPOINTS } from '@src/shared/ui/foundation/breakpoints';

/**
 * Компактная раскладка (мобильные карточки, drawer-модалки, burger-header): только ≤667px.
 * Планшет (668–990) использует PC-разметку с `ui-fluid-regular`.
 */
export function useCompactLayout() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.compactMax}px)`, {
    noSsr: true,
  });
}
