# Phase 2 Corrective Execution Tickets

Source of truth for these corrective tickets:
- `docs/reviews/phase-1-2-completion-verification.md`

Scope rules used:
- Only verified Phase 2 gaps are included.
- No new Phase 3 work.
- No Catalog Architecture work.
- No unrelated features.
- Tickets preserve the existing architecture and coding patterns unless the
  verification report explicitly showed a mismatch that must be resolved.
- Where the verification report showed a source-document mismatch that needs a
  product/architecture decision, the ticket explicitly marks `NEEDS VERIFICATION`.

---

## Ticket 1

1. Ticket number  
`1`

2. Ticket title  
Create shared permission contract types and export surface

3. Related Phase/Module  
Phase 2 / Module 5 - Role & Permission System

4. Exact goal  
Fill the missing shared permission typing layer so backend/frontend permission
contracts match the source document and current RBAC utilities.

5. Files to create/update  
- `packages/shared/api/permission.types.ts` (create)
- `packages/shared/api/index.ts` (update)
- `docs/contracts/role-permission-contract.md` (update)
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
No runtime API in this ticket. Contract typing only.

7. DB fields/models to add/update, if any  
None.

8. Permissions/RBAC changes, if any  
No behavior change. Shared type exposure only.

9. Tests to create/update  
- Add or update type-level coverage through existing package typecheck only.

10. Docs/reviews/handoff files to update  
- `docs/contracts/role-permission-contract.md`
- `docs/reviews/phase-1-2-completion-verification.md`
- later module handoff file after execution

11. Acceptance criteria  
- Shared permission types exist and export:
  - permission code
  - permission resource
  - permission action
  - auth role as needed by consumers
- `packages/shared/api/index.ts` exports the new contract types.
- No implementation code outside the shared contract surface is changed in this ticket.

12. Verification commands  
- `npm run typecheck -w packages/shared`
- `rg "permission.types|PermissionCode|PermissionResource|PermissionAction" packages/shared/api`

13. Risk notes  
- Low risk.
- Keep shared typing aligned with current backend permission constants.

14. Status
DONE

---

## Ticket 2

1. Ticket number  
`2`

2. Ticket title  
Add backend role validators and user-permission validators

3. Related Phase/Module  
Phase 2 / Module 5 - Role & Permission System

4. Exact goal  
Create the missing validation layer for role CRUD and user permission mutation
requests expected by the source PDF.

5. Files to create/update  
- `backend/api/src/modules/auth/validators/role.validators.ts` (create)
- `backend/api/src/modules/auth/validators/user-permission.validators.ts` (create)
- `backend/api/src/modules/auth/validators/index.ts` (update)
- `docs/contracts/backend-auth-core-validator-rules.md` (update)
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
Request validation for:
- `GET /api/v1/admin/roles`
- `POST /api/v1/admin/roles`
- `GET /api/v1/admin/roles/:roleId`
- `PATCH /api/v1/admin/roles/:roleId`
- `DELETE /api/v1/admin/roles/:roleId`
- `PATCH /api/v1/admin/users/:userId/permissions`
- `PATCH /api/v1/admin/users/:userId/role`
- `POST /api/v1/admin/users/:userId/sync-role-permissions`

7. DB fields/models to add/update, if any  
None directly.

8. Permissions/RBAC changes, if any  
No permission behavior change in this ticket; validation layer only.

9. Tests to create/update  
- Add validator-focused backend tests if a local validator test pattern exists.
- If no local automated pattern exists, mark `NEEDS VERIFICATION` during execution and add targeted verification steps in docs.

10. Docs/reviews/handoff files to update  
- `docs/contracts/backend-auth-core-validator-rules.md`
- `docs/reviews/phase-1-2-completion-verification.md`

11. Acceptance criteria  
- Missing validator files are created.
- Each route family above has concrete param/body/query validation.
- Permission codes are validated using the current permission-code utility.
- No route starts using unvalidated mutation payloads once this ticket is complete.

12. Verification commands  
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `rg "createRoleValidator|updateUserPermissionsValidator|assignUserRoleValidator|syncUserRolePermissionsValidator" backend/api/src/modules/auth/validators`

13. Risk notes  
- Medium risk if current controller signatures diverge from source request shapes.

14. Status
DONE

---

## Ticket 3

1. Ticket number  
`3`

2. Ticket title  
Implement backend role service and user-permission service

3. Related Phase/Module  
Phase 2 / Module 5 - Role & Permission System

4. Exact goal  
Create the missing service layer for role management and user permission/role
mutation while preserving current permission utility and audit patterns.

