# Delivery Agent App Auth Navigation

## Auth Routes

- `Login`
- `OtpVerification`

## Main Routes

- `DeliveryHome`
- `ActiveDelivery`
- `Profile`
- `Debug` (development only)
- `AuthSmokeTest` (development only)

## Navigation Rules

- Unauthenticated users can access only `Login` and `OtpVerification`
- Authenticated users must enter the app through the main navigator
- `OtpVerification` requires:
  - `phone`
  - `role = delivery_agent`
  - `challengeId`
  - `maskedTarget`
  - `canResendAfter`
  - `expiresIn`
