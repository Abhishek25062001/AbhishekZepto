# Customer App — Catalog Browsing Improvements

Status: **IMPLEMENTED** (Phase 4 Module 13)

## Module

Phase 4 Module 13 — Customer App Search & Browsing Improvements.

## Goal

Improve customer catalog browse UX: infinite-scroll pagination on category, brand, and search listings; consistent out-of-stock (OOS) and low-stock display; store-aware catalog queries via `storeId` from location context.

## Prerequisites

- Phase 3: Customer catalog read APIs (`/customer/catalog/products`, `/customer/catalog/search`).
- Phase 4 Module 1: `useLocationContext` (`selectedStoreId`, `cityId`).
- Phase 4 Module 4: Quick-add on listing cards (must stay disabled when OOS/unavailable).

## Screens in scope

| Screen | Change |
|--------|--------|
| `CategoryProductsScreen` | Paginated product list, load-more |
| `BrandProductsScreen` | Paginated product list, load-more |
| `CatalogSearchScreen` | Paginated debounced search results, load-more |

## Out of scope

- `CatalogHomeScreen` horizontal sections (featured, recently viewed)
- `CustomerHomeScreen` home feed (`GET /customer/home`)
- Backend API, MongoDB, or search service changes
- Per-variant stock on variant selector (variant DTO has no stock fields)
- Server-side `out_of_stock` filter (backend supports `isAvailable` only)

## API consumption (no new routes)

| Method | Path | Usage |
|--------|------|--------|
| GET | `/api/v1/customer/catalog/products` | Category/brand listings with `page`, `limit`, filters, `storeId`, `cityId` |
| GET | `/api/v1/customer/catalog/search` | Search with `q`, `page`, `limit`, `storeId`, `cityId` |

## Pagination strategy

- Default `limit`: **20** (`CUSTOMER_CATALOG_PAGE_LIMIT`).
- Initial load: `page = 1`.
- On `FlatList` `onEndReached`: fetch next page if `page * limit < total`.
- Merge pages client-side; dedupe by `product.id`.
- Reset to page 1 on: pull-to-refresh, subcategory change, filter apply, debounced search text change.
- Footer: loading spinner while fetching next page; “No more products” when exhausted.

## Store context

- `storeId`: from `useLocationContext().selectedStoreId` when `hasStore`.
- `cityId`: from location store, fallback auth `cityId`.
- Accurate `isOutOfStock` / `isAvailable` / `availableQuantity` requires store context when user has selected a serviceable store.

## OOS and availability UX

### Listing cards (`ProductCard`)

| Condition | UI |
|-----------|-----|
| `isOutOfStock === true` | “Out of stock” badge, dimmed card, no quick-add |
| `isAvailable === false` | “Unavailable” badge, dimmed card, no quick-add |
| In stock | Normal card; quick-add when Module 4 enabled |

### Product detail (`ProductDetailScreen`)

- `AvailabilityBadge` via `getAvailabilityState(isAvailable, isOutOfStock)`.
- Low stock: when `availableQuantity` is not null, `> 0`, and `<= CUSTOMER_CATALOG_LOW_STOCK_THRESHOLD` (5), show “Only X left”.
- `AddToCartButton` disabled when OOS or unavailable.

## Availability filter limitation

Filter UI includes `available`, `out_of_stock`, `all`. Backend list/search parser accepts `isAvailable` boolean only (not `isOutOfStock`). Module 13 maps `available` → `isAvailable=true`. The `out_of_stock` option remains in UI but does not apply a server filter; document in contract — do not add client-only filter across paginated pages.

## Customer app layout

`apps/customer-app/src/modules/catalog/` — hooks, utils, components, screens updated per execution tickets.

## QA

- Customer phone `9999999999`, OTP `123456`
- Select delivery location (Module 1) so `storeId` is set
- Browse category with 20+ products; scroll to load page 2
- Search with 20+ matches; scroll to load more
- Verify OOS product shows badge and no quick-add on listing and detail

## Related

- `docs/contracts/customer-app-catalog-ui-contract.md`
- `docs/testing/customer-app-catalog-browsing-verification.md`
- `docs/architecture/customer-app-catalog-read-foundation.md`
