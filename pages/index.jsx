import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Cookies from 'js-cookie';

import { api } from '@/components/api';
import Meta from '@/components/meta';
import { roboto } from '@/ui/Font';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/utils/browserStorage';

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
    link: 'togliatti',
    href: '/togliatti',
    description: 'Открыть меню и условия доставки в Тольятти',
  },
  {
    name: 'Самара',
    link: 'samara',
    href: '/samara',
    description: 'Открыть меню и условия доставки в Самаре',
  },
];

const getPageField = (page, field) => {
  const value = String(page?.[field] ?? '').trim();

  return value || FALLBACK_PAGE[field];
};

export default function CitySelectionPage({ page }) {
  const [showCookieNotice, setShowCookieNotice] = useState(false);
  const title = getPageField(page, 'title');
  const description = getPageField(page, 'description');
  const heading = getPageField(page, 'page_h');
  const content = getPageField(page, 'content');

  useEffect(() => {
    setShowCookieNotice(!getLocalStorageItem('setCookie'));
  }, []);

  const saveCity = (city) => {
    setLocalStorageItem(
      'setCity',
      JSON.stringify({ name: city.name, link: city.link })
    );
    Cookies.set('city', city.link, {
      expires: 365,
      path: '/',
      sameSite: 'Lax',
    });
  };

  const acceptCookies = () => {
    setLocalStorageItem('setCookie', true);
    setShowCookieNotice(false);
  };

  return (
    <>
      <Meta title={title} description={description} canonicalPath="/" />

      <main
        className={`${styles.page} ${
          showCookieNotice ? styles.pageWithCookieNotice : ''
        } ${roboto.variable}`}
      >
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
                onClick={() => saveCity(city)}
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

      {showCookieNotice ? (
        <aside
          className={`${styles.cookieNotice} ${roboto.variable}`}
          aria-label="Информация об использовании cookie"
          data-testid="cookie-notice"
        >
          <p>
            Мы <Link href="/togliatti/politika-legal">используем</Link> файлы
            «Cookie» и метрическую систему «Яндекс.Метрика» для сбора и анализа
            информации о производительности и использовании сайта. Продолжая
            пользоваться сайтом, вы соглашаетесь на размещение файлов «Cookie» и
            обработку данных метрических систем.
          </p>
          <button type="button" onClick={acceptCookies}>
            Согласен
          </button>
        </aside>
      ) : null}
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
