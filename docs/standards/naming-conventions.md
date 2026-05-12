# Naming Conventions

## Purpose

This document defines common naming rules for future implementation work across
the backend, Customer App, Delivery Agent App, Vendor Panel, Admin Dashboard,
shared packages, and documentation.

These conventions protect consistency before repository and codebase setup
begins.

## General Rules

- Use clear business-domain names.
- Avoid abbreviations unless they are already standard in the project documents.
- Prefer names that describe ownership and purpose.
- Keep naming consistent across docs, APIs, database collections, and frontend
  features.
- Do not create duplicate terms for the same domain concept.

## Folder Naming

Folders should use kebab-case.

Examples:

- `customer-app`
- `delivery-agent-app`
- `vendor-panel`
- `admin-dashboard`
- `system-context`
- `order-lifecycle`
- `delivery-lifecycle`

Backend module folders should use plural or domain-grouped names when they
represent collections of related behavior.

Examples:

- `auth`
- `users`
- `catalog`
- `inventory`
- `orders`
- `delivery`
- `finance`
- `promotions`
- `notifications`

## File Naming

Documentation files should use kebab-case.

Examples:

- `phase-1-architecture-decision.md`
- `system-context.md`
- `app-boundaries.md`
- `future-scale-notes.md`

Future TypeScript files should use kebab-case with a purpose suffix when
applicable.

Examples:

- `auth.service.ts`
- `order.controller.ts`
- `inventory.repository.ts`
- `payment-record.model.ts`
- `customer-home.routes.ts`
- `order-status.validator.ts`

## Backend Module Naming

Backend modules should be named after business domains, not technical layers.

Preferred module names:

- `auth`
- `users`
- `catalog`
- `stores`
- `inventory`
- `cart`
- `checkout`
- `orders`
- `delivery`
- `tracking`
- `notifications`
- `finance`
- `promotions`
- `support`
- `admin`

Avoid module names that are too generic for business logic, such as:

- `helpers`
- `common-business`
- `misc`
- `manager`
- `data`

Shared technical utilities may exist later, but they should not become dumping
grounds for domain behavior.

## API Route Naming

API routes should use lowercase kebab-case path segments.

Route groups should follow the project surface:

- `/api/v1/public`
- `/api/v1/customer`
- `/api/v1/delivery`
- `/api/v1/vendor`
- `/api/v1/admin`
- `/api/v1/internal`
- `/api/v1/webhooks`

Use nouns for resources and action names only when the action cannot be modeled
as a normal resource update.

Examples:

- `/api/v1/customer/cart`
- `/api/v1/customer/orders`
- `/api/v1/vendor/orders`
- `/api/v1/admin/catalog/products`
- `/api/v1/admin/finance/refunds`

## Database Collection Naming

MongoDB collections should use lowercase snake_case plural names.

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

Collection names should match the business domain used in architecture and API
documents.

## Field Naming

API response fields and TypeScript properties should use camelCase.

Examples:

- `customerId`
- `deliveryAgentId`
- `storeId`
- `paymentStatus`
- `refundStatus`
- `createdAt`
- `updatedAt`

Database schema field names should also use camelCase unless a later module
explicitly documents a different storage convention.

## Enum and Status Naming

Enum values and status values should use lowercase snake_case.

Examples:

- `active`
- `inactive`
- `pending_approval`
- `out_for_delivery`
- `partially_refunded`
- `settlement_pending`

Enum names in TypeScript should use PascalCase.

Examples:

- `OrderStatus`
- `PaymentStatus`
- `RefundStatus`
- `DeliveryAssignmentStatus`
- `PromotionStatus`

## Identifier Naming

Use explicit identifier names.

Examples:

- `customerId`
- `deliveryAgentId`
- `vendorId`
- `storeId`
- `cityId`
- `orderId`
- `paymentRecordId`
- `refundId`
- `settlementId`

Avoid ambiguous names such as `user`, `entity`, `item`, or `record` when the
business concept is known.

## Documentation Naming

Architecture documents should live under `docs/architecture`.

Standards documents should live under `docs/standards`.

Future contract documents should live under `docs/contracts`.

Future database documents should live under `docs/database`.

Future security documents should live under `docs/security`.
