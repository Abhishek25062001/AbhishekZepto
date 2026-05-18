# Phase 3 Seed Data Validation

**Date:** 2026-05-18  
**Result:** **PASS** (design + matrix test)

## Seed files reviewed

- `seed-catalog.ts`
- `seed-locations.ts`
- `seed-stores.ts`
- `seed-store-products.ts`
- `seed-inventory.ts`
- `seed-roles.ts`

## Idempotency strategy

Seeds use upsert/slug-based keys aligned with partial unique indexes — **PASS** by design.

## Automated test

`npm run test:seed-matrix -w backend/api` — **7/7 PASS**

## Double-run live test

```bash
npm run seed -w backend/api && npm run seed -w backend/api
```

**LIVE PENDING** — requires MongoDB. Run during manual QA; expect no duplicate slugs/codes.

## Unique keys checked

`categories.slug`, `brands.slug`, `product_units.code`, `cities.slug`, `service_areas` compound, `stores.code`, `store_products` store+variant.
