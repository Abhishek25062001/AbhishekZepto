# Phase 4 Basic Customer Profile — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 12 — Basic Customer Profile  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Module 12 tasks, pages 60–62)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Module 12 micro-tasks, pages 26–28)

**Architecture references (Module 0–11):**  
`docs/architecture/phase-4-customer-shopping-architecture.md`, `docs/architecture/phase-4-backend-file-structure.md`, `docs/architecture/phase-4-customer-app-file-structure.md`, `docs/contracts/customer-address-api.md`, `docs/contracts/customer-app-order-ui-contract.md`, `docs/errors/phase-4-error-codes.md`, `docs/validation/phase-4-validation-rules.md`, `docs/security/phase-4-permissions.md`, `docs/contracts/phase-4-route-mounting-plan.md`, `docs/contracts/backend-route-registry.md`, `docs/handoffs/phase-4-customer-app-order-confirmation-complete.md`, Phase 2 `user_identities` model (`backend/api/src/modules/auth/models/user-identity.model.ts`)

**Prerequisites:**  
Phase 2 **Customer auth** (`authenticate` + `CUSTOMER` role); Phase 4 **Module 1** (addresses — profile screen links to address management); **Module 11** (Profile screen already has **My orders** entry).

**PDF vs Module 0 alignment (implement using existing contracts):**

| PDF / legacy | Implementation |
|--------------|----------------|
| View profile | `GET /api/v1/customer/profile` — own `user_identities` record |
| Update profile | `PATCH /api/v1/customer/profile` — `name`, `email` only |
| Profile screen | Customer app `Profile` route — display + edit form |
| Phone | Read-only (from auth identity; not PATCHable in Phase 4) |
| Addresses | Link **Manage addresses** → `Addresses` stack (Module 1) |
| Orders / sessions | Keep Module 11 **My orders** + Phase 2 **Sessions** + logout |
| Permissions | Role-only `CUSTOMER` (optional `profile:read` / `profile:update` deferred) |
| Storage | `user_identities` collection — no new `customers` collection |

**Out of scope for this module:**
- Phone number change / OTP re-verification
- Profile image upload (`profile_image` media purpose)
- Password or account deletion flows
- Admin/vendor/delivery profile APIs
- Full account settings (notifications, preferences)
- `packages/shared` profile types unless one ticket adds minimal mirrors
- Repository & Codebase Setup (Phase 1)
- Replacing Phase 2 auth/login screens

**Execution order notes:**
- Run **Tickets 1–2** (docs/contracts) before backend code.
- Run **Tickets 3–11** (backend scaffold → HTTP → tests) before customer-app code.
- Run **Tickets 12–22** (app scaffold → Profile screen) after backend routes pass.
- Run **Tickets 23–25** (app tests, docs/registry) then handoff (Ticket 26).

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-19)

---

## Ticket 1 — Module 12 implementation alignment docs

**Ticket:** 1 — Module 12 implementation alignment docs

**Objective:** Document profile API scope, `user_identities` field usage, customer-app screen behavior, and Module 1/11 links before coding.

**Files to create/update:**
- `docs/architecture/basic-customer-profile.md` (create)
- `docs/testing/basic-customer-profile-verification.md` (create)

**API endpoints:** Document:
- `GET /api/v1/customer/profile`
- `PATCH /api/v1/customer/profile`

**DB fields:** `user_identities`: `phone` (read), `name`, `email`, `role=customer`, `accountStatus`; no new collection.

**Implementation steps:**
1. Backend reads/updates authenticated customer's own identity (`req.user.userId`).
2. GET returns `customerId`, `phone`, `name`, `email` (nullable fields as stored).
3. PATCH accepts partial `{ name?, email? }`; validate length/format; `email` lowercase trim.
4. App: replace dev-only profile debug UI with production form; keep orders/sessions/logout.
5. Link to `Addresses` for delivery location management (Module 1).
6. QA: customer `9999999999`, OTP `123456`.

**Acceptance criteria:**
- Docs match AllPhase Module 12 + PDF pages 26–28; no application code.

