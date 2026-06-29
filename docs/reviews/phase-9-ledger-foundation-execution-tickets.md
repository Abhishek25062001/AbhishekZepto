# Phase 9 Ledger Foundation — CODEX Execution Tickets

**Phase:** Phase 9 — Payments, Refunds & Settlements  
**Module:** 3 — Ledger Foundation  
**Status:** COMPLETE

## Sources

- `projectin micro/docone/AllPhase&Modules.pdf` — Phase 9 module order
- `projectin micro/docsix/PhaesDetail9.pdf` — Module 3 Ledger Foundation micro-tasks
- Phase 9 Module 1 foundation docs (`docs/architecture/phase-9-*`, `docs/errors/phase-9-finance-error-codes.md`)
- Phase 9 Module 2 handoff (`docs/handoffs/phase-9-payment-records-backend-complete.md`)

## Prerequisites

- Phase 9 Module 1 — Financial Architecture Foundation **COMPLETE**
- Phase 9 Module 2 — Payment Records Backend **COMPLETE**
- Phase 4 payment gateway + Phase 5 orders available for payment posting integration

## Scope Rules

- Implement Module 3 ledger foundation per PDF micro-tasks and Module 1 MongoDB-first finance architecture.
- **Do not** start Repository & Codebase Setup (Phase 1 Module 2).
- **Do not** implement Order Revenue Posting, Refund Backend, settlements, earnings, or finance UI (later modules).
- **Do not** add PostgreSQL double-entry ledger or accounting export (deferred per `KNOWN_DECISIONS.md`).
- **Do not** add features outside Module 3 ticket scope.
- First tickets (1–5) are **docs/foundation only**; runtime tickets (6+) start only after Ticket 5 gate.
- Ledger posting integration in Module 3 is limited to **`payment_received`** from customer verify + Razorpay webhook; refund/settlement/earning posting rules are **placeholders only**.

## Module 2 vs PDF Alignment (baseline)

| PDF / Module 1 planned | Current repo (Module 2) | Module 3 action |
|------------------------|-------------------------|-----------------|
| `modules/finance/payments/*` | `modules/payment/*` | Integrate posting into existing payment services |
| `modules/finance/ledger/*` | not implemented | Create new ledger module tree |
| `payment_records.metadata.ledgerJournalId` | `payments.metadata` | Store journal refs in payment metadata |
| Admin finance mount | `/api/v1/admin/finance/payments` | Add `/api/v1/admin/finance/ledger/*` |

## Ticket List

| Ticket | Objective | Status | Depends on |
|--------|-----------|--------|------------|
| 1 | Module 3 boundary and source alignment | DONE | Module 2 complete |
| 2 | Ledger foundation architecture document | DONE | 1 |
| 3 | Ledger module migration and alignment strategy | DONE | 2 |
| 4 | Ledger backend implementation alignment | DONE | 3 |
| 5 | Ledger API contract and database schema docs | DONE | 2, 3 |
| 6 | Ledger module scaffold and exports | DONE | 5 |
| 7 | Ledger account and journal constants | DONE | 6 |
| 8 | Ledger error codes and error mapper | DONE | 6 |
| 9 | Ledger audit constants and sanitizer | DONE | 6 |
| 10 | Ledger account model and indexes | DONE | 3, 6, 7 |
| 11 | Ledger journal entry model and indexes | DONE | 10 |
| 12 | Ledger transaction line model and indexes | DONE | 11 |
| 13 | Ledger TypeScript types | DONE | 10–12 |
| 14 | Ledger response mappers | DONE | 13 |
| 15 | Ledger account repository | DONE | 10, 13 |
| 16 | Ledger journal repository | DONE | 11, 12, 13 |
| 17 | Ledger account and journal validators | DONE | 13 |
| 18 | Ledger account service — create | DONE | 8, 9, 14, 15 |
| 19 | Ledger account service — list and get | DONE | 18 |
| 20 | Ledger account service — update and archive | DONE | 18 |
| 21 | Ledger journal service — draft journal | DONE | 8, 9, 15, 16 |
| 22 | Ledger journal service — post and createAndPost | DONE | 21 |
| 23 | Ledger journal service — reverse, list, and get | DONE | 22 |
| 24 | Ledger line service — list lines and balance | DONE | 16, 19 |
| 25 | Ledger posting rule service | DONE | 7, 13 |
| 26 | Ledger posting service — payment_received | DONE | 22, 25 |
| 27 | Payment verify ledger integration | DONE | 26 |
| 28 | Razorpay webhook ledger integration | DONE | 26, 27 |
| 29 | Ledger HTTP controllers | DONE | 19, 20, 23, 24 |
| 30 | Ledger admin routes and mount | DONE | 17, 29 |
| 31 | Ledger permissions seed | DONE | 30 |
| 32 | System ledger account seed | DONE | 10 |
| 33 | Shared ledger API types | DONE | 13, 14 |
| 34 | OpenAPI ledger paths | DONE | 29, 30 |
| 35 | Route registry and contract doc updates | DONE | 30, 34 |
| 36 | Ledger journal service unit tests | DONE | 21–23 |
| 37 | Ledger account service unit tests | DONE | 18–20 |
| 38 | Ledger admin route tests | DONE | 30 |
| 39 | Ledger payment integration tests | DONE | 27–28, 32 |
| 40 | Ledger audit and seed tests | DONE | 31–32 |
| 41 | Module 3 validation runbook and smoke checklist | DONE | 36–40 |
| 42 | Module 3 review and handoff | DONE | 41 |

## Module 3 Boundary

Module 3 owns:

- MongoDB ledger collections: `ledger_accounts`, `ledger_journal_entries`, `ledger_transaction_lines`
- double-entry journal posting rules (immutable posted entries; reversal-only corrections)
- admin ledger account CRUD and journal read/reverse APIs
- system ledger account seed
- `payment_received` automated posting from payment verify + webhook (idempotent)
- ledger permissions, audit events, OpenAPI, tests, smoke checklist, handoff

Module 3 defers:

- Order Revenue Posting module
- Refund Backend runtime posting (`refund_approved`, `refund_processed` — placeholder methods only)
- Vendor settlement and delivery earning posting (placeholder methods only)
- Customer/vendor/delivery ledger API access
- Manual adjustment admin UI
- PostgreSQL ledger / GST / wallet / bank payout

---

## Ticket 1 — Module 3 boundary and source alignment

**Ticket:** 1 — Module 3 boundary and source alignment

**Objective:** Confirm Module 3 scope against PDF micro-tasks; update Phase 9 handoff to Module 3 in progress.

**Files to create/update:**
- `docs/reviews/phase-9-ledger-foundation-execution-tickets.md` (this file — boundary section)
- `project-context/PHASE_HANDOFFS/PHASE_9_HANDOFF.md` (update — Module 3 started)

