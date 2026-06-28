import React, { useState, useRef, useEffect, useMemo } from 'react';

import Link from 'next/link';

import {
  useContactStore,
  useCitiesStore,
  useHeaderStoreNew,
} from '@/components/store.js';
import { api, apiAddress } from '@/components/api';

import { MapPointIcon } from '@/ui/Icons.js';

import {
  YMaps,
  Map,
  Placemark,
  Polygon,
  ZoomControl,
} from '@pbe/react-yandex-maps';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';

import MySwitch from '@/ui/Switch.js';

import Cookies from 'js-cookie';
import { setLocalStorageItem } from '@/utils/browserStorage';
import { BREAKPOINTS } from '@/utils/breakpoints';

const ContactsMapCanvas = React.memo(function ContactsMapCanvas({
  instanceRef,
  mapState,
  mapHeight,
  searchPoint,
  zones,
  pointsZone,
  changePointClick,
  changePointNotHover,
}) {
  const yandexMapQuery = useMemo(
    () => ({
      lang: 'ru_RU',
      apikey: process.env.NEXT_PUBLIC_YANDEX_TOKEN_MAP,
      ...(process.env.NEXT_PUBLIC_YANDEX_TOKEN_SUGGEST
        ? {
            suggest_apikey: process.env.NEXT_PUBLIC_YANDEX_TOKEN_SUGGEST,
          }
        : {}),
    }),
    []
  );

  return (
    <YMaps query={yandexMapQuery}>
      <Map
        defaultState={mapState}
        instanceRef={instanceRef}
        width="100%"
        height={mapHeight}
        style={{ height: mapHeight }}
        onClick={(event) => changePointNotHover(event)}
      >
        <ZoomControl options={{ float: 'left' }} />

        {searchPoint ? (
          <Placemark
            geometry={searchPoint}
            options={{
              iconLayout: 'default#image',
              iconImageHref: '/Frame.png',
              iconImageSize: [35, 50],
              iconImageOffset: [-15, -50],
            }}
          />
        ) : null}

        {zones?.map((point, key) => (
          <Placemark
            key={key}
            geometry={[point.xy_point.latitude, point.xy_point.longitude]}
            options={{
              iconLayout: point.image,
              iconImageHref: '/Favikon.png',
              iconImageSize: [65, 65],
              iconImageOffset: [-12, -20],
            }}
            onClick={() => changePointClick(point.addr)}
          />
        ))}

        {pointsZone?.map((point, key) => (
          <Polygon
            key={key}
            geometry={[point.zone]}
            options={point.options}
            onClick={() => changePointClick(point.addr)}
          />
        ))}
      </Map>
    </YMaps>
  );
});