5. Files to create/update  
- `backend/api/src/modules/auth/services/role.service.ts` (create)
- `backend/api/src/modules/auth/services/user-permission.service.ts` (create)
- `backend/api/src/modules/auth/services/index.ts` or current service export surface (update if present)
- `backend/api/src/modules/auth/repositories/role.repository.ts` (update as needed)
- `backend/api/src/modules/auth/repositories/user-identity.repository.ts` (update as needed)
- `docs/standards/permission-checking.md` (update if behavior expands)
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
Supports future route/controller work for:
- role CRUD endpoints
- user permission update endpoint
- user role assignment endpoint
- role-permission sync endpoint
- permission introspection endpoint if still missing after service work

7. DB fields/models to add/update, if any  
Potentially update or ensure use of:
- `user_identities.updatedBy`
- `user_identities.updatedAt`
- role mutation audit linkage

8. Permissions/RBAC changes, if any  
- Enforce mutation restrictions for system roles and wildcard permission cases.
- `NEEDS VERIFICATION`: confirm whether current role constants and permission matrix fully match the source PDF before finalizing service rules.

9. Tests to create/update  
- Add backend service tests for:
  - role creation/update/delete rules
  - permission mutation rules
  - wildcard restrictions
  - sync-from-role behavior

10. Docs/reviews/handoff files to update  
- `docs/contracts/role-permission-contract.md`
- `docs/reviews/phase-1-2-completion-verification.md`
- relevant Module 5 review/handoff docs

11. Acceptance criteria  
- Missing service files exist and own the business rules.
- Services reject invalid wildcard and non-editable system-role mutations per source expectations.
- User permission and role mutation paths update audit/update fields consistently.

12. Verification commands  
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `rg "class|const .*roleService|updateUserPermissions|assignUserRole|syncUserPermissionsFromRole" backend/api/src/modules/auth/services`

13. Risk notes  
- Medium-to-high risk because this is the core RBAC mutation layer.
- Avoid changing already-working read-only permission enforcement paths unless required.

14. Status
DONE

---

## Ticket 4

1. Ticket number  
`4`

2. Ticket title  
Add backend role and user-permission controllers/routes plus OpenAPI/contracts

3. Related Phase/Module  
Phase 2 / Module 5 - Role & Permission System

4. Exact goal  
Expose the missing role-management and user-permission mutation APIs that the
verification report found absent.

5. Files to create/update  
- `backend/api/src/modules/auth/controllers/role.controller.ts` (create)
- `backend/api/src/modules/auth/controllers/user-permission.controller.ts` (create)
- `backend/api/src/modules/auth/controllers/index.ts` (update)
- `backend/api/src/routes/v1/admin.routes.ts` (update) or add module-specific mounted route file if that is the existing pattern
- `backend/api/src/docs/openapi/auth.paths.ts` (update) or split path file if repo pattern now prefers it
- `docs/contracts/role-permission-contract.md` (update)
- `docs/contracts/backend-route-registry.md` (update)
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
Add:
- `GET /api/v1/admin/roles`
- `POST /api/v1/admin/roles`
- `GET /api/v1/admin/roles/:roleId`
- `PATCH /api/v1/admin/roles/:roleId`
- `DELETE /api/v1/admin/roles/:roleId`
- `PATCH /api/v1/admin/users/:userId/permissions`
- `PATCH /api/v1/admin/users/:userId/role`
- `POST /api/v1/admin/users/:userId/sync-role-permissions`
- permission introspection endpoint if still missing and if the source PDF requires it separately from `/me/permissions`

7. DB fields/models to add/update, if any  
No schema addition expected if Ticket 3 handled audit/update fields.

8. Permissions/RBAC changes, if any  
- Restrict these endpoints to approved admin roles and permissions.
- `NEEDS VERIFICATION`: confirm exact admin permission gates per endpoint before implementation if not fully recoverable from existing docs.

9. Tests to create/update  
- Backend route/controller tests for all new role/user-permission APIs.
- OpenAPI contract verification updates if such checks already exist.

10. Docs/reviews/handoff files to update  
- `docs/contracts/role-permission-contract.md`
- `docs/contracts/backend-route-registry.md`
- `docs/testing/role-permission-system-verification.md`
- `docs/reviews/phase-1-2-completion-verification.md`

11. Acceptance criteria  
- All missing Module 5 RBAC admin endpoints are mounted and documented.
- Controllers use services rather than inlining mutation logic.
- Route registry and OpenAPI match actual mounted paths.

