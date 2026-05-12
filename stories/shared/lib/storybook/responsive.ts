export const mobileGlobals = {
  viewport: {
    value: 'mobileMin',
    isRotated: false,
  },
};

export const tabletGlobals = {
  viewport: {
    value: 'tabletMin',
    isRotated: false,
  },
};

export const desktopGlobals = {
  viewport: {
    value: 'desktopMin',
    isRotated: false,
  },
};

export const responsiveStoryGlobals = {
  Mobile: mobileGlobals,
  Tablet: tabletGlobals,
  Desktop: desktopGlobals,
};

export const responsiveStoryParameters = {
  Mobile: { viewport: {} },
  Tablet: { viewport: {} },
  Desktop: { viewport: {} },
};
