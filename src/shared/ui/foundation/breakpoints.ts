export const breakpointValues = {
  xs: 0,
  sm: 668,
  md: 991,
  lg: 1200,
  xl: 1536,
} as const;

export const viewportRanges = {
  compact: { min: 320, max: breakpointValues.sm - 1 },
  regular: { min: breakpointValues.sm, max: breakpointValues.md - 1 },
  expanded: { min: breakpointValues.md },
} as const;

/** Синхронно с legacy `utils/breakpoints.js` и `docs/tablet-adaptation-guide.md`. */
export const BREAKPOINTS = {
  compactMin: viewportRanges.compact.min,
  compactMax: viewportRanges.compact.max,
  regularMin: viewportRanges.regular.min,
  regularMax: viewportRanges.regular.max,
  expandedMin: viewportRanges.expanded.min,
} as const;

export type ViewportMode = keyof typeof viewportRanges;

export function getViewportMode(width: number): ViewportMode {
  const safeWidth = Number(width) || 0;

  if (safeWidth >= BREAKPOINTS.expandedMin) {
    return 'expanded';
  }

  if (safeWidth >= BREAKPOINTS.regularMin) {
    return 'regular';
  }

  return 'compact';
}
