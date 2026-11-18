# Umami

Self-hosted Umami живёт в support-сервисах Chef; сайт отдаёт трекер со своего
домена: nginx `/_e/script.js` и `/_e/api/send` → `stats.jacochef.ru`
(jaco-infrostructure, projects/site и projects/chef).

- Подключение: `pages/_document.js`, только если в runtime env фронта задан
  `UMAMI_WEBSITE_ID` (OpenBao `frontend-runtime`; пересборка не нужна).
  `UMAMI_DOMAINS` — необязательный список доменов (`data-domains`).
- `utils/umami.js`: хук `before-send` ставит `vid` (cookie из `proxy.js`) как
  distinct id и вырезает `token`, `code`, `phone`, `number`, `email`, `sig` из URL.
  В `url` и `referrer` путь формы `/feedback/stars/{token}` или
  `/feedback/emoji/{token}` сокращается до типа формы, без capability и query;
  hash удаляется из всех URL. Неразбираемый URL не передаётся исходной строкой.
  `trackUmami` отправляет только скалярные поля без персональных данных;
  свободный `text` причины отмены, `comment`, телефон, адрес и имя отбрасываются.
- События: все цели Метрики из `utils/metrika.js` дублируются в Umami с теми же
  именами; `purchase` — из `trackPurchase`; `product_view` / `product_add`
  (`item_id`, `tovar`, `price`) — для воронки товаров.
- Заказ: `create_order_pre` получает `vid`/`sid` (`getVisitIds`), backend связывает
  заказ с визитом. Поэтому cookie `vid`/`sid` не httpOnly.
- Отчёт: Chef → «Сквозная аналитика» → вкладка «Маркетинг».

### Резервная загрузка изображений

Событие `image_cdn_fallback` показывает, в каких визитах браузер запросил
фото блюда или статичный баннер напрямую из Yandex Object Storage.
Поле `host` содержит исходный домен CDN. Для `mainimg.jacofood.ru` резервный
бакет — `site-img`, для `topimg.jacofood.ru` — `site-home-img`.
В поле `reason` передаётся `error` при ошибке загрузки, `timeout` после
3 секунд ожидания видимого изображения в активной вкладке или `remembered`,
если во вкладке уже подтверждён сбой этого домена.
Каждая пара домена и причины отправляется один раз за время жизни страницы.
Для оценки доли затронутых визитов сравнивайте число визитов с этим событием
с числом визитов на страницы каталога за тот же период.

Резервные запросы идут с устройства посетителя прямо в хранилище.
Общий объём исходящего трафика смотрите в статистике соответствующего бакета.
В него также входят обращения других клиентов к этому бакету.

Тесты: `tests/analytics` (входит в `npm run test:resources`).
