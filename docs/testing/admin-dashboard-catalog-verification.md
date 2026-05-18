# Admin Dashboard Catalog — Verification Checklist

Status: **IMPLEMENTED** (static/code verification)

## Automated

- [x] `npm run typecheck -w apps/admin-dashboard`
- [x] `npm run lint -w apps/admin-dashboard`
- [x] `npm run build -w apps/admin-dashboard`
- [x] `npm run test:catalog -w apps/admin-dashboard`

## Manual (requires running API + MongoDB)

- [ ] Login as `operations_admin` (or role with catalog permissions).
- [ ] Categories: list, create, edit, delete (soft delete).
- [ ] Brands: list, create, edit, delete.
- [ ] Units: list, create, edit, delete.
- [ ] Products: list, create, edit, detail, approve, reject.
- [ ] Media upload on category/brand/product forms.
- [ ] User without `catalog:create` does not see create buttons.
- [ ] User without `catalog:approve` does not see approve/reject on product detail.

## Deferred

- Product variant screens.
