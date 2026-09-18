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

const LEGACY_API_BASE_URL = 'https://api2.jacochef.ru/site/public/index.php/';

function normalizeApiBaseUrl(value) {
  const baseUrl = String(value || '').trim();

  return baseUrl ? `${baseUrl.replace(/\/+$/, '')}/` : LEGACY_API_BASE_URL;
}

const DEFAULT_API_BASE_URL = normalizeApiBaseUrl(
  typeof window === 'undefined'
    ? process.env.SITE_API_INTERNAL_BASE_URL ||
        process.env.NEXT_PUBLIC_SITE_API_BASE_URL
    : process.env.NEXT_PUBLIC_SITE_API_BASE_URL
);
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
  'order_true',
]);
const SAFE_MUTATION_RETRY_TYPES = new Set(['site_login', 'checkauthyandex']);
const AUTH_FLOW_STORAGE_KEY = 'jaco_auth_flow_id';
const PAYMENT_FLOW_STORAGE_KEY = 'jaco_payment_flow_id';
let paymentFlowMemory = '';
const TRACKED_AUTH_TYPES = new Set([
  'site_login',
  'create_profile',
  'check_profile',
  'sendsmsrp',
  'getyalinkauth',
  'checkauthyandex',
]);
const TRACKED_PAYMENT_TYPES = new Set([
  'create_order_pre',
  'check_pay_order',
  'check_pay_order_card',
  'order_true',
]);

function createAuthFlowId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `auth-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 14)}`;
}

export function getAuthFlowId({ renew = false } = {}) {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    let flowId = renew
      ? ''
      : window.sessionStorage.getItem(AUTH_FLOW_STORAGE_KEY);

    if (!flowId) {
      flowId = createAuthFlowId();
      window.sessionStorage.setItem(AUTH_FLOW_STORAGE_KEY, flowId);
    }

    return flowId;
  } catch {
    return createAuthFlowId();
  }
}

export function beginAuthFlow() {
  return getAuthFlowId({ renew: true });
}

export function endAuthFlow() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.removeItem(AUTH_FLOW_STORAGE_KEY);
  } catch {
    // Storage can be unavailable in private/restricted browser contexts.
  }
}

function createPaymentFlowId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `payment-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 14)}`;
}

export function getPaymentFlowId({ renew = false, create = true } = {}) {
  if (typeof window === 'undefined') return '';

  try {
    let flowId = renew
      ? ''
      : window.sessionStorage.getItem(PAYMENT_FLOW_STORAGE_KEY) ||
        paymentFlowMemory;

    if (!flowId && create) {
      flowId = createPaymentFlowId();
      window.sessionStorage.setItem(PAYMENT_FLOW_STORAGE_KEY, flowId);
    }

    paymentFlowMemory = flowId || '';

    return flowId || '';
  } catch {
    if (renew) paymentFlowMemory = '';
    if (!paymentFlowMemory && create) paymentFlowMemory = createPaymentFlowId();

    return paymentFlowMemory;
  }
}

export function beginPaymentFlow() {
  return getPaymentFlowId({ renew: true });
}

export function endPaymentFlow() {
  if (typeof window === 'undefined') return;

  paymentFlowMemory = '';

  try {
    window.sessionStorage.removeItem(PAYMENT_FLOW_STORAGE_KEY);
  } catch {
    // Storage can be unavailable in private/restricted browser contexts.
  }
}

export function trackPaymentClientEvent(clientStage, details = {}) {
  if (typeof window === 'undefined') return;

  const connection = window.navigator?.connection;
  const payload = {
    type: 'payment_event',
    client_stage: clientStage,
    payment_flow_id: details.payment_flow_id || getPaymentFlowId(),
    payment_action: details.payment_action,
    payment_method: details.payment_method,
    outcome: details.outcome,
    reason: details.reason,
    duration_ms: details.duration_ms,
    http_status: details.http_status,
    network_code: details.network_code,
    backend_request_id: details.backend_request_id,
    point_id: details.point_id,
    order_id: details.order_id,
    amount_minor: details.amount_minor,
    provider_status: details.provider_status,
    widget_target: details.widget_target,
    has_payment_session: details.has_payment_session,
    online: window.navigator?.onLine,
    effective_type: connection?.effectiveType,
    path: window.location?.pathname || '/',
    ts: Math.floor(Date.now() / 1000),
  };
  const body = qs.stringify(
    Object.fromEntries(
      Object.entries(payload).filter(
        ([, value]) => value !== undefined && value !== null && value !== ''
      )
    )
  );

  void axios
    .post(`${DEFAULT_API_BASE_URL}cart`, body, { timeout: 3000 })
    .catch(() => undefined);
}

