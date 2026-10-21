import React, { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getByRole } from '@testing-library/dom';
import { commands, page, userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RecommendationMobileList from '../../modules/recommendations/recommendationMobileList';
import '../../styles/home/cardItemPC.scss';
import '../../styles/home/cardItemMobile.scss';
import '../../styles/header/basketPC.scss';
import '../../styles/header/basketModalPC.scss';
import '../../styles/cart/cartMobile.scss';
import '../../styles/recommendations.scss';
import '../../styles/recommendationLayout.scss';

const names = [
  'Фирменный острый соус с копчёной паприкой и чесноком',
  'Картофель фри', 'Васаби', 'Соевый соус', 'Имбирь', 'Морс', 'Сырный соус', 'Чесночный соус',
];
const items = names.map((name, index) => ({ id: 900 + index, item_id: 900 + index, name, one_price: 30 + index, img_app: '', weight: 100, count_part: '1' }));
const opened = vi.fn();
const added = vi.fn();
const removed = vi.fn();
let root;
let host;
let baseStyle;

function Fixture({ variant = 'product', recommendations = items, limit = 8, requiresRecommendationsEnabled = true, initial = {}, title }) {
  const [counts, setCounts] = useState(initial);
  return <RecommendationMobileList
    variant={variant}
    recommendations={recommendations}
    requiresRecommendationsEnabled={requiresRecommendationsEnabled}
    title={title || (variant === 'cart' ? 'Подобрали для вас' : 'С этим блюдом заказывают')}
    limit={limit}
    getCount={item => counts[item.id] || 0}
    onOpen={opened}
    onAdd={(item, event, position) => {
      added(item, position);
      setCounts(previous => ({ ...previous, [item.id]: (previous[item.id] || 0) + 1 }));
    }}
    onRemove={(item, event, position) => {
      removed(item, position);
      setCounts(previous => ({ ...previous, [item.id]: Math.max(0, (previous[item.id] || 0) - 1) }));
    }}
  />;
}

const cards = () => [...host.querySelectorAll('.RecommendationModalCardMobileItem')];
const rail = () => host.querySelector('.RecommendationModalCardMobileList');
const price = card => card.querySelector('.RecommendationModalCardMobilePrice');
const render = async props => {
  await act(async () => root.render(<Fixture {...props} />));
};
const click = async element => act(async () => userEvent.click(element));

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  opened.mockReset(); added.mockReset(); removed.mockReset();
  baseStyle = document.createElement('style');
  baseStyle.textContent = 'html, body { margin: 0; } body { font-family: Arial, sans-serif; }';
  document.head.appendChild(baseStyle);
  host = document.createElement('div');
  host.dataset.recommendationTest = '';
  host.style.cssText = 'width: min(calc(100% - 24px), 480px); margin: 12px;';
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove(); baseStyle.remove();
});

