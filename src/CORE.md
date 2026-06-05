# Новое ядро (`src/`)

TypeScript + FSD под `src/`, смонтированное на `/preview/{city}` через `app/preview/` до финального переключения маршрутов.

## Назначение

`src/` — это новое прикладное ядро для будущего cutover, а не вторая дизайн-система и не копия legacy-страниц. Его задача:

- загружать preview-маршруты через App Router;
- нормализовать legacy-ответы API в предсказуемые модели страниц;
- гидрировать клиентские store, нужные для интерактивного legacy-совместимого поведения;
- рендерить новый UI на DS поверх этого состояния.

Legacy `/samara` остается production-эталоном. `src/` — это миграционный слой для поэтапной замены маршрутов.
Поведенческий source of truth до cutover — текущий pages-router runtime (`pages/`, `components/`, `modules/`, `styles/`): если в `src/` поведение спорное, алгоритм нужно сверять именно там и воспроизводить в preview.

## Слои

- `app/runtime/` — клиентские runtime-сервисы и глобальные скрипты.
- `entities/` — доменные store и состояние (`city`, `cart`, `header`, `home`, `profile`, `contact`, `footer`, `akcii`, `catalog`).
- `features/` — пользовательские сценарии и stateful-хелперы (`auth`, логика header, bootstrap-гидрация, telemetry).
- `widgets/layout/` — общий каркас страницы: `PageLayout`, `PageFrame`, `PageFooter`.
- `widgets/header/` — `ConnectedHeader`, адаптер между store приложения и DS-header.
- `widgets/shell/` — глобальный chrome и оверлеи (`AuthModal`, `CityModal`, `BasketPanel`, `MapLoader`, loader backdrop).
- `pages/` — UI страниц, view model и page-level hooks.
- `shared/` — API-клиент, route helpers, analytics, scroll/maps/text helpers, shared UI.

## Runtime flow

1. Entry points в `app/preview/[city]/**` вызывают серверные loader'ы вроде `loadHomePageData` и `loadCartPageData`.
2. Loader'ы получают raw-ответы backend, обрабатывают нормализацию города, redirect и `notFound`.
3. Route-файлы передают raw SSR payload в page client как `storeSeed`, а home дополнительно передает `model`.
4. `PageLayout` монтирует `StoreBootstrap`, `AppShell`, `ConnectedHeader` и `PageFooter`.
5. Если странице нужен стандартный inset-каркас контента, она сама оборачивает свой контент в `PageFrame`.
6. `StoreBootstrap` гидрирует Zustand-store из SSR-данных, затем запускает client-only шаги: session hydration, refresh баннеров/каталога, пересчет корзины, telemetry.
7. UI страницы читает данные либо из SSR view model, либо из client store, либо из обоих источников одновременно.

## Структура маршрутов

| Путь                   | Loader             | Client entry | Основной UI |
| ---------------------- | ------------------ | ------------ | ----------- |
| `/preview/[city]`      | `loadHomePageData` | `HomeClient` | `HomePage`  |
| `/preview/[city]/cart` | `loadCartPageData` | `CartClient` | `CartPage`  |

URL helpers: `src/shared/lib/sitePaths.ts` (`cityBase`, `cityPath`, `categoryHref`).

## Границы ответственности

### Серверные loader'ы

Серверные loader'ы отвечают за:

- нормализацию city slug;
- redirect / fallback-поведение;
- начальные page payload;
- возврат только сериализуемых данных.

Они не должны знать о форме client store глубже, чем это необходимо для минимального seed-объекта.

### `StoreBootstrap`

`StoreBootstrap` отвечает за:

- начальную гидрацию store из SSR payload;
- синхронизацию browser-only состояния (`localStorage`, auth/session, cart hydration);
- client refresh данных, которые могут устареть после SSR;
- одноразовые side effect'ы уровня приложения, например telemetry.

Это должна быть единственная точка, где происходит page-global гидрация store из SSR payload.

### `PageLayout`

`PageLayout` отвечает только за общий каркас:

- mount bootstrap;
- mount app shell;
- mount connected header;
- mount footer.

В нем не должно быть бизнес-логики страницы.

### `PageFrame`

`PageFrame` отвечает только за контентный каркас страницы:

- фоновый слой страницы;
- верхний/нижний отступ относительно fixed header;
- `ui-page-inset`;
- intro-блок страницы, если он нужен;
- основной content-slot.

Это отдельный слой, потому что не каждая preview-страница должна быть зажата в одинаковый inset-контейнер. Home, например, живет в своей собственной структуре и сам управляет ширинами секций.

### `ConnectedHeader`

`ConnectedHeader` нужен для того, чтобы `Header` оставался презентационным.

Он читает состояние приложения из store, собирает nav/cart/header props и связывает header-события:

- открытие корзины;
- открытие auth modal;
- открытие city modal;
- переключение compact menu;
- переход / scroll к категории;
- analytics по кликам в header.

Если DS-компонент `Header` начнет сам импортировать store, границы слоев будут нарушены.

## Стратегия store

