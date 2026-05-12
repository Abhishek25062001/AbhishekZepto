# Backend DB Fields

## Purpose

This document records backend database field conventions used by Backend Core
Foundation.

It does not create database connections or Mongoose models.

## Common DB Fields

- `_id`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

## Common Status Values

- `active`
- `inactive`
- `blocked`
- `pending`
- `archived`

## Standard ID Field Examples

- `customerId`
- `storeId`
- `vendorId`
- `orderId`
- `deliveryAgentId`
- `adminId`

## Schema Option Placeholders

Future Mongoose schemas should use:

- `timestamps: true`
- `versionKey: false`

## Pagination Defaults

- default `page`: `1`
- default `limit`: `20`
- max `limit`: `100`
