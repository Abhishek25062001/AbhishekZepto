# Role Permission Contract

## Contract Goal

Document the role object response shape.

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

No new API endpoints created in this task.

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
- `user_identities.permissions`
