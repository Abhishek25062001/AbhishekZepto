# Phase 9 Finance Index Plan

MongoDB indexes for Phase 9 finance collections. No migration scripts in Module 1.

## payment_records

| Index | Type | Purpose |
|-------|------|---------|
| `{ orderId: 1 }` | standard | Order lookup |
| `{ customerId: 1 }` | standard | Customer history |
| `{ storeId: 1 }` | standard | Store scope |
| `{ vendorId: 1 }` | standard | Vendor scope |
| `{ cityId: 1 }` | standard | City scope |
| `{ gatewayOrderId: 1 }` | unique sparse | Gateway dedupe |
| `{ gatewayPaymentId: 1 }` | unique sparse | Gateway dedupe |
| `{ paymentStatus: 1 }` | standard | Status filters |
| `{ createdAt: -1 }` | standard | Recent lists |

Partial unique index consideration: one active payment per `orderId` where
status in active set — implement in Module 2+ with documented partial filter.

## refund_records

| Index | Type | Purpose |
|-------|------|---------|
| `{ orderId: 1 }` | standard | Order refunds |
| `{ paymentRecordId: 1 }` | standard | Payment linkage |
| `{ customerId: 1 }` | standard | Customer history |
| `{ refundCode: 1 }` | unique | Human-readable id |
| `{ refundStatus: 1 }` | standard | Status filters |
| `{ gatewayRefundId: 1 }` | sparse | Gateway lookup |
| `{ createdAt: -1 }` | standard | Recent lists |

## vendor_settlements

| Index | Type | Purpose |
|-------|------|---------|
| `{ vendorId: 1 }` | standard | Vendor lists |
| `{ storeId: 1 }` | standard | Store lists |
| `{ cityId: 1 }` | standard | City scope |
| `{ settlementCode: 1 }` | unique | Code lookup |
| `{ periodStartAt: 1 }` | standard | Period queries |
| `{ periodEndAt: 1 }` | standard | Period queries |
| `{ status: 1 }` | standard | Status filters |

## delivery_earnings

| Index | Type | Purpose |
|-------|------|---------|
| `{ deliveryAgentId: 1 }` | standard | Agent history |
| `{ orderId: 1 }` | standard | Order lookup |
| `{ assignmentId: 1 }` | standard | Assignment lookup |
| `{ cityId: 1 }` | standard | City scope |
| `{ earningStatus: 1 }` | standard | Status filters |
| `{ payoutStatus: 1 }` | standard | Payout filters |
| `{ createdAt: -1 }` | standard | Recent lists |

## Related Schema Docs

- `docs/database/phase-9-payment-record-schema.md`
- `docs/database/phase-9-refund-record-schema.md`
- `docs/database/phase-9-vendor-settlement-placeholder-schema.md`
- `docs/database/phase-9-delivery-earning-placeholder-schema.md`
