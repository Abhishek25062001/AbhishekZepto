# Phase 4 Module 2 — Smoke Results

**Date:** 2026-05-19  
**Module:** Customer Home & Shopping Entry

## Automated

| Check | Result |
|-------|--------|
| `npm run typecheck -w backend/api` | PASS |
| `npm run build -w backend/api` | PASS |
| `npm run test:customer-home -w backend/api` | PASS (6 tests) |
| `npm run typecheck -w apps/customer-app` | PASS |
| Ticket 1–2 doc checks | PASS |

## Manual (pending live MongoDB)

| Check | Result |
|-------|--------|
| `GET /api/v1/customer/home?storeId=` with customer JWT | NOT RUN |
| App: login → store → home feed sections | NOT RUN |
| Category/product navigation from home | NOT RUN |

## Notes

- Dev customer: `9999999999`, OTP `123456`
- Home validates `storeId` against `customer_store_selections` when selection exists
