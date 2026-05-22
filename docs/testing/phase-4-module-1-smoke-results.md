# Phase 4 Module 1 — Smoke Results

**Date:** 2026-05-19  
**Module:** Customer Location & Store Selection

## Automated

| Check | Result |
|-------|--------|
| `npm run typecheck -w backend/api` | PASS |
| `npm run build -w backend/api` | PASS |
| `npm run test:customer-addresses -w backend/api` | PASS (12 tests) |
| `npm run typecheck -w apps/customer-app` | PASS |
| Ticket 1 doc existence | PASS |
| Ticket 2 schema doc | PASS |

## Manual (pending live MongoDB)

| Check | Result |
|-------|--------|
| Customer JWT curl — address CRUD | NOT RUN |
| Serviceability near `STORE-000001` | NOT RUN |
| `npm run seed` customer address | NOT RUN |
| Customer app E2E on device | NOT RUN |

## Notes

- Dev customer: `9999999999`, OTP `123456`
- Seed store: `STORE-000001` at `28.5921`, `77.046`, radius `5` km
- Unserviceable test coords example: `29.0`, `78.0`
