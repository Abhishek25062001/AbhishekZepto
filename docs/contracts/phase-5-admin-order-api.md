# Phase 5 Admin Order API Contract

## Scope

This document plans admin order APIs for Backend Order State Management. It does
not create route files, controllers, validators, repositories, services,
OpenAPI files, Postman collections, or tests.

**Sources:**

- `projectin micro/docone/AllPhase&Modules.pdf` (Backend Order State Management)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (admin order list/detail API micro-tasks)

## Admin Order List

**Planned endpoint:** `GET /api/v1/admin/orders`

### Permission

The authenticated admin actor must have order read/operations permission within
their allowed scope.

### Planned Query Filters

| Query | Purpose |
|-------|---------|
| `status` | Filter by lifecycle/order status |
| `storeStatus` | Filter by store operation status |
| `storeId` | Filter by store |
| `cityId` | Filter by city |
| `paymentStatus` | Filter by payment status |
| `customerId` | Filter by customer |
| `slaStatus` | Filter by SLA state |
| `slaBreachedStage` | Filter by breached SLA stage |
| `fromDate` / `toDate` | Filter by order creation date |
| `page` / `limit` | Pagination |
| `sort` | Sort by created date, status, or SLA priority |

### Planned Response Summary Fields

- `orderId`
- `orderNumber`
- `customerId`
- `storeId`
- `cityId`
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

- `orderStatus`
- `storeStatus`
- `paymentStatus`
- `customerId`
- `storeId`
- `createdAt`
- `slaStatus`
- `slaBreachedStage`

## Admin Order Detail

**Planned endpoint:** `GET /api/v1/admin/orders/{orderId}`

### Permission

The authenticated admin actor must have order read/operations permission within
their allowed scope.

### Planned Response Sections

| Section | Planned contents |
|---------|------------------|
| Summary | order id, order number, customer, store, city, totals, created/placed timestamps |
| Payment | payment id, payment status, payment summary |
| Items | product/variant snapshots, ordered/picked/missing quantities |
| State | `orderStatus`, `storeStatus`, `pickerStatus`, `packingStatus` |
| Timeline | full operational timeline allowed for admin scope |
| Lifecycle | lifecycle status history |
| SLA | `slaStatus`, `slaBreachedStage`, relevant stage timestamps |
| Cancellation | cancellation reason, actor, timestamp, refund placeholder |

### Admin Timeline Visibility

Admin detail may include full operational timeline, cancellation metadata, SLA
markers, and internal notes allowed by permission scope. Customer-private data
outside the order context must remain excluded.

### Planned DB Fields

Planned only:

- full order summary fields
- `timeline[]`
- `lifecycle[]`
- `slaStatus`
- `slaBreachedStage`
- cancellation fields

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
