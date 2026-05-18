# Customer App Authentication Frontend Verification

## Startup

- Start backend server
- Run seed command
- Start Customer App Metro server
- Run Customer App on Android emulator or device

## Happy Path

- Confirm `SplashScreen` appears during session restore
- Confirm unauthenticated user lands on `LoginScreen`
- Enter seeded customer phone `9999999999`
- Tap continue and confirm request to `POST /api/v1/public/auth/request-otp`
- Confirm app navigates to `OtpVerificationScreen`
- Enter dev OTP
- Tap verify and confirm request to `POST /api/v1/public/auth/verify-otp`
- Confirm app navigates to `HomeScreen`
- Confirm auth store contains customer session values
- Confirm secure storage contains Customer App session values
- Navigate to `ProfileScreen`
- Confirm `ProfileScreen` displays customer auth details
- Tap logout
- Confirm app calls `POST /api/v1/public/auth/logout`
- Confirm app returns to `LoginScreen`
- Confirm secure storage is cleared
