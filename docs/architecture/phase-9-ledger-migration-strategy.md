# Phase 9 Ledger Migration Strategy

**Module:** 3 — Ledger Foundation  
**Status:** IMPLEMENTED

## Module Path Decision

New ledger runtime lives at:

```text
backend/api/src/modules/finance/ledger/
```

Payment integration extends existing Module 2 tree (no duplicate `finance/payments`):

```text
backend/api/src/modules/payment/services/payment.service.ts
backend/api/src/modules/payment/services/payment-webhook.service.ts
backend/api/src/modules/payment/repositories/payment.repository.ts
```

**Decision:** CONFIRMED — extend-in-place for payments; new tree for ledger only.

## Admin Route Mount

```text
/api/v1/admin/finance/ledger/accounts*
/api/v1/admin/finance/ledger/journals*
/api/v1/admin/finance/ledger/journals/:journalId/reverse
/api/v1/admin/finance/ledger/accounts/:accountId/lines
```

Mounted in `backend/api/src/routes/v1/admin.routes.ts` at `/finance/ledger`.

## Payment Metadata Fields

| Field | Type | Purpose |
|-------|------|---------|
| `payments.metadata.ledgerJournalId` | string (ObjectId) | Posted journal reference |
| `payments.metadata.ledgerPostedAt` | string (ISO date) | Posting timestamp |

## Idempotency

Format: `payment:{paymentId}:payment_received`

- Verify and webhook paths share the same key.
- Duplicate calls return existing journal without creating a second entry.

## Failure Behavior

1. Payment marked `paid` first (verify/webhook).
2. Ledger posting attempted asynchronously in-process after payment update.
3. If posting fails: payment remains paid; audit event `finance.ledger_posting_failed`; no auto-reverse.
4. Manual retry / reconciliation deferred to ops runbook.

## System Accounts

Seeded via `seed-ledger-accounts.ts`:

- `PAYMENT_GATEWAY_RECEIVABLE`
- `VENDOR_PAYABLE`
- `DELIVERY_PARTNER_PAYABLE`
- `PLATFORM_FEE_REVENUE`
- `DELIVERY_FEE_REVENUE`
- `COMMISSION_REVENUE`
- `TAX_PAYABLE`
- `REFUND_PAYABLE`
- `DISCOUNT_EXPENSE`
- `MANUAL_ADJUSTMENT`

## Out Of Scope (Module 3)

- Order Revenue Posting
- Refund Backend runtime posting
- PostgreSQL ledger
- Settlements / earnings UI
