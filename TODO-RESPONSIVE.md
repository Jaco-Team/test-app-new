# TODO: адаптивность нового Storybook

## Как вести этот файл

- Каждая завершённая строка: перевести чекбокс `- [ ]` в `- [x]` в том же изменении, что и правка компонента или сверка в браузере.
- Для **полностью закрытого** компонента (все три вложенных Desktop / Tablet / Mobile отмечены) можно дополнительно зачеркнуть основную строку: `~~текст~~` внутри пункта — по желанию; достаточно `[x]` на родителе и на подпунктах.
- После группы правок — обновить блок «Системные задачи», если затронуты вьюпорты, фикстуры или общие токены.
- Пути компонентов — **как в FSD Storybook** (без суффикса `PC` в имени папки; Desktop — это вариант вёрстки, не часть пути).

## Контекст

Сейчас новый Storybook в основном показывает компоненты в трех viewport-сценариях:

- `Mobile`: 320-667
- `Tablet`: 668-990
- `Desktop`: от 991

Это проверяет ширину превью, но не гарантирует реальную адаптивную верстку. В legacy stories в основном были PC-компоненты без полноценной разницы по breakpoint-макету. В core-проекте адаптивность часто сделана иначе: через отдельные PC/Mobile модули и переключение по `matches`, плюс отдельные SCSS-файлы для mobile/PC.

Задача следующего этапа: не трогая core и legacy, привести новые FSD TS компоненты в Storybook к реальной responsive-модели, сверяя поведение с core UI.

## Принципы работ

- Core, legacy и продовое поведение не меняем.
- Header/Footer не трогаем в рамках этого списка, пока они ведутся отдельно.
- Новые компоненты не должны импортировать legacy-код.
- Сначала сверяем компонент с core UI на desktop/mobile, потом решаем: достаточно CSS или нужен отдельный responsive-markup.
- Tablet не копируем вслепую из mobile или desktop: делаем промежуточную верстку под 668-990.
- Storybook stories должны оставаться витриной, документацией и базой для будущих interaction/visual tests.
- После подтверждения нового компонента legacy story больше не выводим в UI Storybook, оставляем только как справочный исходник.

## Легенда статусов

- `OK`: базовая адаптивность уже есть, нужна только проверка в браузере.
- `CSS`: вероятно достаточно доработать стили под breakpoints.
- `MARKUP`: нужен отдельный или условный markup под mobile/tablet/desktop.
- `CORE MAP`: нужно сначала точно сопоставить с core-модулем, потому что в core есть отдельная responsive-реализация.
- `SKIP`: вне текущего scope.

## Системные задачи

- [x] Зафиксировать единые размеры Storybook viewport: 320, 668–990, 991+ — см. `.storybook/presets/viewports.mjs`, `stories/shared/lib/storybook/responsive.ts`, `stories/shared/styles/settings/_breakpoints.scss`.
- [ ] Для каждого нового компонента добавить checklist: desktop/tablet/mobile визуально проверены.
- [ ] Для компонентов с отдельными core mobile-модулями описать целевой markup перед правкой.
- [ ] Свести повторяющиеся responsive-токены и media rules в shared слой Storybook.
- [ ] После каждой группы компонентов обновлять этот TODO по факту.
- [ ] После визуальной сверки добавить interaction/visual checks прямо в stories там, где это оправдано.
- [x] Дымовой доступ к Storybook из автоматизации: `playwright.config.ts`, `e2e/storybook-smoke.spec.ts`, скрипт `npm run test:e2e` (Storybook должен быть доступен по `STORYBOOK_URL` или поднят через `webServer`; для ручной проверки — Chrome MCP на `http://localhost:6007/`).

## Не трогаем сейчас

- [SKIP] `stories/widgets/header/**`
- [SKIP] `stories/widgets/footer/**`
- [SKIP] `stories/widgets/NavBarMobile/**`
- [SKIP] `stories/shared/ui/footer-cookie/**`
- [SKIP] `stories/shared/ui/scroll-top/**`
- [SKIP] `stories/legacy/**`

## Pages

- [x] [MARKUP][CORE MAP] `pages/home/ui/HomePage` — core home переключает mobile/PC блоки; проверить баннеры, категории, карточки.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `pages/promotions/ui/PromotionsPage` - начат единый responsive-подход через явный `viewport`; нужна браузерная сверка с core.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `pages/contacts/ui/ContactsPage` — в core есть `contactsPC` и `contactsMobile`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `pages/profile/ui/ProfilePage` — в core есть `profilePC` и `profileMobile`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `pages/profile-orders/ui/ZakazyPage` — в core есть отдельные mobile order screens.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `pages/profile-promocodes/ui/PromokodyPage` — в core есть `promokodyPC` и `promokodyMobile`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS][CORE MAP] `pages/about/ui/AboutPage` — проверить `aboutPC`, `aboutMobile`, текстовые страницы.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS][CORE MAP] `pages/docs/ui/DocsPage` — проверить `pageTextPC/pageTextMobile/documentMobile`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile

