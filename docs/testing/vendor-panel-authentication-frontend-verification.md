# Vendor Panel Authentication Frontend Verification

## Happy Path

- Open `LoginPage`
- Request OTP with seeded vendor phone
- Continue to `OtpVerificationPage`
- Verify OTP and land on dashboard
- Confirm header auth summary renders
- Open debug and auth smoke routes in development
- Logout and return to `/login`
