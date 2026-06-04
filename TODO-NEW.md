# DESIGN SYSTEM REBUILD PLAN

## Goal

Не чинить старый Storybook и не продолжать текущую ветку `stories/` как source of truth.

Построить parallel UI layer:

- новый foundation
- новый design system
- новые FSD UI-компоненты
- новый Storybook как документацию и visual testing
- постепенную миграцию legacy/app на новый UI

Source of truth = `src/shared/ui/**` и app/page/widget слои.
Storybook = executable specs, документация и visual regression surface.

## Target Structure

```txt
src/
  app/

  pages/
  widgets/
  features/
  entities/

  shared/
    ui/
      foundation/
      primitives/
      components/
      patterns/
      widgets/

  stories/
```

Parallel folders now exist under src/. Placeholder .gitkeep files were removed after real files were added.

## Architecture Rules

- FSD dependency direction: `app -> pages -> widgets -> features -> entities -> shared`.
- Design system code lives under `src/shared/ui/**`.
- App pages stay under `src/pages/**`; pages are consumers, not part of the design system.
- Do not create `stories2`, `components2`, or final-final folders.
- Do not split components into mobile/tablet/desktop implementations by default.
- Components should be internally adaptive through props, CSS, and theme breakpoints.

## Foundation

Path: `src/shared/ui/foundation/`

Owns:

- semantic breakpoints: compact, regular, expanded
- spacing, typography, color, shadow, radius, z-index, transition tokens
- CSS variables and Sass helpers
- MUI theme aligned to the same breakpoints
- global reset/base styles

Migration rule:

- audit first
- delete dead styles
- delete magic numbers that are not tied to a measured reference
- keep legacy-derived formulas only where they are required for visual parity
- prefer named component tokens/CSS variables for reusable dimensions
- do not let fluid formulas become the default language for every control

## MUI Strategy

Use MUI as behavior infrastructure, not as the public design system:

- `ThemeProvider` and breakpoint engine
- `Dialog`, `Modal`, `Drawer`, `Popover`, `Menu`, `ClickAwayListener`, `Portal` where they remove custom behavior code
- focus management, escape key handling, scroll lock, backdrop, portal layering, and positioning
- `sx` only for local integration glue, not as the main styling language for branded DS surfaces

Do not export raw MUI widgets as the DS contract:

- no exported DS `<MuiButton />`
- no exported DS `<MuiCard />`
- no exported DS `<MuiDrawer />`

Export our own UI:

- `<Button />`
- `<Card />`
- `<Input />`
- `<ModalWrapper />`, `<PopoverMenu />` / future `<Dialog />`, `<BottomSheet />`
- `<Tabs />`

Implementation can use MUI internally. Public API, class names, adaptive variants, and visual skin stay ours.

## Breakpoint Strategy

Semantic product sizes:

- `compact`
- `regular`
- `expanded`

MUI breakpoint engine:

```ts
breakpoints: {
  values: {
    xs: 0,
    sm: 668,
    md: 991,
    lg: 1200,
    xl: 1536,
  },
}
```

Mapping:

- `xs` = compact base
- `sm` = regular starts at 668 px
- `md` = expanded starts at 991 px
- `lg` and `xl` = expanded large-canvas refinements only

## Responsive Rule

Do not split render trees by viewport by default:

```tsx
if (mobile) return <MobileCard />;
```

Prefer adaptive component APIs:

```tsx
<Card
  density={{ xs: 'compact', md: 'comfortable' }}
  orientation={{ xs: 'vertical', md: 'horizontal' }}
/>
```

CSS owns layout. JS owns behavior. Separate render trees only when behavior genuinely differs.

Mobile and tablet are not the same target:

- compact: prioritize reach, bottom-sheet/modal ergonomics, dense controls where legacy requires it
- regular: design deliberately for tablets and small horizontal screens; compact layout is allowed, but text and tap targets must stay accessible
- expanded: desktop navigation and popover behavior

Modals are allowed to change behavior by range: bottom sheet on compact, roomier sheet/dialog on regular, centered dialog/popover on expanded. Use MUI-backed DS wrappers for the mechanics and SCSS/classes for the branded shape.

## Layer Responsibilities

### `src/shared/ui/primitives/`

Layout vocabulary:

- `Stack`
- `Inline`
- `Grid`
- `Surface`
- `Text`
- `Container`

Rules:

- no business meaning
- no project-specific content
- minimal props, predictable spacing, breakpoint-aware

### `src/shared/ui/components/`

Reusable UI controls:

- `Button`
- `Input`
- `Select`
- `Modal`
- `Tabs`
- `Tooltip`
- `Checkbox`
- `Radio`
- `Textarea`

Rules:

- stable public API
- states represented in stories
- accessibility handled here
- visual variants derive from foundation tokens

### `src/shared/ui/patterns/`

Reusable compositions:

- `SearchBar`
- `ProductCard`
- `Navigation`
- `Price`
- `QuantityControl`
- `PriceLine`

Rules:

