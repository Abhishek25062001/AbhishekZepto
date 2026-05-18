# Product Management API

Status: **IMPLEMENTED**

Base path: `/api/v1/admin/catalog/products`

## Endpoints

| Method | Path | Permission |
|--------|------|------------|
| GET | `/` | `catalog:read` |
| POST | `/` | `catalog:create` |
| GET | `/:productId` | `catalog:read` |
| PATCH | `/:productId` | `catalog:update` |
| DELETE | `/:productId` | `catalog:delete` |
| PATCH | `/:productId/approval-status` | `catalog:approve` |

## Create / update body (high level)

Required on create: `name`, `categoryId`, `productType`.  
Optional: `slug`, `description`, `shortDescription`, `subcategoryId`, `brandId`, `foodType`, `taxCategoryId`, `hsnCode`, `searchKeywords`, `tags`, `defaultImageUrl`, `imageUrls`, `attributeSummary`, `isFeatured`, `isVisible`, `status`.

`approvalStatus` is **not** set via create/update — use approval-status endpoint.

## Approval body

| Field | Rule |
|-------|------|
| `approvalStatus` | required: `draft`, `pending_review`, `approved`, `rejected`, `archived` |
| `rejectionReason` | required when `approvalStatus = rejected` |

## List query

`page`, `limit`, `categoryId`, `subcategoryId`, `brandId`, `approvalStatus`, `status`, `isVisible`, `isFeatured`, `foodType`, `search`, `sortBy`, `sortOrder`

## DB fields

See `docs/database/catalog-product-schema.md` plus approval metadata: `approvedBy`, `approvedAt`, `rejectedBy`, `rejectedAt`, `rejectionReason`.

## Dependency counts (for other modules)

- `countActiveProductsByCategory(categoryId)` — exported from product repository
- `countActiveProductsByBrand(brandId)` — exported from product repository
