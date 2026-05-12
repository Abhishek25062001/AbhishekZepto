# Backend Auth Core Failure Verification

## Goal

Document the planned validation and failure-path verification for Backend Auth Core.

## Request OTP Validation

- Test invalid phone on request OTP and confirm status `422`
- Test invalid role on request OTP and confirm standard validation error

## Verify OTP Failures

- Test wrong OTP and confirm error code `INVALID_OTP`
- Confirm `otp_challenges.attemptCount` increments
- Test expired OTP by manually setting `expiresAt` in database to past date and confirm `OTP_EXPIRED`
- Test max OTP attempts and confirm `OTP_ATTEMPTS_EXCEEDED`

## Refresh Token Failure

- Test refresh token with invalid token and confirm `INVALID_REFRESH_TOKEN`

## Protected Route Failure

- Test protected route without token and confirm status `401`
- Test protected route with revoked session token and confirm `SESSION_REVOKED`

## Account Status Failure

- Test blocked user login by setting `user_identities.accountStatus` to `blocked`
- Confirm request OTP or verify OTP returns `ACCOUNT_BLOCKED`
