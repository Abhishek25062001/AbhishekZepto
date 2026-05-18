# Vendor Panel Authentication Complete

## Completed Vendor Panel Screens

- `LoginPage`
- `OtpVerificationPage`
- `DashboardPage`
- `Header` auth controls
- `DebugPage` (development only)
- `AuthSmokeTestPage` (development only)

## Completed Vendor Panel Auth Files

- `/apps/vendor-panel/src/services/api/auth.api.ts`
- `/apps/vendor-panel/src/store/auth.store.ts`
- `/apps/vendor-panel/src/services/auth/session-storage.service.ts`
- `/apps/vendor-panel/src/services/auth/logout.service.ts`
- `/apps/vendor-panel/src/services/auth/token-refresh.service.ts`
- `/apps/vendor-panel/src/hooks/useRestoreVendorSession.ts`
- `/apps/vendor-panel/src/hooks/useVendorPermissions.ts`
- `/apps/vendor-panel/src/hooks/useCountdown.ts`
- `/apps/vendor-panel/src/utils/auth-response.util.ts`
- `/apps/vendor-panel/src/utils/auth-event-logger.ts`

## Completed API Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`
- `GET /api/v1/vendor/me/permissions`

## Vendor Panel Auth Storage Keys

- `VENDOR_ACCESS_TOKEN`
- `VENDOR_REFRESH_TOKEN`
- `VENDOR_USER_ID`
- `VENDOR_ID`
- `STORE_ID`
- `VENDOR_CITY_ID`
- `VENDOR_ROLE`
- `VENDOR_PERMISSIONS`

## DB Collections Used

- `user_identities`
- `auth_sessions`
- `otp_challenges`

## DB Fields Touched

- `user_identities._id`
- `user_identities.role`
- `user_identities.permissions`
- `user_identities.vendorId`
- `user_identities.storeId`
- `user_identities.cityId`
- `user_identities.accountStatus`
- `auth_sessions.userId`
- `auth_sessions.role`
- `auth_sessions.expiresAt`
- `auth_sessions.isRevoked`
- `otp_challenges.phone`
- `otp_challenges.role`
- `otp_challenges.expiresAt`
- `otp_challenges.verifiedAt`
- `otp_challenges.attemptCount`
- `otp_challenges.resendCount`

## Known Pending Items

- Live runtime verification against a running backend and MongoDB is still a
  manual follow-up
- Refresh-token retry integration into Axios `401` handling remains deferred
- Vendor business workflows beyond auth/session details belong to later Vendor
  Panel modules
