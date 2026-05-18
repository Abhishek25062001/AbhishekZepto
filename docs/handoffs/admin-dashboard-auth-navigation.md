# Admin Dashboard Auth Navigation

## Public Auth Routes

- `/login`
- `/otp-verification`

## Protected Entry

- `/dashboard`
- `/users`
- `/stores`
- `/products`
- `/orders`
- `/delivery-agents`
- `/finance`
- `/support`
- `/settings`

## Development-Only Routes

- `/debug`
- `/debug/auth-smoke`

## Navigation Notes

- Missing OTP route state must redirect to `/login`
- Invalid admin auth restore must clear stored session and redirect to `/login`
