# Frontend Authentication Contract

## Frontend Auth Goal

All four frontends must use the same auth API contract but store different user IDs and role scopes.

## Customer App Auth Storage Fields

- `accessToken`
- `refreshToken`
- `customerId`
- `cityId`
- `role`
- `permissions`
- `isAuthenticated`

## Customer App Auth Flow

- Fixed role: `customer`
- Fixed app surface: `customer_app`
- Screens:
  - `LoginScreen`
  - `OtpVerificationScreen`
  - `HomeScreen`
  - `ProfileScreen`
  - `DebugScreen` (development only)
  - `AuthSmokeTestScreen` (development only)

## Delivery Agent App Auth Storage Fields

- `accessToken`
- `refreshToken`
- `deliveryAgentId`
- `cityId`
- `role`
- `permissions`
- `isAuthenticated`

## Delivery Agent App Auth Flow

- Fixed role: `delivery_agent`
- Fixed app surface: `delivery_agent_app`
- Screens:
  - `LoginScreen`
  - `OtpVerificationScreen`
  - `DeliveryHomeScreen`
  - `ProfileScreen`
  - `DebugScreen` (development only)
  - `AuthSmokeTestScreen` (development only)

## Vendor Panel Auth Storage Fields

- `accessToken`
- `refreshToken`
- `vendorUserId`
- `vendorId`
- `storeId`
- `cityId`
- `role`
- `permissions`
- `isAuthenticated`

## Vendor Panel Auth Flow

- Login role: `vendor_owner`
- Accepted protected-entry roles:
  `vendor_owner`, `store_manager`, `store_staff`
- Fixed app surface: `vendor_panel`
- Screens:
  - `LoginPage`
  - `OtpVerificationPage`
  - `DashboardPage`
  - `Header` auth controls
  - `DebugPage` (development only)
  - `AuthSmokeTestPage` (development only)

## Vendor Panel Permissions API

- `GET /api/v1/vendor/me/permissions`

## Admin Dashboard Auth Storage Fields

- `accessToken`
- `refreshToken`
- `adminId`
- `role`
- `permissions`
- `isAuthenticated`

## Admin Dashboard Auth Flow

- Login role: `super_admin`
- Accepted protected-entry roles:
  `super_admin`, `support_admin`, `operations_admin`
- Fixed app surface: `admin_dashboard`
- Screens:
  - `LoginPage`
  - `OtpVerificationPage`
  - `DashboardPage`
  - `Header` auth controls
  - `DebugPage` (development only)
  - `AuthSmokeTestPage` (development only)

## Admin Dashboard Permissions API

- `GET /api/v1/admin/me/permissions`

## Planned Frontend Auth API Service Files

- Customer App: `/apps/customer-app/src/services/api/auth.api.ts`
- Delivery Agent App: `/apps/delivery-agent-app/src/services/api/auth.api.ts`
- Vendor Panel: `/apps/vendor-panel/src/services/api/auth.api.ts`
- Admin Dashboard: `/apps/admin-dashboard/src/services/api/auth.api.ts`

## Frontend Auth API Calls

- Request OTP call: `POST /api/v1/public/auth/request-otp`
- Verify OTP call: `POST /api/v1/public/auth/verify-otp`
- Refresh token call: `POST /api/v1/public/auth/refresh-token`
- Logout call: `POST /api/v1/public/auth/logout`

## Frontend Authorization Header

`Authorization: Bearer <accessToken>`

## Frontend Authorization Rules

- Frontend must not decode token for final authorization decisions.
- Frontend may use permissions only for UI visibility.
- Backend remains final authorization authority.

## Access Control Matrix

Phase 2 consolidated allow and deny expectations are documented in:

- `docs/contracts/access-control-test-matrix.md`

## DB Fields

No new database fields created in this task.
