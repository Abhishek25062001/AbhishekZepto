# City Schema

## Collection

`cities`

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `name` | string | yes | Display name |
| `slug` | string | yes | URL-safe; unique among non-deleted |
| `state` | string | yes | State/region |
| `country` | string | yes | Default `India` when omitted on create |
| `timezone` | string | yes | e.g. `Asia/Kolkata` |
| `currencyCode` | string | yes | e.g. `INR` |
| `latitude` | number | no | Geo center |
| `longitude` | number | no | Geo center |
| `serviceRadiusKm` | number | no | Service radius |
| `isServiceable` | boolean | yes | Launch/service flag |
| `status` | enum | yes | `active`, `inactive`, `archived` |
| `isDeleted` | boolean | yes | Soft delete |
| `deletedAt` | Date \| null | no | Soft delete timestamp |
| `createdBy` | ObjectId | no | Admin actor |
| `updatedBy` | ObjectId | no | Admin actor |
| `createdAt` | Date | yes | |
| `updatedAt` | Date | yes | |

## API Endpoints

Planned admin CRUD under `/api/v1/admin/locations/cities`.
