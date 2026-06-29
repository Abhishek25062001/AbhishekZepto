# Phase 9 Payment Records Migration Strategy

Status: **DECIDED** (Module 2)

## Collection Strategy

**Option B — extend in place:** keep MongoDB collection name `payments`; treat `payment_records` as canonical Phase 9 schema name in docs/contracts.

## Module Path Strategy

**Extend `backend/api/src/modules/payment/`** — no parallel `modules/finance/payments/` tree.

## Route Compatibility

| Route | Status |
|-------|--------|
| `POST /api/v1/customer/payments/create-order` | kept |
| `POST /api/v1/customer/payments/verify` | kept (legacy) |
| `POST /api/v1/customer/payments/:paymentId/verify` | added |
| `GET /api/v1/customer/payments/:paymentId` | added |
| `GET /api/v1/admin/finance/payments` | added |
| `GET /api/v1/admin/finance/payments/:paymentId` | added |
| `POST /api/v1/webhooks/razorpay` | kept (legacy) |
| `POST /api/v1/public/webhooks/payments/razorpay` | added |

## Phase 9 Field Additions on `payments`

`storeId`, `vendorId`, `cityId`, `payableAmount`, `gatewayStatus`, `paymentMethod`, `refundedAmount`, `webhookEventIds`, `paidAt`, `failedAt`

## Order Finance Fields

Added on `orders`: `paymentRecordId`, `paymentMethod`, `paymentGateway`, `platformFee`, `payableAmount`, `financeStatus`, `paidAt`, `paymentFailedAt`, `refundCompletedAt`