**Test commands:**
```bash
test -f docs/architecture/basic-customer-profile.md && \
test -f docs/testing/basic-customer-profile-verification.md && \
echo PASS
```

**Depends on:** Phase 4 Modules 1–11 complete; Phase 2 auth.

---

## Ticket 2 — Customer profile API contract and schema

**Ticket:** 2 — Customer profile API contract and schema

**Objective:** Create `customer-profile-api.md`, document `user_identities` profile fields, and expand validation rules.

**Files to create/update:**
- `docs/contracts/customer-profile-api.md` (create)
- `docs/database/customer-profile-schema.md` (create — maps to `user_identities`)
- `docs/validation/phase-4-validation-rules.md` (update — expand Profile section with PATCH rules)
- `docs/contracts/customer-app-profile-ui-contract.md` (create — PLANNED)

**API endpoints:**
- `GET /api/v1/customer/profile`
- `PATCH /api/v1/customer/profile`

**DB fields:** `phone`, `name`, `email`, `role`, `accountStatus`, `cityId` (read-only in GET if present); PATCH writable: `name`, `email` only.

**Implementation steps:**
1. GET response JSON example with nullable `name`/`email`.
2. PATCH body: optional `name` (1–100 chars), optional `email` (valid email or null to clear).
3. Errors: `PROFILE_VALIDATION_FAILED` (422), `USER_NOT_FOUND` (404).
4. App contract: hooks, form fields, navigation links (orders, addresses, sessions).

**Acceptance criteria:**
- Contract implementable without guessing profile persistence.

