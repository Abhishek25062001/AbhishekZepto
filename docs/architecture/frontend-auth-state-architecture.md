# Frontend Auth State Architecture

## Frontend Auth State Goal

Successful OTP verification updates local auth store and session storage.

## Customer App Auth Store Contract

Planned file:

- `/apps/customer-app/src/store/auth.store.ts`

State fields:

- `accessToken`
- `refreshToken`
- `customerId`
- `isAuthenticated`

Actions:

- `setAuthSession`
- `clearAuthSession`

## Delivery Agent App Auth Store Contract

Planned file:

- `/apps/delivery-agent-app/src/store/auth.store.ts`

State fields:

- `accessToken`
- `refreshToken`
- `deliveryAgentId`
- `isAuthenticated`

Actions:

- `setAuthSession`
- `clearAuthSession`

## Vendor Panel Auth Store Contract

Planned file:

- `/apps/vendor-panel/src/store/auth.store.ts`

State fields:

- `accessToken`
- `refreshToken`
- `vendorUserId`
- `vendorId`
- `storeId`
- `role`
- `permissions`
- `isAuthenticated`

Actions:

- `setAuthSession`
- `clearAuthSession`

## Admin Dashboard Auth Store Contract

Planned file:

- `/apps/admin-dashboard/src/store/auth.store.ts`

State fields:

- `accessToken`
- `refreshToken`
- `adminId`
- `role`
- `permissions`
- `isAuthenticated`

Actions:

- `setAuthSession`
- `clearAuthSession`

## Post Login Flow

1. `verifyOtp` success.
2. Save session in secure/local storage.
3. Update auth store.
4. Navigate to main/dashboard route.

## Logout Flow

1. Call logout API.
2. Clear session storage.
3. Clear auth store.
4. Navigate to login.

## API Endpoints

- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/logout`

## DB Fields

No new database fields created in this task.
