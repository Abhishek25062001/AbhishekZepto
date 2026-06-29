# Phase 9 Delivery Earning Placeholder Schema

## Collection

`delivery_earnings`

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `deliveryAgentId` | ObjectId | yes | Agent |
| `assignmentId` | ObjectId | yes | Delivery assignment |
| `orderId` | ObjectId | yes | Order |
| `cityId` | ObjectId | no | City scope |
| `storeId` | ObjectId | yes | Pickup store |
| `baseEarning` | number | yes | Base pay |
| `distanceInKm` | number | no | Distance |
| `distanceEarning` | number | no | Distance component |
| `incentiveAmount` | number | no | Incentives |
| `penaltyAmount` | number | no | Penalties |
| `adjustmentAmount` | number | no | Admin adjustments |
| `totalEarning` | number | yes | Net earning |
| `currency` | string | yes | `INR` |
| `earningStatus` | enum | yes | See allowed values |
| `payoutStatus` | enum | yes | See allowed values |
| `calculatedAt` | Date | no | Calculation time |
| `approvedAt` | Date | no | Approval time |
| `paidAt` | Date | no | Placeholder paid time |
| `createdAt` | Date | yes | Base timestamp |
| `updatedAt` | Date | yes | Base timestamp |

## Allowed Values

### earningStatus

- `calculated`
- `under_review`
- `approved`
- `rejected`
- `adjusted`

### payoutStatus

- `not_due`
- `pending_placeholder`
- `paid_placeholder`
- `on_hold`
- `cancelled`

## Earning Trigger Rule

Delivery earning record is created **only after** order delivery is completed
(`delivery_assignments.status` completed, `completedAt` set — Phase 6).

## Planned API Endpoints

Status: **PLANNED**

| Method | Path |
|--------|------|
| GET | `/api/v1/delivery/earnings` |
| GET | `/api/v1/delivery/earnings/:earningId` |
| GET | `/api/v1/admin/finance/delivery-earnings` |
| GET | `/api/v1/admin/finance/delivery-earnings/:earningId` |
| POST | `/api/v1/admin/finance/delivery-earnings/:earningId/approve` |
| POST | `/api/v1/admin/finance/delivery-earnings/:earningId/adjust` |

## Indexes

See `docs/database/phase-9-finance-index-plan.md`.
