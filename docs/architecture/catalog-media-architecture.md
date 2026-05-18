# Catalog Media Architecture

Status: **IMPLEMENTED** (storage metadata + backend upload APIs). Canonical upload paths: `/api/v1/admin/media/*`, `/api/v1/vendor/media/*`, `/api/v1/internal/media/*` (PDF Module 10). Admin Dashboard catalog UI remains a separate module.

## Supported Media Types

| Owner | Purpose |
|-------|---------|
| Category | icon, banner |
| Brand | logo, banner |
| Product | main image, gallery images |
| Variant | variant image |

## Upload Folder Convention (storage keys)

```text
/catalog/categories/{categoryId}/
/catalog/brands/{brandId}/
/catalog/products/{productId}/
/catalog/variants/{variantId}/
```

## Media Metadata Requirements

When `media_files` collection is implemented (later module):

- `originalFileName`
- `mimeType`
- `sizeBytes`
- `storageKey`
- `publicUrl`
- `uploadedBy`
- `uploadedAt`

Entity URL fields updated on catalog records:

- `categories.iconUrl`, `categories.bannerUrl`
- `brands.logoUrl`, `brands.bannerUrl`
- `products.defaultImageUrl`, `products.imageUrls[]`
- `product_variants.imageUrl`

## Media Validation

- Allowed formats: `jpg`, `jpeg`, `png`, `webp`
- Max image size: configurable via environment
- SVG blocked unless explicitly allowed in a future decision

## API Endpoints (planned)

| Method | Path |
|--------|------|
| POST | `/api/v1/admin/catalog/media/upload` |
| DELETE | `/api/v1/admin/catalog/media/:mediaId` |

Permission: `catalog:media_upload` (upload); delete gated by `catalog:update` or `catalog:delete`.

## DB Fields

Catalog entity URL fields listed above. Full `media_files` schema belongs to Media module.
