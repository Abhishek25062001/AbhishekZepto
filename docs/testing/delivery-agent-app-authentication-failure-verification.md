# Delivery Agent App Authentication Failure Verification

## Login Validation

- Enter invalid phone on `LoginScreen`
- Confirm validation error appears before API call

## Missing Account

- Enter an unseeded phone number
- Confirm user-facing no-account error appears

## OTP Failure Cases

- Request OTP with seeded delivery phone
- Enter wrong OTP and confirm invalid OTP error
- Confirm backend increments `otp_challenges.attemptCount`
- Expire OTP and confirm expired message appears
- Tap resend OTP and confirm request to `POST /api/v1/public/auth/request-otp`
- Exceed resend limit and confirm resend limit message appears

## Blocked Account

- Set seeded delivery agent account status to blocked
- Try login again
- Confirm blocked-account message appears
- Restore seeded delivery agent account status to active
