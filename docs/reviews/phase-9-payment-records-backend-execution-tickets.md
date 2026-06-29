# Phase 9 Payment Records Backend — CODEX Execution Tickets

**Phase:** Phase 9 — Payments, Refunds & Settlements  
**Module:** 2 — Payment Records Backend  
**Status:** COMPLETE (Tickets 21–35 executed 2026-06-17)

## Sources

- `projectin micro/docone/AllPhase&Modules.pdf` — Phase 9 module order
- `projectin micro/docsix/PhaesDetail9.pdf` — Module 2 Payment Records Backend micro-tasks
- Phase 9 Module 1 foundation docs (`docs/architecture/phase-9-*`, `docs/database/phase-9-*`, `docs/contracts/phase-9-finance-api-surface.md`)

## Prerequisites

- Phase 9 Module 1 — Financial Architecture Foundation **COMPLETE**
- Phase 4 Module 8 — Payment Gateway Foundation **IMPLEMENTED** (`backend/api/src/modules/payment/`, `payments` collection)
- Phase 5 orders module available for payment-order linkage
- Phase 8 admin audit patterns available

## Scope Rules

- Implement Phase 9 payment record backend per PDF micro-tasks and Module 1 contracts.
- **Do not** start Repository & Codebase Setup (Phase 1 Module 2).
- **Do not** implement refund records, ledger, settlements, earnings, or admin/customer finance UI (later modules).
- **Do not** add features outside Module 2 ticket scope.
- Extend or migrate existing Phase 4 payment code — do not duplicate parallel payment domains without Ticket 2 decision.
- First tickets (1–4) are **docs/foundation only**; runtime tickets (5+) start only after Ticket 4 gate.

## Phase 4 vs Phase 9 Alignment (baseline)

| PDF / Module 1 planned | Current repo (Phase 4) | Module 2 action |
|------------------------|------------------------|-----------------|
| `payment_records` collection | `payments` collection | Ticket 2 decides rename vs extend-in-place |
| `modules/finance/payments/*` | `modules/payment/*` | Ticket 2 decides extend vs new tree |
| `POST .../payments/:paymentId/verify` | `POST .../payments/verify` | Add path alias or migrate in route ticket |
| `POST .../public/webhooks/payments/razorpay` | `POST .../webhooks/razorpay` | Optional public mount; keep baseline working |
| `GET .../customer/payments/:paymentId` | not implemented | New in Module 2 |
| `GET .../admin/finance/payments*` | not implemented | New in Module 2 |

## Ticket List

| Ticket | Objective | Status | Depends on |
|--------|-----------|--------|------------|
| 1 | Module 2 boundary and source alignment | PENDING | Module 1 complete |
| 2 | Payment records migration and module strategy | PENDING | 1 |
| 3 | Payment records backend implementation alignment | PENDING | 2 |
| 4 | Payment records API contract (detailed) | PENDING | 2, 3 |
| 5 | Payment module scaffold and exports | PENDING | 4 |
| 6 | Payment constants and finance error mapper | PENDING | 5 |
| 7 | Payment audit constants and sanitizer | PENDING | 5 |
| 8 | Money utility and unit tests | PENDING | 5 |
| 9 | Payment record model and indexes | PENDING | 2, 5 |
| 10 | Payment record types | PENDING | 9 |
| 11 | Payment response mappers | PENDING | 10 |
| 12 | Payment record repository | PENDING | 9, 10 |
| 13 | Payment request validators | PENDING | 10 |
| 14 | Razorpay gateway service boundary | PENDING | 6 |
| 15 | Finance environment validation | PENDING | 3 |
| 16 | Payment service — create order | PENDING | 12–15 |
| 17 | Payment service — verify payment | PENDING | 16 |
| 18 | Payment service — customer get by id | PENDING | 12, 17 |
| 19 | Payment service — admin list and detail | PENDING | 12 |
| 20 | Order finance fields and payment sync service | PENDING | 9, 16 |
| 21 | Payment HTTP controllers | DONE | 16–19 |
| 22 | Customer payment routes and mount | DONE | 13, 21 |
| 23 | Admin finance payment routes and mount | DONE | 13, 19, 21 |
| 24 | Razorpay webhook service | DONE | 12, 14, 20 |
| 25 | Webhook controller, routes, and public mount | DONE | 24 |
| 26 | Finance payment permissions seed | DONE | 23 |
| 27 | Shared payment API types | DONE | 10, 11 |
| 28 | OpenAPI payment paths | DONE | 21–25 |
| 29 | Route registry and contract doc updates | DONE | 22–25, 28 |
| 30 | Payment service unit tests | DONE | 16–19 |
| 31 | Payment route and webhook tests | DONE | 22–25 |
| 32 | Payment audit and integration tests | DONE | 24–25, 30 |
| 33 | Payment test seed helper | DONE | 9, 20 |
| 34 | Module 2 validation runbook and smoke checklist | DONE | 30–33 |
| 35 | Module 2 review and handoff | DONE | 34 |

## Module 2 Boundary

Module 2 owns:

- payment record persistence aligned to Module 1 schema
- customer create-order, verify, get-by-id (extend Phase 4 baseline)
- admin finance payment list and detail
- Razorpay webhook processing with dedupe and order finance sync
- order finance field updates on pay/fail
- `finance:payments:read` permission seed
- OpenAPI, route registry, tests, smoke checklist, handoff

Module 2 defers:

- refund record runtime
- ledger / journal entries
- vendor settlements / delivery earnings
- admin payment operations UI
- refund amount mutations on `payment_records.refundedAmount` (Refund Backend)

---

## Ticket 1 — Module 2 boundary and source alignment

**Ticket:** 1 — Module 2 boundary and source alignment

**Objective:** Confirm Module 2 scope against PDF micro-tasks and Module 1 foundation; update Phase 9 handoff to Module 2 in progress.

**Files to create/update:**
- `docs/reviews/phase-9-payment-records-backend-execution-tickets.md` (this file — boundary section)
- `project-context/PHASE_HANDOFFS/PHASE_9_HANDOFF.md` (update — Module 2 started)

**API endpoints:** None (planning only).

