# Role Permission Architecture

## Role Permission Goal

Roles group permissions, and permissions control backend resource actions.

## Collection

- `roles`

## Planned Model File

- `/backend/api/src/modules/auth/models/role.model.ts`

## DB Fields

- `code: string`
- `name: string`
- `description: string | null`
- `permissions: string[]`
- `isSystemRole: boolean`
- `isEditable: boolean`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

## Permission Format

Permission code format:

- `resource:action`

Permission examples:

- `orders:read`
- `orders:update`
- `inventory:read`
- `inventory:update`
- `settings:manage`

Wildcard permission:

- `*:*`

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

## DB Field Inventory

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