12. Verification commands  
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run build -w backend/api`
- `rg "/api/v1/admin/roles|sync-role-permissions|users/:userId/permissions" backend/api/src docs/contracts docs/testing`

13. Risk notes  
- High impact because route design becomes externally visible.
- Must keep response format consistent with existing backend conventions.

14. Status
DONE

---

## Ticket 5

1. Ticket number  
`5`

2. Ticket title  
Correct role/permission seed matrix and add backend RBAC verification coverage

3. Related Phase/Module  
Phase 2 / Module 5 - Role & Permission System

4. Exact goal  
Close the verified gap around incomplete proof of seeded permission matrix and
missing backend RBAC verification.

5. Files to create/update  
- `backend/api/src/database/seeds/seed-roles.ts` (update)
- `backend/api/src/database/seeds/seed-auth-users.ts` (update as needed)
- `docs/testing/role-permission-system-verification.md` (update)
- `docs/handoffs/role-permission-system-complete.md` (update)
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
No new runtime API required beyond Ticket 4.

7. DB fields/models to add/update, if any  
- Ensure seeded values populate:
  - `roles.permissions`
  - `user_identities.permissions`

8. Permissions/RBAC changes, if any  
- Seed the full verified permission matrix required by the source PDF.
- `NEEDS VERIFICATION`: confirm any source permissions that differ from currently implemented frontend `CanAccess` usage before final seed finalization.

9. Tests to create/update  
- Add seed verification coverage and backend permission-matrix checks if a local test pattern exists.
- At minimum, expand verification docs with exact seeded-role expectations.

10. Docs/reviews/handoff files to update  
- `docs/testing/role-permission-system-verification.md`
- `docs/handoffs/role-permission-system-complete.md`
- `docs/reviews/phase-1-2-completion-verification.md`

11. Acceptance criteria  
- Seed data and verification docs make the permission matrix provable.
- Verification report no longer needs to say the full matrix could not be proven.

12. Verification commands  
- `npm run typecheck -w backend/api`
- `rg "permissions" backend/api/src/database/seeds/seed-roles.ts backend/api/src/database/seeds/seed-auth-users.ts`

13. Risk notes  
- Medium risk if current frontend permission names and source-document permission names diverge.

14. Status
DONE

---

## Ticket 6

1. Ticket number  
`6`

2. Ticket title  
Create shared tenant-scope types, tenant query helpers, and tenant validators

3. Related Phase/Module  
Phase 2 / Module 6 - Tenant & Store Access Control

4. Exact goal  
Fill the missing tenant-scope contract and helper layer that the verification
report identified.

5. Files to create/update  
- `packages/shared/api/tenant-scope.types.ts` (create)
- `packages/shared/api/index.ts` (update)
- `backend/api/src/database/tenant-query-helpers.ts` (create)
- `backend/api/src/database/index.ts` (update)
- `backend/api/src/validators/tenant.validators.ts` (create)
- `docs/standards/tenant-scoped-queries.md` (create or update)
- `docs/standards/tenant-validation.md` (create or update)
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
No runtime endpoint in this ticket.

7. DB fields/models to add/update, if any  
No schema change; helper/query layer only.

8. Permissions/RBAC changes, if any  
No RBAC change directly.

9. Tests to create/update  
- Backend helper/validator tests for:
  - vendor/store/city/customer/delivery scope normalization
  - query helper filters

10. Docs/reviews/handoff files to update  
- `docs/standards/tenant-scoped-queries.md`
- `docs/standards/tenant-validation.md`
- `docs/reviews/phase-1-2-completion-verification.md`

11. Acceptance criteria  
- Shared tenant types exist and export cleanly.
- Dedicated backend tenant query helpers exist.
- Tenant validators exist for the scope IDs expected by the source PDF.

12. Verification commands  
- `npm run typecheck -w packages/shared`
- `npm run typecheck -w backend/api`
- `rg "tenant-scope|buildVendorScopeFilter|customerIdParamValidator|deliveryAgentIdParamValidator" packages/shared backend/api/src`

13. Risk notes  
- Low-to-medium risk.
- Must avoid duplicating behavior already covered by existing `scope-access` utilities.

14. Status
DONE

---

## Ticket 7

1. Ticket number  
`7`

2. Ticket title  
Add tenant access internal test model, repository, service, controller, and routes

3. Related Phase/Module  
Phase 2 / Module 6 - Tenant & Store Access Control

4. Exact goal  
Implement the missing temporary tenant access test surface expected by the
source PDF so scope enforcement can be verified with concrete records.

5. Files to create/update  
- `backend/api/src/modules/system/models/tenant-access-test.model.ts` (create)
- `backend/api/src/modules/system/models/index.ts` (update if present)
- `backend/api/src/modules/system/repositories/tenant-access-test.repository.ts` (create)
- `backend/api/src/modules/system/services/tenant-access-test.service.ts` (create)
- `backend/api/src/modules/system/controllers/tenant-access-test.controller.ts` (create)
- `backend/api/src/modules/system/routes/tenant-access-test.routes.ts` (create)
- `backend/api/src/modules/system/validators/tenant-access-test.validators.ts` (create)
- `backend/api/src/routes/v1/internal.routes.ts` (update)
- `backend/api/src/database/seeds/seed-tenant-access-tests.ts` (create if the current seed strategy supports it)
- `backend/api/src/database/seeds/seed-runner.ts` (update if needed)
- `docs/contracts/tenant-access-test-api-contract.md` (create)
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
Add:
- `POST /api/v1/internal/tenant-access/test-records`
- `GET /api/v1/internal/tenant-access/vendor/:vendorId/store/:storeId/test-records`
- `GET /api/v1/internal/tenant-access/customer/:customerId/test-records`
- `GET /api/v1/internal/tenant-access/delivery-agent/:deliveryAgentId/test-records`

7. DB fields/models to add/update, if any  
Add temporary collection/model fields:
- `tenant_access_tests.vendorId`
- `tenant_access_tests.storeId`
- `tenant_access_tests.cityId`
- `tenant_access_tests.customerId`
- `tenant_access_tests.deliveryAgentId`
- `tenant_access_tests.label`
- standard base fields

8. Permissions/RBAC changes, if any  
- Protect the internal routes behind the existing auth/scope middleware patterns.
- `NEEDS VERIFICATION`: confirm whether any additional admin override permission is required for the internal test routes beyond current scope logic.

9. Tests to create/update  
- Backend tests for the temporary tenant-access internal endpoints.
- Seed verification for temporary test records if seed integration is added.

10. Docs/reviews/handoff files to update  
- `docs/contracts/tenant-access-test-api-contract.md`
- `docs/testing/tenant-store-access-verification.md`
- `docs/handoffs/tenant-store-access-complete.md` or the closest existing handoff filename
- `docs/reviews/phase-1-2-completion-verification.md`

11. Acceptance criteria  
- The missing internal tenant test stack exists end to end.
- Internal routes mount under `/api/v1/internal`.
- Scope test records can be seeded or created for verification without touching business-domain entities.

12. Verification commands  
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run build -w backend/api`
- `rg "tenant-access/test-records|tenant_access_tests" backend/api/src docs/contracts docs/testing`

