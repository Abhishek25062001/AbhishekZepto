# Delivery Agent App Auth Event Logging

## Goal

Provide development-only local auth event logging for Delivery Agent App
authentication flows without logging secrets.

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

- `otp`
- `accessToken`
- `refreshToken`
- `authorization`
