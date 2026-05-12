# Backend Auth Core Auth Session Repository

## Goal

Document the planned auth session repository updates for Backend Auth Core.

## Planned File Path

- `/backend/api/src/modules/auth/repositories/auth-session.repository.ts`

## Existing Functions To Confirm

- `createAuthSession()`
- `findSessionById()`
- `findSessionByRefreshTokenHash()`
- `revokeSessionById()`
- `revokeAllSessionsForUser()`

## Required Updates

### createAuthSession()

Ensure it accepts:

- `refreshTokenHash`
- `deviceId`
- `deviceType`
- `appSurface`
- `appVersion`
- `ipAddress`
- `userAgent`
- `expiresAt`

### findActiveSessionById(sessionId)

Filter by:

- `_id: sessionId`
- `isRevoked: false`
- `isDeleted: false`

### updateSessionLastUsedAt(sessionId)

- Update last-used timestamp

### revokeSessionById()

Update to set:

- `isRevoked: true`
- `revokedAt: new Date()`
- `revokedReason`

### revokeAllSessionsForUser()

- Filter active sessions only
