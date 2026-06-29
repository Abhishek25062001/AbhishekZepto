# Phase 9 Finance API Surface

Status: **PLANNED** unless marked IMPLEMENTED (Phase 4 baseline).

Contract envelope per `project-context/API_STANDARDS.md`.

## Customer Payment Endpoints

| Method | Path | Status | Owning module |
|--------|------|--------|---------------|
| POST | `/api/v1/customer/payments/create-order` | IMPLEMENTED | Phase 4 Module 8 |
| POST | `/api/v1/customer/payments/:paymentId/verify` | IMPLEMENTED | Module 2 |
| GET | `/api/v1/customer/payments/:paymentId` | IMPLEMENTED | Module 2 |

### Create payment order (IMPLEMENTED baseline)

- Auth: customer JWT
- Body: checkout/order reference per Phase 4 `payment-api.md`
- Response: gateway order payload + payment record id

### Verify payment (PLANNED path)

- Auth: customer JWT
- Body: `gatewayOrderId`, `gatewayPaymentId`, `gatewaySignature`
- Response: updated payment + order payment status

## Customer Refund Endpoints

| Method | Path | Status |
|--------|------|--------|
| POST | `/api/v1/customer/refunds` | PLANNED |
| GET | `/api/v1/customer/refunds` | PLANNED |
| GET | `/api/v1/customer/refunds/:refundId` | PLANNED |

## Admin Finance — Payments

| Method | Path | Status |
|--------|------|--------|
| GET | `/api/v1/admin/finance/payments` | IMPLEMENTED | Module 2 |
| GET | `/api/v1/admin/finance/payments/:paymentId` | IMPLEMENTED | Module 2 |

## Admin Finance — Ledger

| Method | Path | Status |
|--------|------|--------|
| GET | `/api/v1/admin/finance/ledger/accounts` | IMPLEMENTED | Module 3 |
| POST | `/api/v1/admin/finance/ledger/accounts` | IMPLEMENTED | Module 3 |
| GET | `/api/v1/admin/finance/ledger/accounts/:accountId` | IMPLEMENTED | Module 3 |
| PATCH | `/api/v1/admin/finance/ledger/accounts/:accountId` | IMPLEMENTED | Module 3 |
| DELETE | `/api/v1/admin/finance/ledger/accounts/:accountId` | IMPLEMENTED | Module 3 |
| GET | `/api/v1/admin/finance/ledger/accounts/:accountId/lines` | IMPLEMENTED | Module 3 |
| GET | `/api/v1/admin/finance/ledger/journals` | IMPLEMENTED | Module 3 |
| GET | `/api/v1/admin/finance/ledger/journals/:journalId` | IMPLEMENTED | Module 3 |
| POST | `/api/v1/admin/finance/ledger/journals/:journalId/reverse` | IMPLEMENTED | Module 3 |

Contract: `docs/contracts/ledger-foundation-api.md`

## Admin Finance — Refunds

| Method | Path | Status |
|--------|------|--------|
| GET | `/api/v1/admin/finance/refunds` | PLANNED |
| GET | `/api/v1/admin/finance/refunds/:refundId` | PLANNED |
| POST | `/api/v1/admin/finance/refunds/:refundId/approve` | PLANNED |
| POST | `/api/v1/admin/finance/refunds/:refundId/reject` | PLANNED |
| POST | `/api/v1/admin/finance/refunds/:refundId/process` | PLANNED |

## Admin Finance — Vendor Settlements

| Method | Path | Status |
|--------|------|--------|
| GET | `/api/v1/admin/finance/vendor-settlements` | PLANNED |
| GET | `/api/v1/admin/finance/vendor-settlements/:settlementId` | PLANNED |
| POST | `/api/v1/admin/finance/vendor-settlements/generate` | PLANNED |
| POST | `/api/v1/admin/finance/vendor-settlements/:settlementId/approve` | PLANNED |
| POST | `/api/v1/admin/finance/vendor-settlements/:settlementId/mark-paid-placeholder` | PLANNED |

## Delivery Earnings

| Method | Path | Status |
|--------|------|--------|
| GET | `/api/v1/delivery/earnings` | PLANNED |
| GET | `/api/v1/delivery/earnings/:earningId` | PLANNED |
| GET | `/api/v1/admin/finance/delivery-earnings` | PLANNED |
| GET | `/api/v1/admin/finance/delivery-earnings/:earningId` | PLANNED |
| POST | `/api/v1/admin/finance/delivery-earnings/:earningId/approve` | PLANNED |
| POST | `/api/v1/admin/finance/delivery-earnings/:earningId/adjust` | PLANNED |

## Webhook Endpoints

| Method | Path | Status |
|--------|------|--------|
| POST | `/api/v1/public/webhooks/payments/razorpay` | IMPLEMENTED (baseline: `/api/v1/webhooks/razorpay` IMPLEMENTED) |

- No user JWT; Razorpay signature verification required

## DB Field References

| Domain | Schema doc |
|--------|------------|
| Payments | `phase-9-payment-record-schema.md` |
| Ledger | `ledger-foundation-schema.md` |
| Refunds | `phase-9-refund-record-schema.md` |
| Order finance | `phase-9-order-financial-summary-schema.md` |
| Settlements | `phase-9-vendor-settlement-placeholder-schema.md` |
| Earnings | `phase-9-delivery-earning-placeholder-schema.md` |

## Related Documents

- `docs/contracts/phase-9-finance-route-mounting-plan.md`
- `docs/security/phase-9-finance-permissions.md`
- `docs/validation/phase-9-finance-validation-rules.md`
- `docs/errors/phase-9-finance-error-codes.md`
