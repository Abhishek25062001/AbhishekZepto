# Phase 3 Customer App — Catalog Read Foundation — CURSOR Execution Tickets

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** Customer App — Catalog Read Foundation  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` pages 319–339  

**Architecture references:**  
`docs/contracts/catalog-customer-api-contract.md`, `docs/architecture/catalog-search-filter-architecture.md`, `docs/architecture/catalog-architecture.md`, `docs/security/catalog-permissions.md`, `docs/errors/catalog-error-codes.md`, `docs/database/catalog-index-plan.md`, `docs/handoffs/customer-app-authentication-complete.md`, `docs/handoffs/vendor-panel-store-catalog-foundation-complete.md`

**Prerequisites (already in repo):**  
Phase 2 Customer App authentication, session restore, React Query, axios `apiClient`, Zustand (`auth.store` with optional `cityId`), secure storage service. Customer catalog read APIs are defined in `docs/contracts/catalog-customer-api-contract.md` (contract status **PLANNED** — UI tickets wire to documented paths; live browse requires backend customer catalog routes to be mounted).

**Out of scope for this module:**  
Catalog Search & Filtering Foundation backend module (module 15), cart/checkout implementation, customer address/serviceability module (city banner is placeholder only), admin/vendor surfaces, `packages/shared` TypeScript files, Repository & Codebase Setup, real Add to Cart API (placeholder button only), Similar Products API (placeholder section).

**Execution order notes:**
- Run **Ticket 1** (docs) before implementation tickets.
- Run **Ticket 3** (API client) before **Tickets 10–16** (hooks).
- Run **Tickets 4–8** (types/constants/store/utils) before screens and components that consume them.
- Run **Ticket 17** (navigation) before **Tickets 23–28** (screens); update **Ticket 29** (MainNavigator integration) after catalog stack exists.
- Run **Tickets 18–22** (shared components) before screens.
- **Read-only** catalog — no create/update/delete; Add to Cart is disabled placeholder with TODO for cart backend.
- Search: debounce **300ms**, minimum query length **2** characters before API call.
- Recently viewed: local storage via existing customer storage service, max **10** IDs, dedupe moves to front.
- Include optional `cityId` from `useAuthStore` on catalog API calls when present; show `ServiceabilityPlaceholderBanner` when missing.
- PDF paths use `__tests__/`; repo convention is co-located `*.test.ts` / `*.test.tsx` under `apps/customer-app/src/modules/catalog/`.
- Product list responses may include store-pricing fields (`mrp`, `finalPrice`, `isOutOfStock`) when backend joins store layer — types must allow optional fields per PDF page 322.

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets **DONE** (2026-05-18)

---

## Ticket 1 — Customer App catalog read foundation docs — DONE

**Status:** DONE

**Ticket:** 1 — Customer App catalog read foundation docs

**Objective:** Document UI scope, screens, navigation, API wiring, and visibility rules (no React Native implementation).

**Files to create/update:**
- `docs/architecture/customer-app-catalog-read-foundation.md` (create)
- `docs/contracts/customer-app-catalog-ui-contract.md` (create)
- `docs/testing/customer-app-catalog-verification.md` (create)
- `docs/security/catalog-permissions.md` — add Customer App browse note (customer auth required; read-only)

**API endpoints:** Document consumer usage only (PDF page 338):
- `GET /api/v1/customer/catalog/categories`
- `GET /api/v1/customer/catalog/brands`
- `GET /api/v1/customer/catalog/products`
- `GET /api/v1/customer/catalog/products/:productId`
- `GET /api/v1/customer/catalog/search`
- `GET /api/v1/customer/catalog/featured-products`
- `GET /api/v1/customer/catalog/products/:productId/variants`

**DB fields:** Document fields per PDF pages 338–339: `categories.*`, `brands.*`, `products.*`, `product_variants.*`, optional `store_products.*`, `inventory_stocks.isOutOfStock` when joined.

**Implementation steps:**
1. Screen map (6): `CatalogHomeScreen`, `CategoryProductsScreen`, `BrandProductsScreen`, `ProductDetailScreen`, `CatalogSearchScreen`, `CatalogFiltersScreen`.
2. Visibility rule: only active, approved, visible, non-deleted catalog records (per customer contract).
3. cityId query param placeholder; serviceability finalized in address module later.
4. Manual QA checklist (auth guard, browse, search, filters, out-of-stock UX, pull-to-refresh).
5. Note pending: Catalog Search & Filtering backend (module 15), cart/checkout.

**Acceptance criteria:**
- Docs match PDF micro-tasks; no new `apps/customer-app` catalog code.

**Test commands:**
- `test -f docs/architecture/customer-app-catalog-read-foundation.md && test -f docs/contracts/customer-app-catalog-ui-contract.md && echo PASS`

**Depends on:** Vendor Panel — Store Catalog Foundation complete.

---

## Ticket 2 — Catalog module scaffold — DONE

**Status:** DONE

**Ticket:** 2 — Catalog module scaffold

**Objective:** Create `apps/customer-app/src/modules/catalog/` folder layout per PDF.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/api/` (create)
- `apps/customer-app/src/modules/catalog/components/` (create)
- `apps/customer-app/src/modules/catalog/hooks/` (create)
- `apps/customer-app/src/modules/catalog/screens/` (create)
- `apps/customer-app/src/modules/catalog/types/` (create)
- `apps/customer-app/src/modules/catalog/utils/` (create)
- `apps/customer-app/src/modules/catalog/constants/` (create)
- `apps/customer-app/src/modules/catalog/store/` (create)
- `apps/customer-app/src/modules/catalog/navigation/` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Create empty folder tree only.
2. No screens, hooks, or API methods yet.

