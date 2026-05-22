# Customer App Home UI Contract

Status: **IMPLEMENTED** — Module 2 (2026-05-19).

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| CustomerHome | `CustomerHome` or `Home` | Shopping entry — aggregated home feed |
| LocationGate | `LocationGate` | Redirect if no `selectedStoreId` (Module 1) |
| CatalogHome | `Catalog` → `CatalogHome` | Deep browse (Phase 3) |

## API Client (`modules/home/api/customer-home.api.ts`)

| Function | HTTP |
|----------|------|
| `getCustomerHomeFeed` | GET `/api/v1/customer/home` |

**Query:** `storeId` (required), `cityId?`, `categoryLimit?`, `featuredLimit?`

## Hook (`modules/home/hooks/useCustomerHome.ts`)

- Enabled when `selectedStoreId` is set
- Query key: `['customer-home', storeId, cityId]`
- Pull-to-refresh via `refetch`

## Components

| Component | Purpose |
|-----------|---------|
| `HomeLocationHeader` | Address label + store name; change location CTA |
| `HomeCategoriesSection` | Horizontal root categories |
| `HomeFeaturedSection` | Horizontal featured products |
| `HomeServiceabilityBanner` | Shown when `serviceability.isServiceable === false` |
| `HomeEmptyState` / `HomeErrorState` | Empty featured/categories or API error |

## Navigation

```text
LocationGate → CustomerHome (when store selected)
CustomerHome → Catalog (Browse all / category / product tap)
CustomerHome → Addresses (change location)
```

## UX Rules

- Block home fetch until `selectedStoreId` set.
- Featured products may show add-to-cart when `variantId` is present — see `customer-app-cart-ui-contract.md`.
- Reuse `CategoryCard`, `ProductCard` from catalog module where possible.
- Dev `HomeScreen` (`screens/main/HomeScreen.tsx`) is not the shopping entry — redirect or dev-only panel.

## Permissions

Customer JWT only; same as other Phase 4 customer routes.
