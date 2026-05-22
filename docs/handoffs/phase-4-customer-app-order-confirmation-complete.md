# Phase 4 Module 11 — Customer App Order Confirmation — Complete

**Date:** 2026-05-19

## Summary

Module 11 adds order success, detail, and history screens. After payment verify returns `orderId`, the app navigates to `OrderSuccess` and consumes Module 10 read APIs.

## Customer app module

`apps/customer-app/src/modules/orders/`

| Area | Purpose |
|------|---------|
| `customer-order.api` | GET list + detail |
| `useOrderDetail` / `useOrderHistory` | React Query hooks |
| `OrderSuccessScreen` | Post-payment confirmation |
| `OrderDetailScreen` | Full order read-only |
| `OrderHistoryScreen` | Paginated history |

## Navigation

| Route | Entry |
|-------|-------|
| `OrderSuccess` | Checkout verify success (`replace`) |
| `OrderDetail` | Success screen or history row |
| `OrderHistory` | Profile → My orders |

## APIs consumed (Module 10)

| Method | Path |
|--------|------|
| GET | `/api/v1/customer/orders` |
| GET | `/api/v1/customer/orders/:orderId` |

## Tests

```bash
npm run typecheck -w apps/customer-app
npm run test:customer-orders -w apps/customer-app
```

## Known limitations

- `orderStatus=placed` only — no Phase 5 pipeline UI
- No client `POST /orders` retry UI
- Device smoke PENDING operator run

## Next

**Module 12 — Basic Customer Profile**
