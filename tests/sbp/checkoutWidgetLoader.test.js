import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ensureYooMoneyCheckoutWidget, getPaymentWidgetErrorCode } from '../../utils/checkoutWidgetLoader';
let scripts;
class Script extends EventTarget {
  remove() { scripts = scripts.filter((script) => script !== this); }
}
beforeEach(() => {
  vi.useFakeTimers();
  scripts = [];
  vi.stubGlobal('window', {});
  vi.stubGlobal('document', {
    querySelector: () => scripts[0] || null,
    createElement: () => new Script(),
    head: { appendChild: (script) => scripts.push(script) },
  });
});
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe('загрузчик платёжного виджета', () => {
  it('сохраняет только документированный код ошибки и не копирует сырой callback', () => {
    expect(getPaymentWidgetErrorCode('token_expired')).toBe('token_expired');
    expect(getPaymentWidgetErrorCode({ error: { code: 'INVALID_TOKEN' }, token: 'private' })).toBe('invalid_token');
    expect(getPaymentWidgetErrorCode({ code: 'internal_service_error', message: 'private' })).toBe('internal_service_error');
    expect(getPaymentWidgetErrorCode('private-token-or-error')).toBe('unknown');
    expect(getPaymentWidgetErrorCode(undefined)).toBe('unknown');
  });
  it('одновременно загружает только один script и делится результатом', async () => {
    const first = ensureYooMoneyCheckoutWidget();
    const second = ensureYooMoneyCheckoutWidget();
    expect(second).toBe(first);
    expect(scripts).toHaveLength(1);
    const Widget = function () {};
    window.YooMoneyCheckoutWidget = Widget;
    scripts[0].dispatchEvent(new Event('load'));
    expect(await first).toBe(Widget);
    expect(await second).toBe(Widget);
  });
  it('после ошибки удаляет сломанный script и разрешает повтор', async () => {
    const onFailure = vi.fn();
    const secondFailure = vi.fn();
    const first = ensureYooMoneyCheckoutWidget(12000, onFailure);
    expect(ensureYooMoneyCheckoutWidget(12000, secondFailure)).toBe(first);
    scripts[0].dispatchEvent(new Event('error'));
    expect(await first).toBe(null);
    expect(onFailure).toHaveBeenCalledExactlyOnceWith('script_load_error');
    expect(secondFailure).toHaveBeenCalledExactlyOnceWith('script_load_error');
    expect(scripts).toHaveLength(0);
    const retry = ensureYooMoneyCheckoutWidget();
    const Widget = function () {};
    window.YooMoneyCheckoutWidget = Widget;
    scripts[0].dispatchEvent(new Event('load'));
    expect(await retry).toBe(Widget);
  });
  it('ограничивает ожидание существующего зависшего script', async () => {
    scripts.push(new Script());
    const onFailure = vi.fn();
    const waiting = ensureYooMoneyCheckoutWidget(500, onFailure);
    await vi.advanceTimersByTimeAsync(500);
    expect(await waiting).toBe(null);
    expect(onFailure).toHaveBeenCalledExactlyOnceWith('script_timeout');
    expect(scripts).toHaveLength(0);
  });
  it('возвращает null при исключении DOM вместо необработанного rejection', async () => {
    document.querySelector = () => { throw new Error('DOM unavailable'); };
    const onFailure = vi.fn();
    expect(await ensureYooMoneyCheckoutWidget(12000, onFailure)).toBe(null);
    expect(onFailure).toHaveBeenCalledExactlyOnceWith('script_dom_error');
  });
  it('ошибка диагностического callback не влияет на результат загрузки', async () => {
    const waiting = ensureYooMoneyCheckoutWidget(500, () => { throw new Error('telemetry unavailable'); });
    await vi.advanceTimersByTimeAsync(500);
    expect(await waiting).toBe(null);
  });
  it('не запрашивает уже загруженный виджет', async () => {
    const Widget = function () {};
    window.YooMoneyCheckoutWidget = Widget;
    expect(await ensureYooMoneyCheckoutWidget()).toBe(Widget);
    expect(scripts).toHaveLength(0);
  });
});
