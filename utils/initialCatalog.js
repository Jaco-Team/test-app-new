import { catalogSectionsFor } from './structuredData';

// Поля, которые нужны карточке товара и фильтру каталога.
const ITEM_FIELDS = [
  'id',
  'name',
  'tmp_desc',
  'marc_desc',
  'size_pizza',
  'count_part',
  'count_part_new',
  'weight',
  'price',
  'link',
  'img_app',
  'cat_id',
  'cat_name',
  'is_new',
  'is_hit',
  'is_updated',
];

function tagList(tags) {
  if (Array.isArray(tags)) return tags;
  if (typeof tags !== 'string') return [];
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Каталог для первой (серверной) отрисовки карточек.
 *
 * Карточки берут данные из стора, который заполняется только в браузере, поэтому
 * без этих пропсов в HTML нет ни названий, ни состава, ни цен — их не видят боты
 * без JavaScript. slug — категория страницы; пустой — весь каталог.
 */
export function initialCatalog(catalog, slug = '') {
  return catalogSectionsFor(catalog, slug)
    .map((section) => ({
      id: section?.id ?? '',
      name: section?.name ?? '',
      main_id: section?.main_id ?? '',
      main_link: section?.main_link ?? '',
      link: section?.link ?? '',
      items: (Array.isArray(section?.items) ? section.items : [])
        .filter((item) => item && item.id != null && item.name)
        .map((item) => {
          const card = {};
          for (const field of ITEM_FIELDS) card[field] = item[field] ?? '';
          card.tags = tagList(item.tags);
          return card;
        }),
    }))
    .filter((section) => section.items.length > 0);
}
