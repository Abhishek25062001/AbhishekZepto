# Order Schema (Customer Placement — Phase 4)

## Collection

`orders`

Phase 4 covers **placement** only. Lifecycle fields for picking/packing/delivery
are extended in Phase 5.

## DB Fields (Phase 4)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `orderNumber` | string | yes | Human-readable unique id |
| `customerId` | ObjectId | yes | Buyer |
| `storeId` | ObjectId | yes | Fulfillment store |
| `checkoutSessionId` | ObjectId | yes | Source session |
| `paymentId` | ObjectId | yes | Verified payment |
| `cartId` | ObjectId | yes | Source cart (cleared after place) |
| `addressSnapshot` | object | yes | Immutable delivery address |
| `items` | array | yes | Order lines |
| `items[].productId` | ObjectId | yes | |
| `items[].variantId` | ObjectId | yes | |
| `items[].storeProductId` | ObjectId | yes | |
| `items[].quantity` | number | yes | |
| `items[].unitPrice` | number | yes | Snapshot |
| `items[].lineTotal` | number | yes | |
| `items[].productName` | string | no | Display |
| `subtotal` | number | yes | |
| `taxAmount` | number | no | |
| `deliveryFeeAmount` | number | no | |
| `discountAmount` | number | no | |
| `grandTotal` | number | yes | |
| `currency` | string | yes | `INR` |
| `paymentStatus` | enum | yes | `paid` at placement (Phase 4) |
| `orderStatus` | enum | yes | Phase 4 initial: `placed` |
| `inventoryConfirmed` | boolean | yes | Locks confirmed |
| `placedAt` | Date | yes | |
| `createdAt` | Date | yes | |
| `updatedAt` | Date | yes | |

## Deferred (Phase 5+)

| Field | Phase |
|-------|-------|
| `storeStatus`, `pickerStatus` | Phase 5 |
| `cancellationReason`, `cancelledAt` | Phase 5 |
| `timeline[]`, `slaFlags` | Phase 5 |
| `assignedPickerId`, `assignedRiderId` | Phase 5–6 |

## Phase 5 Planning Reference

Phase 5 extends the placement schema for order lifecycle and store operations.
The planning source of truth is:

- `docs/database/phase-5-order-lifecycle-schema.md`

Planned Phase 5 additions include current-state fields:

- `storeStatus`
- `pickerStatus`
- `packingStatus`

Planned Phase 5 history fields:

- `timeline[]`
- `lifecycle[]`

Planned Phase 5 operational metadata fields:

- `cancellationReason`
- `cancelledAt`
- `cancelledBy`
- `slaStatus`
- `slaBreachedStage`
- `assignedPickerId`
- `acceptedAt`
- `rejectedAt`
- `readyForPickupAt`

Delivery-specific fields such as `assignedRiderId` remain deferred to Phase 6.

## Business Rules

- Create order only after payment verify succeeds.
- Idempotent create: same `paymentId` or idempotency key returns existing order.
- Confirm inventory locks and decrement sold stock via Phase 3 services.
- Clear active cart after successful placement.

## Indexes

See `docs/database/phase-4-index-plan.md`.

## API Endpoints

`docs/contracts/order-customer-api.md` — Module 10 implementation in progress.

## Implementation status

| Area | Status |
|------|--------|
| Mongoose model | Module 10 |
| Placement service | Module 10 |
| Customer routes | Module 10 |