**Acceptance criteria:**
- Folder tree exists; `npm run typecheck -w apps/customer-app` unaffected.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Ticket 1.

---

## Ticket 3 — Customer catalog API client — DONE

**Ticket:** 3 — Customer catalog API client

**Objective:** Axios read-only client for all customer catalog endpoints.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/api/customer-catalog.api.ts` (create)
- `apps/customer-app/src/modules/catalog/utils/customer-catalog-api.util.ts` (create — unwrap helpers)

**API endpoints:**
- `GET /api/v1/customer/catalog/categories`
- `GET /api/v1/customer/catalog/brands`
- `GET /api/v1/customer/catalog/products`
- `GET /api/v1/customer/catalog/products/:productId`
- `GET /api/v1/customer/catalog/search`
- `GET /api/v1/customer/catalog/featured-products`
- `GET /api/v1/customer/catalog/products/:productId/variants`

**DB fields:** None (transport only).

**Implementation steps:**
1. Methods: `getCustomerCategories`, `getCustomerBrands`, `getCustomerProducts`, `getCustomerProductById`, `searchCustomerCatalog`, `getCustomerFeaturedProducts`, `getCustomerProductVariants`.
2. List/search query params: `page`, `limit`, `search`, `categoryId`, `subcategoryId`, `brandId`, `foodType`, `isFeatured`, `sortBy`, `sortOrder`, optional `cityId`.
3. Append `cityId` from auth store when provided (helper accepts optional scope).
4. Unwrap `{ success, data, meta }` pagination per `apps/customer-app/src/types/api.types.ts`.

**Acceptance criteria:**
- All 7 read methods typed; no write methods.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Ticket 2.

---

## Ticket 4 — Customer category and brand types — DONE

**Ticket:** 4 — Customer category and brand types

**Objective:** TypeScript types for customer category and brand API responses.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/types/customer-category.types.ts` (create)
- `apps/customer-app/src/modules/catalog/types/customer-brand.types.ts` (create)

**API endpoints:** None (types only).

**DB fields:**
- `categories`: `id`, `name`, `slug`, `description`, `parentCategoryId`, `level`, `displayOrder`, `iconUrl`, `bannerUrl`, `isFeatured`, `isVisible`, `status`
- `brands`: `id`, `name`, `slug`, `description`, `logoUrl`, `bannerUrl`, `isFeatured`, `isVisible`, `status`

**Implementation steps:**
1. Response types per PDF page 321.
2. No mutation payload types.

**Acceptance criteria:**
- Types cover category/brand card display fields.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Ticket 3.

---

## Ticket 5 — Customer product, variant, and query types — DONE

**Ticket:** 5 — Customer product, variant, and query types

