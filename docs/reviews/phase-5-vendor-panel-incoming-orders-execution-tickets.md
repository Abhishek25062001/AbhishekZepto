# Phase 5 Vendor Panel Incoming Orders Execution Tickets

## Module

Phase 5 — Order Lifecycle & Store Operations  
Module 8 — Vendor Panel - Incoming Orders

## Ticket Status

| Ticket | Name | Status | Depends on |
|--------|------|--------|------------|
| 8.1 | Module 8 Scope And UI Contract | DONE | Modules 2, 3 |
| 8.2 | Store Incoming Order Read API Support | DONE | 8.1 |
| 8.3 | Vendor Incoming Orders API Client And Types | DONE | 8.2 |
| 8.4 | Incoming Orders List Page | DONE | 8.3 |
| 8.5 | Incoming Order Detail View | DONE | 8.4 |
| 8.6 | Accept And Reject Actions In Vendor Panel | DONE | 8.5 |
| 8.7 | Vendor Orders Navigation And Permission Visibility | DONE | 8.4 |
| 8.8 | Module 8 Review, Matrix, And Handoff | DONE | 8.1-8.7 |

## Scope Guard

Module 8 must not implement Module 9 picking/packing, Module 10 history and
store cancellation, Module 13 notifications, or Module 14 SLA jobs.

## Review Commands

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI verification for any endpoint added by the ticket
