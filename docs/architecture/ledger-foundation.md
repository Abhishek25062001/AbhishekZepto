# Ledger Foundation Architecture

**Phase:** 9 — Payments, Refunds & Settlements  
**Module:** 3 — Ledger Foundation  
**Status:** IMPLEMENTED

## Purpose

The ledger records immutable debit/credit journal lines for all financial movements. Operational records (`payments`, future `refund_records`, settlements) hold business state; the ledger holds accounting movement state.

## Source Of Truth

| Layer | Responsibility |
|-------|----------------|
| `payments` | Payment lifecycle, gateway refs, customer scope |
| `ledger_journal_entries` + `ledger_transaction_lines` | Posted accounting movements |
| `orders` finance fields | Order-level payment/refund summary (Module 2+) |

Payment success does not depend on ledger posting success. Ledger failures are audited and retried manually (automated retry deferred).

## Immutability

- Posted journal entries are never updated or deleted.
- Corrections use reversal journals that swap debit/credit amounts.
- Original journal status moves to `reversed`; reversal journal links via `reversalOfJournalId` / `reversedByJournalId`.

## Double-Entry Rule

Every posted journal must satisfy:

```text
totalDebit = totalCredit
```

Each line has either `debitAmount > 0` or `creditAmount > 0`, never both. Draft journals are validated before posting.

## Collections

| Collection | Role |
|------------|------|
| `ledger_accounts` | Chart of accounts (system + admin-created) |
| `ledger_journal_entries` | Journal header (source, posting type, totals, status) |
| `ledger_transaction_lines` | Individual debit/credit lines |

## First-Launch Posting Flows

| Posting type | Module 3 status | Trigger |
|--------------|-----------------|---------|
| `payment_received` | **IMPLEMENTED** | Customer verify + Razorpay webhook |
| `refund_approved` | Placeholder | Refund Backend |
| `refund_processed` | Placeholder | Refund Backend |
| `vendor_settlement_*` | Placeholder | Settlements module |
| `delivery_earning_*` | Placeholder | Earnings module |
| `reversal` | **IMPLEMENTED** | Admin reverse journal API |

## Payment Linkage

On successful `payment_received` posting:

- `payments.metadata.ledgerJournalId` — posted journal ObjectId
- `payments.metadata.ledgerPostedAt` — ISO timestamp
- Idempotency key: `payment:{paymentId}:payment_received`

## Related Documents

- `docs/architecture/phase-9-financial-architecture-foundation.md`
- `docs/architecture/phase-9-ledger-migration-strategy.md`
- `docs/database/ledger-foundation-schema.md`
- `docs/contracts/ledger-foundation-api.md`
