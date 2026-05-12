# Backend Auth Core API Verification

## Goal

Document the planned happy-path runtime verification for Backend Auth Core.

## Startup

- Start MongoDB
- Start Redis if required by current setup
- Run backend server: `npm run dev -w backend/api`
- Run seed command: `npm run seed -w backend/api`

## Customer OTP Request

```bash
curl -X POST http://localhost:5000/api/v1/public/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9999999999","role":"customer","purpose":"login","deliveryChannel":"sms"}'
```

Confirm response includes:

- `challengeId`
- `expiresIn`
- `canResendAfter`
- `maskedTarget`

Confirm `otp_challenges` record includes:

- `phone`
- `role`
- `otpHash`
- `purpose`
- `deliveryChannel`
- `deliveryTarget`
- `expiresAt`
- `attemptCount`
- `maxAttempts`
- `resendCount`
- `maxResends`
- `lastSentAt`
- `verifiedAt`
- `blockedUntil`
- `status`
- `createdAt`
- `updatedAt`

## Customer OTP Verification

```bash
curl -X POST http://localhost:5000/api/v1/public/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9999999999","role":"customer","otp":"123456","challengeId":"REPLACE_CHALLENGE_ID"}'
```

Confirm response includes:

- `accessToken`
- `refreshToken`
- `expiresIn`
- `user`

Confirm `auth_sessions` record includes:

- `userId`
- `role`
- `refreshTokenHash`
- `deviceType`
- `appSurface`
- `appVersion`
- `expiresAt`
- `isRevoked`
- `lastUsedAt`
- `createdAt`
- `updatedAt`

Confirm `user_identities.lastLoginAt` is updated.

## Protected Route

```bash
curl http://localhost:5000/api/v1/internal/auth/test-protected \
  -H "Authorization: Bearer REPLACE_ACCESS_TOKEN"
```

Confirm protected route returns user context.

## Refresh Token

```bash
curl -X POST http://localhost:5000/api/v1/public/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"REPLACE_REFRESH_TOKEN"}'
```

Confirm response includes new access token.

## Logout

```bash
curl -X POST http://localhost:5000/api/v1/public/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"REPLACE_REFRESH_TOKEN","logoutAllDevices":false}'
```

Confirm related session fields:

- `auth_sessions.isRevoked = true`
- `auth_sessions.revokedAt` is set
- `auth_sessions.revokedReason = user_logout`
