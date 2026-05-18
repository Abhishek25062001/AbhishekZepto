# Session & Device Management Security

## Rules

- session-management responses must never expose `refreshTokenHash`
- revoke actions are always scoped to the authenticated `userId`
- current-session revoke uses normal logout, not targeted revoke
- audit logs must record revoke actions without token material
- frontend session/device views must not expose raw refresh tokens

## Expected Error Codes

- `UNAUTHORIZED`
- `SESSION_REVOKED`
- `SESSION_EXPIRED`
- `SESSION_NOT_FOUND`
- `SESSION_ACCESS_DENIED`