**Objective:** TypeScript types for products, variants, list queries, and optional store-pricing join fields.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/types/customer-product.types.ts` (create)
- `apps/customer-app/src/modules/catalog/types/customer-product-variant.types.ts` (create)
- `apps/customer-app/src/modules/catalog/types/customer-catalog-query.types.ts` (create)

**API endpoints:** None (types only).

**DB fields:**
- Product: `id`, `name`, `slug`, `description`, `shortDescription`, `categoryId`, `subcategoryId`, `brandId`, `productType`, `foodType`, `taxCategoryId`, `hsnCode`, `searchKeywords`, `tags`, `defaultImageUrl`, `imageUrls`, `attributeSummary`, `isFeatured`, `isVisible`, `approvalStatus`, `status`
- Optional pricing/availability join (PDF page 322): `storeProductId`, `variantId`, `mrp`, `sellingPrice`, `discountType`, `discountValue`, `finalPrice`, `isAvailable`, `isOutOfStock`, `availableQuantity`
- Variant: `id`, `productId`, `variantName`, `sku`, `barcode`, `unit`, `unitValue`, `mrp`, `defaultSellingPrice`, `weightInGrams`, dimensions, `imageUrl`, `attributeValues`, `isDefault`, `isVisible`, `status`
- Query: `page`, `limit`, `search`, `categoryId`, `subcategoryId`, `brandId`, `foodType`, `availability`, `isFeatured`, `sortBy`, `sortOrder`, optional `cityId`

**Implementation steps:**
1. `CustomerCatalogListQuery` shared across products/search/featured.
2. Document optional fields may be absent until store-layer join is live on backend.

**Acceptance criteria:**
- Types align with PDF and customer API contract.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Ticket 3.

---

## Ticket 6 — Customer catalog constants — DONE

**Ticket:** 6 — Customer catalog constants

**Objective:** Sort options, food type filters, and availability filter values for UI.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/constants/customer-catalog.constants.ts` (create)

**API endpoints:** None.

**DB fields:** Enum values for `sortBy`, `foodType`, availability filter tokens.

**Implementation steps:**
1. Sort options: `relevance`, `price_low_to_high`, `price_high_to_low`, `newest`, `featured`.
2. Food type: `veg`, `non_veg`, `egg`, `not_applicable`.
3. Availability filter: `available`, `out_of_stock`, `all`.
4. Export label maps for filter screen and badges.

**Acceptance criteria:**
- Constants match PDF page 323.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Ticket 5.

---

## Ticket 7 — Catalog filter Zustand store — DONE

**Ticket:** 7 — Catalog filter Zustand store

**Objective:** Client-side catalog filter state for filter screen and list hooks.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/store/catalog-filter.store.ts` (create)

**API endpoints:** None.

**DB fields:** Filter keys: `categoryId`, `subcategoryId`, `brandId`, `foodType`, `availability`, `sortBy`, `search`.

**Implementation steps:**
1. State shape for selected filters per PDF page 324.
2. Actions: `setCatalogFilter(key, value)`, `resetCatalogFilters()`.
3. Optional selector to build `CustomerCatalogListQuery` via `buildCatalogQuery` util (Ticket 8).

**Acceptance criteria:**
- Store resets cleanly; no persistence required beyond session.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Ticket 5.

---

## Ticket 8 — Catalog query and price utilities — DONE

**Ticket:** 8 — Catalog query and price utilities

**Objective:** Build API query objects from filters; format prices and calculate discount.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/utils/catalog-query.util.ts` (create)
- `apps/customer-app/src/modules/catalog/utils/catalog-price.util.ts` (create)

**API endpoints:** None (client utilities).

**DB fields:** Uses `mrp`, `finalPrice` for display helpers.

**Implementation steps:**
1. `buildCatalogQuery(filters)` — omit empty/undefined params (PDF page 334).
2. `formatProductPrice(finalPrice, mrp)` — currency formatting consistent with app theme.
3. `calculateDiscountPercentage(mrp, finalPrice)` — return 0 when `mrp <= finalPrice` (PDF page 334).

**Acceptance criteria:**
- Unit-testable pure functions.

**Test commands:**
- See Ticket 26 `test:catalog` (price/query util tests)

**Depends on:** Tickets 6–7.

---

## Ticket 9 — Image, error, and recently-viewed utilities — DONE

**Ticket:** 9 — Image, error, and recently-viewed utilities

**Objective:** Product image resolution, API error mapping, and recently-viewed local persistence.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/utils/catalog-image.util.ts` (create)
- `apps/customer-app/src/modules/catalog/utils/customer-catalog-error-message.util.ts` (create)
- `apps/customer-app/src/modules/catalog/utils/recently-viewed-products.util.ts` (create)

**API endpoints:** None.

**DB fields:** Uses `products.defaultImageUrl`, `products.imageUrls`.

**Implementation steps:**
1. `getProductImage(product)` — prefer `defaultImageUrl`, then first `imageUrls[]`, then local fallback asset placeholder (PDF page 334).
2. Map errors: `PRODUCT_NOT_FOUND`, `PRODUCT_NOT_APPROVED`, `PRODUCT_NOT_VISIBLE`, `CATEGORY_NOT_FOUND`, `BRAND_NOT_FOUND`, `VARIANT_NOT_FOUND`; fallback: "Something went wrong. Please try again." (PDF page 333).
3. `addRecentlyViewedProduct(productId)`, `getRecentlyViewedProductIds()` using `services/storage/secure-storage.service.ts` or async storage pattern from app; max 10, dedupe to front (PDF page 334).

**Acceptance criteria:**
- Recently-viewed util has unit tests; error mapper covers PDF codes.

**Test commands:**
- See Ticket 26

**Depends on:** Ticket 5.

---

## Ticket 10 — Customer categories and brands hooks — DONE

**Ticket:** 10 — Customer categories and brands hooks

**Objective:** React Query hooks for categories and brands with root/subcategory filtering.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/hooks/useCustomerCategories.ts` (create)
- `apps/customer-app/src/modules/catalog/hooks/useCustomerBrands.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/catalog/categories`
- `GET /api/v1/customer/catalog/brands`

