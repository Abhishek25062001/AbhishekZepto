# Store Schema

## Collection

`stores`

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `vendorId` | ObjectId | yes | Vendor scope (ObjectId validated) |
| `cityId` | ObjectId | yes | Parent city |
| `serviceAreaIds` | ObjectId[] | no | Service areas in same city |
| `name` | string | yes | |
| `slug` | string | yes | Unique per city among non-deleted |
| `code` | string | yes | Unique among non-deleted; immutable on update |
| `description` | string | no | |
| `phone` | string | yes | |
| `email` | string | no | |
| `addressLine1` | string | yes | |
| `addressLine2` | string | no | |
| `landmark` | string | no | |
| `pincode` | string | yes | |
| `latitude` | number | yes | |
| `longitude` | number | yes | |
| `serviceRadiusKm` | number | yes | |
| `openingTime` | string | yes | e.g. `08:00` |
| `closingTime` | string | yes | e.g. `22:00` |
| `operatingDays` | string[] | yes | e.g. `mon`–`sun` |
| `isOpen` | boolean | yes | Default `true` on create |
| `isAcceptingOrders` | boolean | yes | Default `true` on create |
| `temporaryClosureReason` | string | no | Required when closing |
| `storeType` | enum | yes | `grocery`, `pharmacy`, `restaurant`, `general`, `dark_store` |
| `fulfillmentType` | enum | yes | `delivery`, `pickup`, `delivery_and_pickup` |
| `status` | enum | yes | `active`, `inactive`, `suspended`, `archived` |
| `isDeleted` | boolean | yes | |
| `deletedAt` | Date \| null | no | |
| `createdBy` | ObjectId | no | |
| `updatedBy` | ObjectId | no | |
| `createdAt` | Date | yes | |
| `updatedAt` | Date | yes | |

## API Endpoints

Planned admin CRUD under `/api/v1/admin/stores`.
