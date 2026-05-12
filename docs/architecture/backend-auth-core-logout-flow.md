# Backend Auth Core Logout Flow

## Goal

Document the planned `authService.logout(input, context)` flow.

## Planned File Path

- `/backend/api/src/modules/auth/services/auth.service.ts`

## Flow

1. Verify refresh token using `verifyRefreshToken()`.
2. Hash refresh token.
3. Find auth session by `refreshTokenHash`.
4. If session does not exist, return success without exposing session state.
5. If `logoutAllDevices=false`, revoke current session.
6. If `logoutAllDevices=true`, revoke all sessions for session `userId`.
7. Set revoked reason to `user_logout`.
8. Write audit event `auth.logout`.
9. Return empty success object.
