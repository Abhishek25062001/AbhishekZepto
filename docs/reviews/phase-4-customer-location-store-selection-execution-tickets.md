# Phase 4 Customer Location & Store Selection — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 1 — Customer Location & Store Selection  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Module 1 tasks, pages 43–44)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Module 1 micro-tasks, pages 1–3)

**Architecture references (Module 0):**  
`docs/architecture/phase-4-customer-shopping-architecture.md`, `docs/contracts/customer-address-api.md`, `docs/database/customer-address-schema.md`, `docs/errors/phase-4-error-codes.md`, `docs/validation/phase-4-validation-rules.md`, `docs/security/phase-4-permissions.md`, `docs/architecture/phase-4-backend-file-structure.md`, `docs/architecture/phase-4-customer-app-file-structure.md`

**Prerequisites:**  
Phase 4 Module 0 complete; Phase 3 Store Foundation (`stores` with `latitude`, `longitude`, `serviceRadiusKm`, `isOpen`, `isAcceptingOrders`); Phase 2 Customer auth (`authenticate` + `CUSTOMER`).

**PDF vs Module 0 alignment (implement this module using Module 0 contracts):**

| PDF path | Implementation |
|----------|----------------|
| `/api/v1/customer/locations` | Use `/api/v1/customer/addresses` |
| `locationId` in store selection | Use `addressId` |
| `GET/POST /customer/store-selection` | `POST /customer/serviceability` (lookup) + `POST /customer/store-selection` (persist selection) |
| Separate `customer-location.routes.ts` | Mount under `customer.routes.ts` sub-routers |

**Out of scope for this module:**
- Module 2 Home API/screens
- Cart, checkout, payment, orders
- `packages/shared` unless Ticket 4 explicitly adds types (minimal)
- Repository & Codebase Setup (Phase 1)
- PDF admin `store-selection-admin.routes.ts` (not in AllPhase Module 1)
- Map SDK / geocoding provider integration (coordinates required on address create; manual entry or future ticket)

**Execution order notes:**
- Run **Tickets 1–2** (docs) before backend implementation.
- Run **Tickets 3–9** (address backend) before **Tickets 10–14** (serviceability/selection).
- Run **Tickets 15–17** (tests) after services.
- Run **Tickets 18–24** (customer app) after backend routes pass tests.
- Run **Tickets 25–27** (seed, registry, closeout) last.

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-19)

---

## Ticket 1 — Module 1 implementation alignment docs

**Ticket:** 1 — Module 1 implementation alignment docs

**Objective:** Document Module 1 scope, PDF→repo path mapping, serviceability algorithm, and customer-app UX flow before coding.

**Files to create/update:**
- `docs/architecture/customer-location-store-selection.md` (create)
- `docs/contracts/customer-app-location-ui-contract.md` (create)
- `docs/testing/customer-location-store-selection-verification.md` (create)

**API endpoints:** Document consumer usage:
- `GET|POST|PATCH|DELETE /api/v1/customer/addresses/*`
- `POST /api/v1/customer/addresses/:addressId/set-default`
- `POST /api/v1/customer/serviceability`
- `POST /api/v1/customer/store-selection` (persist selected store for customer)

**DB fields:** `customer_addresses`; `customer_store_selections` (see Ticket 2).

**Implementation steps:**
1. Customer flow: login → address list → add/edit → serviceability check → persist `storeId` → catalog/home uses `storeId`.
2. Serviceability rule: active stores where haversine distance ≤ `store.serviceRadiusKm`; pick nearest; unserviceable if none.
3. Store hours gates: respect `isOpen`, `isAcceptingOrders`, `status=active`, `isDeleted=false`.
4. App state: Zustand (or extend auth store) keys `selectedAddressId`, `selectedStoreId`, `cityId`.
5. Replace `ServiceabilityPlaceholderBanner` when store resolved.
6. QA checklist for dev seed customer `9999999999`.

**Acceptance criteria:**
- Docs match AllPhase Module 1 + PDF pages 1–3; no application code.

**Test commands:**
```bash
test -f docs/architecture/customer-location-store-selection.md && \
test -f docs/contracts/customer-app-location-ui-contract.md && \
echo PASS
```

**Depends on:** Phase 4 Module 0 complete.

---

## Ticket 2 — Customer store selection schema doc

**Ticket:** 2 — Customer store selection schema doc

