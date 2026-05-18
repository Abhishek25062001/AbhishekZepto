# Phase 3 Admin API Smoke Review

**Date:** 2026-05-18  
**Result:** **STATIC PASS** | **LIVE:** requires manual token

## Static verification (route registration)

All admin list handlers registered via mounted routers — **PASS** (see `phase-3-backend-route-mount-review.md`).

## Automated baseline

| Test suite | Result |
|------------|--------|
| `test:categories` | PASS |
| `test:brands` | PASS |
| `test:units` | PASS |
| `test:products` | PASS |
| `test:cities` | PASS |
| `test:service-areas` | PASS |
| `test:stores` | PASS |
| `test:store-products` | PASS |
| `test:inventory` | PASS |
| `test:inventory-locks` | PASS |
| `test:media` | PASS |

## Live curl smoke (manual)

**Prerequisites:** `npm run dev -w backend/api`, `npm run seed -w backend/api`, admin OTP token.

| Endpoint | Expected |
|----------|----------|
| `GET /api/v1/admin/catalog/categories` | 200 + paginated |
| `GET /api/v1/admin/catalog/brands` | 200 |
| `GET /api/v1/admin/catalog/units` | 200 |
| `GET /api/v1/admin/catalog/products` | 200 |
| `GET /api/v1/admin/locations/cities` | 200 |
| `GET /api/v1/admin/locations/service-areas` | 200 |
| `GET /api/v1/admin/stores` | 200 |
| `GET /api/v1/admin/store-products` | 200 |
| `GET /api/v1/admin/inventory/stocks` | 200 |
| `GET /api/v1/admin/inventory/movements` | 200 |
| `GET /api/v1/admin/inventory/locks` | 200 |
| `GET /api/v1/admin/media/files` | 200 |

**Live execution:** Not run in CI agent (auth token required). Mark **LIVE PENDING** for manual QA using `phase-3-manual-smoke-checklist.md`.

## Unauthenticated check

Requests without `Authorization` → **401** (covered by `test:access-control-scenarios`).
