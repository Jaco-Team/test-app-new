import { cityPath } from './sitePaths';

export type FooterLinkGroup = {
  title: string;
  items: { label: string; href: string }[];
};

export type FooterSocialLink = {
  label: string;
  href: string;
};

function defaultFooterGroups(citySlug: string): FooterLinkGroup[] {
  return [
    {
      title: 'Жако',
      items: [
        { label: 'О компании', href: cityPath(citySlug, 'about') },
        {
          label: 'Реквизиты',
          href: cityPath(citySlug, 'company-details'),
        },
        { label: 'Контакты', href: cityPath(citySlug, 'contacts') },
      ],
    },
    {
      title: 'Документы',
      items: [
        {
          label: 'Публичная оферта',
          href: cityPath(citySlug, 'publichnaya-oferta'),
        },
        {
          label: 'Политика конфиденциальности',
          href: cityPath(citySlug, 'politika-konfidencialnosti'),
        },
        {
          label: 'Согласие на обработку персональных данных',
          href: cityPath(citySlug, 'legal'),
        },
        {
          label: 'Политика в отношении обработки метрических данных',
          href: cityPath(citySlug, 'politika-legal'),
        },
        {
          label: 'Правила оплаты',
          href: cityPath(citySlug, 'instpayorders'),
        },
        { label: 'Карта сайта', href: cityPath(citySlug, 'sitemap') },
      ],
    },
    {
      title: 'Работа в жако',
      items: [{ label: 'Вакансии', href: cityPath(citySlug, 'jobs') }],
    },
    {
      title: 'Франшиза',
      items: [
        { label: 'Сайт франшизы', href: 'https://franchise.jacofood.ru' },
        { label: 'Сайт для инвестиций', href: 'https://invest.jacofood.ru' },
      ],
    },
  ];
}

export function mapFooterSocialLinks(
  links: Record<string, unknown>
): FooterSocialLink[] {
  const defs: { key: string; label: string }[] = [
    { key: 'link_vk', label: 'VK' },
    { key: 'link_tg', label: 'Telegram' },
    { key: 'link_ok', label: 'OK' },
    { key: 'link_rt', label: 'RuTube' },
  ];

  return defs
    .map(({ key, label }) => {
      const href = links?.[key];
      if (typeof href !== 'string' || !href.trim()) {
        return null;
      }
      return { label, href };
    })
    .filter((item): item is FooterSocialLink => Boolean(item));
}

export function mapFooterLinks(
  citySlug: string,
  links: Record<string, unknown>
): FooterLinkGroup[] {
  const groups = defaultFooterGroups(citySlug);
  const allergenHref = links?.link_allergens;

  if (typeof allergenHref !== 'string' || !allergenHref.trim()) {
    return groups;
  }

  const docsGroup = groups.find((group) => group.title === 'Документы');
  if (!docsGroup) {
    return groups;
  }

  return groups.map((group) =>
    group.title === 'Документы'
      ? {
          ...group,
          items: [
            {
              label: 'Калорийность, состав, БЖУ',
              href: allergenHref,
            },
            ...group.items,
          ],
        }
      : group
  );
}
