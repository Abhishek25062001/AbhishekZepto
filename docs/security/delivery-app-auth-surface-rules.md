# Delivery Agent App Auth Surface Rules

## Fixed Role

- Delivery Agent App request OTP must always send `role = delivery_agent`
- Delivery Agent App must never expose role selection on login

## Fixed App Surface

- Delivery Agent App verify OTP must always send
  `device.appSurface = delivery_agent_app`
- Delivery Agent App route params for OTP verification must resolve to
  `role = delivery_agent`

## Rejection Rule

- If a non-delivery role is routed into Delivery Agent App OTP verification,
  redirect the user back to `Login`
