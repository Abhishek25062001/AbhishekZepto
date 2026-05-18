# Customer App Auth Surface Rules

## Fixed Role

- Customer App request OTP must always send `role = customer`
- Customer App must never expose role selection on login

## Fixed App Surface

- Customer App verify OTP must always send `device.appSurface = customer_app`
- Customer App route params for OTP verification must resolve to `role = customer`

## Rejection Rule

- If a non-customer role is routed into Customer App OTP verification, redirect
  the user back to `Login`
