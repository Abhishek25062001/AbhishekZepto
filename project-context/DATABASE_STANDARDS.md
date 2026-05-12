# Database Standards

## Primary Database

MongoDB is the Phase 1 primary database. Mongoose is the expected modeling layer.

The MongoDB connection lifecycle is implemented in:

- `backend/api/src/config/database.ts`

Local runtime verification still requires a reachable MongoDB service.

## Collection Naming

Use lowercase snake_case plural collection names.

Expected examples:

- `user_identities`
- `auth_sessions`
- `customers`
- `delivery_agents`
- `vendors`
- `stores`
- `categories`
- `brands`
- `products`
- `product_variants`
- `inventory_items`
- `orders`
- `payment_records`
- `refund_records`
- `vendor_settlements`
- `delivery_earnings`
- `audit_logs`

## Field Naming

Use camelCase for database fields and TypeScript properties.

Use explicit reference field names ending in `Id`:

- `customerId`
- `deliveryAgentId`
- `vendorId`
- `storeId`
- `cityId`
- `orderId`
- `paymentRecordId`
- `refundId`

Avoid ambiguous fields such as `user`, `entity`, `item`, or `record` when the business concept is known.

## Base Fields

Most business collections should include:

- `_id`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

Current helper files:

- `backend/api/src/database/base-fields.ts`
- `backend/api/src/database/base-schema-fields.ts`
- `backend/api/src/database/base-schema-options.ts`
- `backend/api/src/database/pagination.ts`
- `backend/api/src/database/query-helpers.ts`
- `backend/api/src/database/database-error.mapper.ts`

## Status Values

Status values use lowercase snake_case.

Current common placeholders:

- `active`
- `inactive`
- `blocked`
- `pending`
- `archived`

Each domain module must document its allowed status values before model implementation.

## Soft Delete

Business records should use soft delete unless a module explicitly allows hard delete.

Soft-delete behavior:

- set `isDeleted` to `true`
- set `deletedAt`
- exclude soft-deleted records from normal reads
- preserve audit and historical references

## Indexes

Each model ticket must document indexes. Common indexes include:

- unique fields such as phone, slug, SKU, gateway IDs
- scope fields such as `vendorId`, `storeId`, `cityId`, `customerId`
- lifecycle fields such as `status`
- soft-delete filters such as `isDeleted`
- date fields such as `createdAt`
- query-specific compound indexes

Use partial unique indexes when soft-deleted records should not block valid future records.

## Money

Finance modules must explicitly document money storage units before implementation. Prefer smallest currency unit for payment, refund, settlement, and earning records unless a module document specifies otherwise.

Frontend apps must never calculate final payable, refund, settlement, or earning amounts as source of truth.
