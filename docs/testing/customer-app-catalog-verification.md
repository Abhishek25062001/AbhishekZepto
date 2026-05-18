# Customer App Catalog Verification

Status: **VERIFIED** (static/code — 2026-05-18)

## Automated checks

```bash
npm run typecheck -w apps/customer-app
npm run lint -w apps/customer-app
npm run build -w apps/customer-app
npm run test:catalog -w apps/customer-app
npm run test:access-control-smoke -w apps/customer-app
```

## Manual QA checklist

- [ ] Authenticated customer can open Catalog from Home
- [ ] Catalog home loads categories, featured products, brands
- [ ] Category products screen filters by `categoryId`; subcategory chips work
- [ ] Brand products screen filters by `brandId`
- [ ] Product detail shows gallery, price, variants; recently viewed updated
- [ ] Search: no API call before 2 characters; debounced search works
- [ ] Filters screen applies/clears `catalog-filter.store`
- [ ] Out-of-stock / unavailable: badges and disabled Add to Cart
- [ ] Serviceability banner when `cityId` is null
- [ ] Pull-to-refresh on home, category, brand, detail
- [ ] No create/edit/delete catalog controls

## Route verification

| Route (catalog stack) | Auth |
|-----------------------|------|
| `CatalogHome` | Customer session |
| `CategoryProducts` | Customer session |
| `BrandProducts` | Customer session |
| `ProductDetail` | Customer session |
| `CatalogSearch` | Customer session |
| `CatalogFilters` | Customer session |

## Pending

- Customer catalog backend routes (contract PLANNED)
- Catalog Search & Filtering Foundation (module 15)
- Cart/checkout module
- Address/serviceability module
