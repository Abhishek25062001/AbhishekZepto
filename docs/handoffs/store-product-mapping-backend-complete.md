# Store Product Mapping Backend — Complete

Date: 2026-05-18

## Summary

Phase 3 module 7 delivers `store_products` mappings between stores and catalog variants with admin CRUD, bulk operations, and vendor-scoped availability/price updates.

## APIs

**Admin** (`/api/v1/admin/store-products`): list, create, get, update, delete, bulk-map, bulk-price, bulk-visibility.

**Vendor** (`/api/v1/vendor/store-products`): list, get, patch availability, patch price (scope + `isPriceLocked` enforced).

Contract: `docs/contracts/store-product-mapping-api.md`

## Permissions

`store_products:read|create|update|delete|bulk_update` — seeded on `operations_admin`, `vendor_owner`, `store_manager`, `store_staff`.

## Tests

`npm run test:store-products` — 15 tests (price util, admin/vendor services, controllers).

## Review

`docs/reviews/store-product-mapping-backend-review.md`

## Next

Inventory Foundation Backend.
