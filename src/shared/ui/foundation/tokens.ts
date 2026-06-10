export const colorTokens = {
  brand: '#dd1a32',
  brandHover: '#c7172d',
  brandActive: '#b11528',
  text: 'rgba(0, 0, 0, 0.8)',
  textMuted: 'rgba(0, 0, 0, 0.6)',
  textSubtle: 'rgba(0, 0, 0, 0.45)',
  surface: '#ffffff',
  surfaceMuted: '#f7f7f7',
  border: 'rgba(0, 0, 0, 0.2)',
  disabled: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.42)',
} as const;

export const radiusTokens = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const zIndexTokens = {
  header: 1200,
  overlay: 1300,
  modal: 1400,
  toast: 1500,
} as const;

export const transitionTokens = {
  fast: '120ms ease',
  base: '180ms ease',
  slow: '260ms ease',
} as const;

/** Legacy JACO switch palette (`ui/MySwitch.js`, `ui/Switch.js`). */
export const switchTokens = {
  trackOff: '#e9e9ea',
  trackOffAddress: 'rgba(221, 26, 50, 0.3)',
  trackOn: '#57dc35',
  trackOnNeutral: 'rgba(0, 0, 0, 0.7)',
  thumb: '#ffffff',
  disabledOpacity: 0.5,
  transitionMs: 300,
} as const;
