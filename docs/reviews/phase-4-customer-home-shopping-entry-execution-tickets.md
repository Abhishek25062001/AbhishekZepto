# Phase 4 Customer Home & Shopping Entry — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 2 — Customer Home & Shopping Entry  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Module 2 tasks, page 44)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Module 2 micro-tasks, pages 4–6)

**Architecture references (Module 0 + Module 1):**  
`docs/architecture/phase-4-customer-shopping-architecture.md`, `docs/contracts/customer-home-shopping-entry-api.md`, `docs/architecture/phase-4-backend-file-structure.md`, `docs/architecture/phase-4-customer-app-file-structure.md`, `docs/errors/phase-4-error-codes.md`, `docs/validation/phase-4-validation-rules.md`, `docs/security/phase-4-permissions.md`, `docs/contracts/customer-app-location-ui-contract.md`

**Prerequisites:**  
Phase 4 Module 0 complete; **Module 1 complete** (`customer_addresses`, `customer_store_selections`, location store in customer app); Phase 3 customer catalog read (`catalog-search` services); Phase 2 customer auth.

**PDF vs Module 0 alignment (implement using Module 0 contract):**

| PDF / legacy | Implementation |
|--------------|----------------|
| `GET /customer/shopping-entry` (if listed) | **No separate route** — use `GET /api/v1/customer/home` only |
| Home CMS / `customer_home` collection | **Deferred** — compose feed from Phase 3 catalog + stores |
| Multiple client calls for home sections | **Single** `GET /customer/home` aggregates sections server-side |
| Dev `HomeScreen` as shopping entry | Replace/wire to `modules/home/screens/CustomerHomeScreen.tsx` |

**Out of scope for this module:**
- Cart APIs/UI (Modules 3–4)
- Add-to-cart buttons on home product cards (Module 4)
- Checkout, payment, orders (Modules 6–11)
- Profile APIs (Module 12)
- Search/browse pagination improvements (Module 13)
- Promotions, coupons, real banner CMS (Phase 9+)
- `packages/shared` new types unless one ticket adds minimal DTO mirrors
- Repository & Codebase Setup (Phase 1)
- New MongoDB collection for home feed (MVP has none)

**Execution order notes:**
- Run **Tickets 1–2** (docs) before backend.
- Run **Tickets 3–11** (backend home module) before **Tickets 12–13** (tests).
- Run **Tickets 14–21** (customer app) after backend route tests pass.
- Run **Tickets 22–23** (docs/registry/verification) then **Ticket 24** (handoff).

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-19)

---

## Ticket 1 — Module 2 implementation alignment docs

**Ticket:** 1 — Module 2 implementation alignment docs

**Objective:** Document Module 2 scope, PDF→repo mapping, home feed composition, and customer-app shopping-entry flow before coding.

**Files to create/update:**
- `docs/architecture/customer-home-shopping-entry.md` (create)
- `docs/contracts/customer-app-home-ui-contract.md` (create)
- `docs/testing/customer-home-shopping-entry-verification.md` (create)

**API endpoints:** Document consumer usage:
- `GET /api/v1/customer/home?storeId=&cityId=&featuredLimit=&categoryLimit=`

**DB fields:** None (no `customer_home` collection in MVP). Reads: `stores`, Phase 3 catalog entities, optional `customer_store_selections` for store context validation.

**Implementation steps:**
1. Flow: authenticated customer with `selectedStoreId` → home feed → section CTAs → catalog stack for deep browse.
2. Home sections per contract: `store`, `categories`, `featuredProducts`, `banners: []`, `serviceability`.
3. Reuse `catalog-search.service` (`listCustomerCategoriesService`, `getCustomerFeaturedProductsService`) — do not duplicate SQL/Mongo queries.
4. Store gates: `status=active`, `isOpen`, `isAcceptingOrders`, `isDeleted=false`.
5. Clarify relationship to existing `CatalogHomeScreen` (deep browse) vs new shopping-entry home.
6. QA: dev customer `9999999999` + seed store `STORE-000001`.

**Acceptance criteria:**
- Docs match AllPhase Module 2 + PDF pages 4–6; no application code.

**Test commands:**
```bash
test -f docs/architecture/customer-home-shopping-entry.md && \
test -f docs/contracts/customer-app-home-ui-contract.md && \
echo PASS
```

**Depends on:** Phase 4 Module 1 complete.

---

## Ticket 2 — Home API contract expansion

