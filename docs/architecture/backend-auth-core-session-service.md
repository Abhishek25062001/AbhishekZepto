# Backend Auth Core Session Service

## Goal

Document the planned session service for Backend Auth Core.

## Planned File Path

- `/backend/api/src/modules/auth/services/session.service.ts`

## Planned Dependencies

- AuthSessionModel or auth session repository
- `hashRefreshToken()` from token service

## Planned Functions

### createSessionForUser(input)

Input fields:

- `userId`
- `role`
- `refreshToken`
- `deviceId`
- `deviceType`
- `appSurface`
- `appVersion`
- `ipAddress`
- `userAgent`
- `expiresAt`

Rules:

- Hash refresh token before saving
- Save `refreshTokenHash`
- Save `expiresAt`
- Save `isRevoked: false`
- Save `lastUsedAt: new Date()`

### validateSession(sessionId)

- Reject if `isRevoked=true`
- Reject if `expiresAt < new Date()`

### findSessionByRefreshToken(refreshToken)

- Hash refresh token before lookup

### markSessionUsed(sessionId)

- Update `lastUsedAt`

### revokeSession(sessionId, reason)

Set:

- `isRevoked: true`
- `revokedAt: new Date()`
- `revokedReason: reason`

### revokeAllUserSessions(userId, reason)

- Revoke all sessions where `userId` and `isRevoked: false`

## Planned Export

- Export all session service functions
