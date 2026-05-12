# OTP Security Rules

## OTP Expiry Rule

OTP challenges expire after 5 minutes.

## Max OTP Attempts Rule

Each OTP challenge allows 5 attempts.

## Max Resend Rule

Each OTP challenge allows 3 resends per challenge.

## OTP Storage Rule

Store only hashed OTP, never plain OTP.

## OTP Logging Rule

Never log OTP or OTP hash.

## API Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`

## DB Fields

- `otp_challenges.phone`
- `otp_challenges.role`
- `otp_challenges.otpHash`
- `otp_challenges.purpose`
- `otp_challenges.deliveryChannel`
- `otp_challenges.deliveryTarget`
- `otp_challenges.expiresAt`
- `otp_challenges.attemptCount`
- `otp_challenges.maxAttempts`
- `otp_challenges.resendCount`
- `otp_challenges.maxResends`
- `otp_challenges.lastSentAt`
- `otp_challenges.verifiedAt`
- `otp_challenges.blockedUntil`
