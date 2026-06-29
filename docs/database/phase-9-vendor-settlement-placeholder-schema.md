# Phase 9 Vendor Settlement Placeholder Schema

## Collection

`vendor_settlements`

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `vendorId` | ObjectId | yes | Vendor |
| `storeId` | ObjectId | yes | Store |
| `cityId` | ObjectId | no | City scope |
| `settlementCode` | string | yes | Unique code |
| `periodStartAt` | Date | yes | Settlement period start |
| `periodEndAt` | Date | yes | Settlement period end |
| `grossOrderAmount` | number | yes | Gross order value |
| `commissionAmount` | number | yes | Commission deduction |
| `platformFeeAmount` | number | no | Platform fees |
| `deliveryFeeCollected` | number | no | Delivery fees collected |
| `refundDeductionAmount` | number | no | Refunds deducted |
| `adjustmentAmount` | number | no | Manual adjustments |
| `netPayableAmount` | number | yes | Net to vendor |
| `currency` | string | yes | `INR` |
| `orderIds` | ObjectId[] | no | Included orders |
| `refundIds` | ObjectId[] | no | Related refunds |
| `status` | enum | yes | See allowed values |
| `generatedBy` | ObjectId | no | Admin actor |
| `approvedBy` | ObjectId | no | Admin approver |
| `paidBy` | ObjectId | no | Placeholder payer |
| `generatedAt` | Date | no | Generation time |
| `approvedAt` | Date | no | Approval time |
| `paidAt` | Date | no | Placeholder paid time |
| `notes` | string | no | Admin notes |
| `createdAt` | Date | yes | Base timestamp |
| `updatedAt` | Date | yes | Base timestamp |

## Allowed status Values

- `draft`
- `generated`
- `under_review`
- `approved`
- `paid_placeholder`
- `on_hold`
- `cancelled`

## Placeholder Rule

Phase 9 creates settlement **calculation and visibility only**. Actual bank
payout execution remains disabled unless a future payout provider is integrated.
`VENDOR_PAYOUTS_ENABLED=false` by default (see env config doc).

## Planned API Endpoints

Status: **PLANNED**

| Method | Path |
|--------|------|
| GET | `/api/v1/admin/finance/vendor-settlements` |
| GET | `/api/v1/admin/finance/vendor-settlements/:settlementId` |
| POST | `/api/v1/admin/finance/vendor-settlements/generate` |
| POST | `/api/v1/admin/finance/vendor-settlements/:settlementId/approve` |
| POST | `/api/v1/admin/finance/vendor-settlements/:settlementId/mark-paid-placeholder` |

## Indexes

See `docs/database/phase-9-finance-index-plan.md`.