- can understand domain-shaped data
- still reusable across pages/widgets
- should not fetch data

### `src/shared/ui/widgets/`

Business-aware UI blocks:

- `Header`
- `Footer`
- `Sidebar`
- `Hero`
- `BannerSlider`
- `CartPanel`
- `PromoModal`

Rules:

- can compose primitives/components/patterns
- can expose app-facing contracts
- no legacy Storybook dependencies

### `src/pages/`

Application page compositions.
Pages consume DS widgets and patterns.
Pages are not the design system.

## Storybook Structure

Colocate component stories:

```txt
Button/
  Button.tsx
  Button.module.scss
  Button.stories.tsx
  Button.test.tsx
  index.ts
```

Global Storybook docs only:

```txt
src/stories/
  Introduction.mdx
  Tokens.mdx
  Typography.mdx
  Breakpoints.mdx
  Guidelines.mdx
```

Storybook purpose:

- executable specifications
- states catalog
- documentation
- visual testing entrypoint

Each public component should eventually cover:

- Default
- Compact
- Regular
- Expanded
- Loading
- Disabled
- LongText
- Overflow
- Dark

## Visual Testing

Required before trusting final visual parity:

- Chromatic, or
- Playwright screenshots, or
- Loki

Current workflow rule: do not run typecheck, lint, prettier, eslint, or visual tests by default. Run visual checks only when a change touches fragile measured layout, especially Header, or when explicitly requested.

Pixel-first adaptivity: measure at fixed viewports (320, 668, 991 px), then map to `ui-fluid-*` formulas — see [docs/tablet-adaptation-guide.md](docs/tablet-adaptation-guide.md).

## Migration Order

### Step 1: Parallel folders

Status: done.

Create clean `src/` FSD structure without touching old Storybook implementation.

### Step 2: Foundation

Status: first slice done.

Created:

- `src/shared/ui/foundation/breakpoints.ts`
- `src/shared/ui/foundation/theme.ts`
- `src/shared/ui/foundation/tokens.ts`
- `src/shared/ui/foundation/base.scss`
- `src/shared/ui/foundation/_tokens.scss`
- `src/shared/ui/foundation/_formulas.scss`
- `src/shared/ui/foundation/DesignSystemProvider.tsx`

Semantic viewport API:

- `compact`: 320-667 px
- `regular`: 668-990 px
- `expanded`: 991 px and wider

Define:

- MUI theme
- semantic breakpoints
- CSS variables
- spacing scale
- typography scale
- radius/shadow/z-index/transition tokens
- reset/base styles

Audit old SCSS before importing anything.

### Step 3: Base components

Status: incremental slice done.

Created:

- `Button`
- `Input`
- `Select`
- `Switch`
- `IconButton`
- `ScrollTopButton`
- `Modal`
- `Alert`
- `Card`
- `Badge`
- `Price`
- `QuantityControl`

Build first:

- `Button`
- `Input`
- `Text`
- `Surface`
- `Modal`

Each component gets colocated stories and compact/medium/wide states.

### Step 4: Layout primitives

Status: first migrated set done.

Created:

- `Stack`
- `Inline`
- `Text`
- `Surface`

Build:

- `Stack`
- `Inline`
- `Grid`
- `Container`

Use them in components instead of one-off layout CSS.

### Step 5: Navigation shell

Status: Header preview slice in progress; naming and burger/docs state separation cleaned up.

Build/refine:

- `Header` split into readable sub-surfaces: desktop nav, docs menu, compact menu, actions
- `Footer`
- shared menu/popover primitives backed by MUI behavior
- sidebar/menu pattern only if a real route needs it

Focus on readable ownership: Header visual SCSS can remain custom, but overlay mechanics should move toward MUI-backed DS wrappers instead of hand-rolled click/portal/focus code.

### Step 6: Product and commerce patterns

Status: first slice started.

Created:

- `ProductCard`

Build next:

- `ProductCard` visual parity refinements
- `QuantityControl`
- `PriceLine`
- `BannerSlider`
- `PromoModal`
- `CartPanel`

Use real fixture contracts, not handcrafted story-only shapes.

### Step 7: Page composition

Create first page composition under `src/pages/` consuming the new DS.
Storybook documents the page, but the page component remains app code.

### Step 7b: New core shell (preview App Router)

Status: first slice done.

- Add `app/layout.tsx` with `DesignSystemProvider` and minimal `base.scss` (no legacy global SCSS). `app/` must sit beside root `pages/` (Next constraint).
- Add `app/preview/[city]/page.tsx` — preview route at `/preview/samara`, legacy `/samara` untouched.
- Reuse existing `api()` / city normalization from legacy `pages/[city]/index.jsx`.
- Do **not** add `app/[city]/page.tsx` at production path until cutover (App Router overrides Pages Router).
- Do **not** rename `pages/` to `pages_old`.

Local URLs:

- Legacy: `http://localhost:3000/samara`
- Preview: `http://localhost:3000/preview/samara`