**Ticket:** 2 — Home API contract expansion

**Objective:** Expand `customer-home-shopping-entry-api.md` with full request/response examples and query validation rules.

**Files to create/update:**
- `docs/contracts/customer-home-shopping-entry-api.md` (update — response JSON examples, pagination defaults)
- `docs/validation/phase-4-validation-rules.md` (update — add Home section: `storeId` required, limits)

**API endpoints:**
- `GET /api/v1/customer/home`

**DB fields:** Document read-only sources; confirm **no** new collection.

**Implementation steps:**
1. Document response shape for each section (`store`, `categories`, `featuredProducts`, `banners`, `serviceability`).
2. Query params: `storeId` (required), `cityId` (optional), `categoryLimit`, `featuredLimit` (defaults e.g. 20).
3. Error cases: `STORE_NOT_FOUND`, `STORE_NOT_SERVICEABLE`, `CATALOG_SEARCH_SCOPE_DENIED`.
4. Cross-link `docs/contracts/backend-route-registry.md`.

**Acceptance criteria:**
- Contract is implementable without guessing field names.

**Test commands:**
```bash
grep -q "featuredProducts" docs/contracts/customer-home-shopping-entry-api.md && \
grep -q "storeId" docs/validation/phase-4-validation-rules.md && echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Home backend module scaffold

**Ticket:** 3 — Home backend module scaffold

**Objective:** Create `backend/api/src/modules/home/` folder layout per `phase-4-backend-file-structure.md`.

**Files to create/update:**
- `backend/api/src/modules/home/` (create dirs: `services/`, `controllers/`, `routes/`, `validators/`, `types/`, `constants/`, `utils/`)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Empty scaffold only; no business logic.
2. No new collection name constants (no home collection).

**Acceptance criteria:**
- Folder tree exists; `npm run typecheck -w backend/api` passes.

**Test commands:**
```bash
test -d backend/api/src/modules/home/services && \
npm run typecheck -w backend/api
```

**Depends on:** Tickets 1–2.

---

## Ticket 4 — Home types and response mapper

**Ticket:** 4 — Home types and response mapper

**Objective:** Define TypeScript types and mapper for aggregated home feed DTO.

**Files to create/update:**
- `backend/api/src/modules/home/types/customer-home.types.ts` (create)
- `backend/api/src/modules/home/utils/customer-home.mapper.ts` (create)

**API endpoints:** Types for `GET /customer/home` response.

**DB fields:** N/A (DTO only). Map from store record + catalog DTOs.

**Implementation steps:**
1. `CustomerHomeFeedResponse` with sections from contract.
2. `HomeStoreSummary`, `HomeServiceabilityBlock`, `HomeBannerPlaceholder` (empty array type).
3. Mapper functions: store → summary; catalog items → home product cards (reuse catalog customer product shape or slim variant).

**Acceptance criteria:**
- Types compile; mapper exports pure functions.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 3.

---

## Ticket 5 — Home query validators

**Ticket:** 5 — Home query validators

**Objective:** Zod validator for home feed query params (PDF validation middleware pattern).

**Files to create/update:**
- `backend/api/src/modules/home/validators/customer-home.validators.ts` (create)

**API endpoints:** Validates `GET /customer/home` query.

**DB fields:** N/A.

**Implementation steps:**
1. `storeId`: required `mongoObjectIdValidator`.
2. `cityId`: optional ObjectId.
3. `categoryLimit`, `featuredLimit`: optional int 1–50, defaults applied in service.
4. Align with Ticket 2 validation doc.

**Acceptance criteria:**
- Validator exports schema for `validateRequest` middleware.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 4.

---

## Ticket 6 — Home service: store resolution and serviceability block

**Ticket:** 6 — Home service: store resolution and serviceability block

**Objective:** Load store by `storeId`, build `serviceability` block; enforce store operational gates.

**Files to create/update:**
- `backend/api/src/modules/home/services/customer-home.service.ts` (create — partial)
- `backend/api/src/modules/home/constants/customer-home-errors.constant.ts` (create)
- Reuse `backend/api/src/modules/stores/repositories/store.repository.ts` (`findStoreById`)
- Optional reuse `customer-store-selection.repository.ts` (`findSelectedStoreByCustomerId`) to verify `storeId` matches customer selection

**API endpoints:** Internal for `GET /customer/home`.

**DB fields:** Reads `stores`; optional read `customer_store_selections`.

**Implementation steps:**
1. `resolveStoreForHome(storeId, customerId)` — not found → `STORE_NOT_FOUND`.
2. If store not `active` / not open / not accepting orders → `serviceability.isServiceable: false` with message (or 422 per contract decision — document in Ticket 1).
3. Optional: reject `storeId` not matching customer's `isSelected` row → 403/422 (recommended).
4. Return `HomeStoreSummary` subset (id, name, cityId, isOpen, isAcceptingOrders).

**Acceptance criteria:**
- Service methods unit-testable without HTTP.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 4–5; Module 1 store selection.

---

## Ticket 7 — Home service: categories section

**Ticket:** 7 — Home service: categories section

**Objective:** Compose root categories section via Phase 3 catalog-search (no duplicate queries).

**Files to create/update:**
- `backend/api/src/modules/home/services/customer-home.service.ts` (update)
- Import/call `listCustomerCategoriesService` from `catalog-search.service.ts`

**API endpoints:** Section inside `GET /customer/home`.

**DB fields:** Reads Phase 3 category data via existing repository.

**Implementation steps:**
1. Pass `cityId`, `storeId`, `page: 1`, `limit: categoryLimit`.
2. Filter or map to root categories only if catalog returns tree (match customer catalog home behavior).
3. Handle catalog errors → propagate or wrap as `CATALOG_SEARCH_FAILED`.

**Acceptance criteria:**
- Categories appear in home feed for seeded store/city.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 6.

---

## Ticket 8 — Home service: featured products and banners placeholder

**Ticket:** 8 — Home service: featured products and banners placeholder

**Objective:** Compose featured products section; return empty `banners` array until campaigns module.

**Files to create/update:**
- `backend/api/src/modules/home/services/customer-home.service.ts` (update)
- Call `getCustomerFeaturedProductsService` from `catalog-search.service.ts`

**API endpoints:** Section inside `GET /customer/home`.

**DB fields:** Reads store-products / catalog via Phase 3.

**Implementation steps:**
1. `featuredLimit` query param; `isFeatured` implied by featured service.
2. `banners: []` always for MVP.
3. Map products through `customer-home.mapper.ts`.

**Acceptance criteria:**
- Featured section populated when seed catalog has featured products.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 7.

---

## Ticket 9 — Home service: orchestrator and audit (optional)

**Ticket:** 9 — Home service: orchestrator and audit (optional)

**Objective:** `getCustomerHomeFeed(customerId, query, actor)` orchestrates all sections in one call.

**Files to create/update:**
- `backend/api/src/modules/home/services/customer-home.service.ts` (update — export `getCustomerHomeFeed`)
- `backend/api/src/modules/home/constants/customer-home-audit-events.constant.ts` (create — `customer.home.viewed` optional)

**API endpoints:** `GET /api/v1/customer/home`

**DB fields:** Via Tickets 6–8 reads only.

**Implementation steps:**
1. Parallel fetch store + categories + featured where safe.
2. Assemble `CustomerHomeFeedResponse`.
3. Optional audit log on home view (no PII in metadata; storeId only).
4. No DB writes.

**Acceptance criteria:**
- Single service entry point for controller.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 6–8.

---

## Ticket 10 — Home controller, routes, and mount

**Ticket:** 10 — Home controller, routes, and mount

**Objective:** HTTP layer for home feed; mount on `customer.routes.ts`.

**Files to create/update:**
- `backend/api/src/modules/home/controllers/customer-home.controller.ts` (create)
- `backend/api/src/modules/home/routes/customer-home.routes.ts` (create)
- `backend/api/src/routes/v1/customer.routes.ts` (update — `router.use('/home', ...)`)

**API endpoints:**
- `GET /api/v1/customer/home`

**DB fields:** Via service.

**Implementation steps:**
1. Chain: `authenticate` → `requireRole([CUSTOMER])` → `validateRequest({ query })` → controller.
2. Standard API envelope via `sendSuccessResponse`.
3. Pass `req.user` as actor for catalog scope (`cityId`).

**Acceptance criteria:**
- Manual curl with customer JWT returns home JSON for seed `storeId`.

**Test commands:**
```bash
npm run typecheck -w backend/api && npm run build -w backend/api
```

**Depends on:** Ticket 9.

---

## Ticket 11 — Home error mapper

**Ticket:** 11 — Home error mapper

**Objective:** Map domain errors to `AppError` with Phase 4 codes.

**Files to create/update:**
- `backend/api/src/modules/home/utils/customer-home-error.mapper.ts` (create)
- `backend/api/src/modules/home/constants/customer-home-errors.constant.ts` (update — align codes)
- `docs/errors/phase-4-error-codes.md` (update — home-specific notes if needed)

**API endpoints:** All home routes.

**DB fields:** N/A.

**Implementation steps:**
1. Reuse `STORE_NOT_FOUND`, `STORE_NOT_SERVICEABLE`, `CATALOG_SEARCH_*` from global/phase-4 codes.
2. No new permission codes.

**Acceptance criteria:**
- Invalid `storeId` returns 404; closed store returns serviceability block or 422 per Ticket 1 doc.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 10.

---

## Ticket 12 — Home service unit tests

**Ticket:** 12 — Home service unit tests

**Objective:** Unit tests for home feed orchestration (mock store + catalog services).

**Files to create/update:**
- `backend/api/src/modules/home/services/customer-home.service.test.ts` (create)

**API endpoints:** N/A (service-level).

**DB fields:** Mocked.

**Implementation steps:**
1. Happy path: all sections present.
2. Store not found.
3. Store closed → `serviceability.isServiceable: false`.
4. StoreId mismatch with selection (if enforced).

**Acceptance criteria:**
- `node --test dist/modules/home/services/customer-home.service.test.js` passes.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/home/services/customer-home.service.test.js
```

