# Frontend Auth API Service Architecture

## Frontend Auth API Service Goal

Each frontend must call auth endpoints through `auth.api.ts` from screens/pages, never directly.

## Planned Frontend Auth API Service Files

- `/apps/customer-app/src/services/api/auth.api.ts`
- `/apps/delivery-agent-app/src/services/api/auth.api.ts`
- `/apps/vendor-panel/src/services/api/auth.api.ts`
- `/apps/admin-dashboard/src/services/api/auth.api.ts`

Each file exposes:

- `requestOtp(body)`
- `verifyOtp(body)`
- `refreshToken(body)`
- `logout(body)`

## Planned Shared Frontend Auth API Types

Planned file:

- `/packages/shared/api/auth-api.types.ts`

Types:

- `RequestOtpBody`
- `RequestOtpResponse`
- `VerifyOtpBody`
- `VerifyOtpResponse`
- `RefreshTokenBody`
- `RefreshTokenResponse`
- `LogoutBody`
- `LogoutResponse`

Planned export file:

- `/packages/shared/api/index.ts`

Planned export:

- Export auth API types.

## API Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`

## DB Fields

No new database fields created in this task.
