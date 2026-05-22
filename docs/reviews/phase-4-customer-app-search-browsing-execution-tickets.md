# Phase 4 Customer App Search & Browsing Improvements — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 13 — Customer App Search & Browsing Improvements  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Module 13 tasks, pages 62–64)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Module 13 micro-tasks, pages 28–30)

**Architecture references (Module 0–12):**  
`docs/architecture/phase-4-customer-shopping-architecture.md`, `docs/architecture/phase-4-module-dependencies.md`, `docs/architecture/phase-4-customer-app-file-structure.md`, `docs/architecture/customer-app-catalog-read-foundation.md`, `docs/architecture/catalog-search-filter-architecture.md`, `docs/contracts/customer-app-catalog-ui-contract.md`, `docs/contracts/catalog-customer-api-contract.md`, `docs/handoffs/phase-4-basic-customer-profile-complete.md`, `docs/reviews/phase-4-customer-app-cart-experience-execution-tickets.md` (deferred pagination/OOS to Module 13)

**Prerequisites:**  
Phase 3 **Customer catalog read** (list/search/detail APIs); Phase 4 **Module 1** (`useLocationContext` / `selectedStoreId`); **Module 4** (quick-add on listing cards — respect OOS when polishing).

**PDF vs Module 0 alignment (implement using existing contracts):**

| PDF / legacy | Implementation |
|--------------|----------------|
| Search pagination | Infinite scroll on `CatalogSearchScreen` via existing `GET /customer/catalog/search` `page`/`limit` |
| Category / brand browse pagination | Infinite scroll on `CategoryProductsScreen`, `BrandProductsScreen` via `GET /customer/catalog/products` |
| Out-of-stock states | Consistent badges, dimmed cards, disabled quick-add, detail messaging using `isOutOfStock`, `isAvailable`, `availableQuantity` |
| Store-aware browse | Pass `storeId` from `useLocationContext` into catalog list/search queries (backend already accepts `storeId`) |
| Home featured carousel | **Out of scope** — home feed is `GET /customer/home` (Module 2); not paginated in Module 13 |
| Backend API / DB | **None** — consume Phase 3 catalog APIs only |
| New search engine / facets API | **Out of scope** |

**Out of scope for this module:**
- Backend routes, validators, MongoDB, or catalog search service changes
- `CatalogHomeScreen` featured/recently-viewed pagination (horizontal sections; no list API change)
- `CustomerHomeScreen` home API pagination
- Cart, checkout, payment, orders, profile (Modules 3–12)
- Promotions, coupons, similar-products API
- Per-variant OOS (variant DTO has no stock fields in Phase 3 contract)
- `packages/shared` new types unless one ticket adds minimal client mirrors
- Repository & Codebase Setup (Phase 1)
- Admin / vendor / delivery surfaces
- Client-only `out_of_stock` filter across paginated pages (backend has `isAvailable` only; document limitation — do not add new API)

**Execution order notes:**
- Run **Tickets 1–2** (docs/contracts) before customer-app code.
- Run **Tickets 3–8** (pagination utils/hooks, location context, query builder) before **Tickets 9–13** (OOS UI components).
- Run **Tickets 14–16** (screen pagination wiring) after hooks and `ProductGrid` footer exist.
- Run **Ticket 17** (filter reset) with or immediately after screen tickets.
- Run **Ticket 18** (detail OOS/low-stock UX) after Tickets 9 and 11.
- Run **Ticket 19** (unit test script) after implementation tickets.
- Run **Tickets 20–21** (docs status, progress index) then **Ticket 22** (handoff).

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-19)

---

## Ticket 1 — Module 13 implementation alignment docs

**Ticket:** 1 — Module 13 implementation alignment docs

**Objective:** Document pagination strategy, OOS UX rules, store context wiring, and explicit non-goals before coding.

**Files to create/update:**
- `docs/architecture/customer-app-catalog-browsing-improvements.md` (create)
- `docs/testing/customer-app-catalog-browsing-verification.md` (create)

**API endpoints:** Document consumption only (no new routes):
- `GET /api/v1/customer/catalog/products`
- `GET /api/v1/customer/catalog/search`

**DB fields:** N/A (read-only client; fields displayed: `isOutOfStock`, `isAvailable`, `availableQuantity` on product DTOs).

