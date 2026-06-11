# Preview Architecture And Style Guide

## Назначение

Этот документ фиксирует целевой контракт для preview-кода под `app/preview/**` и `src/**`, чтобы новые страницы не разъезжались по архитектуре и стилям.

Главный принцип: preview не должен быть второй legacy-кодовой базой. Это новый application shell с предсказуемыми слоями, но с визуальной и behavioral parity с legacy.

## FSD границы

Разрешенное направление зависимостей:

- `app -> pages -> widgets -> features -> entities -> shared`

Правила:

- `pages/*` не импортируют код из других `pages/*`;
- `shared/*` не импортирует из `entities/*`, `features/*`, `widgets/*`, `pages/*`;
- business-aware navigation блоки кабинета, header adapters, page shells живут в `widgets`;
- access/auth flows живут в `features`;
- store и domain transforms живут в `entities`;
- MUI wrappers, tokens, primitives и generic helpers живут в `shared`.

## Route contract

`app/preview/[city]/**/page.tsx` должен быть тонким.

Route file делает только:

1. получить `city` из params;
2. вызвать server loader;
3. отдать payload в page entry.

Route file не должен:

- вручную повторять большой `storeSeed` mapping в каждом файле;
- знать про page layout composition;
- решать layout variations.

Целевой API:

- `mapRoutePayloadToStoreSeed(data, activePage)`
- `<SomePageClient payload={...} />`

## Bootstrap contract

`StoreBootstrap` должен быть app-wide, а не page-aware.

### Допустимо

- seed store из SSR payload;
- общая city hydration;
- session hydration;
- global telemetry hit;
- global localStorage sync.

### Недопустимо

- page-specific refresh каталога;
- profile counters как часть общего bootstrap;
- логика, завязанная на то, home это или cabinet.

Если странице нужен refresh после mount, владелец refresh находится в page/model layer или в dedicated feature/widget bootstrap.

## Server data strategy

Preview должен использовать App Router не только как route shell, но и как data boundary.

### Цели

- server fetch там, где данные не требуют browser-only state;
- predictable cache policy per resource;
- минимальный повторный fetch после hydration;
- user-visible content появляется уже в SSR/streamed HTML.

### Что должно ехать с сервера

- page info;
- footer links;
- city lists;
- home banners;
- home catalog seed;
- contacts page seed;
- cabinet page seed, если auth/session можно читать на сервере.

### Что может оставаться client-only

- local cart from localStorage;
- modal open state;
- optimistic form edits;
- map interactions;
- telemetry that genuinely depends on browser runtime.

## Cache strategy

Не все preview-данные одинаково volatile.

### Рекомендуемые группы

- footer/city/meta info: длинный cache;
- contacts page info: умеренный cache;
- home catalog and banners: короткий `revalidate` или tagged cache;
- auth/user-specific cabinet data: `no-store` или per-session fetch.

### Техническое правило

Server loaders не должны использовать generic `axios` helper как основной transport.

Для App Router server reads лучше:

- `fetch`;
- `cache()`;
- tags / revalidate policy;
- shared cached helper functions.

## Streaming and appearance

Если страница зависит от auth или тяжелых данных, не возвращать `null` как основной UX.

Нужно:

- server-first shell;
- predictable skeleton/placeholder;
- минимизация пустых initial renders;
- редиректы/auth checks по возможности до client hydration.

Особенно это важно для:

- `account`
- `profile`
- `address`
- `zakazy`
- `promokody`

Целевое состояние: либо сервер знает сессию и рендерит страницу сразу, либо показывает устойчивый SSR shell без layout jump.

## Layout contract

Нужно держать три уровня layout.

### 1. `PageLayout`

Назначение:

- global shell;
- `StoreBootstrap`;
- `AppShell`;
- connected header;
- footer.

`PageLayout` не знает ничего о внутренней структуре конкретной страницы.

### 2. `PreviewPageShell`

Назначение:

- связать `PageLayout` с page metadata;
- подставить `activePage`;
- собрать fallback header props;
- выбрать footer mode.

Пример props:

- `storeSeed`
- `activePage`
- `headerNav`
- `cityLabel`
- `footerMode`

### 3. `PageFrame`

Назначение:

- spacing contract;
- page inset;
- intro slot;
- content slot.

`PageFrame` должен иметь варианты через props/modifiers:

- `default`
- `flush`
- `cabinet`
- `hero`

Page-level SCSS не должен переопределять `.page-frame__inner`.

## Cabinet contract

Кабинет должен иметь отдельный reusable shell.

### `CabinetPageShell` должен уметь

- title;
- description;
- desktop section nav;
- compact back bar;
- page frame variant;
- optional markers/counters;
- compact-only routing behavior без копирования между страницами.