function shouldTrackPaymentRequest(module, requestType, data = {}) {
  if (
    String(module || '').toLowerCase() !== 'cart' ||
    !TRACKED_PAYMENT_TYPES.has(requestType)
  ) {
    return false;
  }

  if (requestType === 'create_order_pre') {
    return ['online', 'pay_page', 'sbp'].includes(
      String(data?.typePay || '').toLowerCase()
    );
  }

  if (requestType === 'order_true') {
    return Boolean(
      data?.payment_flow_id || getPaymentFlowId({ create: false })
    );
  }

  return true;
}

function authScreenForAction(action) {
  if (action === 'create_profile' || action === 'sendsmsrp') return 'login_sms';
  if (action === 'check_profile') return 'otp';
  if (action === 'site_login') return 'password';
  if (action === 'getyalinkauth' || action === 'checkauthyandex')
    return 'yandex';

  return 'start';
}

export function trackAuthClientEvent(clientStage, details = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  const connection = window.navigator?.connection;
  const payload = {
    type: 'client_event',
    client_stage: clientStage,
    flow_id: details.flow_id || getAuthFlowId(),
    auth_action: details.auth_action,
    screen: details.screen,
    outcome: details.outcome,
    reason: details.reason,
    duration_ms: details.duration_ms,
    http_status: details.http_status,
    network_code: details.network_code,
    backend_request_id: details.backend_request_id,
    number: details.number,
    online: window.navigator?.onLine,
    effective_type: connection?.effectiveType,
    path: window.location?.pathname || '/',
    ts: Math.floor(Date.now() / 1000),
  };
  const body = qs.stringify(
    Object.fromEntries(
      Object.entries(payload).filter(
        ([, value]) => value !== undefined && value !== null && value !== ''
      )
    )
  );

  void axios
    .post(`${DEFAULT_API_BASE_URL}auth`, body, { timeout: 3000 })
    .catch(() => undefined);
}

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
    NaN
  );

  if (Number.isFinite(requestOverrideTimeout)) {
    return requestOverrideTimeout;
  }

  if (
    String(module || '')
      .trim()
      .toLowerCase() === 'auth'
  ) {
    return AUTH_API_TIMEOUT_MS;
  }

  return DEFAULT_API_TIMEOUT_MS;
}

function getRetryAttempts(data = {}) {
  return normalizeBoundedInt(data?.__retryAttempts, 1, 3, RETRY_ATTEMPTS);
}

