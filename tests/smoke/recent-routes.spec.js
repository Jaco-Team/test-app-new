import { expect, test } from '@playwright/test';

test('выбор города сохраняет item, повторяющиеся UTM и hash', async ({
  page,
}) => {
  await page.goto(
    '/?item=Picca_ZHako&utm_source=A%2FB&utm_source=second#offer'
  );

  const link = page.getByRole('link', { name: /Самара/ });
  await expect(link).toHaveAttribute(
    'href',
    '/samara?item=Picca_ZHako&utm_source=A%2FB&utm_source=second#offer'
  );
  await link.click();

  await expect(page).toHaveURL(
    /\/samara\?item=Picca_ZHako&utm_source=A%2FB&utm_source=second#offer$/
  );
  await expect
    .poll(() =>
      page.evaluate(() => JSON.parse(localStorage.getItem('setCity'))?.link)
    )
    .toBe('samara');
});

test('сохранённый город открывается автоматически с параметрами ссылки', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'setCity',
      JSON.stringify({ name: 'Тольятти', link: 'togliatti' })
    );
  });
  await page.goto('/?item=Picca_ZHako&utm_source=qr#offer');

  await expect(page).toHaveURL(
    /\/togliatti\?item=Picca_ZHako&utm_source=qr#offer$/
  );
});

test('неизвестный город в хранилищах не вызывает переадресацию', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('setCity', '{broken json');
    document.cookie = 'city=unknown; path=/';
  });
  await page.goto('/?utm_source=qr');

  await expect(page.getByRole('heading', { name: /город/i })).toBeVisible();
  await expect(page).toHaveURL(/\/\?utm_source=qr$/);
});

test('график уборки остаётся на сайте и закрыт для индексации', async ({
  page,
  request,
}) => {
  const path = '/cleaning/kuybysheva-113/guest-toilet?placement=guest-toilet';
  await page.goto(path);

  await expect(
    page.getByRole('heading', { name: 'График уборок гостевого туалета' })
  ).toBeVisible();
  await expect(page.locator('img[alt="Жако"]')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow'
  );
  await expect(page).toHaveURL(new RegExp(path.replace('?', '\\?')));

  const unknown = await request.get('/cleaning/unknown/guest-toilet');
  expect(unknown.status()).toBe(404);
});

test('корзина переживает смену города без полной перезагрузки', async ({
  page,
  context,
}) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto('/togliatti', { waitUntil: 'domcontentloaded' });
  const togliattiItems = await page.evaluate(
    () => window.__NEXT_DATA__.props.pageProps.data1.all_items
  );
  await context.addCookies([
    { name: 'city', value: 'samara', url: page.url() },
  ]);
  await page.goto('/samara', { waitUntil: 'domcontentloaded' });
  const samaraItems = await page.evaluate(
    () => window.__NEXT_DATA__.props.pageProps.data1.all_items
  );
  const product = samaraItems.find((item) =>
    togliattiItems.some(
      (other) =>
        Number(other.id) === Number(item.id) &&
        Number(other.price) !== Number(item.price)
    )
  );
  expect(
    product,
    'Нужен общий товар с разными ценами для проверки'
  ).toBeTruthy();
  const togliattiPrice = Number(
    togliattiItems.find((item) => Number(item.id) === Number(product.id)).price
  );

  await page.evaluate((item) => {
    localStorage.setItem('modalGoupVK', 'show');
    localStorage.setItem('setCookie', 'true');
    localStorage.setItem(
      'setCity',
      JSON.stringify({ name: 'Самара', link: 'samara' })
    );
    localStorage.setItem(
      'setCart',
      JSON.stringify({
        updatedAt: Date.now(),
        city: { name: 'Самара', link: 'samara' },
        items: [
          {
            ...item,
            item_id: item.id,
            count: 2,
            one_price: item.price,
            all_price: Number(item.price) * 2,
          },
        ],
        typeOrder: 'dev',
      })
    );
  }, product);
  await page.goto('/samara/cart', { waitUntil: 'domcontentloaded' });

  const documentNavigations = [];
  page.on('request', (request) => {
    if (
      request.isNavigationRequest() &&
      request.resourceType() === 'document' &&
      request.frame() === page.mainFrame()
    ) {
      documentNavigations.push(request.url());
    }
  });

  const chooseCity = async (cityName, cityLink, price) => {
    await page.locator('.chooseCity').first().click();
    await page.getByRole('button', { name: 'Нет, выберу город' }).click();
    await page.getByRole('menuitem', { name: cityName }).click();
    await expect(page).toHaveURL(new RegExp(`/${cityLink}/cart$`), {
      timeout: 20_000,
    });
    await expect
      .poll(() =>
        page.evaluate(
          () => JSON.parse(localStorage.getItem('setCart'))?.items?.[0]
        )
      )
      .toMatchObject({
        item_id: product.id,
        count: 2,
        one_price: price,
        all_price: price * 2,
      });
    await expect
      .poll(() =>
        page.evaluate(
          () => JSON.parse(localStorage.getItem('setCart'))?.city?.link
        )
      )
      .toBe(cityLink);
  };

  await chooseCity('Тольятти', 'togliatti', togliattiPrice);
  await chooseCity('Самара', 'samara', Number(product.price));
  expect(documentNavigations).toEqual([]);
});

test('мобильное меню переключает город и сохраняет корзину', async ({
  page,
  context,
}) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/togliatti', { waitUntil: 'domcontentloaded' });
  const togliattiItems = await page.evaluate(
    () => window.__NEXT_DATA__.props.pageProps.data1.all_items
  );
  await context.addCookies([
    { name: 'city', value: 'samara', url: page.url() },
  ]);
  await page.goto('/samara', { waitUntil: 'domcontentloaded' });
  const samaraItems = await page.evaluate(
    () => window.__NEXT_DATA__.props.pageProps.data1.all_items
  );
  const product = samaraItems.find((item) =>
    togliattiItems.some(
      (other) =>
        Number(other.id) === Number(item.id) &&
        Number(other.price) !== Number(item.price)
    )
  );
  expect(product).toBeTruthy();
  const newPrice = Number(
    togliattiItems.find((item) => Number(item.id) === Number(product.id)).price
  );

  await page.evaluate((item) => {
    localStorage.setItem('modalGoupVK', 'show');
    localStorage.setItem(
      'setCity',
      JSON.stringify({ name: 'Самара', link: 'samara' })
    );
    localStorage.setItem(
      'setCart',
      JSON.stringify({
        updatedAt: Date.now(),
        city: { name: 'Самара', link: 'samara' },
        items: [
          {
            ...item,
            item_id: item.id,
            count: 2,
            one_price: item.price,
            all_price: Number(item.price) * 2,
          },
        ],
        typeOrder: 'dev',
      })
    );
  }, product);
  await page.reload({ waitUntil: 'domcontentloaded' });

  const documentNavigations = [];
  page.on('request', (request) => {
    if (
      request.isNavigationRequest() &&
      request.resourceType() === 'document' &&
      request.frame() === page.mainFrame()
    ) {
      documentNavigations.push(request.url());
    }
  });

  await page.locator('.headerMobile svg[width="90"]').click();
  await page.locator('#headerMenuCat').getByText('Самара').click();
  await page.locator('#modalCityMobileList').getByText('Тольятти').click();

  await expect(page).toHaveURL(/\/togliatti$/, { timeout: 20_000 });
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(localStorage.getItem('setCart'))?.items?.[0]
      )
    )
    .toMatchObject({
      item_id: product.id,
      count: 2,
      one_price: newPrice,
      all_price: newPrice * 2,
    });
  expect(documentNavigations).toEqual([]);
});