**DB fields:** None.

**Implementation steps:**
1. Record Module 2 PDF task groups: scaffold, constants, model, repo, validators, gateway, env, services, routes, webhook, order sync, permissions, shared types, OpenAPI, tests, review.
2. List in-scope endpoints from Module 1 `phase-9-finance-api-surface.md` payment subset.
3. Explicitly exclude refund, ledger, settlement, earning modules.
4. Note Phase 4 IMPLEMENTED baseline routes to extend, not replace blindly.
5. Confirm Repository & Codebase Setup not in scope.

**Acceptance criteria:**
- Module 2 boundary documented; handoff shows Module 2 in progress.
- No runtime code changes in Ticket 1.

**Test commands:**
```bash
test -f docs/reviews/phase-9-payment-records-backend-execution-tickets.md && \
grep -q "Module 2 Boundary" docs/reviews/phase-9-payment-records-backend-execution-tickets.md && \
grep -q "Module 2" project-context/PHASE_HANDOFFS/PHASE_9_HANDOFF.md && echo PASS
```

**Depends on:** Phase 9 Module 1 complete.

---

## Ticket 2 — Payment records migration and module strategy

**Ticket:** 2 — Payment records migration and module strategy

**Objective:** Decide and document how Phase 4 `payments` / `modules/payment/` maps to Phase 9 `payment_records` / finance module layout before any runtime work.

**Files to create/update:**
- `docs/architecture/phase-9-payment-records-migration-strategy.md` (create)

**API endpoints:** Document route evolution plan only (no implementation):
- `POST /api/v1/customer/payments/create-order` — keep IMPLEMENTED
- `POST /api/v1/customer/payments/verify` vs `POST .../:paymentId/verify`
- `GET /api/v1/customer/payments/:paymentId` — new
- `GET /api/v1/admin/finance/payments` — new
- `GET /api/v1/admin/finance/payments/:paymentId` — new
- `POST /api/v1/public/webhooks/payments/razorpay` vs existing webhook mount

**DB fields:** Document collection strategy:
- Option A: rename `payments` → `payment_records` with migration script (later ticket)
- Option B: keep `payments` collection name, add Phase 9 finance fields in place
- Required Phase 9 fields from `docs/database/phase-9-payment-record-schema.md`

**Implementation steps:**
1. Compare Phase 4 `docs/database/payment-schema.md` vs Module 1 payment record schema.
2. Choose module path: **extend `modules/payment/`** (recommended) vs new `modules/finance/payments/`.
3. Document backward compatibility for existing `paymentId` on orders and checkout sessions.
4. Document index additions per `phase-9-finance-index-plan.md`.
5. Mark decision `NEEDS VERIFICATION` if PDF path conflicts with extend-in-place.

**Acceptance criteria:**
- Migration strategy doc exists with explicit collection and module path decision.
- No Mongoose model changes in Ticket 2.

**Test commands:**
```bash
test -f docs/architecture/phase-9-payment-records-migration-strategy.md && \
grep -q "payment_records" docs/architecture/phase-9-payment-records-migration-strategy.md && echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Payment records backend implementation alignment

**Ticket:** 3 — Payment records backend implementation alignment

**Objective:** Document file-level implementation map from PDF micro-tasks to actual repo paths per Ticket 2 decision.

**Files to create/update:**
- `docs/architecture/phase-9-payment-records-backend-alignment.md` (create)

**API endpoints:** None.

**DB fields:** Map Module 1 schema fields to planned model file paths.

**Implementation steps:**
1. Table: PDF path → chosen repo path (extend existing payment files where applicable).
2. List files to create vs extend: model, repo, service, gateway, webhook, validators, mappers, constants, tests.
3. Reference existing Phase 4 files that must not be duplicated.
4. Define ticket execution order for Tickets 5–35.
5. Cross-link `phase-9-financial-backend-file-structure.md` with chosen path.

**Acceptance criteria:**
- Alignment doc lists all Module 2 runtime files with create/extend action.
- No `.ts` files created in Ticket 3.

**Test commands:**
```bash
test -f docs/architecture/phase-9-payment-records-backend-alignment.md && \
grep -q "modules/payment" docs/architecture/phase-9-payment-records-backend-alignment.md && echo PASS
```

**Depends on:** Ticket 2.

---

## Ticket 4 — Payment records API contract (detailed)

**Ticket:** 4 — Payment records API contract (detailed)

**Objective:** Create detailed payment records API contract for Module 2 implementation and tests.

**Files to create/update:**
- `docs/contracts/phase-9-payment-records-api.md` (create)

**API endpoints:** Document request/response/error for:
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/:paymentId/verify`
- `GET /api/v1/customer/payments/:paymentId`
- `GET /api/v1/admin/finance/payments`
- `GET /api/v1/admin/finance/payments/:paymentId`
- `POST /api/v1/public/webhooks/payments/razorpay`

**DB fields:** Reference `payment_records.*` and order finance fields used in responses per Module 1 schemas.

**Implementation steps:**
1. Request/response envelopes per `API_STANDARDS.md`.
2. Customer create-order body: `orderId`, optional `paymentMethod`; response includes Razorpay checkout payload fields (`keyId`, `gatewayOrderId`, `amount`, `currency`, `paymentId`).
3. Verify body: `gatewayOrderId`, `gatewayPaymentId`, `gatewaySignature`.
4. Admin list query filters per PDF: customerId, orderId, storeId, vendorId, cityId, paymentStatus, gateway, paymentMethod, dateFrom, dateTo, search, pagination.
5. Webhook: signature header, dedupe behavior, provider JSON success shape.
6. Error codes cross-ref `docs/errors/phase-9-finance-error-codes.md`.
7. Mark Phase 4 verify path compatibility note.

**Acceptance criteria:**
- Contract doc covers all Module 2 payment endpoints with field-level detail.
- No route/controller code in Ticket 4.

**Test commands:**
```bash
test -f docs/contracts/phase-9-payment-records-api.md && \
grep -q "POST /api/v1/customer/payments/:paymentId/verify" docs/contracts/phase-9-payment-records-api.md && echo PASS
```

**Depends on:** Tickets 2, 3.

