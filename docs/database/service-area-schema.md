# Service Area Schema

## Collection

`service_areas`

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `cityId` | ObjectId | yes | Parent city |
| `name` | string | yes | Display name |
| `slug` | string | yes | Unique per city among non-deleted |
| `description` | string | no | |
| `polygon` | array | no | Geo polygon placeholder |
| `centerLatitude` | number | no | |
| `centerLongitude` | number | no | |
| `radiusKm` | number | no | |
| `isServiceable` | boolean | yes | |
| `status` | enum | yes | `active`, `inactive`, `archived` |
| `isDeleted` | boolean | yes | |
| `deletedAt` | Date \| null | no | |
| `createdBy` | ObjectId | no | |
| `updatedBy` | ObjectId | no | |
| `createdAt` | Date | yes | |
| `updatedAt` | Date | yes | |

## API Endpoints

Planned admin CRUD under `/api/v1/admin/locations/service-areas`.
