# Customer Store Selection Schema

## Collection

`customer_store_selections`

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `customerId` | ObjectId | yes | Customer owner |
| `addressId` | ObjectId | yes | Linked `customer_addresses._id` |
| `storeId` | ObjectId | yes | Selected `stores._id` |
| `isSelected` | boolean | yes | One `true` per customer |
| `createdAt` | Date | yes | |
| `updatedAt` | Date | yes | |

## Business Rules

- At most one document per customer with `isSelected: true`.
- New selection clears previous `isSelected` flags for that customer.
- `addressId` must belong to the same `customerId`.
- `storeId` must pass serviceability check for address coordinates.

## Indexes

- `{ customerId: 1, isSelected: 1 }` partial unique where `isSelected: true`
- `{ customerId: 1 }`

## Cross-References

- `docs/database/customer-address-schema.md`
- `docs/contracts/customer-address-api.md` — `POST /store-selection`
