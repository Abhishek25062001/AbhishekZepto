# Postman API Contract Collection

## Collections

- Phase 1: `docs/contracts/postman/zepto-like-phase-1.postman_collection.json`
- Phase 2 access control: `docs/contracts/postman/phase-2-access-control.postman_collection.json`
- Phase 2 verification (integration): `docs/contracts/postman/phase-2-verification.postman_collection.json`
- Phase 3 catalog/store/inventory: `docs/contracts/postman/zepto-like-phase-3.postman_collection.json`

See also: `docs/handoffs/phase-2-release-notes.md`, `docs/releases/phase-3-release-notes.md`

## Import

Import the JSON collection into Postman using the Postman import action.

## Base URL

Set or edit the collection variable:

```text
baseUrl = http://localhost:5000
```

Use a different local port only when the backend is intentionally started on that port for smoke testing.

## Phase 2 Access Control Collection

### Prerequisites (live server + seeded DB)

1. Start MongoDB and run backend seeds (`npm run seed -w backend/api` in development).
2. Start the API (`npm run dev:backend`).
3. Set `publicAuthOtp` to the development OTP value configured for your environment.
4. Align phone variables with seeded development users (defaults match `docs/setup/dev-auth-users.md`).
5. Run folder `00 Auth Setup` first to populate access tokens and ids.

`NEEDS VERIFICATION` without local server:

- OTP request/verify flows
- refresh token rotation against live sessions
- admin user-session revoke against real session rows
- support/operations admin OTP flows (phones `6666666601` / `6666666602` are placeholders unless those users are seeded)

### Validate collection JSON locally

```bash
npm run validate:postman:phase-2-access-control
```

### Newman / CI runner

The repository does not include Newman or another Postman CLI runner dependency. Execute this collection manually in Postman unless your environment already provides Newman.

## Phase 2 Verification Collection

Final Phase 2 happy-path integration checks (separate from the access-control allow/deny collection).

### Prerequisites

Same as the access-control collection: local API, MongoDB, seeds, and dev OTP configured.

1. Import `phase-2-verification.postman_collection.json`.
2. Run folders `00`–`08` in order (OTP setup in `01` populates tokens).
3. Run folder `09 Logout` last.

### Validate collection JSON locally

```bash
npm run validate:postman:phase-2-verification
```

`NEEDS VERIFICATION` without local server: all OTP, refresh, session, admin, and internal tenant routes.

## Temporary Internal APIs

Internal test APIs are temporary verification endpoints:

- `POST {{baseUrl}}/api/v1/internal/system/database-write-check`
- `GET {{baseUrl}}/api/v1/internal/auth/test-protected`
- `GET {{baseUrl}}/api/v1/internal/tenant-access/...`

These internal test APIs must be protected or removed before production launch.
