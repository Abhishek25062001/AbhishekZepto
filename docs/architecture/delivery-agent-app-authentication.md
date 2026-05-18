# Delivery Agent App Authentication

## Delivery Agent App Authentication Goal

Delivery Agent App authentication uses OTP-based login for the fixed
`delivery_agent` role on the `delivery_agent_app` surface. The module wires
Delivery Agent App login, OTP verify, session restore, permission fetch, and
logout flows to the shared Phase 2 auth backend without exposing cross-surface
role selection.

## Delivery Agent Login Role

- Fixed role: `delivery_agent`
- Delivery Agent App must never allow role switching on login
- Delivery Agent App must reject auth responses that do not resolve to the
  `delivery_agent` role

## Delivery Agent App Surface

- Fixed app surface: `delivery_agent_app`
- OTP verify requests from Delivery Agent App must always send
  `device.appSurface = delivery_agent_app`

## Delivery Agent Auth Screens

- `LoginScreen`
- `OtpVerificationScreen`
- `DeliveryHomeScreen`
- `ProfileScreen`
- `DebugScreen` (development only)
- `AuthSmokeTestScreen` (development only)

## Delivery Agent Auth APIs

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`
- `GET /api/v1/delivery/me/permissions`

## Delivery Agent Auth Storage

- `DELIVERY_ACCESS_TOKEN`
- `DELIVERY_REFRESH_TOKEN`
- `DELIVERY_AGENT_ID`
- `DELIVERY_CITY_ID`
- `DELIVERY_ROLE`
- `DELIVERY_PERMISSIONS`

## Delivery Agent Scope Rules

- Delivery Agent App can access only the authenticated delivery agent profile
  and assigned-delivery scope
- Backend must map authenticated `userId` to `deliveryAgentId`
- Delivery Agent App does not use vendor or store scopes for protected entry

## DB Fields

- `user_identities._id`
- `user_identities.role`
- `user_identities.permissions`
- `user_identities.cityId`
- `user_identities.accountStatus`
- `auth_sessions.userId`
- `auth_sessions.role`
- `auth_sessions.expiresAt`
- `auth_sessions.isRevoked`