function getRequestType(data = {}) {
  return String(data?.type || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '');
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

  return /^(create_|save_|update_|delete_|remove_|add_|send|set)/.test(
    requestType
  );
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
    Object.entries(data || {}).filter(([key]) => !String(key).startsWith('__'))
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

function shouldCaptureApiError(data = {}) {
  return getRequestType(data) !== 'save_user_actions';
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
      const response = await axios.post(requestUrl, body, {
        timeout: requestTimeout,
      });

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

export function api(module = '', data = {}) {
  const now = Math.floor(Date.now() / 1000);
  const requestConfig = data && typeof data === 'object' ? data : {};
  const safeData = stripInternalRequestKeys(requestConfig);
  const requestType = getRequestType(safeData);
  const trackAuthRequest =
    String(module || '').toLowerCase() === 'auth' &&
    TRACKED_AUTH_TYPES.has(requestType);
  const trackPaymentRequest = shouldTrackPaymentRequest(
    module,
    requestType,
    safeData
  );
  const flowId = trackAuthRequest ? getAuthFlowId() : '';
  const paymentFlowId = trackPaymentRequest
    ? safeData?.payment_flow_id || getPaymentFlowId()
    : '';
  const requestData = {
    ...safeData,
    ...(flowId ? { flow_id: flowId } : {}),
    ...(paymentFlowId ? { payment_flow_id: paymentFlowId } : {}),
  };
  const authStartedAt = trackAuthRequest ? Date.now() : 0;
  const paymentStartedAt = trackPaymentRequest ? Date.now() : 0;

  if (trackAuthRequest) {
    trackAuthClientEvent('request_started', {
      flow_id: flowId,
      auth_action: requestType,
      screen: authScreenForAction(requestType),
      number: safeData?.number,
    });
  }

  if (trackPaymentRequest) {
    trackPaymentClientEvent('request_started', {
      payment_flow_id: paymentFlowId,
      payment_action: requestType,
      payment_method: safeData?.typePay,
      point_id: safeData?.point_id,
      order_id: safeData?.order_id,
      outcome: 'pending',
    });
  }

  const payload = { ...requestData, ts: now };
  const bodyStr = qs.stringify(payload);

  const sig = CryptoJS.HmacSHA256(now + bodyStr, 'jaco—food').toString(
    CryptoJS.enc.Hex
  );

  const body = qs.stringify({ ...payload, sig });

  return postWithRetry({ module, body, data: requestConfig })
    .then(({ response }) => {
      if (trackAuthRequest) {
        const requestFailed =
          typeof response?.data === 'string' || response?.data?.st === false;
        trackAuthClientEvent('request_finished', {
          flow_id: flowId,
          auth_action: requestType,
          screen: authScreenForAction(requestType),
          number: safeData?.number,
          outcome: requestFailed ? 'failure' : 'success',
          reason: requestFailed ? 'backend_rejected' : undefined,
          duration_ms: Date.now() - authStartedAt,
          http_status: response?.status,
          backend_request_id: response?.headers?.['x-request-id'],
        });
      }

      if (trackPaymentRequest) {
        const requestFailed =
          typeof response?.data === 'string' || response?.data?.st === false;
        trackPaymentClientEvent('request_finished', {
          payment_flow_id: paymentFlowId,
          payment_action: requestType,
          payment_method: safeData?.typePay,
          point_id:
            response?.data?.check?.order?.point_id ?? safeData?.point_id,
          order_id:
            response?.data?.check?.order?.order_id ??
            response?.data?.order_id ??
            safeData?.order_id,
          has_payment_session: Boolean(response?.data?.pay),
          outcome: requestFailed ? 'failure' : 'success',
          reason: requestFailed ? 'backend_rejected' : undefined,
          duration_ms: Date.now() - paymentStartedAt,
          http_status: response?.status,
          backend_request_id: response?.headers?.['x-request-id'],
        });
      }

      if (typeof response.data == 'string') {
        return {
          st: false,
          text: response.data,
        };
      }

      return response.data;
    })
    .catch((error) => {
      console.error(error);

      const lastUrl =
        error?.jacoAttemptMeta?.requestUrl ||
        `${DEFAULT_API_BASE_URL}${module}`;
      const responseStatus = error?.response?.status ?? null;
      const errorCode = String(error?.code || '').toUpperCase() || null;
      const isRetryable = isRetryableApiError(error);

      if (trackAuthRequest) {
        trackAuthClientEvent('request_network_error', {
          flow_id: flowId,
          auth_action: requestType,
          screen: authScreenForAction(requestType),
          number: safeData?.number,
          outcome: 'error',
          reason: 'request_exception',
          duration_ms: Date.now() - authStartedAt,
          http_status: responseStatus,
          network_code: errorCode,
          backend_request_id: error?.response?.headers?.['x-request-id'],
        });
      }

      if (trackPaymentRequest) {
        trackPaymentClientEvent('request_network_error', {
          payment_flow_id: paymentFlowId,
          payment_action: requestType,
          payment_method: safeData?.typePay,
          point_id: safeData?.point_id,
          order_id: safeData?.order_id,
          outcome: 'error',
          reason: 'request_exception',
          duration_ms: Date.now() - paymentStartedAt,
          http_status: responseStatus,
          network_code: errorCode,
          backend_request_id: error?.response?.headers?.['x-request-id'],
        });
      }

      if (shouldCaptureApiError(safeData)) {
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
      }

      if (
        isCustomSentryMonitoringEnabled() &&
        shouldReportInternetIssue(error, safeData)
      ) {
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

export async function apiAddress(city, value) {
  if (city.length > 0 && value.length > 0) {
    const urlApi = `https://suggest-maps.yandex.ru/v1/suggest?text=${city},${value}&types=geo,locality,province,area,district,street,house&print_address=1&results=7&apikey=${process.env.NEXT_PUBLIC_YANDEX_TOKEN_SUGGEST}`;

    return axios
      .post(urlApi, undefined, { timeout: getApiTimeoutMs() })
      .then((response) => {
        if (typeof response.data == 'string') {
          return {
            st: false,
            text: response.data,
          };
        }

        return response.data;
      })
      .catch((error) => {
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
