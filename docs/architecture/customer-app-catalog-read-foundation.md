# Customer App — Catalog Read Foundation

Status: **IMPLEMENTED** (Customer App UI)

## Scope

Authenticated customer read-only catalog browse: categories, brands, products, search, filters, and product detail. No cart/checkout mutations in this module.

## Screen map (6)

| Screen | Purpose |
|--------|---------|
| `CatalogHomeScreen` | Search entry, featured categories/products, brands, recently viewed |
| `CategoryProductsScreen` | Products filtered by category + subcategory chips |
| `BrandProductsScreen` | Products filtered by brand |
| `ProductDetailScreen` | Gallery, pricing, variants, Add to Cart placeholder |
| `CatalogSearchScreen` | Debounced search (min 2 chars) |
| `CatalogFiltersScreen` | Category, brand, food type, availability, sort |

## Navigation

- Stack: `apps/customer-app/src/modules/catalog/navigation/catalog.navigator.tsx`
- Registered on `MainNavigator` as `Catalog` (nested stack)
- Entry: Home → Browse catalog

## Permissions and auth

- Customer authentication required (session restore guard on app root)
- Read-only — no catalog create/update/delete
- See `docs/security/catalog-permissions.md` — Customer App UI matrix

## API wiring

See `docs/contracts/customer-app-catalog-ui-contract.md`.

Customer catalog backend routes are **PLANNED** per `docs/contracts/catalog-customer-api-contract.md`. UI wires to documented paths.

## Visibility rule

Customer APIs (and UI expectations) show only records that are:

- `status` active (entity-specific)
- `approvalStatus = approved` (products)
- `isVisible = true`
- `isDeleted = false`

## cityId and serviceability

- Optional `cityId` query param from `useAuthStore` when present
- `ServiceabilityPlaceholderBanner` when `cityId` is null (informational; browse still allowed)
- Full address/serviceability module deferred

## UX rules

- Search debounce: **300ms**; API call when query length **≥ 2**
- Pull-to-refresh on home, category, brand, detail screens
- Recently viewed: local secure storage, max **10** product IDs
- Add to Cart: disabled placeholder; disabled when `isAvailable === false` or `isOutOfStock === true`

## Out of scope

- Cart/checkout implementation
- Customer address/serviceability module
- Catalog Search & Filtering Foundation backend (module 15)
- Similar products API (placeholder section on detail)
- Admin/vendor surfaces

## Related

- `docs/handoffs/customer-app-authentication-complete.md`
- `docs/testing/customer-app-catalog-verification.md`