**Depends on:** Ticket 11.

---

## Ticket 13 — Home route tests and package script

**Ticket:** 13 — Home route tests and package script

**Objective:** Route smoke tests and `test:customer-home` npm script.

**Files to create/update:**
- `backend/api/src/modules/home/routes/customer-home.routes.test.ts` (create)
- `backend/api/package.json` (update — add `test:customer-home`)

**API endpoints:** `GET /customer/home` route registration.

**DB fields:** N/A.

**Implementation steps:**
1. Assert router exposes `GET /` on home router.
2. Validator rejects missing `storeId`.
3. Add script mirroring `test:customer-addresses` pattern.

**Acceptance criteria:**
- `npm run test:customer-home -w backend/api` passes.

**Test commands:**
```bash
npm run test:customer-home -w backend/api
```

**Depends on:** Ticket 12.

---

## Ticket 14 — Customer app home module scaffold

**Ticket:** 14 — Customer app home module scaffold

**Objective:** Create `apps/customer-app/src/modules/home/` layout per `phase-4-customer-app-file-structure.md`.

**Files to create/update:**
- `apps/customer-app/src/modules/home/api/` (create)
- `apps/customer-app/src/modules/home/hooks/` (create)
- `apps/customer-app/src/modules/home/screens/` (create)
- `apps/customer-app/src/modules/home/components/` (create)
- `apps/customer-app/src/modules/home/types/` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Mirror addresses/catalog module folder pattern.
2. No screens yet.

