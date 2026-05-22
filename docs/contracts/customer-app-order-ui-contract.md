# Customer App Order UI Contract

Status: **IMPLEMENTED** — Module 11 (2026-05-19).

Architecture: `docs/architecture/customer-app-order-confirmation.md`  
Verification: `docs/testing/customer-app-order-confirmation-verification.md`

## Screens

| Screen | Route | Params | Purpose |
|--------|-------|--------|---------|
| OrderSuccess | `OrderSuccess` | `{ orderId: string }` | Post-payment confirmation |
| OrderDetail | `OrderDetail` | `{ orderId: string }` | Full order read-only |
| OrderHistory | `OrderHistory` | — | Paginated order list |

## API Client (`modules/orders/api/customer-order.api.ts`)

| Function | HTTP |
|----------|------|
| `getCustomerOrders` | GET `/api/v1/customer/orders` (query `page`, `limit`, optional `status`) |
| `getCustomerOrderById` | GET `/api/v1/customer/orders/:orderId` |

## Hooks

| Hook | Purpose |
|------|---------|
| `useOrderDetail` | Query single order by `orderId` |
| `useOrderHistory` | Query paginated list (`page`, `limit`) |

Query keys: `order-query-keys.util`

## Components

| Component | Purpose |
|-----------|---------|
| `OrderLineItem` | Single line row |
| `OrderTotalsBreakdown` | Subtotal, tax, delivery, grand total |
| `OrderAddressSnapshot` | Delivery address block |
| `OrderHistoryListItem` | History list row |
| `OrderErrorState` | Error + retry |
| `OrderEmptyState` | No orders |

## Navigation

```text
Checkout (verify success + orderId) → replace OrderSuccess
OrderSuccess → OrderDetail | Home
OrderHistory → OrderDetail (tap row)
Profile → OrderHistory (My orders)
```

## Payment integration

On `POST /payments/verify` success with `orderId`: `navigation.replace('OrderSuccess', { orderId })`.  
If `paid` without `orderId`: error on checkout (no success navigation).

## Error UX

| Code | User message / action |
|------|------------------------|
| `ORDER_NOT_FOUND` | Order not found |
| `ORDER_NOT_OWNED` | You do not have access to this order |
| Network | Retry via refetch |

## Status display

Phase 4: `placed` → “Order placed” only.

## Related

- `docs/contracts/order-customer-api.md`
- `docs/contracts/customer-app-payment-ui-contract.md`
