'use client';

import useMediaQuery from '@mui/material/useMediaQuery';

import {
  BREAKPOINTS,
  type ViewportMode,
} from '@src/shared/ui/foundation/breakpoints';

export function useViewportMode(): ViewportMode {
  const expanded = useMediaQuery(`(min-width: ${BREAKPOINTS.expandedMin}px)`, {
    noSsr: true,
    defaultMatches: false,
  });
  const regular = useMediaQuery(
    `(min-width: ${BREAKPOINTS.regularMin}px) and (max-width: ${BREAKPOINTS.regularMax}px)`,
    { noSsr: true, defaultMatches: false }
  );

  if (expanded) {
    return 'expanded';
  }

  if (regular) {
    return 'regular';
  }

  return 'compact';
}
