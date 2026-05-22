# Customer App Order Confirmation

## Module

Phase 4 Module 11 — Customer App Order Confirmation.

## Goal

Show order confirmation, detail, and history screens after successful payment. Consume Module 10 order read APIs only.

## Prerequisites

- Module 9: `useCheckoutPayment`, verify flow on `CheckoutScreen`.
- Module 10: `GET /customer/orders`, `GET /customer/orders/:orderId`; verify returns non-null `orderId` on success.

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| OrderSuccess | `OrderSuccess` | Post-payment confirmation |
| OrderDetail | `OrderDetail` | Full order with items and address |
| OrderHistory | `OrderHistory` | Paginated past orders |

## Post-payment flow

```text
CheckoutScreen → Pay now → verify success (orderId set)
  → clear checkout session storage (client)
  → navigation.replace('OrderSuccess', { orderId })
  → useOrderDetail(orderId) → show orderNumber, total, status
  → View details → OrderDetail
  → Continue shopping → Home
```

If verify returns `paid` but `orderId` is null: show error on checkout (do not navigate to success).

## API consumption

| Screen | Endpoint |
|--------|----------|
| OrderSuccess, OrderDetail | `GET /api/v1/customer/orders/:orderId` |
| OrderHistory | `GET /api/v1/customer/orders?page&limit` |

No client `POST /orders` in Phase 4 app (placement is server-side on verify).

## Order status (Phase 4)

Display `placed` as **Order placed** only. No picking/delivery timeline (Phase 5).

## History

- Default `page=1`, `limit=20`.
- Tap row → `OrderDetail` with `orderId`.
- Profile **My orders** → `OrderHistory`.

## Error UX

| Code | UX |
|------|-----|
| `ORDER_NOT_FOUND` | Not found + back |
| Network / unknown | Retry via refetch |
| Verify without `orderId` | Error on checkout |

## Module layout

`apps/customer-app/src/modules/orders/` — api, hooks, screens, components, types, utils.

## Module boundaries

| In scope | Out of scope |
|----------|----------------|
| Success, detail, history UI | Backend order APIs (Module 10) |
| Navigation from verify | POST `/orders` retry UI |
| Profile → history link | Phase 5 status pipeline |
| Read-only order display | Cancel / refund / reorder |

## QA

- Customer `9999999999`, OTP `123456`
- Checkout → pay → lands on `OrderSuccess`
- Profile → My orders → list contains order

## Contract

`docs/contracts/customer-app-order-ui-contract.md`
