import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const router = vi.hoisted(() => ({ asPath: '/' }));
vi.mock('next/router', () => ({ useRouter: () => router }));
vi.mock('next/head', () => ({ default: ({ children }) => children }));
import Meta from '@/components/meta';

function render(props = {}) {
  return renderToStaticMarkup(React.createElement(Meta, props));
}

beforeEach(() => { router.asPath = '/'; });

describe('Open Graph в серверном HTML', () => {
  it.each(['samara', 'togliatti'])('использует абсолютный адрес конкурса %s без query и hash', (city) => {
    router.asPath = `/${city}/akcii/konkurs_otzivov?utm_source=vk#rules`;
    const html = render({ title: 'Конкурс отзывов', description: 'Условия конкурса' });
    expect(html).toContain(`property="og:url" content="https://jacofood.ru/${city}/akcii/konkurs_otzivov"`);
    expect(html).toContain(`rel="canonical" href="https://jacofood.ru/${city}/akcii/konkurs_otzivov"`);
    expect(html).toContain('property="og:image" content="https://jacofood.ru/jaco-logo.png"');
    expect(html).toContain('property="og:title" content="Конкурс отзывов"');
    expect(html).toContain('property="og:description" content="Условия конкурса"');
    expect(html).not.toContain('name="og:');
    expect(html).not.toContain('utm_source');
  });

  it.each(['/', '/samara/menu/rolly', '/togliatti/contacts', '/samara/zakazy'])('не теряет обязательные OG-поля на %s без description', (path) => {
    router.asPath = path;
    const html = render();
    for (const property of ['og:title', 'og:type', 'og:url', 'og:image']) {
      expect(html.match(new RegExp(`property="${property}" content="[^"]+"`, 'g'))).toHaveLength(1);
    }
    expect(html).toContain(`property="og:url" content="https://jacofood.ru${path}"`);
    expect(html).toContain('name="robots" content="noindex, nofollow"');
    expect(html).not.toContain('rel="canonical"');
  });

  it('сохраняет приоритет canonicalPath и noindex для закрытых страниц', () => {
    router.asPath = '/other?token=private';
    const html = render({ canonicalPath: '/SAMARA/MENU/', description: 'Меню', robots: 'noindex, nofollow' });
    expect(html).toContain('property="og:url" content="https://jacofood.ru/samara/menu"');
    expect(html).not.toContain('token');
    expect(html).not.toContain('rel="canonical"');
    expect(html).toContain('name="robots" content="noindex, nofollow"');
  });

  it('экранирует данные в метатегах', () => {
    const html = render({ title: 'Конкурс "Жако" <script>', description: 'Фото & отзывы' });
    expect(html).not.toContain('<script>');
    expect(html).toContain('property="og:title" content="Конкурс &quot;Жако&quot; &lt;script&gt;"');
    expect(html).toContain('property="og:description" content="Фото &amp; отзывы"');
  });

  it.each(['', '   ', null])('подставляет заголовок при пустом title %j', (title) => {
    expect(render({ title })).toContain('property="og:title" content="Жако роллы и пицца"');
  });
});
