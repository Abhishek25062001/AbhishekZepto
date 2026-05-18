# Session & Device Management Frontend Verification

## Shared device helper

- helper location: `packages/shared/api/device-info.ts`
- exports: `buildAuthDeviceInput`, `formatSessionDeviceLabel`, `formatSessionTimestamp`
- used during OTP verify flows and session list rendering across all four surfaces

## Customer App

1. Sign in and open `Sessions` from Home or Profile.
2. Confirm the dedicated `SessionsScreen` loads session rows from `GET /api/v1/auth/me/sessions`.
3. Confirm no token or secret fields are shown.
4. Revoke another session and confirm a confirmation prompt appears first.
5. Use `Logout other sessions` and confirm only the current session remains active.

## Delivery Agent App

1. Sign in and open `Sessions` from Delivery Home or Profile.
2. Repeat the same list/revoke/logout-other checks as the customer app.

## Vendor Panel

1. Sign in and open `/settings/sessions`.
2. Confirm the dedicated `SessionsPage` lists self sessions from the generic auth session APIs.
3. Revoke another session and confirm browser confirmation appears first.
4. Use `Logout other sessions` and confirm the list refreshes.

## Admin Dashboard

### Own sessions

1. Sign in and open `/settings/sessions`.
2. Confirm the dedicated `SessionsPage` lists self sessions from `GET /api/v1/auth/me/sessions`.
3. Revoke another session and confirm browser confirmation appears first.

### Another user's sessions

1. Sign in as an admin with `auth:read` or `users:read` or `settings:manage`.
2. Open `/users`, enter a target user ID, and open `/users/:userId/sessions`.
3. Confirm sessions load from `GET /api/v1/admin/users/:userId/sessions`.
4. As an admin with `auth:manage`, revoke one session and confirm confirmation appears first.
5. Revoke all active sessions and confirm `revokedCount` feedback is shown.
6. Sign in as `support_admin` and confirm list works but revoke actions are hidden.

## Shared checks

- no surface makes direct `axios` calls for session management outside existing API service modules
- current-device logout still uses the existing logout flow
- session errors use shared auth error mapping
- OTP verify flows use `buildAuthDeviceInput` from the shared helper

## Automated frontend tests

`NEEDS VERIFICATION`: no app-level unit/smoke test harness exists under `apps/` yet. Use the manual steps above until a frontend test runner is introduced.
