# Backend Auth Core Token Service

## Goal

Document the planned JWT token service for Backend Auth Core.

## Planned File Path

- `/backend/api/src/modules/auth/services/token.service.ts`

## Planned Dependency

- backend dependency: `jsonwebtoken`
- backend dev dependency: `@types/jsonwebtoken`

## Planned Imports

- `jsonwebtoken`
- `crypto`
- validated env

## Planned Functions

### generateAccessToken(payload)

Includes payload fields:

- `userId`
- `role`
- `sessionId`
- `permissions`
- `vendorId`
- `storeId`
- `cityId`
- `tokenType`

Rules:

- Set `tokenType` to `access`
- Sign using `JWT_ACCESS_SECRET`
- Use expiry from `JWT_ACCESS_EXPIRES_IN`

### generateRefreshToken(payload)

Includes payload fields:

- `userId`
- `role`
- `sessionId`
- `tokenType`

Rules:

- Set `tokenType` to `refresh`
- Sign using `JWT_REFRESH_SECRET`
- Use expiry from `JWT_REFRESH_EXPIRES_IN`

### verifyAccessToken(token)

- Verify using `JWT_ACCESS_SECRET`
- Reject token if `tokenType !== 'access'`

### verifyRefreshToken(token)

- Verify using `JWT_REFRESH_SECRET`
- Reject token if `tokenType !== 'refresh'`

### hashRefreshToken(refreshToken)

- Hash refresh token using SHA-256
- Never log raw refresh token

## Constants

- `ACCESS_TOKEN_EXPIRES_IN_SECONDS = 900`

## Planned Export

- Export token service functions