**DB fields:** `categories.*`, `brands.*`

**Implementation steps:**
1. `useCustomerCategories` — filter roots where `parentCategoryId = null` and `level = 1` in hook selector (PDF page 324); expose subcategories by `parentCategoryId`.
2. `useCustomerBrands` — full brand list for home and filters.
3. Include optional `cityId` from auth store in query key and request.

**Acceptance criteria:**
- Hooks usable by home and filter screens.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Tickets 3–4, 8.

---

## Ticket 11 — Customer products and product detail hooks — DONE

**Ticket:** 11 — Customer products and product detail hooks

**Objective:** React Query hooks for product list (filtered) and product detail.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/hooks/useCustomerProducts.ts` (create)
- `apps/customer-app/src/modules/catalog/hooks/useCustomerProductDetail.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/catalog/products`
- `GET /api/v1/customer/catalog/products/:productId`

**DB fields:** `products.*`, optional pricing join fields.

**Implementation steps:**
1. `useCustomerProducts(query)` — supports pagination metadata for infinite scroll.
2. `useCustomerProductDetail(productId)` — enabled when id present.
3. Merge `catalog-filter.store` filters via `buildCatalogQuery` when used from list screens.

**Acceptance criteria:**
- List hook supports `categoryId`, `brandId`, and filter store params.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Tickets 5, 7–8, 10.

---

## Ticket 12 — Customer search and featured hooks — DONE

**Ticket:** 12 — Customer search and featured hooks

**Objective:** Debounced search hook and featured products hook.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/hooks/useCustomerCatalogSearch.ts` (create)
- `apps/customer-app/src/modules/catalog/hooks/useCustomerFeaturedProducts.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/catalog/search`
- `GET /api/v1/customer/catalog/featured-products`

**DB fields:** Search results use product fields; featured uses `products.isFeatured`.

**Implementation steps:**
1. `useCustomerCatalogSearch` — debounce **300ms**; only fetch when `search.length >= 2` (PDF page 328).
2. `useCustomerFeaturedProducts` — for home screen featured section.

**Acceptance criteria:**
- Search does not call API before 2 characters.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Tickets 3, 5, 8.

---

## Ticket 13 — Customer product variants hook — DONE

**Ticket:** 13 — Customer product variants hook

**Objective:** React Query hook for product variants on detail screen.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/hooks/useCustomerProductVariants.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/catalog/products/:productId/variants`

**DB fields:** `product_variants.*`

**Implementation steps:**
1. Hook enabled when `productId` provided.
2. Used by `ProductVariantSelector` on detail screen.

**Acceptance criteria:**
- Variants load in parallel with product detail.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Tickets 3, 5.

---

## Ticket 14 — Catalog navigation stack — DONE

**Ticket:** 14 — Catalog navigation stack

**Objective:** Define catalog stack navigator with six screens; protect with existing auth/session guard.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/navigation/catalog.navigator.tsx` (create)
- `apps/customer-app/src/modules/catalog/navigation/catalog-navigation.types.ts` (create — param lists)

**API endpoints:** None (navigation only).

**DB fields:** None.

**Implementation steps:**
1. Stack screens: `CatalogHome`, `CategoryProducts`, `BrandProducts`, `ProductDetail`, `CatalogSearch`, `CatalogFilters` (PDF page 326).
2. Param types: `categoryId`, `categoryName`, `brandId`, `brandName`, `productId`.
3. Register only inside authenticated app flow (parent already uses session restore guard).

**Acceptance criteria:**
- Navigator compiles; screens can be stubbed then filled in later tickets.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Ticket 2.

---

## Ticket 15 — Search bar and category or brand cards — DONE

**Ticket:** 15 — Search bar and category or brand cards

