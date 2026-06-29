# Phase 9 Refund Record Schema

## Collection

`refund_records`

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `orderId` | ObjectId | yes | Source order |
| `paymentRecordId` | ObjectId | yes | Source payment |
| `customerId` | ObjectId | yes | Requester |
| `storeId` | ObjectId | yes | Store scope |
| `vendorId` | ObjectId | no | Vendor scope |
| `cityId` | ObjectId | no | City scope |
| `refundCode` | string | yes | Unique human-readable code |
| `refundReason` | string | yes | Customer/admin reason |
| `refundType` | enum | yes | See allowed values |
| `refundSource` | enum | yes | See allowed values |
| `requestedAmount` | number | yes | Smallest currency unit |
| `approvedAmount` | number | no | Set on approval |
| `refundedAmount` | number | no | Actual refunded total |
| `currency` | string | yes | `INR` |
| `refundStatus` | enum | yes | See allowed values |
| `gateway` | enum | no | Same family as payment |
| `gatewayRefundId` | string | no | Gateway refund id |
| `gatewayPaymentId` | string | no | Correlation |
| `gatewayStatus` | string | no | Raw gateway status |
| `failureCode` | string | no | Processing failure |
| `failureReason` | string | no | Safe message source |
| `requestedBy` | ObjectId | no | Customer or admin |
| `reviewedBy` | ObjectId | no | Admin reviewer |
| `approvedBy` | ObjectId | no | Admin approver |
| `rejectedBy` | ObjectId | no | Admin rejector |
| `processedBy` | ObjectId | no | Admin processor |
| `requestedAt` | Date | yes | Request time |
| `reviewedAt` | Date | no | Review time |
| `approvedAt` | Date | no | Approval time |
| `rejectedAt` | Date | no | Rejection time |
| `processedAt` | Date | no | Processing start |
| `completedAt` | Date | no | Completion time |
| `metadata` | object | no | Opaque refs |
| `createdAt` | Date | yes | Base timestamp |
| `updatedAt` | Date | yes | Base timestamp |

## Allowed Values

### refundType

- `full`
- `partial`
- `delivery_fee_only`
- `item_level_placeholder`
- `manual_adjustment`

### refundSource

- `customer_request`
- `admin_action`
- `order_cancellation`
- `payment_failure`
- `missing_item`
- `quality_issue`
- `delivery_failure`

### refundStatus

- `requested`
- `under_review`
- `approved`
- `rejected`
- `processing`
- `processed`
- `failed`
- `cancelled`

## Business Rules

- `refundCode` format: `REF-YYYYMMDD-000001`
- `refundCode` unique index
- `approvedAmount <= payment.amount - payment.refundedAmount`
- Block duplicate **active** refund for same order/payment where status not terminal

## Planned API Endpoints

Status: **PLANNED**

| Method | Path |
|--------|------|
| POST | `/api/v1/customer/refunds` |
| GET | `/api/v1/customer/refunds` |
| GET | `/api/v1/customer/refunds/:refundId` |
| GET | `/api/v1/admin/finance/refunds` |
| GET | `/api/v1/admin/finance/refunds/:refundId` |
| POST | `/api/v1/admin/finance/refunds/:refundId/approve` |
| POST | `/api/v1/admin/finance/refunds/:refundId/reject` |
| POST | `/api/v1/admin/finance/refunds/:refundId/process` |

## Indexes

See `docs/database/phase-9-finance-index-plan.md`.