13. Risk notes  
- Medium risk because this adds temporary verification infrastructure.
- Keep the temporary surface clearly documented as non-business API.

14. Status
DONE

---

## Ticket 8

1. Ticket number  
`8`

2. Ticket title  
Strengthen tenant access audit and admin-override proof

3. Related Phase/Module  
Phase 2 / Module 6 - Tenant & Store Access Control

4. Exact goal  
Close the verified gap around incomplete proof of admin override and scoped
override behavior by tightening audit coverage and verification artifacts.

5. Files to create/update  
- `backend/api/src/modules/auth/services/scope-access.service.ts` or current tenant/scope service file (update)
- `backend/api/src/modules/audit/constants/audit-event.constants.ts` (update if needed)
- `docs/security/tenant-access-rules.md` (create or update)
- `docs/testing/tenant-store-access-verification.md` (update)
- `docs/reviews/tenant-store-access-review.md` (update)
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
No new endpoint required.

7. DB fields/models to add/update, if any  
No schema addition expected; relies on existing `audit_logs.*`.

8. Permissions/RBAC changes, if any  
- Make admin override behavior explicit and verifiable.
- If exact source-document override rules remain ambiguous, mark `NEEDS VERIFICATION` in implementation notes before changing enforcement.

9. Tests to create/update  
- Add backend tests for:
  - tenant denial audit event
  - tenant scope mismatch audit event
  - admin override audit event if supported

10. Docs/reviews/handoff files to update  
- `docs/security/tenant-access-rules.md`
- `docs/testing/tenant-store-access-verification.md`
- `docs/reviews/tenant-store-access-review.md`
- `docs/reviews/phase-1-2-completion-verification.md`

11. Acceptance criteria  
- Verification report no longer needs to say admin-override/scoped override rules could not be proven.
- Audit expectations for tenant denial and mismatch are documented and backed by code/tests.

12. Verification commands  
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `rg "tenant_access_denied|tenant_scope_mismatch|override" backend/api/src docs/security docs/testing`

13. Risk notes  
- Medium risk if current scope middleware and source expectations differ semantically.

14. Status
DONE

---

## Ticket 9

1. Ticket number  
`9`

2. Ticket title  
Resolve Session & Device Management API alignment decision

3. Related Phase/Module  
Phase 2 / Module 11 - Session & Device Management

4. Exact goal  
Create an explicit corrective decision and contract update for the verified
source mismatch between:
- the source PDF’s per-surface/admin-specific session routes
- the repo’s current generic `/api/v1/auth/*` session routes

