# Phase 3 Database Index Review

**Date:** 2026-05-18  
**Result:** **PASS**

## Partial unique indexes (isDeleted=false)

| Collection | Index | Status |
|------------|-------|--------|
| categories | `slug` | PASS |
| brands | `slug` | PASS |
| product_units | `code` | PASS |
| products | `slug` | PASS |
| product_variants | `sku` | PASS |
| cities | `slug` | PASS |
| service_areas | `cityId + slug` | PASS |
| stores | `cityId + slug`, `code` | PASS |
| store_products | `storeId + variantId`, `storeId + storeSku` | PASS |
| inventory_stocks | `storeId + storeProductId` | PASS |
| media_files | `storageKey` | PASS |

## Lock indexes

| Index | Status |
|-------|--------|
| `inventory_locks.lockToken` unique partial `status=active` | PASS |
| `inventory_locks.expiresAt` TTL `expireAfterSeconds: 0` | PASS |

## Search / catalog filter indexes

| Index | Status |
|-------|--------|
| Product text (`name`, `slug`, `shortDescription`, `description`, `searchKeywords`, `tags`) | PASS |
| `store_products` `cityId+status+isVisible+isAvailable` | PASS |
| `store_products` `storeId+status+isVisible+isAvailable` | PASS |
| `store_products.finalPrice` | PASS |
| `inventory_stocks` `storeProductId+status+isOutOfStock` | PASS |
| Product compounds (`categoryId/brandId/foodType/isFeatured` + status) | PASS |

## Notes

- Mongoose may warn on duplicate `isDeleted` index from `baseSchemaFields` + explicit index — non-blocking.
- `catalog-index-plan.md` status: **APPLIED**.
