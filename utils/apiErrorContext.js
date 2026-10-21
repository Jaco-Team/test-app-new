const BACKGROUND_ACTIONS = new Set(['get_my_count_orders_promos']);

export function apiErrorContext({ module, source, requestMeta, error }) {
  const status = error?.response?.status || null;
  const code = error?.code || null;
  const action = typeof requestMeta?.type === 'string' && /^[a-z0-9_]+$/i.test(requestMeta.type)
    ? requestMeta.type.toLowerCase() : 'unknown';
  const rawId = error?.response?.headers?.['x-request-id'];
  const requestId = typeof rawId === 'string' && /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(rawId) ? rawId : null;
  const cancelled = code === 'ERR_CANCELED' || error?.__CANCEL__ === true;
  const failure = cancelled ? 'cancelled' : status ? 'http' : code === 'ECONNABORTED' || code === 'ETIMEDOUT' ? 'timeout' : 'network';
  const background = BACKGROUND_ACTIONS.has(action);
  return {
    skip: cancelled,
    level: background && !status ? 'warning' : 'error',
    tags: {
      kind: 'api_request_failed', api_module: module || 'root', api_source: source,
      api_action: action, failure_type: failure,
      ...(status ? { http_status: String(status) } : {}),
      ...(code ? { error_code: String(code) } : {}),
    },
    fingerprint: ['api-request-failed', source, module || 'root', action, String(status || code || 'unknown')],
    requestId,
  };
}