**Implementation steps:**
1. List screens in scope: `CategoryProductsScreen`, `BrandProductsScreen`, `CatalogSearchScreen`.
2. Pagination: default `limit` 20; append pages on `FlatList` `onEndReached`; reset page when filters, subcategory, or debounced search changes.
3. OOS: card badge + dimmed style; quick-add hidden when `isOutOfStock` or `isAvailable === false`; detail uses `AvailabilityBadge` + optional low-stock copy when `availableQuantity` ≤ threshold (define constant, e.g. 5).
4. Pass `storeId` from `useLocationContext` and `cityId` from location store (fallback auth `cityId`).
5. Note: `availability: out_of_stock` in filter UI cannot be enforced server-side without `isOutOfStock` query param — document “available only” server filter; `out_of_stock` filter unchanged or hidden per alignment decision.
6. QA: customer OTP `123456`, store selected via Module 1.

**Acceptance criteria:**
- Docs match AllPhase Module 13 + PDF pages 28–30; no application code.

**Test commands:**
```bash
test -f docs/architecture/customer-app-catalog-browsing-improvements.md && \
test -f docs/testing/customer-app-catalog-browsing-verification.md && \
echo PASS
```

**Depends on:** Phase 4 Modules 1–12 complete; Phase 3 customer catalog APIs.

---

## Ticket 2 — Customer catalog browsing UI contract update

**Ticket:** 2 — Customer catalog browsing UI contract update

**Objective:** Extend the catalog UI contract with pagination and OOS display rules for Module 13 implementers.

**Files to create/update:**
- `docs/contracts/customer-app-catalog-ui-contract.md` (update — add **Browsing improvements** section)
- `docs/architecture/customer-app-catalog-read-foundation.md` (update — reference Module 13 pagination/OOS; mark browse improvements PLANNED → IMPLEMENTED when module completes)

**API endpoints:** Document existing query params only:
- `page`, `limit`, `storeId`, `cityId`, `isAvailable` (maps from filter `available`)
- `GET /customer/catalog/products`, `GET /customer/catalog/search`

**DB fields:** N/A.

**Implementation steps:**
1. Pagination UX: `onEndReached`, loading footer, `hasNextPage` from `meta.pagination` or `items.length < total`.
2. OOS card rules: when `isOutOfStock === true`, show badge, dim card, disable `AddToCartButton`.
3. Detail: `getAvailabilityState`; low stock when `availableQuantity != null && availableQuantity > 0 && availableQuantity <= LOW_STOCK_THRESHOLD`.
4. Document `storeId` required for accurate store stock on listings when location selected.

**Acceptance criteria:**
- Contract sufficient to implement without guessing pagination/OOS behavior.

**Test commands:**
```bash
grep -q "Browsing improvements" docs/contracts/customer-app-catalog-ui-contract.md && \
grep -q "pagination" docs/contracts/customer-app-catalog-ui-contract.md && \
echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Catalog pagination constants

**Ticket:** 3 — Catalog pagination constants

**Objective:** Add shared default page size and low-stock threshold constants for catalog browsing.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/constants/customer-catalog.constants.ts` (update)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Add `CUSTOMER_CATALOG_DEFAULT_PAGE = 1`.
2. Add `CUSTOMER_CATALOG_PAGE_LIMIT = 20` (match backend default).
3. Add `CUSTOMER_CATALOG_LOW_STOCK_THRESHOLD = 5`.
4. Export for hooks and availability util.

**Acceptance criteria:**
- Constants imported by pagination hooks/util without magic numbers in screens.

**Test commands:**
```bash
grep -q "CUSTOMER_CATALOG_PAGE_LIMIT" apps/customer-app/src/modules/catalog/constants/customer-catalog.constants.ts && \
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 2.

---

## Ticket 4 — Catalog pagination merge utility

**Ticket:** 4 — Catalog pagination merge utility

**Objective:** Pure helpers to merge paginated API pages and compute `hasNextPage`.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/utils/catalog-pagination.util.ts` (create)
- `apps/customer-app/src/modules/catalog/utils/catalog-pagination.util.test.ts` (create)

**API endpoints:** N/A (uses response shape `{ items, pagination: { page, limit, total } }`).

**DB fields:** N/A.

**Implementation steps:**
1. `mergeCatalogPages(existing, nextPageItems)` — dedupe by `product.id`.
2. `getCatalogHasNextPage(pagination, loadedCount)` — `page * limit < total` or `loadedCount < total`.
3. `getInitialCatalogPageState()` — `{ page: 1, items: [] }`.
4. Unit tests: merge dedupe, hasNext true/false, empty first page.

