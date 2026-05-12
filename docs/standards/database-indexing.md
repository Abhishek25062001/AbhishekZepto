# Database Indexing

## Purpose

This document records Database Foundation index strategy placeholders.

Real model indexes must be added only after confirming the module's query
patterns.

## Base Indexes

Common record-state filters may use:

```json
{
  "isDeleted": 1,
  "status": 1
}
```

## Tenant Scope Indexes

Vendor and store scoped records may use:

```json
{
  "vendorId": 1,
  "storeId": 1,
  "isDeleted": 1
}
```

## Customer Query Indexes

Customer order list queries may use:

```json
{
  "customerId": 1,
  "createdAt": -1
}
```

## Inventory Query Indexes

Inventory lookup queries may use:

```json
{
  "storeId": 1,
  "productId": 1,
  "variantId": 1
}
```

## Rule

Do not add production indexes from placeholders alone. Add indexes only after
the owning module confirms real query patterns and documents the index.
