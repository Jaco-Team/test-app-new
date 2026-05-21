import useMediaQuery from '@mui/material/useMediaQuery';

import { BREAKPOINTS } from '@/utils/breakpoints';

/**
 * Мобильная раскладка блоков главной (баннер, фильтр, карточки): только при ширине <= 667px.
 * Не использовать store matches (legacy 800px).
 */
export function useHomeMobileLayout() {
  return useMediaQuery(`screen and (max-width: ${BREAKPOINTS.mobileMax}px)`);
}
