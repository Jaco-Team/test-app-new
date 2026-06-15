# TODO: cleanup preview core

## Pinned rules

- Каждый шаг должен оставлять код читаемым на senior-уровне, но без лишней хитрости: решение должно быть понятно обычному разработчику без расшифровки скрытых контрактов.
- После каждого прикладного шага запускать `npm run typecheck` и фиксировать результат, помечать пункт как выполненный, не удалять.
- Не вставлять в чат diff'ы, patch output, тела измененных файлов, before/after snippets и длинные кодовые блоки: в ответе только короткий статус, результат typecheck и риски/следующие шаги, если пользователь явно не попросил показать код.

## Цель

Привести preview-код под `app/preview/**` + `src/**` к одной предсказуемой схеме:

- FSD без cross-page зависимостей;
- один владелец bootstrap/hydration;
- один reusable page layout contract для типовых страниц;
- SCSS без точечных переопределений каркаса и без массового обхода foundation;
- Storybook как spec surface для shared UI, где responsive-поведение проверяется через viewport/container context, а не через viewport props в обычном app usage.

## Критичные архитектурные проблемы

### 1. У preview-страниц нет одного reuse layout contract

Статус: выполнено для типовых preview-страниц через `AppPageShell` и `CabinetPageShell`; route/client glue уже сведены к `storeSeed` + page-specific props.

Сейчас почти каждая client page собирает одинаковый каркас вручную:

- `PageLayout`
- `resolveCityLabel`
- `header.fallback*`
- `activePage`
- иногда `PageFrame`
- иногда `CabinetPageIntro`
- иногда `ContactMapBootstrap`

Файлы:

- `src/pages/cart/ui/CartClient.tsx`
- `src/pages/contacts/ui/ContactsClient.tsx`
- `src/pages/profile/ui/ProfileClient.tsx`
- `src/pages/orders/ui/OrdersClient.tsx`
- `src/pages/promos/ui/PromosClient.tsx`
- `src/pages/account/ui/AccountClient.tsx`
- `src/pages/address/ui/AddressClient.tsx`

Что сделать:

- ввести один page-shell для типовых preview-страниц;
- отдельно выделить cabinet-shell для кабинета;
- route/page слой должен только передавать `storeSeed`, `pageKind`, `intro`, `frameMode`.

### 2. `StoreBootstrap` совмещает seed, auth hydration и page-specific refresh

Файл:

- `src/features/bootstrap/StoreBootstrap.tsx`

Проблема:

- bootstrap делает и детерминированный seed store, и post-mount orchestration;
- туда зашиты home banners, home catalog и profile counters;
- это превращает общий app bootstrap в неявный page service.

Что сделать:

- оставить в bootstrap только seed + общие app-wide side effects;
- page-specific refresh вынести в page/model hooks;
- profile counters вынести в отдельный cabinet bootstrap/poller;
- home refresh оставить только у home page.

Статус: частично выполнено; `getCountPromosOrders(...)` убран из `StoreBootstrap`, owner counters теперь `ProfileOrdersPoller` / telemetry layer.

### 3. Home все еще имеет двойной source of truth

Файлы:

- `src/pages/home/model/mapHomePageViewModel.ts`
- `src/pages/home/hooks/useHomeCatalog.ts`
- `src/pages/home/ui/HomePage.tsx`
- `src/entities/home/model/homeStore.ts`
- `src/entities/catalog/model/catalogStore.ts`

Проблема:

- SSR view model и client home store одновременно строят каталог;
- `StoreBootstrap` и `HomePage` оба дергают `getItemsCat`;
- `catalog` и `home` store хранят пересекающиеся данные.

Что сделать:

- выбрать один канонический pipeline каталога home;
- убрать второй вызов `getItemsCat`;
- либо удалить `useCatalogStore` из home pipeline, либо оставить его только как shared cache без UI-responsibility.

### 4. Есть прямые cross-page зависимости внутри слоя `pages`

Статус: выполнено; общие cabinet pieces вынесены из `pages/profile/**` в `src/widgets/cabinet/**`, а `useCabinetAccess` живет в `src/features/cabinet-access/**`.

Файлы:

