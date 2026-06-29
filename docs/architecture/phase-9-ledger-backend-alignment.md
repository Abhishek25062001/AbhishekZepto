# Phase 9 Ledger Backend Alignment

**Module:** 3 — Ledger Foundation  
**Status:** IMPLEMENTED

## File Map

| Area | Path | Action |
|------|------|--------|
| Module index | `modules/finance/ledger/index.ts` | CREATE |
| Constants | `modules/finance/ledger/constants/*` | CREATE |
| Models | `modules/finance/ledger/models/ledger-account.model.ts` | CREATE |
| Models | `modules/finance/ledger/models/ledger-journal-entry.model.ts` | CREATE |
| Models | `modules/finance/ledger/models/ledger-transaction-line.model.ts` | CREATE |
| Types | `modules/finance/ledger/types/ledger.types.ts` | CREATE |
| Utils | `modules/finance/ledger/utils/*` | CREATE |
| Repositories | `modules/finance/ledger/repositories/*` | CREATE |
| Validators | `modules/finance/ledger/validators/*` | CREATE |
| Services | `modules/finance/ledger/services/*` | CREATE |
| Controllers | `modules/finance/ledger/controllers/*` | CREATE |
| Routes | `modules/finance/ledger/routes/ledger-admin.routes.ts` | CREATE |
| Tests | `modules/finance/ledger/__tests__/*` | CREATE |
| Collection names | `database/constants/collection-names.constants.ts` | EXTEND |
| Admin mount | `routes/v1/admin.routes.ts` | EXTEND |
| Permissions | `modules/auth/constants/auth-permission.constants.ts` | EXTEND |
| Error codes | `errors/error-codes.ts` | EXTEND |
| Seed accounts | `database/seeds/seed-ledger-accounts.ts` | CREATE |
| Seed runner | `database/seeds/seed-runner.ts` | EXTEND |
| Role seed | `database/seeds/seed-roles.ts` | EXTEND |
| Payment verify | `modules/payment/services/payment.service.ts` | EXTEND |
| Payment webhook | `modules/payment/services/payment-webhook.service.ts` | EXTEND |
| Payment repo | `modules/payment/repositories/payment.repository.ts` | EXTEND |
| OpenAPI | `docs/openapi/ledger-foundation.paths.ts` | CREATE |
| Shared types | `packages/shared/api/finance/ledger.types.ts` | CREATE |

## Payment Integration Touchpoints

| File | Change |
|------|--------|
| `payment.service.ts` | Call `postPaymentReceived` after successful verify |
| `payment-webhook.service.ts` | Call `postPaymentReceived` on `payment.captured` |
| `payment.repository.ts` | `updatePaymentLedgerMetadata` helper |

## Ticket Execution Order

```text
Tickets 1–5 (docs) → 6–9 (scaffold, constants, errors, audit)
→ 10–17 (models, types, mappers, repos, validators)
→ 18–26 (services)
→ 27–28 (payment integration)
→ 29–35 (HTTP, permissions, seed, shared, OpenAPI, registry)
→ 36–40 (tests)
→ 41–42 (verification, handoff)
```

## Reuse

- `payment-amount.util.ts` — money validation patterns
- `writeAuditLog` — ledger audit events
- `createPermissionCode` + `requirePermission` — admin gates

## Reference

- `docs/architecture/phase-9-financial-backend-file-structure.md` — planned finance tree