describe('реальная лента рекомендаций', () => {
  it('цена переходит в счётчик, уменьшение до нуля возвращает цену без открытия блюда', async () => {
    await page.viewport(375, 900);
    await render();
    await click(price(cards()[0]));
    expect(cards()[0].dataset.selected).toBe('true');
    expect(getComputedStyle(cards()[0]).backgroundColor).toBe('rgb(242, 242, 242)');
    expect(getComputedStyle(cards()[0].querySelector('.RecommendationModalCardMobileCounter')).backgroundColor).toBe('rgb(255, 255, 255)');
    expect(cards()[0].querySelector('.RecommendationModalCardMobileCounterValue').textContent).toBe('1');
    await click(getByRole(cards()[0], 'button', { name: `Добавить «${names[0]}» в корзину` }));
    expect(cards()[0].querySelector('.RecommendationModalCardMobileCounterValue').textContent).toBe('2');
    await click(getByRole(cards()[0], 'button', { name: `Уменьшить количество «${names[0]}»` }));
    await click(getByRole(cards()[0], 'button', { name: `Уменьшить количество «${names[0]}»` }));
    expect(price(cards()[0])).not.toBe(null);
    expect(cards()[0].dataset.selected).not.toBe('true');
    expect(added).toHaveBeenCalledTimes(2);
    expect(removed).toHaveBeenCalledTimes(2);
    expect(opened).not.toHaveBeenCalled();
  });
  it('Enter и Space на карточке открывают блюдо; клавиатура кнопки добавляет без открытия', async () => {
    await page.viewport(375, 900);
    await render();
    getByRole(cards()[0], 'button', { name: `Открыть блюдо «${names[0]}»` }).focus();
    await act(async () => userEvent.keyboard('{Enter}'));
    await act(async () => userEvent.keyboard(' '));
    expect(opened).toHaveBeenCalledTimes(2);
    opened.mockClear();
    price(cards()[0]).focus();
    await act(async () => userEvent.keyboard('{Enter}'));
    expect(added).toHaveBeenCalledOnce();
    expect(opened).not.toHaveBeenCalled();
  });
  it('пустой или ошибочный список не создаёт пустой блок', async () => {
    await render({ recommendations: [] });
    expect(host.textContent).toBe('');
    await render({ recommendations: null });
    expect(host.textContent).toBe('');
    await render({ recommendations: { st: false } });
    expect(host.textContent).toBe('');
  });
  it('сохраняет порядок выдачи и согласованный лимит', async () => {
    await render({ limit: 3 });
    expect(cards()).toHaveLength(3);
    expect(cards().map(card => card.querySelector('.RecommendationModalCardMobileName').textContent)).toEqual(names.slice(0, 3));
  });
  it('соусы используют cart-вариант и собственный заголовок независимо от флага рекомендаций', async () => {
    await render({ variant: 'cart', requiresRecommendationsEnabled: false, title: 'Добавим соусы и приправы?', initial: { 900: 2 } });
    expect(host.querySelector('[data-recommendation-variant]').dataset.recommendationVariant).toBe('cart');
    expect(host.textContent).toContain('Добавим соусы и приправы?');
    expect(cards()[0].classList.contains('RecommendationModalCardMobileItemSelected')).toBe(true);
    expect(cards()[0].querySelector('.RecommendationModalCardMobileCounterValue').textContent).toBe('2');
  });
  it('drag мышью двигает ленту без открытия товара; кнопка после завершения доступна', async () => {
    await page.viewport(375, 900);
    await render();
    expect(rail().scrollWidth).toBeGreaterThan(rail().clientWidth);
    await act(async () => commands.dragRecommendation());
    expect(rail().scrollLeft).toBeGreaterThan(30);
    expect(opened).not.toHaveBeenCalled();
    await new Promise(resolve => setTimeout(resolve, 380));
    const target = cards()[1];
    await click(price(target));
    expect(added).toHaveBeenCalledOnce();
    expect(opened).not.toHaveBeenCalled();
  });
  it('нативный touch-свайп двигает ленту без случайного открытия/добавления', async () => {
    await page.viewport(375, 900);
    await render();
    await act(async () => commands.swipeRecommendation());
    await expect.poll(() => rail().scrollLeft).toBeGreaterThan(20);
    expect(opened).not.toHaveBeenCalled();
    expect(added).not.toHaveBeenCalled();
    await expect.poll(() => rail().classList.contains('RecommendationModalCardMobileListDragging')).toBe(false);
  });
});

describe.each([320, 360, 375, 667, 768, 1440, 1920])('геометрия и читаемость при %s px', width => {
  it.each(['product', 'cart'])('%s: реальные стили не уменьшают текст и не выносят контент за экран', async variant => {
    await page.viewport(width, 900);
    if (variant === 'cart') host.style.cssText = 'width: calc(100% - 24px); max-width: 1200px; margin: 12px;';
    await render({ variant });
    const card = cards()[0];
    const bounds = card.getBoundingClientRect();
    const image = card.querySelector('.RecommendationModalCardMobileImage').getBoundingClientRect();
    const button = price(card).getBoundingClientRect();
    const name = card.querySelector('.RecommendationModalCardMobileName').getBoundingClientRect();
    const tablet = width >= 668 && width <= 990;
    expect(bounds.width).toBeGreaterThanOrEqual(134);
    expect(bounds.width).toBeLessThanOrEqual(tablet ? 146 : 142);
    expect(bounds.height).toBeGreaterThanOrEqual(200);
    expect(bounds.height).toBeLessThanOrEqual(220);
    expect(image.width).toBeGreaterThanOrEqual(110);
    expect(image.width).toBeLessThanOrEqual(118);
    expect(Math.abs(button.height - 38)).toBeLessThanOrEqual(1);
    expect(name.bottom).toBeLessThanOrEqual(button.top + 1);
    expect(button.bottom).toBeLessThanOrEqual(bounds.bottom + 1);
    expect(getComputedStyle(price(card)).backgroundColor).toBe('rgb(242, 242, 242)');
    expect(getComputedStyle(price(card)).color).toBe('rgb(51, 51, 51)');
    expect(getComputedStyle(card).borderTopColor).toBe('rgb(229, 229, 229)');
    expect(getComputedStyle(card.querySelector('.RecommendationModalCardMobileName')).fontWeight).toBe('500');
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width);
    const textNodes = [...host.querySelectorAll('.RecommendationModalCardMobileTitle, .RecommendationModalCardMobileName, .RecommendationModalCardMobileName span, .RecommendationModalCardMobilePrice')];
    for (const node of textNodes) {
      expect(parseFloat(getComputedStyle(node).fontSize)).toBeGreaterThanOrEqual(13);
    }
    expect(getComputedStyle(rail()).overflowX).toMatch(/auto|scroll/);
    expect(getComputedStyle(host.querySelector('.RecommendationModalCardMobileTitle')).textAlign).toBe(variant === 'product' && width <= 667 ? 'center' : 'left');
    expect(host.querySelector('.RecommendationModalCardMobileMeta')).toBe(null);
  });
});


