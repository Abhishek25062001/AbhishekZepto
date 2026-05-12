# Backend Auth Core API Types

## Goal

Document the planned auth API request and response types for Backend Auth Core.

## Planned File Paths

- `/backend/api/src/modules/auth/types/auth-api.types.ts`
- `/backend/api/src/modules/auth/types/index.ts`

## RequestOtpBody

- `phone`
- `role`
- `purpose`
- `deliveryChannel`

## RequestOtpResponse

- `challengeId`
- `expiresIn`
- `canResendAfter`
- `deliveryChannel`
- `maskedTarget`

## VerifyOtpBody

- `phone`
- `role`
- `otp`
- `challengeId`
- `device`

### VerifyOtpBody.device

- `deviceId`
- `deviceType`
- `appSurface`
- `appVersion`

## VerifyOtpResponse

- `accessToken`
- `refreshToken`
- `expiresIn`
- `user`

### VerifyOtpResponse.user

- `userId`
- `role`
- `permissions`
- `vendorId`
- `storeId`
- `cityId`

## RefreshTokenBody

- `refreshToken`

## RefreshTokenResponse

- `accessToken`
- `expiresIn`

## LogoutBody

- `refreshToken`
- `logoutAllDevices`

## LogoutResponse

- Empty object

## Planned Export

- Export auth API types from `/backend/api/src/modules/auth/types/index.ts`
