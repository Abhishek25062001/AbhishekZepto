# Authorization Failure Handling

## Unauthorized Response

`401` is used for:

- Missing token
- Invalid token
- Expired token
- Revoked session

## Forbidden Response

`403` is used for a valid user who is missing a required role or permission.

## Access Denied Audit Event

Access denied paths must emit:

- `security.access_denied`

## DB Fields

- `auth_sessions.userId`
- `auth_sessions.isRevoked`
- `auth_sessions.expiresAt`
- `user_identities.accountStatus`
- `user_identities.permissions`
- `audit_logs.eventType`
- `audit_logs.actorId`
- `audit_logs.actorRole`
- `audit_logs.metadata`
- `audit_logs.status`
