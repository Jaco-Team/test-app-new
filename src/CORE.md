# New core (`src/`)

TypeScript + FSD under `src/`, mounted at `/preview/{city}` via `app/preview/` until route cutover.

## Layers

- `entities/` — domain stores (city, catalog, cart, header, home, footer, profile, contact, akcii)
- `features/` — auth, header nav, bootstrap seeding
- `widgets/layout/` — `PreviewPageLayout` (bootstrap + shell + connected preview chrome), `PreviewPageFrame` (standard content-page frame under shared chrome)
- `widgets/header/` — `ConnectedHeader` (store-wired DS header for all preview routes)
- `widgets/shell/` — global modals (`AuthModal`, `CityModal`, `BasketPanel`, `MapLoader`)
- `pages/` — page compositions and view models
- `shared/` — API client, paths, analytics, maps helpers
- `app/runtime/` — client providers (Metrika, Sentry, ymaps scripts)

## Stores

Zustand slices in `entities/*/model/*Store.ts`, registered with `reuseAppStore` for dev HMR.

Bootstrap (`features/bootstrap/StoreBootstrap`) seeds stores from SSR payload on mount.

## Routes

| Path                   | Loader             | UI           |
| ---------------------- | ------------------ | ------------ |
| `/preview/[city]`      | `loadHomePageData` | `HomeClient` |
| `/preview/[city]/cart` | `loadCartPageData` | `CartClient` |

URL helpers: `src/shared/lib/sitePaths.ts` (`cityBase`, `cityPath`, `categoryHref`).

## API

Signed POST client: `src/shared/api/client.ts` (`api`, `apiAddress`).

## Local dev

- `npm run dev` — `http://localhost:3000/preview/samara`
- Legacy production core remains on `/samara` (Pages Router); not modified by this tree.
