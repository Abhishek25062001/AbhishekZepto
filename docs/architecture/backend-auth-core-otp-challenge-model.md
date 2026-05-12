# Backend Auth Core OTP Challenge Model

## Goal

Document the planned `otp_challenges` backend model for Phase 2 Module 3: Backend Auth Core.

## Planned File Paths

- `/backend/api/src/modules/auth/models/otp-challenge.model.ts`
- `/backend/api/src/modules/auth/models/index.ts`

## Planned Imports

- `mongoose`
- `baseSchemaOptions` from `/backend/api/src/database/base-schema-options.ts`
- `baseSchemaFields` from `/backend/api/src/database/base-schema-fields.ts`
- `AUTH_ROLES` from `/backend/api/src/modules/auth/constants/auth-role.constants.ts`

## Planned Schema

- Create `OtpChallengeSchema`
- Set MongoDB collection name to `otp_challenges`

## DB Fields

- `phone: string`
- `role: AuthRole`
- `otpHash: string`
- `purpose: 'login' | 'signup' | 'reauth'`
- `deliveryChannel: 'sms' | 'whatsapp' | 'email'`
- `deliveryTarget: string`
- `expiresAt: Date`
- `attemptCount: number`
- `maxAttempts: number`
- `resendCount: number`
- `maxResends: number`
- `lastSentAt: Date`
- `verifiedAt: Date | null`
- `blockedUntil: Date | null`
- `ipAddress: string | null`
- `userAgent: string | null`
- `requestId: string | null`
- `traceId: string | null`

## Base DB Fields

Using `baseSchemaFields`:

- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

## Default Values

- `purpose: 'login'`
- `deliveryChannel: 'sms'`
- `attemptCount: 0`
- `maxAttempts: 5`
- `resendCount: 0`
- `maxResends: 3`

## Planned Indexes

- `{ phone: 1, role: 1, purpose: 1, createdAt: -1 }`
- `{ expiresAt: 1 }`
- `{ phone: 1, blockedUntil: 1 }`

## TTL Placeholder

Planned TTL index placeholder:

- `{ expiresAt: 1 }`

## Planned Export

- Export `OtpChallengeModel`
- Re-export `OtpChallengeModel` from `/backend/api/src/modules/auth/models/index.ts`