## Widgets

- [ ] [CSS] `widgets/home/ui/banner-list/BannerList` - сейчас stories имеют breakpoints, нужна сверка с `bannersPC/bannersMobile`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [x] [MARKUP][CORE MAP] `widgets/home/ui/product-grid/BoxItemHome` - core home использует отдельные карточки PC/Mobile.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `widgets/promotions/ui/promotion-detail/PromotionDetail` - начат compact markup для mobile/tablet; нужна сверка с core `AkciiItemPC/AkciiItemMobile`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `widgets/cart/ui/cart-panel/Cart` — core cart mobile сделан отдельным модулем.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `widgets/cart/ui/cart-table/TableCart` — таблица вероятно не должна просто сжиматься на mobile.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `widgets/cart/ui/cart-table-body/TableCart_body`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `widgets/cart/ui/cart-table-footer/TableCart_foot`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS][CORE MAP] `widgets/orders/ui/orders-table/TableOrders` — есть media rules, но надо сверить с mobile orders.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `widgets/contacts/ui/map/Map` — проверить размеры и controls на mobile/tablet.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `widgets/FooterCookie/FooterCookie` - отдельная старая копия вне нового shared scope; решить, оставлять или удалить из навигации позже.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `widgets/FooterArrowUp/FooterArrowUp` - отдельная старая копия вне нового shared scope; решить, оставлять или удалить из навигации позже.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile

## Features

- [ ] [MARKUP][CORE MAP] `features/checkout/ui/order-form/FormOrder` — core checkout активно ветвится по `matches`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS][CORE MAP] `features/checkout/ui/order-form-button/FormOrder_btn`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/checkout/ui/confirm-form-desktop/ConfirmForm`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/checkout/ui/confirm-form-mobile/ConfirmFormMobile` - компонент уже mobile-name, проверить нужен ли desktop/tablet story или только mobile.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/checkout/ui/date-time-picker/DataTimePicker` — core picker имеет отдельную mobile ветку.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/auth/ui/auth-modal/ModalAuth` — core auth modal ветвится по `matches`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/city-address/ui/city-modal/ModalCity` — core имеет `modalCityPC/modalCityMobile`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/city-address/ui/address-modal/ModalAddress` — проверить mobile address flow.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/city-address/ui/select-address/SelectAddress` - core выбирает modalSelect по `matches`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `features/contacts/ui/contacts-menu/MenuContacts`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/orders/ui/order-modal/ModalOrder` — core имеет отдельные mobile order modal screens.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/orders/ui/delete-order-modal/ModalOrderDelete`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [x] [MARKUP][CORE MAP] `features/product-modal/ui/product-modal/ModalItem` — core имеет `modal_item_PC` и `modal_item_Mobile`.
  - [x] Desktop
  - [x] Tablet
  - [x] Mobile
- [x] [CSS][CORE MAP] `features/product-modal/ui/product-image/ModalItemImg`
  - [x] Desktop
  - [x] Tablet
  - [x] Mobile
- [ ] [CSS][CORE MAP] `features/product-modal/ui/product-list/ModalItemList` - mobile set/value checked; tablet/desktop detail states still need a dedicated pass.
  - [ ] Desktop
  - [ ] Tablet
  - [x] Mobile
- [x] [CSS][CORE MAP] `features/product-modal/ui/product-description/ModalItemDesc`
  - [x] Desktop
  - [x] Tablet
  - [x] Mobile
- [ ] [CSS] `features/cart/ui/promo-input/CartPromoInput`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `features/cart/ui/promo-text/CartPromoText`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `features/social/ui/vk-modal/ModalActiveVK`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile

## Entities

- [x] [OK] `entities/product/ui/product-card/ItemHome` - есть media rules, нужна визуальная сверка с core PC/Mobile карточками.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `entities/product/ui/badge/Badge`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `entities/product/ui/nutrition/ModalItemValue` - mobile checked inside product modal list; desktop/tablet standalone still pending.
  - [ ] Desktop
  - [ ] Tablet
  - [x] Mobile
- [ ] [CSS] `entities/product/ui/set-item/ModalItemSet` - mobile image source and layout checked inside set list; desktop/tablet standalone still pending.
  - [ ] Desktop
  - [ ] Tablet
  - [x] Mobile
- [ ] [OK] `entities/promotion/ui/promotion-card/PromotionProductItem` - mobile/tablet CSS уже начат, нужна сверка с core promo mobile.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `entities/promotion/ui/promotion-image/BannerImg`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `entities/cart/ui/cart-row/TableCart_row`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `entities/cart/ui/cart-text/TableCart_text`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `entities/order/ui/order-item/OrderItem` — есть media rules, нужна сверка с mobile order item.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `entities/profile/ui/address-card/ProfileAddr` — core имеет mobile address карточки.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `entities/profile/ui/promo-code-list/Promokody` — core имеет mobile promo card/list.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `entities/navigation/ui/category-menu/CategoryMenu` - нет отдельной story в текущем списке; проверить, нужен ли публичный story.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile

## Shared UI

- [ ] [CSS] `shared/ui/button/MyButton`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `shared/ui/text-input/MyTextInput`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `shared/ui/select/MySelect`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `shared/ui/switch/MySwitch`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `shared/ui/alert/Alert`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `shared/ui/close-button/CloseButton`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `shared/ui/breadcrumbs/BreadCrumbs` — есть media rules, проверить скрытие/упрощение на mobile.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `shared/MyMenu/MyMenu` - есть media rules, проверить актуальность пути и необходимость переноса в `shared/ui`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `shared/MyTextLink/MyCatLink`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `shared/Icon/Icon`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile

## Рекомендуемый порядок работ

1. Сначала страницы и крупные widgets: home, promotions, cart, profile, orders, contacts.
2. Затем features, которые участвуют в этих страницах: checkout, auth, address, product modal.
3. Затем entities: product card, promo card, cart row, order item, profile cards.
4. В конце shared UI и техническая чистка stories.

## Definition of Done для компонента

- Есть stories для Mobile, Tablet, Desktop.
- Story viewport реально соответствует breakpoint.
- Визуально сверено с core UI на desktop и mobile.
- Tablet ведет себя осмысленно, без desktop-only сжатия.
- Нет импорта legacy в новый компонент.
- Нет правок core/legacy.
- Если компонент подтвержден, legacy story не показывается в навигации Storybook.

- `entities/product/ui/product-modal/ProductModal`: mobile/tablet/desktop checked in Storybook iframe this iteration; story data aligned to live `Морской сет`; tablet reshuffle added to avoid stretched mobile layout; no TODO row existed above, so keep as session note until checklist is normalized.

## Codex handoff: responsive migration guide

### Рабочие правила миграции

- Миграция идет Storybook-first: не менять core Next.js приложение и не тянуть новые изменения в `stories/legacy`.
- Новые/мигрируемые компоненты держать в `stories/{app,pages,widgets,features,entities,shared}` по FSD-направлению зависимостей: `app -> pages -> widgets -> features -> entities -> shared`.
- UI в core уже responsive; новые Storybook компоненты должны повторять layout/поведение core UI, но оставаться в новом Storybook TS/TSX + SCSS дизайне, naming и typing patterns.
- Reference для визуальной сверки: Storybook `http://localhost:6007/` и production `https://jacofood.ru/samara`.
- Проверять mobile `320-667`, tablet `668-990`, desktop `991+`; tablet - отдельная вариация, не растянутый mobile/desktop.
- Если рядом есть suffix variations `PC`, `Tablet`, `Mobile`, допустимо переименовывать `PC` в `Desktop`.
- Не показывать дифы/патчи/тела файлов в чат; только короткие статусы и recap.
- Не запускать prettier/eslint/lint без прямой просьбы.
- Если найдено глобальное улучшение Storybook framework/design system, сначала alert/confirm, потом менять.
- Sass: не использовать `@import`; Dart Sass 3 compatible `@use/@forward`, миксины брать из `stories/shared/global.scss` exported API. В Storybook SCSS использовать `@include mobile`, `@include tablet`, `@include desktop`, не голый `respond(...)`, если он не импортирован явно.

