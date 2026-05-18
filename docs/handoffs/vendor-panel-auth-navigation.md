# Vendor Panel Auth Navigation

## Public Auth Routes

- `/login`
- `/otp-verification`

## Protected Entry

- `/dashboard`
- `/orders`
- `/inventory`
- `/products`
- `/settings`

## Development-Only Routes

- `/debug`
- `/debug/auth-smoke`

## Navigation Notes

- Missing OTP route state must redirect to `/login`
- Invalid vendor auth restore must clear stored session and redirect to `/login`
