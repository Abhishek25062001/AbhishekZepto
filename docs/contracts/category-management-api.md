# Category Management API

Status: **IMPLEMENTED** (Category Management Backend module).

Base path: `/api/v1/admin/catalog/categories`

Authentication: required (`authenticate` + admin role gate).

## Endpoints

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/` | `catalog:read` | Paginated category list |
| POST | `/` | `catalog:create` | Create category |
| GET | `/:categoryId` | `catalog:read` | Get category by id |
| PATCH | `/:categoryId` | `catalog:update` | Update category |
| DELETE | `/:categoryId` | `catalog:delete` | Soft delete category |

## List query parameters

- `page`, `limit` — pagination (default 1, 20; max limit 100)
- `parentCategoryId` — Mongo ObjectId or `null` for root categories
- `status` — `active` | `inactive` | `archived`
- `isVisible`, `isFeatured` — boolean filters
- `search` — matches name or slug
- `sortBy` — `displayOrder` | `name` | `createdAt` | `updatedAt`
- `sortOrder` — `asc` | `desc`

## Create / update body

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Required on create |
| `slug` | string | Optional; generated from name when omitted |
| `description` | string \| null | Optional |
| `parentCategoryId` | ObjectId \| null | Max depth 2 levels |
| `displayOrder` | number | Default 0 |
| `iconUrl`, `bannerUrl` | string \| null | Optional |
| `isFeatured`, `isVisible` | boolean | Optional |
| `status` | enum | `active`, `inactive`, `archived` |

## Error codes

See `docs/errors/catalog-error-codes.md` and backend `ERROR_CODES` category entries.

## Related docs

- `docs/database/catalog-category-schema.md`
- `docs/contracts/catalog-admin-api-contract.md`
- `docs/security/catalog-permissions.md`
