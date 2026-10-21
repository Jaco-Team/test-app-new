import { afterEach, describe, expect, it, vi } from 'vitest';
import { observeScrollSections } from '../../utils/sectionScrollSpy';
afterEach(() => vi.unstubAllGlobals());
describe('подсветка разделов после навигации', () => {
  it('удаляет listeners и отменяет отложенный scroll при размонтировании', () => {
    const listeners = {};
    const frames = [];
    const browser = { addEventListener: vi.fn((type, cb) => { listeners[type] = cb; }), removeEventListener: vi.fn(), requestAnimationFrame: vi.fn((cb) => { frames.push(cb); return 1; }), cancelAnimationFrame: vi.fn() };
    let top = 500;
    vi.stubGlobal('window', browser);
    vi.stubGlobal('document', { getElementById: (id) => ({ getBoundingClientRect: () => ({ top: id === 'tag1' ? 0 : top }) }) });
    const change = vi.fn();
    const stop = observeScrollSections(['tag1', 'tag2'], change);
    expect(change).toHaveBeenLastCalledWith('tag1');
    listeners.scroll(); listeners.scroll();
    expect(browser.requestAnimationFrame).toHaveBeenCalledTimes(1);
    top = 0;
    frames[0]();
    expect(change).toHaveBeenLastCalledWith('tag2');
    listeners.resize(); stop();
    expect(browser.cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(browser.removeEventListener).toHaveBeenCalledTimes(2);
    change.mockClear();
    frames[1]();
    expect(change).not.toHaveBeenCalled();
  });
});