**Objective:** CustomerSearchBar, CategoryCard, BrandCard components.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/components/CustomerSearchBar.tsx` (create)
- `apps/customer-app/src/modules/catalog/components/CategoryCard.tsx` (create)
- `apps/customer-app/src/modules/catalog/components/BrandCard.tsx` (create)

**API endpoints:** None (presentation).

**DB fields:**
- Category card: `categories.name`, `iconUrl`, `bannerUrl`
- Brand card: `brands.name`, `brands.logoUrl`

**Implementation steps:**
1. `CustomerSearchBar` props: `value`, `onChangeText`, `onSubmit`, `placeholder`, `autoFocus` (PDF page 329).
2. `CategoryCard` — press navigates to `CategoryProducts` with `categoryId`.
3. `BrandCard` — press navigates to `BrandProducts` with `brandId`.

**Acceptance criteria:**
- Components render in isolation (Storybook not required).

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Tickets 4, 14.

---

## Ticket 16 — Product card and product grid — DONE

**Ticket:** 16 — Product card and product grid

**Objective:** ProductCard and ProductGrid with discount/out-of-stock badges and navigation.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/components/ProductCard.tsx` (create)
- `apps/customer-app/src/modules/catalog/components/ProductGrid.tsx` (create)

**API endpoints:** None.

**DB fields:** `products.defaultImageUrl`, `products.name`, `products.foodType`, `store_products.mrp`, `store_products.finalPrice`, `inventory_stocks.isOutOfStock`.

**Implementation steps:**
1. `ProductCard` — show discount badge when `finalPrice < mrp`; out-of-stock badge when `isOutOfStock === true` (PDF page 330).
2. Press navigates to `ProductDetail` with `productId`.
3. `ProductGrid` — `FlatList`, two-column layout, infinite scroll via `onEndReached` + pagination meta, pull-to-refresh support (PDF page 330).

**Acceptance criteria:**
- Grid reusable on category, brand, search result screens.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Tickets 8–9, 15.

---

## Ticket 17 — Product detail display components — DONE

**Ticket:** 17 — Product detail display components

**Objective:** Image gallery, price block, variant selector, and food/availability badges.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/components/ProductImageGallery.tsx` (create)
- `apps/customer-app/src/modules/catalog/components/ProductPriceBlock.tsx` (create)
- `apps/customer-app/src/modules/catalog/components/ProductVariantSelector.tsx` (create)
- `apps/customer-app/src/modules/catalog/components/FoodTypeBadge.tsx` (create)
- `apps/customer-app/src/modules/catalog/components/AvailabilityBadge.tsx` (create)

**API endpoints:**
- Variants: `GET /api/v1/customer/catalog/products/:productId/variants`

**DB fields:** Gallery: `imageUrls`, `defaultImageUrl`; price: `mrp`, `sellingPrice`, `finalPrice`; variant: `variantName`, `unit`, `unitValue`, `mrp`; badges: `foodType`, `isAvailable`, `isOutOfStock`.

**Implementation steps:**
1. `ProductImageGallery` — loading state, broken URL fallback (PDF page 335).
2. `ProductPriceBlock` — strike-through MRP when final < mrp (PDF page 331).
3. `ProductVariantSelector` — local selected variant state; fields per PDF.
4. `FoodTypeBadge` — `veg`, `non_veg`, `egg`, `not_applicable`; `AvailabilityBadge` — `available`, `out_of_stock`, `unavailable`.

**Acceptance criteria:**
- Components compose on detail screen (Ticket 24).

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Tickets 8–9, 13.

---

## Ticket 18 — Catalog layout and state components — DONE

**Ticket:** 18 — Catalog layout and state components

**Objective:** Section header, horizontal list, skeletons, empty and error states.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/components/CatalogSectionHeader.tsx` (create)
- `apps/customer-app/src/modules/catalog/components/CatalogHorizontalList.tsx` (create)
- `apps/customer-app/src/modules/catalog/components/CatalogListSkeleton.tsx` (create)
- `apps/customer-app/src/modules/catalog/components/ProductGridSkeleton.tsx` (create)
- `apps/customer-app/src/modules/catalog/components/CatalogEmptyState.tsx` (create)
- `apps/customer-app/src/modules/catalog/components/CatalogErrorState.tsx` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. `CatalogSectionHeader` — `title`, `subtitle`, `actionLabel`, `onActionPress` (PDF page 332).
2. `CatalogHorizontalList` — horizontal lists for categories/brands on home.
3. Skeletons for list/grid loading states.
4. `CatalogEmptyState` variants: `no_categories`, `no_products`, `no_search_results`, `no_brands` (PDF page 332).
5. `CatalogErrorState` — `onRetry` callback (PDF page 333).