---

## Ticket 5 — Payment module scaffold and exports

**Ticket:** 5 — Payment module scaffold and exports

**Objective:** Create or extend payment module folder scaffold and barrel exports per Ticket 2 decision.

**Files to create/update:**
- Per `docs/architecture/phase-9-payment-records-backend-alignment.md` (extend `backend/api/src/modules/payment/` or create finance subtree)
- `index.ts` export file if finance subtree created
- `__tests__/` folder if missing

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Create missing subfolders: constants, utils, services, repositories, models, validators, types, routes, controllers, `__tests__`.
2. Add module index exports for controller, service, repository, model, types, constants, routes.
3. Do not implement business logic in scaffold ticket.
4. Wire nothing to app router yet.

**Acceptance criteria:**
- Folder scaffold matches alignment doc.
- Typecheck passes with empty/stub exports only if needed.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 4.

---

## Ticket 6 — Payment constants and finance error mapper

**Ticket:** 6 — Payment constants and finance error mapper

**Objective:** Implement or extend payment status, method, gateway, gateway-status constants and HTTP error mapper per PDF.

**Files to create/update:**
- Extend or create under payment module constants:
  - `payment-status.constant.ts`
  - `payment-method.constant.ts`
  - `payment-gateway.constant.ts`
  - `payment-gateway-status.constant.ts` (new if missing)
  - `payment-error-codes.constant.ts` (align with Module 1 + PDF additions)
- `utils/payment-error.mapper.ts` (extend)

**API endpoints:** Map codes to all customer/admin payment and webhook endpoints.

**DB fields:** `gateway`, `gatewayStatus`, `paymentMethod`, `paymentStatus`.

**Implementation steps:**
1. Add PDF enum values for status, method, gateway, gateway status.
2. Add PDF payment error codes including `ORDER_NOT_FOUND_FOR_PAYMENT`, `PAYMENT_GATEWAY_VERIFY_FAILED`, `PAYMENT_CUSTOMER_SCOPE_INVALID`, `PAYMENT_ADMIN_SCOPE_INVALID`, `PAYMENT_GATEWAY_NOT_CONFIGURED`, `PAYMENT_CURRENCY_NOT_SUPPORTED`.
3. Map errors to HTTP status per PDF (note webhook duplicate → 200 safe ignore).
4. Reuse existing Phase 4 constants where values match; extend only.

**Acceptance criteria:**
- Constants compile; error mapper unit tests pass or extend existing tests.

**Test commands:**
```bash
npm run typecheck -w backend/api && \
npm run test -w backend/api -- payment-error 2>/dev/null || npm run test -w backend/api -- payment.service.test
```

**Depends on:** Ticket 5.

---

## Ticket 7 — Payment audit constants and sanitizer

**Ticket:** 7 — Payment audit constants and sanitizer

**Objective:** Add payment audit event constants and sanitizer utility per PDF.

**Files to create/update:**
- Extend `constants/payment-audit-events.constant.ts`
- Create `utils/payment-audit-sanitizer.util.ts` (or extend finance sanitizer path per alignment doc)

**API endpoints:** All payment write endpoints + webhook.

**DB fields:** `admin_action_audits` metadata fields only.

**Implementation steps:**
1. Add events: `finance.payment_record_created`, `finance.payment_gateway_order_created`, `finance.payment_verified`, `finance.payment_failed`, `finance.payment_cancelled`, `finance.payment_expired`, `finance.payment_webhook_received`, `finance.payment_webhook_rejected`, `finance.payment_status_synced`.
2. Sanitizer strips: gatewaySignature, tokens, secrets, raw webhook payload, card/UPI/bank fields.
3. Document planned write points in service tickets (no writes in this ticket beyond util).

**Acceptance criteria:**
- Sanitizer unit tests prove forbidden fields removed.

**Test commands:**
```bash
npm run test -w backend/api -- payment-audit 2>/dev/null || npm run typecheck -w backend/api
```

**Depends on:** Ticket 5.

---

## Ticket 8 — Money utility and unit tests

**Ticket:** 8 — Money utility and unit tests

**Objective:** Implement or extend money helpers for INR smallest-unit rules per PDF.

**Files to create/update:**
- Extend `utils/payment-amount.util.ts` or create `modules/finance/utils/money.util.ts` per alignment doc
- `utils/payment-amount.util.test.ts` or `__tests__/money.util.test.ts`

**API endpoints:** Used by create-order and verify flows.

**DB fields:** `amount`, `payableAmount`, `discountAmount`, `deliveryFee`, `platformFee`, `taxAmount`, `refundedAmount`, `currency`.

**Implementation steps:**
1. Helpers: `normalizeMoneyAmount`, `assertPositiveAmount`, `calculatePayableAmount`, `toSmallestCurrencyUnit`, `fromSmallestCurrencyUnit`.
2. Currency constant `INR`.
3. Tests: positive amount, zero rejection, negative rejection, paise conversion.

**Acceptance criteria:**
- All money util tests pass.

**Test commands:**
```bash
npm run test -w backend/api -- payment-amount
```

**Depends on:** Ticket 5.

---

## Ticket 9 — Payment record model and indexes

**Ticket:** 9 — Payment record model and indexes

**Objective:** Extend or replace Mongoose payment model with Phase 9 payment record fields and indexes.

**Files to create/update:**
- Extend `models/payment.model.ts` or create `payment-record.model.ts` per Ticket 2
- Update collection name per migration strategy

**API endpoints:** None.

**DB fields:** Implement Module 1 / PDF fields including:
- `orderId`, `customerId`, `storeId`, `vendorId`, `cityId`
- `gateway*`, `paymentMethod`, amount breakdown fields, `refundedAmount`
- `paymentStatus`, failure fields, `webhookEventIds`, timestamps, actor fields
- Defaults: `gateway=razorpay`, `currency=INR`, `refundedAmount=0`, `paymentStatus=created`
- Indexes: orderId, customerId, storeId, vendorId, cityId, unique sparse gatewayOrderId/gatewayPaymentId, paymentStatus, createdAt

