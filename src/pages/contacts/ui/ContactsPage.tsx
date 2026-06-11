'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Cookies from 'js-cookie';
import { useCityStore, type CityRecord } from '@src/entities/city';
import { useContactStore } from '@src/entities/contact';
import { useHeaderStore } from '@src/entities/header';
import { cityPath } from '@src/shared/lib/sitePaths';
import {
  LocationIconMobile,
  LocationMapMobile,
  MapContactsMobile,
  MapPointIcon,
  VectorRightMobile,
} from '@src/shared/ui/icons/Icons';
import { MuiSelectField, MuiSwitch } from '@src/shared/ui';
import { ContactsMap, ContactsPointPickerModal } from '@src/widgets/contacts';
import { setLocalStorageItem } from '@/utils/browserStorage';
import './ContactsPage.scss';

function cityLink(city: CityRecord): string {
  return String(city.link ?? '').trim();
}

function cityName(city: CityRecord): string {
  return String(city.name ?? city.link ?? '').trim();
}

export function ContactsPage() {
  const router = useRouter();

  const citySlug = useCityStore((state) => state.slug);
  const cityLabel = useCityStore((state) => state.labelRu);
  const cityList = useCityStore((state) => state.list);
  const setCity = useCityStore((state) => state.setCity);

  const cityOptions = useMemo(
    () =>
      cityList
        .map((city) => {
          const link = cityLink(city);
          if (!link) {
            return null;
          }

          return {
            value: link,
            label: cityName(city),
          };
        })
        .filter((option): option is { value: string; label: string } =>
          Boolean(option)
        ),
    [cityList]
  );

  const setActiveModalCityList = useHeaderStore(
    (state) => state.setActiveModalCityList
  );

  const myAddr = useContactStore((state) => state.myAddr);
  const phone = useContactStore((state) => state.phone);
  const disable = useContactStore((state) => state.disable);
  const point = useContactStore((state) => state.point);
  const getMap = useContactStore((state) => state.getMap);
  const changePointClick = useContactStore((state) => state.changePointClick);
  const disablePointsZone = useContactStore((state) => state.disablePointsZone);
  const setActiveModalChoose = useContactStore(
    (state) => state.setActiveModalChoose
  );
  const getUserPosition = useContactStore((state) => state.getUserPosition);
  const clickPhoneMobile = useContactStore((state) => state.clickPhoneMobile);

  const chooseCity = (nextCitySlug: string) => {
    const city = cityList.find((item) => cityLink(item) === nextCitySlug);
    const link = city ? cityLink(city) : nextCitySlug;

    if (!link || link === citySlug) {
      return;
    }

    setLocalStorageItem(
      'setCity',
      JSON.stringify(city ?? { link, name: link })
    );
    Cookies.set('city', link, { expires: 365, path: '/', sameSite: 'Lax' });
    setCity(link, city ? cityName(city) : link);
    void getMap('contacts', link);
    router.push(cityPath(link, 'contacts'));
  };

  return (
    <section className="contacts-page">
      <div className="contacts-page__body">
        <div className="contacts-page__map-area">
          <ContactsMap />
          <button
            type="button"
            className="contacts-page__locate"
            aria-label="Определить местоположение"
            onClick={getUserPosition}
          >
            <LocationMapMobile />
          </button>
        </div>

        <aside className="contacts-page__panel">
          <div className="contacts-page__panel-desktop">
            <MuiSelectField
              hiddenLabel
              aria-label="Город"
              className="contacts-page__city-select"
              value={citySlug}
              options={cityOptions}
              range="expanded"
              surface="outlined"
              onChange={(event) => chooseCity(String(event.target.value))}
            />

            <div className="contacts-page__addresses">
              <h2 className="contacts-page__section-title">Адреса кафе:</h2>
              <List className="contacts-page__address-list" disablePadding>
                {myAddr.map((item) => (
                  <ListItemButton
                    key={item.addr}
                    className="contacts-page__address-item"
                    disableRipple
                    selected={item.addr === point || Boolean(item.color)}
                    onClick={() => changePointClick(item.addr)}
                  >
                    <MapPointIcon />
                    <ListItemText
                      primary={
                        <span
                          className="contacts-page__address-text"
                          style={item.color ? { color: item.color } : undefined}
                        >
                          {item.addr}
                        </span>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            </div>

            <div className="contacts-page__info contacts-page__info--desktop">
              <span className="contacts-page__info-label">
                Телефон для заказа
              </span>
              <strong className="contacts-page__info-value">{phone}</strong>
              <span className="contacts-page__info-label">
                Работаем ежедневно
              </span>
              <strong className="contacts-page__info-value">
                10:00 - 21:30
              </strong>
            </div>
          </div>

          <div className="contacts-page__panel-mobile">
            <h1 className="contacts-page__mini-title">Контакты</h1>
            <button
              type="button"
              className="contacts-page__row"
              aria-label="Выбрать город"
              onClick={() => setActiveModalCityList(true)}
            >
              <span className="contacts-page__row-leading">
                <MapContactsMobile />
              </span>
              <span className="contacts-page__row-label">{cityLabel}</span>
              <span className="contacts-page__row-trailing">
                <VectorRightMobile />
              </span>
            </button>

            <button
              type="button"
              className="contacts-page__row contacts-page__row--point"
              aria-label={point ? `Адрес: ${point}` : 'Выберите адрес'}
              onClick={() => setActiveModalChoose(true)}
            >
              <span className="contacts-page__row-leading">
                <LocationIconMobile />
              </span>
              <span className="contacts-page__row-label">
                {point || 'Выберите адрес'}
              </span>
              <span className="contacts-page__row-trailing">
                <VectorRightMobile />
              </span>
            </button>

            <p className="contacts-page__info-line">
              Работаем ежедневно с 10:00 до 21:30
            </p>
            <p className="contacts-page__info-line">Позвонить и заказать:</p>
            <button
              type="button"
              className="contacts-page__phone-btn"
              onClick={clickPhoneMobile}
            >
              {phone}
            </button>
          </div>

          <div className="contacts-page__switch">
            <span>Показать зону доставки</span>
            <MuiSwitch
              size="profile"
              checked={disable}
              onChange={() => disablePointsZone()}
            />
          </div>
        </aside>
      </div>

      <ContactsPointPickerModal />
    </section>
  );
}