**Acceptance criteria:**
- `npm run typecheck -w apps/customer-app` passes.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 13 (backend stable); can start after Ticket 10 for parallel UI prep.

---

## Ticket 15 — Customer app home API client and types

**Ticket:** 15 — Customer app home API client and types

**Objective:** Typed client for `GET /customer/home`.

**Files to create/update:**
- `apps/customer-app/src/modules/home/api/customer-home.api.ts` (create)
- `apps/customer-app/src/modules/home/types/customer-home.types.ts` (create)
- `apps/customer-app/src/modules/home/utils/customer-home-error-message.util.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/home`

**DB fields:** N/A (DTO types only).

**Implementation steps:**
1. `getCustomerHomeFeed({ storeId, cityId, limits })` using shared `apiClient`.
2. Types mirror backend `CustomerHomeFeedResponse`.
3. Map API error codes to user-facing strings.

**Acceptance criteria:**
- Client compiles; no screens.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 14.

---

## Ticket 16 — useCustomerHome hook

**Ticket:** 16 — useCustomerHome hook

**Objective:** React Query hook for home feed keyed by location context.

**Files to create/update:**
- `apps/customer-app/src/modules/home/hooks/useCustomerHome.ts` (create)

**API endpoints:** Consumes Ticket 15 client.

**DB fields:** N/A.

**Implementation steps:**
1. Read `selectedStoreId`, `cityId` from `useLocationContext`.
2. `enabled: Boolean(selectedStoreId)`.
3. Expose `refetch`, loading, error states.

