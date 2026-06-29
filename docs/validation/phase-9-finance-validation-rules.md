# Phase 9 Finance Validation Rules

Central validation rules for Phase 9 finance endpoints. Implementation deferred
to owning modules (Zod validators in Module 2+).

## Payment Create — `POST /api/v1/customer/payments/create-order`

### Request fields

| Field | Rule |
|-------|------|
| `orderId` | required ObjectId string |

Optional: `paymentMethod` enum per payment schema.

### Business rules

- Order must exist
- `order.customerId` must match authenticated customer
- Order must not already be paid
- `payableAmount` / `grandTotal` must be > 0
- Order status must allow payment (not cancelled/terminal)

## Payment Verify — `POST /api/v1/customer/payments/:paymentId/verify`

### Request fields

| Field | Rule |
|-------|------|
| `gatewayOrderId` | required |
| `gatewayPaymentId` | required |
| `gatewaySignature` | required |

## Refund Request — `POST /api/v1/customer/refunds`

### Request fields

| Field | Rule |
|-------|------|
| `orderId` | required |
| `refundReason` | required non-empty string |
| `requestedAmount` | optional positive number |
| `refundType` | optional enum |

### Business rules

- Order must belong to customer
- Payment must be `paid`
- `requestedAmount` must be > 0 when provided
- Must not exceed refundable amount
- duplicate active refund must be blocked for same order/payment

## Admin Refund Approval — `POST /api/v1/admin/finance/refunds/:refundId/approve`

| Field | Rule |
|-------|------|
| `approvedAmount` | required number > 0 |
| `adminNote` | optional string |

## Settlement Generation — `POST /api/v1/admin/finance/vendor-settlements/generate`

| Field | Rule |
|-------|------|
| `periodStartAt` | required ISO date |
| `periodEndAt` | required ISO date, after start |
| `vendorId` | optional scope |
| `storeId` | optional scope |

## Delivery Earning Adjustment — `POST /api/v1/admin/finance/delivery-earnings/:earningId/adjust`

| Field | Rule |
|-------|------|
| `adjustmentAmount` | required number |
| `adjustmentReason` | required non-empty string |

## DB Field Constraints

| Field | Constraint |
|-------|------------|
| `orders.payableAmount` | > 0 for payment |
| `orders.paymentStatus` | transition rules per gateway architecture |
| `payment_records.amount` | matches order payable at create |
| `payment_records.refundedAmount` | <= amount |
| `refund_records.requestedAmount` | <= refundable balance |
| `refund_records.approvedAmount` | <= refundable balance |
| `vendor_settlements.periodStartAt` / `periodEndAt` | valid range |
| `delivery_earnings.adjustmentAmount` | numeric; reason required |

## Related Documents

- `docs/errors/phase-9-finance-error-codes.md`
- `docs/contracts/phase-9-finance-api-surface.md`