### Step 8: Legacy migration

Legacy pages consume new DS incrementally.
Old Storybook work dies gradually after replacement coverage exists.

## Current Pass Outcome

- Локальные fixtures заведены в src/shared/ui/fixtures: текстовые данные и локально сохранённые reference images для Storybook без зависимости от remote CDN/CORS.

- Removed scaffold .gitkeep placeholders from src.
- Renamed the new layer to ui-prefixed Sass/classes/aliases.
- Kept formulas, but renamed them to ui-fluid-_ and ui-_ mixins.
- Added @ui/\* path alias and removed the old UI alias from config.
- Added commerce primitives/components: Card, Badge, Price, QuantityControl.
- Added ProductCard as a composed pattern using those components.
- Added `PopoverMenu` as the first MUI-backed DS menu primitive: MUI owns menu behavior, project SCSS owns the visual skin.
- Extended `ModalWrapper` with a `responsive` variant for future modal migrations: compact bottom sheet, regular/expanded centered container.
- Started preview home parity work in new core: product detail modal, banner detail modal, cart item add/update actions, responsive basket panel, and regular-range city modal behavior moved onto DS wrappers.
- Storybook build passes as of earlier pass; do not rerun checks by default under the current workflow.

### Step 5b: Header parity pass (preview + legacy backend)

Status: in progress. Burger compact menu and desktop docs menu are separate states. Header CSS naming now distinguishes compact menu, docs menu, and generic desktop icon buttons.

Reference: legacy `/samara`, `modules/header/navBar/*`, and production `https://jacofood.ru/samara`.

**Breakpoint rule:** product DS ranges remain 320-667 compact, 668-990 regular, 991+ expanded. Header may keep legacy-specific visual thresholds only when measured parity requires it; document those exceptions locally in Header, not in global foundation.

**Backend/store rule:** preview may reuse existing app stores and legacy modal stack until DS wrappers replace them. Do not invent new APIs for parity work.

**UX contract:**

| Area               | Target                                                                  | Implementation direction                                                             |
| ------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Compact menu       | Burger opens only compact menu; docs icon is not part of compact header | custom visual Header, later MUI `Drawer`/`SwipeableDrawer` wrapper if behavior grows |
| Desktop docs       | Docs icon opens only docs dropdown and closes on second click           | MUI-backed popover/menu wrapper preferred for future cleanup                         |
| Desktop categories | Opener toggles submenu closed on second click                           | current state model is acceptable; can migrate to shared `PopoverMenu`               |
| City               | Opens city modal/list as legacy does                                    | keep store adapter in connected layer                                                |
| Cart               | Opens basket with formatted ₽ total                                     | keep store adapter in connected layer                                                |
| Profile            | Auth modal or profile route                                             | keep store adapter in connected layer                                                |
| Typography/layout  | Match legacy where visible, but keep class names readable               | SCSS is allowed; avoid formula soup by introducing local component variables         |

**Modal direction:** mobile modals are custom product UX, not generic desktop dialogs. Build DS modal wrappers around MUI behavior with range variants: compact bottom sheet, regular accessible sheet/dialog, expanded dialog/popover.

**Verification rule:** do not run typecheck or visual tests by default. If Header layout is changed, verify manually or visually at 320, 668, 991 before calling it done.

## Immediate Next Work

Work in small steps and keep each step reviewable:

1. Header cleanup follow-up: split `Header.tsx` into internal subcomponents only if the next change touches that area again; otherwise avoid disturbing the tuned layout.
2. Use `PopoverMenu` for the next dropdown/menu migration when touching docs/category menus again; do not disturb tuned Header layout just to swap internals.
3. Use `ModalWrapper` `responsive` for the next modal migration where compact sheet and regular/expanded dialog behavior match the UX. Add more variants only from real modal needs.
4. Audit current DS modal usage and define compact/regular/expanded modal content rules before migrating more routes.
5. Refine Footer/BannerSlider SCSS against legacy at 320, 668, 991 px without running visual tests unless layout changes are significant.
6. Continue cart/auth/city modal parity: promo validation, full order slide modal, and missing legacy basket form details still need migration into new core.
7. Refine ProductCard grid density and filter block, with regular range designed explicitly for tablets/small horizontal screens.
8. Split the generated icon catalog into smaller domain icon modules before it becomes a bundle problem.
9. Cut over `/[city]` only when preview matches production.

## Hard Rules

Do not:

- rewrite the whole app at once
- continue patching the failed Storybook layer as the new DS
- create `stories2` or `components2`
- blindly copy old SCSS
- split components by viewport unless behavior requires it
- let Storybook become source of truth

Do:

- build a parallel UI layer
- migrate gradually
- keep component code as source of truth
- colocate stories with components
- use visual contracts when layout is ready to lock
- use layout primitives
- expose responsive variants through adaptive props
- keep tokens and breakpoints centralized
- use MUI for hard overlay behavior and custom SCSS for branded visual parity
- treat regular/tablet as a real design target, not stretched mobile
