# Customer Home & Shopping Entry API Contract

Status: **IMPLEMENTED** — Module 2 (2026-05-19).

Authentication: `authenticate` + `CUSTOMER` role.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/customer/home` | Home feed for selected store |

**Decision:** No separate `/shopping-entry` route in Phase 4 MVP — home endpoint covers shopping entry per `AllPhase&Modules.pdf` Module 2 consolidation.

## GET `/api/v1/customer/home`

### Query parameters

| Param | Required | Default | Rule |
|-------|----------|---------|------|
| `storeId` | yes | — | Valid ObjectId |
| `cityId` | no | from store or JWT | Valid ObjectId when provided |
| `categoryLimit` | no | `20` | Integer 1–50 |
| `featuredLimit` | no | `20` | Integer 1–50 |

### Success response (200)

```json
{
  "success": true,
  "message": "Customer home feed fetched successfully",
  "data": {
    "store": {
      "id": "65f0a0000000000000000002",
      "name": "Zepto Dwarka",
      "cityId": "65f0a0000000000000000003",
      "code": "STORE-000001",
      "isOpen": true,
      "isAcceptingOrders": true
    },
    "serviceability": {
      "isServiceable": true,
      "message": null
    },
    "categories": {
      "items": [],
      "pagination": { "page": 1, "limit": 20, "total": 0, "totalPages": 1, "hasNextPage": false, "hasPreviousPage": false }
    },
    "featuredProducts": {
      "items": [],
      "pagination": { "page": 1, "limit": 20, "total": 0, "totalPages": 1, "hasNextPage": false, "hasPreviousPage": false }
    },
    "banners": []
  }
}
```

### Section sources

| Section | Source |
|---------|--------|
| `store` | Phase 3 `stores` |
| `categories` | `listCustomerCategoriesService` (catalog-search) |
| `featuredProducts` | `getCustomerFeaturedProductsService` (catalog-search) |
| `banners` | Placeholder `[]` until campaign module (Phase 9+) |
| `serviceability` | Store operational flags |

### Errors

| Code | HTTP | When |
|------|------|------|
| `VALIDATION_ERROR` | 400 | Missing/invalid `storeId` |
| `STORE_NOT_FOUND` | 404 | Unknown store |
| `STORE_NOT_SERVICEABLE` | 422 | Store not matching customer selection (if enforced) |
| `CATALOG_SEARCH_SCOPE_DENIED` | 403 | `storeId` without `cityId` scope |
| `CATALOG_SEARCH_FAILED` | 500 | Catalog composition failure |

## DB Fields

No dedicated `customer_home` collection in Phase 4 MVP. Optional CMS collection deferred.

## Related

- `docs/contracts/backend-route-registry.md`
- `docs/validation/phase-4-validation-rules.md` — Home section
- `docs/errors/phase-4-error-codes.md`
