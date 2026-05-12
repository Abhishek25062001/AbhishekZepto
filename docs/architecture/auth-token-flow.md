# Auth Token Flow

## Phase 1 Flow

```text
User login/request OTP
-> OTP verified
-> Backend issues access token + refresh token
-> Frontend stores tokens securely
-> Frontend sends access token in Authorization header
-> Backend verifies token on protected APIs
-> Refresh token is used to generate new access token
-> Logout revokes refresh token/session
```

## Token Header

Protected APIs use:

```text
Authorization: Bearer <accessToken>
```

## Phase 1 Boundary

Phase 1 creates token service placeholders only. Real JWT signing, verification,
refresh token rotation, and revocation behavior are implemented by later auth
modules.
