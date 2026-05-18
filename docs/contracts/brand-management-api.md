# Brand Management API

Status: **IMPLEMENTED**

Base path: `/api/v1/admin/catalog/brands`

## Endpoints

| Method | Path | Permission |
|--------|------|------------|
| GET | `/` | `catalog:read` |
| POST | `/` | `catalog:create` |
| GET | `/:brandId` | `catalog:read` |
| PATCH | `/:brandId` | `catalog:update` |
| DELETE | `/:brandId` | `catalog:delete` |

## Request body (create / update)

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Required on create |
| `slug` | string | Optional; auto-generated from name |
| `description` | string \| null | Optional |
| `logoUrl` | string \| null | Optional |
| `bannerUrl` | string \| null | Optional |
| `isFeatured` | boolean | Optional |
| `isVisible` | boolean | Optional |
| `status` | enum | `active`, `inactive`, `archived` |

## List query

`page`, `limit`, `status`, `isVisible`, `isFeatured`, `search`, `sortBy`, `sortOrder`

## DB fields

`brands.name`, `brands.slug`, `brands.description`, `brands.logoUrl`, `brands.bannerUrl`, `brands.isFeatured`, `brands.isVisible`, `brands.status`, `brands.isDeleted`, `brands.deletedAt`, `brands.createdBy`, `brands.updatedBy`
