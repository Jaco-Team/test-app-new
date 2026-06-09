import { cityPath } from '@src/shared/lib/sitePaths';
import type { ViewportMode } from '@src/shared/ui/foundation/breakpoints';

export type HeaderAuthRoute = 'account' | 'profile';

/** Куда ведёт иконка/пункт «Аккаунт» в шапке по брейкпоинту (parity с legacy mobile → account, desktop → profile). */
export const HEADER_AUTH_ROUTE_BY_VIEWPORT: Record<
  ViewportMode,
  HeaderAuthRoute
> = {
  compact: 'account',
  regular: 'account',
  expanded: 'profile',
};

export function headerAuthRouteForViewport(
  mode: ViewportMode
): HeaderAuthRoute {
  return HEADER_AUTH_ROUTE_BY_VIEWPORT[mode];
}

export function headerAuthHref(citySlug: string, mode: ViewportMode): string {
  return cityPath(citySlug, headerAuthRouteForViewport(mode));
}
