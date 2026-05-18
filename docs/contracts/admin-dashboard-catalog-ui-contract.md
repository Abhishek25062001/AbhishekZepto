# Admin Dashboard Catalog UI Contract

Status: **IMPLEMENTED**

## API consumers

### Categories

- `GET /api/v1/admin/catalog/categories` — list (query: `page`, `limit`, `search`, `status`, `isVisible`, `isFeatured`, `parentCategoryId`, `sortBy`, `sortOrder`)
- `GET /api/v1/admin/catalog/categories/:categoryId`
- `POST /api/v1/admin/catalog/categories`
- `PATCH /api/v1/admin/catalog/categories/:categoryId`
- `DELETE /api/v1/admin/catalog/categories/:categoryId`

### Brands

- `GET|POST /api/v1/admin/catalog/brands`
- `GET|PATCH|DELETE /api/v1/admin/catalog/brands/:brandId`

### Product units

- `GET|POST /api/v1/admin/catalog/units`
- `GET|PATCH|DELETE /api/v1/admin/catalog/units/:unitId`

### Products

- `GET|POST /api/v1/admin/catalog/products`
- `GET|PATCH|DELETE /api/v1/admin/catalog/products/:productId`
- `PATCH /api/v1/admin/catalog/products/:productId/approval-status`

### Media

- `POST /api/v1/admin/media/upload` (multipart: `file`, `filePurpose`, optional `ownerType`, `ownerId`, `isPublic`)

## Payload notes

Create/update payloads may include `*MediaFileId` fields (`iconMediaFileId`, `bannerMediaFileId`, `logoMediaFileId`, `defaultImageMediaFileId`) after upload; backend resolves public URLs.

## Response shape

Follow `docs/standards/backend-response-format.md`: `{ success, message, data, meta }`. Paginated lists return `data` as array with `meta.pagination`.

## Out of scope

- Variant CRUD UI.
- Vendor/customer catalog surfaces.
