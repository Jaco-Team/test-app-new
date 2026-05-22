import axios from 'axios';
import CryptoJS from 'crypto-js';
import qs from 'query-string';

const API_BASE_URL = 'https://api2.jacochef.ru/site/public/index.php/';
const API_TIMEOUT_MS = 12000;

type PreviewApiPayload = Record<string, unknown>;

export async function api(module = '', data: PreviewApiPayload = {}) {
  const now = Math.floor(Date.now() / 1000);
  const payload = { ...data, ts: now };
  const bodyString = qs.stringify(payload);
  const sig = CryptoJS.HmacSHA256(now + bodyString, 'jaco—food').toString(
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
