# Authentication Foundation Handoff

## Scope

Phase 1, Module 5 establishes backend authentication structure and placeholders.

This module does not implement real OTP sending, real OTP verification, real JWT
signing, refresh token rotation, production token revocation, SMS/Firebase
providers, social login, password login, or frontend login UI integration.

## Completed Tickets

1. Authentication Strategy Docs.
2. Auth Module Folder Structure.
3. Auth Constants And Types.
4. User Identity Model Foundation.
5. Auth Session Model Foundation.
6. Role Model Foundation.
7. Permission Checking Pattern.
8. Base Auth Middleware And Role Guards.
9. Token Service Placeholder.
10. Auth Repositories.
11. Auth Validators.
12. Public Auth Placeholder APIs.
13. Auth Seed Placeholders.
14. Internal Protected Auth Test Endpoint.
15. Auth API Contracts.
16. Authentication Foundation Verification And Handoff.

## API Endpoints

Added:

```http
POST /api/v1/public/auth/request-otp
POST /api/v1/public/auth/verify-otp
POST /api/v1/public/auth/refresh-token
POST /api/v1/public/auth/logout
GET /api/v1/internal/auth/test-protected
```

`GET /api/v1/internal/auth/test-protected` is temporary Phase 1 verification
plumbing for auth middleware composition.

## Created Auth DB Models

- `user_identities`
- `auth_sessions`
- `roles`

## User Identity DB Fields

- `phone`
- `email`
- `name`
- `role`
- `accountStatus`
- `permissions`
- `vendorId`
- `storeId`
- `cityId`
- `lastLoginAt`
- `createdBy`
- `updatedBy`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

## Auth Session DB Fields

- `userId`
- `role`
- `refreshTokenHash`
- `deviceId`
- `deviceType`
- `appSurface`
- `appVersion`
- `ipAddress`
- `userAgent`
- `expiresAt`
- `revokedAt`
- `revokedReason`
- `lastUsedAt`
- `isRevoked`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

## Role DB Fields

- `code`
- `name`
- `description`
- `permissions`
- `isSystemRole`
- `isEditable`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

## Verified Commands

These commands passed:

```bash
npm run seed:dry -w backend/api
npm run typecheck -w backend/api
npm run lint -w backend/api
npm run build -w backend/api
```

## Runtime Verification

Mongo-backed runtime verification passed after explicit approval to use the
configured MongoDB Atlas development database.

The full MongoDB URI and credentials were not printed or documented.

Verified:

```bash
npm run seed -w backend/api
npm run start -w backend/api
curl -X POST http://localhost:5010/api/v1/public/auth/request-otp \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"9999999999\",\"role\":\"customer\"}"
curl -X POST http://localhost:5010/api/v1/public/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"9999999999\",\"role\":\"customer\",\"otp\":\"123456\"}"
curl -X POST http://localhost:5010/api/v1/public/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"phase1-refresh-token-placeholder\"}"
curl -X POST http://localhost:5010/api/v1/public/auth/logout \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"phase1-refresh-token-placeholder\"}"
curl http://localhost:5010/api/v1/internal/auth/test-protected \
  -H "Authorization: Bearer phase1-access-token-placeholder"
```

Port `5000` was already in use, so smoke tests ran on `5010`.

Review details are recorded in:

- `docs/reviews/authentication-foundation-review.md`

## Known Pending Items

- Real OTP provider integration will be implemented in Phase 2.
- Real JWT signing and verification will be implemented in Phase 2.
- Refresh token rotation will be implemented in Phase 2.
- Frontend login screens will connect to these auth endpoints in Phase 2.
- Tenant-level access enforcement will be expanded in Phase 2.
- Temporary internal auth test route should be removed or production-locked by a
  later security hardening task.