**Objective:** Document `customer_store_selections` collection per PDF store selection model (pages 2–3).

**Files to create/update:**
- `docs/database/customer-store-selection-schema.md` (create)
- `docs/database/customer-address-schema.md` (update — cross-link `addressId`)
- `docs/contracts/customer-address-api.md` (update — add `POST /store-selection` if missing)

**API endpoints:** None (schema only).

**DB fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | PK |
| `customerId` | ObjectId | yes | Owner |
| `addressId` | ObjectId | yes | Selected delivery address |
| `storeId` | ObjectId | yes | Selected dark store |
| `isSelected` | boolean | yes | One `true` per customer |
| `createdAt` | Date | yes | |
| `updatedAt` | Date | yes | |

**Implementation steps:**
1. One selected row per customer (`isSelected: true`).
2. Selecting new store clears previous `isSelected`.
3. Index plan reference in `docs/database/phase-4-index-plan.md` (add note if missing).

**Acceptance criteria:**
- Schema doc complete; contract lists store-selection endpoint.

**Test commands:**
```bash
test -f docs/database/customer-store-selection-schema.md && echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Customer addresses backend module scaffold

**Ticket:** 3 — Customer addresses backend module scaffold

**Objective:** Create `backend/api/src/modules/customer-addresses/` folder layout and collection name constant.

**Files to create/update:**
- `backend/api/src/modules/customer-addresses/` (create dirs: `models/`, `repositories/`, `services/`, `controllers/`, `routes/`, `validators/`, `types/`, `constants/`)
- `backend/api/src/database/constants/collection-names.constants.ts` (update — add `CUSTOMER_ADDRESSES`, `CUSTOMER_STORE_SELECTIONS`)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Add `.gitkeep` or empty barrel files only where needed for imports later.
2. No business logic in this ticket.

**Acceptance criteria:**
- Folder tree exists; `npm run typecheck -w backend/api` still passes.

**Test commands:**
```bash
test -d backend/api/src/modules/customer-addresses/models && \
grep -q CUSTOMER_ADDRESSES backend/api/src/database/constants/collection-names.constants.ts && \
npm run typecheck -w backend/api
```

**Depends on:** Tickets 1–2.

---

## Ticket 4 — Customer address Mongoose model and indexes

**Ticket:** 4 — Customer address Mongoose model and indexes

**Objective:** Implement `customer_addresses` model per `docs/database/customer-address-schema.md` (AllPhase Task 1).

**Files to create/update:**
- `backend/api/src/modules/customer-addresses/models/customer-address.model.ts` (create)
- `backend/api/src/modules/customer-addresses/types/customer-address.types.ts` (create)

**API endpoints:** None.

**DB fields:** All fields from `customer-address-schema.md`; indexes `{ customerId: 1, isDeleted: 1 }`, partial unique default per customer.

**Implementation steps:**
1. Use `baseSchemaFields` / `baseSchemaOptions` patterns from store model.
2. Export `CustomerAddressRecord` type.
3. Register collection name constant.

**Acceptance criteria:**
- Model compiles; indexes declared on schema.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 3.

---

## Ticket 5 — Customer address repository

**Ticket:** 5 — Customer address repository

**Objective:** Persistence layer for address CRUD and default management.

**Files to create/update:**
- `backend/api/src/modules/customer-addresses/repositories/customer-address.repository.ts` (create)

**API endpoints:** None.

**DB fields:** Uses `customer_addresses`.

**Implementation steps:**
1. `findAddressesByCustomerId`, `findAddressByIdForCustomer`, `createAddress`, `updateAddressById`, `softDeleteAddressById`.
2. `clearDefaultForCustomer`, `setDefaultAddress`.
3. Filter `isDeleted: false` on reads.

**Acceptance criteria:**
- Repository exports all methods; no service/controller yet.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 4.

---

## Ticket 6 — Customer address validators

**Ticket:** 6 — Customer address validators

**Objective:** Zod validators for create/update/list params (PDF Task 1 validation middleware).

**Files to create/update:**
- `backend/api/src/modules/customer-addresses/validators/customer-address.validators.ts` (create)

**API endpoints:** Validates bodies for upcoming POST/PATCH.

**DB fields:** Enforce lat/long ranges, required `line1`, `label`, `city`, `country`.

**Implementation steps:**
1. `createCustomerAddressSchema`, `updateCustomerAddressSchema`, `addressIdParamSchema`.
2. Align with `docs/validation/phase-4-validation-rules.md`.

**Acceptance criteria:**
- Validators export schemas used by validate middleware.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 4.

---

## Ticket 7 — Customer address service

**Ticket:** 7 — Customer address service

**Objective:** Business logic for address CRUD, ownership, and single default (AllPhase Tasks 1–2).

**Files to create/update:**
- `backend/api/src/modules/customer-addresses/services/customer-address.service.ts` (create)
- `backend/api/src/modules/customer-addresses/constants/customer-address-errors.constants.ts` (create)

**API endpoints:** Service methods map to:
- `GET /addresses`, `POST /addresses`, `PATCH /addresses/:id`, `DELETE /addresses/:id`, `POST /addresses/:id/set-default`

**DB fields:** `customer_addresses.*`

**Implementation steps:**
1. Enforce `customerId` ownership on every mutation.
2. On create with `isDefault: true` or set-default: unset other defaults.
3. Throw `ADDRESS_NOT_FOUND`, `ADDRESS_NOT_OWNED` from phase-4 error codes.
4. Audit: `customer.address.created|updated|deleted` per `docs/architecture/phase-4-audit-logging.md`.

**Acceptance criteria:**
- Service unit-testable without HTTP.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 5–6.

---

## Ticket 8 — Customer address controller and routes

**Ticket:** 8 — Customer address controller and routes

**Objective:** HTTP layer and mount on `customer.routes.ts` (PDF Task 1 endpoints).

**Files to create/update:**
- `backend/api/src/modules/customer-addresses/controllers/customer-address.controller.ts` (create)
- `backend/api/src/modules/customer-addresses/routes/customer-address.routes.ts` (create)
- `backend/api/src/routes/v1/customer.routes.ts` (update — `router.use('/addresses', ...)`)
- `backend/api/src/modules/customer-addresses/utils/customer-address.mapper.ts` (create — response DTOs)

**API endpoints:**
- `GET /api/v1/customer/addresses`
- `POST /api/v1/customer/addresses`
- `PATCH /api/v1/customer/addresses/:addressId`
- `DELETE /api/v1/customer/addresses/:addressId`
- `POST /api/v1/customer/addresses/:addressId/set-default`

**DB fields:** Via service.

**Implementation steps:**
1. Chain: `authenticate` → `requireRole([CUSTOMER])` → validate → controller.
2. Use standard API envelope.
3. Map records to safe client shape (no internal fields).

**Acceptance criteria:**
- Routes mounted; manual curl with customer JWT returns list (empty array OK).

**Test commands:**
```bash
npm run typecheck -w backend/api && \
npm run build -w backend/api
```

**Depends on:** Ticket 7.

---

## Ticket 9 — Serviceability utility (nearest store)

**Ticket:** 9 — Serviceability utility (nearest store)

**Objective:** Pure function/service to find nearest active serviceable store using coordinates (AllPhase Task 3–4, PDF Task 4 `fetchStoreAvailability`).

**Files to create/update:**
- `backend/api/src/modules/customer-addresses/utils/haversine-distance.util.ts` (create)
- `backend/api/src/modules/customer-addresses/services/store-serviceability.service.ts` (create)
- Reuse `backend/api/src/modules/stores/repositories/store.repository.ts` (read-only queries — extend with `findActiveStoresForServiceability` if needed)

**API endpoints:** Used by `POST /serviceability` (Ticket 11).

**DB fields:** Reads `stores`: `latitude`, `longitude`, `serviceRadiusKm`, `isOpen`, `isAcceptingOrders`, `status`, `isDeleted`.

**Implementation steps:**
1. Load active stores (city filter optional if `cityId` on address).
2. Compute distance km; filter `distance <= serviceRadiusKm`.
3. Return nearest store or throw `SERVICEABILITY_AREA_UNAVAILABLE`.
4. Include `storeName`, `cityId`, optional ETA placeholder.

**Acceptance criteria:**
- Unit tests for distance math and no-store case.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 8 (can run parallel after Ticket 5); Phase 3 stores.

---

## Ticket 10 — Customer store selection model and repository

**Ticket:** 10 — Customer store selection model and repository

**Objective:** Persist customer store choice (PDF Tasks 3–4 `store-selection.model`).

**Files to create/update:**
- `backend/api/src/modules/customer-addresses/models/customer-store-selection.model.ts` (create — colocate with address module or `stores/` subfolder per team choice; prefer `customer-addresses/models/`)
- `backend/api/src/modules/customer-addresses/repositories/customer-store-selection.repository.ts` (create)
- `backend/api/src/modules/customer-addresses/types/customer-store-selection.types.ts` (create)

**API endpoints:** None.

**DB fields:** `customer_store_selections` per Ticket 2 schema.

**Implementation steps:**
1. `upsertSelectedStore(customerId, addressId, storeId)`.
2. `findSelectedStoreByCustomerId`.
3. Enforce one `isSelected: true` per customer.

**Acceptance criteria:**
- Model + repository compile.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 2.

---

## Ticket 11 — Store selection service and serviceability routes

**Ticket:** 11 — Store selection service and serviceability routes

**Objective:** Wire serviceability lookup + store selection persistence (PDF Tasks 2, 4–5).

**Files to create/update:**
- `backend/api/src/modules/customer-addresses/services/customer-store-selection.service.ts` (create)
- `backend/api/src/modules/customer-addresses/controllers/customer-serviceability.controller.ts` (create)
- `backend/api/src/modules/customer-addresses/validators/customer-serviceability.validators.ts` (create)
- `backend/api/src/modules/customer-addresses/routes/customer-serviceability.routes.ts` (create)
- `backend/api/src/routes/v1/customer.routes.ts` (update — mount `/serviceability` and `/store-selection`)
- `backend/api/src/modules/customer-addresses/constants/store-selection-errors.constants.ts` (create — `STORE_NOT_FOUND`, `LOCATION_INVALID`, `STORE_ALREADY_SELECTED` mapped to phase-4 codes)

**API endpoints:**
- `POST /api/v1/customer/serviceability` — body: `latitude`, `longitude`, optional `addressId`
- `POST /api/v1/customer/store-selection` — body: `addressId`, `storeId` (validate store serves address)

**DB fields:** `customer_store_selections`, reads `customer_addresses`, `stores`.

**Implementation steps:**
1. `serviceability`: resolve nearest store; do not persist until explicit selection (or auto-persist — document in Ticket 1; default: persist on `store-selection` only).
2. `selectStoreForCustomer`: verify address ownership; verify store in serviceable set; upsert selection.
3. Unserviceable: 422 + `SERVICEABILITY_AREA_UNAVAILABLE`.

**Acceptance criteria:**
- POST serviceability returns store for seed store coordinates near `STORE-000001`.
- POST store-selection persists row.

**Test commands:**
```bash
npm run typecheck -w backend/api && npm run build -w backend/api
```

**Depends on:** Tickets 9–10.

---

## Ticket 12 — Customer address and selection error audit integration

**Ticket:** 12 — Customer address and selection error audit integration

**Objective:** Centralize error mapping and confirm audit calls (PDF Tasks 8, 11–12).

**Files to create/update:**
- `backend/api/src/modules/customer-addresses/constants/customer-address-errors.constants.ts` (update — align with `docs/errors/phase-4-error-codes.md`)
- `backend/api/src/modules/customer-addresses/utils/customer-address-error.mapper.ts` (create)
- `docs/errors/phase-4-error-codes.md` (update — add `STORE_ALREADY_SELECTED` mapping note if using different code)

**API endpoints:** All Module 1 customer routes.

**DB fields:** `audit_logs` via existing audit service.

**Implementation steps:**
1. Map domain errors to `AppError` with stable codes.
2. No admin routes in this module.
3. Customer data: never log full address in audit metadata.

**Acceptance criteria:**
- Invalid store id returns `STORE_NOT_FOUND`; wrong owner returns 403.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 11.

---

## Ticket 13 — Customer address service unit tests

**Ticket:** 13 — Customer address service unit tests

**Objective:** Unit tests for address service (PDF Task 9 partial).

**Files to create/update:**
- `backend/api/src/modules/customer-addresses/services/customer-address.service.test.ts` (create)

**API endpoints:** N/A (service-level).

**DB fields:** Mocked repository.

**Implementation steps:**
1. Create address, set default, update, delete.
2. Ownership rejection.
3. Default uniqueness.

**Acceptance criteria:**
- `npm run build -w backend/api && node --test dist/modules/customer-addresses/services/customer-address.service.test.js` passes.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/customer-addresses/services/customer-address.service.test.js
```

