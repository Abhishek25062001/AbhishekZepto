# Role & Permission System Verification

## Purpose

This checklist verifies the Phase 2 Role & Permission System against the
current backend protected auth surface and the existing vendor/admin frontend
surfaces.

## Seed Baseline

Run the backend seed flow before testing:

```bash
npm run seed -w backend/api
```

Expected seeded permission baseline:

- `customer` -> `customer:read_self`
- `delivery_agent` -> `delivery:read_self`
- `vendor_owner` -> `vendor:read_store`, `orders:read`, `orders:update`,
  `inventory:read`, `inventory:update`, `catalog:read`, `catalog:update`,
  `settings:manage`
- `store_manager` -> `vendor:read_store`, `orders:read`, `orders:update`,
  `inventory:read`, `inventory:update`, `catalog:read`, `catalog:update`
- `store_staff` -> `vendor:read_store`, `orders:read`, `inventory:read`,
  `catalog:read`
- `support_admin` -> `auth:read`, `users:read`, `stores:read`, `orders:read`,
  `delivery:read`, `catalog:read`, `support:read`, `settings:read`
- `operations_admin` -> `auth:read`, `users:read`, `stores:read`,
  `orders:read`, `orders:update`, `delivery:read`, `inventory:read`,
  `inventory:update`, `catalog:read`, `finance:read`, `settings:manage`
- `super_admin` -> `*:*`

Matrix proof command:

```bash
npm run test:seed-matrix -w backend/api
```

## Protected Auth Route Allow Case

1. Log in with the seeded `super_admin` identity (`6666666666`) through the OTP
   flow.
2. Call the protected auth test route with the returned access token:

```bash
curl http://localhost:5000/api/v1/internal/auth/test-protected \
  -H "Authorization: Bearer REPLACE_SUPER_ADMIN_ACCESS_TOKEN"
```

Expected result:

- HTTP `200`
- response message `Protected auth test route working`
- response data contains the authenticated `user` object

## Protected Auth Route Deny Case

1. Log in with the seeded `vendor_owner` identity (`7777777777`) through the OTP
   flow.
2. Call the same protected auth test route with the vendor access token:

```bash
curl http://localhost:5000/api/v1/internal/auth/test-protected \
  -H "Authorization: Bearer REPLACE_VENDOR_ACCESS_TOKEN"
```

Expected result:

- HTTP `403`
- error code `FORBIDDEN`
- the vendor session remains valid for vendor-panel routes, but not for
  `auth:read`

## Denied Access Audit Check

After the deny case, verify an audit log record was written with:

- `eventType = security.access_denied`
- `actorRole = vendor_owner`
- metadata containing the required permission (`auth:read`)

## Vendor Panel Permission Visibility

After logging in as `vendor_owner`:

- `/dashboard`, `/orders`, `/inventory`, `/products`, and `/settings` should be
  accessible
- sidebar items for those routes should be visible

If a reduced vendor role is seeded later:

- `store_staff` should not reach `/settings`
- direct navigation to a disallowed route should redirect back to `/dashboard`

## Admin Dashboard Permission Visibility

After logging in as `super_admin`:

- all current admin routes should remain visible and accessible because `*:*`
  satisfies every permission guard

If a narrower admin role is seeded later:

- `support_admin` should reach `/dashboard`, `/users`, `/stores`, `/orders`,
  `/delivery-agents`, `/products`, `/support`, and `/settings`
- `support_admin` should not reach `/finance`
- `operations_admin` should reach `/finance`

## Seed Matrix Proof Notes

- The current codebase permission vocabulary is now proven by automated seed
  matrix tests.
- `operations_admin` includes `settings:manage` because current Ticket 4 admin
  mutation endpoints use that existing permission gate.
- `support_admin` remains read-focused and does not receive `settings:manage`
  or `finance:read`.
- Non-admin roles do not receive `users:read` or `*:*`.
- `NEEDS VERIFICATION`: the source PDF may have intended a more explicit
  role-management permission namespace than the current codebase exposes.

## Review Notes

- Frontend visibility checks are convenience only; backend permission middleware
  remains the final authority.
- Tenant/store scope enforcement is deferred to the next module.

## Admin RBAC Mutation Route Checks

Log in as the seeded `super_admin` identity (`6666666666`) before running these
checks.

### List Roles

```bash
curl http://localhost:5000/api/v1/admin/roles \
  -H "Authorization: Bearer REPLACE_SUPER_ADMIN_ACCESS_TOKEN"
```

Expected result:

- HTTP `200`
- success message `Roles fetched successfully`

### Create Role

```bash
curl -X POST http://localhost:5000/api/v1/admin/roles \
  -H "Authorization: Bearer REPLACE_SUPER_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "support_admin",
    "name": "Support Admin Copy",
    "description": "Verification-only payload",
    "permissions": ["users:read"],
    "isEditable": true
  }'
```

Expected result:

- HTTP `409` for the duplicate seeded role code path, or HTTP `201` for a new
  non-seeded verification role code

### Update User Permissions

```bash
curl -X PATCH http://localhost:5000/api/v1/admin/users/REPLACE_USER_ID/permissions \
  -H "Authorization: Bearer REPLACE_SUPER_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": ["users:read"]
  }'
```

Expected result:

- HTTP `200`
- success message `User permissions updated successfully`

### Assign User Role

```bash
curl -X PATCH http://localhost:5000/api/v1/admin/users/REPLACE_USER_ID/role \
  -H "Authorization: Bearer REPLACE_SUPER_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "operations_admin"
  }'
```

Expected result:

- HTTP `200`
- success message `User role updated successfully`

### Sync User Permissions From Role

```bash
curl -X POST http://localhost:5000/api/v1/admin/users/REPLACE_USER_ID/sync-role-permissions \
  -H "Authorization: Bearer REPLACE_SUPER_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roleCode": "operations_admin"
  }'
```

Expected result:

- HTTP `200`
- success message `User permissions synced from role successfully`

### Permission-gate note

The current Ticket 4 implementation uses the closest existing permission
constants:

- reads: `users:read`
- mutations: `settings:manage`

This exact mapping remains `NEEDS VERIFICATION` against the source PDF if the
document expects a dedicated role-management permission namespace.
