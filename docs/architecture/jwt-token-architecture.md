# JWT Token Architecture

## JWT Token Goal

Access token is a short-lived API authorization token.

Refresh token is a long-lived session renewal token.

## Expiry

- Access token expiry: 15 minutes
- Refresh token expiry: 30 days

## Access Token Payload Fields

- `userId`
- `role`
- `sessionId`
- `permissions`
- `vendorId`
- `storeId`
- `cityId`
- `tokenType`
- `iat`
- `exp`
- `iss`

## Refresh Token Payload Fields

- `userId`
- `role`
- `sessionId`
- `tokenType`
- `iat`
- `exp`
- `iss`

## Token Issuer

- `zepto-like-api`

## Planned Token Service

Planned file:

- `/backend/api/src/modules/auth/services/token.service.ts`

Planned function signatures:

- `generateAccessToken(payload)`
- `generateRefreshToken(payload)`
- `verifyAccessToken(token)`
- `verifyRefreshToken(token)`
- `hashRefreshToken(refreshToken)`

Refresh token storage hashing approach:

- SHA-256 hash for refresh token storage.

## Planned Env Fields

Existing env fields to confirm:

- `JWT_ACCESS_SECRET=change_me`
- `JWT_REFRESH_SECRET=change_me`

Planned env fields:

- `JWT_ACCESS_EXPIRES_IN=15m`
- `JWT_REFRESH_EXPIRES_IN=30d`

Planned env validation:

- Add validation for `JWT_ACCESS_EXPIRES_IN`.
- Add validation for `JWT_REFRESH_EXPIRES_IN`.

## API Endpoints

- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `GET /api/v1/internal/auth/test-protected`

## DB Fields

- `auth_sessions.refreshTokenHash`
- `auth_sessions.expiresAt`
- `auth_sessions.lastUsedAt`
- `auth_sessions.isRevoked`
- `auth_sessions.revokedAt`
- `auth_sessions.revokedReason`
