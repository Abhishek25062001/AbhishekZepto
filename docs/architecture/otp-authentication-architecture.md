# OTP Authentication Architecture

## OTP Challenge Goal

OTP challenge stores temporary login verification state for phone-based authentication.

## Collection

- `otp_challenges`

## Planned Backend Files

- `/backend/api/src/modules/auth/models/otp-challenge.model.ts`
- `/backend/api/src/modules/auth/types/otp-challenge.types.ts`

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
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

## Indexes

- `phone + role + purpose + createdAt`
- `expiresAt`
- `phone + blockedUntil`
- TTL index placeholder on `expiresAt`

## Planned Types

- `OtpPurpose`
- `OtpDeliveryChannel`
- `CreateOtpChallengeInput`
- `VerifyOtpChallengeInput`

## API Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`

## DB Field Inventory

- `otp_challenges.phone`
- `otp_challenges.role`
- `otp_challenges.otpHash`
- `otp_challenges.purpose`
- `otp_challenges.deliveryChannel`
- `otp_challenges.deliveryTarget`
- `otp_challenges.expiresAt`
- `otp_challenges.attemptCount`
- `otp_challenges.maxAttempts`
- `otp_challenges.resendCount`
- `otp_challenges.maxResends`
- `otp_challenges.lastSentAt`
- `otp_challenges.verifiedAt`
- `otp_challenges.blockedUntil`
- `otp_challenges.ipAddress`
- `otp_challenges.userAgent`
- `otp_challenges.requestId`
- `otp_challenges.traceId`
- `otp_challenges.status`
- `otp_challenges.isDeleted`
- `otp_challenges.deletedAt`
- `otp_challenges.createdAt`
- `otp_challenges.updatedAt`
