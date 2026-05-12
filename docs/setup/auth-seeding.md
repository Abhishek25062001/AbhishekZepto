# Auth Seeding

## Purpose

Authentication Foundation adds role seed placeholders.

## Seeded Roles

The role seed prepares these system role codes:

- `customer`
- `delivery_agent`
- `vendor_owner`
- `store_manager`
- `store_staff`
- `support_admin`
- `operations_admin`
- `super_admin`

The `super_admin` role receives the wildcard permission:

```text
*:*
```

Other Phase 1 role seeds use placeholder permissions only.

## Commands

Dry run:

```bash
npm run seed:dry -w backend/api
```

Run seed with MongoDB:

```bash
npm run seed -w backend/api
```

## Deferred Users

Real users are not created in Authentication Foundation.

Real user creation is deferred to later authentication and admin modules,
including Phase 2 and Phase 8 work.
