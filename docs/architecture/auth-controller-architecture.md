# Auth Controller Architecture

## Auth Controller Goal

Controllers only handle HTTP request/response and call auth services.

## Planned Controller File

- `/backend/api/src/modules/auth/controllers/auth.controller.ts`

## Controller Functions

- `requestOtpController`
  - Calls `authService.requestOtp()`.
- `verifyOtpController`
  - Calls `authService.verifyOtp()`.
- `refreshTokenController`
  - Calls `authService.refreshAccessToken()`.
- `logoutController`
  - Calls `authService.logout()`.

## Controller Rules

- All controllers use `asyncHandler`.
- All controllers use `sendSuccessResponse`.
- Created or accepted responses use the correct response helper if needed.
- Controllers do not directly access Mongoose models.
- Controllers do not generate OTP directly.
- Controllers do not sign JWT directly.

## API Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`

## DB Fields

No new database fields created in this task.
