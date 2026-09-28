import { describe, expect, it } from 'vitest';
import {
  articleSchema,
  categorySchema,
  contactLocationsSchema,
  deliverySchema,
  menuSchema,
  organizationSchema,
  promotionListSchema,
  promotionSchema,
  restaurantSchema,
  serializeStructuredData,
} from '@/utils/structuredData';

describe('разметка страниц Жако', () => {
  it('связывает организацию и ресторан с городом и только реальными данными', () => {
    const links = { link_vk: 'https://vk.ru/jacofood_tlt', link_tg: '' };
    const point = { addr: 'Ленинградская 47', phone: '8 (8482) 90-30-52' };
    const organization = organizationSchema(links);
    const restaurant = restaurantSchema('togliatti', [point], links);

    expect(organization.sameAs).toEqual(['https://vk.ru/jacofood_tlt']);
    expect(restaurant.branchOf['@id']).toBe(organization['@id']);
    expect(restaurant.hasMenu).toBe('https://jacofood.ru/togliatti/menu');
    expect(restaurant.openingHoursSpecification).toBeUndefined();
    expect(restaurantSchema('samara', [])).toBeNull();
  });

  it('публикует разделы и действительные цены города без карточек с отдельными URL', () => {
    const menu = menuSchema('samara', [{ name: 'Роллы', link: 'rolly' }]);
    const category = categorySchema('samara', 'rolly', {
      main_cat: [{ id: 1, name: 'Роллы', link: 'rolly' }],
      items: [
        {
          name: 'Сеты',
          link: 'sety',
          main_id: 1,
          items: [
            { name: 'Вулкан сет', price: 1449, tmp_desc: 'Горячий ролл' },
            { name: 'Нет цены', price: 0 },
          ],
        },
      ],
    });

    expect(menu.hasMenuSection[0].url).toBe(
      'https://jacofood.ru/samara/menu/rolly'
    );
    expect(category.hasMenuSection[0].hasMenuItem).toHaveLength(1);
    expect(category.hasMenuSection[0].hasMenuItem[0].offers).toEqual({
      '@type': 'Offer',
      price: 1449,
      priceCurrency: 'RUB',
    });
    expect(category.hasMenuSection[0].hasMenuItem[0].url).toBeUndefined();
  });

  it('не размечает скрытые акции и не придумывает цену', () => {
    const banners = [
      {
        link: '3_pasty',
        title: 'Паста',
        text: '<p>Три пасты по специальной цене</p>',
        is_active: 1,
        is_active_actii: 1,
        date_end: '2026-12-31',
      },
      { link: 'old', title: 'Старая', is_active: 0, is_active_actii: 1 },
    ];
    expect(promotionListSchema('samara', banners).itemListElement).toHaveLength(
      1
    );
    const offer = promotionSchema('samara', banners[0]);
    expect(offer['@type']).toBe('Offer');
    expect(offer.price).toBeUndefined();
    expect(offer.validThrough).toBe('2026-12-31');
    expect(promotionSchema('samara', banners[0], true)).toBeNull();
    expect(
      promotionSchema('samara', {
        link: 'konkurs_otzivov',
        title: 'Конкурс',
        text: '<p>Конкурс отзывов</p>',
        is_active: 1,
        is_active_actii: 1,
        date_start: '2026-01-01',
        date_end: '2026-12-31',
      })['@type']
    ).toBe('Event');
  });

  it('использует адреса точек, текст статьи и данные доставки без вымышленных полей', () => {
    const point = {
      id: 4,
      addr: 'Куйбышева 113',
      phone: '8 (846) 300-46-53',
      xy_point: { latitude: 53.189625, longitude: 50.090608 },
    };
    const locations = contactLocationsSchema('samara', [point, point]);
    expect(locations['@graph']).toHaveLength(1);
    expect(locations['@graph'][0].geo.latitude).toBe(53.189625);
    expect(locations['@graph'][0].openingHoursSpecification).toBeUndefined();

    const article = articleSchema('samara', {
      page_h: 'Памятка',
      content:
        '<p>Берегите здоровье.</p><img src="data:image/jpeg;base64,AAAA">',
      date_time_update: '2025-10-17 00:00:00',
    });
    expect(article.articleBody).toBe('Берегите здоровье.');
    expect(article.datePublished).toBeUndefined();
    expect(
      articleSchema('samara', {
        page_h: 'Памятка',
        content: '<img src="data:image/jpeg;base64,AAAA">',
      })
    ).toBeNull();
    expect(
      deliverySchema('samara', { page_h: 'Доставка в Самаре' }).offers
    ).toBeUndefined();
  });

  it('экранирует HTML при записи JSON-LD', () => {
    const serialized = serializeStructuredData({
      name: '</script><script>alert(1)</script>',
    });
    expect(serialized).not.toContain('<');
    expect(JSON.parse(serialized).name).toBe(
      '</script><script>alert(1)</script>'
    );
  });
});