5. Files to create/update  
- `docs/architecture/session-device-management.md` (update)
- `docs/contracts/auth-session-contract.md` (update)
- `docs/contracts/phase-2-api-surface.md` (update if needed)
- `docs/reviews/session-device-management-review.md` (update)
- `docs/reviews/phase-1-2-completion-verification.md` (update after decision/implementation)

6. APIs to add/update, if any  
`NEEDS VERIFICATION`:
- either preserve generic session APIs and explicitly reconcile docs
- or add the source-specific per-surface/admin session route families

7. DB fields/models to add/update, if any  
Potentially none in this ticket; this is the corrective alignment decision.

8. Permissions/RBAC changes, if any  
`NEEDS VERIFICATION` for any admin user-session management permission introduced by the chosen route design.

9. Tests to create/update  
- Add contract/review verification only in this ticket unless the design decision directly changes implementation.

10. Docs/reviews/handoff files to update  
- `docs/architecture/session-device-management.md`
- `docs/contracts/auth-session-contract.md`
- `docs/reviews/session-device-management-review.md`
- `docs/reviews/phase-1-2-completion-verification.md`

11. Acceptance criteria  
- There is one explicit corrective decision recorded.
- The session module no longer contains silent design drift between source truth and repo contracts.
- Follow-up implementation tickets can proceed without ambiguity.

12. Verification commands  
- `rg "me/sessions|logout-session|logout-other-sessions|admin/me/sessions" docs/architecture docs/contracts docs/reviews`

13. Risk notes  
- High decision risk.
- This ticket should be implemented before any deeper Session & Device corrective ticket.

14. Status
DONE

---

## Ticket 10

1. Ticket number  
`10`

2. Ticket title  
Add missing auth session device metadata and refresh-token rotation support

3. Related Phase/Module  
Phase 2 / Module 11 - Session & Device Management

4. Exact goal  
Close the verified gap around richer device metadata and real refresh-token
rotation support expected by the source PDF.

5. Files to create/update  
- `backend/api/src/modules/auth/models/auth-session.model.ts` (update)
- `backend/api/src/modules/auth/types/auth-api.types.ts` (update)
- `packages/shared/api/auth-api.types.ts` (update if session response changes)
- `backend/api/src/modules/auth/services/session.service.ts` (update)
- `backend/api/src/modules/auth/services/token.service.ts` (update)
- `backend/api/src/modules/auth/services/auth.service.ts` (update)
- `docs/contracts/auth-session-contract.md` (update)
- `docs/contracts/auth-refresh-token-api.md` (update)
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
- `POST /api/v1/public/auth/refresh-token`
- session list response contracts if metadata changes

7. DB fields/models to add/update, if any  
Add/update as justified by current schema design:
- `auth_sessions.deviceName` if adopted
- refresh-token rotation lineage/state fields if required by final implementation design

8. Permissions/RBAC changes, if any  
None directly.

9. Tests to create/update  
- Backend tests for refresh token rotation behavior
- Backend tests for enriched session list metadata

10. Docs/reviews/handoff files to update  
- `docs/contracts/auth-session-contract.md`
- `docs/contracts/auth-refresh-token-api.md`
- `docs/testing/session-device-management-backend-verification.md`
- `docs/reviews/phase-1-2-completion-verification.md`

11. Acceptance criteria  
- Verification report no longer has to say device metadata/rotation could not be proven.
- Refresh flow behavior matches the corrected session-management contract.

12. Verification commands  
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `rg "deviceName|refresh token rotation|refreshTokenHash" backend/api/src docs/contracts docs/testing`

13. Risk notes  
- High risk because token lifecycle changes are security-sensitive.

14. Status
DONE

---

## Ticket 11

1. Ticket number  
`11`

2. Ticket title  
Add admin user-session management APIs and permissions

3. Related Phase/Module  
Phase 2 / Module 11 - Session & Device Management

4. Exact goal  
Implement the missing admin user-session management layer if the Ticket 9 route
decision confirms the source PDF behavior should be honored.

5. Files to create/update  
- `backend/api/src/routes/v1/admin.routes.ts` (update) or module-specific admin session route file if current route pattern prefers that
- `backend/api/src/modules/auth/controllers/auth-session.controller.ts` (update or split)
- `backend/api/src/modules/auth/services/session.service.ts` (update)
- `backend/api/src/modules/auth/repositories/auth-session.repository.ts` (update)
- `backend/api/src/modules/auth/validators/auth.validators.ts` or dedicated session validators file (update/create)
- `docs/contracts/auth-session-contract.md` (update)
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
`NEEDS VERIFICATION` against Ticket 9 decision, likely including admin user-session APIs such as:
- list another user’s sessions
- revoke another user’s session(s)

7. DB fields/models to add/update, if any  
No new model expected if Ticket 10 already handled session schema changes.