**Implementation steps:**
1. Apply Ticket 2 collection naming decision.
2. Preserve Phase 4 fields: `checkoutSessionId`, `idempotencyKey`, `signatureVerified` unless strategy removes them.
3. Never expose `gatewaySignature` in default API selects.
4. Register indexes in schema.

**Acceptance criteria:**
- Model compiles; indexes declared per `phase-9-finance-index-plan.md`.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 2, 5.

---

## Ticket 10 — Payment record types

**Ticket:** 10 — Payment record types

**Objective:** Add TypeScript types for payment domain inputs, queries, and responses.

**Files to create/update:**
- Extend `types/payment.types.ts` or create `types/payment-record.types.ts`

**API endpoints:** Types for all Module 2 payment endpoints.

**DB fields:** Typed document interface matching model.

**Implementation steps:**
1. Add enums/types: `PaymentGateway`, `PaymentStatus`, `PaymentMethod`, `PaymentGatewayStatus`.
2. Add inputs: `CreatePaymentRecordInput`, `UpdatePaymentRecordInput`, `CreatePaymentOrderInput`, `VerifyPaymentInput`.
3. Add queries: `PaymentListQuery` with admin filters and pagination.
4. Add responses: `PaymentResponse`, `AdminPaymentResponse`, webhook payload types.

**Acceptance criteria:**
- Types compile and are imported by repo/service/validators without circular deps.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 9.

---

## Ticket 11 — Payment response mappers

**Ticket:** 11 — Payment response mappers

**Objective:** Extend payment response mappers for customer and admin views with sensitive field exclusion.

**Files to create/update:**
- Extend `utils/payment-response.mapper.ts`

**API endpoints:**
- `GET /api/v1/customer/payments/:paymentId`
- `GET /api/v1/admin/finance/payments`
- `GET /api/v1/admin/finance/payments/:paymentId`
- Customer create/verify responses

**DB fields:** Map all non-sensitive `payment_records` fields; exclude `gatewaySignature`, raw metadata, internal actor fields from customer view.

**Implementation steps:**
1. Customer mapper excludes sensitive/internal fields per PDF list.
2. Admin mapper includes scope fields; sanitize metadata.
3. Add mapper unit tests for field exclusion.

**Acceptance criteria:**
- Mapper tests prove customer responses omit sensitive fields.

**Test commands:**
```bash
npm run test -w backend/api -- payment-response 2>/dev/null || npm run typecheck -w backend/api
```

**Depends on:** Ticket 10.

---

## Ticket 12 — Payment record repository

**Ticket:** 12 — Payment record repository

**Objective:** Extend payment repository with Phase 9 lookup, list, update, and webhook dedupe methods.

**Files to create/update:**
- Extend `repositories/payment.repository.ts`

**API endpoints:** Supports all Module 2 payment endpoints.

**DB fields:** `_id`, `orderId`, `customerId`, gateway ids, `paymentStatus`, `webhookEventIds`, `createdAt`.

**Implementation steps:**
1. Methods: `createPaymentRecord`, `findPaymentRecordById`, `findPaymentRecordByOrderId`, `findPaymentRecordByGatewayOrderId`, `findPaymentRecordByGatewayPaymentId`, `updatePaymentRecordById`, `appendWebhookEventId`, `hasWebhookEventId`, `listPaymentRecords`.
2. List supports filters: customerId, orderId, storeId, vendorId, cityId, paymentStatus, gateway, paymentMethod, dateFrom, dateTo, search.
3. Pagination: page, limit, total, totalPages, hasNextPage, hasPreviousPage; default sort `createdAt desc`.

**Acceptance criteria:**
- Repository methods covered by unit tests with mocked model.

**Test commands:**
```bash
npm run test -w backend/api -- payment.repository 2>/dev/null || npm run typecheck -w backend/api
```

**Depends on:** Tickets 9, 10.

---

## Ticket 13 — Payment request validators

**Ticket:** 13 — Payment request validators

**Objective:** Add Zod validators for create-order, verify, customer detail, admin list, admin detail.

**Files to create/update:**
- Extend `validators/payment.validators.ts`

**API endpoints:**
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/:paymentId/verify`
- `GET /api/v1/customer/payments/:paymentId`
- `GET /api/v1/admin/finance/payments`
- `GET /api/v1/admin/finance/payments/:paymentId`

**DB fields:** Validation aligns with `docs/validation/phase-9-finance-validation-rules.md`.

**Implementation steps:**
1. Create-order: `orderId` required ObjectId; optional `paymentMethod` enum.
2. Verify: param `paymentId`; body gateway ids + signature required.
3. Admin list: optional filter enums and pagination fields.
4. Wire validators to routes in Tickets 22–23.

**Acceptance criteria:**
- Validator tests for invalid payloads return `VALIDATION_ERROR`.

**Test commands:**
```bash
npm run test -w backend/api -- payment.validators 2>/dev/null || npm run test -w backend/api -- payment.routes.test
```

**Depends on:** Ticket 10.

---

## Ticket 14 — Razorpay gateway service boundary

**Ticket:** 14 — Razorpay gateway service boundary

**Objective:** Extend Razorpay gateway adapter with create order, payment signature verify, and webhook signature verify per PDF.

**Files to create/update:**
- Extend `gateways/razorpay.gateway.ts` or create `services/razorpay-payment-gateway.service.ts`

**API endpoints:**
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/:paymentId/verify`
- `POST /api/v1/public/webhooks/payments/razorpay`

**DB fields:** `gatewayOrderId`, `gatewayPaymentId`, `gatewaySignature`, `gatewayStatus`, `metadata`.

**Implementation steps:**
1. Methods: `createRazorpayOrder`, `verifyRazorpayPaymentSignature`, `verifyRazorpayWebhookSignature`.
2. Read env: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `PAYMENT_CURRENCY`.
3. Throw `PAYMENT_GATEWAY_NOT_CONFIGURED` when missing in production path.
4. Never log secrets or signatures.

**Acceptance criteria:**
- Gateway unit tests mock Razorpay SDK; signature verify tests pass.

**Test commands:**
```bash
npm run test -w backend/api -- razorpay.gateway
```

**Depends on:** Ticket 6.

---

## Ticket 15 — Finance environment validation

