const MOBILE_MAP_ZOOM = 10.6;
const DESKTOP_MAP_ZOOM = 11.5;
const MOBILE_BREAKPOINT_PX = 601;

export function resolveAddressPickerMapZoom(): number {
  if (typeof window === 'undefined') {
    return DESKTOP_MAP_ZOOM;
  }

  return window.innerWidth < MOBILE_BREAKPOINT_PX
    ? MOBILE_MAP_ZOOM
    : DESKTOP_MAP_ZOOM;
}