**Acceptance criteria:**
- Utils tested; no React imports.

**Test commands:**
```bash
node --import tsx --test apps/customer-app/src/modules/catalog/utils/catalog-pagination.util.test.ts
```

**Depends on:** Ticket 3.

---

## Ticket 5 — Location context in catalog query hooks

**Ticket:** 5 — Location context in catalog query hooks

**Objective:** Pass `storeId` and preferred `cityId` from `useLocationContext` into all catalog list/search query builders.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/hooks/useCustomerProducts.ts` (update)
- `apps/customer-app/src/modules/catalog/hooks/useCustomerCatalogSearch.ts` (update)
- `apps/customer-app/src/modules/catalog/hooks/useCustomerCatalogFacets.ts` (update, if uses cityId only)

**API endpoints:**
- `GET /api/v1/customer/catalog/products` (+ `storeId`, `cityId` query)
- `GET /api/v1/customer/catalog/search` (+ `storeId`, `cityId` query)

**DB fields:** N/A.

**Implementation steps:**
1. Replace auth-only `cityId` with `useLocationContext().cityId` (fallback auth `cityId`).
2. Include `selectedStoreId` as `storeId` when `hasStore`.
3. Keep `buildCatalogQuery` usage; do not change API client paths.

**Acceptance criteria:**
- List/search requests include `storeId` when user has selected store.

**Test commands:**
```bash
grep -q "useLocationContext" apps/customer-app/src/modules/catalog/hooks/useCustomerProducts.ts && \
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 3; Phase 4 Module 1 (`useLocationContext`).

---

## Ticket 6 — buildCatalogQuery storeId and availability notes

**Ticket:** 6 — buildCatalogQuery storeId and availability notes

**Objective:** Ensure `buildCatalogQuery` passes `storeId`; align `available` filter with API; document `out_of_stock` limitation.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/utils/catalog-query.util.ts` (update)
- `apps/customer-app/src/modules/catalog/utils/catalog-query.util.test.ts` (update)
- `apps/customer-app/src/modules/catalog/store/catalog-filter.store.ts` (update — pass `storeId`/`cityId` via overrides in `toListQuery` if needed)

**API endpoints:** Query params: `isAvailable=true` when filter `availability === 'available'`; `storeId` when provided.

**DB fields:** N/A.

**Implementation steps:**
1. Confirm `storeId` forwarded when present in filters/overrides.
2. Do **not** add `isOutOfStock` query (not in backend parser); add comment for `out_of_stock` UI filter limitation.
3. Update tests for `storeId` in built query.
4. Optional: disable or hide `out_of_stock` chip in `CatalogFiltersScreen` if alignment doc says so — only if Ticket 1 specifies.

**Acceptance criteria:**
- `available` filter hits API; no false expectation that `out_of_stock` filters server-side.

**Test commands:**
```bash
node --import tsx --test apps/customer-app/src/modules/catalog/utils/catalog-query.util.test.ts
```

**Depends on:** Ticket 5.

---

## Ticket 7 — usePaginatedCustomerProducts hook

**Ticket:** 7 — usePaginatedCustomerProducts hook

**Objective:** React hook that accumulates product list pages with load-more and refresh reset.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/hooks/usePaginatedCustomerProducts.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/catalog/products` (`page`, `limit`, filters)

**DB fields:** N/A.

**Implementation steps:**
1. Accept `Partial<CustomerCatalogListQuery>` (category, brand, filters from store).
2. State: `page`, merged `items`, `pagination` meta.
3. `useQuery` per page OR manual fetch on `loadMore` — prefer `queryKey` including `page` with merge on success.
4. Expose: `items`, `isLoading`, `isFetching`, `isLoadingMore`, `hasNextPage`, `loadMore`, `refresh` (reset to page 1).
5. On filter key change (categoryId, subcategoryId, brandId, sort, availability, foodType), reset accumulated items.

**Acceptance criteria:**
- Hook loads page 1 on mount; `loadMore` appends without duplicates.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 4, 5, 6.

---

## Ticket 8 — usePaginatedCustomerCatalogSearch hook

**Ticket:** 8 — usePaginatedCustomerCatalogSearch hook