**Ticket:** 15 — Finance environment validation

**Objective:** Extend backend env validation for Phase 9 finance variables per Module 1 setup doc.

**Files to create/update:**
- `backend/api/.env.example` (update if gaps)
- `backend/api/src/config/env.ts` (extend validation)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Validate when `PAYMENT_GATEWAY=razorpay` and `APP_ENV=production`: require `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `PAYMENT_CURRENCY`.
2. First launch: `PAYMENT_CURRENCY` must be `INR`.
3. Document optional flags: `REFUND_PROCESSING_ENABLED`, `FINANCE_WEBHOOK_LOGGING_ENABLED`.
4. Do not log secret values on startup failure.

**Acceptance criteria:**
- Env schema tests or typecheck pass; production rules documented in `phase-9-finance-env-config.md` cross-link.

**Test commands:**
```bash
npm run typecheck -w backend/api && npm run lint -w backend/api
```

**Depends on:** Ticket 3.

---

## Ticket 16 — Payment service — create order

**Ticket:** 16 — Payment service — create order

**Objective:** Implement or extend `createPaymentOrder` with order validation, duplicate guard, record creation, Razorpay order, audit write.

**Files to create/update:**
- Extend `services/payment.service.ts`

**API endpoints:**
- `POST /api/v1/customer/payments/create-order`

**DB fields:** Create `payment_records` with PDF fields; read `orders.payableAmount`, `orders.paymentStatus`.

**Implementation steps:**
1. Verify order exists via order repository; customer scope match.
2. Block if order paid or payable <= 0 or not payable status.
3. Block duplicate active payment for statuses: created, pending, authorized, paid.
4. Create payment record; call Razorpay; save `gatewayOrderId`, `gatewayStatus`; set status pending/created.
5. Audit `finance.payment_gateway_order_created`.
6. Return customer response with Razorpay checkout payload.

**Acceptance criteria:**
- Service unit tests cover success, not found, scope, already paid, zero amount, duplicate payment, gateway failure.

**Test commands:**
```bash
npm run test -w backend/api -- payment-record.service 2>/dev/null || npm run test -w backend/api -- payment.service.test
```

**Depends on:** Tickets 12–15.

---

## Ticket 17 — Payment service — verify payment

**Ticket:** 17 — Payment service — verify payment

**Objective:** Implement `verifyCustomerPayment` with signature check, status transitions, order sync, audit, optional internal event.

**Files to create/update:**
- Extend `services/payment.service.ts`

**API endpoints:**
- `POST /api/v1/customer/payments/:paymentId/verify`

**DB fields:** Update payment paid/failed fields; update order finance fields via sync service (Ticket 20).

**Implementation steps:**
1. Load payment; verify customer scope.
2. Allow verify only for created/pending/authorized statuses.
3. Invalid signature → failed payment fields + audit.
4. Valid signature → paid fields + order sync + audit `finance.payment_verified` + optional `payment.paid` internal event.
5. Block re-verify when already paid.

**Acceptance criteria:**
- Service tests for valid/invalid signature, wrong customer, order sync, failed paths.

**Test commands:**
```bash
npm run test -w backend/api -- payment.service.test
```

**Depends on:** Ticket 16.

---

## Ticket 18 — Payment service — customer get by id

**Ticket:** 18 — Payment service — customer get by id

**Objective:** Implement `getCustomerPaymentById` with scope checks and sanitized mapper.

**Files to create/update:**
- Extend `services/payment.service.ts`

**API endpoints:**
- `GET /api/v1/customer/payments/:paymentId`

**DB fields:** Read `payment_records.customerId`, `orderId`, status, gateway fields.

**Implementation steps:**
1. Return `PAYMENT_RECORD_NOT_FOUND` when missing.
2. Return `PAYMENT_CUSTOMER_SCOPE_INVALID` when customer mismatch.
3. Map via customer response mapper.

**Acceptance criteria:**
- Service tests for own payment, other customer blocked, not found.

**Test commands:**
```bash
npm run test -w backend/api -- payment.service.test
```

**Depends on:** Tickets 12, 17.

---

## Ticket 19 — Payment service — admin list and detail

**Ticket:** 19 — Payment service — admin list and detail

**Objective:** Implement `listAdminPayments` and `getAdminPaymentById` with permission and city/store scope enforcement.

**Files to create/update:**
- Extend `services/payment.service.ts` or add `services/payment-admin.service.ts`

**API endpoints:**
- `GET /api/v1/admin/finance/payments`
- `GET /api/v1/admin/finance/payments/:paymentId`

**DB fields:** Filter on customerId, orderId, storeId, vendorId, cityId, paymentStatus, gateway, paymentMethod, createdAt.

**Implementation steps:**
1. Require `finance:payments:read`.
2. Apply query filters and pagination from validators.
3. Enforce admin city/store scope on list and detail.
4. Map admin responses with sanitized metadata.

**Acceptance criteria:**
- Service or route tests cover permission denied and scope denied cases.

**Test commands:**
```bash
npm run test -w backend/api -- payment-admin 2>/dev/null || npm run test -w backend/api -- payment.service.test
```

**Depends on:** Ticket 12.

---

## Ticket 20 — Order finance fields and payment sync service

**Ticket:** 20 — Order finance fields and payment sync service

**Objective:** Add missing order finance schema fields and centralized order payment sync service used by verify and webhook flows.

**Files to create/update:**
- Extend `backend/api/src/modules/orders/models/order.model.ts`
- Extend order types/constants for paymentStatus and financeStatus enums
- Create `services/order-payment-sync.service.ts` (under payment or finance module per alignment doc)

**API endpoints:** Called from verify and webhook flows (no new public routes).

**DB fields:** Add/verify on orders:
- `paymentRecordId`, `paymentMethod`, `paymentGateway`, `payableAmount`, `platformFee`, `financeStatus`, `paidAt`, `paymentFailedAt`, `refundCompletedAt` (schema only; refund usage deferred)
- Enum values per `phase-9-order-financial-summary-schema.md`
- Indexes on `paymentStatus`, `financeStatus`, `paymentRecordId`, `paidAt`

**Implementation steps:**
1. Methods: `markOrderPaymentPaid`, `markOrderPaymentFailed`, `markOrderPaymentPending`.
2. All order finance mutations go through this service only.
3. Wire from payment verify (Ticket 17) and webhook (Ticket 24).

**Acceptance criteria:**
- Unit tests for each sync method updating expected order fields.

**Test commands:**
```bash
npm run test -w backend/api -- order-payment 2>/dev/null || npm run typecheck -w backend/api
```

**Depends on:** Tickets 9, 16.

---

## Ticket 21 — Payment HTTP controllers

**Ticket:** 21 — Payment HTTP controllers

**Objective:** Extend payment controllers for create, verify, customer get, admin list, admin detail using standard response envelope.

**Files to create/update:**
- Extend `controllers/payment.controller.ts`
- Add admin controller file if separation preferred per alignment doc

**API endpoints:**
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/:paymentId/verify`
- `GET /api/v1/customer/payments/:paymentId`
- `GET /api/v1/admin/finance/payments`
- `GET /api/v1/admin/finance/payments/:paymentId`