**Acceptance criteria:**
- Empty/error used on all list screens.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Ticket 15.

---

## Ticket 19 — Serviceability banner and recently viewed components — DONE

**Ticket:** 19 — Serviceability banner and recently viewed components

**Objective:** City/serviceability placeholder banner and recently viewed products section.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/components/ServiceabilityPlaceholderBanner.tsx` (create)
- `apps/customer-app/src/modules/catalog/components/RecentlyViewedProducts.tsx` (create)

**API endpoints:**
- Recently viewed detail fetch: `GET /api/v1/customer/catalog/products/:productId` per ID (or batch if backend supports)

**DB fields:** None (banner); products for recently viewed cards.

**Implementation steps:**
1. `ServiceabilityPlaceholderBanner` — visible when `useAuthStore.cityId` is null (PDF page 335).
2. `RecentlyViewedProducts` — load IDs from util; fetch/display product cards; used on `CatalogHomeScreen` (PDF page 334–335).

**Acceptance criteria:**
- Banner does not block catalog browse when cityId absent (informational only).

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Tickets 9, 11, 16.

---

## Ticket 20 — Catalog home screen — DONE

**Ticket:** 20 — Catalog home screen

**Objective:** CatalogHomeScreen with search bar, categories, featured products, brands, recently viewed placeholder.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/screens/CatalogHomeScreen.tsx` (create)

**API endpoints:**
- `GET /api/v1/customer/catalog/categories`
- `GET /api/v1/customer/catalog/featured-products`
- `GET /api/v1/customer/catalog/brands`

**DB fields:** Home sections per PDF page 326: categories, featured products, brands.

**Implementation steps:**
1. Sections: Search Bar (navigate to search on submit/focus), Featured Categories, Featured Products, Browse by Brand, Recently Viewed (via Ticket 19 component).
2. Pull-to-refresh reloads all sections (PDF page 335).
3. Wire `ServiceabilityPlaceholderBanner`.
4. Loading/error/empty per section.

**Acceptance criteria:**
- Home screen registered in catalog navigator.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Tickets 10–12, 14–19.

---

## Ticket 21 — Category and brand product screens — DONE

**Ticket:** 21 — Category and brand product screens

**Objective:** CategoryProductsScreen and BrandProductsScreen with filters and product grids.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/screens/CategoryProductsScreen.tsx` (create)
- `apps/customer-app/src/modules/catalog/screens/BrandProductsScreen.tsx` (create)

**API endpoints:**
- `GET /api/v1/customer/catalog/products?categoryId=:categoryId`
- `GET /api/v1/customer/catalog/products?brandId=:brandId`
- `GET /api/v1/customer/catalog/categories` (subcategory horizontal filter)

**DB fields:** List displays product fields; brand screen shows brand name, logo, product count from pagination meta.

**Implementation steps:**
1. `CategoryProductsScreen` — subcategory horizontal filter (`parentCategoryId = categoryId`); sort button → `CatalogFilters`; product grid with count from API pagination (PDF page 327).
2. `BrandProductsScreen` — brand header + product grid (PDF page 327).
3. Pull-to-refresh on both (PDF page 335).

**Acceptance criteria:**
- Navigation params drive API filters.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Tickets 11, 16–18, 20.

---

## Ticket 22 — Product detail screen — DONE

**Ticket:** 22 — Product detail screen

**Objective:** ProductDetailScreen with gallery, pricing, variants, Add to Cart placeholder, unavailable state.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/screens/ProductDetailScreen.tsx` (create)

**API endpoints:**
- `GET /api/v1/customer/catalog/products/:productId`
- `GET /api/v1/customer/catalog/products/:productId/variants`

**DB fields:** Full product + pricing fields per PDF pages 327–328; sections: Image Gallery, Name, Price, Variant Selector, Description, Product Information, Similar Products placeholder.

**Implementation steps:**
1. On successful load call `addRecentlyViewedProduct(productId)`.
2. Disable Add to Cart when `isAvailable === false` OR `isOutOfStock === true` (PDF page 328).
3. Placeholder button "Add to Cart" with TODO comment for cart backend integration.
4. Unavailable state for `PRODUCT_NOT_FOUND`, `PRODUCT_NOT_VISIBLE`, `PRODUCT_NOT_APPROVED` (PDF page 335).
5. Pull-to-refresh reloads detail + variants.

**Acceptance criteria:**
- No cart API calls; button disabled states correct.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Tickets 9, 11, 13, 17, 19.

