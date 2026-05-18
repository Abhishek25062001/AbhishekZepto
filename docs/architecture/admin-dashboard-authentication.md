# Admin Dashboard Authentication

## Admin Dashboard Authentication Goal

Admin Dashboard authentication uses OTP-based login for the `super_admin`
login entry on the `admin_dashboard` surface. The module wires Admin
Dashboard login, OTP verify, session restore, permission fetch, and logout
flows to the shared Phase 2 auth backend.

## Admin Login Role

- Login request role: `super_admin`
- Supported protected-entry role family:
  `super_admin`, `support_admin`, `operations_admin`
- Admin Dashboard must reject auth responses outside the admin role family

## Admin Dashboard App Surface

- Fixed app surface: `admin_dashboard`
- OTP verify requests from Admin Dashboard must always send
  `device.appSurface = admin_dashboard`

## Admin Dashboard Auth Screens

- `LoginPage`
- `OtpVerificationPage`
- `DashboardPage`
- `Header` auth controls
- `DebugPage` (development only)
- `AuthSmokeTestPage` (development only)

## Admin Dashboard Auth APIs

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`
- `GET /api/v1/admin/me/permissions`

## Admin Dashboard Auth Storage

- `ADMIN_ACCESS_TOKEN`
- `ADMIN_REFRESH_TOKEN`
- `ADMIN_ID`
- `ADMIN_ROLE`
- `ADMIN_PERMISSIONS`

## Admin Scope Rules

- Admin Dashboard can access only authenticated admin user context
- Backend must map authenticated `userId` to `adminId`
- Protected Admin Dashboard entry requires supported admin role only

## DB Fields

- `user_identities._id`
- `user_identities.role`
- `user_identities.permissions`
- `user_identities.accountStatus`
- `auth_sessions.userId`
- `auth_sessions.role`
- `auth_sessions.expiresAt`
- `auth_sessions.isRevoked`