8. Permissions/RBAC changes, if any  
- Add explicit admin user-session management permission gate(s).
- `NEEDS VERIFICATION`: final permission code names should align with the corrected Module 5 permission matrix.

9. Tests to create/update  
- Backend tests for admin user-session list/revoke authorization boundaries

10. Docs/reviews/handoff files to update  
- `docs/contracts/auth-session-contract.md`
- `docs/testing/session-device-management-backend-verification.md`
- `docs/reviews/phase-1-2-completion-verification.md`

11. Acceptance criteria  
- Admin user-session behavior expected by the source document is implemented only if the route/design decision approved it.
- Permission gates for admin session management are explicit and tested.

12. Verification commands  
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `rg "session" backend/api/src/routes/v1/admin.routes.ts backend/api/src/modules/auth docs/contracts docs/testing`

13. Risk notes  
- High risk because this exposes admin control over session state.
- Must not start until the route-alignment decision is settled.

14. Status
DONE

---

## Ticket 12

1. Ticket number  
`12`

2. Ticket title  
Add dedicated session-management UI surfaces and frontend device-info helper

3. Related Phase/Module  
Phase 2 / Module 11 - Session & Device Management

4. Exact goal  
Close the verified frontend gap by creating dedicated session-management
surfaces and a shared device-info helper instead of relying only on embedded
profile/header UI.

5. Files to create/update  
- `apps/customer-app/src/screens/main/SessionsScreen.tsx` (create)
- `apps/delivery-agent-app/src/screens/main/SessionsScreen.tsx` (create)
- `apps/vendor-panel/src/pages/settings/SessionsPage.tsx` or equivalent existing settings/auth area page (create)
- `apps/admin-dashboard/src/pages/settings/SessionsPage.tsx` or equivalent existing settings/auth area page (create)
- `apps/admin-dashboard/src/pages/users/UserSessionsPage.tsx` (create if required by final Module 11 decision)
- shared/frontend device helper file in the repo-appropriate location:
  - `packages/shared/...` or app-local helper module (`NEEDS VERIFICATION` during implementation)
- route/navigation files for the four surfaces (update)
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
Uses the corrected session-management API set from Tickets 9-11.

7. DB fields/models to add/update, if any  
None directly.

8. Permissions/RBAC changes, if any  
- If admin user-session page is included, gate it with explicit admin permission(s).

9. Tests to create/update  
- Frontend smoke tests or route-level checks for session surfaces
- Device-info helper unit tests if there is a local frontend test pattern

10. Docs/reviews/handoff files to update  
- `docs/testing/session-device-management-frontend-verification.md`
- `docs/handoffs/session-device-management-complete.md`
- `docs/reviews/phase-1-2-completion-verification.md`

11. Acceptance criteria  
- Dedicated session-management surfaces exist for all four auth surfaces required by the final Session module decision.
- The verification report no longer needs to say those screens/pages are missing.

12. Verification commands  
- `npm run typecheck -w apps/customer-app`
- `npm run typecheck -w apps/delivery-agent-app`
- `npm run typecheck -w apps/vendor-panel`
- `npm run typecheck -w apps/admin-dashboard`
- `rg "SessionsScreen|SessionsPage|UserSessionsPage" apps`

13. Risk notes  
- Medium risk due to cross-surface navigation changes.
- Keep UI scoped to session management only.

14. Status
DONE

---

## Ticket 13

1. Ticket number  
`13`

2. Ticket title  
Create backend automated access-control test harness

3. Related Phase/Module  
Phase 2 / Module 12 - Access Control Testing

4. Exact goal  
Add the missing backend automated test structure, helpers, and fixtures required
by the source PDF for access-control verification.

5. Files to create/update  
- backend access-control test folder structure under `backend/api` (`NEEDS VERIFICATION` for exact local test convention)
- auth helper for access-control tests
- request helper for access-control tests
- fixture constants for access-control tests
- root/backend package scripts as needed for running the new test target
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
No new business APIs.

7. DB fields/models to add/update, if any  
No schema change expected; test fixtures may rely on existing seeded auth/session/audit data.

8. Permissions/RBAC changes, if any  
None.

9. Tests to create/update  
Create the harness files themselves plus any initial bootstrap test proving auth helper + request helper works.

10. Docs/reviews/handoff files to update  
- `docs/testing/access-control-code-quality.md`
- `docs/reviews/access-control-testing-review.md`
- `docs/reviews/phase-1-2-completion-verification.md`

11. Acceptance criteria  
- Access-control backend test folder/helper/fixture implementation exists.
- The repo has a repeatable backend test entrypoint for Module 12 corrective work.

12. Verification commands  
- `npm run typecheck -w backend/api`
- `rg "access control" backend/api package.json docs/testing`
- run the new backend access-control test command once it exists