describe.each([375, 768, 1440])('соседство с реальными legacy-стилями при %s px', width => {
  it.each(['product', 'cart'])('%s: родительские селекторы не возвращают vw-шрифт и другую геометрию', async variant => {
    await page.viewport(width, 900);
    // Переносим mount-node в ту же цепочку классов, что используется приложением.
    const shell = document.createElement('div');
    if (variant === 'product' && width <= 667) {
      shell.id = 'modalCardItemMobile';
      shell.innerHTML = '<div class="ContainerModalCardMobile"><div class="ItemModalCardMobile"><div class="ItemContainer"></div></div></div>';
      shell.querySelector('.ItemContainer').appendChild(host);
    } else if (variant === 'product') {
      shell.className = 'modalCardItemPC';
      shell.innerHTML = '<div class="MuiDialog-paper"><div class="modalItemPC modalItemPC_hasRecommendations"><div class="MuiGrid-root"><div class="SecondItem SecondItem_hasRecommendations"><div class="RecommendationModalCardPCInline"></div></div></div></div></div>';
      shell.querySelector('.RecommendationModalCardPCInline').appendChild(host);
    } else if (width <= 667) {
      shell.className = 'CartMobile';
      shell.innerHTML = '<div class="CartFormMobile"><div class="cartRecommendationsMobile"></div></div>';
      shell.querySelector('.cartRecommendationsMobile').appendChild(host);
    } else {
      shell.id = 'simple-popover';
      shell.innerHTML = '<div class="MuiPaper-root"><div class="basketRecommendations"></div></div>';
      shell.querySelector('.basketRecommendations').appendChild(host);
    }
    document.body.appendChild(shell);
    try {
      await render({ variant });
      const card = cards()[0];
      const font = parseFloat(getComputedStyle(card.querySelector('.RecommendationModalCardMobileName span')).fontSize);
      expect(font).toBeGreaterThanOrEqual(13);
      const expectedWidth = width <= 667 ? 136 : width <= 990 ? 144 : 140;
      expect(Math.abs(card.getBoundingClientRect().width - expectedWidth)).toBeLessThanOrEqual(1);
      expect(Math.abs(price(card).getBoundingClientRect().height - 38)).toBeLessThanOrEqual(1);
      expect(getComputedStyle(rail()).overflowX).toMatch(/auto|scroll/);
    } finally {
      document.body.appendChild(host);
      shell.remove();
    }
  });
});