**Acceptance criteria:**
- Hook compiles; query key includes storeId + cityId.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 15; Module 1 `useLocationContext`.

---

## Ticket 17 — Home UI components (sections)

**Ticket:** 17 — Home UI components (sections)

**Objective:** Reusable home section components (header, categories row, featured list, serviceability warning).

**Files to create/update:**
- `apps/customer-app/src/modules/home/components/HomeLocationHeader.tsx` (create)
- `apps/customer-app/src/modules/home/components/HomeCategoriesSection.tsx` (create)
- `apps/customer-app/src/modules/home/components/HomeFeaturedSection.tsx` (create)
- `apps/customer-app/src/modules/home/components/HomeServiceabilityBanner.tsx` (create)
- Reuse catalog `CategoryCard`, `ProductCard` where possible (import from `modules/catalog/components/`)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Header: address label (from addresses list or location store) + store name.
2. Categories: horizontal list with `onPress` → catalog category screen.
3. Featured: horizontal product cards.
4. Serviceability banner when `isServiceable: false`.

**Acceptance criteria:**
- Components render with mock props in typecheck.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 16.

---

## Ticket 18 — CustomerHomeScreen (shopping entry)

**Ticket:** 18 — CustomerHomeScreen (shopping entry)

**Objective:** Primary shopping-entry screen consuming single home API (PDF Module 2 customer home screen).

**Files to create/update:**
- `apps/customer-app/src/modules/home/screens/CustomerHomeScreen.tsx` (create)
- `apps/customer-app/src/modules/home/components/HomeEmptyState.tsx` (create)
- `apps/customer-app/src/modules/home/components/HomeErrorState.tsx` (create)

**API endpoints:**
- `GET /api/v1/customer/home`

**DB fields:** N/A.

**Implementation steps:**
1. `useCustomerHome` drives content; pull-to-refresh.
2. Loading skeletons; empty featured/categories states.
3. CTA: "Browse all" → `Catalog` stack `CatalogHome`.
4. CTA: "Change location" → `Addresses` stack.
5. Do not add cart actions (Module 4).

**Acceptance criteria:**
- Screen loads feed when `selectedStoreId` set against running API.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 17.

---

## Ticket 19 — Navigation: shopping entry home wiring

**Ticket:** 19 — Navigation: shopping entry home wiring

**Objective:** Wire `CustomerHomeScreen` as post-location shopping entry; adjust `LocationGate` target.

**Files to create/update:**
- `apps/customer-app/src/app/MainNavigator.tsx` (update)
- `apps/customer-app/src/app/navigation.types.ts` (update — `CustomerHome` or reuse `Home`)
- `apps/customer-app/src/modules/addresses/screens/LocationGateScreen.tsx` (update — navigate to shopping home)
- `apps/customer-app/src/screens/main/HomeScreen.tsx` (update — dev-only panel or redirect to `CustomerHomeScreen`)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. `initialRouteName`: `LocationGate` when no store; else `CustomerHome` (or hydrate then replace).
2. `LocationGate` on success → `CustomerHome` not dev home.
3. Keep Profile/Sessions/Debug routes unchanged.
4. Preserve catalog navigator registration.

**Acceptance criteria:**
- Login → select store → lands on home feed screen.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 18.

---

## Ticket 20 — Home deep-links to catalog

**Ticket:** 20 — Home deep-links to catalog

**Objective:** Navigate from home sections to existing catalog screens with correct params.

**Files to create/update:**
- `apps/customer-app/src/modules/home/screens/CustomerHomeScreen.tsx` (update — navigation handlers)
- `apps/customer-app/src/modules/catalog/navigation/catalog-navigation.types.ts` (update if new param needs)

**API endpoints:** N/A (navigation only).

**DB fields:** N/A.

**Implementation steps:**
1. Category tap → `CategoryProducts` with `categoryId`, `categoryName`.
2. Product tap → `ProductDetail` with `productId`.
3. Pass `cityId`/`storeId` via location store (catalog hooks already read context).

**Acceptance criteria:**
- User can open category/product from home without re-selecting store.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 19.

---

## Ticket 21 — Catalog home overlap note (no refactor)

**Ticket:** 21 — Catalog home overlap note (no refactor)

**Objective:** Document how `CatalogHomeScreen` coexists with shopping-entry home; avoid duplicate API calls from shopping entry.

