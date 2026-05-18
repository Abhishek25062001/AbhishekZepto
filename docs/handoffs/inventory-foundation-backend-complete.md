# Inventory Foundation Backend — Complete

Date: 2026-05-18

## Summary

Phase 3 module 8 delivers `inventory_stocks` and `inventory_movements` with admin stock management, bulk upload/thresholds, vendor-scoped adjustments, and store product delete guards.

## APIs

**Admin** (`/api/v1/admin/inventory`): stock CRUD, adjust, bulk-upload, bulk-thresholds, movement list/detail.

**Vendor** (`/api/v1/vendor/inventory`): scoped stock list/detail, adjust, movement list.

Contract: `docs/contracts/inventory-foundation-api.md`

## Permissions

`inventory:read|create|update|delete|adjust|bulk_update` — seeded on `operations_admin`; vendor roles have `read` + `update`.

## Tests

`npm run test:inventory` — 17 tests.

## Review

`docs/reviews/inventory-foundation-backend-review.md`

## Next

Inventory Locking Preparation.
