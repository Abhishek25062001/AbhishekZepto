# Backend Auth Core Role Seeding

## Goal

Document the planned role seeding updates for Backend Auth Core auth permissions.

## Planned File Path

- `/backend/api/src/database/seeds/seed-roles.ts`

## Required Permissions

- `super_admin` has `*:*`
- Add `auth:read` to:
  `support_admin`, `operations_admin`, `super_admin`
- Add `customer:read_self`
- Add `delivery:read_self`
- Add `vendor:read_store`

## Seed Behavior

- Ensure `upsertSystemRole()` updates existing role permissions

## Planned Seed Command

- `npm run seed -w backend/api`
