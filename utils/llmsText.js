// Тексты /llms.txt и /llms-full.txt: карта сайта и меню для ИИ-ассистентов.
// Формат — llmstxt.org (Markdown). Все факты берутся из API; чего в API нет, не выдумываем.

const SITE = 'https://jacofood.ru';

const clean = (value) => String(value ?? '').trim();

function plain(html) {
  return clean(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|thinsp);/gi, ' ')
    .replace(/&laquo;/gi, '«')
    .replace(/&raquo;/gi, '»')
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// Markdown-ссылка: квадратные скобки в тексте ломают разметку.
const link = (text, href, note = '') =>
  `- [${clean(text).replace(/[[\]]/g, '')}](${href})${note ? `: ${note}` : ''}`;

function sections(catalog) {
  return (Array.isArray(catalog?.items) ? catalog.items : [])
    .map((section) => ({
      name: clean(section?.name),
      link: clean(section?.link),
      items: (Array.isArray(section?.items) ? section.items : []).filter(
        (item) => clean(item?.name) && Number(item?.price) > 0
      ),
    }))
    .filter((section) => section.name && section.link && section.items.length);
}

function points(list) {
  const unique = new Map();
  for (const point of Array.isArray(list) ? list : []) {
    if (clean(point?.addr) && clean(point?.phone)) {
      unique.set(String(point.id ?? point.addr), point);
    }
  }
  return [...unique.values()];
}

function itemLine(item) {
  const weight = Number(item?.weight);
  const catId = Number(item?.cat_id);
  const facts = [];
  if (catId === 14 && Number(item?.size_pizza) > 0) {
    facts.push(`${Number(item.size_pizza)} см`);
  } else if (clean(item?.count_part_new)) {
    facts.push(clean(item.count_part_new));
  } else if (Number(item?.count_part) > 1) {
    facts.push(`${Number(item.count_part)} шт.`);
  }
  if (Number.isFinite(weight) && weight > 0) {
    facts.push(`${weight} ${catId === 6 ? 'л' : 'г'}`);
  }
  const description = plain(item?.tmp_desc || item?.marc_desc);
  return (
    `- ${clean(item.name)} — ${Number(item.price)} ₽` +
    (facts.length ? `; ${facts.join(', ')}` : '') +
    (description ? `. Состав: ${description}` : '') +
    nutritionNote(item)
  );
}

// КБЖУ приходят на 100 г — в тексте так и подписываем.
function nutritionNote(item) {
  const number = (value) => Number(clean(value).replace(',', '.'));
  const kkal = number(item?.kkal);
  if (!Number.isFinite(kkal) || kkal <= 0) return '';
  const macro = (label, value) =>
    Number.isFinite(number(value)) ? `, ${label} ${clean(value)} г` : '';
  return (
    `. На 100 г: ${kkal} ккал` +
    macro('белки', item?.protein) +
    macro('жиры', item?.fat) +
    macro('углеводы', item?.carbohydrates)
  );
}

const INFO_PAGES = [
  ['dostavka', 'Доставка', 'условия, стоимость, зоны и время доставки'],
  ['contacts', 'Контакты', 'адреса кафе, телефоны, график работы'],
  ['akcii', 'Акции и промокоды', 'действующие предложения'],
  [
    'sroki_godnosti_i_usloviia_hraneniia_gotovyh_bliud',
    'Сроки годности и условия хранения готовых блюд',
    'температура и срок хранения по видам блюд',
  ],
  ['instpayorders', 'Правила оплаты', 'способы оплаты и возврат'],
  ['about', 'О компании', ''],
  ['publichnaya-oferta', 'Публичная оферта', ''],
  ['politika-konfidencialnosti', 'Политика конфиденциальности', ''],
];

/**
 * cities: [{ slug, name, page, catalog, points, links }]
 *   page — CMS-страница города (description), links — соцсети и PDF с составом и КБЖУ.
 */
export function buildLlmsIndex(cities) {
  const list = (Array.isArray(cities) ? cities : []).filter(
    (city) => clean(city?.slug) && clean(city?.name)
  );
  const names = list.map((city) => city.name).join(' и ');
  const out = [
    '# Жако — роллы и пицца',
    '',
    `> Сеть кафе и доставка роллов и пиццы: ${names}. Заказ оформляется на сайте ${SITE}; меню, цены и акции у каждого города свои.`,
    '',
    'Цены и состав блюд на сайте актуальны на момент запроса; перед ответом о стоимости сверяйтесь со страницей меню города.',
  ];

  for (const city of list) {
    const base = `${SITE}/${city.slug}`;
    const description = plain(city?.page?.description);
    out.push('', `## ${city.name}`, '');
    if (description) out.push(description, '');
    out.push(link('Меню', `${base}/menu`, 'все блюда с составом, весом и ценами'));
    for (const section of sections(city.catalog)) {
      out.push(
        link(
          section.name,
          `${base}/menu/${encodeURIComponent(section.link)}`,
          `${section.items.length} поз.`
        )
      );
    }
    for (const [slug, title, note] of INFO_PAGES) {
      out.push(link(title, `${base}/${slug}`, note));
    }
    const allergens = clean(city?.links?.link_allergens);
    if (/^https:\/\//i.test(allergens)) {
      out.push(link('Калорийность, состав, БЖУ и аллергены (PDF)', allergens));
    }
    const cafes = points(city.points);
    if (cafes.length) {
      out.push('', `Кафе в городе ${city.name}:`);
      for (const cafe of cafes) {
        out.push(`- ${clean(cafe.addr)} — ${clean(cafe.phone)}`);
      }
    }
  }

  out.push(
    '',
    '## Optional',
    '',
    link(
      'Полное меню всех городов с ценами одним файлом',
      `${SITE}/llms-full.txt`
    ),
    link('Карта сайта (XML)', `${SITE}/sitemap.xml`),
    ''
  );
  return out.join('\n');
}

export function buildLlmsFull(cities) {
  const list = (Array.isArray(cities) ? cities : []).filter(
    (city) => clean(city?.slug) && clean(city?.name)
  );
  const out = [
    '# Жако — полное меню',
    '',
    `> Все блюда сети «Жако» с ценами, весом и составом по городам. Источник — ${SITE}; цены в рублях.`,
  ];
  for (const city of list) {
    out.push('', `## ${city.name}`, '', `Меню на сайте: ${SITE}/${city.slug}/menu`);
    for (const section of sections(city.catalog)) {
      out.push('', `### ${section.name}`, '');
      for (const item of section.items) out.push(itemLine(item));
    }
  }
  out.push('');
  return out.join('\n');
}
