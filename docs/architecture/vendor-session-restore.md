# Vendor Session Restore

## Goal

Restore Vendor Panel auth state from browser storage before protected routes
render.

## Restore Rules

- Load stored vendor session from local storage
- Restore auth store only when access token, refresh token, `vendorUserId`,
  `vendorId`, and `storeId` exist
- Clear partial or malformed vendor sessions
- Keep the router in a loading state while restore runs
- Future refresh-token validation remains deferred
