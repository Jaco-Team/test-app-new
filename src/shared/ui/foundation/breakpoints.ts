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

export type ViewportMode = keyof typeof viewportRanges;
