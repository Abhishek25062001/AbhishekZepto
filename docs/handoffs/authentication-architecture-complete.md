# Authentication Architecture Complete

## Phase

Phase 2 - Foundation & Core Architecture.

## Module

Authentication Architecture.

## Status

Completed.

## Source

- `projectin micro/doctwo/PhaesDetail1&2.pdf` pages 312-365.

## Finalized Auth Architecture Document List

- `docs/architecture/authentication-architecture.md`
- `docs/architecture/authentication-flow-diagram.md`
- `docs/architecture/otp-authentication-architecture.md`
- `docs/architecture/jwt-token-architecture.md`
- `docs/architecture/auth-session-architecture.md`
- `docs/architecture/role-permission-architecture.md`
- `docs/architecture/authorization-middleware-architecture.md`
- `docs/architecture/auth-audit-architecture.md`
- `docs/architecture/auth-repository-architecture.md`
- `docs/architecture/auth-service-architecture.md`
- `docs/architecture/auth-controller-architecture.md`
- `docs/architecture/auth-route-architecture.md`
- `docs/architecture/frontend-auth-api-service-architecture.md`
- `docs/architecture/frontend-auth-screen-architecture.md`
- `docs/architecture/frontend-auth-state-architecture.md`

## Finalized Auth API Endpoint List

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`
- `GET /api/v1/internal/auth/test-protected`

## Finalized Auth DB Collection List

- `user_identities`
- `auth_sessions`
- `roles`
- `otp_challenges`
- `audit_logs`

## Finalized Auth DB Fields List

User identities:

- `user_identities.phone`
- `user_identities.email`
- `user_identities.name`
- `user_identities.role`
- `user_identities.accountStatus`
- `user_identities.permissions`
- `user_identities.vendorId`
- `user_identities.storeId`
- `user_identities.cityId`
- `user_identities.lastLoginAt`

Auth sessions:

- `auth_sessions.userId`
- `auth_sessions.role`
- `auth_sessions.refreshTokenHash`
- `auth_sessions.deviceId`
- `auth_sessions.deviceType`
- `auth_sessions.appSurface`
- `auth_sessions.appVersion`
- `auth_sessions.ipAddress`
- `auth_sessions.userAgent`
- `auth_sessions.expiresAt`
- `auth_sessions.revokedAt`
- `auth_sessions.revokedReason`
- `auth_sessions.lastUsedAt`
- `auth_sessions.isRevoked`

Roles:

- `roles.code`
- `roles.name`
- `roles.permissions`

OTP challenges:

- `otp_challenges.phone`
- `otp_challenges.role`
- `otp_challenges.otpHash`
- `otp_challenges.purpose`
- `otp_challenges.deliveryChannel`
- `otp_challenges.expiresAt`
- `otp_challenges.attemptCount`
- `otp_challenges.resendCount`
- `otp_challenges.verifiedAt`

Audit logs:

- `audit_logs.eventType`
- `audit_logs.actorId`
- `audit_logs.actorRole`
- `audit_logs.actorSurface`
- `audit_logs.metadata`
- `audit_logs.status`

## Planned Backend Paths

- `/backend/api/src/modules/auth/models/otp-challenge.model.ts`
- `/backend/api/src/modules/auth/services/auth.service.ts`
- `/backend/api/src/modules/auth/services/otp.service.ts`
- `/backend/api/src/modules/auth/services/session.service.ts`

## Planned Frontend Paths

- `/apps/customer-app/src/services/api/auth.api.ts`
- `/apps/delivery-agent-app/src/services/api/auth.api.ts`
- `/apps/vendor-panel/src/services/api/auth.api.ts`
- `/apps/admin-dashboard/src/services/api/auth.api.ts`
- `/apps/customer-app/src/screens/auth/OtpVerificationScreen.tsx`
- `/apps/delivery-agent-app/src/screens/auth/OtpVerificationScreen.tsx`
- `/apps/vendor-panel/src/pages/auth/OtpVerificationPage.tsx`
- `/apps/admin-dashboard/src/pages/auth/OtpVerificationPage.tsx`

## Known Pending Items

- Actual OTP sending implementation comes in OTP Login System.
- Actual JWT signing implementation comes in OTP Login System.
- Production SMS/WhatsApp provider setup comes in OTP Login System.
- Frontend login screen API integration comes in OTP Login System.
- Advanced device/session management comes in later security hardening.

## Next Module

Backend Auth Core.
