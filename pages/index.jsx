import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import Cookies from 'js-cookie';

import { api } from '@/components/api';
import Meta from '@/components/meta';
import { roboto } from '@/ui/Font';
import {
  getLocalStorageItem,
  getLocalStorageJson,
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

const saveCity = (city) => {
  setLocalStorageItem(
    'setCity',
    JSON.stringify({ name: city.name, link: city.link })
  );
  try {
    Cookies.set('city', city.link, {
      expires: 365,
      path: '/',
      sameSite: 'Lax',
    });
  } catch {
    // Запрет cookie не должен мешать переходу в меню.
  }
};

const getSavedCity = () => {
  const savedCity = getLocalStorageJson('setCity');
  const localCity = cities.find((city) => city.link === savedCity?.link);
  if (localCity) return localCity;

  try {
    return cities.find((city) => city.link === Cookies.get('city'));
  } catch {
    return undefined;
  }
};

export default function CitySelectionPage({ page, initialSearch = '' }) {
  const router = useRouter();
  const redirectAttemptedRef = useRef(false);
  const [urlSuffix, setUrlSuffix] = useState(initialSearch);
  const [showCookieNotice, setShowCookieNotice] = useState(false);
  const title = getPageField(page, 'title');
  const description = getPageField(page, 'description');
  const heading = getPageField(page, 'page_h');
  const content = getPageField(page, 'content');

  useEffect(() => {
    setShowCookieNotice(!getLocalStorageItem('setCookie'));
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    // Не пересобираем query: сохраняем кодирование, регистр и повторения.
    const suffix = window.location.search + window.location.hash;
    setUrlSuffix(suffix);
    if (redirectAttemptedRef.current) return;
    redirectAttemptedRef.current = true;

    const savedCity = getSavedCity();
    if (!savedCity) return;

    saveCity(savedCity);
    const redirect = async () => {
      try {
        await router.replace(`${savedCity.href}${suffix}`);
      } catch {
        // При ошибке навигации остаются доступными ссылки выбора города.
      }
    };
    void redirect();
  }, [router.isReady, router.asPath, router.replace]);

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
                href={`${city.href}${urlSuffix}`}
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

export async function getServerSideProps({ res, resolvedUrl = '/' }) {
  const queryStart = resolvedUrl.indexOf('?');
  const initialSearch = queryStart === -1 ? '' : resolvedUrl.slice(queryStart);
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
      initialSearch,
    },
  };
}
