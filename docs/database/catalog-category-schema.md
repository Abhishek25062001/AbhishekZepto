# Catalog Category Schema

## Collection

`categories`

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `name` | string | yes | Display name |
| `slug` | string | yes | URL-safe identifier; unique among non-deleted |
| `description` | string | no | Long description |
| `parentCategoryId` | ObjectId \| null | no | `null` = root category |
| `level` | number | yes | `1` root, `2` subcategory |
| `displayOrder` | number | no | Sort order within parent |
| `iconUrl` | string | no | Category icon URL |
| `bannerUrl` | string | no | Category banner URL |
| `isFeatured` | boolean | no | Featured in browse surfaces |
| `isVisible` | boolean | yes | Customer/vendor visibility flag |
| `status` | enum | yes | `active`, `inactive`, `archived` |
| `isDeleted` | boolean | yes | Soft delete flag |
| `deletedAt` | Date \| null | no | Set on soft delete |
| `createdBy` | ObjectId | no | Admin user id |
| `updatedBy` | ObjectId | no | Admin user id |
| `createdAt` | Date | yes | Base timestamp |
| `updatedAt` | Date | yes | Base timestamp |

## Hierarchy Rules

- `parentCategoryId = null` means root category.
- `level = 1` for root category.
- `level = 2` for subcategory (child of root).
- Maximum nesting depth is **2** (root + one subcategory level). Deeper nesting is blocked at service layer.

## Slug Uniqueness Rule

- `categories.slug` must be unique among documents where `isDeleted = false`.
- Implement as partial unique index (see `docs/database/catalog-index-plan.md`).

## API Endpoints

No API endpoints are created in this schema document. Planned admin routes:

- `GET|POST /api/v1/admin/catalog/categories`
- `GET|PATCH|DELETE /api/v1/admin/catalog/categories/:categoryId`
