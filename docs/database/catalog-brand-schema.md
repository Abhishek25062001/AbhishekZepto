# Catalog Brand Schema

## Collection

`brands`

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `name` | string | yes | Brand display name |
| `slug` | string | yes | URL-safe identifier |
| `description` | string | no | Brand description |
| `logoUrl` | string | no | Brand logo |
| `bannerUrl` | string | no | Brand banner |
| `isFeatured` | boolean | no | Featured brand flag |
| `isVisible` | boolean | yes | Visibility in filters/browse |
| `status` | enum | yes | `active`, `inactive`, `archived` |
| `isDeleted` | boolean | yes | Soft delete |
| `deletedAt` | Date \| null | no | Soft delete timestamp |
| `createdBy` | ObjectId | no | Admin actor |
| `updatedBy` | ObjectId | no | Admin actor |
| `createdAt` | Date | yes | Base timestamp |
| `updatedAt` | Date | yes | Base timestamp |

## Slug Uniqueness Rule

- `brands.slug` must be unique among documents where `isDeleted = false`.

## Brand Visibility Rule

- Only **active** and **visible** brands (`status = active`, `isVisible = true`,
  `isDeleted = false`) may appear in customer-facing catalog filters and browse lists.

## API Endpoints

No API endpoints are created in this schema document. Planned admin routes:

- `GET|POST /api/v1/admin/catalog/brands`
- `GET|PATCH|DELETE /api/v1/admin/catalog/brands/:brandId`
