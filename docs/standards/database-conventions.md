# Database Conventions

## Purpose

This document defines MongoDB and Mongoose database conventions for future
modules.

It does not create database models, migrations, seed scripts, or executable
database code.

## Primary Database

MongoDB is the primary Phase 1 database.

Mongoose is the expected object modeling layer for backend implementation.

## Collection Naming

Collection names should use lowercase snake_case plural names.

Examples:

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

Collection names should match the business terms used in architecture, API, and
module documents.

## Common Base Fields

Most persistent collections should include these common base fields:

- `_id`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

Meaning:

- `_id`: MongoDB ObjectId primary identifier.
- `status`: business lifecycle status for the record.
- `isDeleted`: soft-delete flag.
- `deletedAt`: timestamp for soft deletion.
- `createdAt`: record creation timestamp.
- `updatedAt`: last update timestamp.

Some event or log collections may use different lifecycle fields when a later
module explicitly documents that behavior.

## Field Naming

Database fields should use camelCase.

Examples:

- `customerId`
- `deliveryAgentId`
- `vendorId`
- `storeId`
- `cityId`
- `orderId`
- `paymentStatus`
- `refundStatus`
- `createdAt`
- `updatedAt`

Enum and status values should use lowercase snake_case.

Examples:

- `active`
- `inactive`
- `blocked`
- `pending`
- `archived`
- `deleted`
- `pending_approval`
- `out_for_delivery`
- `partially_refunded`

## ObjectId References

References to other MongoDB documents should use explicit field names ending in
`Id`.

Examples:

- `customerId`
- `storeId`
- `vendorId`
- `orderId`
- `paymentRecordId`
- `refundId`

When a record belongs to a tenant or operational scope, include the relevant
scope references explicitly.

Examples:

- `vendorId`
- `storeId`
- `cityId`
- `customerId`
- `deliveryAgentId`

## Soft Delete Convention

Use soft delete for business records that should not disappear from operational
history.

Soft-delete behavior:

- Set `isDeleted` to `true`.
- Set `deletedAt` to the deletion timestamp.
- Preserve the original record for audit and historical references.
- Exclude soft-deleted records from normal read APIs unless explicitly requested
  by an admin or audit workflow.

Hard delete should be reserved for temporary records or cases where a later
module explicitly allows it.

## Timestamp Convention

Business collections should include:

- `createdAt`
- `updatedAt`

Date values should be stored as UTC timestamps.

API responses may format dates consistently later, but the stored value should
remain timezone-safe.

## Status Convention

Records with lifecycle behavior should use a `status` field.

Examples:

- customer account status
- delivery agent status
- store status
- product status
- order status
- payment status
- refund status
- settlement status

Each module must document its allowed status values before implementation.

Standard foundation status values are:

- `active`
- `inactive`
- `blocked`
- `pending`
- `archived`
- `deleted`

## Indexing Convention

Each module must document index requirements before or during model
implementation.

Common index categories:

- Unique identifiers such as slug, SKU, phone number, or payment gateway ID
- Scope fields such as `vendorId`, `storeId`, `cityId`, `customerId`
- Status fields such as `status`, `paymentStatus`, `refundStatus`
- Soft-delete filters such as `isDeleted`
- Created date fields such as `createdAt`
- Query-specific compound indexes documented by the module

Unique indexes for soft-deletable records should be partial indexes when needed
so deleted records do not block valid future records.

## Money Field Convention

Money fields must use consistent units within each module.

Finance-related modules must explicitly document whether amounts are stored in:

- smallest currency unit, or
- decimal major currency unit

Frontend apps must not independently calculate final payable, refund,
settlement, or earning amounts.

## Audit Data Convention

Operationally sensitive records should preserve enough data for audit trails.

Examples of audit-related fields:

- `createdBy`
- `updatedBy`
- `deletedBy`
- `approvedBy`
- `reviewedBy`
- `metadata`

Audit logging implementation belongs to later modules, but database schemas
should avoid losing important operational context.
