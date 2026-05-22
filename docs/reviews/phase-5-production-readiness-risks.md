# Phase 5 Production Readiness Risks

**Ticket:** 15.17 - Manual smoke and production risk review
**Status:** Documented
**Date:** 2026-05-21
**Module 16 update:** Integration risks reviewed in Ticket 16.15.

## Scope

This document records known Phase 5 production readiness risks identified during
Testing & Validation. It does not add features.

## Risks

| Risk | Impact | Mitigation / owner |
|---|---|---|
| Live environment and seed dependency | Manual smoke cannot be completed without real API, DB, and seeded users/orders. | Run manual checklist in a controlled environment before Phase 5 closure. |
| Phase 4 payment/order dependency | Phase 5 starts from a placed order; broken Phase 4 placement blocks live lifecycle smoke. | Include a known placed order fixture before operator smoke. |
| SLA scheduler is placeholder only | Delayed order marking exists as callable job, not production scheduler. | Wire scheduler in a future operations module before production launch. |
| Notification delivery is placeholder only | Placeholder records exist but no provider delivery is implemented. | Keep provider delivery out of Phase 5; plan delivery provider work separately. |
| Refund ledger is out of scope | Cancellation sets refund review flags but does not execute refunds. | Require refund workflow before production cancellation rollout. |
| Manual device/browser coverage pending | Automated tests pass but full UI runtime path still needs operator confirmation. | Complete manual smoke checklist before Phase 5 final integration sign-off. |
| Duplicate Mongoose index warning | Test output contains a known duplicate `isDeleted` index warning. | Track as non-blocking cleanup unless it becomes runtime noisy or index creation fails. |
| Seeded role and store-scope drift | Manual smoke can produce false failures if seeded users do not match Phase 5 permissions and store scopes. | Confirm customer, vendor/store, and admin fixtures before smoke execution. |
| Notification provider scoping future work | Future provider delivery could leak events if recipient scoping is not preserved. | Reuse placeholder recipient fields and re-review before provider integration. |
| SLA operational cadence future work | Callable SLA job is safe, but cadence, locking, and monitoring are not productionized. | Implement scheduler hardening in a future operations module. |

## Result

No blocking production readiness issue prevents Module 16 integration review
from completing. Manual smoke remains pending operator execution against a
seeded live environment.
