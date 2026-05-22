# Customer App Order Status Visibility Verification

## Scope

Phase 5 Module 12 verifies Customer App order status visibility after backend
order lifecycle and cancellation modules are available.

## Automated Commands

```bash
npm run typecheck -w backend/api
npm run lint -w backend/api
npm run test:customer-orders -w backend/api
npm run typecheck -w apps/customer-app
npm run test:customer-orders -w apps/customer-app
```

## OpenAPI Paths

Verify these paths exist in compiled OpenAPI JSON:

- `/customer/orders`
- `/customer/orders/{orderId}`
- `/customer/orders/{orderId}/state`
- `/customer/orders/{orderId}/lifecycle`
- `/customer/orders/{orderId}/cancel`

## Manual Smoke Checklist

1. Open Customer App order history.
2. Confirm order rows show current lifecycle status labels.
3. Open order detail.
4. Confirm status summary, address, items, totals, and timeline render.
5. For a `placed` order, confirm customer cancellation is visible.
6. Submit cancellation with an empty reason and confirm validation appears.
7. Submit cancellation with a valid reason.
8. Confirm detail and history refresh to `cancelled`.
9. Confirm cancelled detail shows timestamp, reason, and refund-review
   placeholder when returned by backend.

## Customer-Safe Visibility

Timeline display must not show internal actor ids, inventory adjustment internals,
admin-only metadata, or store-only operational notes.

