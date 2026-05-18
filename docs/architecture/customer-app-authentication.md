# Customer App Authentication

## Customer App Authentication Goal

Customer App authentication uses OTP-based login for the fixed `customer` role on
the `customer_app` surface. The module wires Customer App login, OTP verify,
session restore, permission fetch, and logout flows to the shared Phase 2 auth
backend without introducing cross-surface role selection.

## Customer Login Role

- Fixed role: `customer`
- Customer App must never allow role switching on login
- Customer App must reject auth responses that do not resolve to the `customer`
  role

## Customer App Surface

- Fixed app surface: `customer_app`
- OTP verify requests from Customer App must always send
  `device.appSurface = customer_app`
- Customer App must not reuse Vendor Panel, Admin Dashboard, or Delivery Agent
  auth surfaces

## Customer Auth Screens

- `LoginScreen`
- `OtpVerificationScreen`
- `HomeScreen`
- `ProfileScreen`
- `DebugScreen` (development only)
- `AuthSmokeTestScreen` (development only)

## Customer Auth APIs

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`
- `GET /api/v1/customer/me/permissions`

## Customer Auth Storage

- `CUSTOMER_ACCESS_TOKEN`
- `CUSTOMER_REFRESH_TOKEN`
- `CUSTOMER_ID`
- `CUSTOMER_CITY_ID`
- `CUSTOMER_ROLE`
- `CUSTOMER_PERMISSIONS`

## Customer Scope Rules

- Customer App can access only customer-owned data
- Backend must map authenticated `userId` to `customerId`
- For the Customer App auth flow, `customerId` resolves from the authenticated
  user identity rather than a vendor or store scope
- Customer App does not use vendor or store scopes for protected entry

## DB Fields

- `user_identities._id`
- `user_identities.role`
- `user_identities.permissions`
- `user_identities.cityId`
- `user_identities.accountStatus`
- `auth_sessions.userId`
- `auth_sessions.role`
- `auth_sessions.expiresAt`
- `auth_sessions.isRevoked`
