# Delivery Agent App Authentication Frontend Verification

## Startup

- Start backend server
- Run seed command
- Start Delivery Agent App Metro server
- Run Delivery Agent App on Android emulator or device

## Happy Path

- Confirm `SplashScreen` appears during session restore
- Confirm unauthenticated user lands on `LoginScreen`
- Enter seeded delivery agent phone `6666666666`
- Tap continue and confirm request to `POST /api/v1/public/auth/request-otp`
- Confirm app navigates to `OtpVerificationScreen`
- Enter dev OTP
- Tap verify and confirm request to `POST /api/v1/public/auth/verify-otp`
- Confirm app navigates to `DeliveryHomeScreen`
- Confirm auth store contains delivery session values
- Confirm secure storage contains Delivery Agent App session values
- Navigate to `ProfileScreen`
- Confirm `ProfileScreen` displays delivery-agent auth details
- Tap logout
- Confirm app calls `POST /api/v1/public/auth/logout`
- Confirm app returns to `LoginScreen`
- Confirm secure storage is cleared
