# Phase 9 Payment Record Schema

## Collection

Target collection name: `payment_records`

## Phase 4 Alignment

Existing collection: `payments` (`docs/database/payment-schema.md`, IMPLEMENTED).

Module 2+ must document whether to rename/migrate `payments` → `payment_records`
or treat `payment_records` as the canonical name for new finance fields. Module 1
documents the target Phase 9 shape below.

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `orderId` | ObjectId | yes | Linked order |
| `customerId` | ObjectId | yes | Payer |
| `storeId` | ObjectId | yes | Fulfillment store |
| `vendorId` | ObjectId | no | Vendor scope |
| `cityId` | ObjectId | no | City scope |
| `gateway` | enum | yes | See allowed values |
| `gatewayOrderId` | string | yes | Unique when present |
| `gatewayPaymentId` | string | no | Set after customer pays |
| `gatewaySignature` | string | no | Verify payload |
| `gatewayStatus` | string | no | Raw gateway status |
| `paymentMethod` | enum | no | See allowed values |
| `amount` | number | yes | Smallest currency unit (paise) |
| `currency` | string | yes | `INR` |
| `payableAmount` | number | yes | Order payable snapshot |
| `discountAmount` | number | no | Default `0` |
| `deliveryFee` | number | no | Delivery fee portion |
| `platformFee` | number | no | Platform fee portion |
| `taxAmount` | number | no | Tax portion |
| `refundedAmount` | number | no | Default `0` |
| `paymentStatus` | enum | yes | See allowed values |
| `failureCode` | string | no | Internal/gateway code |
| `failureReason` | string | no | Safe client message source |
| `webhookEventIds` | string[] | no | Dedupe webhook events |
| `metadata` | object | no | Opaque refs only |
| `paidAt` | Date | no | Success timestamp |
| `failedAt` | Date | no | Failure timestamp |
| `cancelledAt` | Date | no | Cancel timestamp |
| `createdBy` | ObjectId | no | Actor if applicable |
| `updatedBy` | ObjectId | no | Actor if applicable |
| `createdAt` | Date | yes | Base timestamp |
| `updatedAt` | Date | yes | Base timestamp |

Phase 4 `payments` also includes `checkoutSessionId`, `idempotencyKey`,
`signatureVerified`, `webhookReceivedAt` — retain in migration notes for Module 2.

## Allowed Values

### gateway

- `razorpay`
- `cashfree_placeholder`
- `stripe_placeholder`
- `manual_placeholder`

### paymentStatus

- `created`
- `pending`
- `authorized`
- `paid`
- `failed`
- `cancelled`
- `refunded`
- `partially_refunded`
- `expired`

### paymentMethod

- `upi`
- `card`
- `netbanking`
- `wallet`
- `cod_placeholder`
- `unknown`

## Business Rules

- `gatewayOrderId` unique sparse index when present
- `gatewayPaymentId` unique sparse index when present
- Only one **active** payment record per `orderId` for current checkout attempt
- All monetary amounts in smallest currency unit (paise for INR)

## Planned API Endpoints

Status: **PLANNED** (Phase 4 baseline IMPLEMENTED where noted)

| Method | Path | Status |
|--------|------|--------|
| POST | `/api/v1/customer/payments/create-order` | IMPLEMENTED (Phase 4) |
| GET | `/api/v1/customer/payments/:paymentId` | PLANNED |
| GET | `/api/v1/admin/finance/payments` | PLANNED |
| GET | `/api/v1/admin/finance/payments/:paymentId` | PLANNED |
| POST | `/api/v1/public/webhooks/payments/razorpay` | PLANNED (baseline: `/api/v1/webhooks/razorpay`) |

## Indexes

See `docs/database/phase-9-finance-index-plan.md`.
