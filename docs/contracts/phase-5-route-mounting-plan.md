# Phase 5 Route Mounting Plan

## Scope

This document plans Phase 5 route families only. It does not create Express
routers, controllers, validators, middleware, OpenAPI files, or route registry
entries.

**Sources:**

- `projectin micro/docone/AllPhase&Modules.pdf` (Phase 5 modules 2-14)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Order lifecycle/state endpoint micro-tasks)

## Customer Routes

| Method | Planned path | Module | Purpose |
|--------|--------------|--------|---------|
| GET | `/api/v1/customer/orders/{orderId}/state` | Backend Order State Management | Fetch current order state |
| GET | `/api/v1/customer/orders/{orderId}/lifecycle` | Backend Order State Management | Fetch lifecycle/timeline |
| POST | `/api/v1/customer/orders/{orderId}/cancel` | Order Cancellation Backend | Cancel eligible own order |

## Store / Vendor Routes

| Method | Planned path | Module | Purpose |
|--------|--------------|--------|---------|
| GET | `/api/v1/store/orders` | Backend Order State Management | Store order list |
| GET | `/api/v1/store/orders/{orderId}` | Backend Order State Management | Store order detail |
| POST | `/api/v1/store/orders/{orderId}/accept` | Store Acceptance Flow | Accept incoming order — implemented Ticket 3.1 |
| POST | `/api/v1/store/orders/{orderId}/reject` | Store Acceptance Flow | Reject incoming order — implemented Ticket 3.1 |
| POST | `/api/v1/store/orders/{orderId}/picking/start` | Picking Workflow Backend | Start picking — Module 4 contract documented |
| POST | `/api/v1/store/orders/{orderId}/items/{itemId}/picked` | Picking Workflow Backend | Mark item picked — Module 4 contract documented |
| POST | `/api/v1/store/orders/{orderId}/items/{itemId}/missing` | Picking Workflow Backend | Mark item missing — Module 4 contract documented |
| POST | `/api/v1/store/orders/{orderId}/picking/complete` | Picking Workflow Backend | Complete picking — Module 4 contract documented |
| POST | `/api/v1/store/orders/{orderId}/packing/start` | Packing & Ready-for-Pickup Flow | Start packing — Module 5 contract documented |
| POST | `/api/v1/store/orders/{orderId}/packing/complete` | Packing & Ready-for-Pickup Flow | Complete packing — Module 5 contract documented |
| POST | `/api/v1/store/orders/{orderId}/ready-for-pickup` | Packing & Ready-for-Pickup Flow | Mark ready for pickup — Module 5 contract documented |
| POST | `/api/v1/store/orders/{orderId}/cancel` | Order Cancellation Backend | Store cancellation |

Store order API contract:

- `docs/contracts/phase-5-store-order-api.md`
- `docs/contracts/phase-5-picking-workflow-api.md`
- `docs/contracts/phase-5-packing-ready-for-pickup-api.md`
- `docs/contracts/phase-5-inventory-adjustment-store-operations.md`
- `docs/contracts/phase-5-order-cancellation-api.md`

Inventory adjustment during store operations does not introduce a public route
family. Module 6 runs as internal backend reconciliation after picking
completion and uses existing inventory stock/movement records.

## Admin Routes

| Method | Planned path | Module | Purpose |
|--------|--------------|--------|---------|
| GET | `/api/v1/admin/orders` | Backend Order State Management | Admin order list with filters |
| GET | `/api/v1/admin/orders/{orderId}` | Backend Order State Management | Admin order detail |
| POST | `/api/v1/admin/orders/{orderId}/status` | Backend Order State Management | Admin status update |
| GET | `/api/v1/admin/orders/{orderId}/timeline` | Admin Dashboard - Order Operations | Admin timeline view |
| POST | `/api/v1/admin/orders/{orderId}/cancel` | Order Cancellation Backend | Admin cancellation |

Admin order API contract:

- `docs/contracts/phase-5-admin-order-api.md`
- `docs/contracts/phase-5-order-cancellation-api.md`

## Internal / System Routes

No internal HTTP routes are planned by Module 0. Store operation notifications
and SLA jobs are planned as services/jobs in later modules, not public route
families.

## Route Dependency Notes

- Customer state and lifecycle reads depend on backend order state management.
- Store accept/reject depends on lifecycle transition rules and store ownership.
- Picking routes depend on accepted store orders.
- Packing routes depend on picking completion.
- Inventory adjustment depends on picked and missing item state from picking
  completion and does not add public routes.
- Cancellation routes depend on cancellation rules and inventory release rules.
- Admin list/detail/status routes depend on access controls and timeline fields.

## Module 1 Architecture Review

Route families must align with:

- `docs/architecture/phase-5-order-state-machine.md`
- `docs/contracts/order-state-transition-matrix.md`
- `docs/architecture/phase-5-order-ownership-rules.md`
- `docs/architecture/phase-5-sla-timing-rules.md`
- `docs/architecture/phase-5-cancellation-rules.md`

All route families remain planned-only until later implementation modules.

## Auth And Permission Notes

- Customer routes require authenticated customer scope and order ownership.
- Store routes require authenticated store/vendor scope and store assignment.
- Admin routes require explicit order operation permissions.
- Every state-changing route must create a timeline/audit event in later
  implementation.

## API Endpoints

No API endpoints are implemented in this document. All endpoints above are
planned route families.

## DB Fields

No database fields are created in this document.
