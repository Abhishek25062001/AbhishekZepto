# JWT Security Rules

## Token Signing Secret Rules

- Access token and refresh token secrets must be configured through environment variables.
- Token signing secrets must not be committed to source control.
- Production secrets must not use placeholder values such as `change_me`.

## Refresh Token Storage Rule

Store only hashed refresh token.

## Token Logging Rule

Never log full token values.

## Planned Env Fields

- `JWT access secret` should live only in backend env files.
- `JWT refresh secret` should live only in backend env files.
- `JWT access expiry` should be `15m`.
- `JWT refresh expiry` should be `30d`.

## DB Fields

- `auth_sessions.refreshTokenHash`
- `auth_sessions.expiresAt`
- `auth_sessions.lastUsedAt`
- `auth_sessions.isRevoked`
- `auth_sessions.revokedAt`
- `auth_sessions.revokedReason`
