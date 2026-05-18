# Role Permission Contract

## Contract Goal

Document the shared role and permission contract surface used by backend and
frontend consumers.

## Shared Type Exports

Shared frontend-safe permission types are exported from:

- `packages/shared/api/permission.types.ts`
- `packages/shared/api/index.ts`

Available shared contract types:

```ts
type PermissionResource =
  | 'auth'
  | 'customer'
  | 'users'
  | 'catalog'
  | 'inventory'
  | 'orders'
  | 'delivery'
  | 'vendor'
  | 'stores'
  | 'payments'
  | 'finance'
  | 'support'
  | 'settings';

type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'approve'
  | 'manage'
  | 'read_self'
  | 'read_store';

type PermissionCode = `${PermissionResource}:${PermissionAction}` | '*:*';
```

Related shared auth role export remains available from:

- `packages/shared/api/auth-api.types.ts`
- `packages/shared/api/index.ts`

## Role Object Shape

```ts
type RolePermissionContract = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  permissions: string[];
  isSystemRole: boolean;
  isEditable: boolean;
  status: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
```

## Permission Format

- `resource:action`
- Wildcard permission: `*:*`

## Roles

- `customer`
- `delivery_agent`
- `vendor_owner`
- `store_manager`
- `store_staff`
- `support_admin`
- `operations_admin`
- `super_admin`

## API Endpoints

Mounted admin RBAC endpoints now include:

- `GET /api/v1/admin/roles`
- `POST /api/v1/admin/roles`
- `GET /api/v1/admin/roles/:roleId`
- `PATCH /api/v1/admin/roles/:roleId`
- `DELETE /api/v1/admin/roles/:roleId`
- `PATCH /api/v1/admin/users/:userId/permissions`
- `PATCH /api/v1/admin/users/:userId/role`
- `POST /api/v1/admin/users/:userId/sync-role-permissions`

## Service-layer mutation contract

Current backend service-layer mutation support now exists in:

- `backend/api/src/modules/auth/services/role.service.ts`
- `backend/api/src/modules/auth/services/user-permission.service.ts`

Covered business rules:

- role creation rejects duplicate role codes
- non-system roles cannot receive `*:*`
- non-editable system roles cannot be updated or soft deleted
- user permission updates normalize permission arrays before persistence
- non-`super_admin` users cannot receive `*:*`
- user role assignment updates the identity role
- sync-from-role copies active role permissions into `user_identities.permissions`

## Controller and route wiring

Admin RBAC controllers now exist in:

- `backend/api/src/modules/auth/controllers/role.controller.ts`
- `backend/api/src/modules/auth/controllers/user-permission.controller.ts`

Mounted backend route files:

- `backend/api/src/modules/auth/routes/role-admin.routes.ts`
- `backend/api/src/modules/auth/routes/user-permission-admin.routes.ts`
- `backend/api/src/routes/v1/admin.routes.ts`

## Permission gates

Current endpoint gating uses the closest existing backend permission vocabulary:

- role read endpoints: `users:read` or wildcard-backed admin access
- role create/update/delete endpoints: `settings:manage`
- user permission/role mutation endpoints: `settings:manage`

`NEEDS VERIFICATION`:
- the source PDF may expect a more explicit role-management permission namespace
  than the current codebase exposes
- current Ticket 4 keeps the implementation aligned to the existing permission
  constants instead of inventing new permission codes mid-stream

## Test coverage

Minimal backend service tests now exist using the current backend toolchain with
Node's built-in test runner:

- `backend/api/src/modules/auth/services/role.service.test.ts`
- `backend/api/src/modules/auth/services/user-permission.service.test.ts`
- `backend/api/src/modules/auth/controllers/role.controller.test.ts`
- `backend/api/src/modules/auth/controllers/user-permission.controller.test.ts`

Backend service test command:

```bash
npm run test:services -w backend/api
npm run test:controllers -w backend/api
```

## Audit note

Role/user-permission mutation audit event wiring remains `NEEDS VERIFICATION`.
The current Ticket 3 scope keeps that gap documented instead of inventing a new
audit event set before controller/route work is introduced.

## DB Fields

- `roles.code`
- `roles.name`
- `roles.description`
- `roles.permissions`
- `roles.isSystemRole`
- `roles.isEditable`
- `roles.status`
- `roles.isDeleted`
- `roles.deletedAt`
- `roles.createdAt`
- `roles.updatedAt`
- `user_identities.role`
- `user_identities.permissions`
- `user_identities.updatedBy`
- `user_identities.updatedAt`

## Phase 3 Planned Catalog Permissions (not implemented)

Documented in Catalog Architecture; constants/seeds updated in implementation modules:

- `catalog:read`
- `catalog:create`
- `catalog:update`
- `catalog:delete`
- `catalog:approve`
- `catalog:media_upload`

See `docs/security/catalog-permissions.md`.
