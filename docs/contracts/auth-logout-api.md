# Auth Logout API Contract

## API Endpoint

`POST /api/v1/public/auth/logout`

## Request Body

```json
{
  "refreshToken": "refresh_token",
  "logoutAllDevices": false
}
```

## Success Response

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": {},
  "meta": {}
}
```

## Logout Behavior Rules

- If `logoutAllDevices=false`, revoke current session only.
- If `logoutAllDevices=true`, revoke all active sessions for the user.
- Refresh token must be hashed before lookup.
- Revoked sessions must not generate new access tokens.

## Planned Backend Updates

- `/backend/api/src/modules/auth/validators/auth.validators.ts`
  - Add optional `logoutAllDevices` boolean to `logoutValidator`.
- `/backend/api/src/modules/auth/types/auth-api.types.ts`
  - Add `LogoutBody` type.
  - Add `LogoutResponse` type.

## DB Fields

- `auth_sessions.isRevoked`
- `auth_sessions.revokedAt`
- `auth_sessions.revokedReason`
- `auth_sessions.lastUsedAt`
