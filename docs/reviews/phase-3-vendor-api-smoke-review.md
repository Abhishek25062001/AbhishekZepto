# Phase 3 Vendor API Smoke Review

**Date:** 2026-05-18  
**Result:** **STATIC PASS** | **LIVE:** requires manual token

## Mounted endpoints verified

| Endpoint | Static | Notes |
|----------|--------|-------|
| `GET /api/v1/vendor/catalog/products` | PASS | Search module |
| `GET /api/v1/vendor/catalog/facets` | PASS | |
| `GET /api/v1/vendor/catalog/categories` | **GAP** | Not mounted |
| `GET /api/v1/vendor/catalog/brands` | **GAP** | Not mounted |
| `GET /api/v1/vendor/store-products` | PASS | |
| `GET /api/v1/vendor/inventory/stocks` | PASS | |
| `GET /api/v1/vendor/inventory/movements` | PASS | |

## Automated baseline

| Test suite | Result |
|------------|--------|
| `test:store-products` (vendor controllers) | PASS |
| `test:inventory` (vendor service) | PASS |
| `test:catalog-search` | PASS |
| `test:tenant-access` | PASS |
| `test:access-control-scenarios` | PASS |

## Tenant scope fields

`store_products.vendorId`, `store_products.storeId`, `inventory_stocks.vendorId`, `inventory_stocks.storeId` — enforced in services; negative cases in Ticket 17.

## Live curl

Use vendor OTP token per `phase-3-manual-smoke-checklist.md`. **LIVE PENDING** in automated run.
