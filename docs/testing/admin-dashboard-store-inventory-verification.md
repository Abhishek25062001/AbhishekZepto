# Admin Dashboard Store & Inventory Verification

Status: **VERIFIED** (static/code — 2026-05-18)

## Automated gates

- `npm run typecheck -w apps/admin-dashboard` — PASS
- `npm run lint -w apps/admin-dashboard` — PASS
- `npm run build -w apps/admin-dashboard` — PASS
- `npm run test:stores -w apps/admin-dashboard` — 16 tests PASS
- `npm run test:inventory -w apps/admin-dashboard` — 14 tests PASS
- `npm run test:catalog -w apps/admin-dashboard` — 20 tests PASS

## Manual QA checklist

- [ ] Login as `operations_admin`; confirm Locations, Stores, Inventory sidebar groups
- [ ] City CRUD with permission gates
- [ ] Service area CRUD with city filter and polygon JSON
- [ ] Store CRUD with operational filters and detail page
- [ ] Store product map with catalog product/variant dropdowns
- [ ] Bulk map/price/visibility modals (`store_products:bulk_update`)
- [ ] Inventory stock CRUD, adjust modal (`inventory:adjust`), bulk upload/thresholds
- [ ] Movement list/detail read-only
- [ ] Lock list expire-due (`inventory:adjust`) and detail

## Pending live verification

- End-to-end API calls against running backend + MongoDB
- Permission matrix for non-admin roles