13. Risk notes  
- `NEEDS VERIFICATION` for exact test runner/location pattern if the repo still lacks a strong backend test convention.

14. Status
DONE

---

## Ticket 14

1. Ticket number  
`14`

2. Ticket title  
Add backend automated access-control coverage for auth, permission, scope, session, and revoked-state cases

3. Related Phase/Module  
Phase 2 / Module 12 - Access Control Testing

4. Exact goal  
Convert the source PDF’s missing backend access-control scenarios into real
automated coverage.

5. Files to create/update  
- backend automated test files for:
  - authentication access tests
  - surface-specific access tests
  - permission middleware tests
  - permission mutation access tests
  - tenant access positive tests
  - tenant access negative tests
  - session access control tests
  - revoked session access tests
  - account status access tests
  - refresh token rotation access tests
  - admin authorization boundary tests
- `docs/testing/access-control-backend-happy-path.md` (update)
- `docs/testing/access-control-backend-deny-path.md` (update)
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
No new business APIs; test existing Phase 2 APIs and internal verification routes.

7. DB fields/models to add/update, if any  
No new schema expected.

8. Permissions/RBAC changes, if any  
None directly; this ticket verifies them.

9. Tests to create/update  
All backend automated coverage listed above.

10. Docs/reviews/handoff files to update  
- `docs/testing/access-control-backend-happy-path.md`
- `docs/testing/access-control-backend-deny-path.md`
- `docs/reviews/phase-1-2-completion-verification.md`

11. Acceptance criteria  
- The verification report no longer has to say those automated backend tests are missing.
- Backend access control behavior is testable, repeatable, and tied to the current APIs.

12. Verification commands  
- run the new backend access-control test command
- `npm run typecheck -w backend/api`
- `rg "revoked|tenant|permission|authorization boundary|refresh token rotation" backend/api`

13. Risk notes  
- Medium-to-high effort ticket.
- Keep tests aligned to the corrected Module 5, 6, and 11 behaviors.

14. Status
DONE

---

## Ticket 15

1. Ticket number  
`15`

2. Ticket title  
Add frontend executable auth guard and session-boundary smoke coverage

3. Related Phase/Module  
Phase 2 / Module 12 - Access Control Testing

4. Exact goal  
Fill the verified gap where frontend access-control evidence exists only as docs
and not as executable smoke or guard coverage.

5. Files to create/update  
- frontend smoke/guard test files for:
  - Customer App auth guard behavior
  - Delivery Agent App auth guard behavior
  - Vendor Panel protected-route and permission-visibility smoke behavior
  - Admin Dashboard protected-route and permission-visibility smoke behavior
- app package scripts if needed
- `docs/testing/access-control-mobile-frontend-verification.md` (update)
- `docs/testing/access-control-web-frontend-verification.md` (update)
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
No new business APIs.

7. DB fields/models to add/update, if any  
None.

8. Permissions/RBAC changes, if any  
None directly.

9. Tests to create/update  
- executable frontend auth guard smoke tests as requested by the verification gap

10. Docs/reviews/handoff files to update  
- `docs/testing/access-control-mobile-frontend-verification.md`
- `docs/testing/access-control-web-frontend-verification.md`
- `docs/reviews/phase-1-2-completion-verification.md`

11. Acceptance criteria  
- Frontend access-control verification is backed by executable smoke coverage, not docs alone.
- Coverage stays inside the currently implemented surfaces only.

12. Verification commands  
- app-specific typecheck/lint commands
- run the new frontend smoke coverage commands once added

13. Risk notes  
- `NEEDS VERIFICATION` for exact frontend test tooling patterns per app.

14. Status
DONE

---

## Ticket 16

1. Ticket number  
`16`

2. Ticket title  
Add Phase 2 access-control Postman collection and npm entrypoints

3. Related Phase/Module  
Phase 2 / Module 12 - Access Control Testing

4. Exact goal  
Close the specific verification gap for the missing Phase 2 access-control
collection and dedicated runnable commands.

5. Files to create/update  
- `docs/contracts/postman/phase-2-access-control.postman_collection.json` (create)
- root `package.json` (update) or backend package script surface as appropriate
- `docs/testing/access-control-code-quality.md` (update)
- `docs/handoffs/access-control-testing-complete.md` (update)
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
No new APIs; collection targets existing endpoints.

7. DB fields/models to add/update, if any  
None.

8. Permissions/RBAC changes, if any  
None.

9. Tests to create/update  
- Postman collection entries for the key allow/deny scenarios
- npm script entrypoints for running the access-control suite/checks

10. Docs/reviews/handoff files to update  
- `docs/testing/access-control-code-quality.md`
- `docs/handoffs/access-control-testing-complete.md`
- `docs/reviews/phase-1-2-completion-verification.md`

