# Security Foundation

## Security Foundation Goal

Phase 1 creates baseline security rules before real production hardening. These
rules define what must be protected now and what remains deferred to later
implementation phases.

## Authentication Security

Authentication security is based on token-based authentication using:

- Access Token
- Refresh Token
- Session Record
- Role-Based Access
- Permission Checks

## OTP Security

OTP security placeholders include:

- OTP expiry
- OTP resend limit
- OTP failed attempt limit
- OTP lockout
- OTP audit logging

Real OTP security will be implemented in Phase 2.

## Token Policy

- Access token expiry placeholder: 15 minutes.
- Refresh token expiry placeholder: 30 days.

## Rate Limit Policy

- Global API rate limit placeholder: 100 requests per 15 minutes per IP.
- Auth API rate limit placeholder: 5 requests per 5 minutes per phone/IP.

## CORS Policy

Allowed local origins:

- `http://localhost:5173`
- `http://localhost:5174`

## Sensitive Data Handling

Fields that must never be logged:

- `password`
- `otp`
- `accessToken`
- `refreshToken`
- `authorization`
- `cookie`
- Razorpay keys
- JWT secrets
- FCM keys
- Maps keys
- MongoDB URI
- Redis URL

## Environment Secret Handling

- Real secrets must never be committed to Git.
- `.env` files must be ignored.
- Only `.env.example` files can be committed.

## Frontend Security Rules

- Frontend must not verify payment.
- Frontend must not decide final authorization.
- Frontend must not directly access database.
- Frontend must not store secrets.

## API Endpoints

No new API endpoints created in this task.

## DB Fields

No new database fields created in this task.