**DB fields:** None (controller only).

**Implementation steps:**
1. Thin controllers delegating to service methods.
2. Use existing error middleware and response helpers.
3. No business logic in controllers.

**Acceptance criteria:**
- Controllers compile; route tests can invoke endpoints.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 16–19.

---

## Ticket 22 — Customer payment routes and mount

**Ticket:** 22 — Customer payment routes and mount

**Objective:** Register customer payment routes including `:paymentId` verify and get paths; preserve backward-compatible verify route if required by Ticket 2.

**Files to create/update:**
- Extend `routes/payment.routes.ts`
- Update `backend/api/src/routes/v1/customer.routes.ts` mount if needed

**API endpoints:**
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/:paymentId/verify`
- `GET /api/v1/customer/payments/:paymentId`
- Optional alias: keep `POST /api/v1/customer/payments/verify`

**DB fields:** `payment_records.customerId`, `orderId`, `paymentStatus`.

**Implementation steps:**
1. Apply customer auth middleware on all routes.
2. Apply validators from Ticket 13.
3. Mount under `/api/v1/customer/payments`.

**Acceptance criteria:**
- Customer route tests pass for auth, validation, success paths.

**Test commands:**
```bash
npm run test -w backend/api -- payment.routes.test
```

**Depends on:** Tickets 13, 21.

---

## Ticket 23 — Admin finance payment routes and mount

**Ticket:** 23 — Admin finance payment routes and mount

**Objective:** Create admin finance payment routes with `finance:payments:read` permission gates.

**Files to create/update:**
- Create `routes/payment-admin.routes.ts` or admin finance sub-router
- Update `backend/api/src/routes/v1/admin.routes.ts`

**API endpoints:**
- `GET /api/v1/admin/finance/payments`
- `GET /api/v1/admin/finance/payments/:paymentId`

**DB fields:** Admin list/detail fields per Ticket 19.

**Implementation steps:**
1. Apply admin auth + permission middleware.
2. Mount under `/api/v1/admin/finance/payments`.
3. Wire validators for list query and detail param.

**Acceptance criteria:**
- Admin route tests: 401 unauthenticated, 403 missing permission, 200 with permission.

**Test commands:**
```bash
npm run test -w backend/api -- payment-admin.routes 2>/dev/null || npm run test -w backend/api -- payment.routes.test
```

**Depends on:** Tickets 13, 19, 21.

---

## Ticket 24 — Razorpay webhook service

**Ticket:** 24 — Razorpay webhook service

**Objective:** Extend webhook service for signature verify, dedupe, payment.captured/failed handling, order sync, audit, internal event.

**Files to create/update:**
- Extend `services/payment-webhook.service.ts`

**API endpoints:**
- `POST /api/v1/public/webhooks/payments/razorpay`
- Maintain existing `/api/v1/webhooks/razorpay` handler compatibility if Ticket 2 requires

**DB fields:** Update `payment_records.webhookEventIds`, status fields; order finance fields via sync service.

**Implementation steps:**
1. Verify `x-razorpay-signature`; reject with `PAYMENT_WEBHOOK_SIGNATURE_INVALID`.
2. Parse event; find payment by gateway order id.
3. Dedupe via `webhookEventIds`; return 200 without reprocessing duplicates.
4. Handle `payment.captured` → paid + order paid sync + audit.
5. Handle `payment.failed` → failed + order failed sync + audit.
6. Emit internal webhook processed event if event system exists.

**Acceptance criteria:**
- Webhook service unit tests for signature, dedupe, captured, failed.

**Test commands:**
```bash
npm run test -w backend/api -- payment-webhook
```

**Depends on:** Tickets 12, 14, 20.

---

## Ticket 25 — Webhook controller, routes, and public mount

**Ticket:** 25 — Webhook controller, routes, and public mount

**Objective:** Wire webhook HTTP layer with raw body support and public mount path.

**Files to create/update:**
- Extend `controllers/payment-webhook.controller.ts`
- Extend webhook routes + `middlewares/razorpay-webhook-signature.middleware.ts`
- Update `public.routes.ts` or webhook router for `/api/v1/public/webhooks/payments/razorpay`

**API endpoints:**
- `POST /api/v1/public/webhooks/payments/razorpay`

**DB fields:** None in route layer.

**Implementation steps:**
1. No user auth on webhook route.
2. Raw body middleware for signature verification where required.
3. Invalid signature → 401; duplicate → 200; success → provider-compatible `{ success: true }`.
4. Keep existing webhook route working during migration.

**Acceptance criteria:**
- Webhook route tests pass for signature missing/invalid/valid/duplicate.

**Test commands:**
```bash
npm run test -w backend/api -- razorpay-webhook 2>/dev/null || npm run test -w backend/api -- payment-webhook
```

**Depends on:** Ticket 24.

---

## Ticket 26 — Finance payment permissions seed

**Ticket:** 26 — Finance payment permissions seed

**Objective:** Add `finance:payments:read` permission and seed role mappings per Module 1 permissions doc.

**Files to create/update:**
- `backend/api/src/modules/auth/constants/auth-permission.constants.ts`
- Seed role matrix file(s) under `backend/api/src/database/seeds/` (follow existing seed-runner pattern)
- Update seed tests

**API endpoints:**
- `GET /api/v1/admin/finance/payments`
- `GET /api/v1/admin/finance/payments/:paymentId`

**DB fields:** `roles.permissions`, admin user permission assignments.

**Implementation steps:**
1. Add permission code `finance:payments:read`.
2. Grant to `SUPER_ADMIN` / super_admin wildcard or explicit code.
3. Grant read to `finance_admin`, `OPS_ADMIN` (operations_admin), read-only to `support_admin` if applicable.
4. Run seed-role-permission-matrix tests.

**Acceptance criteria:**
- Seed tests pass; admin routes enforce new permission.

**Test commands:**
```bash
npm run test -w backend/api -- seed-role-permission-matrix
```

**Depends on:** Ticket 23.

---

## Ticket 27 — Shared payment API types

**Ticket:** 27 — Shared payment API types

**Objective:** Add shared payment DTO types to `packages/shared` per Module 1 shared contracts plan.

**Files to create/update:**
- `packages/shared/api/finance/payment-record.types.ts` (create)
- `packages/shared/api/index.ts` (export)

**API endpoints:** Types mirror Ticket 4 contract DTOs.

**DB fields:** None.

**Implementation steps:**
1. Add types: `PaymentGateway`, `PaymentStatus`, `PaymentMethod`, `CreatePaymentOrderRequest`, `CreatePaymentOrderResponse`, `VerifyPaymentRequest`, `PaymentRecordResponse`, `AdminPaymentRecordResponse`, `AdminPaymentListQuery`, `AdminPaymentListResponse`.
2. Export from shared index.
3. Optional: update customer-app types to import shared types (only if in ticket scope — defer app changes unless minimal).

**Acceptance criteria:**
- `npm run typecheck -w packages/shared` passes.

**Test commands:**
```bash
npm run typecheck -w packages/shared
```

**Depends on:** Tickets 10, 11.

---

## Ticket 28 — OpenAPI payment paths

**Ticket:** 28 — OpenAPI payment paths

**Objective:** Register OpenAPI documentation for all Module 2 payment endpoints.

**Files to create/update:**
- Create or extend `backend/api/src/docs/openapi/payment-records.paths.ts` (or extend existing payment paths)
- Register in OpenAPI aggregator

**API endpoints:** Document all Module 2 payment endpoints with request/response/error schemas.

**DB fields:** Reference response field shapes from contract doc.

**Implementation steps:**
1. Document create-order, verify, customer get, admin list, admin detail, webhook.
2. Include error codes from Ticket 6.
3. Verify `curl .../openapi.json` includes new admin finance paths.

**Acceptance criteria:**
- OpenAPI JSON lists all Module 2 payment endpoints.

**Test commands:**
```bash
npm run typecheck -w backend/api && \
node -e "const o=require('./backend/api/openapi.json'); const p=JSON.stringify(o.paths||{}); console.log(p.includes('/admin/finance/payments')?'PASS':'FAIL')"
```

**Depends on:** Tickets 21–25.

---

## Ticket 29 — Route registry and contract doc updates

**Ticket:** 29 — Route registry and contract doc updates

**Objective:** Mark implemented Module 2 routes in registry; finalize contract cross-links.

**Files to create/update:**
- `docs/contracts/backend-route-registry.md` (update PLANNED → IMPLEMENTED for Module 2 payment routes)
- `docs/contracts/phase-9-finance-api-surface.md` (update status notes)
- `docs/contracts/payment-api.md` (cross-link or deprecation note for Phase 4 paths)

**API endpoints:** Mark IMPLEMENTED:
- Customer create, verify (both paths if aliased), get by id
- Admin finance list, detail
- Public webhook (and note legacy webhook path)

**DB fields:** Document `payment_records.*` and order finance fields in Ticket 4 contract (verify section complete).

**Implementation steps:**
1. Update registry table statuses and contract links.
2. Note Phase 4 compatibility routes.
3. Webhook marked signature-protected public route.

**Acceptance criteria:**
- Registry shows IMPLEMENTED for admin finance payment routes.

**Test commands:**
```bash
grep -q "admin/finance/payments" docs/contracts/backend-route-registry.md && \
grep -q "IMPLEMENTED" docs/contracts/backend-route-registry.md && echo PASS
```

**Depends on:** Tickets 22–25, 28.

---

## Ticket 30 — Payment service unit tests

**Ticket:** 30 — Payment service unit tests

**Objective:** Complete payment service unit test coverage per PDF micro-tasks.

**Files to create/update:**
- Extend `services/payment.service.test.ts` or create `__tests__/payment-record.service.test.ts`

**API endpoints:** Tests for create-order and verify flows.

**DB fields:** Assert writes to payment and order fields listed in PDF test section.

**Implementation steps:**
1. Tests: create success; order not found; wrong customer; already paid; zero payable; duplicate active payment; gateway failure; gatewayOrderId saved.
2. Tests: verify success; invalid signature; wrong customer; paid status transitions; order sync; failure fields; already paid blocked.

**Acceptance criteria:**
- All service unit tests pass.

**Test commands:**
```bash
npm run test -w backend/api -- payment.service.test
npm run test -w backend/api -- payment-record.service 2>/dev/null
```

**Depends on:** Tickets 16–19.

---

## Ticket 31 — Payment route and webhook tests

**Ticket:** 31 — Payment route and webhook tests

**Objective:** Add route-level tests for customer, admin, and webhook endpoints per PDF.

**Files to create/update:**
- Extend `routes/payment.routes.test.ts`
- Create `__tests__/payment-admin.routes.test.ts`
- Create `__tests__/razorpay-webhook.routes.test.ts`

**API endpoints:** All Module 2 HTTP endpoints.

**DB fields:** Assert customerId scope and admin scope in route tests where applicable.

**Implementation steps:**
1. Customer routes: 401 unauth, 400 invalid orderId, create success, verify missing signature, verify success, get own payment, deny other customer.
2. Admin routes: 401, 403 without permission, list with filters, detail, scoped admin denied outside city/store.
3. Webhook routes: missing signature 401, invalid 401, captured updates payment+order, duplicate no double update, failed event paths.

**Acceptance criteria:**
- All route test files pass.

**Test commands:**
```bash
npm run test -w backend/api -- payment.routes.test
npm run test -w backend/api -- payment-admin.routes 2>/dev/null
npm run test -w backend/api -- razorpay-webhook 2>/dev/null
```

**Depends on:** Tickets 22–25.

---

## Ticket 32 — Payment audit and integration tests

**Ticket:** 32 — Payment audit and integration tests

**Objective:** Verify audit writes and end-to-end payment record flow.

**Files to create/update:**
- Create `__tests__/payment-audit.test.ts`
- Create `__tests__/payment-records.integration.test.ts`

**API endpoints:**
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/:paymentId/verify`
- `POST /api/v1/public/webhooks/payments/razorpay`
- `GET /api/v1/admin/finance/payments`

