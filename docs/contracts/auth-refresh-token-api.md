# Auth Refresh Token API Contract

## API Endpoint

`POST /api/v1/public/auth/refresh-token`

## Request Body

```json
{
  "refreshToken": "refresh_token"
}
```

## Success Response

```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "expiresIn": 900
  },
  "meta": {}
}
```

## Invalid Refresh Token Error Response

```json
{
  "success": false,
  "message": "Invalid refresh token",
  "error": {
    "code": "INVALID_REFRESH_TOKEN",
    "details": {}
  }
}
```

## Revoked Session Error Response

```json
{
  "success": false,
  "message": "Session has been revoked",
  "error": {
    "code": "SESSION_REVOKED",
    "details": {}
  }
}
```

## Expired Session Error Response

```json
{
  "success": false,
  "message": "Session expired",
  "error": {
    "code": "SESSION_EXPIRED",
    "details": {}
  }
}
```

## Rotation Behavior

Current corrective Ticket 10 implementation keeps the generic refresh route and
adds refresh-token rotation to the existing session model.

- the submitted refresh token must match the current
  `auth_sessions.refreshTokenHash`
- revoked sessions cannot refresh
- expired sessions cannot refresh
- on success, a new refresh token is issued for the same `sessionId`
- the stored `refreshTokenHash` is replaced with the hash of the new token
- `auth_sessions.refreshTokenRotatedAt` is updated as evidence of rotation
- `auth_sessions.expiresAt` is extended to the new refresh-token expiry window
- the old refresh token becomes invalid after rotation

## Migration Note

No destructive migration is required for existing sessions.

- existing rows may keep `refreshTokenRotatedAt = null` until their first
  successful refresh after Ticket 10
- existing rows may keep `deviceName = null`; the session API now derives a
  fallback name from `appSurface`, `deviceType`, and `appVersion`

## DB Fields

- `auth_sessions.refreshTokenHash`
- `auth_sessions.refreshTokenRotatedAt`
- `auth_sessions.expiresAt`
- `auth_sessions.isRevoked`
- `auth_sessions.revokedAt`
- `auth_sessions.lastUsedAt`
- `auth_sessions.deviceName`
