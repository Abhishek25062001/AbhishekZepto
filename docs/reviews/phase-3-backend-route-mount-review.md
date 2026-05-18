# Phase 3 Backend Route Mount Review

**Date:** 2026-05-18  
**Result:** **PASS** with documented **GAPs** (vendor/customer categories-brands)

## Admin — IMPLEMENTED

| Endpoint group | Mount | Status |
|------------------|-------|--------|
| Catalog categories CRUD | `/catalog/categories` | PASS |
| Catalog brands CRUD | `/catalog/brands` | PASS |
| Catalog units CRUD | `/catalog/units` | PASS |
| Catalog products CRUD + approval | `/catalog/products` | PASS |
| Product variants nested | `/:productId/variants` under products | PASS |
| Cities / service areas | `/locations/cities`, `/locations/service-areas` | PASS |
| Stores | `/stores` | PASS |
| Store products + bulk | `/store-products` | PASS |
| Inventory stocks/movements | `/inventory` | PASS |
| Inventory locks admin | `/inventory/locks` (nested) | PASS |
| Media admin | `/media` | PASS |

## Vendor — PARTIAL

| Endpoint | Status |
|----------|--------|
| `GET /vendor/catalog/products` | PASS |
| `GET /vendor/catalog/facets` | PASS |
| `GET /vendor/catalog/categories` | **GAP** — not mounted |
| `GET /vendor/catalog/brands` | **GAP** — not mounted |
| `GET /vendor/catalog/products/:id` | **GAP** — not mounted |
| Store products, inventory, media | PASS |

## Customer — PARTIAL

| Endpoint | Status |
|----------|--------|
| `GET /customer/catalog/products` | PASS |
| `GET /customer/catalog/search` | PASS |
| `GET /customer/catalog/featured-products` | PASS |
| `GET /customer/catalog/facets` | PASS |
| Categories, brands, detail, variants | **GAP** — UI calls PLANNED paths; backend not mounted |

## Internal — IMPLEMENTED

| Endpoint | Status |
|----------|--------|
| `POST /internal/inventory/locks` (+ release/confirm) | PASS |
| `POST /internal/media/attach-owner` | PASS |
| `GET /internal/media/files/:mediaFileId` | PASS |

## Conclusion

Core Phase 3 operational routes mounted. Vendor/customer browse categories/brands/detail remain **PLANNED** per contracts — documented, not implemented in this validation module.
