# Phase 3 Testing & Validation Plan

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** Phase 3 Testing & Validation (Module 16)  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` pages 365–412  
**Status:** **COMPLETE** — validation finished 2026-05-18

## Modules covered (1–15)

| # | Module | Validation focus |
|---|--------|------------------|
| 1 | Catalog Architecture | Docs/contracts alignment |
| 2 | Category Management Backend | Model, routes, tests |
| 3 | Brand & Unit Management Backend | Model, routes, tests |
| 4 | Product Management Backend | Model, routes, approval |
| 5 | Product Variant Management Backend | Nested variants, SKU uniqueness |
| 6 | Store Foundation Backend | Cities, service areas, stores |
| 7 | Store Product Mapping | Vendor/admin store products |
| 8 | Inventory Foundation Backend | Stocks, movements |
| 9 | Inventory Locking Preparation | Internal locks, TTL |
| 10 | Media & File Upload Foundation | Upload, attach-owner |
| 11 | Admin Dashboard — Catalog Foundation | UI routes, API wiring |
| 12 | Admin Dashboard — Store & Inventory Foundation | Stores, inventory UI |
| 13 | Vendor Panel — Store Catalog Foundation | Read-only catalog + ops |
| 14 | Customer App — Catalog Read Foundation | Browse UI, client APIs |
| 15 | Catalog Search & Filtering Foundation | Search, facets, filters |

## Validation categories → review artifacts

| Category | Ticket | Review document |
|----------|--------|-----------------|
| Master plan | 1 | This document |
| Backend module structure | 2 | `phase-3-backend-module-structure-review.md` |
| Database schema | 3–5 | `phase-3-database-schema-review.md` |
| Database indexes | 6 | `phase-3-database-index-review.md` |
| Route mounting | 7–9 | `phase-3-backend-route-mount-review.md` |
| Permissions & seeds | 10 | `phase-3-permission-review.md` |
| Admin API smoke | 11 | `phase-3-admin-api-smoke-review.md` |
| Vendor API smoke | 12 | `phase-3-vendor-api-smoke-review.md` |
| Customer API smoke | 13 | `phase-3-customer-api-smoke-review.md` |
| Admin Dashboard UI | 14 | `phase-3-admin-dashboard-ui-review.md` |
| Vendor Panel UI | 15 | `phase-3-vendor-panel-ui-review.md` |
| Customer App UI | 16 | `phase-3-customer-app-ui-review.md` |
| Tenant scope | 17 | `phase-3-tenant-scope-validation.md` |
| Customer visibility | 18 | `phase-3-customer-visibility-validation.md` |
| Inventory movements | 19 | `phase-3-inventory-movement-validation.md` |
| Inventory locks | 20 | `phase-3-inventory-lock-validation.md` |
| Media upload | 21 | `phase-3-media-upload-validation.md` |
| Catalog search | 22 | `phase-3-catalog-search-validation.md` |
| Audit logs | 23 | `phase-3-audit-log-validation.md` |
| Seed idempotency | 24 | `phase-3-seed-data-validation.md` |
| OpenAPI vs registry | 25 | `phase-3-openapi-contract-review.md` |
| Backend quality gates | 26 | `phase-3-backend-quality-results.md` |
| Frontend quality gates | 27 | `phase-3-frontend-quality-results.md` |
| Manual E2E checklist | 28 | `phase-3-manual-smoke-checklist.md` |
| Production risks | 29 | `phase-3-production-readiness-risks.md` |
| Final sign-off | 30 | `phase-3-final-validation-summary.md` |

## API verification scope

All Phase 3 surfaces per `docs/contracts/backend-route-registry.md`:

- **Admin:** catalog CRUD, locations, stores, store-products, inventory, media, inventory locks
- **Vendor:** catalog products/facets (partial), store-products, inventory, media
- **Customer:** catalog products/search/featured/facets (categories/brands/detail may be PLANNED)
- **Internal:** inventory locks, media attach-owner

## DB collections validated

`categories`, `brands`, `product_units`, `products`, `product_variants`, `cities`, `service_areas`, `stores`, `store_products`, `inventory_stocks`, `inventory_movements`, `inventory_locks`, `media_files`, `audit_logs`

## Verification command index

### Backend (`backend/api`)

```bash
npm run typecheck -w backend/api
npm run lint -w backend/api
npm run build -w backend/api
npm run test:phase-3 -w backend/api          # aggregate (Ticket 26)
npm run test:categories -w backend/api
npm run test:brands -w backend/api
npm run test:units -w backend/api
npm run test:products -w backend/api
npm run test:variants -w backend/api
npm run test:cities -w backend/api
npm run test:service-areas -w backend/api
npm run test:stores -w backend/api
npm run test:store-products -w backend/api
npm run test:inventory -w backend/api
npm run test:inventory-locks -w backend/api
npm run test:media -w backend/api
npm run test:catalog-search -w backend/api
npm run test:access-control-harness -w backend/api
npm run test:access-control-scenarios -w backend/api
npm run test:tenant-access -w backend/api
npm run test:seed-matrix -w backend/api
```

### Frontends

```bash
npm run typecheck -w apps/admin-dashboard
npm run test:catalog -w apps/admin-dashboard
npm run test:stores -w apps/admin-dashboard
npm run test:inventory -w apps/admin-dashboard

npm run typecheck -w apps/vendor-panel
npm run test:store-catalog -w apps/vendor-panel
npm run test:store-inventory -w apps/vendor-panel

npm run typecheck -w apps/customer-app
npm run test:catalog -w apps/customer-app
```

### Root

```bash
npm run check:secrets
npm run check:frontend-secrets
npm run check:health   # requires running API
```

## Live environment requirements

Tickets **11–13**, **17–23** require:

- MongoDB running
- `npm run seed -w backend/api`
- `npm run dev -w backend/api`
- OTP/auth tokens for admin, vendor, customer test users

When live environment is unavailable, reviews record **STATIC PASS** (code/tests) vs **LIVE PENDING** (manual curl).

## Out of scope

- New features or route implementation
- Elasticsearch / production CDN
- Checkout integration
- Module 17 Integration & Review (follows this module)
