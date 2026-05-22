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

- breakpoints
- spacing
- typography
- color variables
- shadows
- z-index
- transitions
- CSS variables
- MUI theme
- global reset/base styles
- Sass mixins/functions only when still justified

Migration rule:

- audit first
- delete dead styles
- delete magic numbers
- delete legacy mixins
- delete duplicated utilities
- migrate only real tokens, real mixins, reset/base styles, and formulas that prove useful

## MUI Strategy

Use MUI as infrastructure:

- `ThemeProvider`
- breakpoint engine
- `sx` engine where useful
- accessibility helpers
- Modal/Portal/Popover/Menu infrastructure when it saves real work

Do not build the DS around MUI widgets:

- no exported DS `<MuiButton />`
- no exported DS `<MuiCard />`
- no exported DS `<MuiDrawer />`

Export our own UI:

- `<Button />`
- `<Card />`
- `<Input />`
- `<Modal />`
- `<Tabs />`

Implementation can use emotion/styled/scss modules, but public API stays ours.

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

Do not do this by default:

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

CSS owns layout.
JS owns behavior.
Separate render trees only when behavior genuinely differs.

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

Required before trusting visual parity:

- Chromatic, or
- Playwright screenshots, or
- Loki

No more manual-only “looks close”. Every responsive component needs screenshot states for compact, medium, and wide.

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

Build:

- `Header`
- `Footer`
- `Navigation`
- `Sidebar` or menu pattern if needed

Focus on responsive behavior and sticky/collapsed states.

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
- Storybook build passes.

## Immediate Next Work

1. Add visual regression runner for compact/regular/expanded states.
2. Split the generated icon catalog into smaller domain icon modules before it becomes a bundle problem.
3. Refine ProductCard against live/core references with screenshots at 320, 668, and 991 widths.
4. Build Header/Footer in src/shared/ui/widgets using the new primitives.
5. Create a first page composition under src/pages after widgets exist.

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
- use visual contracts
- use layout primitives
- expose responsive variants through adaptive props
- keep tokens and breakpoints centralized
