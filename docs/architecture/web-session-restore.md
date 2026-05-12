# Web Session Restore

## Scope

This document describes Phase 1 startup session restore for the Vendor Panel and Admin Dashboard.

## Vendor Panel Flow

1. App startup renders the query provider.
2. `useRestoreVendorSession` reads the Vendor Panel localStorage session.
3. If `accessToken`, `refreshToken`, `vendorUserId`, `vendorId`, and `storeId` are present, the hook restores them into the Vendor auth store.
4. After restore completes, the router renders and protected routes use the auth store.

## Admin Dashboard Flow

1. App startup renders the query provider.
2. `useRestoreAdminSession` reads the Admin Dashboard localStorage session.
3. If `accessToken`, `refreshToken`, and `adminId` are present, the hook restores them into the Admin auth store.
4. After restore completes, the router renders and protected routes use the auth store.

## Deferred To Later Phase

- Token refresh validation.
- Token expiry handling.
- Backend session validation before route unlock.
- Secure browser cookie strategy.
