# Mobile Session Restore

## Purpose

This document records the Phase 1 placeholder session restore flow for the
Customer App and Delivery Agent App.

## Customer App Session Restore Flow

1. `AppNavigator` calls `useRestoreCustomerSession()` on startup.
2. The hook calls `loadCustomerSession()` from the Customer App session storage
   service.
3. If `accessToken`, `refreshToken`, and `customerId` exist, the hook calls
   `setAuthSession()`.
4. If any session value is missing, `isAuthenticated` remains `false`.
5. `SplashScreen` is shown while `isRestoringSession` is `true`.

## Delivery Agent App Session Restore Flow

1. `AppNavigator` calls `useRestoreDeliverySession()` on startup.
2. The hook calls `loadDeliverySession()` from the Delivery Agent App session
   storage service.
3. If `accessToken`, `refreshToken`, and `deliveryAgentId` exist, the hook calls
   `setAuthSession()`.
4. If any session value is missing, `isAuthenticated` remains `false`.
5. `SplashScreen` is shown while `isRestoringSession` is `true`.

## Phase 1 Boundary

Session restore only checks for locally stored placeholder values.

Real token refresh validation will be implemented in Phase 2.

