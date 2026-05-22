# Checkout Session Schema

## Collection

`checkout_sessions`

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `customerId` | ObjectId | yes | Owner |
| `cartId` | ObjectId | yes | Source cart |
| `storeId` | ObjectId | yes | Fulfillment store |
| `addressId` | ObjectId | yes | Delivery address reference |
| `addressSnapshot` | object | yes | Immutable copy at checkout time (see shape below) |
| `status` | enum | yes | `initiated`, `expired`, `completed`, `cancelled`, `failed` |
| `lockTokens` | string[] | yes | Phase 3 inventory lock tokens for line items |
| `reservationExpiresAt` | Date | yes | TTL aligned with env `CHECKOUT_RESERVATION_TTL_SECONDS` |
| `summarySnapshot` | object | yes | Totals, item count, currency at initiate |
| `summarySnapshot.subtotal` | number | yes | |
| `summarySnapshot.taxAmount` | number | no | |
| `summarySnapshot.deliveryFeeAmount` | number | no | |
| `summarySnapshot.grandTotal` | number | yes | Payable amount |
| `paymentId` | ObjectId | no | Set when payment order created |
| `orderId` | ObjectId | no | Set when order placed |
| `idempotencyKey` | string | no | Client retry key |
| `failureReason` | string | no | Last failure code/message |
| `createdAt` | Date | yes | Base timestamp |
| `updatedAt` | Date | yes | Base timestamp |

## Inventory Lock Integration

On `initiated`, backend calls internal inventory lock **create** per stock line.
On expiry/failure/cancel, calls **release**. On order success, **confirm**.

See `docs/architecture/phase-4-inventory-lock-integration.md` (cross-ref completed in Module 0 Ticket 18).

## Business Rules

- Only one active `initiated` session per customer recommended (implementation may enforce).
- Expired sessions must release locks (cron or lazy expiry job).
- `grandTotal` at initiate is authoritative for Razorpay order amount (Module 8).

## Indexes

See `docs/database/phase-4-index-plan.md` (TTL on `reservationExpiresAt` for cleanup queries).

## addressSnapshot shape

| Field | Type | Notes |
|-------|------|-------|
| `label` | string | |
| `line1` | string | |
| `line2` | string \| null | |
| `landmark` | string \| null | |
| `city` | string | |
| `state` | string \| null | |
| `postalCode` | string \| null | |
| `country` | string | |
| `latitude` | number | |
| `longitude` | number | |

## summarySnapshot.items[] shape

| Field | Type |
|-------|------|
| `itemId` | string |
| `productId` | string |
| `variantId` | string |
| `storeProductId` | string |
| `productName` | string \| null |
| `quantity` | number |
| `unitPrice` | number |
| `lineTotal` | number |

## API Endpoints

`docs/contracts/checkout-api.md` — Module 6 implementation.
