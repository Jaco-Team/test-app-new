# Storybook FSD TypeScript Migration Todo

## Scope

- The current product is a legacy JS/JSX Next.js app.
- The base app must keep working while migration happens.
- Migration target is Storybook-first FSD + TypeScript.
- Existing legacy stories in `stories/legacy` are the main source to port.
- Porting means creating new/refactored FSD TypeScript components and stories, not adapters that import legacy components.
- Header and Footer are part of the new Storybook FSD layer; old helper files stay on disk as reference until replacement is verified.
- After all relevant UI is ported and verified in Storybook, the base app can be upgraded and rewired to consume the Storybook components.

## Current Baseline

- Latest checked commit: `d124c37 DRAFT-41015: Первая передлка на FSD в storyBook пока шапка.`
- Storybook config lives in `.storybook`.
- FSD folders exist under `stories/{app,pages,widgets,features,entities,shared}`.
- `stories/legacy` contains 57 legacy `.stories.jsx` files.
- Current FSD TypeScript coverage is partial: shared primitives and header/mobile navigation.
- `storybook-static` is a generated static Storybook build output, not source code.

## Breakpoints

- Mobile: `320-667`.
- Tablet: `668-990`.
- Desktop: `991+`.

Each indexed FSD story should expose explicit `Mobile`, `Tablet`, and `Desktop` representations using the shared Storybook viewport helper.

## Migration Rules

- Do not modify the base app during Storybook migration.
- Do not move legacy files destructively until the FSD replacement is complete.
- Do not import legacy components from new FSD stories except temporarily during analysis.
- Port behavior and states from legacy stories, not only visual markup.
- New source should be TypeScript: `.tsx` components and `.stories.tsx` stories.
- Legacy-derived migrated files may start with deferred type checking during the bulk port; remove those markers slice-by-slice while refactoring each component to clean typed props.
- Keep fixtures in `stories/fixtures`.
- Keep styles colocated with Storybook components unless an established shared style exists.
- Use FSD dependency direction: `app -> pages -> widgets -> features -> entities -> shared`.
- Keep legacy stories available until their FSD equivalents are verified.

## Step 1: Inventory And Mapping

- Map every `stories/legacy/*/*.stories.jsx` file to a target FSD layer.
- Record props, states, fixtures, images, and interactions used by each legacy story.
- Mark whether the source exists only in Storybook or mirrors code from `modules`, `ui`, or `styles`.
- Decide the responsive requirements for each item: mobile, tablet, desktop.
- Keep the core hint current: mobile `320-667`, tablet `668-990`, desktop `991+`.

## Step 2: Shared Foundation

- `stories/shared`
  - Buttons: `MyButton`, close button, cart CTA button variants.
  - Inputs: text input, select, switch, checkbox/autocomplete if needed from app UI.
  - Links/menu primitives: category link, menu popper, breadcrumbs.
  - Icons: header icons, modal icons, status icons, product badges.
  - Typography: font setup and reusable text primitives.
  - Feedback: alert, empty/error/loading states.

## Step 3: Entities

- `stories/entities/product`
  - Product card.
  - Product badge.
  - Product image and placeholder state.
  - Product nutrition/value row.
  - Product set item.
  - Product list item inside modal.
- `stories/entities/cart-item`
  - Cart table row.
  - Cart table text.
  - Promo row/item state.
  - Count/quantity states.
- `stories/entities/order`
  - Order item.
  - Order table.
  - Delete order modal content.
- `stories/entities/profile`
  - Address card.
  - Promo code card.

## Step 4: Features

- `stories/features/auth`
  - Auth modal shell.
  - Start state.
  - SMS login.
  - SMS code.
  - Reset password.
  - Create account.
  - Finish state.
- `stories/features/city-and-address`
  - City modal.
  - Address modal.
  - Address selector.
  - Contacts city/menu selector.
- `stories/features/cart`
  - Promo input.
  - Promo description.
  - Cart table body/footer composition.
  - Order confirmation form.
  - Date/time picker.
  - Payment/mail/delivery option states when ported from app modules.
- `stories/features/product-modal`
  - Modal image.
  - Modal description.
  - Modal variants.
  - Modal set/list/value sections.
  - Add-to-cart states.

## Step 5: Widgets

- `stories/widgets/header`
  - Mobile header.
  - Tablet header.
  - Desktop header.
  - Navigation menu.
  - Basket icon states.
  - City/profile/docs actions.
- `stories/widgets/footer`
  - Desktop footer.
  - Mobile footer when ported from app modules.
  - Cookie notice.
  - Arrow-up control.
- `stories/widgets/home`
  - Banner image.
  - Banner item.
  - Banner list.
  - Category menu.
  - Filter.
  - Product grid/list.