**Objective:** Paginated search hook with existing debounce/min-length behavior.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/hooks/usePaginatedCustomerCatalogSearch.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/catalog/search` (`q`, `page`, `limit`, `storeId`, `cityId`)

**DB fields:** N/A.

**Implementation steps:**
1. Reuse debounce (`CUSTOMER_CATALOG_SEARCH_DEBOUNCE_MS`) and min length from constants.
2. Reset pagination when debounced query string changes.
3. Same merge/hasNext API as Ticket 7.
4. `enabled` only when debounced length ≥ min.

**Acceptance criteria:**
- Changing search text resets to page 1; load-more works for same query.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 4, 5, 7 (pattern reuse).

---

## Ticket 9 — Availability util low-stock state

**Ticket:** 9 — Availability util low-stock state

**Objective:** Extend availability helpers for low-stock copy on detail (and optional card hint).

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/utils/availability.util.ts` (update)
- `apps/customer-app/src/modules/catalog/utils/availability.util.test.ts` (create)

**API endpoints:** N/A.

**DB fields:** Uses `availableQuantity` on product DTO (store context).

**Implementation steps:**
1. Add `low_stock` to `AvailabilityState` or separate `getLowStockLabel(availableQuantity)` — prefer extending state only when in stock but quantity low.
2. `isLowStock(qty)` using `CUSTOMER_CATALOG_LOW_STOCK_THRESHOLD`.
3. `getAvailabilityState` unchanged priority: unavailable > out_of_stock > available; low stock is additive label on detail only.

**Acceptance criteria:**
- Tests cover null quantity, 0, 3, 10.

**Test commands:**
```bash
node --import tsx --test apps/customer-app/src/modules/catalog/utils/availability.util.test.ts
```

**Depends on:** Ticket 3.

---

## Ticket 10 — Product card OOS display polish

**Ticket:** 10 — Product card OOS display polish

**Objective:** Dim OOS/unavailable cards; unify badge logic; keep navigation to detail allowed.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/components/product-card-display.util.ts` (update)
- `apps/customer-app/src/modules/catalog/components/ProductCard.tsx` (update)
- `apps/customer-app/src/modules/catalog/components/product-card.test.tsx` (update)

**API endpoints:** N/A.

**DB fields:** `isOutOfStock`, `isAvailable` on product list DTO.

**Implementation steps:**
1. `getProductCardBadgeState`: show OOS when `isOutOfStock === true`; show “Unavailable” when `isAvailable === false` (distinct badge or shared warning style).
2. Apply `opacity` / muted border on card when not purchasable.
3. Ensure `canQuickAdd` false for both cases (Module 4 behavior preserved).

**Acceptance criteria:**
- OOS and unavailable products visually distinct from in-stock cards.

**Test commands:**
```bash
node --import tsx --test apps/customer-app/src/modules/catalog/components/product-card.test.tsx
```

**Depends on:** Ticket 9.

---

## Ticket 11 — AvailabilityBadge labels for OOS and low stock

**Ticket:** 11 — AvailabilityBadge labels for OOS and low stock

**Objective:** Support detail low-stock helper text via badge or companion `Text`.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/components/AvailabilityBadge.tsx` (update)
- `apps/customer-app/src/modules/catalog/components/LowStockHint.tsx` (create, optional small component)

**API endpoints:** N/A.

**DB fields:** `availableQuantity`.

**Implementation steps:**
1. Keep existing `available` / `out_of_stock` / `unavailable` labels.
2. Add optional `availableQuantity` prop; when `state === 'available'` and low stock, render “Only X left” below badge.

**Acceptance criteria:**
- Detail screen can pass quantity; no badge regression for OOS.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 9.

---

## Ticket 12 — Catalog list footer loading component

**Ticket:** 12 — Catalog list footer loading component

**Objective:** Reusable footer for infinite scroll: loading spinner, end-of-list, error retry.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/components/CatalogListFooter.tsx` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Props: `isLoadingMore`, `hasNextPage`, `onRetry?`, `errorMessage?`.
2. Show `ActivityIndicator` when loading more; “No more products” when `!hasNextPage && items > 0`.

**Acceptance criteria:**
- Presentational only; no data fetching.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 4.

---

## Ticket 13 — ProductGrid footer and load-more guard

**Ticket:** 13 — ProductGrid footer and load-more guard

**Objective:** Wire `ListFooterComponent` and guard `onEndReached` against duplicate fetches.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/components/ProductGrid.tsx` (update)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Add props: `isLoadingMore`, `hasNextPage`, `listFooter` or build from `CatalogListFooter`.
2. `onEndReached`: call parent only if `hasNextPage && !isLoadingMore`.
3. Keep existing refresh and empty states.

