# Backend Auth Core Verify OTP Flow

## Goal

Document the planned `authService.verifyOtp(input, context)` flow.

## Planned File Path

- `/backend/api/src/modules/auth/services/auth.service.ts`

## Flow

1. Find OTP challenge by `challengeId`.
2. Verify challenge belongs to `phone` and `role`.
3. If challenge not found, throw `OTP_CHALLENGE_NOT_FOUND`.
4. If challenge is expired, mark challenge expired and throw `OTP_EXPIRED`.
5. If challenge is already verified, throw `INVALID_OTP`.
6. If challenge attempts exceeded, throw `OTP_ATTEMPTS_EXCEEDED`.
7. Verify incoming OTP against `otpHash`.
8. If OTP is invalid, increment `attemptCount`.
9. If attempt count reaches max attempts, block challenge.
10. If OTP is invalid, write audit event `auth.otp_verify_failed`.
11. If OTP is invalid, throw `INVALID_OTP` with `attemptsRemaining`.
12. Find user identity by `phone` and `role`.
13. Validate user account is allowed to login.
14. Mark OTP challenge as verified.
15. Generate refresh token.
16. Create auth session with:
    `userId`, `role`, `refreshTokenHash`, `deviceId`, `deviceType`,
    `appSurface`, `appVersion`, `ipAddress`, `userAgent`, `expiresAt`,
    `isRevoked`, `lastUsedAt`
17. Generate access token with:
    `userId`, `role`, `sessionId`, `permissions`, `vendorId`, `storeId`, `cityId`
18. Update `user_identities.lastLoginAt`.
19. Write audit event `auth.login_success`.
20. Return `accessToken`, `refreshToken`, `expiresIn`, `user`
