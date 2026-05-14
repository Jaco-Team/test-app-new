# TODO: адаптивность нового Storybook

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

- [ ] Зафиксировать единые размеры Storybook viewport: 320, 668-990, 991+.
- [ ] Для каждого нового компонента добавить checklist: desktop/tablet/mobile визуально проверены.
- [ ] Для компонентов с отдельными core mobile-модулями описать целевой markup перед правкой.
- [ ] Свести повторяющиеся responsive-токены и media rules в shared слой Storybook.
- [ ] После каждой группы компонентов обновлять этот TODO по факту.
- [ ] После визуальной сверки добавить interaction/visual checks прямо в stories там, где это оправдано.

## Не трогаем сейчас

- [SKIP] `stories/widgets/header/**`
- [SKIP] `stories/widgets/footer/**`
- [SKIP] `stories/widgets/NavBarMobile/**`
- [SKIP] `stories/shared/ui/footer-cookie/**`
- [SKIP] `stories/shared/ui/scroll-top/**`
- [SKIP] `stories/legacy/**`

## Pages

- [ ] [MARKUP][CORE MAP] `pages/home/ui/HomePagePC` - core home переключает mobile/PC блоки; проверить баннеры, категории, карточки.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `pages/promotions/ui/PromotionsPage` - начат единый responsive-подход через явный `viewport`; нужна браузерная сверка с core.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `pages/contacts/ui/ContactsPagePC` - в core есть `contactsPC` и `contactsMobile`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `pages/profile/ui/ProfilePagePC` - в core есть `profilePC` и `profileMobile`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `pages/profile-orders/ui/ZakazyPagePC` - в core есть отдельные mobile order screens.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `pages/profile-promocodes/ui/PromokodyPagePC` - в core есть `promokodyPC` и `promokodyMobile`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS][CORE MAP] `pages/about/ui/AboutPagePC` - проверить `aboutPC`, `aboutMobile`, текстовые страницы.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS][CORE MAP] `pages/docs/ui/DocsPagePC` - проверить `pageTextPC/pageTextMobile/documentMobile`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile

## Widgets

- [ ] [CSS] `widgets/home/ui/banner-list/BannerList` - сейчас stories имеют breakpoints, нужна сверка с `bannersPC/bannersMobile`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `widgets/home/ui/product-grid/BoxItemHome` - core home использует отдельные карточки PC/Mobile.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `widgets/promotions/ui/promotion-detail/PromotionDetail` - начат compact markup для mobile/tablet; нужна сверка с core `AkciiItemPC/AkciiItemMobile`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `widgets/cart/ui/cart-panel/CartPC` - core cart mobile сделан отдельным модулем.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `widgets/cart/ui/cart-table/TableCartPC` - таблица вероятно не должна просто сжиматься на mobile.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `widgets/cart/ui/cart-table-body/TableCartPC_body`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `widgets/cart/ui/cart-table-footer/TableCartPC_foot`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS][CORE MAP] `widgets/orders/ui/orders-table/TableOrdersPC` - есть media rules, но надо сверить с mobile orders.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `widgets/contacts/ui/map/MapPC` - проверить размеры и controls на mobile/tablet.
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

- [ ] [MARKUP][CORE MAP] `features/checkout/ui/order-form/FormOrderPC` - core checkout активно ветвится по `matches`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS][CORE MAP] `features/checkout/ui/order-form-button/FormOrderPC_btn`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/checkout/ui/confirm-form-desktop/ConfirmFormPC`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/checkout/ui/confirm-form-mobile/ConfirmFormMobile` - компонент уже mobile-name, проверить нужен ли desktop/tablet story или только mobile.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/checkout/ui/date-time-picker/DataTimePickerPC` - core picker имеет отдельную mobile ветку.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/auth/ui/auth-modal/ModalAuthPC` - core auth modal ветвится по `matches`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/city-address/ui/city-modal/ModalCityPC` - core имеет `modalCityPC/modalCityMobile`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/city-address/ui/address-modal/ModalAddressPC` - проверить mobile address flow.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/city-address/ui/select-address/SelectAddress` - core выбирает modalSelect по `matches`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `features/contacts/ui/contacts-menu/MenuContactsPC`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/orders/ui/order-modal/ModalOrderPC` - core имеет отдельные mobile order modal screens.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/orders/ui/delete-order-modal/ModalOrderDeletePC`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `features/product-modal/ui/product-modal/ModalItemPC` - core имеет `modal_item_PC` и `modal_item_Mobile`.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS][CORE MAP] `features/product-modal/ui/product-image/ModalItemPCimg`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS][CORE MAP] `features/product-modal/ui/product-list/ModalItemPClist`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS][CORE MAP] `features/product-modal/ui/product-description/ModalItemPCdesc`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `features/cart/ui/promo-input/CartPCPromoInput`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `features/cart/ui/promo-text/CartPCPromoText`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `features/social/ui/vk-modal/ModalActiveVK_PC`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile

## Entities

- [ ] [OK] `entities/product/ui/product-card/ItemHome` - есть media rules, нужна визуальная сверка с core PC/Mobile карточками.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `entities/product/ui/badge/Badge`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `entities/product/ui/nutrition/ModalItemPCvalue`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `entities/product/ui/set-item/ModalItemPCset`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [OK] `entities/promotion/ui/promotion-card/PromotionProductItem` - mobile/tablet CSS уже начат, нужна сверка с core promo mobile.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `entities/promotion/ui/promotion-image/BannerImg`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `entities/cart/ui/cart-row/TableCartPC_row`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `entities/cart/ui/cart-text/TableCartPC_text`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `entities/order/ui/order-item/OrderItemPC` - есть media rules, нужна сверка с mobile order item.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `entities/profile/ui/address-card/ProfileAddrPC` - core имеет mobile address карточки.
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [MARKUP][CORE MAP] `entities/profile/ui/promo-code-list/PromokodyPC` - core имеет mobile promo card/list.
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
- [ ] [CSS] `shared/ui/alert/AlertPC`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `shared/ui/close-button/CloseButton`
  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile
- [ ] [CSS] `shared/ui/breadcrumbs/BreadСrumbsPC` - есть media rules, проверить скрытие/упрощение на mobile.
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
- [ ] [CSS] `shared/IconPC/IconPC`
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
