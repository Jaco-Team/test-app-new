import type { CatalogCategory } from '@src/entities/catalog';
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
  const activeLink = String(activeCategoryLink ?? '').trim();

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
        href: categoryHref(citySlug, String(child.link ?? '')),
      });
    }

    const hasChildren = children.length > 0;
    const isActive =
      activePage === 'home' &&
      (activeLink
        ? activeLink === link
        : categories[0]?.link === cat.link || categories[0]?.id === cat.id);

    return {
      label,
      href: hasChildren ? undefined : categoryHref(citySlug, link),
      active: isActive,
      children: hasChildren ? children : undefined,
    };
  });

  if (navFromCatalog.length === 0) {
    return [
      {
        label: 'Роллы',
        href: categoryHref(citySlug, 'rolly'),
        active: true,
      },
      { label: 'Пицца', href: categoryHref(citySlug, 'pizza') },
      { label: 'Блюда', href: categoryHref(citySlug, 'bluda') },
      {
        label: 'Акции',
        href: cityPath(citySlug, 'akcii'),
        active: activePage === 'akcii',
      },
    ];
  }

  return [
    ...navFromCatalog,
    {
      label: 'Акции',
      href: cityPath(citySlug, 'akcii'),
      active: activePage === 'akcii',
    },
  ];
}

export type HeaderDrawerLink = {
  label: string;
  href?: string;
  active?: boolean;
  button?: boolean;
};

export function buildHeaderDrawerLinks(
  citySlug: string,
  cityLabel: string,
  activePage = 'home'
): HeaderDrawerLink[] {
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