**Test commands:**
```bash
grep -q "GET /api/v1/customer/profile" docs/contracts/customer-profile-api.md && \
grep -q "PATCH /api/v1/customer/profile" docs/contracts/customer-profile-api.md && \
grep -q "Profile" docs/validation/phase-4-validation-rules.md && \
echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Backend profile module scaffold

**Ticket:** 3 — Backend profile module scaffold

**Objective:** Create `profile/` folder layout per `phase-4-backend-file-structure.md`.

**Files to create/update:**
- `backend/api/src/modules/profile/` (create dirs: `services/`, `controllers/`, `routes/`, `validators/`, `types/`, `utils/`, `repositories/` — remove `.gitkeep` as files added)

**API endpoints:** None.

**DB fields:** N/A.

**Implementation steps:**
1. Scaffold per backend file structure doc.
2. No business logic in this ticket.

**Acceptance criteria:**
- Folder tree exists; typecheck passes.

**Test commands:**
```bash
test -d backend/api/src/modules/profile/services && \
npm run typecheck -w backend/api
```

**Depends on:** Ticket 2.

---

## Ticket 4 — Profile types and response DTOs

**Ticket:** 4 — Profile types and response DTOs

**Objective:** Define `CustomerProfileResponse`, `UpdateCustomerProfileInput` types.

**Files to create/update:**
- `backend/api/src/modules/profile/types/profile.types.ts` (create)

**API endpoints:** Maps GET/PATCH payloads per contract.

**DB fields:** Maps `user_identities` fields to API DTOs.

**Implementation steps:**
1. `CustomerProfileResponse`: `customerId`, `phone`, `name`, `email`.
2. `UpdateCustomerProfileBody`: optional `name`, `email` (string | null).
3. Export types for service, mapper, validators.

**Acceptance criteria:**
- Types compile.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 3.

---

## Ticket 5 — Profile repository

**Ticket:** 5 — Profile repository

**Objective:** Data access to read/update customer profile on `user_identities`.

**Files to create/update:**
- `backend/api/src/modules/profile/repositories/profile.repository.ts` (create)

**API endpoints:** N/A (data layer).

**DB fields:** Read/update `name`, `email` on `user_identities` where `_id=customerId`, `role=customer`, `isDeleted=false`.

**Implementation steps:**
1. `findCustomerProfileById(customerId)`.
2. `updateCustomerProfileById(customerId, { name?, email? })`.
3. Reuse `UserIdentityModel` from auth module (import model; do not duplicate schema).

**Acceptance criteria:**
- Repository compiles.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 4.

---

## Ticket 6 — Profile response mapper

**Ticket:** 6 — Profile response mapper

**Objective:** Map `UserIdentityRecord` to API response DTO.

**Files to create/update:**
- `backend/api/src/modules/profile/utils/profile-response.mapper.ts` (create)

**API endpoints:** N/A.

**DB fields:** Maps `_id` → `customerId`, includes `phone`, `name`, `email`.

**Implementation steps:**
1. `toCustomerProfileResponse(user)`.
2. Normalize null `name`/`email`.

**Acceptance criteria:**
- Mapper compiles.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 4.

---

## Ticket 7 — Profile service (get and update)

**Ticket:** 7 — Profile service (get and update)

**Objective:** Implement `getCustomerProfile` and `updateCustomerProfile`.

**Files to create/update:**
- `backend/api/src/modules/profile/services/profile.service.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/profile`
- `PATCH /api/v1/customer/profile`

**DB fields:** Via repository on `user_identities`.

**Implementation steps:**
1. GET: load by `customerId`; 404 `USER_NOT_FOUND` if missing or not `CUSTOMER` role.
2. PATCH: validate body; update allowed fields only; return updated profile.
3. Reject PATCH on `phone`, `role`, `permissions`, `accountStatus`.
4. Email: trim, lowercase; allow `null` to clear.

**Acceptance criteria:**
- Service compiles; only own profile updated.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 5–6.

---

## Ticket 8 — Profile validators and error mapper

**Ticket:** 8 — Profile validators and error mapper

**Objective:** Zod validators for PATCH body; map validation errors to `PROFILE_VALIDATION_FAILED`.

**Files to create/update:**
- `backend/api/src/modules/profile/validators/profile.validators.ts` (create)
- `backend/api/src/modules/profile/utils/profile-error.mapper.ts` (create)
- `backend/api/src/errors/error-codes.ts` (update — `PROFILE_VALIDATION_FAILED` if missing)
- `docs/errors/phase-4-error-codes.md` (update — note implemented Module 12)

**API endpoints:** PATCH body validation.

**DB fields:** N/A.

**Implementation steps:**
1. `updateProfileBodyValidator`: `name` optional string 1–100 or null; `email` optional email or null.
2. Map Zod failures → `PROFILE_VALIDATION_FAILED` (422).
3. Register code in global `error-codes.ts`.

**Acceptance criteria:**
- Invalid email rejected before service.

**Test commands:**
```bash
grep PROFILE_VALIDATION_FAILED backend/api/src/errors/error-codes.ts && \
npm run typecheck -w backend/api
```

**Depends on:** Ticket 7.

---

## Ticket 9 — Profile controller, routes, and mount

**Ticket:** 9 — Profile controller, routes, and mount

**Objective:** HTTP layer for customer profile endpoints.

**Files to create/update:**
- `backend/api/src/modules/profile/controllers/profile.controller.ts` (create)
- `backend/api/src/modules/profile/routes/customer-profile.routes.ts` (create)
- `backend/api/src/routes/v1/customer.routes.ts` (update — `router.use('/profile', ...)`)

**API endpoints:**
- `GET /api/v1/customer/profile`
- `PATCH /api/v1/customer/profile`

**DB fields:** Via service.

**Implementation steps:**
1. Chain: `authenticate` → `requireRole([CUSTOMER])` → validate (PATCH) → controller.
2. `customerId` from `req.user.userId`.
3. Standard API envelope via `sendSuccessResponse`.

**Acceptance criteria:**
- Routes mounted per `phase-4-route-mounting-plan.md`.

**Test commands:**
```bash
npm run typecheck -w backend/api && npm run build -w backend/api
```

**Depends on:** Ticket 8.

---

## Ticket 10 — Profile service unit tests

**Ticket:** 10 — Profile service unit tests

**Objective:** Service tests for get/update with mocked repository.

**Files to create/update:**
- `backend/api/src/modules/profile/services/profile.service.test.ts` (create)

**API endpoints:** Service-level.

**DB fields:** Mocked.

**Implementation steps:**
1. GET returns mapped profile.
2. GET 404 when user missing.
3. PATCH updates name/email.
4. PATCH validation failure throws `PROFILE_VALIDATION_FAILED`.

**Acceptance criteria:**
- Service tests pass.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/profile/services/profile.service.test.js
```