- `stories/widgets/cart`
  - Cart page table/widget.
  - Cart summary.
  - Cart confirmation blocks.
- `stories/widgets/profile`
  - Profile layout blocks.
  - Orders section.
  - Addresses section.
  - Promo codes section.
- `stories/widgets/contacts`
  - Contacts menu.
  - Map block.
  - Contacts info block.

## Step 6: Pages

- `stories/pages/home`
  - Home page composition.
  - Cookie/arrow/banner/product states.
- `stories/pages/akcii`
  - Promotions list.
  - Promotion detail/card states.
- `stories/pages/cart`
  - Cart page composition.
  - Empty/active/promo states.
- `stories/pages/about`
  - About page sections.
- `stories/pages/contacts`
  - Contacts page composition.
- `stories/pages/docs`
  - Legal/docs text page.
- `stories/pages/profile`
  - Profile page.
  - Orders page.
  - Promo codes page.
  - Addresses page.

## Step 7: Responsive Pass

- Add mobile stories for components currently represented only as PC legacy stories when the app has mobile equivalents.
- Add tablet stories for every migrated page/widget that participates in layout.
- Keep `Mobile`, `Tablet`, and `Desktop` smoke stories present in every indexed FSD story file, even when the component still needs deeper responsive refactoring.
- Confirm Storybook viewports use only project ranges:
  - `mobileMin` / `mobileMax`.
  - `tabletMin` / `tabletMax`.
  - `desktopMin`.
- Keep tablet separate from mobile and desktop.

## Step 8: Verification

- Build or test Storybook when behavior changes are made and practical.
- Use Chrome MCP against the already-running default Storybook URL: `http://localhost:6007`.
- Verify at least one story per migrated UI group at mobile, tablet, and desktop where applicable.
- Check interactive states: open menus, modal states, promo states, active basket, auth flow states.
- Keep visual regression candidates stable by using fixtures instead of live data.

## Step 9: Legacy Retirement

- For each legacy story, keep it until the FSD TS replacement has matching states.
- After verification, mark the legacy story as ported in this TODO or a migration table.
- Remove or exclude legacy only after all dependent FSD coverage exists.

## Step 10: Core Rewire Later

- Upgrade/refactor the base app only after Storybook coverage is complete.
- Replace base app UI imports with Storybook-proven FSD components.
- Keep backend contract changes separate from UI rewiring.
- Final backend migration target: Laravel.

## Phase 1: Port Legacy Stories To FSD TS

Goal: every existing legacy Storybook story gets an equivalent FSD TypeScript story before the base app is touched.

For each item in `stories/legacy`:

1. Choose target FSD layer and folder.
2. Convert component to `.tsx`.
3. Convert story to `.stories.tsx`.
4. Move mock data into `stories/fixtures` when reusable.
5. Preserve legacy states and interactions.
6. Add required responsive variants.
7. Run TypeScript check and Storybook verification when practical.
8. Mark the legacy item as ported.

Bulk port status:

- Non-header/non-footer legacy Storybook files were copied into new FSD layer folders as parallel `.tsx` / `.stories.tsx` files.
- Existing `stories/legacy` files remain unchanged as reference material.
- Existing Header and Footer Storybook work remains unchanged.
- TypeScript check passes after this bulk inventory pass.
- Next quality step: remove deferred type-check markers and refactor props/imports/styles slice-by-slice.

## Phase 2: Scan App Code For Missing Storybook Coverage

Goal: after legacy stories are ported, scan `pages`, `modules`, `ui`, `components`, and `styles` for UI that never had legacy Storybook coverage.

Output should be an updated remaining-transfer checklist by page and component.

## Phase 3: Complete Missing Storybook Coverage

Goal: port the remaining app-only UI blocks into FSD TS Storybook.

Do this before rewiring the base app.

## Phase 4: Core Rewire

Goal: upgrade/refactor the base app and consume the Storybook-proven FSD components.

Backend migration to Laravel remains a later separate phase.

## Initial Legacy Port Order

1. Shared primitives: buttons, inputs, icons, links, menus, alerts.
2. Header and navigation across all breakpoints.
3. Home/catalog product entities and widgets.
4. Product modal and cart features.
5. Footer.
6. Cart page.
7. Auth/city/address flows.
8. Profile/orders/promocodes.
9. Contacts/about/docs/promotions pages.

## Legacy Story Groups To Port

- Header
  - `AlertPC`
  - `HeaderPC`
  - `MyMenu`
  - `MyTextLink`
  - `SelectAddress`
  - `ModalCityPC`
  - `ModalAddressPC`
  - `ModalAuthPC`
  - `FormOrderPC`
  - `FormOrderPC_btn`
- Home/catalog
  - `HomePage`
  - `Badge`
  - `ItemHomePc`
  - `BoxItemHomePC`
  - `ModalItemPC`
  - `ModalItemPCdesc`
  - `ModalItemPCimg`
  - `ModalItemPClist`
  - `ModalItemPCset`
  - `ModalItemPCvalue`
