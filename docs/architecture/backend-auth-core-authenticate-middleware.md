# Backend Auth Core Authenticate Middleware

## Goal

Document the planned real JWT authenticate middleware for Backend Auth Core.

## Planned File Path

- `/backend/api/src/modules/auth/middlewares/authenticate.middleware.ts`

## Flow

1. Read Authorization header
2. Validate format `Authorization: Bearer <accessToken>`
3. Verify access token using `verifyAccessToken()`
4. If token is invalid, throw `INVALID_ACCESS_TOKEN`
5. If token is expired, throw `TOKEN_EXPIRED`
6. Load session by `sessionId`
7. If session is missing, throw `UNAUTHORIZED`
8. If session is revoked, throw `SESSION_REVOKED`
9. If session is expired, throw `SESSION_EXPIRED`
10. Load user identity by `userId`
11. If user is missing, throw `UNAUTHORIZED`
12. If user account status is not active, throw matching account error
13. Attach authenticated user context to `req.user`
14. Include in `req.user`:
    `userId`, `role`, `permissions`, `sessionId`, `vendorId`, `storeId`, `cityId`
15. Call `next()` after successful authentication