// Regression реальной mobile-корзины: у flex-child нет собственного width/min-width.
// Лента должна сжиматься за счёт application CSS, а не ограничений тестового host.
describe.each([320, 360, 375, 667])('интеграция .CartMobileContainer при %s px', width => {
  it('не расширяет flex-родителя до длины ленты и оставляет минус доступным на экране', async () => {
    await page.viewport(width, 1100);
    host.className = 'CartMobile MuiGrid-root MuiGrid-container';
    host.style.cssText = 'display: flex;';
    await act(async () => root.render(
      <div className="CartMobileContainer">
        <div className="CartMobileText">Оформить заказ</div>
        <div className="CartItemDopText CartExtrasHeading"><span>Не забудьте про приборы</span></div>
        <Fixture
          variant="cart"
          requiresRecommendationsEnabled={false}
          initial={{ 900: 1 }}
          title="Добавим соусы и приправы?"
        />
        <div className="CartTotal"><span>Итого:</span><span>1 648 ₽</span></div>
      </div>
    ));
    const container = host.querySelector('.CartMobileContainer');
    const slot = host.querySelector('.RecommendationModalCardMobile');
    const firstCard = cards()[0];
    const minus = getByRole(firstCard, 'button', { name: `Уменьшить количество «${names[0]}»` });
    const containerBounds = container.getBoundingClientRect();
    const slotBounds = slot.getBoundingClientRect();
    const railBounds = rail().getBoundingClientRect();
    const minusBounds = minus.getBoundingClientRect();
    expect(containerBounds.width).toBeLessThanOrEqual(width);
    expect(containerBounds.left).toBeGreaterThanOrEqual(0);
    expect(slotBounds.left).toBeGreaterThanOrEqual(0);
    expect(slotBounds.right).toBeLessThanOrEqual(width);
    expect(railBounds.right).toBeLessThanOrEqual(width);
    expect(rail().scrollWidth).toBeGreaterThan(rail().clientWidth);
    expect(getComputedStyle(rail()).overflowX).toMatch(/auto|scroll/);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width);
    expect(minusBounds.left).toBeGreaterThanOrEqual(0);
    expect(minusBounds.right).toBeLessThanOrEqual(width);
    expect(parseFloat(getComputedStyle(host.querySelector('.CartExtrasHeading span')).fontSize)).toBe(15);
    await click(minus);
    expect(removed).toHaveBeenCalledOnce();
    expect(price(cards()[0])).not.toBe(null);
    expect(opened).not.toHaveBeenCalled();
  });
});

// Regression настоящего popover: соседние блоки переполняют ограниченную по
// высоте flex-колонку. Ленты должны сохранять полную высоту и прокручивать корзину.
describe.each([768, 1440, 1920])('интеграция flex-popover корзины при %s px', width => {
  it('не сжимает обёртки лент и сохраняет всю кнопку цены доступной для клика', async () => {
    await page.viewport(width, 900);
    host.id = 'simple-popover';
    host.style.cssText = 'position: fixed; inset: 0; height: 620px; margin: 0;';
    await act(async () => root.render(
      <div className="MuiPaper-root MuiPopover-paper MuiPaper-elevation8 MuiPaper-rounded" style={{ right: 0, position: 'absolute' }}>
        <div>
          <div style={{ minHeight: 340, flexShrink: 0 }}>Ваша корзина: товары и приборы</div>
          <div className="basketRecommendations">
            <Fixture variant="cart" requiresRecommendationsEnabled={false} title="Добавим соусы и приправы?" />
          </div>
          <div className="basketRecommendations">
            <Fixture variant="cart" title="Подобрали для вас" />
          </div>
          <div style={{ minHeight: 100, flexShrink: 0 }}>Итого: 1 648 ₽</div>
        </div>
      </div>
    ));
    const paper = host.querySelector('.MuiPopover-paper');
    const scroller = paper.firstElementChild;
    expect(getComputedStyle(scroller).display).toBe('flex');
    expect(getComputedStyle(scroller).flexDirection).toBe('column');
    expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight);
    const wrappers = [...host.querySelectorAll('.basketRecommendations')];
    for (const wrapper of wrappers) {
      const rowCards = [...wrapper.querySelectorAll('.RecommendationModalCardMobileItem')];
      const bounds = wrapper.getBoundingClientRect();
      expect(bounds.height).toBeGreaterThanOrEqual(width <= 990 ? 215 : 209);
      expect(bounds.bottom + 1).toBeGreaterThanOrEqual(Math.max(...rowCards.map(card => card.getBoundingClientRect().bottom)));
      expect(getComputedStyle(wrapper).overflowY).toBe('visible');
    }
    const targetCard = wrappers[1].querySelector('.RecommendationModalCardMobileItem');
    const targetPrice = price(targetCard);
    targetPrice.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
    const buttonBounds = targetPrice.getBoundingClientRect();
    const paperBounds = paper.getBoundingClientRect();
    expect(buttonBounds.height).toBe(38);
    expect(buttonBounds.top).toBeGreaterThanOrEqual(paperBounds.top);
    expect(buttonBounds.bottom).toBeLessThanOrEqual(paperBounds.bottom);
    expect(wrappers[1].getBoundingClientRect().bottom + 1).toBeGreaterThanOrEqual(buttonBounds.bottom);
    const hit = document.elementFromPoint(buttonBounds.left + buttonBounds.width / 2, buttonBounds.bottom - 2);
    expect(targetPrice.contains(hit)).toBe(true);
    await click(targetPrice);
    expect(added).toHaveBeenCalledOnce();
    expect(targetCard.querySelector('.RecommendationModalCardMobileCounterValue').textContent).toBe('1');
    expect(opened).not.toHaveBeenCalled();
  });
});
