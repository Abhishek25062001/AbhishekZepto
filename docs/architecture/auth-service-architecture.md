# Auth Service Architecture

## Auth Service Goal

Auth service coordinates OTP, user identity, session, token, audit, and security checks.

## Planned Auth Service

Planned file:

- `/backend/api/src/modules/auth/services/auth.service.ts`

Function signatures:

- `requestOtp(input)`
- `verifyOtp(input)`
- `refreshAccessToken(input)`
- `logout(input)`

## Planned OTP Service

Planned file:

- `/backend/api/src/modules/auth/services/otp.service.ts`

Function signatures:

- `generateOtp()`
- `hashOtp(otp)`
- `verifyOtpHash(otp, otpHash)`
- `maskOtpTarget(phoneOrEmail)`

## Planned Session Service

Planned file:

- `/backend/api/src/modules/auth/services/session.service.ts`

Function signatures:

- `createSessionForUser(input)`
- `validateSession(sessionId)`
- `revokeSession(sessionId, reason)`
- `revokeAllUserSessions(userId, reason)`

## Planned OTP Provider Service

Planned file:

- `/backend/api/src/modules/auth/services/otp-provider.service.ts`

Function signature:

- `sendOtp(input)`

Placeholder implementation note:

- Phase implementation can use console/dev provider first, then SMS provider.

## Planned Service Index

Planned file:

- `/backend/api/src/modules/auth/services/index.ts`

Planned exports:

- Export auth service.
- Export OTP service.
- Export token service.
- Export session service.
- Export permission service.

## API Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`

## DB Fields

- `otp_challenges.*`
- `auth_sessions.*`
- `user_identities.*`
- `roles.*`
- `audit_logs.*`
