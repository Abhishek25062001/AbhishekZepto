# Session & Device Management Backend Verification

## Verify Session List

1. Log in on at least two devices or app surfaces for the same seeded user.
2. Call:

```bash
curl http://localhost:5000/api/v1/auth/me/sessions \
  -H "Authorization: Bearer REPLACE_ACCESS_TOKEN"
```

3. Confirm:

- response is `success: true`
- `data.sessions` is an array
- one session has `isCurrent: true`
- session rows expose `deviceName`, device/app metadata, and revoke metadata but
  not `refreshTokenHash`

## Verify Logout One Session

```bash
curl -X POST http://localhost:5000/api/v1/auth/logout-session \
  -H "Authorization: Bearer REPLACE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"REPLACE_OTHER_SESSION_ID"}'
```

Confirm:

- response is successful
- target session is revoked in `auth_sessions`
- current session stays active

## Verify Logout Other Sessions

```bash
curl -X POST http://localhost:5000/api/v1/auth/logout-other-sessions \
  -H "Authorization: Bearer REPLACE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Confirm:

- current session remains active
- all other active sessions for the same `userId` are revoked

## Verify Refresh Token Rotation

1. Capture a valid `refreshToken` from login.
2. Call:

```bash
curl -X POST http://localhost:5000/api/v1/public/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"REPLACE_REFRESH_TOKEN"}'
```

3. Confirm:

- response is `success: true`
- response includes a new `accessToken`
- response includes a new `refreshToken`
- `auth_sessions.refreshTokenHash` changes after the refresh succeeds
- `auth_sessions.refreshTokenRotatedAt` is updated
- `auth_sessions.lastUsedAt` is updated
- `auth_sessions.expiresAt` is moved to the new refresh-token expiry window

4. Re-submit the old refresh token and confirm:

- response is an auth failure
- error code is `INVALID_REFRESH_TOKEN`

5. Revoke the session, then submit the latest refresh token and confirm:

- response is an auth failure
- error code is `SESSION_REVOKED`

## Verify Admin User Session List

1. Authenticate as an admin user with `auth:read`, `users:read`, or
   `settings:manage`.
2. Call:

```bash
curl http://localhost:5000/api/v1/admin/users/REPLACE_USER_ID/sessions \
  -H "Authorization: Bearer REPLACE_ADMIN_ACCESS_TOKEN"
```

3. Confirm:

- response is `success: true`
- `data.userId` matches the path parameter
- `data.sessions` is an array of safe session summaries
- rows do not include `refreshTokenHash`, access tokens, or refresh tokens
- rows do not include `isCurrent`

## Verify Admin Revoke One Session

1. Authenticate as an admin user with `auth:manage`.
2. Call:

```bash
curl -X DELETE http://localhost:5000/api/v1/admin/users/REPLACE_USER_ID/sessions/REPLACE_SESSION_ID \
  -H "Authorization: Bearer REPLACE_ADMIN_ACCESS_TOKEN"
```

3. Confirm:

- response is successful
- target session has `isRevoked: true`
- `revokedReason` is `admin_revoked_session`
- repeating the same request succeeds with `alreadyRevoked: true`

## Verify Admin Revoke All Sessions

```bash
curl -X DELETE http://localhost:5000/api/v1/admin/users/REPLACE_USER_ID/sessions \
  -H "Authorization: Bearer REPLACE_ADMIN_ACCESS_TOKEN"
```

Confirm:

- response is successful
- `data.revokedCount` reflects only previously active sessions
- active sessions for the target user now have `revokedReason: admin_revoked_all_sessions`

## Verify Admin Session Permission Boundaries

1. Call list/revoke routes with a non-admin token and confirm `403` or `401`.
2. Call revoke routes with `support_admin` (`auth:read` only) and confirm `403`.
3. Call list routes with `support_admin` and confirm `200`.
