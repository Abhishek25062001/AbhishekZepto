# Phase 4 Production Readiness Risks

**Date:** 2026-05-19

| Risk | Impact | Mitigation |
|------|--------|------------|
| Razorpay live keys / webhook URL | Payments fail in prod | Configure env; verify webhook signature in staging |
| Webhook replay / duplicate verify | Double order if idempotency fails | Covered by unit tests; monitor `idempotencyKey` |
| Checkout TTL vs slow payment | Lock expires mid-pay | Show timer in app; retry checkout |
| Price drift cart → checkout | Wrong charge | `validatePrices` + recalculate before initiate |
| Dev OTP `123456` | Security | Disable in production auth config |
| No fulfillment UI | Customer sees `placed` only | Phase 5 lifecycle |
| OpenAPI incomplete for Phase 4 | Doc drift | Registry + tests as source of truth |
| MongoDB transactions | Partial failure edge cases | Service-level rollback (locks release tests) |
| Seed vs production data | Smoke confusion | Separate seed profiles |
| Manual E2E not run | Unknown device bugs | Complete `phase-4-manual-smoke-checklist.md` |

**Follow-up:** Module 15 Integration & Review
