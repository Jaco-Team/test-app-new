# Cart Address Flow Plan

## Done now

- Desktop cart selects no longer use fake placeholder options.
- Desktop address selection is treated as an action field, with a separate `Добавить адрес` button.
- Cart hands address creation off to the existing profile address modal entrypoint.
- A reusable address-picker intent service is in place:
  - stores source + return path in `sessionStorage`
  - opens profile with `?openAddressModal=1`
- Preview-native address picker foundation is now in `src/features/address-picker/**`:
  - global modal host in app shell
  - typed modal store
  - create/edit modal shell
  - Yandex suggest-backed street search
  - resolved-address selection
  - save/update requests through preview code
- Profile and compact `/address` now open the preview-native address picker instead of the legacy modal bridge.

## Next implementation stage

1. Replace the placeholder right-side desktop map panel with real Yandex map rendering.
2. Port delivery polygons and zone-state behavior from legacy store logic.
3. Sync map click / pin / search result / selected address into one draft source of truth.
4. On successful cart-issued save, return to `returnTo`, refresh checkout addresses, and auto-select the new address.
5. Add compact-specific address editor/search layout parity with legacy drawer flow.

## YM maps scope

Use legacy behavior as the source reference, not the implementation:

- `components/store.js`
  - polygon defaults and active states around `polygon_options_*`
  - delivery-zone setup around `getZone` / polygon creation
  - map-driven address selection and area checks around the `openModalAddr` flow
- `modules/profile/profile/modalAddr.jsx`
- `modules/profile/address/modalAddressMobile.js`

## Target architecture

- `src/features/address-picker/model`
  - intent service
  - address draft state
  - suggest + resolve state
  - polygon coverage check API
- `src/features/address-picker/ui`
  - address form modal
  - map canvas / map pin panel
  - address candidates list
- `src/shared/lib/maps`
  - thin YM bootstrap helpers only

## YM picker behavior to preserve

- preload polygons for the active city
- detect whether a picked point falls into a delivery area
- show area state clearly: available / unavailable / selected
- support suggest search plus manual point move
- keep address draft fields in sync with map result

## Decision for routing

Short term:

- `Добавить адрес` from cart opens profile and auto-opens the address modal

Planned:

- same intent service can later support:
  - return-to-cart
  - return-to-checkout-step
  - open-in-place modal when preview-native address picker lands
