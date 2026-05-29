// Видимость H2-заголовков категорий на каталожных страницах.
// H2 — это названия категорий (приходят с сервера); заголовки нужны там,
// где на странице несколько блоков меню.

const CATEGORY_HEADINGS_LINKS = new Set(['', 'menu', 'rolly']);

function normalizeLink(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

// Нужны ли на странице H2-заголовки категорий.
export function shouldShowCategoryHeadings(categoryLink) {
  return CATEGORY_HEADINGS_LINKS.has(normalizeLink(categoryLink));
}
