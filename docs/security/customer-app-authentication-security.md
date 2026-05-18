# Customer App Authentication Security

## Storage

- Customer App must not store tokens in plain AsyncStorage
- Token storage must use secure storage

## Logging

- Debug screens must not display raw access tokens
- Debug screens must not display raw refresh tokens
- API debug logs must redact auth headers and token-like fields
- `LoginScreen` must not log phone plus OTP together
- `OtpVerificationScreen` must not log OTP values
- Session storage service must not log token values

## Surface Enforcement

- Request OTP must always send `role = customer`
- Verify OTP must always send `appSurface = customer_app`
- Backend must reject login when customer account status is not active
