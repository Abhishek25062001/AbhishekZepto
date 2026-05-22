# Phase 4 Module 4 — Customer App Cart Smoke Results

**Date:** 2026-05-19  
**Environment:** local dev (template)

## Prerequisites

- Backend Module 3 cart APIs running
- Customer `9999999999` / OTP `123456`
- Store `STORE-000001` selected

## Automated tests

| Command | Result |
|---------|--------|
| `npm run typecheck -w apps/customer-app` | PASS |
| `npm run test:customer-cart -w apps/customer-app` | PASS (5 tests) |

## Manual device checklist

| Step | Expected | Result |
|------|----------|--------|
| Add from product detail | Bottom bar appears | PENDING |
| Quick add from category listing | Item in cart | PENDING |
| Open cart from bottom bar | CartScreen lists lines | PENDING |
| Update quantity | PATCH succeeds | PENDING |
| Remove line | Item removed | PENDING |
| Clear cart | Empty cart | PENDING |
| Insufficient stock message | User-friendly error | PENDING |

## Notes

Live device smoke not run in automated closeout.
