# Customer App Checkout UI Contract

Status: **IMPLEMENTED** — Module 7 (2026-05-19); payment Module 9 (2026-05-19).

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Checkout | `Checkout` | Address, summary, reservation timer, pay CTA (Module 9) |

## API Client (`modules/checkout/api/customer-checkout.api.ts`)

| Function | HTTP |
|----------|------|
| `initiateCheckout` | POST `/api/v1/customer/checkout/initiate` |
| `getCheckoutSummary` | GET `/api/v1/customer/checkout/summary` |
| `cancelCheckout` | POST `/api/v1/customer/checkout/cancel` |

## Hooks

| Hook | Purpose |
|------|---------|
| `useInitiateCheckout` | POST initiate; store `checkoutSessionId` |
| `useCheckoutSummary` | GET summary for active session |
| `useCancelCheckout` | POST cancel; clear session |
| `useCheckoutReservationTimer` | Countdown from `reservationExpiresAt` |

Query key: `['customer-checkout', 'summary', sessionId?]`

## Components

| Component | Purpose |
|-----------|---------|
| `CheckoutAddressSelector` | Delivery address display + change |
| `CheckoutSummaryBreakdown` | Line items + tax/delivery/grand total |
| `CheckoutReservationBanner` | Reservation countdown |
| `CheckoutErrorState` | Error with recovery actions |

## Navigation

```text
Cart → Checkout (Proceed to checkout)
Checkout → Addresses (change address)
```

**Bottom bar:** Not shown on `Checkout` screen.

## Error UX

| Code | User message / action |
|------|------------------------|
| `CHECKOUT_CART_EMPTY` | Cart is empty — go to cart |
| `CHECKOUT_PRICE_CHANGED` | Prices changed — go to cart to refresh |
| `CHECKOUT_STOCK_UNAVAILABLE` | Stock issue — update cart |
| `CHECKOUT_SESSION_EXPIRED` | Reservation expired — start again |
| `CHECKOUT_SESSION_NOT_FOUND` | Session not found |
| `CHECKOUT_ADDRESS_UNSERVICEABLE` | Address not serviceable — change address |
| `CHECKOUT_STORE_CLOSED` | Store unavailable |
| `ADDRESS_NOT_FOUND` | Add or select address |

## UX rules

- Pay button wired per `docs/contracts/customer-app-payment-ui-contract.md` (Module 9).
- Initiate when address is selected and cart has items.
- Cancel checkout on confirmed back navigation.
- Hide tax/delivery rows when amount is `0`.

## Payment (Module 9)

See `docs/contracts/customer-app-payment-ui-contract.md` — create-order, Razorpay SDK, verify on Pay now.

## Permissions

Customer JWT only.