**DB fields:** `audit_logs.*`, `payment_records.*`, order finance fields.

**Implementation steps:**
1. Audit tests: gateway order created, verified, failed, webhook received; metadata excludes secrets.
2. Integration: seed customer/store/order → create-order → verify → assert payment paid → assert order paid → admin list finds payment.

**Acceptance criteria:**
- Audit and integration tests pass when MongoDB available (skip gracefully if not, per repo convention).

**Test commands:**
```bash
npm run test -w backend/api -- payment-audit 2>/dev/null
npm run test -w backend/api -- payment-records.integration 2>/dev/null
```

**Depends on:** Tickets 24–25, 30.

---

## Ticket 33 — Payment test seed helper

**Ticket:** 33 — Payment test seed helper

**Objective:** Add dev/test seed helper for payable orders and payment test data.

**Files to create/update:**
- Create `backend/api/src/database/seeds/seed-payment-test-data.ts`
- Update seed runner registration if applicable
- Optional `package.json` script in backend/api

**API endpoints:** None.

**DB fields:** Seed orders with payable fields: itemSubtotal, discountAmount, deliveryFee, platformFee, taxAmount, grandTotal, payableAmount, paymentStatus, financeStatus.

**Implementation steps:**
1. Idempotent seed; skip when `APP_ENV=production`.
2. Seed test customer/store/order only for local/dev/test.
3. Document usage in Ticket 34 runbook.

