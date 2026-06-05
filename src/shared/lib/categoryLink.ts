import type { CatalogCategory } from '@src/entities/catalog';
import type { HeaderNavItem } from '@ui/widgets/Header/Header';

export function normalizeCategoryLink(value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return '';
  }

  const withoutHash = raw.split('#')[0];
  const withoutQuery = withoutHash.split('?')[0];
  const withoutOrigin = withoutQuery.replace(/^https?:\/\/[^/]+/i, '');
  const withoutLeadingSlash = withoutOrigin.replace(/^\/+/, '');
  const withoutCityMenu = withoutLeadingSlash
    .replace(/^[^/]+\/menu\//i, '')
    .replace(/^menu\//i, '');
  const segment = withoutCityMenu.split('/').filter(Boolean).pop() || '';

  try {
    return decodeURIComponent(segment).toLowerCase();
  } catch {
    return segment.toLowerCase();
  }
}

function categoryTargetId(id: string | number | undefined): string | undefined {
  if (id === undefined || id === null || String(id).trim().length === 0) {
    return undefined;
  }

  return 'cat' + String(id);
}

export function findCategoryTargetIdByLink(
  categories: CatalogCategory[],
  categoryLink: string
): string | undefined {
  const normalizedTarget = normalizeCategoryLink(categoryLink);

  if (!normalizedTarget) {
    return undefined;
  }

  for (const mainCategory of categories) {
    for (const childCategory of mainCategory.cats ?? []) {
      if (normalizeCategoryLink(childCategory.link) === normalizedTarget) {
        return categoryTargetId(childCategory.id);
      }
    }

    if (normalizeCategoryLink(mainCategory.link) === normalizedTarget) {
      return categoryTargetId(mainCategory.id);
    }
  }

  return undefined;
}

export function findHeaderCategoryTargetIdByLink(
  navItems: HeaderNavItem[],
  categoryLink: string
): string | undefined {
  const normalizedTarget = normalizeCategoryLink(categoryLink);

  if (!normalizedTarget) {
    return undefined;
  }

  for (const item of navItems) {
    for (const child of item.children ?? []) {
      if (normalizeCategoryLink(child.link) === normalizedTarget) {
        return categoryTargetId(child.id);
      }
    }

    if (normalizeCategoryLink(item.link) === normalizedTarget) {
      return categoryTargetId(item.id);
    }
  }

  return undefined;
}
