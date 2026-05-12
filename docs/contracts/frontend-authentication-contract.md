# Frontend Authentication Contract

## Frontend Auth Goal

All four frontends must use the same auth API contract but store different user IDs and role scopes.

## Customer App Auth Storage Fields

- `accessToken`
- `refreshToken`
- `customerId`
- `isAuthenticated`

## Delivery Agent App Auth Storage Fields

- `accessToken`
- `refreshToken`
- `deliveryAgentId`
- `isAuthenticated`

## Vendor Panel Auth Storage Fields

- `accessToken`
- `refreshToken`
- `vendorUserId`
- `vendorId`
- `storeId`
- `role`
- `permissions`
- `isAuthenticated`

## Admin Dashboard Auth Storage Fields

- `accessToken`
- `refreshToken`
- `adminId`
- `role`
- `permissions`
- `isAuthenticated`

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

## DB Fields

No new database fields created in this task.
