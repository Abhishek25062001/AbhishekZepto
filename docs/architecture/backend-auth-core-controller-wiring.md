# Backend Auth Core Controller Wiring

## Goal

Document the planned auth controller updates to call the real auth service.

## Planned File Path

- `/backend/api/src/modules/auth/controllers/auth.controller.ts`

## Planned Service Import

- `authService`

## requestOtpController()

- Pass `req.body` and request context to `authService.requestOtp()`
- Include request context:
  `ipAddress`, `userAgent`, `requestId`, `traceId`
- Return message: `OTP sent successfully`

## verifyOtpController()

- Pass `req.body` and request context to `authService.verifyOtp()`
- Return message: `OTP verified successfully`

## refreshTokenController()

- Pass `req.body` and request context to `authService.refreshAccessToken()`
- Return message: `Token refreshed successfully`

## logoutController()

- Pass `req.body` and request context to `authService.logout()`
- Return message: `Logged out successfully`

## Controller Rules

- Ensure all controllers use `asyncHandler()`
- Ensure all controllers use `sendSuccessResponse()`
- Remove Phase 1 placeholder response text from all auth controllers
