# Authentication Strategy

## Authentication Goal

Phase 1 prepares the authentication foundation only. Full OTP login, real token
signing, session lifecycle behavior, provider integration, and frontend login
flows are implemented in later authentication modules.

## Login Method

The primary login method is OTP-based authentication.

Phase 1 creates the structure for OTP request and verification APIs, but it does
not send real OTPs or verify real OTP challenges.

## Supported User Types

- `customer`
- `delivery_agent`
- `vendor_user`
- `store_manager`
- `store_staff`
- `support_admin`
- `operations_admin`
- `super_admin`

## Token Strategy

Authentication uses an access token and refresh token approach.

- Access token expiry placeholder: `15 minutes`
- Refresh token expiry placeholder: `30 days`

Access tokens are sent to protected APIs through the standard authorization
header. Refresh tokens are used only by refresh-token and logout flows.

## Session Strategy

Each successful login creates one session record with device metadata.

Session records are the backend source of truth for refresh token state,
expiration, revocation, device details, and last-used timestamps.

## Role-Based Access Strategy

The backend enforces all role and permission checks. Frontend visibility,
navigation state, hidden buttons, or local role checks are not security
boundaries.

## Frontend Auth Responsibility

Frontend apps store token and session state, attach access tokens to API
requests, and react to safe backend auth errors.

Frontend apps must not decide final authorization, role validity, permission
scope, account status, tenant scope, or session validity.

## Backend Auth Responsibility

The backend verifies:

- token validity
- user status
- role
- permissions
- tenant scope
- store scope
- session state
