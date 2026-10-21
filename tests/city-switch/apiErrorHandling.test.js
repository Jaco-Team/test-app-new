import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiErrorContext } from '../../utils/apiErrorContext';

const mocks = vi.hoisted(() => {
  const scope = { setTag: vi.fn(), setLevel: vi.fn(), setContext: vi.fn(), setExtra: vi.fn(), setFingerprint: vi.fn() };
  return { post: vi.fn(), scope, capture: vi.fn(), breadcrumb: vi.fn() };
});
vi.mock('axios', () => ({ default: { post: mocks.post } }));
vi.mock('@sentry/nextjs', () => ({
  withScope: (cb) => cb(mocks.scope), captureException: mocks.capture, addBreadcrumb: mocks.breadcrumb,
}));
vi.mock('@/utils/clientMonitoring', () => ({
  emitInternetIssue: vi.fn(), getClientNetworkContext: () => ({ online: true }), isCustomSentryMonitoringEnabled: () => true,
}));
import { api } from '../../components/api.js';

beforeEach(() => { vi.clearAllMocks(); vi.spyOn(console, 'error').mockImplementation(() => {}); });
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

describe('ошибки API при оформлении и чтении данных', () => {
  it.each([false, true])('не повторяет создание заказа после таймаута даже с forceRetry=%s', async (forceRetry) => {
    const error = Object.assign(new Error('timeout'), { code: 'ECONNABORTED' });
    mocks.post.mockRejectedValue(error);
    await api('cart', { type: 'create_order_pre', cart: 'synthetic-cart', token: 'private-token', __forceRetry: forceRetry });
    expect(mocks.post).toHaveBeenCalledTimes(1);
    expect(mocks.scope.setTag).toHaveBeenCalledWith('api_action', 'create_order_pre');
    expect(mocks.scope.setTag).toHaveBeenCalledWith('failure_type', 'timeout');
    expect(mocks.scope.setExtra).toHaveBeenCalledWith('attemptMeta', expect.objectContaining({ attempt: 1, canRetry: false, timeoutMs: 12000, durationMs: expect.any(Number) }));
    expect(JSON.stringify(mocks.scope.setExtra.mock.calls)).not.toContain('private-token');
    expect(JSON.stringify(mocks.scope.setExtra.mock.calls)).not.toContain('synthetic-cart');
  });
  it('повторяет безопасное чтение после временного сбоя без ложной ошибки Sentry при восстановлении', async () => {
    vi.useFakeTimers();
    mocks.post.mockRejectedValueOnce(Object.assign(new Error('network'), { code: 'ERR_NETWORK' })).mockResolvedValueOnce({ data: { points: [] } });
    const result = api('cart', { type: 'get_point_list' });
    await vi.advanceTimersByTimeAsync(300);
    expect(await result).toEqual({ points: [] });
    expect(mocks.post).toHaveBeenCalledTimes(2);
    expect(mocks.capture).not.toHaveBeenCalled();
  });
  it('не повторяет 422 и связывает ошибку с серверным request ID', async () => {
    mocks.post.mockRejectedValue(Object.assign(new Error('invalid'), { code: 'ERR_BAD_REQUEST', response: { status: 422, headers: { 'x-request-id': 'request-123' } } }));
    await api('home', { type: 'get_page_info', page: 'menu', city_id: 'samara' });
    expect(mocks.post).toHaveBeenCalledTimes(1);
    expect(mocks.scope.setExtra).toHaveBeenCalledWith('backend_request_id', 'request-123');
    expect(mocks.scope.setFingerprint).toHaveBeenCalledWith(['api-request-failed', 'api', 'home', 'get_page_info', '422']);
  });
  it('не отправляет управляемую отмену как ошибку сервиса', async () => {
    mocks.post.mockRejectedValue(Object.assign(new Error('cancelled'), { code: 'ERR_CANCELED' }));
    await api('cart', { type: 'get_point_list' });
    expect(mocks.post).toHaveBeenCalledTimes(1);
    expect(mocks.capture).not.toHaveBeenCalled();
  });
  it('отделяет фоновые счётчики и не принимает произвольные заголовки в диагностику', () => {
    const context = apiErrorContext({ module: 'zakazy', source: 'api', requestMeta: { type: 'get_my_count_orders_promos' }, error: { code: 'ERR_NETWORK', response: { headers: { 'x-request-id': 'bad\nvalue' } } } });
    expect(context.level).toBe('warning');
    expect(context.requestId).toBeNull();
  });
});
