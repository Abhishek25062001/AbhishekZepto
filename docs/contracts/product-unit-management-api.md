# Product Unit Management API

Status: **IMPLEMENTED**

Base path: `/api/v1/admin/catalog/units`

## Endpoints

| Method | Path | Permission |
|--------|------|------------|
| GET | `/` | `catalog:read` |
| POST | `/` | `catalog:create` |
| GET | `/:unitId` | `catalog:read` |
| PATCH | `/:unitId` | `catalog:update` |
| DELETE | `/:unitId` | `catalog:delete` |

## Request body (create / update)

| Field | Type | Notes |
|-------|------|-------|
| `code` | string | Required on create; normalized lowercase |
| `name` | string | Required on create |
| `baseUnit` | enum | `piece`, `pack`, `kg`, `g`, `litre`, `ml`, `dozen` |
| `conversionFactor` | number | Required; must be > 0 |
| `status` | enum | `active`, `inactive`, `archived` |

## List query

`page`, `limit`, `status`, `baseUnit`, `search`, `sortBy`, `sortOrder`

## DB fields

`product_units.code`, `product_units.name`, `product_units.baseUnit`, `product_units.conversionFactor`, `product_units.status`, `product_units.isDeleted`, `product_units.deletedAt`, `product_units.createdBy`, `product_units.updatedBy`
