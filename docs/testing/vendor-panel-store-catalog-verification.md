# Vendor Panel Store Catalog Verification

Status: **VERIFIED** (static/code — 2026-05-18)

## Automated checks

```bash
npm run typecheck -w apps/vendor-panel
npm run lint -w apps/vendor-panel
npm run build -w apps/vendor-panel
npm run test:store-catalog -w apps/vendor-panel
npm run test:store-inventory -w apps/vendor-panel
npm run test:access-control-smoke -w apps/vendor-panel
```

## Manual QA checklist

- [ ] Vendor login and RBAC: sidebar items respect `catalog:read`, `store_products:read`, `inventory:read`
- [ ] Catalog list/detail: no create/edit/delete controls
- [ ] Store product price form disabled when `isPriceLocked`
- [ ] Store product availability/price PATCH only with `store_products:update`
- [ ] Inventory adjust: movement types limited to `stock_in`, `stock_out`, `damaged`, `expired`, `correction`
- [ ] Low-stock and out-of-stock indicators on stock list
- [ ] URL query params persist filters on list pages
- [ ] Tenant scope: APIs return only vendor-scoped records (live environment)

## Route verification

| Route | Permission |
|-------|------------|
| `/store-catalog/products` | `catalog:read` |
| `/store-catalog/products/:productId` | `catalog:read` |
| `/store-products` | `store_products:read` |
| `/store-products/:id/price` | `store_products:update` |
| `/store-products/:id/availability` | `store_products:update` |
| `/inventory/stocks` | `inventory:read` |
| `/inventory/stocks/:id/adjust` | `inventory:update` |
| `/inventory/movements` | `inventory:read` |

## Pending

- Customer App catalog UI (module 14)
- Vendor catalog backend routes (contract PLANNED)
- Order picking/packing UI