- `src/pages/promos/ui/PromosClient.tsx`
- `src/pages/orders/ui/OrdersClient.tsx`
- `src/pages/promos/ui/PromosPage.tsx`
- `src/pages/orders/ui/OrdersPage.tsx`
- `src/pages/account/ui/AccountPage.tsx`
- `src/pages/address/ui/AddressPage.tsx`
- `src/pages/profile/model/useCabinetAccess.ts`

Проблема:

- `promos`, `orders`, `account`, `address` зависят от `pages/profile/**`;
- это ломает intended FSD dependency direction для siblings inside `pages`.

Что сделать:

- вынести `CabinetPageIntro` и `ProfileSectionNav` в `src/widgets/cabinet/`;
- вынести `useCabinetAccess` в `src/features/cabinet-access/` или `src/widgets/cabinet/model/`;
- после переноса убрать импорты `@src/pages/profile/**` из других страниц.

### 5. `shared/store/index.ts` нарушает слой `shared`

Статус: выполнено; `shared/store/index.ts` удален, остался только shared infra вроде `hotStore`.

Файл:

- `src/shared/store/index.ts`

Проблема:

- `shared` реэкспортит store из `entities/*`;
- получается зависимость `shared -> entities`, хотя `shared` должен быть нижним слоем.

Что сделать:

- удалить этот barrel;
- импортировать store из своих доменных модулей напрямую;
- `shared/store/` оставить только для truly shared infra (`hotStore`).

## Проблемы layout/composition

### 1. `PageFrame` используется как базовый layout, но страницы его ломают локальными override

Статус: выполнено; layout contract живет в `PageFrame` modifiers, `contacts` больше не переопределяет frame spacing через page-level `.page-frame` selector.

Файлы:

- `src/widgets/layout/PageFrame.scss`
- `src/pages/contacts/ui/ContactsPage.scss`
- `src/pages/profile/ui/ProfilePage.scss`

Проблема:

- `PageFrame` задает inset/padding contract;
- `contacts` и `profile` точечно перезаписывают `.page-frame__inner`;
- итоговый layout contract неустойчив и плохо переиспользуется.

Что сделать:

- добавить варианты `PageFrame`: `default`, `flush`, `cabinet`, `hero`;
- запретить page-level SCSS лезть в `.page-frame__inner`;
- нестандартные spacing/layout настраивать через props/modifiers `PageFrame`, а не nested override.

### 2. Кабинет разрезан на mobile/desktop page branching

Файлы:

- `src/pages/profile/ui/ProfilePage.tsx`
- `src/pages/account/ui/AccountPage.tsx`
- `src/pages/address/ui/AddressPage.tsx`

Проблема:

- mobile account/address отдельно живут как почти отдельные страницы;
- desktop redirect logic живет внутри page UI;
- layout responsibility смешана с access/navigation rules.

Что сделать:

- сделать отдельный cabinet page shell;
- redirect/access policy держать до рендера visual tree;
- унифицировать intro/nav/back patterns для account/address/profile/orders/promos.

## Проблемы SCSS

### 1. Точечные обходы foundation и design tokens

Файлы:

- `app/layout.scss`
- `src/pages/profile/ui/CabinetPageIntro.scss`
- `src/pages/profile/ui/ProfileSectionNav.scss`
- `src/features/address-picker/ui/AddressPickerModal.scss`
- `src/pages/orders/ui/OrdersPage.scss`
- `src/pages/promos/ui/PromosPage.scss`
- `src/pages/account/ui/AccountPage.scss`
- `src/pages/address/ui/AddressPage.scss`

Проблема:

- прямые `@media`;
- raw `px`;
- raw colors вроде `#cc0033`, `#141414`, `#fff`;
- повторяющиеся font rules вместо foundation tokens.

Что сделать:

- перевести эти файлы на tokens/mixins foundation;
- ввести небольшие semantic tokens для cabinet cards/status surfaces;
- глобальный `app/layout.scss` должен использовать DS font token, а не свой стек.

### 2. Много `!important` и deep overrides MUI internals

Статус: частично выполнено; responsive field chrome для `AddressPickerModal` вынесен в shared `ui-mui-field` layout modifier, а `ModalWrapper`/`AddressPickerModal` title-content slots уже не завязаны на `MuiDialogTitle-root` / `MuiDialogContent-root`, но dialog/picker-specific MUI internals еще не дочищены.

