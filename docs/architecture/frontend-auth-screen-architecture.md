# Frontend Auth Screen Architecture

## Customer App Auth Screens

Screens:

- `LoginScreen`
- `OtpVerificationScreen`

Planned file:

- `/apps/customer-app/src/screens/auth/OtpVerificationScreen.tsx`

Navigation route:

- `Auth/OtpVerification`

Route params:

- `phone`
- `role`
- `challengeId`

## Delivery Agent App Auth Screens

Screens:

- `LoginScreen`
- `OtpVerificationScreen`

Planned file:

- `/apps/delivery-agent-app/src/screens/auth/OtpVerificationScreen.tsx`

Navigation route:

- `Auth/OtpVerification`

Route params:

- `phone`
- `role`
- `challengeId`

## Vendor Panel Auth Pages

Pages:

- `LoginPage`
- `OtpVerificationPage`

Planned file:

- `/apps/vendor-panel/src/pages/auth/OtpVerificationPage.tsx`

Route:

- `/otp-verification`

Expected route state/query fields:

- `phone`
- `role`
- `challengeId`

## Admin Dashboard Auth Pages

Pages:

- `LoginPage`
- `OtpVerificationPage`

Planned file:

- `/apps/admin-dashboard/src/pages/auth/OtpVerificationPage.tsx`

Route:

- `/otp-verification`

Expected route state/query fields:

- `phone`
- `role`
- `challengeId`

## API Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`

## DB Fields

No new database fields created in this task.
