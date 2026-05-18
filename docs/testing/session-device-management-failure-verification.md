# Session & Device Management Failure Verification

Verify these failure cases:

- missing access token returns `UNAUTHORIZED`
- revoked or expired access token returns auth failure
- invalid `sessionId` returns validation failure
- current-session targeted revoke returns `SESSION_ACCESS_DENIED`
- unknown or non-owned `sessionId` returns `SESSION_NOT_FOUND`
- frontend surfaces show a user-facing error and do not clear the current
  session accidentally
