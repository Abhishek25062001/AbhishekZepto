# Ledger Foundation API Contract

**Module:** 3 — Ledger Foundation  
**Base path:** `/api/v1/admin/finance/ledger`  
**Envelope:** `project-context/API_STANDARDS.md`

## Permissions

| Permission | Routes |
|------------|--------|
| `finance:ledger:read` | GET accounts, journals, lines |
| `finance:ledger:manage_accounts` | POST/PATCH/DELETE accounts |
| `finance:ledger:reverse` | POST journal reverse |
| `finance:ledger:manual_adjustment` | Reserved (not exposed in Module 3) |

## Account Endpoints

### POST `/accounts`

Create ledger account.

**Body:** `accountCode`, `accountName`, `accountType`, `accountCategory` (required); optional `currency`, `description`, `isPostingAllowed`, `parentAccountId`.

**Response:** `LedgerAccountResponse`

**Errors:** `VALIDATION_ERROR`, `LEDGER_ACCOUNT_CODE_ALREADY_EXISTS`, `LEDGER_PARENT_ACCOUNT_NOT_FOUND`

### GET `/accounts`

List accounts with pagination and filters (`accountType`, `accountCategory`, `status`, `search`).

**Response:** `{ accounts, pagination }`

### GET `/accounts/:accountId`

**Response:** `LedgerAccountResponse`  
**Errors:** `LEDGER_ACCOUNT_NOT_FOUND`

### PATCH `/accounts/:accountId`

Update `accountName`, `description`, `status`, `isPostingAllowed`, `parentAccountId`. Protected fields blocked.

**Errors:** `LEDGER_ACCOUNT_PROTECTED_FIELD`, `LEDGER_ACCOUNT_NOT_FOUND`

### DELETE `/accounts/:accountId`

Archive account (soft delete). Blocked if posted lines exist.

**Errors:** `LEDGER_ACCOUNT_HAS_POSTED_LINES`, `LEDGER_ACCOUNT_NOT_FOUND`

### GET `/accounts/:accountId/lines`

List transaction lines with balance summary.

**Response:** `{ lines, balance, pagination }`

## Journal Endpoints

### GET `/journals`

List journals with filters (`sourceType`, `postingType`, `status`, `dateFrom`, `dateTo`).

### GET `/journals/:journalId`

Journal detail with nested lines.

**Errors:** `LEDGER_JOURNAL_NOT_FOUND`

### POST `/journals/:journalId/reverse`

**Body:** `reason` (required string)

**Response:** Reversal journal

**Errors:** `LEDGER_JOURNAL_NOT_REVERSIBLE`, `LEDGER_JOURNAL_ALREADY_REVERSED`

## Internal Posting (No Public Endpoint)

`payment_received` posting is triggered by:

- `POST /api/v1/customer/payments/:paymentId/verify`
- `POST /api/v1/public/webhooks/payments/razorpay`

Idempotency key: `payment:{paymentId}:payment_received`

## Error Codes

See `docs/errors/phase-9-finance-error-codes.md` and `LEDGER_*` codes in `error-codes.ts`.

## Related

- `docs/database/ledger-foundation-schema.md`
- `packages/shared/api/finance/ledger.types.ts`
