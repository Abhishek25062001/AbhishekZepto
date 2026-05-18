# Permission Checking

## Goal

Document the service-level permission normalization and mutation rules used by
the corrective Role & Permission System work.

## Service-level rules

- Normalize permission arrays before writing them to persisted role or user
  records.
- Reject wildcard permission assignment for:
  - non-system roles
  - non-`super_admin` users
- Keep role mutation rules in the service layer instead of distributing them
  across controllers and repositories.

## Role service expectations

- `createRole()` rejects duplicate role codes.
- `createRole()` rejects wildcard permission use on non-system roles.
- `updateRole()` rejects mutation of system roles where `isEditable=false`.
- `deleteRole()` soft deletes roles and rejects deletion of non-editable system
  roles.

## User permission service expectations

- `updateUserPermissions()` normalizes permission codes before persistence.
- `assignUserRole()` updates the user role only.
- `syncUserPermissionsFromRole()` copies the active role permission set into the
  user identity permission set.
- User permission mutation must keep `updatedBy` and `updatedAt` consistent when
  the current model supports those fields.

## Audit note

- Existing audit utilities are available, but dedicated role/user-permission
  mutation audit events remain `NEEDS VERIFICATION` until the next corrective
  ticket clarifies the final event set and controller wiring.

## Service test coverage

Minimal backend service tests now cover:

- role creation succeeds
- duplicate role code rejection
- non-editable system-role update rejection
- non-editable system-role delete rejection
- wildcard rejection for non-system roles
- user permission update success
- wildcard rejection for non-`super_admin` users
- user role assignment
- sync user permissions from role

Run with:

```bash
npm run test:services -w backend/api
```