**Files to create/update:**
- `docs/architecture/customer-home-shopping-entry.md` (update — catalog vs home responsibilities)
- `apps/customer-app/src/modules/catalog/screens/CatalogHomeScreen.tsx` (update — comment only OR minimal: remove duplicate header if shopping entry is primary)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Shopping entry uses `GET /customer/home` only.
2. `CatalogHomeScreen` remains for full browse/search; entered via "Browse all".
3. No requirement to migrate catalog screen to home API in this module.

**Acceptance criteria:**
- Doc clarifies two screens; no new features added.

**Test commands:**
```bash
grep -q "CatalogHomeScreen" docs/architecture/customer-home-shopping-entry.md && echo PASS
```

**Depends on:** Ticket 20.

---

## Ticket 22 — Contract, route registry, and test script updates

**Ticket:** 22 — Contract, route registry, and test script updates

**Objective:** Mark home API IMPLEMENTED in docs; verify registry and mounting plan.

**Files to create/update:**
- `docs/contracts/customer-home-shopping-entry-api.md` (update — status IMPLEMENTED)
- `docs/contracts/backend-route-registry.md` (update — `GET /customer/home` IMPLEMENTED)
- `docs/contracts/phase-4-route-mounting-plan.md` (update — home PLANNED → IMPLEMENTED)
- `docs/contracts/customer-app-home-ui-contract.md` (update — status IMPLEMENTED after screens)
- `backend/api/package.json` (confirm `test:customer-home` present)

**API endpoints:** `GET /api/v1/customer/home` → **IMPLEMENTED**.

**DB fields:** Documented read-only sources.

**Implementation steps:**
1. Copy example response from mapper.
2. Link verification doc.

**Acceptance criteria:**
- Registry shows IMPLEMENTED for home route.

**Test commands:**
```bash
grep -q "IMPLEMENTED" docs/contracts/customer-home-shopping-entry-api.md && \
grep "customer/home" docs/contracts/backend-route-registry.md
```

**Depends on:** Tickets 13, 21.

---

## Ticket 23 — Module 2 verification checklist and smoke results

**Ticket:** 23 — Module 2 verification checklist and smoke results

**Objective:** Manual/automated verification doc with PASS/FAIL template.

**Files to create/update:**
- `docs/testing/customer-home-shopping-entry-verification.md` (update — checkboxes)
- `docs/testing/phase-4-module-2-smoke-results.md` (create)

**API endpoints:** Checklist covers `GET /customer/home` and app shopping-entry flow.

**DB fields:** Verify feed uses seed store + catalog data.

**Implementation steps:**
1. curl example with customer JWT + `storeId` from seed selection.
2. App flow: login → store selected → home sections visible.
3. Closed store / invalid storeId cases.

**Acceptance criteria:**
- Smoke results file exists with automated test outcomes recorded.

**Test commands:**
```bash
test -f docs/testing/phase-4-module-2-smoke-results.md && echo PASS
```

**Depends on:** Ticket 22.

---

## Ticket 24 — Module 2 handoff and project context closeout

**Ticket:** 24 — Module 2 handoff and project context closeout

**Objective:** Close Module 2; update handoff files.

**Files to create/update:**
- `docs/handoffs/phase-4-customer-home-shopping-entry-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — Module 2 DONE)
- `project-context/CURRENT_PROGRESS.md` (update)
- `docs/reviews/phase-4-customer-home-shopping-entry-execution-tickets.md` (update — all DONE)

**API endpoints:** Summary: `GET /api/v1/customer/home` implemented.

**DB fields:** None added; lists read dependencies.

**Implementation steps:**
1. List artifacts and test commands.
2. Known limitations: empty banners, no cart on home.
3. Next: Module 3 Cart Backend Foundation.

**Acceptance criteria:**
- Handoff complete; Module 3 not started.

**Test commands:**
```bash
test -f docs/handoffs/phase-4-customer-home-shopping-entry-complete.md && \
grep "Module 2" project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md
```

**Depends on:** Ticket 23.

---

## Module closeout

**Phase 4 Module 2 — Customer Home & Shopping Entry:** `DONE` (Tickets 1–24)

**Next module to ticketize:** **Module 3 — Cart Backend Foundation** (after Ticket 24 DONE)

**Execution order summary:**
```text
1–2 docs → 3–11 backend → 12–13 tests → 14–20 customer app → 21 doc note → 22–24 closeout
```
