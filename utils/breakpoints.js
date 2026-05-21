export const BREAKPOINTS = {
  mobileMin: 320,
  mobileMax: 667,
  tabletMin: 668,
  tabletMax: 990,
  desktopMin: 991,
};

export const LEGACY_BREAKPOINTS = {
  mobileMax: 800,
};

export function getDeviceMode(width) {
  const safeWidth = Number(width) || 0;

  if (safeWidth >= BREAKPOINTS.desktopMin) {
    return 'desktop';
  }

  if (safeWidth >= BREAKPOINTS.tabletMin) {
    return 'tablet';
  }

  return 'mobile';
}

export function getViewportFlags(width) {
  const safeWidth = Number(width) || 0;
  const mode = getDeviceMode(width);

  return {
    mode,
    isMobile: mode === 'mobile',
    isTablet: mode === 'tablet',
    isDesktop: mode === 'desktop',
    legacyMobile: safeWidth <= LEGACY_BREAKPOINTS.mobileMax,
  };
}
