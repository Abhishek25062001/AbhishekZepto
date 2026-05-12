# Web Session Storage

## Scope

This standard applies to Phase 1 session persistence for the Vendor Panel and Admin Dashboard.

## Temporary Phase 1 Storage

- Vendor Panel stores `accessToken`, `refreshToken`, `vendorUserId`, `vendorId`, and `storeId` in browser localStorage.
- Admin Dashboard stores `accessToken`, `refreshToken`, and `adminId` in browser localStorage.
- Stored values are restored into the in-memory auth store during app startup.
- No real credentials or seed token values are checked into source files.

## Hardening Review Required Later

Before production authentication, revisit:

- XSS exposure from localStorage token persistence.
- Token expiry and refresh flow behavior.
- Secure cookie strategy for browser panels.
- Logout and stale-session cleanup behavior.
- Backend permission validation as the final authority.
