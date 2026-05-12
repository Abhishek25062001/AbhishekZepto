# Backend Auth Core OpenAPI Contract Updates

## Goal

Document the planned OpenAPI, contract, and Postman updates for Backend Auth Core real auth flows.

## Planned Files

- `/backend/api/src/docs/openapi/auth.paths.ts`
- `docs/contracts/auth-request-otp-api.md`
- `docs/contracts/auth-verify-otp-api.md`
- `docs/contracts/auth-refresh-token-api.md`
- `docs/contracts/auth-logout-api.md`
- `docs/contracts/postman/zepto-like-phase-1.postman_collection.json`

## OpenAPI Updates

### POST /public/auth/request-otp

Request body fields:

- `phone`
- `role`
- `purpose`
- `deliveryChannel`

Success response fields:

- `challengeId`
- `expiresIn`
- `canResendAfter`
- `deliveryChannel`
- `maskedTarget`

### POST /public/auth/verify-otp

Request body fields:

- `phone`
- `role`
- `otp`
- `challengeId`
- `device`

Success response fields:

- `accessToken`
- `refreshToken`
- `expiresIn`
- `user`

### POST /public/auth/refresh-token

Success response fields:

- `accessToken`
- `expiresIn`

### POST /public/auth/logout

Request body field:

- `logoutAllDevices`

## Postman Updates

- Add real request OTP body
- Add real verify OTP body with `challengeId`
- Add real refresh token body
- Add real logout body
