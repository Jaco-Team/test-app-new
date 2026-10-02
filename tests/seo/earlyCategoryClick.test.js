import vm from 'node:vm';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearHomeCategorySelectionOnNavigation,
  earlyCategoryClickScript,
} from '@/utils/earlyCategoryClick';

function browser(pathname = '/samara') {
  vi.useFakeTimers();
  const listeners = {};
  const windowListeners = {};
  const targets = new Map();
  const links = [];
  let mutation;
  const window = {
    location: { pathname },
    setTimeout,
    clearTimeout,
    addEventListener: (name, fn) => {
      windowListeners[name] = fn;
    },
  };
  const document = {
    documentElement: {},
    addEventListener: (name, fn) => {
      listeners[name] = fn;
    },
    getElementById: (id) => targets.get(id),
    getElementsByName: () => [],
    querySelectorAll: () => links,
  };
  class MutationObserver {
    constructor(fn) {
      mutation = fn;
    }
    observe() {}
    disconnect() {
      mutation = null;
    }
  }
  vm.runInNewContext(earlyCategoryClickScript, {
    window,
    document,
    MutationObserver,
  });

  function click(link, overrides = {}) {
    const event = {
      button: 0,
      defaultPrevented: false,
      target: { closest: () => link },
      preventDefault() {
        this.defaultPrevented = true;
      },
      ...overrides,
    };
    listeners.click(event);
    return event;
  }

  function link(id, city = 'samara') {
    const attrs = {
      'data-home-category': city,
      'data-category-target': `cat${id}`,
    };
    const anchor = {
      attrs,
      pathname: `/${city}/menu/category-${id}`,
      target: '',
      getAttribute: (key) => attrs[key],
      hasAttribute: (key) => key in attrs,
      getClientRects: () => [{}],
      click: vi.fn(() => {
        expect(click(anchor).defaultPrevented).toBe(false);
      }),
    };
    links.push(anchor);
    return anchor;
  }

  return {
    window,
    link,
    click,
    target: (id) => targets.set(`cat${id}`, { getClientRects: () => [{}] }),
    mutate: () => mutation?.(),
    back: () => windowListeners.popstate(),
  };
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('ранний выбор категории до загрузки приложения', () => {
  it('сохраняет клик и выполняет его один раз после готовности меню и каталога', () => {
    const page = browser();
    const pizza = page.link(10);
    expect(page.click(pizza).defaultPrevented).toBe(true);
    pizza.attrs['data-category-ready'] = 'true';
    page.mutate();
    vi.advanceTimersByTime(200);
    expect(pizza.click).not.toHaveBeenCalled();
    page.target(10);
    page.mutate();
    vi.advanceTimersByTime(200);
    expect(pizza.click).toHaveBeenCalledTimes(1);
    page.mutate();
    vi.advanceTimersByTime(200);
    expect(pizza.click).toHaveBeenCalledTimes(1);
    expect(page.window.__jacoHomeCategorySelection.city).toBe('samara');
  });

  it('выполняет последний ранний выбор, включая смену мобильной раскладки', () => {
    const page = browser();
    const pizza = page.link(10);
    const rolls = page.link(20);
    page.click(pizza);
    page.click(rolls);
    const mobileRolls = page.link(20);
    mobileRolls.attrs['data-category-ready'] = 'true';
    page.target(20);
    page.mutate();
    vi.advanceTimersByTime(200);
    expect(pizza.click).not.toHaveBeenCalled();
    expect(rolls.click).not.toHaveBeenCalled();
    expect(mobileRolls.click).toHaveBeenCalledTimes(1);
  });

  it('не блокирует готовый обработчик при наличии категории', () => {
    const page = browser();
    const pizza = page.link(10);
    pizza.attrs['data-category-ready'] = 'true';
    page.target(10);
    expect(page.click(pizza).defaultPrevented).toBe(false);
    expect(page.window.__jacoHomeCategorySelection.city).toBe('samara');
  });

  it('ожидает категорию после сброса фильтров или поздней загрузки каталога', () => {
    const page = browser();
    const pizza = page.link(10);
    pizza.attrs['data-category-ready'] = 'true';
    const event = page.click(pizza);
    expect(event.defaultPrevented).toBe(true);
    expect(event.__jacoEarlyCategoryClick).toBe(true);
    page.target(10);
    page.mutate();
    vi.advanceTimersByTime(200);
    expect(pizza.click).toHaveBeenCalledTimes(1);
  });

  it.each(['metaKey', 'ctrlKey', 'shiftKey', 'altKey'])(
    'сохраняет открытие с %s',
    (key) => {
      const page = browser();
      expect(page.click(page.link(10), { [key]: true }).defaultPrevented).toBe(
        false
      );
    }
  );

  it('сохраняет среднюю кнопку, внешнюю вкладку и скачивание', () => {
    const page = browser();
    const pizza = page.link(10);
    expect(page.click(pizza, { button: 1 }).defaultPrevented).toBe(false);
    pizza.target = '_blank';
    expect(page.click(pizza).defaultPrevented).toBe(false);
    pizza.target = '';
    pizza.attrs.download = '';
    expect(page.click(pizza).defaultPrevented).toBe(false);
  });

  it.each(['/samara/menu', '/samara/menu/pizza', '/togliatti', '/'])(
    'не меняет навигацию на %s',
    (path) => {
      const page = browser(path);
      expect(page.click(page.link(10)).defaultPrevented).toBe(false);
    }
  );

  it('отбрасывает запрос при уходе с главной или навигации назад', () => {
    const page = browser();
    const pizza = page.link(10);
    page.click(pizza);
    page.back();
    pizza.attrs['data-category-ready'] = 'true';
    page.target(10);
    page.mutate();
    vi.advanceTimersByTime(200);
    expect(pizza.click).not.toHaveBeenCalled();
    expect(page.window.__jacoHomeCategorySelection).toBeUndefined();
    page.click({
      ...pizza,
      attrs: {},
      getAttribute: () => undefined,
      pathname: '/samara/contacts',
    });
    expect(pizza.click).not.toHaveBeenCalled();
  });

  it('прекращает ожидание отсутствующей категории без перехода', () => {
    const page = browser();
    const pizza = page.link(10);
    expect(page.click(pizza).defaultPrevented).toBe(true);
    vi.advanceTimersByTime(31000);
    pizza.attrs['data-category-ready'] = 'true';
    page.target(10);
    page.mutate();
    vi.advanceTimersByTime(200);
    expect(pizza.click).not.toHaveBeenCalled();
  });

  it('очищает выбор при программной смене города, сохраняя его при очистке query главной', () => {
    const page = browser();
    vi.stubGlobal('window', page.window);
    const pizza = page.link(10);
    page.click(pizza);
    clearHomeCategorySelectionOnNavigation('/samara?item=pizza');
    expect(page.window.__jacoHomeCategorySelection.city).toBe('samara');
    clearHomeCategorySelectionOnNavigation('/togliatti');
    expect(page.window.__jacoHomeCategorySelection).toBeUndefined();
    clearHomeCategorySelectionOnNavigation('/samara');
    expect(page.window.__jacoHomeCategorySelection).toBeUndefined();
    pizza.attrs['data-category-ready'] = 'true';
    page.target(10);
    page.mutate();
    vi.advanceTimersByTime(200);
    expect(pizza.click).not.toHaveBeenCalled();
  });
});
