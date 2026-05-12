# Backend Auth Core Request OTP Flow

## Goal

Document the planned `authService.requestOtp(input, context)` flow.

## Planned File Path

- `/backend/api/src/modules/auth/services/auth.service.ts`

## Planned Dependencies

- user identity repository
- OTP challenge repository
- OTP service
- OTP provider service
- audit log service

## Flow

1. Validate user exists by `phone` and `role`.
2. If user does not exist, throw `USER_NOT_FOUND`.
3. If user account is blocked, throw `ACCOUNT_BLOCKED`.
4. If user account is inactive, throw `ACCOUNT_INACTIVE`.
5. If user account is pending approval, throw `ACCOUNT_PENDING_APPROVAL`.
6. Check latest active OTP challenge for same `phone`, `role`, and `purpose`.
7. If latest challenge exists and resend wait has not passed, throw `RATE_LIMITED`.
8. Generate OTP using `generateOtp()`.
9. Hash OTP using `hashOtp()`.
10. Create OTP challenge with:
    `phone`, `role`, `otpHash`, `purpose`, `deliveryChannel`, `deliveryTarget`,
    `expiresAt`, `attemptCount`, `maxAttempts`, `resendCount`, `maxResends`,
    `lastSentAt`, `ipAddress`, `userAgent`, `requestId`, `traceId`
11. Send OTP using `sendOtp()`.
12. Write audit event `auth.otp_requested`.
13. Return:
    `challengeId`, `expiresIn`, `canResendAfter`, `deliveryChannel`, `maskedTarget`