**Acceptance criteria:**
- Seed script runs without error in dev environment.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 9, 20.

---

## Ticket 34 — Module 2 validation runbook and smoke checklist

**Ticket:** 34 — Module 2 validation runbook and smoke checklist

**Objective:** Document validation commands and manual smoke steps for Module 2 closeout.

**Files to create/update:**
- `docs/testing/phase-9-payment-records-backend-verification.md` (create)
- `docs/qa/phase-9-payment-records-backend-smoke-checklist.md` (create)

**API endpoints:** Checklist covers all Module 2 endpoints with curl examples.

**DB fields:** Smoke verification checklist: payment_records created, gatewayOrderId saved, paymentStatus updated, orders.paymentStatus updated, audit_logs created.

**Implementation steps:**
1. Runbook commands:
   - `npm run typecheck -w backend/api`
   - `npm run lint -w backend/api`
   - `npm run test -w backend/api -- payment`
   - `npm run test -w backend/api -- seed-role-permission-matrix`
   - OpenAPI verification
2. Smoke checklist with curl steps for create, verify, get, admin list/detail, signed webhook.
3. Record expected DB state after each step.

**Acceptance criteria:**
- Verification and smoke docs exist with full command list.

**Test commands:**
```bash
test -f docs/testing/phase-9-payment-records-backend-verification.md && \
test -f docs/qa/phase-9-payment-records-backend-smoke-checklist.md && echo PASS
```

**Depends on:** Tickets 30–33.

---

## Ticket 35 — Module 2 review and handoff

**Ticket:** 35 — Module 2 review and handoff

**Objective:** Close Module 2 with review doc, handoff updates, and execution ticket status DONE.

**Files to create/update:**
- `docs/reviews/phase-9-payment-records-backend-review.md` (create)
- `docs/handoffs/phase-9-payment-records-backend-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_9_HANDOFF.md` (update — Module 2 DONE)
- `project-context/CURRENT_PROGRESS.md` (update)
- `docs/reviews/phase-9-payment-records-backend-execution-tickets.md` (mark Tickets 1–35 DONE)

**API endpoints:** Summary of IMPLEMENTED Module 2 payment endpoints.

**DB fields:** Summary of payment_records and order finance fields added/extended.

**Implementation steps:**
1. List completed files from alignment doc.
2. Record verified permissions, audit events, tests run.
3. Set status `ready_for_refund_records_backend` per PDF.
4. Note dependencies for Refund Backend on `payment_records.refundedAmount`.
5. Confirm Repository & Codebase Setup not started.

**Acceptance criteria:**
- Handoff complete; all tickets marked DONE; review result PASS.

**Test commands:**
```bash
test -f docs/handoffs/phase-9-payment-records-backend-complete.md && \
grep -q "Module 2" project-context/PHASE_HANDOFFS/PHASE_9_HANDOFF.md && echo PASS
```

**Depends on:** Ticket 34.

---

## Module closeout

**Phase 9 Module 2 — Payment Records Backend:** COMPLETE (Tickets 21–35)

**Foundation gate (docs only):** Tickets 1–4 — complete before any runtime ticket.

**Next module after closeout:** **Module 3 — Ledger Foundation** (per PDF sequence) or next Phase 9 module per dependency map — verify against `phase-9-module-dependencies.md` before ticketizing.

**Execution order summary:**
```text
Tickets 1–4 (boundary, migration strategy, alignment, API contract)
  → 5–8 (scaffold, constants, audit, money util)
  → 9–13 (model, types, mappers, repository, validators)
  → 14–15 (gateway, env)
  → 16–20 (services + order sync)
  → 21–25 (controllers, routes, webhook)
  → 26–29 (permissions, shared types, OpenAPI, registry)
  → 30–33 (tests, seed)
  → 34–35 (verification, review, handoff)
```
