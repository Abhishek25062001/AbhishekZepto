# Auth Repository Architecture

## Auth Repository Goal

Repository layer owns database read/write operations for auth models.

## User Identity Repository

Planned file:

- `/backend/api/src/modules/auth/repositories/user-identity.repository.ts`

Functions:

- `findUserIdentityById`
- `findUserIdentityByPhoneAndRole`
- `createUserIdentity`
- `updateLastLoginAt`

## Auth Session Repository

Planned file:

- `/backend/api/src/modules/auth/repositories/auth-session.repository.ts`

Functions:

- `createAuthSession`
- `findSessionById`
- `findSessionByRefreshTokenHash`
- `revokeSessionById`
- `revokeAllSessionsForUser`

## OTP Challenge Repository

Planned file:

- `/backend/api/src/modules/auth/repositories/otp-challenge.repository.ts`

Function signatures:

- `createOtpChallenge(input)`
- `findLatestActiveOtpChallenge(phone, role, purpose)`
- `findOtpChallengeById(challengeId)`
- `incrementOtpAttempt(challengeId)`
- `markOtpChallengeVerified(challengeId)`
- `blockOtpChallenge(challengeId, blockedUntil)`
- `markOtpChallengeExpired(challengeId)`

## Role Repository

Planned file:

- `/backend/api/src/modules/auth/repositories/role.repository.ts`

Functions:

- `findRoleByCode`
- `listActiveRoles`
- `upsertSystemRole`

## Repository Index

Planned file:

- `/backend/api/src/modules/auth/repositories/index.ts`

Planned export:

- Export `otp-challenge.repository.ts`.

## API Endpoints

No new API endpoints created in this task.

## DB Fields

- `otp_challenges.phone`
- `otp_challenges.role`
- `otp_challenges.purpose`
- `otp_challenges.otpHash`
- `otp_challenges.expiresAt`
- `otp_challenges.attemptCount`
- `otp_challenges.verifiedAt`
- `otp_challenges.blockedUntil`
- `auth_sessions.refreshTokenHash`
- `user_identities.lastLoginAt`
- `roles.code`