Preview сейчас использует Zustand-store как совместимый слой между SSR payload, нестабильным legacy backend contract и новым DS UI.

- `useHeaderStore` централизует состояние app chrome и session hydration.
- `useCartStore` хранит состояние корзины/заказа и считает производные totals.
- `useHomeStore` хранит live-каталог home и баннеры, догружаемые после mount.
- `useCatalogStore` пока существует как общий seeded catalog store.
- `useCityStore` и `useFooterStore` держат общий cross-page context.

Store, зарегистрированные через `reuseAppStore`, должны безопаснее переживать HMR в локальной разработке.

## Текущие избыточности

Ниже основные архитектурные избыточности preview-кода на данный момент. Они допустимы как миграционный компромисс, но не должны считаться целевой архитектурой.

### 1. Два источника каталога для home

Home сейчас одновременно использует:

- SSR mapping в `pages/home/model/mapHomePageViewModel.ts`;
- client store-driven mapping в `pages/home/hooks/useHomeCatalog.ts` из `useHomeStore`.

Из-за этого category tree, tags, products и product groups строятся дважды из пересекающихся источников данных. Это главная архитектурная избыточность в `src/`.

Целевое направление: выбрать один канонический pipeline для home-каталога.

- либо SSR model — основной источник, а store только подмешивает live-обновления;
- либо store — основной источник, а server model становится тонким seed, а не вторым mapper'ом.

### 2. Дублирование ответственности за догрузку каталога на home

`StoreBootstrap` уже вызывает `useHomeStore.getItemsCat('home', city)` и `getBanners(...)` после mount.
`HomePage` дополнительно вызывает `getItemsCat('home', city)` у себя.

In-flight/cache-логика снижает runtime-стоимость, но ответственность все равно раздвоена.

Целевое направление: один владелец post-hydration refresh. Лучше оставить глобальный refresh в `StoreBootstrap` или полностью перенести page-specific refresh в `HomePage`, но не держать оба варианта сразу.

### 3. Перекрытие `catalog` entity и `home` entity

`useCatalogStore` и `useHomeStore` оба хранят category/item-подобные данные, seeded из page payload.

Сейчас:

- `useCatalogStore` — общий seeded snapshot каталога;
- `useHomeStore` — live-источник каталога и баннеров для home.

Во время миграции это терпимо, но граница между ними концептуально размыта. Если live-путь нужен только home, общий catalog store может оказаться лишним слоем.

### 4. Повторяющийся route-to-seed mapping

Оба preview route-файла вручную мапят loader output в `storeSeed`.

Это небольшая, но устойчивая дубликация boilerplate-кода, которая легко разъезжается со временем.

Целевое направление: один mapper из loader output в `StoreBootstrapProps`.

### 5. `activePage` задается более чем в одном месте

Для cart `activePage: 'cart'` прокидывается и в route seed, и повторно в `CartClient`.

Это безвредно, но избыточно. Владельцем такого значения должна быть одна граница, лучше route boundary.

### 6. Transitional alias все еще существует

`features/header/ui/HomeHeaderConnected.tsx` — это только deprecated re-export старого имени. Это миграционный клей, а не архитектурная ценность.

Его стоит удалить после полной чистки импортов.

## Оценка дизайна

Что сейчас сделано хорошо:

- route-файлы остаются тонкими и в основном занимаются server composition;
- `PageLayout` теперь имеет четкую одну задачу: общий каркас приложения;
- `PageFrame` отвечает за стандартный контентный каркас только там, где он реально нужен;
- `ConnectedHeader` правильно не пускает app-store coupling внутрь DS-header;
- server loader'ы держат у себя redirect и city normalization, не протекая в клиентский UI;
- preview прячет нестабильность legacy backend за mapping/bootstrap-слоями, а не размазывает ее по компонентам.

Что сейчас слабо:

- для home не всегда очевиден единственный source of truth;
- часть миграционного клея все еще лежит в постоянных слоях (`features/header/ui/HomeHeaderConnected.tsx`, дублирующиеся store-домены);
- `StoreBootstrap` совмещает начальную гидрацию и orchestration дальнейших refresh-ов, что практично, но делает его слишком широким по ответственности.

## Целевое состояние

Чистая целевая архитектура preview-страниц должна выглядеть так:

1. server loader возвращает нормализованный route payload;
2. один mapper превращает его в:
   - page view model для рендера;
   - store seed для интерактивности;
3. `PageLayout` монтирует только общий chrome;
4. каждая страница читает каждый домен данных из одного основного источника;
5. у follow-up refresh есть один явный владелец.

Практический порядок следующей чистки:

1. схлопнуть двойной model/store pipeline home-каталога;
2. убрать дублирование `getItemsCat`;
3. объединить route-to-seed mapping;
4. удалить deprecated compatibility export после миграции импортов.

## API

Signed POST client: `src/shared/api/client.ts` (`api`, `apiAddress`).

## Локальная разработка

- `npm run dev` — `http://localhost:3000/preview/samara`
- Legacy production core остается на `/samara` (Pages Router) и не меняется этим деревом.
