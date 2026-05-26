'use client';

import Cookies from 'js-cookie';
import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCityStore } from '@src/entities/city';
import type { CityRecord } from '@src/entities/city';
import { useHeaderStore } from '@src/entities/header';
import { ModalWrapper } from '@src/shared/ui';
import { setLocalStorageItem } from '@/utils/browserStorage';
import './CityModal.scss';

function cityName(city: CityRecord): string {
  return String(city.name ?? city.link ?? '').trim();
}

function cityLink(city: CityRecord): string {
  return String(city.link ?? '').trim();
}

function replaceCityInPath(pathname: string, city: string): string {
  const parts = pathname.split('/').filter(Boolean);
  const previewIndex = parts[0] === 'preview' ? 1 : 0;
  parts[previewIndex] = city;
  return `/${parts.join('/')}`;
}

export function CityModal() {
  const router = useRouter();
  const pathname = usePathname() || '/preview/togliatti';
  const searchParams = useSearchParams();
  const [showList, setShowList] = useState(false);

  const citySlug = useCityStore((state) => state.slug);
  const cityLabel = useCityStore((state) => state.labelRu);
  const cityList = useCityStore((state) => state.list);
  const setCity = useCityStore((state) => state.setCity);
  const openCityModal = useHeaderStore((state) => state.openCityModal);
  const openCityModalList = useHeaderStore((state) => state.openCityModalList);
  const setActiveModalCity = useHeaderStore(
    (state) => state.setActiveModalCity
  );
  const setActiveModalCityList = useHeaderStore(
    (state) => state.setActiveModalCityList
  );

  const visible = openCityModal || openCityModalList;
  const cityOptions = useMemo(
    () => cityList.filter((item) => cityLink(item).length > 0),
    [cityList]
  );
  const effectiveShowList = showList || openCityModalList;

  const close = () => {
    setShowList(false);
    setActiveModalCity(false);
    setActiveModalCityList(false);
  };

  const confirmCity = () => {
    const current =
      cityOptions.find((item) => cityLink(item) === citySlug) ??
      cityOptions.find((item) => cityName(item) === cityLabel);
    if (current) {
      setLocalStorageItem('setCity', JSON.stringify(current));
      Cookies.set('city', cityLink(current), {
        expires: 365,
        path: '/',
        sameSite: 'Lax',
      });
    }
    close();
  };

  const chooseCity = (nextCity: CityRecord) => {
    const nextSlug = cityLink(nextCity);
    const nextName = cityName(nextCity);
    if (!nextSlug) {
      return;
    }

    setLocalStorageItem('setCity', JSON.stringify(nextCity));
    Cookies.set('city', nextSlug, {
      expires: 365,
      path: '/',
      sameSite: 'Lax',
    });
    setCity(nextSlug, nextName, cityList);
    close();

    const query = searchParams?.toString();
    const nextPath = replaceCityInPath(pathname, nextSlug);
    router.push(query ? `${nextPath}?${query}` : nextPath);
    router.refresh();
  };

  if (!visible) {
    return null;
  }

  return (
    <ModalWrapper
      open={visible}
      onClose={close}
      className="city-modal"
      paperClassName="city-modal__paper"
      title={effectiveShowList ? 'Выберите город' : 'Вы в городе'}
      titleClassName="city-modal__title"
      contentClassName="city-modal__content"
      closeOutside
      closeOnBackdrop
      labelledBy="city-modal-title"
      variant="responsive"
    >
      {effectiveShowList ? (
        <>
          <div className="city-modal__list">
            {cityOptions.map((item) => {
              const slug = cityLink(item);
              const name = cityName(item);
              return (
                <button
                  key={slug}
                  className="city-modal__city-option"
                  type="button"
                  aria-current={slug === citySlug ? 'true' : undefined}
                  onClick={() => chooseCity(item)}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="city-modal__image">
            <img src="/Favicon_city.png" alt="" />
          </div>
          <div className="city-modal__city">{cityLabel}</div>
          <button
            className="city-modal__action"
            type="button"
            onClick={confirmCity}
          >
            Да, верно
          </button>
          <button
            className="city-modal__action city-modal__action--secondary"
            type="button"
            onClick={() => setShowList(true)}
          >
            Нет, выберу город
          </button>
        </>
      )}
    </ModalWrapper>
  );
}
