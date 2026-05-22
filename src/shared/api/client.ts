import axios from 'axios';
import CryptoJS from 'crypto-js';
import qs from 'query-string';

const API_BASE_URL = 'https://api2.jacochef.ru/site/public/index.php/';
const API_TIMEOUT_MS = 12000;
const SUGGEST_TIMEOUT_MS = 12000;

export type ApiPayload = Record<string, unknown>;

export async function api(module = '', data: ApiPayload = {}) {
  const now = Math.floor(Date.now() / 1000);
  const payload = { ...data, ts: now };
  const bodyString = qs.stringify(payload);
  const sig = CryptoJS.HmacSHA256(`${now}${bodyString}`, 'jaco—food').toString(
    CryptoJS.enc.Hex
  );
  const body = qs.stringify({ ...payload, sig });

  try {
    const response = await axios.post(`${API_BASE_URL}${module}`, body, {
      timeout: API_TIMEOUT_MS,
    });

    if (typeof response.data === 'string') {
      return {
        st: false,
        text: response.data,
      };
    }

    return response.data;
  } catch {
    return {
      st: false,
      text: 'Сервис временно недоступен. Проверьте интернет и попробуйте еще раз.',
    };
  }
}

export async function apiAddress(city: string, value: string) {
  if (!city?.length || !value?.length) {
    return null;
  }

  const apikey = process.env.NEXT_PUBLIC_YANDEX_TOKEN_SUGGEST ?? '';
  const url = `https://suggest-maps.yandex.ru/v1/suggest?text=${encodeURIComponent(
    `${city},${value}`
  )}&types=geo,locality,province,area,district,street,house&print_address=1&results=7&apikey=${apikey}`;

  try {
    const response = await axios.post(url, undefined, {
      timeout: SUGGEST_TIMEOUT_MS,
    });

    if (typeof response.data === 'string') {
      return { st: false, text: response.data };
    }

    return response.data;
  } catch {
    return {
      st: false,
      text: 'Подсказки адреса временно недоступны.',
    };
  }
}
