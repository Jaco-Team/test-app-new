import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  breadcrumbSchema,
  categoryName,
  categorySchema,
  cityTextPageSchema,
  menuSchema,
  organizationSchema,
  restaurantSchema,
  schemaGraph,
  storageConditionsSchema,
  webPageSchema,
  websiteSchema,
} from '@/utils/structuredData';
import { initialCatalog } from '@/utils/initialCatalog';
import { buildLlmsFull, buildLlmsIndex } from '@/utils/llmsText';

const catalog = {
  main_cat: [{ id: 1, name: 'Роллы', link: 'rolly', main_link: 'rolly' }],
  items: [
    {
      id: 4,
      name: 'Сеты',
      link: 'sety',
      main_id: 1,
      main_link: 'rolly',
      items: [
        {
          id: 221,
          name: 'Мадейра сет',
          tmp_desc: 'Цезарь с курицей, Коралл',
          marc_desc: '',
          marc_desc_full: 'длинное описание',
          weight: '1115',
          count_part: '32',
          count_part_new: '4 ролла',
          size_pizza: '0',
          price: '1399',
          link: 'Madeira_set',
          img_app: 'Madeira_set',
          cat_id: '4',
          cat_name: 'Сеты',
          is_new: '0',
          is_hit: '1',
          is_updated: '0',
          tags: '[2, 1, 9]',
        },
      ],
    },
    {
      id: 14,
      name: 'Пицца',
      link: 'pizza',
      main_id: 14,
      main_link: 'pizza',
      items: [
        {
          id: 300,
          name: 'Пепперони',
          tmp_desc: 'краст, сыр моцарелла',
          weight: '520',
          size_pizza: '35',
          price: '679',
          cat_id: '14',
          kkal: '260',
          protein: '11,5',
          fat: '9,0',
          carbohydrates: '31,2',
        },
      ],
    },
  ],
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('разметка для ИИ-ботов', () => {
  it('собирает несколько сущностей страницы в один @graph без пустых узлов', () => {
    const graph = schemaGraph(
      organizationSchema({}, { description: 'Доставка роллов и пиццы' }),
      null,
      websiteSchema({})
    );

    expect(graph['@graph'].map((node) => node['@type'])).toEqual([
      'Organization',
      'WebSite',
    ]);
    expect(graph['@graph'][0]['@context']).toBeUndefined();
    expect(graph['@graph'][0].description).toBe('Доставка роллов и пиццы');
    expect(graph['@graph'][1].publisher['@id']).toBe(graph['@graph'][0]['@id']);
    expect(schemaGraph(null, undefined)).toBeNull();
  });

  it('строит хлебные крошки от города до страницы', () => {
    const crumbs = breadcrumbSchema('samara', [
      { name: 'Меню', path: '/menu' },
      { name: 'Пицца', path: '/menu/pizza' },
    ]);

    expect(crumbs.itemListElement.map((item) => item.item)).toEqual([
      'https://jacofood.ru/samara',
      'https://jacofood.ru/samara/menu',
      'https://jacofood.ru/samara/menu/pizza',
    ]);
    expect(crumbs.itemListElement[2].position).toBe(3);
    expect(breadcrumbSchema('moscow', [{ name: 'Меню', path: '/menu' }])).toBeNull();
    expect(breadcrumbSchema('samara', [{ name: '', path: '/menu' }])).toBeNull();
  });

  it('размечает страницу-картинку по заголовку и описанию, не выдумывая текст статьи', () => {
    const page = {
      page_h: 'Памятка по сохранению здоровья',
      description: 'Заботимся о здоровье клиентов',
      content: '<p><img src="data:image/jpeg;base64,AAAA"></p>',
      date_time_update: '2026-02-18 00:00:00',
    };
    const schema = cityTextPageSchema(
      'samara',
      'pamiatka_po_sohraneniiu_zdorovia',
      page,
      'article'
    );
    const types = schema['@graph'].map((node) => node['@type']);

    expect(types).toEqual(['WebPage', 'BreadcrumbList']);
    expect(schema['@graph'][0].url).toBe(
      'https://jacofood.ru/samara/pamiatka_po_sohraneniiu_zdorovia'
    );
    expect(schema['@graph'][0].dateModified).toBe('2026-02-18');
    expect(webPageSchema('samara', 'about', {}, 'AboutPage')).toBeNull();
  });

  it('использует адрес своей страницы для статьи с текстом', () => {
    const schema = cityTextPageSchema(
      'togliatti',
      'novaya_statya',
      { page_h: 'Статья', content: '<p>Текст статьи.</p>' },
      'article'
    );
    const article = schema['@graph'].find((node) => node['@type'] === 'Article');

    expect(article.url).toBe('https://jacofood.ru/togliatti/novaya_statya');
    expect(article.articleBody).toBe('Текст статьи.');
  });

  it('превращает таблицу условий хранения в список, склеивая строки одного продукта', () => {
    const page = {
      page_h: 'Сроки годности и условия хранения готовых блюд',
      content: `<table><tbody>
        <tr><td><p>Продукция</p></td><td>Сроки годности и условия хранения</td></tr>
        <tr><td rowspan="2">Роллы в ассортименте</td><td>(4 ± 2) °C, срок хранения 24 часа</td></tr>
        <tr><td>(18 ± 5) °C, срок хранения не более 3 часов</td></tr>
        <tr><td>Салаты</td><td>(4 ± 2) °C, срок хранения 12 часов</td></tr>
      </tbody></table>`,
    };
    const list = storageConditionsSchema('samara', 'sroki', page);

    expect(list.numberOfItems).toBe(2);
    expect(list.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Роллы в ассортименте',
      description:
        '(4 ± 2) °C, срок хранения 24 часа; (18 ± 5) °C, срок хранения не более 3 часов',
    });
    expect(storageConditionsSchema('samara', 'sroki', { content: '<p>Без таблицы</p>' })).toBeNull();

    const graph = cityTextPageSchema('samara', 'sroki', page, 'storage');
    expect(graph['@graph'].map((node) => node['@type'])).toEqual([
      'WebPage',
      'ItemList',
      'BreadcrumbList',
    ]);
  });

  it('добавляет блюду вес и фото, а КБЖУ пересчитывает со 100 г на всё блюдо', () => {
    vi.stubEnv('NEXT_PUBLIC_YANDEX_IMG', 'https://mainimg.jacofood.ru/');
    const sety = categorySchema('samara', 'sety', catalog).hasMenuSection[0]
      .hasMenuItem[0];
    const pizza = categorySchema('samara', 'pizza', catalog).hasMenuSection[0]
      .hasMenuItem[0];

    expect(sety.image).toBe('https://mainimg.jacofood.ru/Madeira_set_585x585.jpg');
    expect(sety.nutrition).toEqual({
      '@type': 'NutritionInformation',
      servingSize: '1115 г',
    });
    expect(sety.url).toBeUndefined();
    expect(pizza.image).toBeUndefined();
    // 520 г: 260 ккал и 11,5 г белка на 100 г → 1352 ккал и 59,8 г на пиццу.
    expect(pizza.nutrition).toEqual({
      '@type': 'NutritionInformation',
      servingSize: '520 г',
      calories: '1352 ккал',
      proteinContent: '59.8 г',
      fatContent: '46.8 г',
      carbohydrateContent: '162.2 г',
    });
    expect(categoryName(catalog, 'sety')).toBe('Сеты');
  });

  it('на странице меню размечает все блюда, а в ресторане — кафе города', () => {
    const menu = menuSchema('samara', [{ name: 'Роллы', link: 'rolly' }], catalog);
    expect(menu.hasMenuSection.map((section) => section.name)).toEqual([
      'Сеты',
      'Пицца',
    ]);

    const restaurant = restaurantSchema(
      'samara',
      [
        {
          id: 7,
          addr: 'Молодёжная 2',
          phone: '8 (846) 300-46-53',
          xy_point: '{"latitude": 53.257403, "longitude": 50.220226}',
        },
      ],
      {}
    );
    expect(restaurant.department).toHaveLength(1);
    expect(restaurant.department[0].address.streetAddress).toBe('Молодёжная 2');
    expect(restaurant.department[0].geo.latitude).toBe(53.257403);
    expect(restaurant.potentialAction.target).toBe(
      'https://jacofood.ru/samara/menu'
    );
    expect(restaurant.openingHoursSpecification).toBeUndefined();
  });
});

