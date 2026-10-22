import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { getByRole, queryByRole } from '@testing-library/dom';
import { commands, page } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RecommendationToast from '../../modules/recommendations/recommendationToast';
import { notifyRecommendationAdded, RECOMMENDATION_FEEDBACK_DURATION_MS } from '../../utils/recommendationFeedback';
import '../../styles/recommendationToast.scss';

let host;
let root;
beforeEach(async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  await act(async () => root.render(<RecommendationToast />));
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.useRealTimers();
});
const show = async () => act(async () => notifyRecommendationAdded());

describe('подтверждение добавления рекомендации', () => {
  it('показывается через portal и скрывается после общего срока', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    await show();
    expect(getByRole(document.body, 'status').textContent).toBe('Готово! Товар добавлен в корзину');
    expect(host.querySelector('[role="status"]')).toBe(null);
    await act(async () => vi.advanceTimersByTimeAsync(RECOMMENDATION_FEEDBACK_DURATION_MS));
    expect(queryByRole(document.body, 'status')).toBe(null);
  });
  it('повторное добавление обновляет одно уведомление и отсчитывает срок заново', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    await show();
    await act(async () => vi.advanceTimersByTimeAsync(2000));
    await show();
    expect(document.querySelectorAll('.RecommendationAddedToast')).toHaveLength(1);
    await act(async () => vi.advanceTimersByTimeAsync(1500));
    expect(queryByRole(document.body, 'status')).not.toBe(null);
    await act(async () => vi.advanceTimersByTimeAsync(1500));
    expect(queryByRole(document.body, 'status')).toBe(null);
  });
  it('на телефоне не перекрывает кнопку под полосой и закрывается при взаимодействии', async () => {
    await page.viewport(375, 900);
    await show();
    const rect = getByRole(document.body, 'status').getBoundingClientRect();
    const action = vi.fn();
    const button = document.createElement('button');
    button.textContent = 'Кнопка за уведомлением';
    button.style.cssText = `position: fixed; left: ${rect.left}px; top: ${rect.top}px; width: ${rect.width}px; height: ${rect.height}px;`;
    button.onclick = action;
    host.appendChild(button);
    await act(async () => commands.clickRecommendationToast());
    expect(action).toHaveBeenCalledOnce();
    expect(queryByRole(document.body, 'status')).toBe(null);
    expect(document.querySelector('[role="dialog"], .MuiBackdrop-root')).toBe(null);
  });
});

describe.each([320, 360, 375, 667, 768, 1440, 1920])('уведомление на ширине %s px', width => {
  it('сохраняет читаемость, цвет и геометрию без горизонтального выхода', async () => {
    await page.viewport(width, 900);
    await show();
    const notice = getByRole(document.body, 'status');
    const bounds = notice.getBoundingClientRect();
    const style = getComputedStyle(notice);
    expect(style.backgroundColor).toBe('rgb(219, 246, 192)');
    expect(style.pointerEvents).toBe('none');
    expect(bounds.left).toBeGreaterThanOrEqual(0);
    expect(bounds.right).toBeLessThanOrEqual(width + 1);
    expect(parseFloat(getComputedStyle(notice.querySelector('span')).fontSize)).toBeGreaterThanOrEqual(13);
    expect(Math.abs(bounds.height - (width <= 667 ? 45 : width <= 990 ? 48 : 52))).toBeLessThanOrEqual(1);
    if (width <= 667) expect(Math.abs(bounds.width - width)).toBeLessThanOrEqual(1);
    else expect(bounds.width).toBeGreaterThanOrEqual(width <= 990 ? 280 : 350);
  });
});
