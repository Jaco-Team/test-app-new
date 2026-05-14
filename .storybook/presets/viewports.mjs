/**
 * Вьюпорты Storybook — в соответствии с AGENTS.md:
 * Mobile 320–667, Tablet 668–990, Desktop 991+.
 * При смене границ обновить `stories/shared/styles/settings/_breakpoints.scss`.
 */

export const storybookViewports = {
  mobileMin: {
    name: 'Mobile min (320)',
    styles: { width: '320px', height: '667px' },
    type: 'mobile',
  },
  mobileMax: {
    name: 'Mobile max (667)',
    styles: { width: '667px', height: '900px' },
    type: 'mobile',
  },
  tabletMin: {
    name: 'Tablet min (668)',
    styles: { width: '668px', height: '900px' },
    type: 'tablet',
  },
  tabletMax: {
    name: 'Tablet max (990)',
    styles: { width: '990px', height: '900px' },
    type: 'tablet',
  },
  desktopMin: {
    name: 'Desktop min (991+)',
    styles: { width: '991px', height: '900px' },
    type: 'desktop',
  },
};

/** Значение по умолчанию для панели viewport. */
export const defaultViewportId = 'desktopMin';
