# Auth Request OTP API Contract

## API Endpoint

`POST /api/v1/public/auth/request-otp`

## Request Body

```json
{
  "phone": "9999999999",
  "role": "customer",
  "purpose": "login",
  "deliveryChannel": "sms"
}
```

## Request Validation Rules

- `phone` is required.
- `phone` must be 10-15 characters.
- `role` is required.
- `purpose` defaults to `login`.
- `deliveryChannel` defaults to `sms`.

## Success Response

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "challengeId": "string",
    "expiresIn": 300,
    "canResendAfter": 30,
    "deliveryChannel": "sms",
    "maskedTarget": "******9999"
  },
  "meta": {}
}
```

## Validation Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {}
  }
}
```

## Rate Limit Error Response

```json
{
  "success": false,
  "message": "Too many OTP requests",
  "error": {
    "code": "RATE_LIMITED",
    "details": {}
  }
}
```

## Blocked User Error Response

```json
{
  "success": false,
  "message": "Account is not allowed to login",
  "error": {
    "code": "ACCOUNT_BLOCKED",
    "details": {}
  }
}
```

## Planned Backend Updates

- `/backend/api/src/modules/auth/validators/auth.validators.ts`
  - Add `purpose` field to `requestOtpValidator`.
  - Add `deliveryChannel` field to `requestOtpValidator`.
- `/backend/api/src/modules/auth/types/auth-api.types.ts`
  - Add `RequestOtpBody` type.
  - Add `RequestOtpResponse` type.

## DB Fields

- `otp_challenges.phone`
- `otp_challenges.role`
- `otp_challenges.purpose`
- `otp_challenges.deliveryChannel`
- `otp_challenges.expiresAt`
- `otp_challenges.resendCount`
- `otp_challenges.status`