---

## Ticket 23 — Catalog search and filters screens — DONE

**Ticket:** 23 — Catalog search and filters screens

**Objective:** CatalogSearchScreen and CatalogFiltersScreen.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/screens/CatalogSearchScreen.tsx` (create)
- `apps/customer-app/src/modules/catalog/screens/CatalogFiltersScreen.tsx` (create)

**API endpoints:**
- `GET /api/v1/customer/catalog/search`
- Filter apply affects `GET /api/v1/customer/catalog/products` via store

**DB fields:** None (UI state).

**Implementation steps:**
1. `CatalogSearchScreen` — popular categories before typing; results after 2 chars; empty/loading states (PDF page 328).
2. `CatalogFiltersScreen` — controls: Category, Subcategory, Brand, Food Type, Availability, Sort By; save to `catalog-filter.store`; Apply and Clear buttons (PDF page 329).

**Acceptance criteria:**
- Apply navigates back and refreshes product lists with filters.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Tickets 7, 12, 15–18.

---

## Ticket 24 — MainNavigator catalog integration — DONE

**Ticket:** 24 — MainNavigator catalog integration

**Objective:** Register catalog stack in main app navigation; expose entry from HomeScreen.

**Files to create/update:**
- `apps/customer-app/src/app/navigation.types.ts` (update — add `Catalog` stack or catalog screen params)
- `apps/customer-app/src/app/MainNavigator.tsx` (update — register `CatalogNavigator` screen)
- `apps/customer-app/src/screens/main/HomeScreen.tsx` (update — link/button to open catalog)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Add `Catalog` route to `MainStackParamList` wrapping `CatalogNavigator`.
2. Home screen CTA: "Browse catalog" → navigate to catalog home.
3. Catalog stack remains behind existing auth/session restore guard.

**Acceptance criteria:**
- Authenticated users can open catalog flow from home.

**Test commands:**
- `npm run typecheck -w apps/customer-app`

**Depends on:** Tickets 14, 20–23.

---

## Ticket 25 — Utility unit tests — DONE

**Ticket:** 25 — Utility unit tests

**Objective:** Unit tests for price, query, and recently-viewed utilities.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/utils/catalog-price.util.test.ts` (create)
- `apps/customer-app/src/modules/catalog/utils/catalog-query.util.test.ts` (create)
- `apps/customer-app/src/modules/catalog/utils/recently-viewed-products.util.test.ts` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Price util — discount 0 when mrp <= finalPrice; formatting smoke test.
2. Query util — empty filters omitted from output.
3. Recently viewed — save, limit 10, dedupe moves to latest position (PDF page 337).

**Acceptance criteria:**
- All utility tests pass under `test:catalog`.

**Test commands:**
- See Ticket 30

**Depends on:** Tickets 8–9.

---

## Ticket 26 — Component unit tests — DONE

**Ticket:** 26 — Component unit tests

**Objective:** Unit tests for ProductCard and ProductPriceBlock.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/components/product-card.test.tsx` (create)
- `apps/customer-app/src/modules/catalog/components/product-price-block.test.tsx` (create)

**API endpoints:** None (mock product data).

**DB fields:** None.

**Implementation steps:**
1. ProductCard — discount badge when final < mrp; out-of-stock badge; press navigates with productId (PDF page 337).
2. ProductPriceBlock — displays final price; strikes MRP when lower (PDF page 337).

**Acceptance criteria:**
- Component tests pass under `test:catalog`.

**Test commands:**
- See Ticket 30

**Depends on:** Tickets 16–17.

---

## Ticket 27 — Screen unit tests (home, category, brand, detail) — DONE

**Ticket:** 27 — Screen unit tests (home, category, brand, detail)

**Objective:** Co-located tests for catalog home, category products, brand products, and product detail screens.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/screens/catalog-home-screen.test.tsx` (create)
- `apps/customer-app/src/modules/catalog/screens/category-products-screen.test.tsx` (create)
- `apps/customer-app/src/modules/catalog/screens/brand-products-screen.test.tsx` (create)
- `apps/customer-app/src/modules/catalog/screens/product-detail-screen.test.tsx` (create)

**API endpoints:** Mock customer catalog endpoints per PDF page 336.

**DB fields:** None.

**Implementation steps:**
1. Home — calls categories, featured, brands; renders category and featured cards (PDF page 336).
2. Category — calls products with categoryId; renders grid; empty shows CatalogEmptyState.
3. Brand — calls products with brandId; renders grid.
4. Detail — calls product by id; shows name/price; Add to Cart disabled when out of stock; unavailable error state (PDF page 336).

