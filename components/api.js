//import queryString from 'query-string';
import qs from 'query-string';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import * as Sentry from '@sentry/nextjs';

import { getClientNetworkContext } from '@/utils/clientMonitoring';

const urlApi   = 'https://api.jacochef.ru/site/public/index.php/';

function getSafeRequestMeta(data = {}) {
  return {
    type: data?.type ?? null,
    page: data?.page ?? null,
    city_id: data?.city_id ?? null,
    hasToken: Boolean(data?.token),
    hasCart: Boolean(data?.cart),
    keys: Object.keys(data || {}).sort(),
  };
}

function captureApiError({ module, requestUrl, requestMeta, error, source }) {
  Sentry.withScope((scope) => {
    const status = error?.response?.status ?? null;
    const code = error?.code ?? null;

    scope.setTag('kind', 'api_request_failed');
    scope.setTag('api_module', module || 'root');
    scope.setTag('api_source', source);

    if (status) {
      scope.setTag('http_status', String(status));
    }

    if (code) {
      scope.setTag('error_code', String(code));
    }

    scope.setContext('network', getClientNetworkContext());
    scope.setExtra('requestUrl', requestUrl);
    scope.setExtra('requestMeta', requestMeta);
    scope.setExtra('responseDataType', typeof error?.response?.data);
    scope.setFingerprint([
      'api-request-failed',
      source,
      module || 'root',
      String(status || code || 'unknown'),
    ]);

    Sentry.captureException(error);
  });
}

export function api(module = '', data = {}){
  const now = Math.floor(Date.now() / 1000);
  
  const payload = { ...data, ts: now };
  const bodyStr = qs.stringify(payload);

  const sig = CryptoJS.HmacSHA256(now + bodyStr, 'jaco—food')
                      .toString(CryptoJS.enc.Hex);

  const body = qs.stringify({ ...payload, sig });

  return axios.post(urlApi+module, body)
    .then( (response) => {
      
      if( typeof response.data == 'string' ){
        return {
          st: false,
          text: response.data
        };
      }

      return response.data;
    })
    .catch( (error) => {
      console.error(error);

      captureApiError({
        module,
        requestUrl: urlApi + module,
        requestMeta: getSafeRequestMeta(data),
        error,
        source: 'api',
      });
    });
}

export async function apiAddress(city, value){
  if( city.length > 0 && value.length > 0 ){

    const urlApi = `https://suggest-maps.yandex.ru/v1/suggest?text=${city},${value}&types=geo,locality,province,area,district,street,house&print_address=1&results=7&apikey=${process.env.NEXT_PUBLIC_YANDEX_TOKEN_SUGGEST}`;

    return axios.post(urlApi)
      .then( (response) => {
        
        if( typeof response.data == 'string' ){
          return {
            st: false,
            text: response.data
          };
        }

        return response.data;
      })
      .catch( (error) => {
        console.error(error);

        captureApiError({
          module: 'yandex-suggest',
          requestUrl: urlApi,
          requestMeta: {
            cityProvided: Boolean(city),
            queryLength: value?.length ?? 0,
          },
          error,
          source: 'apiAddress',
        });
      });
  }
}
