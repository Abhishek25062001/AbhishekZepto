# Phase 5 Store Order API Contract

## Scope

This document plans store/vendor order APIs for Backend Order State Management.
It does not create route files, controllers, validators, repositories, services,
OpenAPI files, Postman collections, or tests.

**Sources:**

- `projectin micro/docone/AllPhase&Modules.pdf` (Backend Order State Management)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (store order list/detail API micro-tasks)

## Store Order List

**Planned endpoint:** `GET /api/v1/store/orders`

### Ownership

The authenticated store/vendor actor may list only orders for stores assigned to
that actor. Cross-store access must return forbidden or empty scoped results per
implementation convention.

### Planned Query Filters

| Query | Purpose |
|-------|---------|
| `status` | Filter by lifecycle/order status |
| `storeStatus` | Filter by store operation status |
| `paymentStatus` | Filter by payment status |
| `slaStatus` | Filter by SLA state |
| `slaBreachedStage` | Filter by breached SLA stage |
| `fromDate` / `toDate` | Filter by order creation date |
| `page` / `limit` | Pagination |
| `sort` | Sort by created date or SLA priority |

### Planned Response Summary Fields

- `orderId`
- `orderNumber`
- `customerId`
- `storeId`
- `orderStatus`
- `storeStatus`
- `paymentStatus`
- `grandTotal`
- `createdAt`
- `acceptedAt`
- `slaStatus`
- `slaBreachedStage`

## Planned DB Fields

Planned only:

- `storeId`
- `orderStatus`
- `storeStatus`
- `paymentStatus`
- `createdAt`
- `slaStatus`

## Store Order Detail

**Planned endpoint:** `GET /api/v1/store/orders/{orderId}`

### Ownership

The authenticated store/vendor actor may fetch detail only for orders assigned
to one of their stores. Other-store orders must be denied according to project
authorization conventions.

### Planned Response Sections

| Section | Planned contents |
|---------|------------------|
| Summary | order id, order number, customer id, store id, totals, payment status |
| Items | product/variant snapshot, ordered quantity, picked/missing quantities |
| State | `orderStatus`, `storeStatus`, `pickerStatus`, `packingStatus` |
| Timeline | store-visible timeline events |
| Lifecycle | lifecycle status history |
| SLA | `slaStatus`, `slaBreachedStage`, relevant timestamps |

### Store-Safe Timeline

Store detail may include assigned-store operational events, picking/packing
events, cancellation events relevant to store operations, and SLA markers. It
must not expose cross-store data or admin-only notes.

### Planned DB Fields

Planned only:

- order summary fields
- `items[]`
- `timeline[]`
- `lifecycle[]`
- `storeStatus`
- `pickerStatus`
- `packingStatus`

## API Endpoints

Ticket 3.1 implements:

- `POST /api/v1/store/orders/{orderId}/accept`
- `POST /api/v1/store/orders/{orderId}/reject`

List/detail endpoints in this document remain planned for Backend Order State
Management.

## DB Fields

Ticket 3.1 creates acceptance fields on the order model:

- `storeStatus`
- `acceptedAt`
- `rejectedAt`
- `rejectionReason`
