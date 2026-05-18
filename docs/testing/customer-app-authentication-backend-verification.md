# Customer App Authentication Backend Verification

## Prerequisites

- Start MongoDB
- Start backend server on `http://localhost:5000`
- Run the backend seed command
- Confirm seeded customer phone: `9999999999`

## Request OTP

- Call `POST /api/v1/public/auth/request-otp`
- Confirm response includes `challengeId`, `expiresIn`, `canResendAfter`,
  `deliveryChannel`, and `maskedTarget`

## Verify OTP

- Call `POST /api/v1/public/auth/verify-otp`
- Confirm response includes `accessToken`, `refreshToken`, `expiresIn`, and
  `user`

## Customer Permissions

- Call `GET /api/v1/customer/me/permissions`
- Confirm response `role = customer`
- Confirm response `customerId` matches authenticated `userId`

## DB Fields Verified

- `otp_challenges.phone`
- `otp_challenges.role`
- `otp_challenges.expiresAt`
- `otp_challenges.verifiedAt`
- `auth_sessions.userId`
- `user_identities._id`
- `user_identities.role`
- `user_identities.permissions`
- `user_identities.cityId`