**Depends on:** Ticket 9.

---

## Ticket 11 — Profile route tests and package script

**Ticket:** 11 — Profile route tests and package script

**Objective:** Route smoke tests and `test:customer-profile` npm script (backend).

**Files to create/update:**
- `backend/api/src/modules/profile/routes/customer-profile.routes.test.ts` (create)
- `backend/api/package.json` (update — `test:customer-profile` script)

**API endpoints:** Route registration for GET, PATCH.

**DB fields:** N/A.

**Implementation steps:**
1. Assert router exposes GET `/` and PATCH `/`.
2. Validator rejects invalid email on PATCH.
3. Script runs profile service + route tests.

**Acceptance criteria:**
- `npm run test:customer-profile -w backend/api` passes.

**Test commands:**
```bash
npm run test:customer-profile -w backend/api
```

**Depends on:** Ticket 10.

---

## Ticket 12 — Customer app profile module scaffold

**Ticket:** 12 — Customer app profile module scaffold

**Objective:** Create `modules/profile/` folder layout per customer-app file structure.

**Files to create/update:**
- `apps/customer-app/src/modules/profile/` (create dirs: `api/`, `hooks/`, `screens/`, `components/`, `types/`, `utils/`)

**API endpoints:** None.

**DB fields:** N/A.

**Implementation steps:**
1. Scaffold per `phase-4-customer-app-file-structure.md`.
2. No business logic yet.

**Acceptance criteria:**
- Folder tree exists; typecheck passes.