export default function ContactsPagePC({ heading = '' }) {
  const ref = useRef();
  const suggestionRequestRef = useRef(0);
  const suppressNextSuggestRef = useRef(false);

  const [thisCityList, thisCityRu, setThisCityRu, setThisCity, thisCity] =
    useCitiesStore((state) => [
      state.thisCityList,
      state.thisCityRu,
      state.setThisCityRu,
      state.setThisCity,
      state.thisCity,
    ]);

  const [
    myAddr,
    phone,
    disablePointsZone,
    disable,
    center_map,
    zones,
    getMap,
    points_zone,
    changePointClick,
    changePointNotHover,
  ] = useContactStore((state) => [
    state.myAddr,
    state.phone,
    state.disablePointsZone,
    state.disable,
    state.center_map,
    state.zones,
    state.getMap,
    state.points_zone,
    state.changePointClick,
    state.changePointNotHover,
  ]);

  const [activePage] = useHeaderStoreNew((state) => [state?.activePage]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [selectedSearchSuggestion, setSelectedSearchSuggestion] =
    useState(null);
  const [searchPoint, setSearchPoint] = useState(null);
  const [searchStatus, setSearchStatus] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const isTabletContacts = useMediaQuery(
    `screen and (min-width: ${BREAKPOINTS.tabletMin}px) and (max-width: ${BREAKPOINTS.tabletMax}px)`
  );
  const mapHeight = isTabletContacts ? '85.9090909091vw' : '68.231046931408vw';
  const mapState = useMemo(() => {
    if (!center_map) {
      return null;
    }

    const tabletZoom = Math.min(center_map?.zoom ?? 11.5, 10.9);
    const tabletLngShift = 0.08;
    const nextCenter =
      isTabletContacts &&
      Array.isArray(center_map?.center) &&
      center_map.center.length === 2
        ? [center_map.center[0], center_map.center[1] + tabletLngShift]
        : center_map.center;

    return {
      ...center_map,
      center: nextCenter,
      zoom: isTabletContacts ? tabletZoom : center_map?.zoom,
    };
  }, [center_map, isTabletContacts]);
  const pageHeading = String(heading ?? '').trim();
  const currentCity = useMemo(
    () => thisCityList.find((city) => city.link === thisCity),
    [thisCityList, thisCity]
  );

  const open = Boolean(anchorEl);

  const normalizeSuggestResult = (item) => ({
    name: item?.title?.text || '',
    title: item?.subtitle?.text || '',
    full: item,
  });

  const getSuggestionAddressParts = (suggestion) => {
    const addressParts = {
      dop_name: '',
      street: '',
      home: '',
    };

    suggestion?.full?.address?.component?.forEach((item) => {
      const kind = item?.kind?.[0];

      if (kind === 'STREET') {
        addressParts.street = item.name;
      }

      if (kind === 'LOCALITY' && !addressParts.street) {
        addressParts.street = item.name;
      }

      if (kind === 'HOUSE') {
        addressParts.home = item.name;
      }

      if (kind === 'DISTRICT') {
        addressParts.dop_name = item.name;
      }
    });

    return addressParts;
  };

  const clearSearch = () => {
    setSearchValue('');
    setSearchSuggestions([]);
    setSelectedSearchSuggestion(null);
    setSearchPoint(null);
    setSearchStatus('');
  };

  const fetchSearchSuggestions = async (value) => {
    if (!currentCity?.name || value.trim().length < 2) {
      setSearchSuggestions([]);
      return;
    }

    const requestId = suggestionRequestRef.current + 1;
    suggestionRequestRef.current = requestId;

    const response = await apiAddress(currentCity.name, value.trim());

    if (requestId !== suggestionRequestRef.current) {
      return;
    }

    const suggestions = response?.results?.map(normalizeSuggestResult) ?? [];
    setSearchSuggestions(suggestions);
  };

  const searchBySuggestion = async (suggestion) => {
    if (!suggestion || (!currentCity?.id && !currentCity?.link)) {
      return;
    }

    const addressParts = getSuggestionAddressParts(suggestion);
    const street = `${addressParts.dop_name} ${addressParts.street}`.trim();

    if (!street || !addressParts.home) {
      setSearchStatus('Укажите улицу и номер дома');
      return;
    }

    setIsSearchLoading(true);
    setSearchStatus('');

    const json = await api('profile', {
      type: 'check_street',
      city_id: currentCity.id || currentCity.link,
      street,
      home: addressParts.home,
      pd: '',
    });

    const foundAddress = Array.isArray(json?.addrs)
      ? json.addrs[0]
      : json?.addrs;
    const xy = foundAddress?.xy;

    if (Array.isArray(xy) && xy.length === 2) {
      const point = [Number(xy[0]), Number(xy[1])];
      const nextZoom =
        typeof window !== 'undefined' && window.innerWidth < 601 ? 10.6 : 11.5;

      setSearchPoint(point);
      setSearchSuggestions([]);
      setSearchStatus('');

      if (ref.current?.setCenter) {
        ref.current.setCenter(point, nextZoom, {
          duration: 700,
          timingFunction: 'ease-out',
          checkZoomRange: false,
        });
      }
    } else {
      setSearchStatus(json?.text || 'Адрес не найден, или указан не точно');
    }

    setIsSearchLoading(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const suggestion =
      selectedSearchSuggestion ||
      searchSuggestions[0] ||
      (searchValue.trim()
        ? {
            name: searchValue.trim(),
            full: {
              address: {
                component: [],
              },
            },
          }
        : null);

    searchBySuggestion(suggestion);
  };

  const handleSearchChange = (event) => {
    suppressNextSuggestRef.current = false;
    setSearchValue(event.target.value);
    setSelectedSearchSuggestion(null);
    setSearchStatus('');
  };

  const chooseCity = (city) => {
    setLocalStorageItem('setCity', JSON.stringify(city));
    Cookies.set('city', city?.link || '', {
      expires: 365,
      path: '/',
      sameSite: 'Lax',
    });
    setThisCityRu(city.name);
    setThisCity(city.link);
    setAnchorEl(null);
    clearSearch();
    getMap(activePage, city.link);
  };

  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchSuggestions([]);
      return undefined;
    }

    if (suppressNextSuggestRef.current) {
      suppressNextSuggestRef.current = false;
      return undefined;
    }

    const debounceId = window.setTimeout(() => {
      fetchSearchSuggestions(searchValue);
    }, 300);

    return () => window.clearTimeout(debounceId);
  }, [searchValue, currentCity?.name]);

  useEffect(() => {
    if (ref.current && mapState?.center) {
      const centerDuration = mapState?.duration ?? 1000;

      if (isTabletContacts) {
        if (typeof ref.current.setCenter === 'function') {
          ref.current.setCenter(mapState.center, mapState.zoom, {
            duration: 700,
            timingFunction: 'ease-out',
            checkZoomRange: false,
          });
          return;
        }
      }

      ref.current.setCenter(mapState?.center, mapState?.zoom, {
        duration: centerDuration,
        timingFunction: 'ease-in-out',
      });
    }
  }, [mapState, isTabletContacts]);

  return (
    <Box className="Contact_">
      <div className="Contact">
        {pageHeading ? (
          <h1 className="contactsPageTitle">{pageHeading}</h1>
        ) : null}

        <Button
          className="chooseCity"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          endIcon={<KeyboardArrowDownIcon />}
        >
          <Typography variant="h5" component="span">
            {thisCityRu}
          </Typography>
        </Button>

        <Menu
          id="chooseCityContact"
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
        >
          {thisCityList.map((city, key) => (
            <MenuItem key={key}>
              <Link
                href={`/${city.link}/${activePage}`}
                onClick={() => chooseCity(city)}
              >
                {city.name}
              </Link>
            </MenuItem>
          ))}
        </Menu>

        <div className="listAddrPoint">
          <Typography variant="h5" component="h2">
            Адреса кафе:
          </Typography>
          <List>
            {myAddr.map((point, key) => (
              <ListItemButton
                key={key}
                disableRipple
                onClick={() => changePointClick(point.addr)}
              >
                <MapPointIcon />
                <ListItemText
                  primary={
                    <Typography
                      style={{ color: point?.color ? point.color : null }}
                    >
                      {point.addr}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </List>
          <Divider />
        </div>

        <div className="listInfo">
          <Typography variant="h5" component="span">
            Телефон для заказа
          </Typography>
          <Typography variant="h5" component="h2">
            {phone}
          </Typography>
          <Typography variant="h5" component="span">
            Работаем ежедневно
          </Typography>
          <Typography variant="h5" component="h2">
            10:00 - 21:30
          </Typography>
          <Divider />
        </div>

        <div className="switch">
          <Typography variant="h5" component="span">
            Показать зону доставки
          </Typography>
          <MySwitch checked={disable} onClick={disablePointsZone} />
        </div>
      </div>

      {!center_map ? null : (
        <div
          className="contactsMapWrap"
          style={{ height: mapHeight, width: '100%' }}
        >
          <form className="contactsMapSearch" onSubmit={handleSearchSubmit}>
            <div className="contactsMapSearchRow">
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Введите адрес"
                aria-label="Поиск адреса"
                autoComplete="off"
              />

              {searchValue ? (
                <button
                  className="contactsMapSearchClear"
                  type="button"
                  onClick={clearSearch}
                  aria-label="Очистить адрес"
                >
                  ×
                </button>
              ) : null}

              <button
                className="contactsMapSearchSubmit"
                type="submit"
                disabled={isSearchLoading}
              >
                {isSearchLoading ? 'Поиск...' : 'Найти'}
              </button>
            </div>

            {searchSuggestions.length ? (
              <div className="contactsMapSearchSuggest">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.name}-${suggestion.title}-${index}`}
                    type="button"
                    onClick={() => {
                      suppressNextSuggestRef.current = true;
                      setSearchValue(
                        [suggestion.name, suggestion.title]
                          .filter(Boolean)
                          .join(', ')
                      );
                      setSelectedSearchSuggestion(suggestion);
                      setSearchSuggestions([]);
                      searchBySuggestion(suggestion);
                    }}
                  >
                    <strong>{suggestion.name}</strong>
                    {suggestion.title ? <span>{suggestion.title}</span> : null}
                  </button>
                ))}
              </div>
            ) : null}

            {searchStatus ? (
              <div className="contactsMapSearchMessage">{searchStatus}</div>
            ) : null}
          </form>

          <ContactsMapCanvas
            instanceRef={ref}
            mapState={mapState}
            mapHeight={mapHeight}
            searchPoint={searchPoint}
            zones={zones}
            pointsZone={points_zone}
            changePointClick={changePointClick}
            changePointNotHover={changePointNotHover}
          />
        </div>
      )}
    </Box>
  );
}
