import Image from 'next/image';
import Link from 'next/link';

import { api } from '@/components/api';
import Meta from '@/components/meta';
import { roboto } from '@/ui/Font';

import styles from './index.module.scss';

const FALLBACK_PAGE = {
  title: 'Жако — доставка роллов и пиццы в Самаре и Тольятти',
  description:
    'Жако — доставка роллов и пиццы в Самаре и Тольятти. Выберите город, чтобы открыть актуальное меню, узнать условия доставки и посмотреть акции.',
  page_h: 'Выберите город доставки',
  content:
    '<p>Мы доставляем роллы и пиццу в Самаре и Тольятти. Выберите город, чтобы увидеть актуальное меню, цены, акции и условия доставки.</p>',
};

const cities = [
  {
    name: 'Тольятти',
    href: '/togliatti',
    description: 'Открыть меню и условия доставки в Тольятти',
  },
  {
    name: 'Самара',
    href: '/samara',
    description: 'Открыть меню и условия доставки в Самаре',
  },
];

const getPageField = (page, field) => {
  const value = String(page?.[field] ?? '').trim();

  return value || FALLBACK_PAGE[field];
};

export default function CitySelectionPage({ page }) {
  const title = getPageField(page, 'title');
  const description = getPageField(page, 'description');
  const heading = getPageField(page, 'page_h');
  const content = getPageField(page, 'content');

  return (
    <>
      <Meta title={title} description={description} canonicalPath="/" />

      <main className={`${styles.page} ${roboto.variable}`}>
        <section
          className={styles.panel}
          aria-labelledby="city-selection-title"
        >
          <Image
            className={styles.logo}
            src="/Jaco-Logo-PC.png"
            width={250}
            height={60}
            priority
            alt="Жако"
          />

          <div className={styles.intro}>
            <p className={styles.eyebrow}>Доставка роллов и пиццы</p>
            <h1 id="city-selection-title">{heading}</h1>
            <div
              className={styles.description}
              data-testid="city-selection-description"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          <nav className={styles.cityList} aria-label="Выбор города">
            {cities.map((city) => (
              <Link
                className={styles.cityLink}
                href={city.href}
                key={city.href}
              >
                <span className={styles.cityName}>{city.name}</span>
                <span className={styles.cityDescription}>
                  {city.description}
                </span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </nav>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps({ res }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=60'
  );

  const data = await api('home', {
    type: 'get_page_info',
    city_id: -1,
    page: '/',
  });
  const page = data?.page && typeof data.page === 'object' ? data.page : null;

  return {
    props: {
      page,
    },
  };
}