Файлы:

- `src/features/address-picker/ui/AddressPickerModal.scss`
- `src/shared/ui/components/ModalWrapper/ModalWrapper.scss`
- `src/shared/ui/components/internal/muiControl/styles.scss`
- `src/shared/ui/components/MuiSwitch/MuiSwitch.scss`
- `src/widgets/shell/AuthModal.scss`
- `src/pages/profile/ui/ProfilePage.scss`

Проблема:

- DS не задает достаточно сильный/stable API для вложенных MUI controls;
- страницы и feature-модалки вынуждены пробивать стили силой.

Что сделать:

- стабилизировать class contract на уровне shared/ui components;
- сократить число MUI-specific overrides на уровне страниц;
- убрать `!important` в page SCSS первым делом из profile/address-picker/auth modal.

### 3. Слишком большие page stylesheets со смешанной ответственностью

Файлы:

- `src/pages/cart/ui/CartPage.scss`
- `src/pages/profile/ui/ProfilePage.scss`
- `src/pages/contacts/ui/ContactsPage.scss`
- `src/pages/home/ui/modals/ProductDetailsModal.scss`

Проблема:

- файл держит layout, visual states, MUI overrides и локальные utility rules одновременно;
- сопровождение ухудшается, reuse почти невозможен.

Что сделать:

- дробить по подблокам рядом с компонентами;
- page root SCSS должен описывать только composition/layout;
- сложные секции вынести в локальные subcomponents.

## Простой reusable layout для следующих страниц

Нужен минимальный contract:

1. `AppPageShell`
2. `CabinetPageShell`
3. `PageFrame` c variant props, без page-level nested overrides

Пример обязанностей:

- `AppPageShell`
  - принимает `storeSeed`, `activePage`, `header`, `footerMode`
  - монтирует `PageLayout`
- `CabinetPageShell`
  - собирает `PageFrame`
  - рендерит title/description/nav/back pattern
  - умеет compact/desktop variants без дублирования route glue
- `PageFrame`
  - отвечает только за spatial contract

## Порядок выполнения

### Этап 1. Архитектурная чистка

1. [x] Вынести cabinet shared pieces из `pages/profile` в `widgets`/`features`.
2. [x] Удалить `shared/store/index.ts`.
3. [x] Ввести mapper `route payload -> StoreBootstrapProps`.
4. [x] Убрать двойное задание `activePage` в route и client одновременно.

### Этап 2. Layout contract

1. [x] Спроектировать `AppPageShell`.
2. [x] Спроектировать `CabinetPageShell`.
3. [x] Добавить `PageFrame` variants вместо SCSS overrides.
4. [x] Перевести `contacts`, `profile`, `orders`, `promos`, `account`, `address` на новый shell.

### Этап 3. Home cleanup

1. [x] Выбрать единственный source of truth для каталога.
2. [x] Убрать дублирующий refresh `getItemsCat`.
3. [x] Развести ответственность `catalog` и `home`.

### Этап 4. SCSS normalization

1. [x] Убрать raw `@media` и raw font stacks из preview/page SCSS.
2. [x] Убрать page-level `!important`.
3. [ ] Перенести MUI overrides в shared component layer.
   - [x] Перевести `BannerDetailsModal` и `ProductDetailsModal` с `MuiDialogContent-root` на shared `ui-modal-wrapper__content`.
   - [x] Перевести локальные field hooks в `ProfilePage` и `AuthModal` с raw `.MuiInputBase-*`/legacy `InputProps`/`inputProps` на local slot classes и `slotProps`, без переноса page-specific visual styling в shared props.
         Прогресс: `AddressPickerModal` больше не хранит общий responsive sizing/padding для `MuiTextField`/`MuiSelectField`/`MuiAutocompleteField`; этот contract теперь живет в `src/shared/ui/components/internal/muiControl/*`. Title/content styling для `ModalWrapper` и `AddressPickerModal` тоже опирается на shared wrapper classes, а не на `MuiDialog*` root selectors. `BannerDetailsModal` и `ProductDetailsModal` больше не завязаны на `MuiDialogContent-root`, используют только shared `ui-modal-wrapper__content` contract.
4. [x] Сократить nested overrides на `.page-frame__*`.

### Этап 5. Storybook responsive contract

