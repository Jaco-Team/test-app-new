const MENU_SELECTOR = '.ui-category-menu';
const HEADER_ID = 'headerNew';
const SCROLL_GAP = 8;

export function scrollToCategorySection(targetId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  const headerHeight =
    document.getElementById(HEADER_ID)?.getBoundingClientRect().height ?? 0;
  const menuHeight =
    document.querySelector(MENU_SELECTOR)?.getBoundingClientRect().height ?? 0;
  const top =
    target.getBoundingClientRect().top +
    window.scrollY -
    headerHeight -
    menuHeight -
    SCROLL_GAP;

  window.scrollTo({ top, behavior: 'smooth' });
}
