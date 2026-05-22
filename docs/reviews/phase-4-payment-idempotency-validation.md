# Phase 4 Payment Idempotency Validation

**Date:** 2026-05-19

## Scenarios

| Scenario | Evidence | Status |
|----------|----------|--------|
| Duplicate verify when already paid | `payment.service.test.ts` — `verifyPaymentForCustomer is idempotent` | **PASS** |
| Unique `gatewayOrderId` | `payment.model.ts` index | **PASS** |
| Unique sparse `idempotencyKey` | `payment.model.ts` index | **PASS** |
| Webhook signature | `razorpay-webhook-signature.middleware` + route tests | **PASS** |
| Razorpay signature util | `razorpay-signature.util.test.js` | **PASS** |

## Tests

`npm run test:customer-payment -w backend/api` — 16 tests **PASS**

## Live

Razorpay sandbox keys required for device payment — **PENDING** operator

## Overall: **PASS** (automated)
