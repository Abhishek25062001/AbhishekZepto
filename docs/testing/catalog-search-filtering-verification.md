# Catalog Search & Filtering Verification

Status: **VERIFIED** (2026-05-18)

## Automated checks

```bash
npm run typecheck -w backend/api
npm run lint -w backend/api
npm run build -w backend/api
npm run test:catalog-search -w backend/api
npm run test:products -w backend/api
npm run test:store-products -w backend/api
npm run test:inventory -w backend/api
npm run test:catalog -w apps/customer-app
npm run test:store-catalog -w apps/vendor-panel
```

## Manual QA checklist

- [ ] Admin `GET /api/v1/admin/catalog/products?search=milk` returns filtered results
- [ ] Admin invalid `maxPrice < minPrice` on customer routes returns `CATALOG_SEARCH_PRICE_RANGE_INVALID`
- [ ] Vendor product list scoped to authenticated `vendorId` / `storeId`
- [ ] Vendor facets return counts inside tenant scope
- [ ] Customer product list returns only approved, visible, active store mappings
- [ ] Customer search requires `q` with min length 2
- [ ] Customer `isAvailable=true` excludes out-of-stock items
- [ ] Customer featured products returns only `isFeatured=true`
- [ ] Unauthenticated customer/vendor/admin catalog calls return 401
- [ ] Admin without `catalog:read` returns 403

## Route verification

| Route | Surface |
|-------|---------|
| `GET /api/v1/admin/catalog/products` | Admin |
| `GET /api/v1/vendor/catalog/products` | Vendor |
| `GET /api/v1/vendor/catalog/facets` | Vendor |
| `GET /api/v1/customer/catalog/products` | Customer |
| `GET /api/v1/customer/catalog/search` | Customer |
| `GET /api/v1/customer/catalog/featured-products` | Customer |
| `GET /api/v1/customer/catalog/facets` | Customer |

## Pending

- Elasticsearch / typo tolerance / synonyms
- Customer categories/brands/detail routes if not mounted elsewhere
