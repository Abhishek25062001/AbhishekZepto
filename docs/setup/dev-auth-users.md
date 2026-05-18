# Development Auth Users

## Goal

Document the planned development auth user seed set for Backend Auth Core.

## Planned Files

- `/backend/api/src/database/seeds/seed-dev-users.ts`
- `/backend/api/src/database/seeds/seed-runner.ts`

## Seeded Development Users

- Customer user:
  `9999999999`, role `customer`, status `active`, permissions `customer:read_self`
- Admin user:
  `6666666666`, role `super_admin`, status `active`, permissions `*:*`, `auth:read`
- Vendor user:
  `7777777777`, role `vendor_owner`, status `active`, permissions `vendor:read_store`
- Delivery agent user:
  `8888888888`, role `delivery_agent`, status `active`, permissions `delivery:read_self`

## Customer App Login Details

- Phone: `9999999999`
- Role: `customer`
- App surface: `customer_app`
- Login method: OTP

## Delivery Agent App Login Details

- Phone: `8888888888`
- Role: `delivery_agent`
- App surface: `delivery_agent_app`
- Login method: OTP

## Vendor Panel Login Details

- Phone: `7777777777`
- Role: `vendor_owner`
- App surface: `vendor_panel`
- Login method: OTP

## Admin Dashboard Login Details

- Phone: `6666666666`
- Role: `super_admin`
- App surface: `admin_dashboard`
- Login method: OTP

## Access Control Verification Mapping

- Customer access checks should use `9999999999`
- Delivery access checks should use `8888888888`
- Vendor access and scope checks should use `7777777777`
- Admin permission checks should use `6666666666`

## Environment Rule

- Create dev users only when `APP_ENV !== production`
- Call `seedDevUsers()` only in development or test environment
