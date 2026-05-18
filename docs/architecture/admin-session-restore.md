# Admin Session Restore

## Goal

Restore Admin Dashboard auth state from browser storage before protected routes
render.

## Restore Rules

- Load stored admin session from local storage
- Restore auth store only when access token, refresh token, and `adminId` exist
- Clear partial or malformed admin sessions
- Keep the router in a loading state while restore runs
- Future refresh-token validation remains deferred
