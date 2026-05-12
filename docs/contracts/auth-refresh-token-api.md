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
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "jwt_access_token",
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

## Planned Backend Updates

- `/backend/api/src/modules/auth/validators/auth.validators.ts`
  - Confirm `refreshTokenValidator` validates `refreshToken`.
- `/backend/api/src/modules/auth/types/auth-api.types.ts`
  - Add `RefreshTokenBody` type.
  - Add `RefreshTokenResponse` type.

## DB Fields

- `auth_sessions.refreshTokenHash`
- `auth_sessions.expiresAt`
- `auth_sessions.isRevoked`
- `auth_sessions.revokedAt`
- `auth_sessions.lastUsedAt`
