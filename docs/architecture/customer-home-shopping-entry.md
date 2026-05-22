# Customer Home & Shopping Entry

## Module

Phase 4 Module 2 — Customer Home & Shopping Entry.

## Goal

Provide a single aggregated **home feed** API and a **shopping-entry screen** in the
customer app so users can browse categories and featured products for their selected store
without multiple round-trips.

## Customer Flow

```text
OTP login
  → LocationGate (if no selectedStoreId)
  → CustomerHomeScreen (GET /customer/home)
  → Tap category/product → Catalog stack (deep browse)
  → "Browse all" → CatalogHomeScreen
```

## PDF Alignment

| PDF / legacy | Repository |
|--------------|------------|
| `GET /customer/shopping-entry` | Merged into `GET /api/v1/customer/home` |
| `customer_home` CMS collection | **Deferred** — compose from Phase 3 + stores |
| Multiple section API calls on app launch | One `GET /customer/home` |

## Home Feed Composition

`GET /api/v1/customer/home` aggregates:

| Section | Source |
|---------|--------|
| `store` | `stores` via `findStoreById` |
| `categories` | `listCustomerCategoriesService` (catalog-search) |
| `featuredProducts` | `getCustomerFeaturedProductsService` (catalog-search) |
| `banners` | `[]` until campaigns module |
| `serviceability` | Derived from store flags (`isOpen`, `isAcceptingOrders`, `status`) |

**Rule:** Do not duplicate Mongo queries from catalog-search repositories inside home module.

## Store Validation

1. `storeId` query param required (ObjectId).
2. Store must exist, `isDeleted=false`, `status=active`.
3. Recommend verifying `storeId` matches `customer_store_selections` row with `isSelected: true` for the customer.
4. If store closed or not accepting orders: `serviceability.isServiceable: false` with message (feed may still return for UX; document in contract).

## CatalogHomeScreen vs CustomerHomeScreen

| Screen | Route | Role |
|--------|-------|------|
| `CustomerHomeScreen` | `Main` → `Home` | Shopping entry — single `GET /customer/home` API |
| `CatalogHomeScreen` | `Main` → `Catalog` → `CatalogHome` | Deep browse — search, brands, filters |

**Responsibilities:**

- Shopping entry (`CustomerHomeScreen`) calls **only** `GET /api/v1/customer/home`.
- `CatalogHomeScreen` keeps separate catalog API calls for full browse; entered via **Browse all** or section taps.
- `screens/main/HomeScreen.tsx` is renamed **`DevHomeScreen`** (dev diagnostics only, route `DevHome`).

Shopping entry does **not** replace catalog in this module.

## App State

Uses Module 1 `useLocationContext`:

- `selectedStoreId`, `cityId` passed as query params to home API
- `useCustomerHome` React Query hook keys on store + city

## API

See `docs/contracts/customer-home-shopping-entry-api.md`, `docs/contracts/customer-app-home-ui-contract.md`.

## DB

No new collection. Read-only: `stores`, catalog entities, optional `customer_store_selections`.

## QA

- Customer: `9999999999`, OTP `123456`
- Seed store: `STORE-000001` (Delhi, `28.5921`, `77.046`)

## Out of Scope

- Cart, add-to-cart on home (Modules 3–4)
- Banner CMS
- Profile, checkout, payment

## Related

- `docs/architecture/customer-location-store-selection.md`
- `docs/architecture/phase-4-module-dependencies.md`
