# Customer Session Restore

## Goal

Restore Customer App auth state from secure storage on app start before routing
the user into authenticated or unauthenticated navigation.

## Flow

1. Load session through `loadCustomerSession()`
2. If access token, refresh token, and customer ID exist, call
   `useAuthStore.setAuthSession()`
3. Restore:
   - `accessToken`
   - `refreshToken`
   - `customerId`
   - `cityId`
   - `role`
   - `permissions`
4. If a partial or invalid stored session is found, clear secure storage
5. Keep `SplashScreen` visible while restore is running

## Deferred Work

- Refresh-token validation during restore remains a later integration step
