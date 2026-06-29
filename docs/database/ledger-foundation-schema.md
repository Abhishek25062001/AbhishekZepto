# Ledger Foundation Database Schema

**Module:** 3 — Ledger Foundation  
**Database:** MongoDB (Module 1 MongoDB-first decision)

## Collections

### `ledger_accounts`

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Primary key |
| `accountCode` | string | Unique (partial: `isDeleted=false`), uppercase snake |
| `accountName` | string | Display name |
| `accountType` | enum | asset, liability, income, expense, equity, contra_asset, contra_income |
| `accountCategory` | enum | cash_bank, payment_gateway_receivable, vendor_payable, etc. |
| `currency` | string | Default `INR` |
| `description` | string | Optional |
| `isSystemAccount` | boolean | Default false; true for seeded accounts |
| `isPostingAllowed` | boolean | Default true |
| `parentAccountId` | ObjectId | Optional hierarchy |
| `status` | enum | active, inactive, archived |
| `isDeleted` | boolean | Soft delete |
| `deletedAt` | Date | Archive timestamp |
| `createdBy` / `updatedBy` | ObjectId | Admin actor refs |
| `createdAt` / `updatedAt` | Date | Timestamps |

**Indexes:** accountCode (partial unique), accountType, accountCategory, currency, status, isSystemAccount, parentAccountId, createdAt

### `ledger_journal_entries`

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Primary key |
| `journalCode` | string | Unique, format `JRN-YYYYMMDD-000001` |
| `sourceType` | enum | payment, refund, order, manual_adjustment, system_reversal, etc. |
| `sourceId` | ObjectId | Source record id |
| `sourceCode` | string | Human-readable source ref |
| `postingType` | enum | payment_received, reversal, placeholders |
| `idempotencyKey` | string | Unique; e.g. `payment:{id}:payment_received` |
| `currency` | string | Default INR |
| `totalDebit` | number | Paise/minor units |
| `totalCredit` | number | Must equal totalDebit when posted |
| `status` | enum | draft, posted, reversed, voided |
| `reversalOfJournalId` | ObjectId | Reversal journal links to original |
| `reversedByJournalId` | ObjectId | Original links to reversal |
| `postedBy` / `postedAt` | ObjectId / Date | Post actor |
| `reversedBy` / `reversedAt` | ObjectId / Date | Reverse actor |
| `metadata` | Mixed | Sanitized business context |
| `createdAt` / `updatedAt` | Date | Timestamps |

**Indexes:** journalCode (unique), idempotencyKey (unique), sourceType, sourceId, postingType, status, postedAt, reversalOfJournalId, createdAt

### `ledger_transaction_lines`

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Primary key |
| `journalEntryId` | ObjectId | Parent journal |
| `journalCode` | string | Denormalized |
| `accountId` | ObjectId | Ledger account |
| `accountCode` | string | Denormalized |
| `accountType` | string | Denormalized |
| `debitAmount` | number | Default 0; XOR with credit |
| `creditAmount` | number | Default 0 |
| `currency` | string | Default INR |
| `description` | string | Line memo |
| `sourceType` / `sourceId` | enum / ObjectId | Copied from journal |
| `postingType` | string | Copied from journal |
| `lineMetadata` | Mixed | Optional |
| `createdAt` / `updatedAt` | Date | Timestamps |

**Validation:** Each line: debit XOR credit > 0; amounts non-negative.

**Indexes:** journalEntryId, accountId, accountCode, sourceType, sourceId, postingType, createdAt

## Payment Metadata Extension

| Field | Location | Purpose |
|-------|----------|---------|
| `ledgerJournalId` | `payments.metadata` | Posted journal ref |
| `ledgerPostedAt` | `payments.metadata` | Posting timestamp |

## Immutability Rules

- Posted journals and lines are insert-only after posting.
- Reversal creates new journal + lines with swapped amounts.
- No hard delete on posted data.

## Balancing

Posted journal: `sum(line.debitAmount) = sum(line.creditAmount) = totalDebit = totalCredit`

## Related

- `docs/contracts/ledger-foundation-api.md`
- `docs/architecture/ledger-foundation.md`
