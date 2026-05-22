# Customer App Checkout Flow

## Module

Phase 4 Module 7 — Customer App Checkout Flow.

## Goal

Wire customer-app UI to Module 6 checkout APIs: address confirmation, initiate checkout, reservation timer, order summary, and cancel on abandon.

## Flow

```text
Cart (has items) → Proceed to checkout
  → CheckoutScreen
  → confirm delivery address (selectedAddressId or pick from list)
  → POST /checkout/initiate
  → show CheckoutSummaryBreakdown + CheckoutReservationBanner
  → Pay now → Module 9 payment flow
```

## API consumption

| Action | Endpoint |
|--------|----------|
| Start checkout | `POST /api/v1/customer/checkout/initiate` |
| Refresh summary | `GET /api/v1/customer/checkout/summary` |
| Abandon checkout | `POST /api/v1/customer/checkout/cancel` |

## Address

- Default: `useLocationContext().selectedAddressId`
- Change: navigate to `Addresses` → `AddressList`
- Initiate requires valid `addressId`

## Reservation timer

- Source: `reservationExpiresAt` from initiate/summary response
- `useCheckoutReservationTimer` → `mm:ss` countdown
- On expiry: show expired UI; clear local session id; disable pay CTA

## Cancel policy

- **Explicit back** from checkout header → confirm dialog → `POST cancel` → `goBack`
- Do not auto-cancel on payment screen (Module 9)

## Error recovery

| Code | UX |
|------|-----|
| `CHECKOUT_PRICE_CHANGED` | Message + navigate to `Cart` for refresh |
| `CHECKOUT_SESSION_EXPIRED` | Expired state + start over |
| `CHECKOUT_STOCK_UNAVAILABLE` | Message + go to cart |
| `CHECKOUT_ADDRESS_UNSERVICEABLE` | Change address CTA |
| `CHECKOUT_STORE_CLOSED` | Back to home / cart |

## Navigation

```text
CartScreen → Checkout (Main stack)
Checkout → Addresses (change address)
```

`CartBottomBar` hidden on `Checkout` screen (not a catalog/home surface).

## Module layout

`apps/customer-app/src/modules/checkout/` — api, hooks, screens, components, types, utils.

## Payment (Module 9)

See `docs/architecture/customer-app-payment-flow.md` — Pay now enabled on this screen.

## Out of scope
- Post-pay navigation to `OrderSuccess` (Module 11)
- Backend changes

## QA

- Customer `9999999999`, OTP `123456`
- Store selected, cart with items, default address
- Module 6 API running

## Contract

`docs/contracts/customer-app-checkout-ui-contract.md`
