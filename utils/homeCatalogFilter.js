export function hasActiveHomeCatalogFilter({
  badge_filter = '',
  tag_filter = '',
  text_filter = '',
} = {}) {
  return badge_filter !== '' || tag_filter !== '' || text_filter !== '';
}

export function isHomeCatalogItemVisible(
  item,
  { badge_filter = '', tag_filter = '', text_filter = '' } = {}
) {
  if (!item) {
    return false;
  }

  if (badge_filter !== '') {
    const badgeId = parseInt(badge_filter, 10);

    if (badgeId === 2 && parseInt(item.is_new, 10) !== 1) {
      return false;
    }

    if (badgeId === 1 && parseInt(item.is_hit, 10) !== 1) {
      return false;
    }
  }

  if (tag_filter !== '') {
    const tagId = Number(tag_filter);

    if (!Array.isArray(item.tags) || !item.tags.includes(tagId)) {
      return false;
    }
  }

  if (text_filter !== '') {
    const name = String(item.name || '').toLowerCase();
    const query = String(text_filter).toLowerCase();

    if (!name.includes(query)) {
      return false;
    }
  }

  return true;
}
