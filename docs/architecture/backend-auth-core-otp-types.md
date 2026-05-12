# Backend Auth Core OTP Types

## Goal

Document the planned OTP challenge TypeScript types for Backend Auth Core.

## Planned File Paths

- `/backend/api/src/modules/auth/types/otp-challenge.types.ts`
- `/backend/api/src/modules/auth/types/index.ts`

## Types

- `OtpPurpose = 'login' | 'signup' | 'reauth'`
- `OtpDeliveryChannel = 'sms' | 'whatsapp' | 'email'`

## CreateOtpChallengeInput

- `phone`
- `role`
- `otpHash`
- `purpose`
- `deliveryChannel`
- `deliveryTarget`
- `expiresAt`
- `ipAddress`
- `userAgent`
- `requestId`
- `traceId`

## VerifyOtpChallengeInput

- `challengeId`
- `phone`
- `role`
- `otp`

## OtpChallengePublicResult

- `challengeId: string`
- `expiresIn: number`
- `canResendAfter: number`
- `deliveryChannel: OtpDeliveryChannel`
- `maskedTarget: string`

## Planned Export

- Export OTP challenge types from `/backend/api/src/modules/auth/types/index.ts`
