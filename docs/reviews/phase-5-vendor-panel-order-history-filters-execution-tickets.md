# Phase 5 Vendor Panel Order History & Filters Execution Tickets

## Module

Phase 5 — Order Lifecycle & Store Operations  
Module 10 — Vendor Panel - Order History & Filters

## Ticket Status

| Ticket | Name | Status | Depends on |
|--------|------|--------|------------|
| 10.1 | Module 10 Scope And UI Contract | DONE | Modules 2, 7, 8, 9 |
| 10.2 | Vendor History Filter Types And Query Helpers | DONE | 10.1 |
| 10.3 | Vendor Order History List Page | DONE | 10.2 |
| 10.4 | History Filter Controls And URL Sync | DONE | 10.3 |
| 10.5 | Vendor Order History Detail View | DONE | 10.4 |
| 10.6 | Store Cancellation Action In Vendor Panel | DONE | 10.5 |
| 10.7 | History Status And Cancellation Display Rules | DONE | 10.6 |
| 10.8 | Permissions And Workflow Guards For History | DONE | 10.7 |
| 10.9 | Module 10 Review, Matrix, And Handoff | DONE | 10.1-10.8 |

## Scope Guard

Module 10 must not implement new backend order endpoints, unsupported backend
filters, notifications, SLA jobs, delivery handoff, admin UI, or customer UI.

## Review Commands

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI verification for any endpoint added by the ticket
- `npm run typecheck -w apps/vendor-panel`
- `npm run lint -w apps/vendor-panel`
- `npm run test:vendor-orders -w apps/vendor-panel`
- `npm run test:access-control-smoke -w apps/vendor-panel` for permission closeout
