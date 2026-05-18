# Phase 2 Release Notes

Corrective closeout artifact for Phase 2 (User Access & Role-Based Entry). Summarizes implemented systems and verification assets as of corrective Tickets 1–17.

**Ticket 18 closeout (2026-05-18):** Phase 2 is **complete for static/code/docs verification**. Live/manual verification caveats below still apply before production confidence.

---

## Implemented Systems

### OTP authentication

- Public OTP request and verify endpoints for customer, delivery agent, vendor, and admin surfaces.
- Development seeded users documented in `docs/setup/dev-auth-users.md`.

### JWT access and refresh tokens

- Access tokens issued on OTP verify.
- Refresh tokens returned to clients; hashed at rest (not exposed in API responses).

### Refresh token rotation

- `POST /api/v1/public/auth/refresh-token` rotates refresh tokens and issues new access tokens.

### Sessions and device management

- Self-service session listing via `GET /api/v1/auth/me/sessions`.
- Per-session and bulk logout via `POST /api/v1/auth/logout-session` and `POST /api/v1/auth/logout-other-sessions`.
- Admin user-session APIs under `GET|DELETE /api/v1/admin/users/:userId/sessions`.

### Role and permission management

- Admin role CRUD under `/api/v1/admin/roles`.
- User permission assignment, role assignment, and role-permission sync under `/api/v1/admin/users/:userId/*`.
- Surface permission reads: `/api/v1/{customer|delivery|vendor|admin}/me/permissions`.

### Tenant and store access controls

- Tenant-scoped enforcement for vendor, store, customer, and delivery-agent contexts.
- Internal verification routes under `/api/v1/internal/tenant-access/*` and scope helpers under `/api/v1/internal/auth/*`.

### Access-control automated coverage (Module 12)

- Backend harness: `npm run test:access-control-harness -w backend/api`
- Backend scenarios: `npm run test:access-control-scenarios -w backend/api`
- Frontend guard smoke (per app): `npm run test:access-control-smoke -w apps/<app>`
- Postman allow/deny collection: `docs/contracts/postman/phase-2-access-control.postman_collection.json`

### Postman collections

| Collection | Purpose |
|------------|---------|
| `phase-2-access-control.postman_collection.json` | Allow/deny matrices for auth, permissions, tenant, session, and admin boundaries |
| `phase-2-verification.postman_collection.json` | Final Phase 2 happy-path integration verification |

JSON syntax validation:

```bash
npm run validate:postman:phase-2-access-control
npm run validate:postman:phase-2-verification
```

Manual execution in Postman is required (Newman is not a repo dependency).

---

## Manual Verification Prerequisites

1. Local API running (`npm run dev:backend`).
2. MongoDB connected.
3. Seed data loaded (`npm run seed -w backend/api` in development).
4. Development OTP code configured (`publicAuthOtp` collection variable, typically `123456` in local dev).
5. Phone variables aligned with `docs/setup/dev-auth-users.md`.

Run `phase-2-verification` folder **09 Logout** last to avoid invalidating tokens needed by earlier folders.

---

## NEEDS VERIFICATION

- **Live OTP / provider flow** — SMS/provider integration and production OTP policies are not validated by repo scripts alone.
- **Live MongoDB / full-stack verification** — Postman and integration runbooks require a running API and database; CI does not execute Newman.
- **Permission namespace mismatch** — Some admin endpoints use `users:read` / `settings:manage` gates; confirm against source PDF if a dedicated role-management permission namespace was expected.
- **Frontend E2E gaps** — Guard smoke tests (`node:test`) do not replace device/browser E2E with real secure storage and navigation.
- **Per-surface session routes** — Generic `/api/v1/auth/me/sessions` is implemented; source-document per-surface session paths may differ.
- **Live audit persistence** — Unit tests may warn when MongoDB is unavailable; confirm audit writes against a running database.

---

## Ticket 18 Verification Record (2026-05-18)

Re-run results (all pass in closeout environment):

| Area | Result |
|------|--------|
| Shared + backend typecheck/lint/build | Pass |
| Backend tests (services, controllers, tenant, session, access-control) | 94 pass |
| Postman JSON validation (both collections) | Pass |
| All four apps typecheck/lint + access-control smoke | 20 pass |

MongoDB was not running; audit-log insert warnings during tests are expected offline.

## Related Documentation

- `docs/handoffs/phase-2-integration-review-complete.md`
- `docs/contracts/postman/README.md`
- `docs/reviews/phase-1-2-completion-verification.md`
- `docs/reviews/phase-2-corrective-execution-tickets.md`
