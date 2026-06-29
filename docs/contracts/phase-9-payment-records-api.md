# Phase 9 Payment Records API

Status: **IMPLEMENTED** (Module 2)

Contract envelope per `project-context/API_STANDARDS.md`.

## Customer Endpoints

| Method | Path | Status |
|--------|------|--------|
| POST | `/api/v1/customer/payments/create-order` | IMPLEMENTED (Phase 4 baseline) |
| POST | `/api/v1/customer/payments/verify` | IMPLEMENTED (legacy body path) |
| POST | `/api/v1/customer/payments/:paymentId/verify` | IMPLEMENTED |
| GET | `/api/v1/customer/payments/:paymentId` | IMPLEMENTED |

### Verify payment by id

- Auth: customer JWT
- Params: `paymentId`
- Body: `gatewayOrderId`, `gatewayPaymentId`, `gatewaySignature` (legacy Razorpay field names also accepted)
- Response: `{ paymentId, status: 'paid', orderId }`

### Get customer payment

- Auth: customer JWT
- Response excludes sensitive/internal fields (`metadata`, `idempotencyKey`, signatures)

## Admin Finance Endpoints

| Method | Path | Status |
|--------|------|--------|
| GET | `/api/v1/admin/finance/payments` | IMPLEMENTED |
| GET | `/api/v1/admin/finance/payments/:paymentId` | IMPLEMENTED |

- Permission: `finance:payments:read`
- List filters: `customerId`, `orderId`, `storeId`, `vendorId`, `cityId`, `paymentStatus`, `gateway`, `paymentMethod`, `dateFrom`, `dateTo`, `search`, pagination

## Webhook Endpoints

| Method | Path | Status |
|--------|------|--------|
| POST | `/api/v1/public/webhooks/payments/razorpay` | IMPLEMENTED |
| POST | `/api/v1/webhooks/razorpay` | IMPLEMENTED (legacy path) |

- No user JWT; `x-razorpay-signature` required
- Dedupe via `payment_records.webhookEventIds`

## DB Fields

- Payment records: `payments` collection extended with Phase 9 finance fields (`storeId`, `payableAmount`, `webhookEventIds`, `paidAt`, etc.)
- Order finance: `paymentRecordId`, `financeStatus`, `paidAt`, `paymentFailedAt`, `payableAmount`, `paymentGateway`

## Related Documents

- `docs/database/phase-9-payment-record-schema.md`
- `docs/errors/phase-9-finance-error-codes.md`
- `docs/security/phase-9-finance-permissions.md`
