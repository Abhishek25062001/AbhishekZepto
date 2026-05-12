# Backend Auth Core Refresh Token Flow

## Goal

Document the planned `authService.refreshAccessToken(input, context)` flow.

## Planned File Path

- `/backend/api/src/modules/auth/services/auth.service.ts`

## Flow

1. Verify refresh token using `verifyRefreshToken()`.
2. Hash refresh token.
3. Find auth session by `refreshTokenHash`.
4. If session is missing, throw `INVALID_REFRESH_TOKEN`.
5. If session is revoked, throw `SESSION_REVOKED`.
6. If session is expired, throw `SESSION_EXPIRED`.
7. Find user identity by session `userId`.
8. Reject user if account status is not active.
9. Generate new access token.
10. Update session `lastUsedAt`.
11. Write audit event `auth.refresh_token_success`.
12. Return `accessToken`, `expiresIn`