- Promotions
  - `AkciiPagePC`
  - `BannerFullPC`
  - `BannerItemPC`
  - `BannerListPC`
  - `BannerPCImg`
- Cart/order
  - `CartPC`
  - `CartPCPromoInput`
  - `CartPCPromoText`
  - `TableCartPC`
  - `TableCartPC_body`
  - `TableCartPC_foot`
  - `TableCartPC_row`
  - `TableCartPC_text`
  - `ConfirmFormPC`
  - `ConfirmFormMobile`
  - `DataTimePickerPC`
- Footer
  - `FooterPC`
  - `FooterCookie`
  - `FooterArrowUp`
- Profile
  - `ProfilePagePC`
  - `ProfileAddrPC`
  - `PromokodyPC`
  - `PromokodyPagePC`
  - `ZakazyPagePC`
  - `OrderItemPC`
  - `TableOrdersPC`
  - `ModalOrderPC`
  - `ModalOrderDeletePC`
- Static/content pages
  - `AboutPagePC`
  - `ContactsPagePC`
  - `DocsPagePC`
  - `BreadСrumbsPC`
  - `MapPC`
  - `MenuContactsPC`
- Shared elements
  - `MyButton`
  - `MySelect`
  - `MySwitch`
  - `MyTextInput`
  - `CloseButton`

## Remaining App UI To Transfer After Legacy Stories

This list comes from scanning current `pages`, `modules`, `ui`, `components`, and `styles`. Re-check it after Phase 1 because some items may already be covered by legacy stories.

### Global Shell

- App shell
  - `pages/_app.js`
  - global style imports from `styles/*`
  - font setup from `ui/Font.js`
- Document shell
  - `pages/_document.js`
  - external script placeholders and layout assumptions.
- Shared runtime wrappers
  - `components/header.js`
  - `components/footer.js`
  - `components/docsBreadcrumbs.js`
  - `components/loadMap.js`
  - `components/meta.js`

### Shared UI

- `ui/CartCtaButton.js`
- `ui/Fade.js`
- `ui/MyAlert.js`
- `ui/MyAutocomplete.js`
- `ui/MyAutocomplete_test.js`
- `ui/MyCheckBox.js`
- `ui/MyPopper.js`
- `ui/MySelect.js`
- `ui/MySwitch.js`
- `ui/MyTextInput.js`
- `ui/Switch.js`
- `ui/Icons.js`

### Header

- Desktop/mobile header compositions
  - `modules/header/navBar/navBarPC.js`
  - `modules/header/navBar/navBarMobile.js`
  - `modules/header/alert.js`
- Header basket
  - `modules/header/basket/basketIconHeaderPC.js`
  - `modules/header/basket/basketIconHeaderMobile.js`
  - `modules/header/basket/basketPC.js`
  - `modules/header/basket/tablePC.js`
  - `modules/header/basket/rowPC.js`
- Header profile
  - `modules/header/profile/profileIconHeaderPC.js`
  - `modules/header/profile/profileIconHeaderMobile.js`
- Header modals
  - `modules/header/modalAuth/*`
  - `modules/header/modalCity/modalCityPC.js`
  - `modules/header/modalCity/modalCityMobile.js`
  - `modules/header/modalActiveVK/modalActiveVK_pc.js`
  - `modules/header/modalActiveVK/modalActiveVK_mobile.js`
  - `modules/header/modalPointClose/modalPointClose_pc.js`
  - `modules/header/modalPointClose/modalPointClose_mobile.js`
  - `modules/header/selectAddress.js`

### Home And Menu Pages

- Routes
  - `pages/[city]/index.jsx`
  - `pages/[city]/menu.jsx`
  - `pages/[city]/menu/[category].js`
- Page/module composition
  - `modules/home/page.js`
  - `modules/home/filter/filter.js`
  - `modules/home/menuCatMobile/menuCatMobile.js`
- Banners
  - `modules/home/banners/bannersPC.js`
  - `modules/home/banners/bannersMobile.js`
  - `modules/home/banners/modalBannersPC.js`
  - `modules/home/banners/modalBannersMobile.js`
- Product cards and modals
  - `modules/home/cardItem/badge.js`
  - `modules/home/cardItem/cardItemPc.js`
  - `modules/home/cardItem/cardItemMobile.js`
  - `modules/home/cardItem/cardItems.js`
  - `modules/home/cardItem/modalCardItemPC.js`
  - `modules/home/cardItem/modalCardItemMobile.js`
  - `modules/home/cardItem/modal_item_PC.js`
  - `modules/home/cardItem/modal_item_Mobile.js`

### Promotions

