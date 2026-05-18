# Media File Schema

## Collection

`media_files`

Uploaded file metadata for catalog, store, user, and operational attachments. Binary content stored via storage adapter (local dev, S3 placeholder).

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `ownerType` | enum | no | See owner types |
| `ownerId` | ObjectId | no | Ref owner entity |
| `uploadedBy` | ObjectId | no | Actor user |
| `uploadedByRole` | string | no | Role at upload |
| `uploadedFromSurface` | string | no | e.g. `admin_dashboard`, `vendor_panel` |
| `fileCategory` | enum | yes | `image`, `document`, `video`, `audio`, `other` |
| `filePurpose` | enum | yes | See file purposes |
| `originalFileName` | string | yes | Sanitized original name |
| `storedFileName` | string | yes | `timestamp_random.extension` |
| `storageKey` | string | yes | Unique path key |
| `publicUrl` | string | no | Public access URL |
| `signedUrl` | string | no | Last generated signed URL |
| `mimeType` | string | yes | |
| `extension` | string | yes | |
| `sizeBytes` | number | yes | min 1 |
| `width` | number | no | When available |
| `height` | number | no | When available |
| `checksum` | string | yes | SHA-256 hex |
| `storageProvider` | enum | yes | `local`, `s3`, `gcs`, `cloudinary` |
| `bucketName` | string | no | Cloud bucket |
| `folderPath` | string | no | Logical folder |
| `status` | enum | yes | See status enum |
| `isPublic` | boolean | yes | Default by purpose |
| `isDeleted` | boolean | yes | Soft delete |
| `deletedAt` | Date | no | |
| `deletedBy` | ObjectId | no | |
| `metadata` | object | no | Arbitrary JSON |
| `createdAt` | Date | yes | |
| `updatedAt` | Date | yes | |

## Enums

**ownerType:** `category`, `brand`, `product`, `product_variant`, `store`, `user`, `vendor`, `delivery_agent`, `order`, `support_ticket`, `system`

**filePurpose:** `category_icon`, `category_banner`, `brand_logo`, `brand_banner`, `product_main_image`, `product_gallery_image`, `variant_image`, `store_logo`, `store_banner`, `profile_image`, `order_proof`, `support_attachment`, `document_upload`, `general`

**storageProvider:** `local`, `s3`, `gcs`, `cloudinary`

**status:** `uploaded`, `processing`, `active`, `failed`, `deleted`, `archived`

## Indexes

| Index | Type |
|-------|------|
| `{ storageKey: 1 }` | unique partial where `isDeleted: false` |
| `ownerType`, `ownerId`, `uploadedBy`, `fileCategory`, `filePurpose`, `status`, `isPublic`, `isDeleted`, `createdAt` | ascending |
| `checksum` | ascending |

## Catalog URL integration

- `categories.iconUrl`, `categories.bannerUrl`
- `brands.logoUrl`, `brands.bannerUrl`
- `products.defaultImageUrl`, `products.imageUrls[]`
- `product_variants.imageUrl`
