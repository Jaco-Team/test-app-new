//import queryString from 'query-string';
import qs from 'query-string';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import * as Sentry from '@sentry/nextjs';

import {
  emitInternetIssue,
  getClientNetworkContext,
  isCustomSentryMonitoringEnabled,
} from '@/utils/clientMonitoring';

const DEFAULT_API_BASE_URL = 'https://api2.jacochef.ru/site/public/index.php/';
const DEFAULT_API_TIMEOUT_MS = 12000;
const AUTH_API_TIMEOUT_MS = 20000;
const MIN_API_TIMEOUT_MS = 3000;
const MAX_API_TIMEOUT_MS = 45000;
const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);
const RETRY_ATTEMPTS = 2;
const NON_IDEMPOTENT_TYPES = new Set([
  'checkauthyandex',
  'create_order',
  'create_order_pre',
  'create_profile',
  'sendsmsrp',
  'site_login',
  'trueordercash',
  'order_true'
]);
const SAFE_MUTATION_RETRY_TYPES = new Set([
  'site_login',
  'checkauthyandex',
]);

function normalizeBoundedInt(value, min, max, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;

  const rounded = Math.round(num);
  if (rounded < min) return min;
  if (rounded > max) return max;

  return rounded;
}

function getApiTimeoutMs(module = '', data = {}) {
  const requestOverrideTimeout = normalizeBoundedInt(
    data?.__timeoutMs,
    MIN_API_TIMEOUT_MS,
    MAX_API_TIMEOUT_MS,
    NaN,
  );

  if (Number.isFinite(requestOverrideTimeout)) {
    return requestOverrideTimeout;
  }

  if (String(module || '').trim().toLowerCase() === 'auth') {
    return AUTH_API_TIMEOUT_MS;
  }

  return DEFAULT_API_TIMEOUT_MS;
}

function getRetryAttempts(data = {}) {
  return normalizeBoundedInt(data?.__retryAttempts, 1, 3, RETRY_ATTEMPTS);
}

function getRequestType(data = {}) {
  return String(data?.type || '').trim().toLowerCase().replace(/[\s-]+/g, '');
}

function isMutationRequest(data = {}) {
  const requestType = getRequestType(data);

  if (!requestType) {
    return false;
  }

  if (NON_IDEMPOTENT_TYPES.has(requestType)) {
    return true;
  }

  if (requestType.startsWith('get_') || requestType.startsWith('check_')) {
    return false;
  }

  return /^(create_|save_|update_|delete_|remove_|add_|send|set)/.test(requestType);
}

function shouldRetryRequest(data = {}) {
  const requestType = getRequestType(data);

  if (data?.__disableRetry === true) {
    return false;
  }

  if (data?.__forceRetry === true) {
    return true;
  }

  if (SAFE_MUTATION_RETRY_TYPES.has(requestType)) {
    return true;
  }

  return !isMutationRequest(data);
}

function stripInternalRequestKeys(data = {}) {
  return Object.fromEntries(
    Object.entries(data || {}).filter(([key]) => !String(key).startsWith('__')),
  );
}

function isRetryableApiError(error) {
  const status = error?.response?.status;

  if (typeof status === 'number') {
    return RETRYABLE_STATUS_CODES.has(status);
  }

  const code = String(error?.code || '').toUpperCase();

  return [
    'ECONNABORTED',
    'ECONNREFUSED',
    'ECONNRESET',
    'ENETUNREACH',
    'EAI_AGAIN',
    'ETIMEDOUT',
    'ERR_NETWORK',
  ].includes(code);
}

