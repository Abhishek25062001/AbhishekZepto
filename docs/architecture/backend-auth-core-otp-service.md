# Backend Auth Core OTP Service

## Goal

Document the planned OTP utility service for Backend Auth Core.

## Planned File Paths

- `/backend/api/src/modules/auth/services/otp.service.ts`
- `/backend/api/src/modules/auth/services/index.ts`

## Planned Imports

- `crypto`
- validated env

## Planned Functions

### generateOtp()

- Generates a 6-digit numeric OTP
- If `OTP_DEV_MODE=true`, returns `env.OTP_DEV_CODE`

### hashOtp(otp)

- Hashes OTP using SHA-256 with app-level secret input
- Never logs OTP

### verifyOtpHash(otp, otpHash)

- Hashes incoming OTP and compares with stored hash
- Uses timing-safe comparison where possible

### maskOtpTarget(phoneOrEmail)

- Masks phone target format as `******9999`

### getOtpExpiryDate()

- Uses `env.OTP_EXPIRES_IN_SECONDS`

### getOtpCanResendAfter()

- Uses `env.OTP_RESEND_WAIT_SECONDS`

### isOtpExpired(expiresAt)

- Returns whether OTP is expired

### hasOtpAttemptsExceeded(attemptCount, maxAttempts)

- Returns whether attempt limit is exceeded

### hasOtpResendExceeded(resendCount, maxResends)

- Returns whether resend limit is exceeded

## Planned Export

- Export OTP service from `/backend/api/src/modules/auth/services/index.ts`
