# Admin Dashboard Auth Event Logging

## Allowed Event Names

- `request_otp_success`
- `request_otp_failure`
- `verify_otp_success`
- `verify_otp_failure`
- `session_restore_success`
- `session_restore_failure`
- `logout_success`
- `logout_failure`

## Forbidden Metadata

- OTP values
- access tokens
- refresh tokens
- authorization headers

## Environment Rule

- Log only in development