**Acceptance criteria:**
- Grid supports infinite scroll UX without duplicate page requests.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 12.

---

## Ticket 14 — CategoryProductsScreen pagination

**Ticket:** 14 — CategoryProductsScreen pagination

**Objective:** Replace single-page `useCustomerProducts` with paginated hook and load-more.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/screens/CategoryProductsScreen.tsx` (update)

**API endpoints:**
- `GET /api/v1/customer/catalog/products`

**DB fields:** N/A.

**Implementation steps:**
1. Use `usePaginatedCustomerProducts` with `categoryId` / `subcategoryId` + `filterQuery`.
2. Pass `onEndReached={loadMore}` to `ProductGrid`.
3. Pull-to-refresh calls `refresh`.
4. Keep subcategory chips; changing subcategory resets pagination (via hook deps).
5. Retain total count label from pagination meta when present.

**Acceptance criteria:**
- Scrolling loads page 2+; refresh resets list.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 7, 13.

---

## Ticket 15 — BrandProductsScreen pagination

**Ticket:** 15 — BrandProductsScreen pagination

**Objective:** Same pagination pattern for brand product listing.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/screens/BrandProductsScreen.tsx` (update)

**API endpoints:**
- `GET /api/v1/customer/catalog/products` (`brandId`)

**DB fields:** N/A.

**Implementation steps:**
1. Mirror Ticket 14 with `brandId` from route params + filter store query.
2. Wire `ProductGrid` load-more and footer.

**Acceptance criteria:**
- Brand listing paginates identically to category screen.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 7, 13.

---

## Ticket 16 — CatalogSearchScreen pagination

**Ticket:** 16 — CatalogSearchScreen pagination

**Objective:** Paginated debounced search results with load-more.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/screens/CatalogSearchScreen.tsx` (update)

**API endpoints:**
- `GET /api/v1/customer/catalog/search`

**DB fields:** N/A.

**Implementation steps:**
1. Replace `useCustomerCatalogSearch` with `usePaginatedCustomerCatalogSearch`.
2. Remove duplicate empty state if `ProductGrid` `ListEmptyComponent` suffices.
3. Wire load-more, footer, pull-to-refresh if applicable.
4. Preserve popular categories UI when query &lt; min length.

**Acceptance criteria:**
- Long search result sets load additional pages on scroll.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 8, 13.

---

## Ticket 17 — Pagination reset on catalog filter apply

**Ticket:** 17 — Pagination reset on catalog filter apply

**Objective:** When user returns from `CatalogFiltersScreen`, listing screens show page 1 with new filters.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/hooks/usePaginatedCustomerProducts.ts` (update — filter dependency keys)
- `apps/customer-app/src/modules/catalog/screens/CatalogFiltersScreen.tsx` (update — ensure store updates trigger refetch)
- `apps/customer-app/src/modules/catalog/screens/CategoryProductsScreen.tsx` (update — focus refetch if needed)
- `apps/customer-app/src/modules/catalog/screens/BrandProductsScreen.tsx` (update — same)

**API endpoints:** N/A (client reset).

**DB fields:** N/A.

**Implementation steps:**
1. Include serialized filter state in hook reset deps (`sortBy`, `availability`, `foodType`, `brandId` from store).
2. On navigation focus after filters, call `refresh` if store changed (optional `useFocusEffect`).

**Acceptance criteria:**
- Applying sort/availability filter does not append to stale page-2 items.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 14, 15.

---

## Ticket 18 — ProductDetailScreen OOS and low-stock messaging

**Ticket:** 18 — ProductDetailScreen OOS and low-stock messaging

