import type { CatalogCategory } from '@src/entities/catalog';
import { normalizeCategoryLink } from '@src/shared/lib/categoryLink';
import { categoryHref, cityPath } from '@src/shared/lib/sitePaths';
import type { HeaderNavItem } from '@ui/widgets/Header/Header';

export type BuildHeaderNavOptions = {
  activePage?: 'home' | 'akcii' | string;
  activeCategoryLink?: string;
};

export function buildHeaderNavItems(
  citySlug: string,
  categories: CatalogCategory[],
  options: BuildHeaderNavOptions = {}
): HeaderNavItem[] {
  const { activePage = 'home', activeCategoryLink = '' } = options;
  const activeLink = normalizeCategoryLink(activeCategoryLink);

  const navFromCatalog = categories.map((cat) => {
    const label = String(cat.name ?? cat.link ?? 'Категория').trim();
    const link = String(cat.link ?? '').trim();
    const children: HeaderNavItem[] = [];
    for (const child of cat.cats ?? []) {
      const childLabel = String(child.name ?? child.link ?? '').trim();
      if (!childLabel) {
        continue;
      }
      children.push({
        label: childLabel,
        id: child.id,
        link: String(child.link ?? ''),
        href: categoryHref(citySlug, String(child.link ?? '')),
      });
    }

    const hasChildren = children.length > 0;
    const childLinks = children.map((child) =>
      normalizeCategoryLink(child.link)
    );
    const normalizedLink = normalizeCategoryLink(link);
    const isActive =
      activePage === 'home' &&
      (activeLink
        ? activeLink === normalizedLink || childLinks.includes(activeLink)
        : categories[0]?.link === cat.link || categories[0]?.id === cat.id);

    return {
      label,
      id: cat.id,
      link,
      href: categoryHref(citySlug, link),
      active: isActive,
      children: hasChildren ? children : undefined,
    };
  });

  return [
    ...navFromCatalog,
    {
      label: 'Акции',
      href: cityPath(citySlug, 'akcii'),
      active: activePage === 'akcii',
      variant: 'outlined',
    },
  ];
}

export type HeaderCompactMenuLink = {
  label: string;
  href?: string;
  active?: boolean;
  button?: boolean;
};

export function buildHeaderCompactMenuLinks(
  citySlug: string,
  cityLabel: string,
  activePage = 'home'
): HeaderCompactMenuLink[] {
  const base = cityPath(citySlug);

  return [
    { label: 'Меню', href: base, active: activePage === 'home' },
    {
      label: 'Акции',
      href: cityPath(citySlug, 'akcii'),
      active: activePage === 'akcii',
    },
    { label: cityLabel, button: true },
    {
      label: 'Адреса',
      href: cityPath(citySlug, 'contacts'),
      active: activePage === 'contacts',
    },
    {
      label: 'Жако',
      href: cityPath(citySlug, 'document'),
      active: activePage === 'document',
    },
    { label: 'Аккаунт', button: true },
    { label: 'Корзина', href: cityPath(citySlug, 'cart') },
  ];
}
