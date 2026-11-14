# Разметка для поиска и ИИ-ассистентов

Что сайт отдаёт ботам, которые не выполняют JavaScript (ChatGPT, Claude, Perplexity), и
поисковикам, на чьих данных строятся ИИ-ответы (Яндекс Нейро, Google).

## Правила

- **Только реальные данные.** В разметку попадает то, что пришло из API или видно на
  странице. Часов работы, рейтингов и цен «от» в API нет — их не выдумываем
  (это закреплено тестами `tests/seo/structuredData.test.js`).
- **Хлебные крошки — только в JSON-LD.** В интерфейсе их нет и добавлять не нужно.
- **Тексты в базе не правим.** Разметка строится из существующего содержимого страниц.

## JSON-LD по страницам

Построители — `utils/structuredData.js`, вывод — `components/structuredData.js`.
Несколько сущностей страницы собираются в один блок `@graph` (`schemaGraph`).

| Страница | Сущности |
|---|---|
| `/` | `Organization`, `WebSite` |
| `/{city}` | `Restaurant` с кафе города (`department`: адрес, телефон, координаты) и `OrderAction` |
| `/{city}/menu` | `Menu` со всеми разделами и блюдами, `BreadcrumbList` |
| `/{city}/menu/{category}` | `Menu` раздела: `MenuItem` с составом, фото, весом (`nutrition.servingSize`) и ценой; `BreadcrumbList` |
| `/{city}/akcii`, `/{city}/akcii/{name}` | `ItemList` / `Offer`, `BreadcrumbList` (скрытые акции — без разметки) |
| `/{city}/contacts` | `Restaurant` на каждое кафе, `ContactPage`, `BreadcrumbList` |
| `/{city}/dostavka` | `Service`, `WebPage`, `BreadcrumbList` |
| `/{city}/about` | `AboutPage`, `BreadcrumbList` |
| `/{city}/sroki_godnosti_…` | `WebPage`, `ItemList` из таблицы «продукт — условия хранения», `BreadcrumbList` |
| остальные текстовые страницы | `WebPage` (заголовок, описание, дата изменения), `BreadcrumbList` |

Тип текстовой страницы задаётся в `utils/cityPageRoute.js` (`schemaType`: `delivery`,
`article`, `storage`); без типа страница получает общий `WebPage`.

КБЖУ приходят из API на 100 г (`kkal`, `protein`, `fat`, `carbohydrates`). В `nutrition`
они пересчитываются на всё блюдо, потому что рядом указан вес порции (`servingSize`) —
так же считает карточка товара на сайте. У сетов значений нет; для напитков и штучных
позиций пересчёт не делается.

## Каталог в серверном HTML

Карточки блюд берут данные из стора, который заполняется в браузере, поэтому раньше в HTML
не было ни названий, ни цен. Теперь страницы города, меню и категории передают каталог
в пропсах (`utils/initialCatalog.js` → `initialCatalog`), и `modules/home/cardItem/cardItems.js`
строит карточки из них, пока стор пуст.

- На сервере рисуется десктопная сетка; на телефоне она скрыта стилями и после загрузки
  заменяется мобильными карточками — как и подвал сайта.
- Цена решения — вес HTML: главная города ~630 КБ (≈64 КБ в gzip) вместо ~113 КБ,
  `/menu` ~830 КБ (≈78 КБ), страница категории ~170 КБ (≈29 КБ).

## `/llms.txt` и `/llms-full.txt`

Формат [llmstxt.org](https://llmstxt.org). Собираются на лету из тех же API
(`pages/llms.txt.js`, `pages/llms-full.txt.js`, тексты — `utils/llmsText.js`):

- `/llms.txt` — города, разделы меню, справочные страницы, PDF с составом и КБЖУ, адреса кафе;
- `/llms-full.txt` — полное меню всех городов с ценами, весом, составом и КБЖУ на 100 г.

Ответ кешируется на час (`s-maxage=3600`).

## Проверка

`npx vitest run --config tests/seo/vitest.config.mjs` — тесты разметки, каталога и `llms.txt`
(`tests/seo/aiMarkup.test.js`).