function shouldReportInternetIssue(error, data = {}) {
  const requestType = getRequestType(data);

  if (requestType === 'save_user_actions') {
    return false;
  }

  return isRetryableApiError(error);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function attachRequestAttemptMeta(error, meta = {}) {
  if (error && typeof error === 'object') {
    error.jacoAttemptMeta = {
      ...(error.jacoAttemptMeta || {}),
      ...meta,
    };
  }

  return error;
}

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
  if (!isCustomSentryMonitoringEnabled()) {
    return;
  }

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
    scope.setExtra('attemptMeta', error?.jacoAttemptMeta || null);
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

async function postWithRetry({ module, body, data }) {
  const requestUrl = `${DEFAULT_API_BASE_URL}${module}`;
  const requestTimeout = getApiTimeoutMs(module, data);
  const canRetry = shouldRetryRequest(data);
  const attemptsCount = canRetry ? getRetryAttempts(data) : 1;
  let lastError = null;

  for (let attempt = 1; attempt <= attemptsCount; attempt += 1) {
    try {
      const response = await axios.post(requestUrl, body, { timeout: requestTimeout });

      if (attempt > 1) {
        Sentry.addBreadcrumb({
          category: 'api',
          level: 'info',
          message: 'API request recovered via retry',
          data: {
            module,
            attempt,
            requestUrl,
          },
        });
      }

      return {
        response,
        requestUrl,
        attempt,
      };
    } catch (error) {
      const retryableError = isRetryableApiError(error);
      const hasAttemptsLeft = attempt < attemptsCount;

      lastError = attachRequestAttemptMeta(error, {
        module,
        attempt,
        requestUrl,
        retryableError,
        canRetry,
      });

      if (!canRetry || !retryableError || !hasAttemptsLeft) {
        throw lastError;
      }

      await sleep(250 * attempt);
    }
  }

  throw lastError || new Error('API request failed without error details');
}

export function api(module = '', data = {}){
  const now = Math.floor(Date.now() / 1000);
  const requestConfig = data && typeof data === 'object' ? data : {};
  const safeData = stripInternalRequestKeys(requestConfig);

  const payload = { ...safeData, ts: now };
  const bodyStr = qs.stringify(payload);

  const sig = CryptoJS.HmacSHA256(now + bodyStr, 'jaco—food')
                      .toString(CryptoJS.enc.Hex);

  const body = qs.stringify({ ...payload, sig });

  return postWithRetry({ module, body, data: requestConfig })
    .then(({ response }) => {
      if (typeof response.data == 'string') {
        return {
          st: false,
          text: response.data
        };
      }

      return response.data;
    })
    .catch((error) => {
      console.error(error);

      const lastUrl = error?.jacoAttemptMeta?.requestUrl || `${DEFAULT_API_BASE_URL}${module}`;
      const responseStatus = error?.response?.status ?? null;
      const errorCode = String(error?.code || '').toUpperCase() || null;
      const isRetryable = isRetryableApiError(error);

      captureApiError({
        module,
        requestUrl: lastUrl,
        requestMeta: {
          ...getSafeRequestMeta(safeData),
          canRetry: shouldRetryRequest(requestConfig),
          timeoutMs: getApiTimeoutMs(module, requestConfig),
          isRetryable,
        },
        error,
        source: 'api',
      });

      if (isCustomSentryMonitoringEnabled() && shouldReportInternetIssue(error, safeData)) {
        emitInternetIssue({
          type: 'api_request_failed',
          source: 'api',
          module: module || 'root',
          requestType: getRequestType(safeData),
          status: responseStatus,
          code: errorCode,
          retryable: isRetryable,
          attempt: error?.jacoAttemptMeta?.attempt || 1,
          url: lastUrl,
          network: getClientNetworkContext(),
        });
      }

      return {
        st: false,
        text: 'Сервис временно недоступен. Проверьте интернет и попробуйте еще раз.',
      };
    });
}

export async function apiAddress(city, value){
  if( city.length > 0 && value.length > 0 ){

    const urlApi = `https://suggest-maps.yandex.ru/v1/suggest?text=${city},${value}&types=geo,locality,province,area,district,street,house&print_address=1&results=7&apikey=${process.env.NEXT_PUBLIC_YANDEX_TOKEN_SUGGEST}`;

    return axios.post(urlApi, undefined, { timeout: getApiTimeoutMs() })
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
