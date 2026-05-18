# Service Area Management API

Status: **IMPLEMENTED**

Base path: `/api/v1/admin/locations/service-areas`

## Endpoints

| Method | Path | Permission |
|--------|------|------------|
| GET | `/` | `locations:read` |
| POST | `/` | `locations:create` |
| GET | `/:serviceAreaId` | `locations:read` |
| PATCH | `/:serviceAreaId` | `locations:update` |
| DELETE | `/:serviceAreaId` | `locations:delete` |

## Request body (create / update)

| Field | Type | Notes |
|-------|------|-------|
| `cityId` | ObjectId string | Required on create |
| `name` | string | Required on create |
| `slug` | string | Optional; unique per city |
| `description` | string \| null | Optional |
| `polygon` | array | Optional geo polygon |
| `centerLatitude` | number | Optional |
| `centerLongitude` | number | Optional |
| `radiusKm` | number | Optional |
| `isServiceable` | boolean | Optional |
| `status` | enum | `active`, `inactive`, `archived` |

## List query

`page`, `limit`, `cityId`, `status`, `isServiceable`, `search`, `sortBy`, `sortOrder`

## DB fields

`service_areas.cityId`, `service_areas.name`, `service_areas.slug`, `service_areas.description`, `service_areas.polygon`, `service_areas.centerLatitude`, `service_areas.centerLongitude`, `service_areas.radiusKm`, `service_areas.isServiceable`, `service_areas.status`, soft-delete and audit fields.
