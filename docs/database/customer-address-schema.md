# Customer Address Schema

## Collection

`customer_addresses`

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `customerId` | ObjectId | yes | Reference to customer user identity |
| `label` | string | yes | e.g. Home, Work |
| `line1` | string | yes | Street / building |
| `line2` | string | no | Area / landmark detail |
| `landmark` | string | no | Nearby landmark |
| `city` | string | yes | City name (display) |
| `cityId` | ObjectId | no | Optional link to Phase 3 `cities` |
| `state` | string | no | State |
| `postalCode` | string | no | PIN / ZIP |
| `country` | string | yes | Default `IN` |
| `latitude` | number | yes | For serviceability lookup |
| `longitude` | number | yes | For serviceability lookup |
| `isDefault` | boolean | yes | One default per customer |
| `status` | enum | yes | `active`, `inactive` |
| `isDeleted` | boolean | yes | Soft delete |
| `deletedAt` | Date \| null | no | Soft delete timestamp |
| `createdAt` | Date | yes | Base timestamp |
| `updatedAt` | Date | yes | Base timestamp |

## Business Rules

- At most **one** `isDefault: true` per `customerId` among non-deleted addresses.
- Coordinates required for nearest-store / serviceability lookup (Module 1).
- Customer may only CRUD own addresses (enforced at service + auth layer).

## Indexes

See `docs/database/phase-4-index-plan.md`.

## Related Collections

- `customer_store_selections` references `addressId` — see `docs/database/customer-store-selection-schema.md`.

## API Endpoints

Planned customer routes — see `docs/contracts/customer-address-api.md`.

## DB Fields

This section documents collection fields only; no runtime fields are created by this document.