11. Acceptance criteria  
- A dedicated Phase 2 access-control collection exists.
- The repo exposes documented commands for running the new Module 12 verification assets.

12. Verification commands  
- `rg "phase-2-access-control" docs/contracts/postman package.json`
- run the new script once it exists

13. Risk notes  
- Low-to-medium risk.
- Keep the collection focused on verified gap scenarios only.

14. Status
DONE

---

## Ticket 17

1. Ticket number  
`17`

2. Ticket title  
Create final Phase 2 Postman verification collection and release notes

3. Related Phase/Module  
Phase 2 / Module 13 - Phase 2 Integration & Review

4. Exact goal  
Close the two explicit final-closeout gaps from the verification report:
- missing dedicated Phase 2 Postman verification collection
- missing dedicated Phase 2 release notes artifact

5. Files to create/update  
- `docs/contracts/postman/phase-2-verification.postman_collection.json` (create)
- `docs/handoffs/phase-2-release-notes.md` (create)
- `docs/handoffs/phase-2-integration-review-complete.md` (update)
- `docs/reviews/phase-1-2-completion-verification.md` (update after implementation)

6. APIs to add/update, if any  
No new APIs; collection documents and exercises existing Phase 2 APIs.

7. DB fields/models to add/update, if any  
None.

8. Permissions/RBAC changes, if any  
None.

9. Tests to create/update  
- Postman verification artifact only; no new code test in this ticket.

10. Docs/reviews/handoff files to update  
- `docs/handoffs/phase-2-release-notes.md`
- `docs/handoffs/phase-2-integration-review-complete.md`
- `docs/reviews/phase-1-2-completion-verification.md`

11. Acceptance criteria  
- Dedicated Phase 2 verification collection exists separately from the access-control collection.
- Release notes exist and accurately summarize the corrected Phase 2 scope only.

12. Verification commands  
- `rg "phase-2-verification|release notes" docs/contracts/postman docs/handoffs`

13. Risk notes  
- Low risk.
- Keep release notes factual and tied to implemented artifacts only.

14. Status
DONE

---

## Ticket 18

1. Ticket number  
`18`

2. Ticket title  
Re-run Phase 2 corrective closeout and reconcile all tracker/review artifacts

3. Related Phase/Module  
Phase 2 / Module 13 - Phase 2 Integration & Review

4. Exact goal  
After corrective tickets 1-17 are implemented, perform the final closeout pass
that decides whether Phase 2 can actually be marked complete against the source
PDF.

5. Files to create/update  
- `docs/reviews/phase-1-2-completion-verification.md` (update statuses)
- `docs/architecture/phase-2-integration-review.md` (update)
- `docs/contracts/phase-2-module-completion-matrix.md` (update)
- `docs/testing/phase-2-integration-runbook.md` (update)
- `docs/testing/phase-2-code-quality-and-gaps.md` (update)
- `docs/security/phase-2-security-audit-review.md` (update)
- `project-context/CURRENT_PROGRESS.md` (update)
- `project-context/PHASE_STATUS.md` (update)
- `project-context/PHASE_HANDOFFS/PHASE_2_HANDOFF.md` (update)

6. APIs to add/update, if any  
No new APIs; final verification only.

7. DB fields/models to add/update, if any  
None directly.

8. Permissions/RBAC changes, if any  
None directly; validate final state.

9. Tests to create/update  
- No new tests expected; run and record the full corrected verification surface.

10. Docs/reviews/handoff files to update  
- all final Phase 2 review/handoff/tracker files listed above

11. Acceptance criteria  
- Every remaining Phase 2 partial gap from the verification report is re-checked.
- Tracker docs no longer overstate or understate the corrected Phase 2 state.
- Phase 2 is only marked complete if the re-verification evidence supports it.

12. Verification commands  
- `npm run check:frontend-secrets`
- `npm run check:secrets`
- plus all corrected backend/frontend verification commands introduced by prior corrective tickets

13. Risk notes  
- This ticket must be last.
- Do not mark Phase 2 complete until all upstream corrective tickets are done and re-verified.

14. Status
DONE

### Ticket 18 closeout record (2026-05-18)

- Tickets 1–17 re-checked: all marked **DONE**.
- Automated verification re-run: shared/backend typecheck, lint, build; backend service/controller/tenant/session/access-control tests; Postman JSON validation; all four app typecheck/lint/smoke — **all pass** (94 backend + 20 frontend smoke tests).
- MongoDB was not running during this pass; audit-log persistence warnings in unit tests are expected and remain **NEEDS VERIFICATION** live.
- Phase 2 decision: **COMPLETE for static/code/docs verification**; live/manual verification caveats documented in `phase-1-2-completion-verification.md` and `phase-2-release-notes.md`.
