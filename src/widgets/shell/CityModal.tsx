'use client';

import Cookies from 'js-cookie';
import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useCityStore } from '@src/entities/city';
import type { CityRecord } from '@src/entities/city';
import { useHeaderStore } from '@src/entities/header';
import { useCompactLayout } from '@src/shared/lib/viewport';
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
  const compact = useCompactLayout();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

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

  const cityOptions = useMemo(
    () => cityList.filter((item) => cityLink(item).length > 0),
    [cityList]
  );
  const menuOpen = Boolean(menuAnchor);
  const openConfirm = openCityModal;
  const openList = compact && openCityModalList;

  const closeAll = () => {
    setMenuAnchor(null);
    setActiveModalCity(false);
    setActiveModalCityList(false);
  };

  const closeConfirm = () => {
    setMenuAnchor(null);
    setActiveModalCity(false);
  };

  const closeList = () => {
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
    closeAll();
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
    closeAll();

    const query = searchParams?.toString();
    const nextPath = replaceCityInPath(pathname, nextSlug);
    router.push(query ? `${nextPath}?${query}` : nextPath);
    router.refresh();
  };

  const openCityPickerMobile = () => {
    setActiveModalCity(false);
    setActiveModalCityList(true);
  };

  const confirmBody = (
    <>
      <div className="city-modal__image">
        <img src="/Favicon_city.png" alt="" />
      </div>
      <div className="city-modal__subtitle">Вы в городе</div>
      <div className="city-modal__city">{cityLabel}</div>
      <button
        className="city-modal__action"
        type="button"
        onClick={confirmCity}
      >
        Да, верно
      </button>
      <button
        className={
          'city-modal__action city-modal__action--secondary' +
          (menuOpen ? ' city-modal__action--secondary-open' : '')
        }
        type="button"
        aria-expanded={compact ? undefined : menuOpen}
        aria-haspopup={compact ? undefined : 'listbox'}
        onClick={(event) => {
          if (compact) {
            openCityPickerMobile();
            return;
          }
          setMenuAnchor(event.currentTarget);
        }}
      >
        <span>Нет, выберу город</span>
        {!compact ? (
          menuOpen ? (
            <KeyboardArrowUpIcon className="city-modal__action-icon" />
          ) : (
            <KeyboardArrowDownIcon className="city-modal__action-icon" />
          )
        ) : null}
      </button>
      {!compact ? (
        <Menu
          id="city-modal-menu"
          className="city-modal__menu"
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={() => setMenuAnchor(null)}
          disableScrollLock
          sx={{ zIndex: 4300 }}
        >
          {cityOptions.map((item) => {
            const slug = cityLink(item);
            const name = cityName(item);
            return (
              <MenuItem
                key={slug}
                className="city-modal__menu-item"
                onClick={() => chooseCity(item)}
              >
                {name}
              </MenuItem>
            );
          })}
        </Menu>
      ) : null}
    </>
  );

  return (
    <>
      {openConfirm ? (
        <ModalWrapper
          open={openConfirm}
          onClose={closeConfirm}
          className="city-modal"
          paperClassName="city-modal__paper"
          contentClassName="city-modal__content"
          closeOutside={!compact}
          closeOnBackdrop
          labelledBy="city-modal-title"
          variant="responsive"
        >
          {confirmBody}
        </ModalWrapper>
      ) : null}

      {openList ? (
        <ModalWrapper
          open={openList}
          onClose={closeList}
          className="city-modal city-modal--list"
          paperClassName="city-modal__paper"
          title="Выберите город"
          titleClassName="city-modal__title"
          contentClassName="city-modal__content"
          closeOnBackdrop
          labelledBy="city-modal-list-title"
          variant="responsive"
        >
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
        </ModalWrapper>
      ) : null}
    </>
  );
}