1. [x] Зафиксировать правило: Storybook проверяет compact/regular/expanded через viewport presets и container width, а не через публичный viewport prop в обычном usage.
2. [ ] Убрать из stories нормализацию `range` / `density` как основного consumer contract для shared controls.
   - [x] Перевести `Button.stories.tsx` на viewport-driven `Compact` / `Regular` / `Expanded` вместо `range` в основных responsive stories.
   - [x] Убрать из `Alert.stories.tsx` пример, который показывал `range` как обычный app-facing contract для action button.
   - [x] Перевести `Input.stories.tsx` на те же viewport presets вместо `density` в responsive stories.
   - [x] Перевести `Select.stories.tsx` на те же viewport presets вместо `density` в responsive stories.
3. [ ] После очистки stories сузить публичный responsive API shared controls: viewport semantics не должны быть рекомендуемым app-facing contract.

## Файлы первого приоритета

- `src/features/bootstrap/StoreBootstrap.tsx`
- `src/pages/home/ui/HomePage.tsx`
- `src/pages/home/hooks/useHomeCatalog.ts`
- `src/entities/home/model/homeStore.ts`
- `src/entities/catalog/model/catalogStore.ts`
- `src/pages/profile/model/useCabinetAccess.ts`
- `src/pages/profile/ui/CabinetPageIntro.tsx`
- `src/pages/profile/ui/ProfileSectionNav.tsx`
- `src/widgets/layout/PageFrame.scss`
- `src/pages/contacts/ui/ContactsPage.scss`
- `src/pages/profile/ui/ProfilePage.scss`
- `src/features/address-picker/ui/AddressPickerModal.scss`
- `src/shared/ui/components/ModalWrapper/ModalWrapper.scss`
- `src/shared/store/index.ts`

## SSR / Next.js / performance

### 1. Серверные loader'ы обходят Next request cache и dedupe

Файлы:

- `src/shared/api/client.ts`
- `src/shared/lib/loadHomePageData.ts`
- `src/shared/lib/loadCartPageData.ts`
- `src/shared/lib/loadCabinetPageData.ts`
- `src/pages/contacts/api/loadContactsPageData.ts`

Проблема:

- server loaders ходят через `axios`, а не через `fetch`;
- Next App Router не может нормально применить request memoization, cache tags и `revalidate`;
- одинаковые запросы footer/page info дублируются между маршрутами.

Что сделать:

- разделить API layer на server/client entrypoints;
- для server loader'ов использовать `fetch` на сервере;
- завернуть повторяющиеся server reads в `cache()`/tagged revalidation;
- отдельно закэшировать footer info per city;
- отдельно определить cache policy для home page info, banners, contacts page info.

### 2. Многое, что можно server-seed'ить, догружается только на клиенте

Файлы:

- `src/features/bootstrap/StoreBootstrap.tsx`
- `src/pages/profile/model/useCabinetAccess.ts`
- `src/pages/orders/model/useOrdersPage.ts`
- `src/pages/promos/model/usePromosPage.ts`
- `src/pages/account/model/useAccountPage.ts`
- `src/pages/address/model/useAddressPage.ts`

Проблема:

- cabinet pages сначала SSR'ят shell, потом hydrates session, потом редиректят/грузят данные;
- user-facing content для account/profile/orders/promos/address не серверится;
- это ухудшает initial appearance и замедляет first meaningful paint.

Что сделать:

- если возможно, перенести auth token из localStorage в cookie/HttpOnly session;
- после этого SSR seed'ить кабинетные данные на сервере;
- в текущем промежуточном состоянии хотя бы preload'ить SSR-visible placeholders/state, а не пустой `null`.

### 3. Home делает лишнюю сетевую работу после SSR

Файлы:

- `src/shared/lib/loadHomePageData.ts`
- `src/features/bootstrap/StoreBootstrap.tsx`
- `src/pages/home/ui/HomePage.tsx`

Проблема:

- server loader уже получает `get_page_info` и `get_banners`;
- bootstrap потом снова дергает `get_banners` и `get_items_cat`;
- сама страница home еще раз дергает `get_items_cat`.

Что сделать:

- убрать повторный post-mount refresh по умолчанию;
- оставлять background refresh только по explicit stale policy;
- разделить cold SSR seed и manual refresh.

