# Backend Auth Core Validator Rules

## Goal

Document the planned auth validator updates for Backend Auth Core.

## Planned File Path

- `/backend/api/src/modules/auth/validators/auth.validators.ts`

## requestOtpValidator

- Add `purpose`
- Allowed values:
  `login`, `signup`, `reauth`
- Add `deliveryChannel`
- Allowed values:
  `sms`, `whatsapp`, `email`
- Make `purpose` optional with default `login`
- Make `deliveryChannel` optional with default `sms`

## verifyOtpValidator

- Add `challengeId`
- Add `device`

### device

- `deviceId` as optional string
- `deviceType` as required enum:
  `android`, `ios`, `web`, `unknown`
- `appSurface` as required enum:
  `customer_app`, `delivery_agent_app`, `vendor_panel`, `admin_dashboard`
- `appVersion` as optional string

## refreshTokenValidator

- Ensure `refreshToken` is required string

## logoutValidator

- Ensure `refreshToken` is required string
- Add optional boolean `logoutAllDevices`