describe('каталог для серверной отрисовки', () => {
  it('отдаёт карточкам только нужные поля и разделы своей категории', () => {
    const all = initialCatalog(catalog);
    const pizza = initialCatalog(catalog, 'pizza');
    const rolly = initialCatalog(catalog, 'rolly');

    expect(all).toHaveLength(2);
    expect(pizza.map((section) => section.link)).toEqual(['pizza']);
    expect(rolly.map((section) => section.link)).toEqual(['sety']);
    expect(all[0].items[0].tags).toEqual([2, 1, 9]);
    expect(all[0].items[0].marc_desc_full).toBeUndefined();
    expect(all[0].items[0].price).toBe('1399');
    expect(initialCatalog(null)).toEqual([]);
  });
});

describe('llms.txt', () => {
  const cities = [
    {
      slug: 'samara',
      name: 'Самара',
      page: { description: 'Роллы и пицца с доставкой' },
      catalog,
      links: { link_allergens: 'https://storage.yandexcloud.net/site-other-data/jaco.pdf' },
      points: [
        { id: 7, addr: 'Молодёжная 2', phone: '8 (846) 300-46-53' },
        { id: 7, addr: 'Молодёжная 2', phone: '8 (846) 300-46-53' },
      ],
    },
  ];

  it('перечисляет разделы города, справочные страницы и кафе', () => {
    const text = buildLlmsIndex(cities);

    expect(text.startsWith('# Жако — роллы и пицца\n')).toBe(true);
    expect(text).toContain('## Самара');
    expect(text).toContain('- [Пицца](https://jacofood.ru/samara/menu/pizza): 1 поз.');
    expect(text).toContain(
      '- [Сроки годности и условия хранения готовых блюд](https://jacofood.ru/samara/sroki_godnosti_i_usloviia_hraneniia_gotovyh_bliud)'
    );
    expect(text).toContain('(https://storage.yandexcloud.net/site-other-data/jaco.pdf)');
    expect(text.match(/Молодёжная 2/g)).toHaveLength(1);
    expect(text).toContain('https://jacofood.ru/llms-full.txt');
  });

  it('в полном меню указывает цену, размер, вес и состав', () => {
    const text = buildLlmsFull(cities);

    expect(text).toContain('### Пицца');
    expect(text).toContain(
      '- Пепперони — 679 ₽; 35 см, 520 г. Состав: краст, сыр моцарелла. На 100 г: 260 ккал, белки 11,5 г, жиры 9,0 г, углеводы 31,2 г'
    );
    expect(text).toContain('- Мадейра сет — 1399 ₽; 4 ролла, 1115 г. Состав: Цезарь с курицей, Коралл');
  });
});
