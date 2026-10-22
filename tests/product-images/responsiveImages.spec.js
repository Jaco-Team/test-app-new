import { expect, test } from '@playwright/test';

const STORY_IDS = {
  card: 'сущности-товар-карточка--default',
  modal: 'сущности-товар-модалка--default',
  error: 'общие-элементы-адаптивное-изображение--ошибка',
};

const storyUrl = (storyId) =>
  `/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`;

const matrix = [
  { name: 'mobile', width: 500, height: 900, dpr: 2, cardWidth: 366 },
  { name: 'tablet', width: 800, height: 900, dpr: 2, cardWidth: 466 },
  { name: 'large-tablet', width: 900, height: 900, dpr: 2, cardWidth: 1168 },
  { name: 'desktop', width: 1400, height: 900, dpr: 2, cardWidth: 732 },
];

const openStory = async (browser, scenario, storyId) => {
  const context = await browser.newContext({
    viewport: { width: scenario.width, height: scenario.height },
    deviceScaleFactor: scenario.dpr,
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();

  await page.goto(storyUrl(storyId), { waitUntil: 'domcontentloaded' });

  return { context, page };
};

const waitForLoadedImage = async (page, selector = '.ResponsiveImage') => {
  const root = page.locator(selector).first();
  await expect(root).toHaveAttribute('data-image-state', 'loaded', {
    timeout: 15_000,
  });

  return root.locator('img');
};

const collectImageMetric = async (image) =>
  image.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const resource = performance
      .getEntriesByName(element.currentSrc)
      .find((entry) => entry.entryType === 'resource');

    return {
      currentSrc: element.currentSrc,
      cssWidth: Number(bounds.width.toFixed(2)),
      cssHeight: Number(bounds.height.toFixed(2)),
      devicePixelRatio: window.devicePixelRatio,
      naturalWidth: element.naturalWidth,
      durationMs: resource ? Number(resource.duration.toFixed(2)) : null,
      transferSize: resource?.transferSize || null,
      encodedBodySize: resource?.encodedBodySize || null,
    };
  });

const expectSquareGeometry = (metric) => {
  expect(metric.cssWidth).toBeGreaterThan(0);
  expect(metric.cssHeight).toBeGreaterThan(0);
  expect(Math.abs(metric.cssWidth - metric.cssHeight)).toBeLessThanOrEqual(1);
};

