# Admin Dashboard Authentication Security

## Storage Rules

- Admin access token and refresh token live only in browser storage keys
- Debug surfaces must never print raw tokens

## Request Rules

- Request OTP uses admin login role
- Verify OTP must always send `appSurface = admin_dashboard`
- Admin auth response must resolve to a supported admin role

## Logging Rules

- Local auth logs must not include OTPs or tokens
- API client debug logs must redact authorization values
