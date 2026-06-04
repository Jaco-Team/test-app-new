# Адаптивная вёрстка: пиксели → формулы → media wrappers

Руководство для агентов и разработчиков при выравнивании нового DS (`src/shared/ui`) и preview (`/preview/*`) с legacy (`/samara`) и production (https://jacofood.ru/samara).

## Контекст проекта

| Слой               | Путь                                           | Роль                                                |
| ------------------ | ---------------------------------------------- | --------------------------------------------------- |
| Legacy core        | `pages/`, `modules/`, `components/`, `styles/` | Production runtime, **не трогать** без явной задачи |
| New core + DS      | `src/`, `app/preview/`                         | Активная разработка, preview App Router             |
| Архив              | `stories/`                                     | Неудачная Storybook-first попытка, только reference |
| DS source of truth | `src/shared/ui/**` + colocated `*.stories.tsx` | Компоненты, токены, формулы                         |

Цель: **100% визуальное и UX-совпадение** с legacy/production. Tablet — отдельный дизайн-таргет, не растянутый mobile.

## Семантические диапазоны

| Режим              | Ключ       | Ширина viewport | Проверочная ширина     |
| ------------------ | ---------- | --------------- | ---------------------- |
| Mobile (compact)   | `compact`  | 320–667 px      | **320**, mid **500**   |
| Tablet (regular)   | `regular`  | 668–990 px      | **668**, mid **800**   |
| Desktop (expanded) | `expanded` | ≥ 991 px        | **991**, wide **1200** |

MUI breakpoints (`src/shared/ui/foundation/breakpoints.ts`): `sm=668`, `md=991`.

SCSS mixins (`_formulas.scss`): `@include ui-compact`, `ui-regular`, `ui-expanded`.

## Почему сначала пиксели, потом vw

Размеры в SCSS задаются **fluid-формулами** — число в аргументе ≠ пиксели на экране:

```scss
ui-fluid-compact($size)   // $size / 870 * 100vw  — диапазон compact
ui-fluid-regular($size)   // $size / 668 * 100vw  — диапазон regular
ui-fluid-expanded($size)  // $size / 1385 * 100vw — диапазон expanded
```

На reference-ширине формула даёт измеренное значение:

| Режим    | Reference width       | Denominator | Пример: `ui-fluid-compact(24)`            |
| -------- | --------------------- | ----------- | ----------------------------------------- |
| compact  | 320 px (min) … 667 px | **870**     | на 320 px → ~8.8 px; на 667 px → ~18.3 px |
| regular  | 668 px … 990 px       | **668**     | на 668 px → 24 px                         |
| expanded | 991 px+               | **1385**    | на 1385 px → 24 px                        |

**Правило для агентов:** Chrome MCP / Playwright / DevTools измеряют **computed px** на фиксированной ширине viewport. Только после измерения переводим в аргумент формулы или в `@include ui-fluid(...)`.

### Перевод px → аргумент формулы

```
formulaArg = measuredPx * denominator / viewportWidth
```

Пример: на viewport **668 px** измерили `font-size: 16px` в regular-диапазоне:

```
16 * 668 / 668 = 16  →  ui-fluid-regular(16)
```

На viewport **320 px** в compact измерили `padding-left: 12px`:

```
12 * 870 / 320 ≈ 32.6  →  ui-fluid-compact(33)  (округлить и проверить)
```

Для типографики часто используют `max(Npx, ui-fluid-*(N))` — нижняя граница в px, рост через формулу.

## Workflow сверки (markup parity)

1. **Запустить dev:** `npm run dev` (legacy + preview на :3000).
2. **Зафиксировать viewport** в пикселях: 320, 668, 991 (при спорных местах — 500, 800, 1200).
3. **Reference capture:**
   - Legacy: `http://localhost:3000/samara`
   - Preview: `http://localhost:3000/preview/samara`
   - Production: `https://jacofood.ru/samara`
4. **Инструменты:**
   - **Cursor IDE Browser MCP** (`cursor-ide-browser`) — smoke, интеракции, скриншоты localhost
   - **Playwright** — `npm run test:ui-visual` (Storybook), `playwright.preview.config.ts` (preview vs legacy)
5. **Измерить** отступы, размеры шрифтов, gap, border-radius в computed styles (px).
6. **Записать** аргументы формул / локальные SCSS-переменные компонента.
7. **Проверить** на min/mid/max ширине диапазона — tablet не должен выглядеть как mobile.
8. **Не менять** `pages/`, `modules/`, `components/`, `styles/` при DS-работе.

## Где править код

| Задача                       | Куда                                                      |
| ---------------------------- | --------------------------------------------------------- |
| Токены, формулы, breakpoints | `src/shared/ui/foundation/`                               |
| Компонент DS                 | `src/shared/ui/{primitives,components,patterns,widgets}/` |
| Страница preview             | `src/pages/`, `app/preview/`                              |
| Storybook spec               | colocated `*.stories.tsx`                                 |
| Legacy reference only        | `stories/`, `styles/` — читать, не писать                 |

## Media wrappers и адаптивные props

- CSS layout: `@include ui-compact { ... }` и siblings.
- JS behavior (modal sheet vs dialog): `getViewportMode(width)` / MUI `useMediaQuery`.
- Предпочитать adaptive props (`density`, `orientation`) вместо `if (mobile) return <MobileX />`.
- Исключения (например Header) документировать локально в компоненте, не в global foundation.

## Visual testing

| Команда                                               | Назначение                                 |
| ----------------------------------------------------- | ------------------------------------------ |
| `npm run test:ui-visual`                              | Storybook snapshots @ 320 / 668 / 991      |
| `npx playwright test -c playwright.preview.config.ts` | Preview vs legacy parity (opt-in)          |
| Storybook                                             | `http://localhost:6007` — executable specs |

По умолчанию lint/typecheck/visual **не гонять**, если пользователь не просит — кроме явных layout-изменений Header или measured parity.

## Чеклист перед «готово»

- [ ] 320, 668, 991 px — preview совпадает с legacy/production по видимой вёрстке
- [ ] Tablet (668–990) проверен отдельно, не только 668 px
- [ ] Значения выведены из px-измерений, не скопированы вслепую из legacy SCSS
- [ ] Legacy core не затронут
- [ ] Новый код только в `src/` и `app/preview/`
