# Phase 2 Data Model Inventory

## Collections

- `user_identities`
- `auth_sessions`
- `roles`
- `otp_challenges`
- `audit_logs`

## user_identities

- `_id`
- `phone`
- `role`
- `permissions`
- `vendorId`
- `storeId`
- `cityId`
- `accountStatus`
- `lastLoginAt`

## auth_sessions

- `userId`
- `role`
- `refreshTokenHash`
- `deviceId`
- `deviceType`
- `appSurface`
- `appVersion`
- `ipAddress`
- `userAgent`
- `expiresAt`
- `lastUsedAt`
- `isRevoked`
- `revokedAt`
- `revokedReason`

## roles

- `permissions`

## otp_challenges

- `phone`
- `role`
- `otpHash`
- `expiresAt`
- `verifiedAt`
- `attemptCount`
- `resendCount`

## audit_logs

- `eventType`
- `actorRole`
- `vendorId`
- `storeId`
- `cityId`
- `metadata`
- `status`

## Sensitivity Note

- `auth_sessions.refreshTokenHash` and `otp_challenges.otpHash` are internal-only
  and must never be exposed in frontend-facing responses.