**API endpoints:** None (planning only).

**DB fields:** None.

**Implementation steps:**
1. Record Module 3 PDF task groups: scaffold, constants, models, repos, validators, services, posting rules, payment integration, admin routes, permissions, seeds, shared types, OpenAPI, tests, review.
2. List in-scope admin endpoints under `/api/v1/admin/finance/ledger/*`.
3. Explicitly exclude Order Revenue Posting, Refund Backend, settlements, earnings UI.
4. Note MongoDB-first ledger (not PostgreSQL) per Module 1.
5. Confirm Repository & Codebase Setup not in scope.

**Acceptance criteria:**
- Module 3 boundary documented; handoff shows Module 3 in progress.
- No runtime code changes in Ticket 1.

**Test commands:**
```bash
test -f docs/reviews/phase-9-ledger-foundation-execution-tickets.md && \
grep -q "Module 3 Boundary" docs/reviews/phase-9-ledger-foundation-execution-tickets.md && \
grep -q "Module 3" project-context/PHASE_HANDOFFS/PHASE_9_HANDOFF.md && echo PASS
```

**Depends on:** Phase 9 Module 2 complete.

---

## Ticket 2 — Ledger foundation architecture document

**Ticket:** 2 — Ledger foundation architecture document

**Objective:** Create ledger architecture doc defining purpose, immutability, double-entry rules, and first-launch posting flows.

**Files to create/update:**
- `docs/architecture/ledger-foundation.md` (create)

**API endpoints:** Document planned admin ledger routes only (no implementation).

**DB fields:** Document collections `ledger_accounts`, `ledger_journal_entries`, `ledger_transaction_lines` and relationship to `payments`/`orders`.

**Implementation steps:**
1. Define ledger purpose: immutable debit/credit journal lines for all financial movements.
2. Define source-of-truth rule: operational records (`payments`, `refund_records`, etc.) hold business state; ledger holds accounting movement state.
3. Define immutability rule: posted entries never updated/deleted; corrections via reversal journals.
4. Define double-entry rule: `totalDebit = totalCredit` on posted journals.
5. List first-launch posting flows: `payment_received`, placeholders for refund/settlement/earning.
6. Cross-link `docs/architecture/phase-9-financial-architecture-foundation.md`.

**Acceptance criteria:**
- Architecture doc exists with immutability, double-entry, and posting flow sections.
- No `.ts` files created in Ticket 2.

