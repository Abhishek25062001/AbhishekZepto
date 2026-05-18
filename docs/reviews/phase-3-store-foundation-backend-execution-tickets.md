# Phase 3 Store Foundation Backend — CURSOR Execution Tickets

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** Store Foundation Backend  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` pages 71–103  

**Architecture references:**  
`docs/architecture/catalog-architecture.md`, `project-context/DATABASE_STANDARDS.md`, `docs/contracts/role-permission-contract.md`, `docs/security/audit-log-fields.md`, `docs/standards/api-conventions.md`

**Prerequisites (already in repo):**  
Phase 2 auth/RBAC/tenant scope; Product Variant Management Backend complete (`products`, `product_variants`, `product_units` mounted). `COLLECTION_NAMES.STORES` exists; `locations/*` and `stores/*` runtime modules do not.

**Out of scope for this module:**  
Store Product Mapping, Inventory Foundation, Media upload, vendor/customer store routes, Order Management (store delete active-order check remains stub), `packages/shared` TypeScript files, Repository & Codebase Setup, frontend UIs, full `vendors` master CRUD (validate `vendorId` as ObjectId only per PDF store validators).

**Execution order notes:**
- Run **Ticket 17** (`locations:*` / `stores:*` permissions + global error/audit prep) before **Tickets 19–20** (routes and mount).
- Run **Ticket 18** (controllers) before **Ticket 19** (routes).
- Run **Ticket 12** (service area service) after **Ticket 11** (city service) and city repository.
- Run **Ticket 13** (store service) after **Tickets 11–12** and store/service-area repositories.
- Register **Ticket 26** seeds after all models/repositories exist.

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-18)

---

## Ticket 1 — Store foundation schema and contract docs

**Ticket:** 1 — Store foundation schema and contract docs

**Objective:** Add planning docs for cities, service areas, and stores required by this module (no runtime code).

**Files to create/update:**
- `docs/database/city-schema.md` (create)
- `docs/database/service-area-schema.md` (create)
- `docs/database/store-schema.md` (create)
- `docs/validation/store-foundation-validation-rules.md` (create)
- `docs/security/store-foundation-permissions.md` (create)
- `docs/errors/store-foundation-error-codes.md` (create)

**API endpoints:** Document planned admin routes only (no implementation).

**DB fields:** Document `cities.*`, `service_areas.*`, `stores.*` per PDF pages 71–77, 96–97.

**Implementation steps:**
1. City schema: `name`, `slug`, `state`, `country`, `timezone`, `currencyCode`, `latitude`, `longitude`, `serviceRadiusKm`, `isServiceable`, `status`, soft-delete and audit fields.
2. Service area schema: `cityId`, `name`, `slug`, `description`, `polygon`, `centerLatitude`, `centerLongitude`, `radiusKm`, `isServiceable`, `status`, soft-delete and audit fields.
3. Store schema: `vendorId`, `cityId`, `serviceAreaIds`, address/geo/ops fields, `storeType`, `fulfillmentType`, `isOpen`, `isAcceptingOrders`, `temporaryClosureReason`, `status`, soft-delete and audit fields.
4. Document uniqueness: `cities.slug` (partial), `service_areas.slug+cityId` (partial), `stores.slug+cityId` and `stores.code` (partial).
5. Permissions doc: `locations:read|create|update|delete`, `stores:read|create|update|delete`.
6. Error codes doc: all codes from PDF page 92–93.

**Acceptance criteria:**
- Docs match PDF micro-tasks; no Mongoose or route files created.

**Test commands:**
- `test -f docs/database/city-schema.md && test -f docs/database/store-schema.md && echo PASS`

**Depends on:** Product Variant Management Backend complete.

---

## Ticket 2 — City, service area, and store module scaffolds and constants

**Ticket:** 2 — City, service area, and store module scaffolds and constants

**Objective:** Create folder layouts and enum/error/audit constant files for all three submodules.

**Files to create/update:**
- `backend/api/src/modules/locations/cities/` — `controllers/`, `routes/`, `services/`, `repositories/`, `models/`, `validators/`, `types/`, `constants/`, `utils/`
- `backend/api/src/modules/locations/service-areas/` — same subfolders
- `backend/api/src/modules/stores/` — same subfolders
- `backend/api/src/modules/locations/cities/constants/city-status.constant.ts` — `active`, `inactive`, `archived`
- `backend/api/src/modules/locations/cities/constants/city-error-codes.constant.ts`
- `backend/api/src/modules/locations/cities/constants/city-audit-events.constant.ts`
- `backend/api/src/modules/locations/service-areas/constants/service-area-status.constant.ts`
- `backend/api/src/modules/locations/service-areas/constants/service-area-error-codes.constant.ts`
- `backend/api/src/modules/locations/service-areas/constants/service-area-audit-events.constant.ts`
- `backend/api/src/modules/stores/constants/store-status.constant.ts` — `active`, `inactive`, `suspended`, `archived`
- `backend/api/src/modules/stores/constants/store-type.constant.ts` — `grocery`, `pharmacy`, `restaurant`, `general`, `dark_store`
- `backend/api/src/modules/stores/constants/fulfillment-type.constant.ts` — `delivery`, `pickup`, `delivery_and_pickup`
- `backend/api/src/modules/stores/constants/store-error-codes.constant.ts`
- `backend/api/src/modules/stores/constants/store-audit-events.constant.ts`

**API endpoints:** None.

**DB fields:** Constants only.

**Implementation steps:**
1. City errors: `CITY_NOT_FOUND`, `CITY_SLUG_ALREADY_EXISTS`, `CITY_HAS_ACTIVE_SERVICE_AREAS`, `CITY_HAS_ACTIVE_STORES`, `INVALID_CITY_STATUS`, `CITY_NOT_SERVICEABLE`.
2. Service area errors: `SERVICE_AREA_NOT_FOUND`, `SERVICE_AREA_SLUG_ALREADY_EXISTS`, `SERVICE_AREA_HAS_ACTIVE_STORES`, `INVALID_SERVICE_AREA_STATUS`, `INVALID_SERVICE_AREA_CITY`, `SERVICE_AREA_NOT_SERVICEABLE`.
3. Store errors: `STORE_NOT_FOUND`, `STORE_SLUG_ALREADY_EXISTS`, `STORE_CODE_ALREADY_EXISTS`, `STORE_HAS_ACTIVE_ORDERS`, `INVALID_STORE_STATUS`, `INVALID_STORE_TYPE`, `INVALID_FULFILLMENT_TYPE`, `INVALID_STORE_CITY`, `INVALID_STORE_SERVICE_AREA`, `TEMPORARY_CLOSURE_REASON_REQUIRED`, `STORE_CODE_IMMUTABLE`.
4. Audit events per PDF page 93: `location.city_*`, `location.service_area_*`, `store.created`, `store.updated`, `store.deleted`, `store.open_status_changed`, `store.order_acceptance_changed`.

**Acceptance criteria:**
- All three folder trees exist; no models, routes, or services yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 1.

---

## Ticket 3 — City Mongoose model and indexes

**Ticket:** 3 — City Mongoose model and indexes

**Objective:** Implement `CityModel` for collection `cities`.

**Files to create/update:**
- `backend/api/src/modules/locations/cities/models/city.model.ts`
- `backend/api/src/database/constants/collection-names.constants.ts` — add `CITIES: 'cities'`

**API endpoints:** None.

**DB fields:** All city fields from Ticket 1.

**Implementation steps:**
1. Partial unique index: `{ slug: 1 }` where `isDeleted: false`.
2. Indexes: `status`, `isServiceable`, `isDeleted`, `createdAt`.
3. Use `baseSchemaFields` soft-delete pattern.

**Acceptance criteria:**
- Model compiles; enums match Ticket 2.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 4 — Service area Mongoose model and indexes

**Ticket:** 4 — Service area Mongoose model and indexes

**Objective:** Implement `ServiceAreaModel` for collection `service_areas`.

**Files to create/update:**
- `backend/api/src/modules/locations/service-areas/models/service-area.model.ts`
- `backend/api/src/database/constants/collection-names.constants.ts` — add `SERVICE_AREAS: 'service_areas'`

**API endpoints:** None.

**DB fields:** All service area fields from Ticket 1; `cityId` ref `City`.

**Implementation steps:**
1. Partial unique compound index: `{ cityId: 1, slug: 1 }` where `isDeleted: false`.
2. Indexes: `cityId`, `status`, `isServiceable`, `isDeleted`, `createdAt`.

**Acceptance criteria:**
- Model compiles; no service or route code.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 5 — Store Mongoose model and indexes

**Ticket:** 5 — Store Mongoose model and indexes

**Objective:** Implement `StoreModel` for collection `stores` (confirm `COLLECTION_NAMES.STORES`).

**Files to create/update:**
- `backend/api/src/modules/stores/models/store.model.ts`

**API endpoints:** None.

**DB fields:** All store fields from Ticket 1; `serviceAreaIds` as ObjectId array; `vendorId`, `cityId` refs.

**Implementation steps:**
1. Partial unique: `{ cityId: 1, slug: 1 }` where `isDeleted: false`.
2. Partial unique: `{ code: 1 }` where `isDeleted: false`.
3. Indexes: `vendorId`, `cityId`, `serviceAreaIds`, `status`, `isOpen`, `isAcceptingOrders`, `storeType`, `fulfillmentType`.
4. Defaults on create (service layer): `isOpen: true`, `isAcceptingOrders: true`.

**Acceptance criteria:**
- Model compiles; store status enum includes `suspended`.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 6 — City types, slug utility, and response mapper

**Ticket:** 6 — City types, slug utility, and response mapper

**Objective:** TypeScript contracts and API mapping for city admin layer.

**Files to create/update:**
- `backend/api/src/modules/locations/cities/types/city.types.ts`
- `backend/api/src/modules/locations/cities/utils/city-slug.util.ts`
- `backend/api/src/modules/locations/cities/utils/city-response.mapper.ts`

**API endpoints:** None (response shape only).

**DB fields:** Excludes `isDeleted`, `deletedAt`, `createdBy`, `updatedBy`, `__v` from responses.

**Implementation steps:**
1. Types: `CityStatus`, `CityDocument`, `CreateCityInput`, `UpdateCityInput`, `CityListQuery`, `CityResponse`.
2. Slug util: URL-safe slug from city name (category/brand pattern).
3. Mapper: `_id` → `id`.

**Acceptance criteria:**
- Types align with `store-foundation-validation-rules.md`.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 3.

---

## Ticket 7 — Service area types, slug utility, and response mapper

**Ticket:** 7 — Service area types, slug utility, and response mapper

**Objective:** TypeScript contracts and API mapping for service area admin layer.

**Files to create/update:**
- `backend/api/src/modules/locations/service-areas/types/service-area.types.ts`
- `backend/api/src/modules/locations/service-areas/utils/service-area-slug.util.ts`
- `backend/api/src/modules/locations/service-areas/utils/service-area-response.mapper.ts`

**API endpoints:** None.

**DB fields:** Stringify `cityId`; exclude internal fields from responses.

**Implementation steps:**
1. Types: `ServiceAreaStatus`, `ServiceAreaDocument`, `CreateServiceAreaInput`, `UpdateServiceAreaInput`, `ServiceAreaListQuery`, `ServiceAreaResponse`.

**Acceptance criteria:**
- Mapper stable for CRUD responses.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 4.

---

## Ticket 8 — Store types, slug/code utilities, and response mapper

**Ticket:** 8 — Store types, slug/code utilities, and response mapper

**Objective:** TypeScript contracts and API mapping for store admin layer.

**Files to create/update:**
- `backend/api/src/modules/stores/types/store.types.ts`
- `backend/api/src/modules/stores/utils/store-slug.util.ts`
- `backend/api/src/modules/stores/utils/store-code.util.ts` — format `STORE-000001` style per PDF
- `backend/api/src/modules/stores/utils/store-response.mapper.ts`

**API endpoints:** None.

**DB fields:** Types include `StoreOperatingDay`; stringify `vendorId`, `cityId`, `serviceAreaIds`.

**Implementation steps:**
1. Types: `StoreStatus`, `StoreType`, `FulfillmentType`, `StoreDocument`, `CreateStoreInput`, `UpdateStoreInput`, `StoreListQuery`, `StoreResponse`.

**Acceptance criteria:**
- Code util generates normalized unique-friendly codes.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 5.

---

## Ticket 9 — City repository: CRUD, list, and dependency counts

**Ticket:** 9 — City repository: CRUD, list, and dependency counts

**Objective:** Data access for city CRUD, list, and delete-guard counts.

**Files to create/update:**
- `backend/api/src/modules/locations/cities/repositories/city.repository.ts`

**API endpoints:** None.

**DB fields:** Read/write all city fields; list filters: `status`, `isServiceable`, `search`; pagination and sort.

**Implementation steps:**
1. `createCity`, `findCityById`, `findCityBySlug` (optional `excludeId`), `updateCityById`, `softDeleteCityById`.
2. `listCities(query)`.
3. `countActiveServiceAreasByCity(cityId)` — delegate import from service-area repository or implement cross-collection count here per PDF delete rules.
4. `countActiveStoresByCity(cityId)` — import from store repository count helper.

**Acceptance criteria:**
- Default filter `isDeleted: false`; invalid ObjectIds return null/0 safely.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 6.

---

## Ticket 10 — Service area repository: CRUD, list, and dependency counts

**Ticket:** 10 — Service area repository: CRUD, list, and dependency counts

**Objective:** Data access for service area CRUD, list, and delete-guard counts.

**Files to create/update:**
- `backend/api/src/modules/locations/service-areas/repositories/service-area.repository.ts`

**API endpoints:** None.

**DB fields:** List filters: `cityId`, `status`, `isServiceable`, `search`.

**Implementation steps:**
1. `createServiceArea`, `findServiceAreaById`, `findServiceAreaBySlug(cityId, slug, excludeId?)`, `updateServiceAreaById`, `softDeleteServiceAreaById`.
2. `listServiceAreas(query)`.
3. `countActiveServiceAreasByCity(cityId)`.
4. `countActiveStoresByServiceArea(serviceAreaId)`.

**Acceptance criteria:**
- Slug uniqueness scoped to `cityId`.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 7.

---

## Ticket 11 — Store repository: CRUD, list, and dependency counts

**Ticket:** 11 — Store repository: CRUD, list, and dependency counts

**Objective:** Data access for store CRUD, list, and delete-guard counts.

**Files to create/update:**
- `backend/api/src/modules/stores/repositories/store.repository.ts`

**API endpoints:** None.

**DB fields:** List filters: `vendorId`, `cityId`, `serviceAreaId` (array match), `status`, `isOpen`, `isAcceptingOrders`, `storeType`, `fulfillmentType`, `search`.

**Implementation steps:**
1. `createStore`, `findStoreById`, `findStoreBySlug(cityId, slug, excludeId?)`, `findStoreByCode(code, excludeId?)`, `updateStoreById`, `softDeleteStoreById`.
2. `listStores(query)`.
3. `countActiveStoresByCity(cityId)`.
4. `countActiveStoresByServiceArea(serviceAreaId)`.

**Acceptance criteria:**
- Slug uniqueness scoped to `cityId`; code globally unique among non-deleted stores.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 8.

---

## Ticket 12 — City, service area, and store request validators

**Ticket:** 12 — City, service area, and store request validators

**Objective:** Zod schemas for all admin CRUD bodies, params, and list queries per PDF pages 80–83.

**Files to create/update:**
- `backend/api/src/modules/locations/cities/validators/city.validators.ts`
- `backend/api/src/modules/locations/service-areas/validators/service-area.validators.ts`
- `backend/api/src/modules/stores/validators/store.validators.ts`

**API endpoints:** Validates all 15 admin endpoints (5 per entity).

**DB fields:** Field rules per `store-foundation-validation-rules.md`; store update: `temporaryClosureReason` required when `isOpen` or `isAcceptingOrders` set false (superRefine).

**Implementation steps:**
1. Reuse `paginationValidator`, `mongoObjectIdValidator`.
2. City create: required `name`, `state`, `country`, `timezone`, `currencyCode`.
3. Service area create: required `cityId`, `name`.
4. Store create: required `vendorId`, `cityId`, `name`, `phone`, `addressLine1`, `pincode`, `latitude`, `longitude`, `serviceRadiusKm`, `openingTime`, `closingTime`, `operatingDays`, `storeType`, `fulfillmentType`.
5. Store update: `code` not accepted (immutable); closure reason rule on partial update.

**Acceptance criteria:**
- No service imports in validators.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 6–8.

---

## Ticket 13 — City service: CRUD and delete guards

**Ticket:** 13 — City service: CRUD and delete guards

**Objective:** Business logic for city admin CRUD.

**Files to create/update:**
- `backend/api/src/modules/locations/cities/services/city.service.ts`

**API endpoints:**
- `POST|GET /api/v1/admin/locations/cities`
- `GET|PATCH|DELETE /api/v1/admin/locations/cities/:cityId`

**DB fields:** Soft delete sets `isDeleted`, `deletedAt`, `status: archived`, `updatedBy`.

**Implementation steps:**
1. Create: slug auto-generate/normalize; duplicate slug → `CITY_SLUG_ALREADY_EXISTS`; default `country` to `India` only when omitted (PDF).
2. Delete: block when `countActiveServiceAreasByCity` or `countActiveStoresByCity` > 0.
3. Audit: `location.city_created`, `location.city_updated`, `location.city_deleted`.

**Acceptance criteria:**
- No route or controller code in this ticket.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 9–10.

---

## Ticket 14 — Service area service: CRUD and city reference validation

**Ticket:** 14 — Service area service: CRUD and city reference validation

**Objective:** Business logic for service area admin CRUD with city validation.

**Files to create/update:**
- `backend/api/src/modules/locations/service-areas/services/service-area.service.ts`
- `backend/api/src/modules/locations/service-areas/services/service-area-city-reference.service.ts` (optional inline)

**API endpoints:**
- `POST|GET /api/v1/admin/locations/service-areas`
- `GET|PATCH|DELETE /api/v1/admin/locations/service-areas/:serviceAreaId`

**DB fields:** On delete block when `countActiveStoresByServiceArea` > 0.

**Implementation steps:**
1. Validate `cityId` exists, active, serviceable, not deleted → `INVALID_SERVICE_AREA_CITY` / `CITY_NOT_SERVICEABLE` / `CITY_NOT_FOUND` per case.
2. Slug unique per city; duplicate → `SERVICE_AREA_SLUG_ALREADY_EXISTS`.
3. Re-validate city when `cityId` changes on update.
4. Audit: `location.service_area_created`, `location.service_area_updated`, `location.service_area_deleted`.

**Acceptance criteria:**
- Service area cannot reference deleted or non-serviceable city.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 10, 13 (city repository readable).

---

## Ticket 15 — Store service: create, list, and get

**Ticket:** 15 — Store service: create, list, and get

**Objective:** Store read/create business logic with location reference validation.

**Files to create/update:**
- `backend/api/src/modules/stores/services/store.service.ts` (partial)
- `backend/api/src/modules/stores/services/store-location-reference.service.ts`

**API endpoints:**
- `POST /api/v1/admin/stores`
- `GET /api/v1/admin/stores`
- `GET /api/v1/admin/stores/:storeId`

**DB fields:** Create defaults: `isOpen: true`, `isAcceptingOrders: true`, `status: active`; auto `code` when omitted.

**Implementation steps:**
1. Validate `cityId` and each `serviceAreaIds[]` entry: exists, belongs to city, active, serviceable, not deleted.
2. Slug unique per city; code unique globally.
3. `vendorId`: validate ObjectId format only (no vendors module in Phase 3).
4. Audit: `store.created` on success.

**Acceptance criteria:**
- Invalid service area for city → `INVALID_STORE_SERVICE_AREA`.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 11, 14.

---

## Ticket 16 — Store service: update and delete

**Ticket:** 16 — Store service: update and delete

**Objective:** Store update/delete with closure rules and order dependency stub.

**Files to create/update:**
- `backend/api/src/modules/stores/services/store.service.ts` (complete)

**API endpoints:**
- `PATCH /api/v1/admin/stores/:storeId`
- `DELETE /api/v1/admin/stores/:storeId`

**DB fields:** Update: `temporaryClosureReason` required when closing (`isOpen` or `isAcceptingOrders` false). Delete: `isOpen: false`, `isAcceptingOrders: false`, `status: archived`.

**Implementation steps:**
1. `code` immutable on update → reject changes with `STORE_CODE_IMMUTABLE`.
2. Re-validate `cityId` / `serviceAreaIds` when changed.
3. Emit `store.open_status_changed` / `store.order_acceptance_changed` audit when those flags change.
4. Delete: stub `countActiveOrdersByStore(storeId)` returning `0` until Order module → block with `STORE_HAS_ACTIVE_ORDERS` when > 0.
5. Audit: `store.updated`, `store.deleted`.

**Acceptance criteria:**
- Soft-deleted store excluded from list/get.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 15.

---

## Ticket 17 — Location/store permissions, global error codes, and audit prep

**Ticket:** 17 — Location/store permissions, global error codes, and audit prep

**Objective:** Register permissions and global error/audit keys **before** mounting routes.

**Files to create/update:**
- `backend/api/src/modules/auth/constants/auth-permission.constants.ts` — add `LOCATIONS: 'locations'` resource
- `backend/api/src/database/seeds/seed-roles.ts` — `locations:*` and `stores:create|update|delete` for `operations_admin` (extend existing `stores:read`)
- `backend/api/src/database/seeds/seed-role-permission-matrix.test.ts`
- `backend/api/src/errors/error-codes.ts` — city, service area, store error keys from Ticket 2
- `backend/api/src/modules/audit/constants/audit-event.constants.ts` — location and store audit events
- `docs/errors/store-foundation-error-codes.md` — mark codes planned→implemented

**API endpoints:** None mounted in this ticket.

**DB fields:** None.

**Implementation steps:**
1. Permission codes: `locations:read|create|update|delete`, `stores:read|create|update|delete`.
2. Do **not** mount location/store routes yet.

**Acceptance criteria:**
- `operations_admin` seed includes location CRUD + store CRUD; `super_admin` wildcard unchanged.
- `npm run test:seed-matrix` passes.

**Test commands:**
- `npm run test:seed-matrix -w backend/api`
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2. Blocks Tickets 19–20.

---

## Ticket 18 — Store foundation controllers

**Ticket:** 18 — Store foundation controllers

**Objective:** HTTP handlers for city, service area, and store admin operations.

**Files to create/update:**
- `backend/api/src/modules/locations/cities/controllers/city.controller.ts`
- `backend/api/src/modules/locations/service-areas/controllers/service-area.controller.ts`
- `backend/api/src/modules/stores/controllers/store.controller.ts`

**API endpoints:** Controllers for all fifteen operations (5 handlers each).

**DB fields:** Pass `req.user.userId` as actor for mutations.

**Implementation steps:**
1. Use `asyncHandler`, `sendPaginatedResponse`, `sendCreatedResponse`, `sendSuccessResponse`.
2. Parse list queries from validated `req.query`.

**Acceptance criteria:**
- No direct Mongoose calls in controllers.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 13–16.

---

## Ticket 19 — City, service area, and store admin routes (unmounted)

**Ticket:** 19 — City, service area, and store admin routes (unmounted)

**Objective:** Express routers with permission middleware for all three entities.

**Files to create/update:**
- `backend/api/src/modules/locations/cities/routes/city-admin.routes.ts`
- `backend/api/src/modules/locations/service-areas/routes/service-area-admin.routes.ts`
- `backend/api/src/modules/stores/routes/store-admin.routes.ts`

**API endpoints:** Fifteen routes per PDF pages 88–91 (5 each).

**DB fields:** None.

**Implementation steps:**
1. City routes: `locations:read|create|update|delete`.
2. Service area routes: same location permissions.
3. Store routes: `stores:read|create|update|delete`.
4. `validateRequest` on body/query/params; export routers only.

**Acceptance criteria:**
- Routers mirror `brand-admin.routes.ts` patterns; not mounted in `admin.routes.ts`.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 12, 17–18.

---

## Ticket 20 — Mount location and store admin routes

**Ticket:** 20 — Mount location and store admin routes

**Objective:** Mount three routers under admin API prefix.

**Files to create/update:**
- `backend/api/src/routes/v1/admin.routes.ts`

**API endpoints:**
- `/api/v1/admin/locations/cities` → `city-admin.routes.ts`
- `/api/v1/admin/locations/service-areas` → `service-area-admin.routes.ts`
- `/api/v1/admin/stores` → `store-admin.routes.ts`

**DB fields:** None.

**Implementation steps:**
1. Apply `authenticate()` + `requireRole` admin roles (same as catalog routes).
2. Existing catalog routes unchanged.

**Acceptance criteria:**
- Fifteen admin endpoints reachable in route tree.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run build -w backend/api`

**Depends on:** Ticket 20.

---

## Ticket 21 — OpenAPI, contract docs, and route registry

**Ticket:** 21 — OpenAPI, contract docs, and route registry

**Objective:** Document implemented city, service area, and store admin APIs.

**Files to create/update:**
- `backend/api/src/docs/openapi/` — add location + store path file or extend existing admin openapi
- `docs/contracts/city-management-api.md` (create)
- `docs/contracts/service-area-management-api.md` (create)
- `docs/contracts/store-management-api.md` (create)
- `docs/contracts/backend-route-registry.md`
- `docs/security/store-foundation-permissions.md` — mark implemented

**API endpoints:** Document all fifteen endpoints with request/response field lists per PDF pages 95–97.

**DB fields:** Document field usage in each contract doc.

**Implementation steps:**
1. OpenAPI placeholder responses (catalog pattern).
2. Registry lists mounted location and store routes separately from catalog.

**Acceptance criteria:**
- Contracts match validators and response mappers.

**Test commands:**
- `npm run build -w backend/api`

**Depends on:** Ticket 20.

---

## Ticket 22 — City service unit tests

**Ticket:** 22 — City service unit tests

**Objective:** Service tests for city CRUD and delete guards (mocked repositories).

**Files to create/update:**
- `backend/api/src/modules/locations/cities/services/city.service.test.ts`

**API endpoints:** None.

**DB fields:** Fixtures for slug, soft delete, dependency counts.

**Implementation steps:**
1. Tests per PDF page 98: create, slug auto/normalize, duplicate slug, update `updatedBy`, soft delete, delete blocked when service areas or stores > 0.
2. Mock `writeAuditLog`.

**Acceptance criteria:**
- Tests pass without live MongoDB.

**Test commands:**
- `npm run build -w backend/api && node --test dist/modules/locations/cities/services/city.service.test.js`

**Depends on:** Ticket 13.

---

## Ticket 23 — Service area service unit tests

**Ticket:** 23 — Service area service unit tests

**Objective:** Service tests for service area CRUD and city validation.

**Files to create/update:**
- `backend/api/src/modules/locations/service-areas/services/service-area.service.test.ts`

**API endpoints:** None.

**DB fields:** `cityId`, slug, soft delete.

**Implementation steps:**
1. Tests per PDF page 98–99: create success; city not found; city not serviceable; slug rules; delete blocked when stores > 0.
2. Mock audit writes.

**Acceptance criteria:**
- Tests pass without MongoDB.

**Test commands:**
- `npm run build -w backend/api && node --test dist/modules/locations/service-areas/services/service-area.service.test.js`

**Depends on:** Ticket 14.

---

## Ticket 24 — Store service unit tests

**Ticket:** 24 — Store service unit tests

**Objective:** Service tests for store CRUD, closure rules, and location validation.

**Files to create/update:**
- `backend/api/src/modules/stores/services/store.service.test.ts`

**API endpoints:** None.

**DB fields:** `code`, `temporaryClosureReason`, `serviceAreaIds`.

**Implementation steps:**
1. Tests per PDF page 99: create success; invalid city; service area wrong city; slug/code uniqueness; closure reason required; soft delete flags; order stub blocks delete when mocked count > 0.

**Acceptance criteria:**
- All store service tests pass without MongoDB.

**Test commands:**
- `npm run build -w backend/api && node --test dist/modules/stores/services/store.service.test.js`

**Depends on:** Ticket 16.

---

## Ticket 25 — Store foundation controller tests

**Ticket:** 25 — Store foundation controller tests

**Objective:** Controller tests with mocked services (five handlers × three entities).

**Files to create/update:**
- `backend/api/src/modules/locations/cities/controllers/city.controller.test.ts`
- `backend/api/src/modules/locations/service-areas/controllers/service-area.controller.test.ts`
- `backend/api/src/modules/stores/controllers/store.controller.test.ts`

**API endpoints:** Exercise success paths for all fifteen handlers.

**DB fields:** None.

**Implementation steps:**
1. Mock service modules; assert 200/201 and `success: true`.
2. Minimum one test per handler (15 total).

**Acceptance criteria:**
- Controller tests pass without HTTP server.

**Test commands:**
- `npm run test:store-foundation -w backend/api` (after Ticket 27)

**Depends on:** Ticket 18, Tickets 22–24.

---

## Ticket 26 — Route integration tests (deferred)

**Ticket:** 26 — Route integration tests (deferred)

**Objective:** Optional route-level auth/permission tests per PDF pages 99–101; align with catalog modules (controller coverage if no harness).

**Files to create/update:**
- `backend/api/src/modules/locations/cities/routes/city-admin.routes.test.ts` (optional)
- `backend/api/src/modules/locations/service-areas/routes/service-area-admin.routes.test.ts` (optional)
- `backend/api/src/modules/stores/routes/store-admin.routes.test.ts` (optional)

**API endpoints:** Test 401, 403 missing `locations:create` / `stores:create`, success paths, duplicate slug/code, `TEMPORARY_CLOSURE_REASON_REQUIRED`.

**DB fields:** None.

**Implementation steps:**
1. If supertest/router harness exists, implement PDF cases; else document deferral in review.

**Acceptance criteria:**
- Either route tests pass OR review documents deferral.

**Test commands:**
- `npm run test:store-foundation -w backend/api` (if route tests added)

**Depends on:** Ticket 20.

---

## Ticket 27 — Location and store seed scripts

**Ticket:** 27 — Location and store seed scripts

**Objective:** Idempotent dev seeds for Delhi city, Dwarka service area, and linked store per PDF pages 101–102.

**Files to create/update:**
- `backend/api/src/database/seeds/seed-locations.ts` (create)
- `backend/api/src/database/seeds/seed-stores.ts` (create)
- `backend/api/src/database/seeds/index.ts` — register after roles; locations before stores

**API endpoints:** None.

**DB fields:** Seed Delhi city, Dwarka service area, one store linked to both (PDF sample values).

**Implementation steps:**
1. `seed-locations.ts`: idempotent upsert by slug/city+name.
2. `seed-stores.ts`: depends on seeded location ids; idempotent by `code` or slug.
3. Dry-run safe like existing seeds.

**Acceptance criteria:**
- `npm run seed:dry -w backend/api` logs planned upserts without error.

**Test commands:**
- `npm run seed:dry -w backend/api`

**Depends on:** Tickets 3–5, 11.

---

## Ticket 28 — Quality gates and npm test entrypoints

**Ticket:** 28 — Quality gates and npm test entrypoints

**Objective:** Add test scripts and verify lint/typecheck for store foundation module.

**Files to create/update:**
- `backend/api/package.json` — `test:cities`, `test:service-areas`, `test:stores`, `test:store-foundation` (aggregate); extend `test:services` / `test:controllers`

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. `test:store-foundation`: all city + service area + store service and controller tests.
2. Run full quality gates.

**Acceptance criteria:**
- `npm run typecheck`, `npm run lint`, `npm run test:store-foundation` pass.
- Existing `npm run test:variants` and catalog tests still pass.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:store-foundation -w backend/api`
- `npm run test:seed-matrix -w backend/api`

**Depends on:** Tickets 22–25, 27.

---

## Ticket 29 — Module review, handoff, and project-context closeout

**Ticket:** 29 — Module review, handoff, and project-context closeout

**Objective:** Close Store Foundation Backend with verification doc and progress updates.

**Files to create/update:**
- `docs/reviews/store-foundation-backend-review.md` (create)
- `docs/handoffs/store-foundation-backend-complete.md` (create)
- `docs/reviews/phase-3-store-foundation-backend-execution-tickets.md` — mark all tickets DONE
- `project-context/CURRENT_PROGRESS.md`
- `project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md`

**API endpoints:** Verify all fifteen admin endpoints in review doc.

**DB fields:** Verify `cities.*`, `service_areas.*`, `stores.*` match schema docs + PDF.

**Implementation steps:**
1. Record verification table: endpoints, permissions, audit, error codes, delete guards.
2. Note pending: `STORE_HAS_ACTIVE_ORDERS` stub until Order Management; route tests if deferred (Ticket 26).
3. Set next module: **Store Product Mapping** per PDF order (do not start Inventory/Media/frontend).

**Acceptance criteria:**
- Handoff marks module complete for static/code verification.
- No Store Product Mapping or Inventory runtime code started.
- Tracker all DONE.

**Test commands:**
- All commands from Ticket 28

**Depends on:** Ticket 28.

---

## Dependency graph (summary)

```text
1 → 2 → 3 → 4 → 5
3 → 6 → 9 → 13
4 → 7 → 10 → 14
5 → 8 → 11 → 15 → 16
6–8 → 12
13 → 14 → 15 → 16
2 → 17 → 18 → 19 → 20 → 21
13–16 → 18 → 19
13–16,20 → 18
13 → 22 → 28
14 → 23 → 28
16 → 24 → 28
20,22–24 → 25 → 28
19 → 26 (optional)
3–5,11 → 27 → 28
28 → 29
```

**Critical path:** 1 → 2 → 3 → 6 → 9 → 13 → 17 → 18 → 19 → 20 → 28 → 29  
(Parallel tracks: service areas 4→7→10→14; stores 5→8→11→15→16)

**Cross-entity order:** Cities before service areas before stores (reference chain).
