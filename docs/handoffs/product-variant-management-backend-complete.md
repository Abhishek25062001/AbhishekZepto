# Product Variant Management Backend — Complete

Date: 2026-05-18

## Scope delivered

Nested admin variant CRUD:

- `GET|POST /api/v1/admin/catalog/products/:productId/variants`
- `PATCH|DELETE /api/v1/admin/catalog/products/:productId/variants/:variantId`

Collection: `product_variants`  
Permissions: `catalog:read|create|update|delete`  
Tests: `npm run test:variants`

## Cross-module wiring

- Product delete uses `countActiveVariantsByProduct`
- Unit delete uses `countVariantsUsingUnit`

## Not in scope

- Store Foundation, Inventory, Media, frontend UIs
- Vendor/customer variant APIs

## Verification

```bash
cd backend/api
npm run typecheck
npm run test:variants
npm run test:products
npm run test:units
```
