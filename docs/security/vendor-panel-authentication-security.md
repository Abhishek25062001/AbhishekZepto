# Vendor Panel Authentication Security

## Storage Rules

- Vendor access token and refresh token live only in browser storage keys
- Debug surfaces must never print raw tokens

## Request Rules

- Request OTP uses vendor login role
- Verify OTP must always send `appSurface = vendor_panel`
- Vendor auth response must resolve to a supported vendor role

## Logging Rules

- Local auth logs must not include OTPs or tokens
- API client debug logs must redact authorization values
