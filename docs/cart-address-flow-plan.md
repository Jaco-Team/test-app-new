# Cart Address Flow Plan

## Done now

- Desktop cart selects no longer use fake placeholder options.
- Desktop address selection is treated as an action field, with a separate `Добавить адрес` button.
- Cart hands address creation off to the existing profile address modal entrypoint.
- A reusable address-picker intent service is in place:
  - stores source + return path in `sessionStorage`
  - opens profile with `?openAddressModal=1`

## Next implementation stage

1. Finish the address picker as a preview-native feature instead of relying on the legacy profile modal.
2. Move the saved-address create/edit modal contract into `src/features/address-picker/**`.
3. On successful save, consume the stored intent and route back to `returnTo`.
4. Refresh checkout addresses after return and auto-select the newly created address.

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
