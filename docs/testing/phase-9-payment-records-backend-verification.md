# Phase 9 Payment Records Backend Verification

## Commands

```bash
npm run typecheck -w backend/api
npm run lint -w backend/api
npm run test -w backend/api -- payment
npm run test -w backend/api -- seed-role-permission-matrix
npm run test:customer-orders -w backend/api
```

## OpenAPI Verification

```bash
npm run build -w backend/api && node --test dist/modules/payment/routes/payment-records.openapi.test.js
```

Expected paths in OpenAPI document:

- `/customer/payments/{paymentId}`
- `/customer/payments/{paymentId}/verify`
- `/admin/finance/payments`
- `/admin/finance/payments/{paymentId}`
- `/public/webhooks/payments/razorpay`

## Route Registry Verification

```bash
grep -q "admin/finance/payments" docs/contracts/backend-route-registry.md && \
grep -q "IMPLEMENTED" docs/contracts/backend-route-registry.md && echo PASS
```

## Seed Helper

```bash
npm run typecheck -w backend/api
# seedPaymentTestData skips production; integration tests use checkout + payment flows
```
