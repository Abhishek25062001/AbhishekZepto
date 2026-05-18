# Vendor Panel Authentication

## Vendor Panel Authentication Goal

Vendor Panel authentication uses OTP-based login for the `vendor_owner` login
entry on the `vendor_panel` surface. The module wires Vendor Panel login, OTP
verify, session restore, permission fetch, and logout flows to the shared Phase
2 auth backend.

## Vendor Login Role

- Login request role: `vendor_owner`
- Supported protected-entry role family:
  `vendor_owner`, `store_manager`, `store_staff`
- Vendor Panel must reject auth responses outside the vendor role family

## Vendor Panel App Surface

- Fixed app surface: `vendor_panel`
- OTP verify requests from Vendor Panel must always send
  `device.appSurface = vendor_panel`

## Vendor Panel Auth Screens

- `LoginPage`
- `OtpVerificationPage`
- `DashboardPage`
- `Header` auth controls
- `DebugPage` (development only)
- `AuthSmokeTestPage` (development only)

## Vendor Panel Auth APIs

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`
- `GET /api/v1/vendor/me/permissions`

## Vendor Panel Auth Storage

- `VENDOR_ACCESS_TOKEN`
- `VENDOR_REFRESH_TOKEN`
- `VENDOR_USER_ID`
- `VENDOR_ID`
- `STORE_ID`
- `VENDOR_CITY_ID`
- `VENDOR_ROLE`
- `VENDOR_PERMISSIONS`

## Vendor Scope Rules

- Vendor Panel can access only the authenticated vendor user context
- Backend must map authenticated `userId` to `vendorUserId`
- Protected Vendor Panel entry requires valid `vendorId` and `storeId`
- Vendor Panel scope enforcement remains at auth/protected-entry level in this
  module

## DB Fields

- `user_identities._id`
- `user_identities.role`
- `user_identities.permissions`
- `user_identities.vendorId`
- `user_identities.storeId`
- `user_identities.cityId`
- `user_identities.accountStatus`
- `auth_sessions.userId`
- `auth_sessions.role`
- `auth_sessions.expiresAt`
- `auth_sessions.isRevoked`
