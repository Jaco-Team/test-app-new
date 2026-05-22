# Preview store migration map

Legacy `components/store.js` remains the runtime for **Pages Router** (`/samara`, etc.).

The **App Router preview** (`/preview/*`) uses typed Zustand slices under `src/entities/**` plus runtime wiring in `src/app/preview-runtime/**`.

## Store mapping

| Legacy export       | Preview replacement    | Status                                    |
| ------------------- | ---------------------- | ----------------------------------------- |
| `useCitiesStore`    | `src/entities/city`    | Done                                      |
| `useHomeStore`      | `src/entities/home`    | Core home path (banners, items cat, tags) |
| `useCartStore`      | `src/entities/cart`    | Hydration + totals; checkout/maps TBD     |
| `useHeaderStoreNew` | `src/entities/header`  | Shell + session; full auth forms TBD      |
| `useProfileStore`   | `src/entities/profile` | User + promo/order counts                 |
| `useFooterStore`    | `src/entities/footer`  | Footer links                              |
| `useContactStore`   | —                      | Port when preview contacts route ships    |
| `useAkciiStore`     | —                      | Port when preview promos route ships      |

## Cross-cutting

| Concern                | Legacy                                 | Preview                                                  |
| ---------------------- | -------------------------------------- | -------------------------------------------------------- |
| API signing            | `components/api.js`                    | `src/shared/api` (re-export)                             |
| Metrika                | `utils/metrika.js` + `_app.js` scripts | `src/shared/lib/analytics/metrika.ts` + `PreviewScripts` |
| Sentry user/tags       | `store.js` `syncSentryUser`            | `src/shared/lib/monitoring/sentryAccount.ts`             |
| Sentry global handlers | `pages/_app.js`                        | `PreviewClientRuntime`                                   |
| Yandex Maps            | `_app.js` script + `store.js`          | `PreviewScripts` + `src/shared/lib/maps/yandexMaps.ts`   |
| Commerce YM goals      | `useYandexMetrika.jsx`                 | `src/shared/lib/analytics/trackCommerceEvent.ts`         |

## Bootstrap

Legacy: `pages/[city]/index.jsx` `useEffect` chain.

Preview: `src/features/preview-bootstrap/PreviewBootstrap.tsx` (same order: city → catalog/home → cart → header session → banners/items cat → metrika hit).

## Remaining ports (large)

- Header auth flows (`logIn`, SMS, registration) from `useHeaderStoreNew`
- Cart checkout, zones, ymaps polygons (`useCartStore` ~2500 lines)
- Profile addresses/maps modals (`useProfileStore`)
- Home filters DOM coupling (`applyCurrentFilters`, etc.)

Do not import `@/components/store` from preview code — extend `src/entities` instead.
