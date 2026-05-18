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

## Customer App Logout Example

```json
{
  "refreshToken": "customer_refresh_token",
  "logoutAllDevices": false
}
```

## Delivery Agent App Logout Example

```json
{
  "refreshToken": "delivery_refresh_token",
  "logoutAllDevices": false
}
```

## Vendor Panel Logout Example

```json
{
  "refreshToken": "vendor_refresh_token",
  "logoutAllDevices": false
}
```

## Admin Dashboard Logout Example

```json
{
  "refreshToken": "admin_refresh_token",
  "logoutAllDevices": false
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