### 4. Дублируется analytics page hit

Файлы:

- `src/features/bootstrap/StoreBootstrap.tsx`
- `src/app/runtime/ClientRuntime.tsx`

Проблема:

- `hitAll(...)` вызывается и в bootstrap, и в route runtime effect;
- на первой загрузке это почти наверняка двойной pageview.

Что сделать:

- выбрать одного владельца pageview tracking;
- bootstrap не должен дублировать route-level navigation analytics.

Статус: выполнено для pageview tracking; `hitAll(...)` убран из `StoreBootstrap`, owner page hit теперь `ClientRuntime`.

### 5. `AppProviders` полностью client-side, а runtime слишком высоко в дереве

Файлы:

- `app/providers.tsx`
- `src/app/runtime/ClientRuntime.tsx`

Проблема:

- сам по себе client provider допустим, но весь runtime orchestration висит у самого корня;
- карты, sentry network context, matchMedia wiring и telemetry poller грузятся глобально, а не по route groups.

Что сделать:

- оставить DS provider глобально;
- route-sensitive runtime pieces спустить ближе к preview subtree;
- YMaps/poller/script decisions делать как можно ближе к маршрутам, где они реально нужны.

### 6. Есть быстрые low-risk выигрыши по loader composition

Файлы:

- `src/shared/lib/loadHomePageData.ts`
- `src/shared/lib/loadCartPageData.ts`
- `src/shared/lib/loadCabinetPageData.ts`
- `src/pages/contacts/api/loadContactsPageData.ts`

Что сделать:

- где запросы независимы, выполнять их через `Promise.all`;
- общий footer loader вынести в shared cached helper;
- page-info loader и footer loader унифицировать.

## MUI v7

### 1. Material уже на v7, X Date Pickers еще на v7

Файл:

- `package.json`

Проблема:

- `@mui/material` уже `7.3.11`;
- `@mui/x-date-pickers` еще `7.29.4`;
- это не обязательно ломает код сразу, но держит UI stack в partially-upgraded состоянии.

Что сделать:

- выровнять MUI ecosystem по одному major;
- до апгрейда проверить wrappers `MuiDatePickerField` и `MuiMobileDatePickerField`.

### 2. Основные shared wrappers уже идут в правильную сторону

Файлы:

- `src/shared/ui/components/ModalWrapper/ModalWrapper.tsx`
- `src/shared/ui/components/MuiTextField/MuiTextField.tsx`
- `src/shared/ui/components/MuiSelectField/MuiSelectField.tsx`
- `src/shared/ui/components/MuiMobileDatePickerField/MuiMobileDatePickerField.tsx`
- `src/shared/ui/components/PopoverMenu/PopoverMenu.tsx`

Оценка:

- `slots`/`slotProps` используются правильно;
- theme overrides централизованы;
- raw MUI не размазан по новым shared controls.
- shared controls должны быть responsive-by-default: обычное app-использование без `range` обязано адаптироваться под compact/regular/expanded;
- Storybook по умолчанию должен форсировать responsive state через viewport (`320 / 668 / 991`) и/или story wrapper width, а не через публичный viewport prop компонента;
- ручной `range` оставляем только как transitional pin для измеренных исключений и внутренних spec/debug сценариев, пока публичный DS contract не очищен от viewport semantics;
- если story хочется назвать `Compact` / `Regular` / `Expanded`, это должен быть прежде всего viewport preset, а не нормализация `range` как обычного consumer API.

Сделано:

- `Button`, `PurchaseControl` и основные MUI field wrappers переведены на `responsive` как default range;
- из app-кода убраны явные `range="responsive"`, где они только дублировали новый default.

### 3. Но в app code еще остаются legacy-style MUI props

Файлы:

- `src/pages/profile/ui/ProfilePage.tsx`
- `src/widgets/shell/AuthModalBody.tsx`
- `src/shared/ui/components/MuiAutocompleteField/MuiAutocompleteField.tsx`

Проблема:

- встречаются `InputProps`, `inputProps` и `params.InputProps`-style bridges;
- они совместимы, но это transitional API style, не целевой стиль для MUI 7 migration.

Что сделать:

- в shared wrappers держать только `slotProps` contract;
- на уровне pages/features постепенно убрать прямое использование legacy MUI field props.