**Acceptance criteria:**
- Tests use React Native Testing Library or hook/API mocks per existing customer-app patterns.

**Test commands:**
- See Ticket 30

**Depends on:** Tickets 20–22.

---

## Ticket 28 — Screen unit tests (search and filters) — DONE

**Ticket:** 28 — Screen unit tests (search and filters)

**Objective:** Tests for search screen (min length) and filters screen (store reset).

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/screens/catalog-search-screen.test.tsx` (create)
- `apps/customer-app/src/modules/catalog/screens/catalog-filters-screen.test.tsx` (create)

**API endpoints:**
- `GET /api/v1/customer/catalog/search`

**DB fields:** None.

**Implementation steps:**
1. Search — no API before 2 characters; calls search endpoint when query valid; empty state (PDF pages 336–337).
2. Filters — saves category filter; clear resets store (PDF page 337).

**Acceptance criteria:**
- Tests pass under `test:catalog`.

**Test commands:**
- See Ticket 30

**Depends on:** Tickets 23, 7.

---

## Ticket 29 — Quality gates and npm test entrypoint — DONE

**Ticket:** 29 — Quality gates and npm test entrypoint

**Objective:** Add `test:catalog` script; run customer-app quality gates.

**Files to create/update:**
- `apps/customer-app/package.json` — add `test:catalog`
- `apps/customer-app/tsconfig.catalog-test.json` (create — mirror vendor-panel `tsconfig.store-catalog-test.json` pattern)
- `.gitignore` (update — `dist-catalog-test/` if needed)
- `apps/customer-app/eslint.config.mjs` (update — ignore `dist-catalog-test/**` if needed)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. `test:catalog` — compile catalog tests then `node --test` on output.
2. Regression: `test:access-control-smoke` unchanged.

**Acceptance criteria:**
- `npm run typecheck`, `lint`, `build`, `test:catalog`, `test:access-control-smoke` pass in `apps/customer-app`.

**Test commands:**
- `npm run typecheck -w apps/customer-app`
- `npm run lint -w apps/customer-app`
- `npm run build -w apps/customer-app`
- `npm run test:catalog -w apps/customer-app`
- `npm run test:access-control-smoke -w apps/customer-app`

**Depends on:** Tickets 25–28.

---

## Ticket 30 — Module review, handoff, and project-context closeout — DONE

**Ticket:** 30 — Module review, handoff, and project-context closeout

**Objective:** Close Customer App Catalog Read Foundation with verification doc and progress updates.

**Files to create/update:**
- `docs/reviews/customer-app-catalog-read-foundation-review.md` (create)
- `docs/handoffs/customer-app-catalog-read-foundation-complete.md` (create)
- `docs/reviews/phase-3-customer-app-catalog-read-foundation-execution-tickets.md` — mark all tickets DONE
- `project-context/CURRENT_PROGRESS.md` (update)
- `project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md` (update)
- `docs/testing/customer-app-catalog-verification.md` — mark steps verified

**API endpoints:** Verify all 7 consumer endpoints (PDF page 338) and variants path.

**DB fields:** Verify display fields per PDF pages 338–339; visibility rule documented.

**Implementation steps:**
1. Verification table: 6 screens, read-only browse, search min length, filter store, out-of-stock UX, Add to Cart placeholder.
2. Note pending: Catalog Search & Filtering backend (module 15), cart, address serviceability.
3. Set next module: **Catalog Search & Filtering Foundation** (module 15).

**Acceptance criteria:**
- Handoff marks module complete for static/code verification.
- Tracker all DONE.

**Test commands:**
- All commands from Ticket 29

**Depends on:** Ticket 29.

---

## Dependency graph (summary)

```text
1 → 2 → 3 → 4,5 → 6,7 → 8,9
3,4 → 10 | 5,7,8 → 11 | 3,5,8 → 12 | 3,5 → 13
2 → 14
4,14 → 15 → 16 → 17 → 18 → 19
10–13,14–19 → 20 → 21,22,23 → 24
8,9 → 25 | 16,17 → 26 | 20–23 → 27,28
25–28 → 29 → 30
```

**Critical path:** 1 → 2 → 3 → 5 → 11 → 16 → 20 → 27 → 29 → 30  
(Parallel: 4 types; 10–13 hooks; 21–23 screens; 28 search/filter tests)

**Cross-module order:** Vendor Panel Store Catalog Foundation (module 13) complete; customer catalog backend routes should be mounted for live E2E. This module before Catalog Search & Filtering Foundation (module 15).
