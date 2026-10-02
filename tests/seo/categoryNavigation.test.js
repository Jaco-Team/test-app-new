import { describe, expect, it } from 'vitest';
import {
  categoryHref,
  isCityHomePath,
  isPlainCategoryClick,
} from '@/utils/categoryNavigation';

describe('ссылки на категории', () => {
  it('ведёт на отдельную категорию текущего города', () => {
    expect(categoryHref('samara', 'firmennye-rolly')).toBe(
      '/samara/menu/firmennye-rolly'
    );
    expect(categoryHref('togliatti', 'pizza')).toBe('/togliatti/menu/pizza');
  });

  it('распознаёт путь городской главной независимо от query', () => {
    expect(isCityHomePath('/samara', 'samara')).toBe(true);
    expect(isCityHomePath('/samara?category=firmennye-rolly', 'samara')).toBe(
      true
    );
    expect(isCityHomePath('/samara/menu', 'samara')).toBe(false);
    expect(isCityHomePath('/samara/menu/firmennye-rolly', 'samara')).toBe(
      false
    );
    expect(isCityHomePath('/togliatti', 'samara')).toBe(false);
    expect(isCityHomePath('/SAMARA/#menu', 'samara')).toBe(true);
    expect(isCityHomePath('/%73amara', 'samara')).toBe(true);
    expect(isCityHomePath('/%FF', 'samara')).toBe(false);
  });

  it('не перехватывает открытие ссылки в новой вкладке', () => {
    const click = {
      button: 0,
      defaultPrevented: false,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    };

    expect(isPlainCategoryClick(click)).toBe(true);
    expect(isPlainCategoryClick({ ...click, metaKey: true })).toBe(false);
    expect(isPlainCategoryClick({ ...click, ctrlKey: true })).toBe(false);
    expect(isPlainCategoryClick({ ...click, button: 1 })).toBe(false);
  });
});
