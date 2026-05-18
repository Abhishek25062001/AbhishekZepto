# Catalog Unit and Tax Schema

## Collection: product_units

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `code` | string | yes | Unique unit code (e.g. `kg`, `piece`) |
| `name` | string | yes | Display name |
| `baseUnit` | enum | yes | `piece`, `pack`, `kg`, `g`, `litre`, `ml`, `dozen` |
| `conversionFactor` | number | yes | Must be > 0 |
| `status` | enum | yes | `active`, `inactive`, `archived` |
| `isDeleted` | boolean | yes | Soft delete |
| `deletedAt` | Date \| null | no | Soft delete |
| `createdBy` | ObjectId | no | Admin actor |
| `updatedBy` | ObjectId | no | Admin actor |
| `createdAt` | Date | yes | Base timestamp |
| `updatedAt` | Date | yes | Base timestamp |

### Unit code uniqueness

- `product_units.code` unique among `isDeleted = false`.

## Collection: tax_categories

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `name` | string | yes | Tax category name |
| `code` | string | yes | e.g. `GST_18` |
| `taxRate` | number | no | Rate placeholder |
| `hsnCode` | string | no | Optional HSN mapping |
| `status` | enum | yes | `active`, `inactive` |
| `createdAt` | Date | yes | Base timestamp |
| `updatedAt` | Date | yes | Base timestamp |

## Launch Rule

Tax fields may remain **placeholder** in Phase 3 if live GST calculation is not
enabled. Products may reference `taxCategoryId` without runtime tax computation.

## API Endpoints

No API endpoints are created in this schema document. Planned admin unit routes:

- `GET|POST /api/v1/admin/catalog/units`
- `GET|PATCH|DELETE /api/v1/admin/catalog/units/:unitId`

Tax categories are seeded/reference data; dedicated admin CRUD may be added in a
later ticket if required.