**Depends on:** Ticket 12.

---

## Ticket 14 — Serviceability and store selection unit tests

**Ticket:** 14 — Serviceability and store selection unit tests

**Objective:** Unit tests for serviceability + selection (PDF Task 9).

**Files to create/update:**
- `backend/api/src/modules/customer-addresses/services/store-serviceability.service.test.ts` (create)
- `backend/api/src/modules/customer-addresses/services/customer-store-selection.service.test.ts` (create)

**API endpoints:** N/A.

**DB fields:** Mocked stores/selection repos.

**Implementation steps:**
1. Nearest store selection within radius.
2. No store in range → unserviceable.
3. `selectStoreForCustomer` success and invalid store.

**Acceptance criteria:**
- All tests pass.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/customer-addresses/services/store-serviceability.service.test.js && \
node --test dist/modules/customer-addresses/services/customer-store-selection.service.test.js
```

**Depends on:** Ticket 13.

---

## Ticket 15 — Customer location route tests

**Ticket:** 15 — Customer location route tests

**Objective:** Route/integration tests for address and serviceability endpoints (PDF Task 10).

**Files to create/update:**
- `backend/api/src/modules/customer-addresses/routes/customer-address.routes.test.ts` (create)
- `backend/api/src/modules/customer-addresses/routes/customer-serviceability.routes.test.ts` (create)
- `backend/api/package.json` (update — add `test:customer-addresses` script if missing)

**API endpoints:** Full Module 1 customer routes.

**DB fields:** Test DB or mocked services per repo convention.

**Implementation steps:**
1. 401 without token.
2. CRUD happy path with CUSTOMER role.
3. Serviceability returns store / unserviceable.
4. Filter stores by location (PDF Task 10).

**Acceptance criteria:**
- `npm run test:customer-addresses -w backend/api` passes (or documented test command).

**Test commands:**
```bash
npm run test:customer-addresses -w backend/api
```

**Depends on:** Ticket 14.

---

## Ticket 16 — Customer app addresses module scaffold

**Ticket:** 16 — Customer app addresses module scaffold

**Objective:** Create `apps/customer-app/src/modules/addresses/` layout (AllPhase Task 5).

**Files to create/update:**
- `apps/customer-app/src/modules/addresses/api/` (create)
- `apps/customer-app/src/modules/addresses/hooks/` (create)
- `apps/customer-app/src/modules/addresses/screens/` (create)
- `apps/customer-app/src/modules/addresses/components/` (create)
- `apps/customer-app/src/modules/addresses/types/` (create)
- `apps/customer-app/src/modules/addresses/store/` (create)
- `apps/customer-app/src/constants/storage-keys.ts` (update — `SELECTED_STORE_ID`, `SELECTED_ADDRESS_ID`)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Mirror catalog module patterns.
2. No screens yet.

**Acceptance criteria:**
- `npm run typecheck -w apps/customer-app` passes.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 15 (backend stable); can start after Ticket 8 for parallel UI prep.

---

## Ticket 17 — Customer app address API client and types

**Ticket:** 17 — Customer app address API client and types

**Objective:** API client for addresses, serviceability, store-selection (AllPhase Tasks 5–6).

**Files to create/update:**
- `apps/customer-app/src/modules/addresses/api/customer-address.api.ts` (create)
- `apps/customer-app/src/modules/addresses/types/customer-address.types.ts` (create)
- `apps/customer-app/src/modules/addresses/types/serviceability.types.ts` (create)
- `apps/customer-app/src/modules/addresses/utils/customer-address-error-message.util.ts` (create)

**API endpoints:**
- All Module 1 customer address + serviceability + store-selection routes

**DB fields:** N/A (DTO types only).

**Implementation steps:**
1. Use existing `apiClient` from `services/api/client.ts`.
2. Typed responses matching backend mapper.

**Acceptance criteria:**
- Client functions compile; no screens.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 16.

---

## Ticket 18 — Location store (Zustand) and hooks

**Ticket:** 18 — Location store (Zustand) and hooks

**Objective:** App state for selected address/store (AllPhase Task 6 — store in app state).

**Files to create/update:**
- `apps/customer-app/src/modules/addresses/store/location.store.ts` (create)
- `apps/customer-app/src/modules/addresses/hooks/useCustomerAddresses.ts` (create)
- `apps/customer-app/src/modules/addresses/hooks/useServiceability.ts` (create)
- `apps/customer-app/src/modules/addresses/hooks/useSelectStore.ts` (create)
- `apps/customer-app/src/modules/addresses/hooks/useLocationContext.ts` (create)

**API endpoints:** Consumes Ticket 17 clients.

**DB fields:** N/A.

**Implementation steps:**
1. Persist `selectedStoreId` / `selectedAddressId` to AsyncStorage keys.
2. Restore on app launch after auth.
3. React Query for address list mutations.

**Acceptance criteria:**
- Hooks compile; store exposes `storeId` for catalog modules.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 17.

---

## Ticket 19 — Address list and form screens

**Ticket:** 19 — Address list and form screens

**Objective:** Address list, add, edit, default selection UI (AllPhase Task 5).

**Files to create/update:**
- `apps/customer-app/src/modules/addresses/screens/AddressListScreen.tsx` (create)
- `apps/customer-app/src/modules/addresses/screens/AddressFormScreen.tsx` (create)
- `apps/customer-app/src/modules/addresses/components/AddressCard.tsx` (create)
- `apps/customer-app/src/modules/addresses/navigation/addresses.navigation.tsx` (create)
- `apps/customer-app/src/app/navigation.types.ts` (update)
- `apps/customer-app/src/app/MainNavigator.tsx` (update — Address routes)

**API endpoints:** Address CRUD + set-default.

**DB fields:** N/A.

**Implementation steps:**
1. List with default badge, edit/delete actions.
2. Form: label, lines, landmark, city, lat/long inputs (manual for MVP).
3. Loading, empty, error states.
4. Validation messages from API errors.

**Acceptance criteria:**
- User can add/edit/delete/set default address against running API.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 18.

---

## Ticket 20 — Serviceability flow and unserviceable UI

**Ticket:** 20 — Serviceability flow and unserviceable UI

**Objective:** After address select, run serviceability; show unserviceable state (AllPhase Task 4).

**Files to create/update:**
- `apps/customer-app/src/modules/addresses/screens/ServiceabilityScreen.tsx` (create — or inline on AddressList)
- `apps/customer-app/src/modules/addresses/components/UnserviceableAreaState.tsx` (create)
- `apps/customer-app/src/modules/addresses/components/StoreSelectionCard.tsx` (create)

**API endpoints:**
- `POST /api/v1/customer/serviceability`
- `POST /api/v1/customer/store-selection`

**DB fields:** N/A.

**Implementation steps:**
1. On confirm address → call serviceability.
2. Show nearest store summary; confirm button calls store-selection.
3. Unserviceable: block catalog with message + change address CTA.

**Acceptance criteria:**
- Serviceable address → `selectedStoreId` set; unserviceable shows error UI.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 19.

---

## Ticket 21 — Connect catalog and home to selected store

**Ticket:** 21 — Connect catalog and home to selected store

**Objective:** Wire store context into catalog browse and home (AllPhase Task 6; replace placeholder banner).

**Files to create/update:**
- `apps/customer-app/src/screens/main/HomeScreen.tsx` (update — location header, store name)
- `apps/customer-app/src/modules/catalog/components/ServiceabilityPlaceholderBanner.tsx` (update — hide when `storeId` set)
- `apps/customer-app/src/modules/catalog/hooks/useCustomerCategories.ts` (update — pass `storeId` query if required)
- `apps/customer-app/src/modules/catalog/api/customer-catalog.api.ts` (update — include `storeId` on product calls when API supports)
- `apps/customer-app/src/modules/addresses/screens/LocationGateScreen.tsx` (create — redirect if no store)

**API endpoints:** Catalog reads + `storeId` context.

**DB fields:** N/A.

**Implementation steps:**
1. MainNavigator: after auth, if no `selectedStoreId` → Address/Location flow.
2. Home shows selected address summary.
3. Catalog home/search use store from location store.

**Acceptance criteria:**
- E2E: login → add address → select store → catalog home loads with store context.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 20.

---

## Ticket 22 — Development seed: customer addresses

**Ticket:** 22 — Development seed: customer addresses

**Objective:** Idempotent seed for dev customer address near seeded store (`docs/database/phase-4-seed-data-plan.md`).

**Files to create/update:**
- `backend/api/src/database/seeds/seed-customer-addresses.ts` (create)
- `backend/api/src/database/seeds/index.ts` (update — call `seedCustomerAddresses`)
- `backend/api/src/database/seeds/seed-customer-addresses.test.ts` (create — dry-run or count)

**API endpoints:** N/A.

**DB fields:** Seeds `customer_addresses` (+ optional `customer_store_selections` for `9999999999` → `STORE-000001`).

**Implementation steps:**
1. Use store coordinates from seeded store for address lat/long.
2. Idempotent by `customerId` + `label`.

**Acceptance criteria:**
- Second `npm run seed` run updates not duplicates.

**Test commands:**
```bash
AWS_S3_PUBLIC_BASE_URL=http://localhost:5000/s3 npm run seed -w backend/api
```

**Depends on:** Ticket 11; Phase 3 store seed.

---

## Ticket 23 — Contract, route registry, and package script updates

**Ticket:** 23 — Contract, route registry, and package script updates

**Objective:** Mark APIs IMPLEMENTED in docs; add test script (PDF Task 12 documentation).

**Files to create/update:**
- `docs/contracts/customer-address-api.md` (update — status IMPLEMENTED, store-selection path)
- `docs/contracts/store-selection-api.md` (create — PDF doc path; can merge into customer-address-api if preferred)
- `docs/contracts/backend-route-registry.md` (update — IMPLEMENTED)
- `docs/contracts/phase-4-route-mounting-plan.md` (update)
- `backend/api/package.json` (update — `test:customer-addresses`)

**API endpoints:** All Module 1 routes → **IMPLEMENTED**.

**DB fields:** Documented collections live.

**Implementation steps:**
1. Copy request/response examples from mappers.
2. Link Postman note in verification doc.

**Acceptance criteria:**
- Registry shows IMPLEMENTED for address/serviceability/store-selection.

**Test commands:**
```bash
grep -q "IMPLEMENTED" docs/contracts/customer-address-api.md && \
grep "customer/addresses" docs/contracts/backend-route-registry.md
```

**Depends on:** Tickets 15, 22.

---

## Ticket 24 — Module 1 verification checklist

**Ticket:** 24 — Module 1 verification checklist

**Objective:** Manual/automated verification doc (AllPhase Module 1 acceptance).

**Files to create/update:**
- `docs/testing/customer-location-store-selection-verification.md` (update — checkboxes from Ticket 1)
- `docs/testing/phase-4-module-1-smoke-results.md` (create — record curl/app results)

**API endpoints:** Checklist covers all Module 1 routes.

**DB fields:** Verify collections in MongoDB after seed.

**Implementation steps:**
1. curl examples with customer JWT.
2. App flow checklist.
3. Unserviceable coordinates test case.

**Acceptance criteria:**
- Verification doc complete with PASS/FAIL template.

**Test commands:**
```bash
test -f docs/testing/phase-4-module-1-smoke-results.md && echo PASS
```

**Depends on:** Ticket 23.

---

## Ticket 25 — Module 1 handoff and project context closeout

**Ticket:** 25 — Module 1 handoff and project context closeout

**Objective:** Close Module 1; update handoff files (PDF closeout pattern).

**Files to create/update:**
- `docs/handoffs/phase-4-customer-location-store-selection-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — Module 1 DONE)
- `project-context/CURRENT_PROGRESS.md` (update)
- `docs/reviews/phase-4-customer-location-store-selection-execution-tickets.md` (update — all DONE)

**API endpoints:** Summary of 7 implemented route groups.

**DB fields:** `customer_addresses`, `customer_store_selections` created.

**Implementation steps:**
1. List artifacts and test commands run.
2. Known limitations (no geocoding SDK).
3. Next: Module 2 Home & Shopping Entry.

**Acceptance criteria:**
- Handoff complete; Module 2 not started.

**Test commands:**
```bash
test -f docs/handoffs/phase-4-customer-location-store-selection-complete.md && \
grep "Module 1" project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md
```

**Depends on:** Ticket 24.

---

## Module closeout

**Phase 4 Module 1 — Customer Location & Store Selection:** `DONE` (Tickets 1–25)

**Next module to ticketize:** **Module 2 — Customer Home & Shopping Entry** (after Ticket 25 DONE)

**Execution order summary:**
```text
1–2 docs → 3–12 backend → 13–15 tests → 16–21 customer app → 22 seed → 23–25 docs/closeout
```