**Test commands:**
```bash
test -d apps/customer-app/src/modules/profile/api && \
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 11 (backend APIs available for integration).

---

## Ticket 13 — Customer profile client types

**Ticket:** 13 — Customer profile client types

**Objective:** TypeScript types aligned with profile API contract.

**Files to create/update:**
- `apps/customer-app/src/modules/profile/types/profile.types.ts` (create)

**API endpoints:** Maps GET/PATCH payloads.

**DB fields:** N/A — client DTOs: `customerId`, `phone`, `name`, `email`.

**Implementation steps:**
1. `CustomerProfile`, `UpdateCustomerProfileInput`.
2. Form state type for controlled inputs.

**Acceptance criteria:**
- Types compile.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 12.

---

## Ticket 14 — Customer profile API client

**Ticket:** 14 — Customer profile API client

**Objective:** HTTP client for profile GET and PATCH.

**Files to create/update:**
- `apps/customer-app/src/modules/profile/api/customer-profile.api.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/profile`
- `PATCH /api/v1/customer/profile`

**DB fields:** N/A.

**Implementation steps:**
1. `getCustomerProfile()`.
2. `updateCustomerProfile(input)`.
3. Use `apiClient` + `ApiSuccessResponse` unwrap pattern.

**Acceptance criteria:**
- API client compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 13.

---

## Ticket 15 — Profile query keys and error message util

**Ticket:** 15 — Profile query keys and error message util

**Objective:** React Query keys and `PROFILE_*` error mapping for the app.

**Files to create/update:**
- `apps/customer-app/src/modules/profile/utils/profile-query-keys.util.ts` (create)
- `apps/customer-app/src/modules/profile/utils/customer-profile-error-message.util.ts` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. `profileKeys.detail()`.
2. Map `PROFILE_VALIDATION_FAILED`, `USER_NOT_FOUND`, network errors.

**Acceptance criteria:**
- Utils compile.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 12.

---

## Ticket 16 — useCustomerProfile and useUpdateCustomerProfile hooks

**Ticket:** 16 — useCustomerProfile and useUpdateCustomerProfile hooks

**Objective:** React Query hooks for load and save profile.

**Files to create/update:**
- `apps/customer-app/src/modules/profile/hooks/useCustomerProfile.ts` (create)
- `apps/customer-app/src/modules/profile/hooks/useUpdateCustomerProfile.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/profile`
- `PATCH /api/v1/customer/profile`

**DB fields:** N/A.

**Implementation steps:**
1. `useQuery` for profile with `profileKeys.detail()`.
2. `useMutation` for PATCH; invalidate profile query on success.
3. Expose loading/error states and error messages via util.

**Acceptance criteria:**
- Hooks compile.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 14–15.

---

## Ticket 17 — Profile form and field components

**Ticket:** 17 — Profile form and field components

**Objective:** Editable name/email form and read-only phone display.

**Files to create/update:**
- `apps/customer-app/src/modules/profile/components/ProfilePhoneField.tsx` (create — read-only)
- `apps/customer-app/src/modules/profile/components/ProfileForm.tsx` (create — name, email inputs, save)

**API endpoints:** N/A.

**DB fields:** Displays `phone`, edits `name`, `email`.

**Implementation steps:**
1. Controlled inputs from profile query data.
2. Save button calls `useUpdateCustomerProfile`.
3. Show inline validation errors from API (`PROFILE_VALIDATION_FAILED`).
4. Match existing `TextInput`/form patterns from address forms if available.

**Acceptance criteria:**
- Components compile; phone not editable.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 16.

---

## Ticket 18 — Profile error and loading states

**Ticket:** 18 — Profile error and loading states

**Objective:** Reusable loading/error UI for profile screen.

**Files to create/update:**
- `apps/customer-app/src/modules/profile/components/ProfileErrorState.tsx` (create)
- Use shared `Loader` on screen for loading (no new component unless needed)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. `ProfileErrorState`: message + retry (`refetch`).
2. Mirror order/cart error component patterns.

**Acceptance criteria:**
- Error state compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 15.

---

## Ticket 19 — CustomerProfileScreen

**Ticket:** 19 — CustomerProfileScreen

**Objective:** Production profile screen replacing dev debug UI; integrate form and navigation links.

**Files to create/update:**
- `apps/customer-app/src/modules/profile/screens/CustomerProfileScreen.tsx` (create)
- `apps/customer-app/src/app/MainNavigator.tsx` (update — import `CustomerProfileScreen` instead of `ProfileScreen`)
- `apps/customer-app/src/screens/main/ProfileScreen.tsx` (update — re-export from module or deprecate with thin wrapper)

**API endpoints:**
- `GET /api/v1/customer/profile`
- `PATCH /api/v1/customer/profile`

**DB fields:** N/A.

**Implementation steps:**
1. Load profile via `useCustomerProfile`; show `ProfileForm`.
2. Remove dev-only token/permission debug lines (or gate behind `isDevelopment` only).
3. Keep **My orders** (Module 11), **Manage sessions**, **Logout**.
4. Add **Manage addresses** → `navigation.navigate('Addresses', { screen: 'AddressList' })`.
5. Screen title: Customer Profile.

**Acceptance criteria:**
- `Profile` route shows editable name/email and read-only phone; typecheck passes.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 17–18.

---

## Ticket 20 — Client profile validation util

**Ticket:** 20 — Client profile validation util

**Objective:** Lightweight client-side checks before PATCH (mirror server rules).

**Files to create/update:**
- `apps/customer-app/src/modules/profile/utils/customer-profile-validation.util.ts` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. `validateProfileInput({ name?, email? })` — name length, email format.
2. Used by `ProfileForm` before submit (non-blocking if server is source of truth).

**Acceptance criteria:**
- Util compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 13.

---

## Ticket 21 — Profile util unit tests and app package script

**Ticket:** 21 — Profile util unit tests and app package script

**Objective:** Unit tests for error mapping and validation; `test:customer-profile` script (customer-app).

**Files to create/update:**
- `apps/customer-app/src/modules/profile/utils/customer-profile-error-message.util.test.ts` (create)
- `apps/customer-app/src/modules/profile/utils/customer-profile-validation.util.test.ts` (create)
- `apps/customer-app/tsconfig.profile-test.json` (create)
- `apps/customer-app/package.json` (update — `test:customer-profile` script)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Assert `PROFILE_VALIDATION_FAILED` message mapping.
2. Assert validation rejects invalid email / long name.
3. Script compiles test tsconfig and runs `node --test`.

**Acceptance criteria:**
- `npm run test:customer-profile -w apps/customer-app` passes.

**Test commands:**
```bash
npm run test:customer-profile -w apps/customer-app
```

**Depends on:** Tickets 15, 20.

---

## Ticket 22 — Contract, registry, and architecture doc updates

**Ticket:** 22 — Contract, registry, and architecture doc updates

**Objective:** Mark profile APIs and UI IMPLEMENTED in docs and registry.

**Files to create/update:**
- `docs/contracts/customer-profile-api.md` (update — status IMPLEMENTED)
- `docs/contracts/customer-app-profile-ui-contract.md` (update — status IMPLEMENTED)
- `docs/contracts/backend-route-registry.md` (update — profile routes IMPLEMENTED)
- `docs/contracts/phase-4-route-mounting-plan.md` (update — Profile IMPLEMENTED)
- `docs/architecture/phase-4-backend-file-structure.md` (update — `profile/` IMPLEMENTED)
- `docs/architecture/phase-4-customer-app-file-structure.md` (update — `profile/` IMPLEMENTED)

**API endpoints:** Both profile routes → **IMPLEMENTED**

**DB fields:** Documented as live on `user_identities`.

**Implementation steps:**
1. Link architecture + verification docs.
2. Note profile image / phone change out of scope.

**Acceptance criteria:**
- Registry lists GET/PATCH profile.

**Test commands:**
```bash
grep -q "customer/profile" docs/contracts/backend-route-registry.md && \
grep -q "IMPLEMENTED" docs/contracts/customer-profile-api.md && \
echo PASS
```

**Depends on:** Tickets 11, 19, 21.

---

## Ticket 23 — Module 12 verification checklist and smoke results

**Ticket:** 23 — Module 12 verification checklist and smoke results

**Objective:** Verification checklist and smoke template for profile flow.

**Files to create/update:**
- `docs/testing/basic-customer-profile-verification.md` (update — checkboxes)
- `docs/testing/phase-4-module-12-smoke-results.md` (create)

**API endpoints:** Checklist covers GET profile, PATCH name/email, app save.

**DB fields:** Verify `user_identities.name` / `email` updated in MongoDB (operator).

**Implementation steps:**
1. GET profile returns phone + name/email.
2. PATCH updates name; persists on reload.
3. App Profile screen shows saved values.
4. Invalid email → 422 + user message.
5. Links: My orders, Manage addresses, Sessions work.

**Acceptance criteria:**
- Smoke results file exists.

**Test commands:**
```bash
test -f docs/testing/phase-4-module-12-smoke-results.md && echo PASS
```

**Depends on:** Ticket 22.

---

## Ticket 24 — Module 12 handoff and project context closeout

**Ticket:** 24 — Module 12 handoff and project context closeout

**Objective:** Close Module 12; update handoff files.

**Files to create/update:**
- `docs/handoffs/phase-4-basic-customer-profile-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — Module 12 DONE)
- `project-context/CURRENT_PROGRESS.md` (update)
- `docs/reviews/phase-4-basic-customer-profile-execution-tickets.md` (update — all DONE)

**API endpoints:** Summary of GET/PATCH profile APIs.

**DB fields:** `user_identities` profile fields live.

**Implementation steps:**
1. List artifacts, test commands (backend + app).
2. Known limitations: no profile image, phone read-only.
3. Next: Module 13 Customer App Search & Browsing Improvements.

**Acceptance criteria:**
- Handoff complete; Module 13 not started.

**Test commands:**
```bash
test -f docs/handoffs/phase-4-basic-customer-profile-complete.md && \
grep "Module 12" project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md
```

**Depends on:** Ticket 23.

---

## Module closeout

**Phase 4 Module 12 — Basic Customer Profile:** `DONE` (Tickets 1–24)

**Next module to implement:** **Module 13 — Customer App Search & Browsing Improvements**

**Execution order summary:**
```text
1–2 docs → 3–11 backend (scaffold → HTTP → tests)
→ 12–21 customer app (scaffold → Profile screen → tests)
→ 22–24 closeout
```
