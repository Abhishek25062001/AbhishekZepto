# Auth API Contract

## Purpose

This document records Phase 1 placeholder auth API contracts for frontend and
backend alignment.

These endpoints are placeholders in Phase 1 and will become functional in Phase
2 authentication work.

## Request OTP

```http
POST /api/v1/public/auth/request-otp
```

Request body:

```json
{
  "phone": "9999999999",
  "role": "customer"
}
```

Success response:

```json
{
  "success": true,
  "message": "OTP request placeholder ready",
  "data": {
    "otpEnabled": false
  },
  "meta": {}
}
```

## Verify OTP

```http
POST /api/v1/public/auth/verify-otp
```

Request body:

```json
{
  "phone": "9999999999",
  "role": "customer",
  "otp": "123456"
}
```

Success response:

```json
{
  "success": true,
  "message": "OTP verification placeholder ready",
  "data": {
    "accessToken": "phase1-access-token-placeholder",
    "refreshToken": "phase1-refresh-token-placeholder"
  },
  "meta": {}
}
```

## Refresh Token

```http
POST /api/v1/public/auth/refresh-token
```

Request body:

```json
{
  "refreshToken": "phase1-refresh-token-placeholder"
}
```

## Logout

```http
POST /api/v1/public/auth/logout
```

Request body:

```json
{
  "refreshToken": "phase1-refresh-token-placeholder"
}
```

## Phase 1 Note

The placeholder token values are not real credentials. Real OTP verification,
JWT signing, refresh token rotation, session revocation, and provider delivery
belong to later authentication modules.

Current authenticated session-management endpoints are:

- `GET /api/v1/auth/me/sessions`
- `POST /api/v1/auth/logout-session`
- `POST /api/v1/auth/logout-other-sessions`