### Что уже сделано в этой сессии

- Storybook parser fix: JSX-bearing Storybook files переведены в TSX, root `ui/Icons.js` не менять. Для Storybook добавлена копия core icons внутри `stories/shared/compat/CoreIcons.tsx`; новые Storybook слои должны импортировать ее через `@stories/shared/compat/CoreIcons`, если нужен старый root icon.
- Home migration: `pages/home/ui/HomePage` обработан и визуально подтвержден пользователем как нормальный.
- Home добавил/использует responsive category strip, banner, product grid/card behavior; Sass mixin issue исправлен на Storybook exported mixins.
- `widgets/home/ui/product-grid/BoxItemHome` обработан: mobile grid проверен без horizontal overflow.
- `entities/product/ui/product-card/ItemHome` обработан: standalone story args переведены на typed product fixture fields, чтобы standalone story не теряла title/image/description.

### Где продолжить

1. `entities/product/ui/product-modal/ProductModal` проверен на mobile/tablet/desktop; дальше нужен отдельный проход по nutrition/rolls overlay states на tablet/desktop.
2. Product-modal feature layer: `features/product-modal/ui/product-modal/ModalItem`, `product-image`, `product-description` закрыты на start-state mobile/tablet/desktop; `product-list`, `ModalItemSet`, `ModalItemValue` проверены на mobile, tablet/desktop detail states остаются следующими.
3. После каждой завершенной группы обновлять чекбоксы в этом файле.
4. Для каждого компонента: открыть direct iframe story, проверить mobile/tablet/desktop, проверить отсутствие horizontal overflow, сверить с core/prod layout, затем править только Storybook layer.
