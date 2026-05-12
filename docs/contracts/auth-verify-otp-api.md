# Auth Verify OTP API Contract

## API Endpoint

`POST /api/v1/public/auth/verify-otp`

## Request Body

```json
{
  "phone": "9999999999",
  "role": "customer",
  "otp": "123456",
  "challengeId": "string",
  "device": {
    "deviceId": "string",
    "deviceType": "android",
    "appSurface": "customer_app",
    "appVersion": "1.0.0"
  }
}
```

## Request Validation Rules

- `phone` is required.
- `role` is required.
- `otp` is required.
- `otp` must be 4-8 characters.
- `challengeId` is required.
- `device.appSurface` is required.
- `device.deviceType` is required.

Allowed device types:

- `android`
- `ios`
- `web`
- `unknown`

Allowed app surfaces:

- `customer_app`
- `delivery_agent_app`
- `vendor_panel`
- `admin_dashboard`

## Success Response

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "accessToken": "jwt_access_token",
    "refreshToken": "refresh_token",
    "expiresIn": 900,
    "user": {
      "userId": "string",
      "role": "customer",
      "permissions": [],
      "vendorId": null,
      "storeId": null,
      "cityId": null
    }
  },
  "meta": {}
}
```

## Invalid OTP Error Response

```json
{
  "success": false,
  "message": "Invalid OTP",
  "error": {
    "code": "INVALID_OTP",
    "details": {
      "attemptsRemaining": 4
    }
  }
}
```

## Expired OTP Error Response

```json
{
  "success": false,
  "message": "OTP expired",
  "error": {
    "code": "OTP_EXPIRED",
    "details": {}
  }
}
```

## Max Attempts Error Response

```json
{
  "success": false,
  "message": "Maximum OTP attempts reached",
  "error": {
    "code": "OTP_ATTEMPTS_EXCEEDED",
    "details": {}
  }
}
```

## Planned Backend Updates

- `/backend/api/src/modules/auth/validators/auth.validators.ts`
  - Add `challengeId` field to `verifyOtpValidator`.
  - Add device object validation to `verifyOtpValidator`.
- `/backend/api/src/modules/auth/types/auth-api.types.ts`
  - Add `VerifyOtpBody` type.
  - Add `VerifyOtpResponse` type.

## DB Fields

- `otp_challenges.verifiedAt`
- `otp_challenges.attemptCount`
- `auth_sessions.userId`
- `auth_sessions.role`
- `auth_sessions.refreshTokenHash`
- `auth_sessions.deviceId`
- `auth_sessions.deviceType`
- `auth_sessions.appSurface`
- `auth_sessions.appVersion`
- `auth_sessions.ipAddress`
- `auth_sessions.userAgent`
- `auth_sessions.expiresAt`
- `auth_sessions.isRevoked`
- `user_identities.lastLoginAt`