**Test commands:**
```bash
test -f docs/architecture/ledger-foundation.md && \
grep -q "totalDebit" docs/architecture/ledger-foundation.md && \
grep -q "reversal" docs/architecture/ledger-foundation.md && echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Ledger module migration and alignment strategy

**Ticket:** 3 — Ledger module migration and alignment strategy

**Objective:** Decide ledger module path and payment integration touchpoints before runtime work.

**Files to create/update:**
- `docs/architecture/phase-9-ledger-migration-strategy.md` (create)

**API endpoints:** Document route mount plan:
- `GET/POST/PATCH/DELETE /api/v1/admin/finance/ledger/accounts*`
- `GET /api/v1/admin/finance/ledger/journals*`
- `POST /api/v1/admin/finance/ledger/journals/:journalId/reverse`
- `GET /api/v1/admin/finance/ledger/accounts/:accountId/lines`

**DB fields:** Document payment metadata fields for journal linkage:
- `payments.metadata.ledgerJournalId`
- `payments.metadata.ledgerPostedAt`

**Implementation steps:**
1. Confirm new tree: `backend/api/src/modules/finance/ledger/` (per PDF).
2. Confirm payment integration files: `modules/payment/services/payment.service.ts`, `payment-webhook.service.ts` (not duplicate finance/payments tree).
3. Document idempotency key format: `payment:{paymentId}:payment_received`.
4. Document failure behavior: payment stays paid if ledger posting fails; audit + retry TODO.
5. Mark decision `NEEDS VERIFICATION` if PDF path conflicts with Module 2 payment module location.

**Acceptance criteria:**
- Migration strategy doc exists with module path and payment integration file list.
- No Mongoose models in Ticket 3.

**Test commands:**
```bash
test -f docs/architecture/phase-9-ledger-migration-strategy.md && \
grep -q "modules/finance/ledger" docs/architecture/phase-9-ledger-migration-strategy.md && echo PASS
```

**Depends on:** Ticket 2.

---

## Ticket 4 — Ledger backend implementation alignment

**Ticket:** 4 — Ledger backend implementation alignment

**Objective:** Document file-level implementation map from PDF micro-tasks to repo paths.

**Files to create/update:**
- `docs/architecture/phase-9-ledger-backend-alignment.md` (create)

**API endpoints:** None.

**DB fields:** Map schema fields to planned model file paths.

**Implementation steps:**
1. Table: PDF path → chosen repo path for all ledger files.
2. List payment integration files to extend (verify + webhook).
3. Reference `phase-9-financial-backend-file-structure.md` ledger subtree.
4. Define ticket execution order for Tickets 6–42.
5. Note reuse of `payment-amount.util.ts` for ledger money validation where applicable.

**Acceptance criteria:**
- Alignment doc lists all Module 3 runtime files with create/extend action.
- No `.ts` files created in Ticket 4.

**Test commands:**
```bash
test -f docs/architecture/phase-9-ledger-backend-alignment.md && \
grep -q "ledger-account.model" docs/architecture/phase-9-ledger-backend-alignment.md && echo PASS
```

**Depends on:** Ticket 3.

---

## Ticket 5 — Ledger API contract and database schema docs

**Ticket:** 5 — Ledger API contract and database schema docs

**Objective:** Create detailed ledger API contract and database schema documentation for implementation and tests.

**Files to create/update:**
- `docs/contracts/ledger-foundation-api.md` (create)
- `docs/database/ledger-foundation-schema.md` (create)

**API endpoints:** Document request/response/error for:
- `POST /api/v1/admin/finance/ledger/accounts`
- `GET /api/v1/admin/finance/ledger/accounts`
- `GET /api/v1/admin/finance/ledger/accounts/:accountId`
- `PATCH /api/v1/admin/finance/ledger/accounts/:accountId`
- `DELETE /api/v1/admin/finance/ledger/accounts/:accountId`
- `GET /api/v1/admin/finance/ledger/journals`
- `GET /api/v1/admin/finance/ledger/journals/:journalId`
- `POST /api/v1/admin/finance/ledger/journals/:journalId/reverse`
- `GET /api/v1/admin/finance/ledger/accounts/:accountId/lines`

**DB fields:** Full field lists for:
- `ledger_accounts.*`
- `ledger_journal_entries.*`
- `ledger_transaction_lines.*`

**Implementation steps:**
1. Request/response envelopes per `API_STANDARDS.md`.
2. Permission gates: `finance:ledger:read`, `finance:ledger:manage_accounts`, `finance:ledger:reverse`.
3. Error codes cross-ref ledger codes in Ticket 8 (planned list from PDF).
4. Schema doc: immutability, reversal linkage, idempotency, balancing rules.
5. Document internal-only posting flows (no public manual journal create endpoint in Module 3).

**Acceptance criteria:**
- Contract and schema docs cover all Module 3 ledger endpoints and collections.
- No route/controller code in Ticket 5.

**Test commands:**
```bash
test -f docs/contracts/ledger-foundation-api.md && \
test -f docs/database/ledger-foundation-schema.md && \
grep -q "admin/finance/ledger" docs/contracts/ledger-foundation-api.md && echo PASS
```

**Depends on:** Tickets 2, 3.

---

## Ticket 6 — Ledger module scaffold and exports

**Ticket:** 6 — Ledger module scaffold and exports

**Objective:** Create ledger module folder scaffold and barrel exports per Ticket 3 decision.

**Files to create/update:**
- `backend/api/src/modules/finance/ledger/index.ts` (create)
- Subfolders: `constants/`, `controllers/`, `models/`, `repositories/`, `routes/`, `services/`, `types/`, `utils/`, `validators/`, `__tests__/`

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Create folder tree under `modules/finance/ledger/`.
2. Add index exports for planned public module surface (stub exports if needed for typecheck).
3. Do not implement business logic in scaffold ticket.
4. Do not wire routes to app router yet.

**Acceptance criteria:**
- Folder scaffold matches alignment doc.
- Typecheck passes with stub exports only if needed.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 5.

---

## Ticket 7 — Ledger account and journal constants

**Ticket:** 7 — Ledger account and journal constants

**Objective:** Implement ledger account, journal, source, and posting type constant files per PDF.

**Files to create/update:**
- `constants/ledger-account-type.constant.ts`
- `constants/ledger-account-status.constant.ts`
- `constants/ledger-account-category.constant.ts`
- `constants/ledger-journal-status.constant.ts`
- `constants/ledger-source-type.constant.ts`
- `constants/ledger-posting-type.constant.ts`

**API endpoints:** Constants used by all ledger admin and internal posting endpoints.

**DB fields:** `ledger_accounts.accountType`, `accountCategory`, `status`; `ledger_journal_entries.status`, `sourceType`, `postingType`.

**Implementation steps:**
1. Account types: asset, liability, income, expense, equity, contra_asset, contra_income.
2. Account categories per PDF (cash_bank, payment_gateway_receivable, vendor_payable, etc.).
3. Journal status: draft, posted, reversed, voided.
4. Source types: payment, refund, order, vendor_settlement, delivery_earning, manual_adjustment, system_reversal.
5. Posting types: payment_received, refund_* placeholders, vendor/delivery placeholders, reversal.

**Acceptance criteria:**
- Constants compile; values match Ticket 5 schema doc.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 6.

---

## Ticket 8 — Ledger error codes and error mapper

**Ticket:** 8 — Ledger error codes and error mapper

**Objective:** Add ledger error codes and HTTP error mapper per PDF.

**Files to create/update:**
- `constants/ledger-error-codes.constant.ts`
- `utils/ledger-error.mapper.ts`
- `backend/api/src/errors/error-codes.ts` (extend)

**API endpoints:** Map codes to all `/api/v1/admin/finance/ledger/*` endpoints.

**DB fields:** None.

**Implementation steps:**
1. Add PDF ledger error codes (account not found, code exists, journal not balanced, idempotency conflict, etc.).
2. Map to HTTP status per PDF (404, 409, 400, 500).
3. Extend global `ERROR_CODES` registry.
4. Cross-link `docs/errors/phase-9-finance-error-codes.md` (add ledger section note if needed).

**Acceptance criteria:**
- Error mapper unit tests or typecheck pass.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 6.

---

## Ticket 9 — Ledger audit constants and sanitizer

**Ticket:** 9 — Ledger audit constants and sanitizer

**Objective:** Add ledger audit event constants and sanitizer utility per PDF.

**Files to create/update:**
- `constants/ledger-audit-events.constant.ts`
- `utils/ledger-audit-sanitizer.util.ts`

**API endpoints:** All ledger write endpoints and internal posting flows.

**DB fields:** `audit_logs.metadata` fields only.

**Implementation steps:**
1. Add events: `finance.ledger_account_created`, `finance.ledger_account_updated`, `finance.ledger_account_archived`, `finance.ledger_journal_drafted`, `finance.ledger_journal_posted`, `finance.ledger_journal_reversed`, `finance.ledger_posting_failed`, `finance.ledger_posting_rule_applied`.
2. Sanitizer strips: authorization, tokens, secrets, gatewaySignature, webhookSecret, rawWebhookPayload, bank/UPI fields.
3. Document planned write points in service tickets.

**Acceptance criteria:**
- Sanitizer unit tests prove forbidden fields removed.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-audit-sanitizer 2>/dev/null || npm run typecheck -w backend/api
```

**Depends on:** Ticket 6.

---

## Ticket 10 — Ledger account model and indexes

**Ticket:** 10 — Ledger account model and indexes

**Objective:** Implement Mongoose model for `ledger_accounts` with indexes per PDF.

**Files to create/update:**
- `models/ledger-account.model.ts`
- `backend/api/src/database/constants/collection-names.constants.ts` (add `LEDGER_ACCOUNTS` if missing)

**API endpoints:** None.

**DB fields:** Implement `ledger_accounts.*` including: `accountCode`, `accountName`, `accountType`, `accountCategory`, `currency` (default INR), `isSystemAccount`, `isPostingAllowed`, `parentAccountId`, `status`, soft-delete fields, audit actor fields, timestamps.

**Implementation steps:**
1. Partial unique index on `accountCode` where `isDeleted = false`.
2. Indexes on accountType, accountCategory, currency, status, isSystemAccount, parentAccountId, createdAt.
3. Defaults: `currency=INR`, `isSystemAccount=false`, `isPostingAllowed=true`, `status=active`.

**Acceptance criteria:**
- Model compiles; indexes declared per Ticket 5 schema doc.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 3, 6, 7.

---

## Ticket 11 — Ledger journal entry model and indexes

**Ticket:** 11 — Ledger journal entry model and indexes

**Objective:** Implement Mongoose model for `ledger_journal_entries` with indexes per PDF.

**Files to create/update:**
- `models/ledger-journal-entry.model.ts`

**API endpoints:** None.

**DB fields:** `journalCode`, `sourceType`, `sourceId`, `sourceCode`, `postingType`, `idempotencyKey`, `currency`, `totalDebit`, `totalCredit`, `status`, reversal linkage fields, posted/reversed actor fields, metadata, timestamps.

**Implementation steps:**
1. Unique indexes on `journalCode` and `idempotencyKey`.
2. Indexes on sourceType, sourceId, postingType, status, postedAt, createdAt, reversalOfJournalId.
3. Defaults: `currency=INR`, `status=draft`.

**Acceptance criteria:**
- Model compiles; indexes match schema doc.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 10.

---

## Ticket 12 — Ledger transaction line model and indexes

**Ticket:** 12 — Ledger transaction line model and indexes

**Objective:** Implement Mongoose model for `ledger_transaction_lines` with validation rules per PDF.

**Files to create/update:**
- `models/ledger-transaction-line.model.ts`

**API endpoints:** None.

**DB fields:** `journalEntryId`, `journalCode`, `accountId`, `accountCode`, `accountType`, `debitAmount`, `creditAmount`, `currency`, `description`, `sourceType`, `sourceId`, `postingType`, `lineMetadata`, timestamps.

**Implementation steps:**
1. Validation: each line has debit XOR credit > 0; amounts non-negative.
2. Indexes on journalEntryId, accountId, accountCode, sourceType, sourceId, postingType, createdAt.
3. Defaults: `debitAmount=0`, `creditAmount=0`.

**Acceptance criteria:**
- Model compiles with schema validators.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 11.

---

## Ticket 13 — Ledger TypeScript types

**Ticket:** 13 — Ledger TypeScript types

**Objective:** Add TypeScript types for ledger domain inputs, queries, posting context, and responses.

**Files to create/update:**
- `types/ledger.types.ts`

**API endpoints:** Types for all Module 3 ledger endpoints and internal posting services.

**DB fields:** Typed interfaces matching models.

**Implementation steps:**
1. Account types: enums + `CreateLedgerAccountInput`, `UpdateLedgerAccountInput`, `LedgerAccountListQuery`.
2. Journal types: `CreateJournalEntryInput`, `CreateLedgerLineInput`, `PostJournalInput`, `ReverseJournalInput`, `LedgerJournalListQuery`.
3. Posting types: `LedgerPostingRule`, `LedgerPostingContext`, `LedgerPostingResult`, `LedgerIdempotencyInput`.
4. Response types: `LedgerAccountResponse`, `LedgerJournalResponse`, `LedgerTransactionLineResponse`, `LedgerTrialBalanceResponse`.

**Acceptance criteria:**
- Types compile without circular deps.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 10–12.

---

## Ticket 14 — Ledger response mappers

**Ticket:** 14 — Ledger response mappers

**Objective:** Implement ledger account and journal response mappers with sensitive field exclusion.

**Files to create/update:**
- `utils/ledger-account-response.mapper.ts`
- `utils/ledger-journal-response.mapper.ts`

**API endpoints:**
- All admin ledger account and journal GET endpoints

**DB fields:** Map account/journal/line fields; exclude internal fields (`isDeleted`, `deletedAt`, `createdBy`, `updatedBy`, `__v`).

**Implementation steps:**
1. Account mapper: id, accountCode, accountName, accountType, accountCategory, currency, flags, status, timestamps.
2. Journal mapper: journal fields + nested lines array; sanitize metadata via audit sanitizer.
3. Add mapper unit tests for field exclusion.

**Acceptance criteria:**
- Mapper tests prove internal/sensitive fields omitted from admin responses.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-account-response 2>/dev/null || npm run typecheck -w backend/api
```

**Depends on:** Ticket 13.

---

## Ticket 15 — Ledger account repository

**Ticket:** 15 — Ledger account repository

**Objective:** Implement ledger account repository CRUD and list methods per PDF.

**Files to create/update:**
- `repositories/ledger-account.repository.ts`

**API endpoints:** Supports admin account endpoints.

**DB fields:** `_id`, `accountCode`, `accountType`, `accountCategory`, `status`, `isDeleted`, `parentAccountId`.

**Implementation steps:**
1. Methods: `createLedgerAccount`, `findLedgerAccountById`, `findLedgerAccountByCode`, `updateLedgerAccountById`, `archiveLedgerAccountById`, `listLedgerAccounts`.
2. Filters: accountType, accountCategory, currency, status, isSystemAccount, isPostingAllowed, parentAccountId, search.
3. Method: `countPostedLinesByAccountId` via `ledger_transaction_lines`.
4. Pagination metadata per API standards.

**Acceptance criteria:**
- Repository methods covered by unit tests with mocked model.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-account.repository 2>/dev/null || npm run typecheck -w backend/api
```

**Depends on:** Tickets 10, 13.

---

## Ticket 16 — Ledger journal repository

**Ticket:** 16 — Ledger journal repository

**Objective:** Implement journal and transaction line repository methods per PDF.

**Files to create/update:**
- `repositories/ledger-journal.repository.ts`

**API endpoints:** Supports journal list/detail/reverse and account lines endpoints.

**DB fields:** Journal and line fields for lookup, idempotency, source dedupe, pagination.

**Implementation steps:**
1. Methods: `createJournalEntry`, `createTransactionLines`, `findJournalById`, `findJournalByCode`, `findJournalByIdempotencyKey`, `findJournalBySource`, `updateJournalStatus`, `listJournals`, `listLinesByJournalId`, `listLinesByAccountId`.
2. List filters: sourceType, sourceId, postingType, status, dateFrom, dateTo, search.
3. Default sort: journals `createdAt desc`; accounts list `accountCode asc`.

**Acceptance criteria:**
- Repository unit tests for idempotency lookup and line listing.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-journal.repository 2>/dev/null || npm run typecheck -w backend/api
```

**Depends on:** Tickets 11, 12, 13.

---

## Ticket 17 — Ledger account and journal validators

**Ticket:** 17 — Ledger account and journal validators

**Objective:** Add Zod validators for ledger account and journal admin endpoints.

**Files to create/update:**
- `validators/ledger-account.validator.ts`
- `validators/ledger-journal.validator.ts`

**API endpoints:**
- `POST /api/v1/admin/finance/ledger/accounts`
- `PATCH /api/v1/admin/finance/ledger/accounts/:accountId`
- `GET /api/v1/admin/finance/ledger/accounts`
- `GET /api/v1/admin/finance/ledger/journals`
- `GET /api/v1/admin/finance/ledger/journals/:journalId`
- `POST /api/v1/admin/finance/ledger/journals/:journalId/reverse`
- `GET /api/v1/admin/finance/ledger/accounts/:accountId/lines`

**DB fields:** Validation aligns with Ticket 5 contract.

**Implementation steps:**
1. Create account: accountCode, accountName, accountType, accountCategory required; optional currency, flags, parentAccountId.
2. Update account: block protected fields (accountCode, accountType, accountCategory, currency, isSystemAccount).
3. Reverse journal: journalId param + reason required string.
4. List query validators with pagination and filter enums.

**Acceptance criteria:**
- Validator tests for invalid payloads return `VALIDATION_ERROR`.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-account.validator 2>/dev/null || npm run typecheck -w backend/api
```

**Depends on:** Ticket 13.

---

## Ticket 18 — Ledger account service — create

**Ticket:** 18 — Ledger account service — create

**Objective:** Implement `createLedgerAccount` with code normalization, duplicate guard, parent validation, audit write.

**Files to create/update:**
- `services/ledger-account.service.ts` (create)

**API endpoints:**
- `POST /api/v1/admin/finance/ledger/accounts`

**DB fields:** Write `ledger_accounts.*`; set `createdBy`.

**Implementation steps:**
1. Normalize `accountCode` to uppercase snake-case.
2. Block duplicate accountCode.
3. Validate parent account exists and is active when provided.
4. Audit `finance.ledger_account_created`.
5. Return mapped account response.

**Acceptance criteria:**
- Service unit test: create success, duplicate code blocked, parent validation.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-account.service
```

**Depends on:** Tickets 8, 9, 14, 15.

---

## Ticket 19 — Ledger account service — list and get

**Ticket:** 19 — Ledger account service — list and get

**Objective:** Implement `listLedgerAccounts` and `getLedgerAccountById` with permission checks.

**Files to create/update:**
- Extend `services/ledger-account.service.ts`

**API endpoints:**
- `GET /api/v1/admin/finance/ledger/accounts`
- `GET /api/v1/admin/finance/ledger/accounts/:accountId`

**DB fields:** Read `ledger_accounts.*` with soft-delete exclusion.

**Implementation steps:**
1. Require `finance:ledger:read`.
2. Apply list filters and pagination from validators.
3. Return `LEDGER_ACCOUNT_NOT_FOUND` when missing.

**Acceptance criteria:**
- Service tests for list filters and not-found path.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-account.service
```

**Depends on:** Ticket 18.

---

## Ticket 20 — Ledger account service — update and archive

**Ticket:** 20 — Ledger account service — update and archive

**Objective:** Implement `updateLedgerAccount` and `archiveLedgerAccount` with protected field guards and posted-line check.

**API endpoints:**
- `PATCH /api/v1/admin/finance/ledger/accounts/:accountId`
- `DELETE /api/v1/admin/finance/ledger/accounts/:accountId`

**DB fields:** Update `status`, `isPostingAllowed`, `parentAccountId`, description; archive sets `status=archived`, `isDeleted=true`, `deletedAt`.

**Implementation steps:**
1. Block mutation of protected fields.
2. Block archive if account has posted transaction lines.
3. Audit updated/archived events.
4. Set `updatedBy`.

**Acceptance criteria:**
- Service tests: update success, archive blocked when lines exist.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-account.service
```

**Depends on:** Ticket 18.

---

## Ticket 21 — Ledger journal service — draft journal

**Ticket:** 21 — Ledger journal service — draft journal

**Objective:** Implement `createDraftJournal` with line validation, balance check, journal code generation, idempotency guard.

**Files to create/update:**
- `services/ledger-journal.service.ts` (create)

**API endpoints:** Internal service only (no public manual create endpoint in Module 3 unless explicitly enabled later).

**DB fields:** Create `ledger_journal_entries` (draft) + `ledger_transaction_lines`.

**Implementation steps:**
1. Require at least two lines; each line debit XOR credit.
2. Validate accounts exist, active, `isPostingAllowed=true`.
3. Calculate totals; block if unbalanced.
4. Generate `journalCode` format `JRN-YYYYMMDD-000001`.
5. Block duplicate idempotency key.
6. Audit `finance.ledger_journal_drafted`.

**Acceptance criteria:**
- Unit tests: balanced draft succeeds; unbalanced/no-lines blocked.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-journal.service
```

**Depends on:** Tickets 8, 9, 15, 16.

---

## Ticket 22 — Ledger journal service — post and createAndPost

**Ticket:** 22 — Ledger journal service — post and createAndPost

**Objective:** Implement `postJournal` and `createAndPostJournal` with transaction support and idempotency handling.

**Files to create/update:**
- Extend `services/ledger-journal.service.ts`

**API endpoints:** Internal automated posting only.

**DB fields:** Update journal `status=posted`, `postedBy`, `postedAt`; verify line amounts unchanged.

**Implementation steps:**
1. `postJournal`: block if already posted/reversed/voided; recalculate totals from lines.
2. `createAndPostJournal`: use Mongo session/transaction if available; call draft then post.
3. If idempotency key exists and journal posted, return existing journal.
4. If idempotency key exists and draft, throw `LEDGER_IDEMPOTENCY_KEY_ALREADY_USED`.
5. Audit `finance.ledger_journal_posted`.

**Acceptance criteria:**
- Unit tests: post success, double-post blocked, idempotent return.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-journal.service
```

**Depends on:** Ticket 21.

---

## Ticket 23 — Ledger journal service — reverse, list, and get

**Ticket:** 23 — Ledger journal service — reverse, list, and get

**Objective:** Implement `reverseJournal`, `listJournals`, and `getJournalById` with permission checks.

**API endpoints:**
- `GET /api/v1/admin/finance/ledger/journals`
- `GET /api/v1/admin/finance/ledger/journals/:journalId`
- `POST /api/v1/admin/finance/ledger/journals/:journalId/reverse`

**DB fields:** Reversal linkage: `reversalOfJournalId`, `reversedByJournalId`, `reversedBy`, `reversedAt`; swap debit/credit on reversal lines.

**Implementation steps:**
1. Reverse only posted journals without existing reversal.
2. Create reversal journal with `postingType=reversal`, `sourceType=system_reversal`.
3. Update original journal status to reversed.
4. List/get require `finance:ledger:read`; reverse requires `finance:ledger:reverse`.
5. Audit `finance.ledger_journal_reversed`.

**Acceptance criteria:**
- Unit tests: reversal swaps amounts; list/get/reverse permission paths.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-journal.service
```

**Depends on:** Ticket 22.

---

## Ticket 24 — Ledger line service — list lines and balance

**Ticket:** 24 — Ledger line service — list lines and balance

**Objective:** Implement `listLinesByAccountId` and `calculateAccountBalance` per PDF normal balance rules.

**Files to create/update:**
- `services/ledger-line.service.ts`

**API endpoints:**
- `GET /api/v1/admin/finance/ledger/accounts/:accountId/lines`

**DB fields:** Aggregate `ledger_transaction_lines.debitAmount`, `creditAmount` by accountId.

**Implementation steps:**
1. Verify account exists.
2. List lines with date/source/posting filters and pagination.
3. Balance calculation uses normal balance by account type (asset/expense debit-normal; liability/income credit-normal).
4. Return `{ accountId, debitTotal, creditTotal, balance, currency }`.

**Acceptance criteria:**
- Unit tests for balance calculation by account type.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-line.service 2>/dev/null || npm run typecheck -w backend/api
```

**Depends on:** Tickets 16, 19.

---

## Ticket 25 — Ledger posting rule service

**Ticket:** 25 — Ledger posting rule service

**Objective:** Implement posting rule builders including `buildPaymentReceivedEntry` and placeholder refund/settlement/earning builders.

**Files to create/update:**
- `services/ledger-posting-rule.service.ts`

**API endpoints:** Internal only.

**DB fields:** Read `payments`/`payment_records` amount fields: payableAmount, platformFee, deliveryFee, taxAmount, discountAmount.

**Implementation steps:**
1. `buildPaymentReceivedEntry`: debit `PAYMENT_GATEWAY_RECEIVABLE`; credit vendor payable, platform fee, delivery fee, tax payable portions.
2. Use system account codes from seed (Ticket 32).
3. Placeholder methods: `buildRefundApprovedEntry`, `buildRefundProcessedEntry`, `buildDeliveryEarningAccruedEntry`, `buildVendorSettlementApprovedEntry` — stub only, no runtime callers in Module 3.
4. If vendor portion unknown, document `VENDOR_PAYABLE` placeholder account usage.

**Acceptance criteria:**
- Unit tests for payment_received line generation and balanced totals.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-posting-rule 2>/dev/null || npm run typecheck -w backend/api
```

**Depends on:** Tickets 7, 13.

---

## Ticket 26 — Ledger posting service — payment_received

**Ticket:** 26 — Ledger posting service — payment_received

**Objective:** Implement `postPaymentReceived` with idempotency, rule application, and journal create-and-post.

**Files to create/update:**
- `services/ledger-posting.service.ts`

**API endpoints:** Called internally from payment verify and webhook flows.

**DB fields:** Write journals with `idempotencyKey=payment:{paymentId}:payment_received`, `sourceType=payment`, `postingType=payment_received`.

**Implementation steps:**
1. Block duplicate posting if journal exists for idempotency key.
2. Build lines via posting rule service.
3. Call `createAndPostJournal`.
4. Audit `finance.ledger_posting_rule_applied`.
5. Placeholder stubs: `postRefundProcessed`, `postVendorSettlementApproved`, `postDeliveryEarningAccrued` (no-op or throw not implemented).

**Acceptance criteria:**
- Unit tests: first post creates journal; duplicate returns existing.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-posting.service 2>/dev/null || npm run typecheck -w backend/api
```

**Depends on:** Tickets 22, 25.

---

## Ticket 27 — Payment verify ledger integration

**Ticket:** 27 — Payment verify ledger integration

**Objective:** Call ledger posting after successful payment verify; store journal metadata on payment record.

**Files to create/update:**
- Extend `backend/api/src/modules/payment/services/payment.service.ts`

**API endpoints:**
- `POST /api/v1/customer/payments/:paymentId/verify`
- `POST /api/v1/customer/payments/verify` (legacy)

**DB fields:** Update `payments.metadata.ledgerJournalId`, `payments.metadata.ledgerPostedAt` on success.

**Implementation steps:**
1. After payment marked paid, call `ledgerPostingService.postPaymentReceived`.
2. If posting fails: payment remains paid; audit `finance.ledger_posting_failed`; do not auto-reverse payment.
3. Store journal id in payment metadata when posting succeeds.
4. Extend existing payment service tests for posting hook (mocked).

**Acceptance criteria:**
- Payment service tests verify posting called on successful verify.

**Test commands:**
```bash
npm run test -w backend/api -- payment.service.test
```

**Depends on:** Ticket 26.

---

## Ticket 28 — Razorpay webhook ledger integration

**Ticket:** 28 — Razorpay webhook ledger integration

**Objective:** Call ledger posting from webhook `payment.captured` with idempotency protection vs verify path.

**Files to create/update:**
- Extend `backend/api/src/modules/payment/services/payment-webhook.service.ts`

**API endpoints:**
- `POST /api/v1/public/webhooks/payments/razorpay`
- `POST /api/v1/webhooks/razorpay` (legacy)

**DB fields:** `payments.metadata.ledgerJournalId`, `payments.metadata.ledgerPostedAt`; reuse `webhookEventIds` dedupe.

**Implementation steps:**
1. After payment captured + paid update, call `postPaymentReceived` with system actor.
2. Skip duplicate ledger post when metadata already has journal id or idempotency journal exists.
3. Integration test: verify + webhook does not double-post.

**Acceptance criteria:**
- Webhook service tests cover idempotent ledger posting.

**Test commands:**
```bash
npm run test -w backend/api -- payment-webhook
```

**Depends on:** Tickets 26, 27.

---

## Ticket 29 — Ledger HTTP controllers

**Ticket:** 29 — Ledger HTTP controllers

**Objective:** Implement ledger account and journal controllers using standard response envelope.

**Files to create/update:**
- `controllers/ledger-account.controller.ts`
- `controllers/ledger-journal.controller.ts`

**API endpoints:**
- All admin ledger endpoints from Ticket 5

**DB fields:** None (controller only).

**Implementation steps:**
1. Account controller: create, list, get, update, archive.
2. Journal controller: list, get, reverse, listAccountLines.
3. Thin controllers delegating to services; use existing error middleware.

**Acceptance criteria:**
- Controllers compile; route tests can invoke endpoints.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 19, 20, 23, 24.

---

## Ticket 30 — Ledger admin routes and mount

**Ticket:** 30 — Ledger admin routes and mount

**Objective:** Register ledger admin routes with permission middleware and mount under admin finance router.

**Files to create/update:**
- `routes/ledger-admin.routes.ts`
- Update `backend/api/src/routes/v1/admin.routes.ts` — mount `/finance/ledger`

**API endpoints:**
- All `/api/v1/admin/finance/ledger/*` routes with permissions per Ticket 31

**DB fields:** N/A in route layer.

**Implementation steps:**
1. Wire validators from Ticket 17.
2. Apply admin auth + permission middleware per route.
3. Mount at `/api/v1/admin/finance/ledger`.

**Acceptance criteria:**
- Route structure tests pass for expected paths and middleware chain.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-admin.routes 2>/dev/null || npm run typecheck -w backend/api
```

**Depends on:** Tickets 17, 29.

---

## Ticket 31 — Ledger permissions seed

**Ticket:** 31 — Ledger permissions seed

**Objective:** Add ledger permissions and seed role mappings per PDF.

**Files to create/update:**
- Extend `backend/api/src/modules/auth/constants/auth-permission.constants.ts` (add `FINANCE_LEDGER` resource or explicit codes)
- Update `backend/api/src/database/seeds/seed-roles.ts`
- Update `seed-role-permission-matrix.test.ts`

**API endpoints:** All `/api/v1/admin/finance/ledger/*`

**DB fields:** `roles.permissions`

**Implementation steps:**
1. Add permissions: `finance:ledger:read`, `finance:ledger:manage_accounts`, `finance:ledger:reverse`, `finance:ledger:manual_adjustment` (reserved).
2. Grant all to `SUPER_ADMIN` wildcard.
3. Grant read to `operations_admin`, `support_admin` (read-only ledger visibility if applicable).
4. Grant manage/reverse to `operations_admin` / finance_admin equivalent per Phase 8 role matrix.
5. Do not grant ledger permissions to customer, delivery, vendor, store roles.

**Acceptance criteria:**
- Seed matrix tests pass.

**Test commands:**
```bash
npm run test -w backend/api -- seed-role-permission-matrix
```

**Depends on:** Ticket 30.

---

## Ticket 32 — System ledger account seed

**Ticket:** 32 — System ledger account seed

**Objective:** Seed idempotent system ledger accounts required for payment_received posting.

**Files to create/update:**
- `backend/api/src/database/seeds/seed-ledger-accounts.ts`
- Update seed runner registration
- Optional `package.json` script: `seed:ledger`

**API endpoints:** None.

**DB fields:** Seed accounts: `PAYMENT_GATEWAY_RECEIVABLE`, `VENDOR_PAYABLE`, `DELIVERY_PARTNER_PAYABLE`, `PLATFORM_FEE_REVENUE`, `DELIVERY_FEE_REVENUE`, `COMMISSION_REVENUE`, `TAX_PAYABLE`, `REFUND_PAYABLE`, `DISCOUNT_EXPENSE`, `MANUAL_ADJUSTMENT` with correct type/category flags.

**Implementation steps:**
1. Idempotent upsert by `accountCode`.
2. Set `isSystemAccount=true`, `isPostingAllowed=true`, `currency=INR`.
3. Skip when `APP_ENV=production` unless explicit seed command (follow repo seed conventions).
4. Register after role seed in runner.

**Acceptance criteria:**
- Seed runs twice without duplicates.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 10.

---

## Ticket 33 — Shared ledger API types

**Ticket:** 33 — Shared ledger API types

**Objective:** Add shared ledger DTO types to `packages/shared` per Module 1 shared contracts plan.

**Files to create/update:**
- `packages/shared/api/finance/ledger.types.ts` (create)
- `packages/shared/api/index.ts` (export)

**API endpoints:** Types mirror Ticket 5 contract DTOs.

**DB fields:** None.

**Implementation steps:**
1. Export account, journal, line, list query/response, reverse request types.
2. `npm run typecheck -w packages/shared` passes.

**Acceptance criteria:**
- Shared package typecheck passes.

**Test commands:**
```bash
npm run typecheck -w packages/shared
```

**Depends on:** Tickets 13, 14.

---

## Ticket 34 — OpenAPI ledger paths

**Ticket:** 34 — OpenAPI ledger paths

**Objective:** Register OpenAPI documentation for all Module 3 ledger admin endpoints.

**Files to create/update:**
- `backend/api/src/docs/openapi/ledger-foundation.paths.ts` (create)
- Register in OpenAPI aggregator

**API endpoints:** Document all ledger admin endpoints with request/response/error schemas.

**DB fields:** Reference response shapes from Ticket 5 contract.

**Implementation steps:**
1. Document account CRUD, journal list/detail/reverse, account lines.
2. Include ledger error codes from Ticket 8.
3. Verify OpenAPI includes `/admin/finance/ledger` paths.

**Acceptance criteria:**
- OpenAPI JSON lists all Module 3 ledger endpoints.

**Test commands:**
```bash
npm run typecheck -w backend/api && \
node -e "const {openApiDocument}=require('./backend/api/dist/docs/openapi'); const p=JSON.stringify(openApiDocument.paths||{}); console.log(p.includes('/admin/finance/ledger')?'PASS':'FAIL')" 2>/dev/null || \
node -e "import('./backend/api/src/docs/openapi/index.ts').then(m=>{const p=JSON.stringify(m.openApiDocument.paths||{}); console.log(p.includes('/admin/finance/ledger')?'PASS':'FAIL')})"
```

**Depends on:** Tickets 29, 30.

---

## Ticket 35 — Route registry and contract doc updates

**Ticket:** 35 — Route registry and contract doc updates

**Objective:** Mark implemented ledger routes in registry; finalize contract cross-links.

**Files to create/update:**
- `docs/contracts/backend-route-registry.md` (add PLANNED → IMPLEMENTED ledger routes)
- `docs/contracts/phase-9-finance-api-surface.md` (add ledger section)
- Cross-link `docs/contracts/ledger-foundation-api.md`

**API endpoints:** Mark IMPLEMENTED all Module 3 ledger admin routes.

**DB fields:** Verify Ticket 5 schema doc complete.

**Implementation steps:**
1. Add ledger route table to registry.
2. Note admin-only / finance permission protected.
3. Document payment posting integration endpoints (verify + webhook) cross-ref journal creation.

**Acceptance criteria:**
- Registry shows ledger routes with IMPLEMENTED status after runtime tickets complete.

**Test commands:**
```bash
grep -q "admin/finance/ledger" docs/contracts/backend-route-registry.md && echo PASS
```

**Depends on:** Tickets 30, 34.

---

## Ticket 36 — Ledger journal service unit tests

**Ticket:** 36 — Ledger journal service unit tests

**Objective:** Complete journal service unit test coverage per PDF.

**Files to create/update:**
- `__tests__/ledger-journal.service.test.ts`

**API endpoints:** Internal journal service flows.

**DB fields:** Assert totals, status transitions, reversal line swaps, idempotency behavior.

**Implementation steps:**
1. Tests listed in PDF Ticket 36 section: balanced draft, no lines, single line, mismatch, negative amounts, inactive account, duplicate idempotency, double post blocked, reversal.
2. Mock repositories; no Mongo required.

**Acceptance criteria:**
- All journal service unit tests pass.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-journal.service
```

**Depends on:** Tickets 21–23.

---

## Ticket 37 — Ledger account service unit tests

**Ticket:** 37 — Ledger account service unit tests

**Objective:** Complete ledger account service unit test coverage per PDF.

**Files to create/update:**
- `__tests__/ledger-account.service.test.ts`

**API endpoints:** Account CRUD admin flows.

**DB fields:** Assert accountCode normalization, archive guards, filter behavior.

**Implementation steps:**
1. Tests: create success, code normalization, duplicate blocked, update protected fields blocked, archive with/without posted lines, list filters.

**Acceptance criteria:**
- All account service unit tests pass.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-account.service
```

**Depends on:** Tickets 18–20.

---

## Ticket 38 — Ledger admin route tests

**Ticket:** 38 — Ledger admin route tests

**Objective:** Add route-level tests for ledger admin endpoints per PDF.

**Files to create/update:**
- `__tests__/ledger-admin.routes.test.ts`

**API endpoints:** All `/api/v1/admin/finance/ledger/*` routes.

**DB fields:** Assert permission gates in route tests.

**Implementation steps:**
1. Tests: 401 unauth, 403 missing permission, 200 with permission, invalid account type 400, duplicate account code, reverse permission gates.

**Acceptance criteria:**
- Route test file passes.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-admin.routes
```

**Depends on:** Ticket 30.

---

## Ticket 39 — Ledger payment integration tests

**Ticket:** 39 — Ledger payment integration tests

**Objective:** End-to-end test payment verify/webhook creates balanced `payment_received` journal with idempotency.

**Files to create/update:**
- `__tests__/ledger-payment.integration.test.ts`

**API endpoints:**
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/:paymentId/verify`
- `POST /api/v1/public/webhooks/payments/razorpay`
- `GET /api/v1/admin/finance/ledger/journals`

**DB fields:** `payments.metadata.ledgerJournalId`, `ledger_journal_entries`, `ledger_transaction_lines`.

**Implementation steps:**
1. Seed system ledger accounts (Ticket 32).
2. Flow: create-order → verify → assert posted journal with balanced totals and expected account lines.
3. Assert duplicate webhook does not create duplicate journal.
4. Skip gracefully if MongoDB unavailable per repo convention.

**Acceptance criteria:**
- Integration tests pass when MongoDB available.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-payment.integration 2>/dev/null
```

**Depends on:** Tickets 27–28, 32.

---

## Ticket 40 — Ledger audit and seed tests

**Ticket:** 40 — Ledger audit and seed tests

**Objective:** Verify audit writes and system account seed idempotency.

**Files to create/update:**
- `__tests__/ledger-audit.test.ts`
- `__tests__/ledger-seed.test.ts`

**API endpoints:** Ledger write + payment posting flows.

**DB fields:** `audit_logs.*`, `ledger_accounts.accountCode`.

**Implementation steps:**
1. Audit tests: account created, journal posted, journal reversed, posting rule applied; metadata excludes secrets.
2. Seed tests: required system accounts exist; double seed no duplicates.

**Acceptance criteria:**
- Audit and seed tests pass.

**Test commands:**
```bash
npm run test -w backend/api -- ledger-audit 2>/dev/null
npm run test -w backend/api -- ledger-seed 2>/dev/null
```

**Depends on:** Tickets 31–32.

---

## Ticket 41 — Module 3 validation runbook and smoke checklist

**Ticket:** 41 — Module 3 validation runbook and smoke checklist

**Objective:** Document validation commands and manual smoke steps for Module 3 closeout.

**Files to create/update:**
- `docs/testing/phase-9-ledger-foundation-verification.md` (create)
- `docs/qa/ledger-foundation-manual-qa-checklist.md` (create)

**API endpoints:** Checklist covers all ledger admin endpoints + payment posting smoke flow.

**DB fields:** Smoke checklist: seeded accounts, posted journals, balanced totals, payment metadata journal refs.

**Implementation steps:**
1. Runbook: typecheck, lint, ledger tests, seed-role-permission-matrix, payment tests, OpenAPI verification.
2. Smoke curl steps for account list/create, journal list, payment verify → journal exists, journal reverse.
3. Document `npm run seed:ledger -w backend/api` if script added.

**Acceptance criteria:**
- Verification and smoke docs exist with full command list.

**Test commands:**
```bash
test -f docs/testing/phase-9-ledger-foundation-verification.md && \
test -f docs/qa/ledger-foundation-manual-qa-checklist.md && echo PASS
```

**Depends on:** Tickets 36–40.

---

## Ticket 42 — Module 3 review and handoff

**Ticket:** 42 — Module 3 review and handoff

**Objective:** Close Module 3 with review doc, handoff updates, and execution ticket status DONE.

**Files to create/update:**
- `docs/reviews/ledger-foundation-review.md` (create)
- `docs/handoffs/phase-9-ledger-foundation-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_9_HANDOFF.md` (update — Module 3 DONE)
- `project-context/CURRENT_PROGRESS.md` (update)
- `docs/reviews/phase-9-ledger-foundation-execution-tickets.md` (mark Tickets 1–42 DONE)

**API endpoints:** Summary of IMPLEMENTED ledger admin + payment posting integration endpoints.

**DB fields:** Summary of `ledger_accounts`, `ledger_journal_entries`, `ledger_transaction_lines`, payment metadata fields.

**Implementation steps:**
1. List completed files from alignment doc.
2. Record verified permissions, audit events, tests run.
3. Set status `ready_for_refund_records_backend` per PDF.
4. Note dependencies: Refund Backend posts `refund_approved`/`refund_processed`; Order Revenue Posting consumes ledger; settlements/earnings post accrual entries.
5. Confirm Repository & Codebase Setup not started.

**Acceptance criteria:**
- Handoff complete; all tickets marked DONE; review result PASS.

**Test commands:**
```bash
test -f docs/handoffs/phase-9-ledger-foundation-complete.md && \
grep -q "Module 3" project-context/PHASE_HANDOFFS/PHASE_9_HANDOFF.md && echo PASS
```

**Depends on:** Ticket 41.

---

## Module closeout

**Phase 9 Module 3 — Ledger Foundation:** COMPLETE (Tickets 1–42)

**Foundation gate (docs only):** Tickets 1–5 — complete before any runtime ticket.

**Next module after closeout:** **Module 4 — Order Revenue Posting** (per PDF sequence after Ledger Foundation).

**Execution order summary:**
```text
Tickets 1–5 (boundary, architecture, migration, alignment, API+schema docs)
  → 6–9 (scaffold, constants, errors, audit)
  → 10–17 (models, types, mappers, repos, validators)
  → 18–26 (account/journal/line/posting services)
  → 27–28 (payment verify + webhook integration)
  → 29–35 (controllers, routes, permissions, seed, shared, OpenAPI, registry)
  → 36–40 (tests)
  → 41–42 (verification, review, handoff)
```
