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
  `8888888888`, role `super_admin`, status `active`, permissions `*:*`, `auth:read`
- Vendor user:
  `7777777777`, role `vendor_owner`, status `active`, permissions `vendor:read_store`
- Delivery agent user:
  `6666666666`, role `delivery_agent`, status `active`, permissions `delivery:read_self`

## Environment Rule

- Create dev users only when `APP_ENV !== production`
- Call `seedDevUsers()` only in development or test environment
