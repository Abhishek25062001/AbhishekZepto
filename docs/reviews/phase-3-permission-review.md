# Phase 3 Permission Review

**Date:** 2026-05-18  
**Result:** **PASS**

## Permission codes — PASS

| Family | Codes | Status |
|--------|-------|--------|
| Catalog | read, create, update, delete, approve | PASS |
| Locations | read, create, update, delete | PASS |
| Stores | read, create, update, delete | PASS |
| Store products | read, create, update, delete, bulk_update | PASS |
| Inventory | read, create, update, delete, adjust, bulk_update | PASS |
| Media | read, upload, update, delete | PASS |

## Role seed matrix (`seed-roles.ts`)

| Role | Phase 3 permissions | Status |
|------|-------------------|--------|
| `super_admin` | `*:*` (via seed matrix test) | PASS |
| `operations_admin` | Full catalog, locations, stores, store_products, inventory, media | PASS |
| `vendor_owner` | catalog:read/update, store_products, inventory, media | PASS |
| `store_manager` | Same pattern (no settings:manage) | PASS |
| `store_staff` | read + limited update | PASS |
| `customer` | `customer:read_self` | PASS |

## Automated verification

`npm run test:seed-matrix -w backend/api` — **7/7 PASS**

## Scope fields on identity

`user_identities`: `role`, `permissions`, `vendorId`, `storeId`, `cityId` — used by tenant middleware (verified in access-control tests).
