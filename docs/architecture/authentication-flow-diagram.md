# Authentication Flow Diagram

## Text Flow

1. User enters phone/identifier.
2. Frontend calls request OTP API.
3. Backend validates user/surface/role.
4. Backend creates OTP challenge.
5. OTP provider sends OTP.
6. User enters OTP.
7. Frontend calls verify OTP API.
8. Backend verifies OTP.
9. Backend creates session.
10. Backend issues access token and refresh token.
11. Frontend stores tokens.
12. Frontend sends access token in Authorization header.
13. Backend validates token on protected APIs.
14. Refresh token renews access token.
15. Logout revokes session.

## API Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`
- `GET /api/v1/internal/auth/test-protected`

## DB Fields

- `user_identities.phone`
- `user_identities.email`
- `user_identities.role`
- `user_identities.accountStatus`
- `auth_sessions.userId`
- `auth_sessions.refreshTokenHash`
- `auth_sessions.expiresAt`
- `auth_sessions.isRevoked`
- `otp_challenges.phone`
- `otp_challenges.role`
- `otp_challenges.otpHash`
- `otp_challenges.expiresAt`
- `otp_challenges.attemptCount`
