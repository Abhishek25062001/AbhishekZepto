# Delivery Agent App Authentication Backend Verification

## Prerequisites

- Start MongoDB
- Start backend server on `http://localhost:5000`
- Run the backend seed command
- Confirm seeded delivery agent phone: `6666666666`

## Request OTP

- Call `POST /api/v1/public/auth/request-otp`
- Confirm response includes `challengeId`, `expiresIn`, `canResendAfter`,
  `deliveryChannel`, and `maskedTarget`

## Verify OTP

- Call `POST /api/v1/public/auth/verify-otp`
- Confirm response includes `accessToken`, `refreshToken`, `expiresIn`, and
  `user`

## Delivery Permissions

- Call `GET /api/v1/delivery/me/permissions`
- Confirm response `role = delivery_agent`
- Confirm response `deliveryAgentId` matches authenticated `userId`

## DB Fields Verified

- `otp_challenges.phone`
- `otp_challenges.role`
- `otp_challenges.expiresAt`
- `otp_challenges.verifiedAt`
- `auth_sessions.userId`
- `auth_sessions.appSurface`
- `auth_sessions.refreshTokenHash`
- `user_identities.lastLoginAt`
- `user_identities._id`
- `user_identities.role`
- `user_identities.permissions`
- `user_identities.cityId`
