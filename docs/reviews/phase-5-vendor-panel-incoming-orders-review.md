# Phase 5 Vendor Panel Incoming Orders Review

**Date:** 2026-05-21  
**Module:** 8 — Vendor Panel - Incoming Orders

## Review Result

Module 8 is complete for the implemented Vendor Panel incoming orders scope.

## Tickets Completed

- Ticket 8.1 — Module 8 Scope And UI Contract
- Ticket 8.2 — Store Incoming Order Read API Support
- Ticket 8.3 — Vendor Incoming Orders API Client And Types
- Ticket 8.4 — Incoming Orders List Page
- Ticket 8.5 — Incoming Order Detail View
- Ticket 8.6 — Accept And Reject Actions In Vendor Panel
- Ticket 8.7 — Vendor Orders Navigation And Permission Visibility
- Ticket 8.8 — Module 8 Review, Matrix, And Handoff

## Runtime Scope Verified

- Store-scoped backend order list and detail APIs.
- Vendor Panel incoming order list at `/orders`.
- Vendor Panel incoming order detail at `/orders/:orderId`.
- Accept/reject action wiring to existing store acceptance endpoints.
- Reject reason validation.
- Permission visibility for `orders:read` and `orders:update`.
- Display-only SLA placeholder when SLA data is absent.

## API Endpoints Verified

- `GET /api/v1/store/orders`
- `GET /api/v1/store/orders/{orderId}`
- `POST /api/v1/store/orders/{orderId}/accept`
- `POST /api/v1/store/orders/{orderId}/reject`

## DB Fields Verified

No new DB fields were added by Module 8.

Module 8 reads existing order lifecycle and store-operation fields:

- `orderStatus`
- `storeStatus`
- `paymentStatus`
- `acceptedAt`
- `rejectedAt`
- `rejectionReason`
- `createdAt`
- `items[]`
- `timeline[]`

## Permissions Verified

- `orders:read` controls incoming order list/detail visibility.
- `orders:update` controls accept/reject actions.
- Backend list/detail APIs remain scoped to authenticated actor `storeId`.

## Commands Run

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI verification for `/store/orders`
- OpenAPI verification for `/store/orders/{orderId}`
- `npm run typecheck -w apps/vendor-panel`
- `npm run lint -w apps/vendor-panel`
- `npm run test:vendor-orders -w apps/vendor-panel`
- `npm run test:access-control-smoke -w apps/vendor-panel`

## Notes

- Automated backend and Vendor Panel checks pass.
- Backend order tests still emit a pre-existing Mongoose duplicate index warning
  for `{"isDeleted":1}`. It is non-blocking and not introduced by Module 8.
- Picking, packing, ready-for-pickup, store cancellation, order history filters,
  notification publishing, SLA jobs, admin UI, and customer UI remain out of
  scope.

## Next

Phase 5 Module 9 — Vendor Panel - Picking & Packing.
