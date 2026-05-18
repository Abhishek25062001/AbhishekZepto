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

## Customer App Verify Example

```json
{
  "phone": "9999999999",
  "role": "customer",
  "otp": "123456",
  "challengeId": "challenge_id",
  "device": {
    "deviceId": "customer-device-placeholder",
    "deviceType": "android",
    "appSurface": "customer_app",
    "appVersion": "1.0.0"
  }
}
```

## Delivery Agent App Verify Example

```json
{
  "phone": "6666666666",
  "role": "delivery_agent",
  "otp": "123456",
  "challengeId": "challenge_id",
  "device": {
    "deviceId": "delivery-device-placeholder",
    "deviceType": "android",
    "appSurface": "delivery_agent_app",
    "appVersion": "1.0.0"
  }
}
```

## Vendor Panel Verify Example

```json
{
  "phone": "7777777777",
  "role": "vendor_owner",
  "otp": "123456",
  "challengeId": "challenge_id",
  "device": {
    "deviceId": "vendor-web-browser",
    "deviceType": "web",
    "appSurface": "vendor_panel",
    "appVersion": "1.0.0"
  }
}
```

## Admin Dashboard Verify Example

```json
{
  "phone": "6666666666",
  "role": "super_admin",
  "otp": "123456",
  "challengeId": "challenge_id",
  "device": {
    "deviceId": "admin-web-browser",
    "deviceType": "web",
    "appSurface": "admin_dashboard",
    "appVersion": "1.0.0"
  }
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