### `CabinetPageShell` не должен

- хранить доменные данные конкретной страницы;
- дергать API;
- зависеть от `pages/profile/**`.

Рекомендуемое размещение:

- `src/widgets/cabinet/`

## State ownership

Для каждого домена должен быть один основной источник правды на момент рендера.

### Home

Выбрать один вариант:

1. SSR view model каноничен, store только для refresh/side effects.
2. Store каноничен, SSR payload только seed.

Нельзя держать два полноценных mapper pipeline параллельно.

### Cabinet

- access policy: отдельный feature/widget hook;
- counters: profile entity/widget bootstrap;
- page UI: только чтение готовых значений.

## SCSS правила

### Обязательно

- использовать foundation tokens и mixins;
- держать breakpoint logic через `ui-compact`, `ui-regular`, `ui-expanded`;
- использовать `$ui-font-family`, `$ui-text`, `$ui-brand`, `$ui-surface` и соседние tokens;
- layout modifiers задавать через class/prop contract компонента.

### Не делать

- raw `@media (max-width: 667px)` в page SCSS;
- raw font stacks в page-level files;
- nested overrides в стиле `.page-frame .page-frame__inner`;
- `!important`, если можно поправить shared component contract;
- прямые стили MUI internals на уровне страниц без крайней необходимости.

### Исключение

Если MUI требует служебный override, он должен жить в shared UI wrapper, а не в page stylesheet.

## SCSS ownership

### Page stylesheet

Отвечает только за:

- page composition;
- page sections;
- page-specific spacing/layout;
- page-specific visual states.

### Shared component stylesheet

Отвечает за:

- control internals;
- MUI overrides;
- accessibility state visuals;
- reusable variants.

## MUI v7 rules

### Version policy

Все MUI пакеты желательно держать на одном major.

Если `@mui/material` обновлен до v7, то и:

- `@mui/icons-material`
- `@mui/system`
- `@mui/x-date-pickers`

должны быть проверены на совместимый major, а wrappers пересмотрены сразу после апгрейда.

### API policy

Для новых shared wrappers использовать:

- `slots`
- `slotProps`
- theme-level overrides

Избегать в новом коде:

- legacy `components` / `componentsProps`
- page-level styling через raw MUI internals
- постепенного возврата к `InputProps`/`inputProps`, если можно выразить то же через wrapper API

### Ownership rule

Если MUI-specific workaround нужен больше чем в одном месте, он обязан жить в shared wrapper, а не в page code.

### Widget stylesheet

Отвечает за:

- business-aware composition;
- stable shell blocks вроде header/footer/cabinet intro.

## Style consistency rules

### Typography

- глобальный font stack задается один раз через foundation/base;
- page files не задают `Roboto, Helvetica Neue...` вручную;
- размеры текста для preview используют tokens/mixins, а не набор raw px.

### Color

- page files используют semantic tokens;
- raw brand `#cc0033` не дублировать;
- raw neutrals `#141414`, `#fff`, `rgba(...)` сокращать через tokens по мере правок.

### Z-index

- использовать шкалу токенов;
- не поднимать `z-index` ad hoc в feature/page styles.

### Modal styling

- `ModalWrapper` предоставляет стабильные классы для paper/title/content/close/sheet states;
- feature modal настраивает layout через эти классы, а не через пробивание MUI `!important`;
- sheet/dialog differences должны быть variant-driven.

## Правила для новых страниц

Новая preview-страница должна иметь:

1. server loader;
2. page client entry;
3. page UI;
4. optional page model hook;
5. shell composition через reusable page shell.

Минимальный шаблон:

- `app/preview/[city]/foo/page.tsx`
- `src/pages/foo/ui/FooClient.tsx`
- `src/pages/foo/ui/FooPage.tsx`
- `src/pages/foo/ui/FooPage.scss`

Ограничения:

- route file не дублирует seed mapping руками;
- `FooClient` не копирует весь `PageLayout` boilerplate, а использует shell;
- `FooPage.scss` не ломает базовый `PageFrame`.

## Рекомендуемая следующая реорганизация

### Новые модули

- `src/widgets/page-shell/`
- `src/widgets/cabinet/`
- `src/features/cabinet-access/`
- `src/shared/lib/routeSeed/`

### Что туда перенести

- fallback city/header glue;
- cabinet intro/nav;
- access redirect logic;
- route-to-seed mapper.

## Проверка перед merge

Перед завершением правок в preview:

1. нет ли новых imports из одного `pages/*` в другой `pages/*`;
2. не лезет ли page SCSS в internals `PageFrame` или shared controls;
3. не появился ли новый `!important`;
4. не дублируется ли `activePage`/bootstrap glue между route и client;
5. есть ли один понятный owner у post-mount refresh логики.
