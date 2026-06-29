# Phase 9 Order Financial Summary Schema

## Collection Update Target

`orders` — extend existing order records with finance summary fields.

## Existing Repo Fields (already present)

From `backend/api/src/modules/orders/types/order.types.ts`:

| Field | Present | Notes |
|-------|---------|-------|
| `subtotal` | yes | Item subtotal |
| `taxAmount` | yes | Tax |
| `deliveryFeeAmount` | yes | Maps to PDF `deliveryFee` |
| `discountAmount` | yes | Default `0` until promotions |
| `grandTotal` | yes | Order total |
| `paymentStatus` | yes | Phase 4/5 enum |
| `paymentId` | yes | Links to `payments` |
| `refundReviewRequired` | yes | Cancellation flag |

## Planned Additional / Verified Finance Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `paymentRecordId` | ObjectId | no | Canonical finance link (may alias `paymentId`) |
| `paymentMethod` | enum | no | From payment record |
| `paymentGateway` | enum | no | e.g. `razorpay` |
| `itemSubtotal` | number | no | Alias/doc name for `subtotal` |
| `platformFee` | number | no | Platform fee portion |
| `payableAmount` | number | no | Final payable (may equal `grandTotal`) |
| `refundStatus` | enum | no | See allowed values |
| `refundedAmount` | number | no | Default `0` |
| `financeStatus` | enum | no | Aggregate finance lifecycle |
| `paidAt` | Date | no | Payment success |
| `paymentFailedAt` | Date | no | Payment failure |
| `refundCompletedAt` | Date | no | Refund closure |

## Allowed Values

### orders.paymentStatus

- `not_required`
- `pending`
- `paid`
- `failed`
- `refunded`
- `partially_refunded`

### orders.refundStatus

- `not_requested`
- `requested`
- `approved`
- `processing`
- `processed`
- `failed`
- `rejected`

### orders.financeStatus

- `unpaid`
- `paid`
- `refund_due`
- `refund_processing`
- `refund_closed`
- `settlement_pending`
- `settlement_ready`
- `closed`

## Order Finance Update Rule

1. Payment webhook/verify updates `payment_records` first
2. Order finance summary updated by payment/refund/internal finance services
3. No direct public **order finance mutation** endpoint in schema planning

## Planned API Endpoints

None dedicated. Finance fields mutate via:

- Payment create/verify/webhook flows
- Refund request/approve/process flows
- Internal finance services

## Related Documents

- `docs/database/phase-9-payment-record-schema.md`
- `docs/database/phase-9-refund-record-schema.md`
- `docs/database/order-schema.md` (Phase 4)
