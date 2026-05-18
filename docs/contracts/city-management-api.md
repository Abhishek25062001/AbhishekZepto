# City Management API

Status: **IMPLEMENTED**

Base path: `/api/v1/admin/locations/cities`

## Endpoints

| Method | Path | Permission |
|--------|------|------------|
| GET | `/` | `locations:read` |
| POST | `/` | `locations:create` |
| GET | `/:cityId` | `locations:read` |
| PATCH | `/:cityId` | `locations:update` |
| DELETE | `/:cityId` | `locations:delete` |

## Request body (create / update)

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Required on create |
| `slug` | string | Optional; auto-generated from name |
| `state` | string | Required on create |
| `country` | string | Optional; defaults to `India` |
| `timezone` | string | Required on create |
| `currencyCode` | string | Required on create |
| `latitude` | number | Optional |
| `longitude` | number | Optional |
| `serviceRadiusKm` | number | Optional |
| `isServiceable` | boolean | Optional |
| `status` | enum | `active`, `inactive`, `archived` |

## List query

`page`, `limit`, `status`, `isServiceable`, `search`, `sortBy`, `sortOrder`

## DB fields

`cities.name`, `cities.slug`, `cities.state`, `cities.country`, `cities.timezone`, `cities.currencyCode`, `cities.latitude`, `cities.longitude`, `cities.serviceRadiusKm`, `cities.isServiceable`, `cities.status`, soft-delete and audit fields.
