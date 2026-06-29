# Ledger Foundation Manual QA Checklist

**Module:** 3 — Ledger Foundation

## Prerequisites

- Backend API running with MongoDB
- Admin user with `finance:ledger:read`, `finance:ledger:manage_accounts`, `finance:ledger:reverse`
- System ledger accounts seeded (seed runner)
- Razorpay test credentials configured

## Admin Ledger — Accounts

- [ ] `GET /api/v1/admin/finance/ledger/accounts` returns seeded system accounts
- [ ] `POST /api/v1/admin/finance/ledger/accounts` creates custom account with normalized code
- [ ] Duplicate `accountCode` returns 409
- [ ] `GET /api/v1/admin/finance/ledger/accounts/:accountId` returns account detail
- [ ] `PATCH` updates allowed fields only
- [ ] `DELETE` archives account without posted lines
- [ ] Archive blocked when account has posted lines

## Admin Ledger — Journals

- [ ] `GET /api/v1/admin/finance/ledger/journals` lists journals after payment
- [ ] `GET /api/v1/admin/finance/ledger/journals/:journalId` shows balanced lines
- [ ] `POST .../reverse` creates reversal journal; original status becomes reversed
- [ ] Reverse requires `finance:ledger:reverse` permission

## Admin Ledger — Lines

- [ ] `GET /api/v1/admin/finance/ledger/accounts/:accountId/lines` returns lines + balance

## Payment Posting Smoke

- [ ] Create checkout → create payment order → verify payment
- [ ] Payment record has `metadata.ledgerJournalId` and `metadata.ledgerPostedAt`
- [ ] Journal exists with `postingType=payment_received` and balanced totals
- [ ] Duplicate verify does not create second journal
- [ ] Razorpay webhook `payment.captured` does not double-post when verify already posted

## Permission Gates

- [ ] Unauthenticated requests return 401
- [ ] Admin without ledger permissions returns 403
- [ ] Support admin with read-only can list accounts/journals but not create/reverse

## Audit

- [ ] Account create/update/archive writes audit events
- [ ] Journal post/reverse writes audit events
- [ ] Failed posting writes `finance.ledger_posting_failed` without reversing payment