**Objective:** Strengthen detail availability UX using store-aware fields.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/screens/ProductDetailScreen.tsx` (update)
- `apps/customer-app/src/modules/catalog/screens/product-detail-screen.test.tsx` (update)

**API endpoints:**
- `GET /api/v1/customer/catalog/products/:productId` (existing)

**DB fields:** `isAvailable`, `isOutOfStock`, `availableQuantity` on product detail DTO.

**Implementation steps:**
1. Pass `availableQuantity` to `AvailabilityBadge` / `LowStockHint`.
2. When OOS, show short explanation above disabled `AddToCartButton`.
3. Keep `addToCartDisabled` logic; no cart API changes.

**Acceptance criteria:**
- Detail shows low-stock hint when quantity low; OOS shows clear non-purchasable state.

**Test commands:**
```bash
node --import tsx --test apps/customer-app/src/modules/catalog/screens/product-detail-screen.test.tsx
```

**Depends on:** Tickets 9, 11.

---

## Ticket 19 — Catalog browsing unit test script

**Ticket:** 19 — Catalog browsing unit test script

**Objective:** Add npm script aggregating Module 13 unit tests.

**Files to create/update:**
- `apps/customer-app/package.json` (update — `test:customer-catalog-browsing`)
- `docs/testing/customer-app-catalog-browsing-verification.md` (update — commands section)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Script runs: `catalog-pagination.util.test.ts`, `availability.util.test.ts`, `product-card.test.tsx`, `product-detail-screen.test.tsx`, `catalog-query.util.test.ts`.
2. Document in verification doc.

**Acceptance criteria:**
- Single command runs all Module 13 tests.

**Test commands:**
```bash
npm run test:customer-catalog-browsing -w apps/customer-app
```

**Depends on:** Tickets 4, 6, 9, 10, 18.

---

## Ticket 20 — Mark catalog read foundation browse improvements

**Ticket:** 20 — Mark catalog read foundation browse improvements

**Objective:** Update architecture docs to reflect implemented pagination/OOS behavior.

**Files to create/update:**
- `docs/architecture/customer-app-catalog-read-foundation.md` (update)
- `docs/architecture/customer-app-catalog-browsing-improvements.md` (update — status IMPLEMENTED)
- `docs/contracts/customer-app-catalog-ui-contract.md` (update status if still PLANNED sections)
- `docs/testing/customer-app-catalog-verification.md` (update — link to browsing verification)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Note infinite scroll on category, brand, search screens.
2. Note `storeId` on catalog queries.
3. Cross-link browsing verification doc.

**Acceptance criteria:**
- Docs match shipped behavior.

**Test commands:**
```bash
grep -q "Module 13" docs/architecture/customer-app-catalog-read-foundation.md && \
echo PASS
```

**Depends on:** Tickets 14–18.

---

## Ticket 21 — Progress and phase handoff index

**Ticket:** 21 — Progress and phase handoff index

**Objective:** Record Module 13 completion in project progress (after all code tickets).

**Files to create/update:**
- `project-context/CURRENT_PROGRESS.md` (update)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — Module 13 row)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Set current module to **14 — Phase 4 Testing & Validation** when Module 13 code complete.
2. Link execution ticket doc and handoff doc paths.

**Acceptance criteria:**
- Progress file points to Module 14 as next.

**Test commands:**
```bash
grep -q "Module 13" project-context/CURRENT_PROGRESS.md && echo PASS
```

**Depends on:** Tickets 14–19.

---

## Ticket 22 — Module 13 completion handoff

**Ticket:** 22 — Module 13 completion handoff

**Objective:** Publish handoff summary for Module 14 integration testing.

**Files to create/update:**
- `docs/handoffs/phase-4-customer-app-search-browsing-complete.md` (create)
- `docs/reviews/phase-4-customer-app-search-browsing-execution-tickets.md` (update — all tickets `DONE`, module status)

**API endpoints:** Listed for reference only (unchanged from Phase 3).

**DB fields:** N/A.

**Implementation steps:**
1. Summarize: pagination screens, OOS UX, `storeId` wiring, test command.
2. Known limitations: `out_of_stock` server filter, home/catalog home not paginated.
3. Next module: **14 — Phase 4 Testing & Validation**.

**Acceptance criteria:**
- Handoff doc exists; ticket doc all `DONE`.

**Test commands:**
```bash
test -f docs/handoffs/phase-4-customer-app-search-browsing-complete.md && \
npm run test:customer-catalog-browsing -w apps/customer-app && \
echo PASS
```

**Depends on:** Tickets 1–21.

---

## Module 13 summary

| Item | Value |
|------|--------|
| Total tickets | 22 |
| Backend tickets | 0 |
| Customer-app tickets | 20 (Tickets 3–19) |
| Docs / handoff tickets | 4 (Tickets 1–2, 20–22) |
| Primary APIs | `GET /customer/catalog/products`, `GET /customer/catalog/search` |
| Blocks | Module 14 (Phase 4 Testing & Validation) |

**Next module to implement:** **Module 14 — Phase 4 Testing & Validation**

---

## Module 13 completion report (2026-05-19)

All 22 tickets implemented and reviewed. Typecheck and `test:customer-catalog-browsing` pass (32 tests).
