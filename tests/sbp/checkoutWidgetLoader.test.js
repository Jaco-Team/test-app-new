import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ensureYooMoneyCheckoutWidget } from '../../utils/checkoutWidgetLoader';
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
    const first = ensureYooMoneyCheckoutWidget();
    scripts[0].dispatchEvent(new Event('error'));
    expect(await first).toBe(null);
    expect(scripts).toHaveLength(0);
    const retry = ensureYooMoneyCheckoutWidget();
    const Widget = function () {};
    window.YooMoneyCheckoutWidget = Widget;
    scripts[0].dispatchEvent(new Event('load'));
    expect(await retry).toBe(Widget);
  });
  it('ограничивает ожидание существующего зависшего script', async () => {
    scripts.push(new Script());
    const waiting = ensureYooMoneyCheckoutWidget(500);
    await vi.advanceTimersByTimeAsync(500);
    expect(await waiting).toBe(null);
    expect(scripts).toHaveLength(0);
  });
  it('возвращает null при исключении DOM вместо необработанного rejection', async () => {
    document.querySelector = () => { throw new Error('DOM unavailable'); };
    expect(await ensureYooMoneyCheckoutWidget()).toBe(null);
  });
  it('не запрашивает уже загруженный виджет', async () => {
    const Widget = function () {};
    window.YooMoneyCheckoutWidget = Widget;
    expect(await ensureYooMoneyCheckoutWidget()).toBe(Widget);
    expect(scripts).toHaveLength(0);
  });
});
