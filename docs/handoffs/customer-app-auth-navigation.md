# Customer App Auth Navigation

## Auth Routes

- `Login`
- `OtpVerification`

## Main Routes

- `Home`
- `Profile`
- `Debug` (development only)

## Navigation Rules

- Unauthenticated users can access only `Login` and `OtpVerification`
- Authenticated users must enter the app through the main navigator
- `OtpVerification` requires:
  - `phone`
  - `role = customer`
  - `challengeId`
  - `maskedTarget`
  - `canResendAfter`