- Routes
  - `pages/[city]/akcii.jsx`
  - `pages/[city]/akcii/[name].js`
- Modules
  - `modules/akcii/page.js`
  - `modules/akcii/PC/akciiPC.js`
  - `modules/akcii/PC/akciiItemPC.js`
  - `modules/akcii/mobile/akciiMobile.js`
  - `modules/akcii/mobile/akciiItemMobile.js`

### Cart And Checkout

- Route
  - `pages/[city]/cart.jsx`
- Cart page/modules
  - `modules/cart/page.js`
  - `modules/cart/cartMobile.js`
  - `modules/cart/cartItemsMobile.js`
  - `modules/cart/cartMenuMobile.js`
  - `modules/cart/basketModalPC.js`
  - `modules/cart/cartMapPoints.js`
  - `modules/cart/cartConfirmMap.js`
- Checkout forms
  - `modules/cart/confirmForm.js`
  - `modules/cart/payForm.js`
  - `modules/cart/mailForm.js`
  - `modules/cart/dopsForm.js`
  - `modules/cartForm/formOrder.js`
  - `modules/cartForm/dataTimePicker.js`

### Profile Area

- Routes
  - `pages/[city]/profile.jsx`
  - `pages/[city]/account.jsx`
  - `pages/[city]/address.jsx`
  - `pages/[city]/promokody.jsx`
  - `pages/[city]/zakazy.jsx`
- Profile page
  - `modules/profile/profile/page.js`
  - `modules/profile/profile/profilePC.jsx`
  - `modules/profile/profile/profileMobile.js`
  - `modules/profile/profile/modalProfileMobile.js`
  - `modules/profile/profile/modalAddr.jsx`
  - `modules/profile/profile/modalGetAddress_PC.js`
  - `modules/profile/profileBreadcrumbs.jsx`
- Account
  - `modules/profile/account/page.js`
  - `modules/profile/account/accountMobile.js`
  - `modules/profile/account/modalAccountMobile.js`
- Address
  - `modules/profile/address/page.js`
  - `modules/profile/address/addressMobile.js`
  - `modules/profile/address/modalAddressMobile.js`
  - `modules/profile/address/modalGetAddressMobile.js`
- Promocodes
  - `modules/profile/promokody/page.jsx`
  - `modules/profile/promokody/promokodyPC.jsx`
  - `modules/profile/promokody/promokodyMobile.js`
  - `modules/profile/promokody/promoCardPC.jsx`
  - `modules/profile/promokody/promoCardMobile.js`
- Orders
  - `modules/profile/zakazy/page.js`

### Contacts

- Route
  - `pages/[city]/contacts.jsx`
- Modules
  - `modules/contacts/page.js`
  - `modules/contacts/contactsPC.js`
  - `modules/contacts/contactsMobile.js`
  - `modules/contacts/contactsModalChoose.js`

### About

- Route
  - `pages/[city]/about.jsx`
- Modules
  - `modules/about/aboutPage.js`
  - `modules/about/aboutMobile.js`
  - `modules/about/pc/aboutPC.js`
  - `modules/about/pc/aboutBreadcrumbs.js`
  - `modules/about/pc/aboutUs.js`
  - `modules/about/pc/excellentDishes.js`
  - `modules/about/pc/responsibility.js`
  - `modules/about/pc/orderTime.js`
  - `modules/about/pc/cafeLooks.js`
  - `modules/about/pc/affordablePrices.js`
  - `modules/about/pc/feedback.js`
  - `modules/about/pc/weOptimism.js`
  - `modules/about/pc/cooperation.js`

### Static Text And Legal Pages

- Routes
  - `pages/[city]/document.jsx`
  - `pages/[city]/legal.jsx`
  - `pages/[city]/jobs.jsx`
  - `pages/[city]/company-details.jsx`
  - `pages/[city]/instpayorders.jsx`
  - `pages/[city]/only_pay_page.jsx`
  - `pages/[city]/pamiatka_po_sohraneniiu_zdorovia.jsx`
  - `pages/[city]/politika-konfidencialnosti.jsx`
  - `pages/[city]/politika-legal.jsx`
  - `pages/[city]/publichnaya-oferta.jsx`
- Modules
  - `modules/pageText.js`
  - `modules/document/documentMobile.js`

### Sitemap And Utility Pages

- Routes
  - `pages/[city]/sitemap.jsx`
  - `pages/404.js`
- Modules
  - `modules/sitemap/sitemap.js`

## Notes On `storybook-static`

- `storybook-static` is generated by a Storybook build.
- It contains compiled bundles, copied assets, `index.html`, `index.json`, and Storybook metadata.
- Its `project.json` says it was generated by Storybook `8.0.9` with Next `14.2.3`, so it is older than the current package versions.
- Treat it as a reference artifact only, not editable source.
