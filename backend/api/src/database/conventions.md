# Database Conventions

## Collection Naming

MongoDB collection names use lowercase plural names with underscores.

Examples:

- `customers`
- `delivery_agents`
- `product_variants`
- `audit_logs`

## Timestamp Rule

Main business collections must use `createdAt` and `updatedAt` timestamps.

## Soft Delete Rule

Business records should use soft delete by setting:

- `isDeleted`
- `deletedAt`

Soft-deleted records should be excluded from normal reads unless a later admin
or audit module explicitly needs them.

## ObjectId Reference Rule

MongoDB reference fields must end with `Id`.

Examples:

- `customerId`
- `storeId`
- `vendorId`
- `orderId`
- `deliveryAgentId`
- `adminId`

## Status Rule

Use standard database status values unless a module documents a specific state
machine:

- `active`
- `inactive`
- `blocked`
- `pending`
- `archived`
- `deleted`
