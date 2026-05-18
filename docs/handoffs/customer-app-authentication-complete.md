# Customer App Authentication Complete

## Completed Customer App Screens

- `LoginScreen`
- `OtpVerificationScreen`
- `HomeScreen`
- `ProfileScreen`
- `DebugScreen` (development only)
- `AuthSmokeTestScreen` (development only)

## Completed Customer App Auth Files

- `/apps/customer-app/src/services/api/auth.api.ts`
- `/apps/customer-app/src/store/auth.store.ts`
- `/apps/customer-app/src/services/auth/session-storage.service.ts`
- `/apps/customer-app/src/services/auth/logout.service.ts`
- `/apps/customer-app/src/services/auth/token-refresh.service.ts`
- `/apps/customer-app/src/hooks/useRestoreCustomerSession.ts`
- `/apps/customer-app/src/hooks/useCustomerPermissions.ts`
- `/apps/customer-app/src/hooks/useCountdown.ts`
- `/apps/customer-app/src/utils/auth-response.util.ts`
- `/apps/customer-app/src/utils/auth-event-logger.ts`

## Completed API Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`
- `GET /api/v1/customer/me/permissions`

## Customer App Auth Storage Keys

- `CUSTOMER_ACCESS_TOKEN`
- `CUSTOMER_REFRESH_TOKEN`
- `CUSTOMER_ID`
- `CUSTOMER_CITY_ID`
- `CUSTOMER_ROLE`
- `CUSTOMER_PERMISSIONS`

## DB Collections Used

- `user_identities`
- `auth_sessions`
- `otp_challenges`

## DB Fields Touched

- `user_identities._id`
- `user_identities.role`
- `user_identities.permissions`
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
- Customer profile domain data beyond auth/session details belongs to later
  Customer App modules
