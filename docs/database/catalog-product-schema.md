# Catalog Product Schema

## Collection

`products`

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `name` | string | yes | Product title |
| `slug` | string | yes | URL-safe identifier |
| `description` | string | no | Full description |
| `shortDescription` | string | no | Listing snippet |
| `categoryId` | ObjectId | yes | Root or subcategory reference |
| `subcategoryId` | ObjectId | no | Optional explicit subcategory |
| `brandId` | ObjectId | no | Brand reference |
| `productType` | enum | yes | See allowed values |
| `foodType` | enum | no | See allowed values |
| `taxCategoryId` | ObjectId | no | Reference to `tax_categories` |
| `hsnCode` | string | no | Tax classification code |
| `searchKeywords` | string[] | no | Search indexing |
| `tags` | string[] | no | Facet tags |
| `defaultImageUrl` | string | no | Primary image |
| `imageUrls` | string[] | no | Gallery URLs |
| `attributeSummary` | object | no | Embedded attribute summary |
| `isFeatured` | boolean | no | Featured product |
| `isVisible` | boolean | yes | Listing visibility |
| `approvalStatus` | enum | yes | Admin-controlled workflow |
| `status` | enum | yes | Operational status |
| `isDeleted` | boolean | yes | Soft delete |
| `deletedAt` | Date \| null | no | Soft delete timestamp |
| `createdBy` | ObjectId | no | Admin actor |
| `updatedBy` | ObjectId | no | Admin actor |
| `createdAt` | Date | yes | Base timestamp |
| `updatedAt` | Date | yes | Base timestamp |

## productType Allowed Values

- `simple`
- `variant`
- `bundle_placeholder`

## foodType Allowed Values

- `veg`
- `non_veg`
- `egg`
- `not_applicable`

## Product Approval Statuses

- `draft`
- `pending_review`
- `approved`
- `rejected`
- `archived`

## Operational status

Use `status` for active/inactive/archived lifecycle separate from approval workflow.

## API Endpoints

No API endpoints are created in this schema document. Planned admin routes include
product CRUD and `PATCH .../approval-status` (see `docs/contracts/catalog-admin-api-contract.md`).