test.describe('responsive product images', () => {
  for (const scenario of matrix) {
    test(`card selects the ${scenario.cardWidth}px candidate at ${scenario.name}`, async ({
      browser,
    }, testInfo) => {
      const { context, page } = await openStory(
        browser,
        scenario,
        STORY_IDS.card
      );
      const image = await waitForLoadedImage(page);
      const metric = await collectImageMetric(image);

      expect(metric.currentSrc).toContain(
        `Vodopad_set_${scenario.cardWidth}x${scenario.cardWidth}.webp`
      );
      expect(metric.cssWidth * metric.devicePixelRatio).toBeLessThanOrEqual(
        scenario.cardWidth
      );
      expect(
        scenario.cardWidth / (metric.cssWidth * metric.devicePixelRatio)
      ).toBeLessThanOrEqual(1.5);
      expectSquareGeometry(metric);

      const cardBounds = await page.locator('.ItemHomePc').boundingBox();
      expect(cardBounds).not.toBeNull();
      expect(cardBounds.width).toBeLessThanOrEqual(scenario.width);
      expect(cardBounds.x).toBeGreaterThanOrEqual(0);
      expect(cardBounds.x + cardBounds.width).toBeLessThanOrEqual(
        scenario.width + 1
      );
      await testInfo.attach(`card-${scenario.name}-metrics`, {
        body: JSON.stringify(metric, null, 2),
        contentType: 'application/json',
      });

      await context.close();
    });
  }

  test('modal uses role-specific hero and thumbnail candidates', async ({
    browser,
  }, testInfo) => {
    const scenario = matrix[0];
    const { context, page } = await openStory(
      browser,
      scenario,
      STORY_IDS.modal
    );
    const hero = await waitForLoadedImage(page, '.ProductModal-image-main');
    const heroMetric = await collectImageMetric(hero);

    expect(heroMetric.currentSrc).toContain('_1168x1168.webp');
    expect(heroMetric.cssWidth).toBeGreaterThan(0);
    expect(heroMetric.cssHeight).toBeGreaterThan(0);
    expect(heroMetric.cssWidth).toBeLessThanOrEqual(scenario.width);
    expect(heroMetric.cssHeight).toBeLessThanOrEqual(350);
    await expect(hero).toHaveCSS('object-fit', 'cover');

    const heroContainerBounds = await page
      .locator('.ProductModal-image')
      .boundingBox();
    expect(heroContainerBounds).not.toBeNull();
    expect(
      Math.abs(heroContainerBounds.width - heroMetric.cssWidth)
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs(heroContainerBounds.height - heroMetric.cssHeight)
    ).toBeLessThanOrEqual(1);

    const modalBounds = await page.locator('.ProductModal').boundingBox();
    expect(modalBounds).not.toBeNull();
    expect(modalBounds.width).toBeLessThanOrEqual(scenario.width);
    expect(modalBounds.x).toBeGreaterThanOrEqual(0);
    expect(modalBounds.x + modalBounds.width).toBeLessThanOrEqual(
      scenario.width + 1
    );
    await page.getByRole('button', { name: '4 ролла' }).click();

    const thumbnail = page.locator('.ProductModal-roll-image img').first();
    await expect(thumbnail).toBeVisible();
    await expect(thumbnail).toHaveJSProperty('complete', true);
    const thumbnailMetric = await collectImageMetric(thumbnail);

    expect(thumbnailMetric.currentSrc).toContain('_466x466.webp');
    expect(thumbnailMetric.cssWidth).toBeGreaterThan(0);
    expect(thumbnailMetric.cssHeight).toBeGreaterThan(0);
    await expect(thumbnail).toHaveCSS('object-fit', 'cover');

    const thumbnailContainer = page.locator('.ProductModal-roll-image').first();
    const thumbnailContainerBounds = await thumbnailContainer.boundingBox();
    expect(thumbnailContainerBounds).not.toBeNull();
    expect(
      Math.abs(thumbnailContainerBounds.width - thumbnailMetric.cssWidth)
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs(thumbnailContainerBounds.height - thumbnailMetric.cssHeight)
    ).toBeLessThanOrEqual(1);
    await expect(thumbnailContainer).toHaveCSS('overflow', 'hidden');
    await testInfo.attach('modal-mobile-metrics', {
      body: JSON.stringify(
        { hero: heroMetric, thumbnail: thumbnailMetric },
        null,
        2
      ),
      contentType: 'application/json',
    });

    await context.close();
  });

  test('skeleton is visible until the product image finishes loading', async ({
    browser,
  }) => {
    const scenario = matrix[0];
    const context = await browser.newContext({
      viewport: { width: scenario.width, height: scenario.height },
      deviceScaleFactor: scenario.dpr,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    await page.route('**/Vodopad_set_*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.continue();
    });
    await page.goto(storyUrl(STORY_IDS.card), {
      waitUntil: 'domcontentloaded',
    });

    const root = page.locator('.ResponsiveImage').first();
    await expect(root).toHaveAttribute('data-image-state', 'loading');
    await expect(root.locator('.ResponsiveImage-skeleton')).toBeVisible();
    await expect(root.locator('img')).toHaveCSS('opacity', '0');
    const loadingBounds = await root.boundingBox();
    expect(loadingBounds).not.toBeNull();
    expect(loadingBounds.width).toBeGreaterThan(0);
    expect(loadingBounds.height).toBeGreaterThan(0);
    await expect(root).toHaveAttribute('data-image-state', 'loaded');
    await expect(root.locator('.ResponsiveImage-skeleton')).toHaveCount(0);
    const loadedBounds = await root.boundingBox();
    expect(loadedBounds).not.toBeNull();
    expect(
      Math.abs(loadedBounds.width - loadingBounds.width)
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs(loadedBounds.height - loadingBounds.height)
    ).toBeLessThanOrEqual(1);

    await context.close();
  });

  test('failed source switches to the missing-image fallback', async ({
    browser,
  }) => {
    const { context, page } = await openStory(
      browser,
      matrix[0],
      STORY_IDS.error
    );
    const root = page.locator('.ResponsiveImage').first();

    await expect(root).toHaveAttribute('data-image-state', 'error');
    await expect(root.locator('.ResponsiveImage-skeleton')).toHaveCount(0);
    await expect(root.locator('img')).toHaveAttribute(
      'src',
      /^data:image\/jpeg;base64,/
    );

    await context.close();
  });
});
