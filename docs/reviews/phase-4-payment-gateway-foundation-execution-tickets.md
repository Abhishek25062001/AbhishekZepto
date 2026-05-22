# Phase 4 Payment Gateway Foundation — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 8 — Payment Gateway Foundation  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Module 8 tasks, pages 52–54)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Module 8 micro-tasks, pages 18–20)

**Architecture references (Module 0–7):**  
`docs/architecture/phase-4-customer-shopping-architecture.md`, `docs/architecture/phase-4-backend-file-structure.md`, `docs/architecture/phase-4-inventory-lock-integration.md`, `docs/architecture/phase-4-audit-logging.md`, `docs/contracts/payment-api.md`, `docs/contracts/checkout-api.md`, `docs/database/payment-schema.md`, `docs/database/checkout-session-schema.md`, `docs/errors/phase-4-error-codes.md`, `docs/validation/phase-4-validation-rules.md`, `docs/contracts/phase-4-route-mounting-plan.md`, `docs/handoffs/phase-4-checkout-preparation-backend-complete.md`

**Prerequisites:**  
Phase 4 **Module 6 complete** (checkout sessions + inventory locks); Module 7 optional for E2E (customer pay UI is Module 9).

**PDF vs Module 0 alignment (implement using existing contracts):**

| PDF / legacy | Implementation |
|--------------|----------------|
| Create Razorpay order from checkout | `POST /customer/payments/create-order` |
| Client verify after checkout | `POST /customer/payments/verify` — HMAC signature validation |
| Webhook | `POST /webhooks/razorpay` — `payment.captured`, `payment.failed` |
| Idempotency | `idempotencyKey` on create-order and verify |
| Amount match | `payments.amount` = `checkout_sessions.summarySnapshot.grandTotal` (document paise at implementation) |
| Failure compensation | Release checkout locks; payment `failed`; checkout session `failed` |
| Order after pay | **Module 10** — verify returns `paymentId` + `status`; `orderId` null until order module |
| Razorpay SDK in app | **Module 9** — backend only returns `keyId` + order ids |
| Refunds / partial capture | **Out of scope** |

**Out of scope for this module:**
- Customer app Razorpay checkout UI (Module 9)
- Order creation, lock confirm, cart clear (Module 10)
- Admin/vendor payment dashboards
- `packages/shared` payment types unless one ticket adds minimal mirrors
- Repository & Codebase Setup (Phase 1)
- Changing checkout initiate/cancel route behavior (except `paymentId` linkage)

**Execution order notes:**
- Run **Tickets 1–2** (docs/contracts) before backend code.
- Run **Tickets 3–7** (env, dependency, scaffold, model, repo) before **Tickets 8–14** (gateway, services).
- Run **Tickets 15–18** (errors, validators, HTTP, webhooks) after services.
- Run **Tickets 19–22** (tests) after HTTP layer.
- Run **Tickets 23–25** (docs/registry/verification) then **Ticket 26** (handoff).

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-19)

---

## Ticket 1 — Module 8 implementation alignment docs

**Ticket:** 1 — Module 8 implementation alignment docs

**Objective:** Document payment scope, Razorpay flows, idempotency, failure compensation, and Module 10 boundary before coding.

**Files to create/update:**
- `docs/architecture/payment-gateway-foundation.md` (create)
- `docs/testing/payment-gateway-foundation-verification.md` (create)

**API endpoints:** Document consumer usage:
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/verify`
- `POST /api/v1/webhooks/razorpay`

**DB fields:** `payments` per `payment-schema.md`; `checkout_sessions.paymentId` linkage.

**Implementation steps:**
1. Create-order: validate checkout session `initiated`, not expired; amount = `summarySnapshot.grandTotal`; call Razorpay Orders API; persist `payments` with `status=created`.
2. Verify: validate Razorpay signature; idempotent if already `paid`; set `signatureVerified=true`, `status=paid`; **do not** create order (Module 10).
3. Webhook: verify `X-Razorpay-Signature`; handle `payment.captured` / `payment.failed` idempotently.
4. Failure: release checkout `lockTokens`; set payment `failed`; checkout `failed` or `cancelled` per contract.
5. Currency: INR; document amount units (paise recommended for Razorpay API).
6. QA: test keys in `.env`; mock gateway in unit tests.

**Acceptance criteria:**
- Docs match AllPhase Module 8 + PDF pages 18–20; no application code.

**Test commands:**
```bash
test -f docs/architecture/payment-gateway-foundation.md && \
test -f docs/testing/payment-gateway-foundation-verification.md && \
echo PASS
```

**Depends on:** Phase 4 Module 6 complete.

---

## Ticket 2 — Payment API contract and validation expansion

**Ticket:** 2 — Payment API contract and validation expansion

**Objective:** Expand `payment-api.md` with request/response JSON, webhook payload notes, and validation rules.

**Files to create/update:**
- `docs/contracts/payment-api.md` (update — examples, verify response without order in Module 8)
- `docs/database/payment-schema.md` (update — amount units note, status IMPLEMENTED placeholder)
- `docs/validation/phase-4-validation-rules.md` (update — expand Payment section)
- `docs/contracts/checkout-api.md` (update — cross-link payment create-order requires active session)

**API endpoints:**
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/verify`
- `POST /api/v1/webhooks/razorpay`

**DB fields:** Document all `payments` fields; `checkout_sessions.paymentId` set on create-order.

**Implementation steps:**
1. Create-order body: `checkoutSessionId`, `idempotencyKey`.
2. Create-order response: `paymentId`, `razorpayOrderId`, `amount`, `currency`, `keyId`.
3. Verify body: `paymentId`, `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`.
4. Verify response Module 8: `{ paymentId, status: 'paid', orderId: null }` with note Module 10 fills `orderId`.
5. Webhook: document signature header and minimum events.
6. Idempotency: duplicate create returns same payment; duplicate verify returns same result.

**Acceptance criteria:**
- Contract implementable without guessing payment behavior.

**Test commands:**
```bash
grep -q "create-order" docs/contracts/payment-api.md && \
grep -q "razorpaySignature" docs/contracts/payment-api.md && \
grep -q "Payment" docs/validation/phase-4-validation-rules.md && \
echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Razorpay env configuration and dependency

**Ticket:** 3 — Razorpay env configuration and dependency

**Objective:** Add Razorpay env validation and install official Razorpay Node SDK.

**Files to create/update:**
- `backend/api/src/config/env.ts` (update — `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`)
- `backend/api/.env.example` (update — uncomment/document vars)
- `backend/api/package.json` (update — add `razorpay` dependency)
- `docs/setup/phase-4-env-config.md` (update — Module 8 implements `env.ts`)

**API endpoints:** None.

**DB fields:** N/A.

**Implementation steps:**
1. All three Razorpay vars required when payment routes enabled in production; allow optional in development with gateway mock flag if needed (document in architecture doc only — prefer required in test env with mocks).
2. Export getters: `getRazorpayKeyId()`, `getRazorpayKeySecret()`, `getRazorpayWebhookSecret()`.
3. Pin `razorpay` package version in `package.json`.

**Acceptance criteria:**
- `npm install` succeeds; `npm run typecheck -w backend/api` passes.

**Test commands:**
```bash
grep RAZORPAY_KEY_ID backend/api/.env.example && \
npm run typecheck -w backend/api
```

**Depends on:** Ticket 2.

---

## Ticket 4 — Payment collection constant and module scaffold

**Ticket:** 4 — Payment collection constant and module scaffold

**Objective:** Add `PAYMENTS` collection constant and `backend/api/src/modules/payment/` folder layout.

**Files to create/update:**
- `backend/api/src/database/constants/collection-names.constants.ts` (update — `PAYMENTS: 'payments'`)
- `backend/api/src/modules/payment/` (create dirs: `models/`, `repositories/`, `services/`, `controllers/`, `routes/`, `validators/`, `gateways/`, `types/`, `constants/`, `utils/`)

**API endpoints:** None.

**DB fields:** Collection name `payments`.

**Implementation steps:**
1. Scaffold per `phase-4-backend-file-structure.md`.
2. Place Razorpay adapter at `gateways/razorpay.gateway.ts`.

**Acceptance criteria:**
- Folder tree exists; typecheck passes.

**Test commands:**
```bash
test -d backend/api/src/modules/payment/gateways && \
grep -q PAYMENTS backend/api/src/database/constants/collection-names.constants.ts && \
npm run typecheck -w backend/api
```

**Depends on:** Tickets 1–3.

---

## Ticket 5 — Payment status constants and gateway enum

**Ticket:** 5 — Payment status constants and gateway enum

**Objective:** Define payment status and gateway provider constants.

**Files to create/update:**
- `backend/api/src/modules/payment/constants/payment-status.constant.ts` (create)
- `backend/api/src/modules/payment/constants/payment-gateway.constant.ts` (create — `razorpay`)

**API endpoints:** None.

**DB fields:** `status`, `gateway` enums per schema.

**Implementation steps:**
1. Status values: `created`, `pending`, `paid`, `failed`, `cancelled`.
2. Gateway: `razorpay` only for Phase 4.

**Acceptance criteria:**
- Constants compile.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 4.

---

## Ticket 6 — Payment Mongoose model and types

**Ticket:** 6 — Payment Mongoose model and types

**Objective:** Implement `payments` model per `payment-schema.md`.

**Files to create/update:**
- `backend/api/src/modules/payment/models/payment.model.ts` (create)
- `backend/api/src/modules/payment/types/payment.types.ts` (create — `PaymentRecord`, DTOs)

**API endpoints:** None.

**DB fields:** All schema fields including `signatureVerified`, `webhookReceivedAt`, `failureCode`, `metadata`.

**Implementation steps:**
1. Indexes per `phase-4-index-plan.md`: unique `gatewayOrderId`, unique sparse `idempotencyKey`, `checkoutSessionId`.
2. `amount` stored as integer paise (document in model comment).

**Acceptance criteria:**
- Model compiles; enums match schema.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 5.

---

## Ticket 7 — Payment repository

**Ticket:** 7 — Payment repository

**Objective:** CRUD helpers for payment records.

**Files to create/update:**
- `backend/api/src/modules/payment/repositories/payment.repository.ts` (create)

**API endpoints:** N/A (data layer).

**DB fields:** Read/write all payment fields.

**Implementation steps:**
1. `findPaymentByIdForCustomer(paymentId, customerId)`.
2. `findPaymentByIdempotencyKey(customerId, idempotencyKey)`.
3. `findPaymentByGatewayOrderId(gatewayOrderId)`.
4. `createPayment`, `updatePaymentById`.

**Acceptance criteria:**
- Repository compiles.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 6.

---

## Ticket 8 — Payment amount and Razorpay signature utilities

**Ticket:** 8 — Payment amount and Razorpay signature utilities

**Objective:** Pure utils for rupees→paise conversion and Razorpay payment signature verification.

**Files to create/update:**
- `backend/api/src/modules/payment/utils/payment-amount.util.ts` (create)
- `backend/api/src/modules/payment/utils/razorpay-signature.util.ts` (create)

**API endpoints:** N/A.

**DB fields:** `amount` in paise; verify uses `razorpayOrderId|razorpayPaymentId` HMAC.

**Implementation steps:**
1. `toPaise(rupees: number): number` — round to integer paise.
2. `verifyRazorpayPaymentSignature({ orderId, paymentId, signature, secret })` — per Razorpay docs.
3. Unit-test signature util with known test vectors (Razorpay test mode docs).

**Acceptance criteria:**
- Util tests pass for amount rounding and signature valid/invalid cases.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/payment/utils/payment-amount.util.test.js && \
node --test dist/modules/payment/utils/razorpay-signature.util.test.js
```

**Depends on:** Ticket 4.

---

## Ticket 9 — Razorpay gateway adapter

**Ticket:** 9 — Razorpay gateway adapter

**Objective:** Wrap Razorpay Orders API create; isolate SDK for mocking in tests.

**Files to create/update:**
- `backend/api/src/modules/payment/gateways/razorpay.gateway.ts` (create)
- `backend/api/src/modules/payment/types/razorpay-gateway.types.ts` (create)

**API endpoints:** External Razorpay Orders API.

**DB fields:** Maps response to `gatewayOrderId`, amount, currency.

**Implementation steps:**
1. `createRazorpayOrder({ amountPaise, currency, receipt, notes })` → `{ id, amount, currency }`.
2. Use env key id/secret; map SDK errors to `PAYMENT_GATEWAY_ERROR`.
3. No capture/refund methods in Module 8.

**Acceptance criteria:**
- Gateway compiles; mockable interface for tests.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 3, 8.

---

## Ticket 10 — Checkout session validation for payment

**Ticket:** 10 — Checkout session validation for payment

**Objective:** Validate checkout session is payable before create-order.

**Files to create/update:**
- `backend/api/src/modules/payment/utils/payment-checkout-validation.util.ts` (create)
- Reuse `checkout` repository; `checkout-session-expiry` util

**API endpoints:** Used by create-order and verify.

**DB fields:** Reads `checkout_sessions` — `status`, `reservationExpiresAt`, `summarySnapshot.grandTotal`, `customerId`.

**Implementation steps:**
1. Session must exist, belong to customer, `status=initiated`, not expired.
2. `CHECKOUT_SESSION_EXPIRED` / `CHECKOUT_SESSION_NOT_FOUND` errors.
3. Amount helper compares expected grand total (rupees) to payment record at create time.

**Acceptance criteria:**
- Validation util throws documented checkout/payment errors.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 7; Module 6 checkout module.

---

## Ticket 11 — Payment failure compensation utility

**Ticket:** 11 — Payment failure compensation utility

**Objective:** Release checkout locks and mark session/payment failed on payment failure paths.

**Files to create/update:**
- `backend/api/src/modules/payment/utils/payment-failure-compensation.util.ts` (create)
- Reuse `checkout-inventory-lock.util` `releaseCheckoutLocks`; checkout repository update

**API endpoints:** N/A (called from verify fail / webhook fail).

**DB fields:** Updates `payments.status=failed`, `checkout_sessions.status=failed`, `failureReason`.

**Implementation steps:**
1. `compensateFailedPayment({ checkoutSession, payment, reason, actorUserId })`.
2. Release all `lockTokens`; do not confirm locks.
3. Idempotent if already released.

**Acceptance criteria:**
- Util compiles; callable from service layer.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 10; Module 6.

---

## Ticket 12 — Payment create-order service

**Ticket:** 12 — Payment create-order service

**Objective:** Implement `createPaymentOrderForCustomer` — validate checkout, create Razorpay order, persist payment, link `checkout_sessions.paymentId`.

**Files to create/update:**
- `backend/api/src/modules/payment/services/payment.service.ts` (create — create-order method)
- `backend/api/src/modules/payment/constants/payment-audit-events.constant.ts` (create)
- `backend/api/src/modules/checkout/repositories/checkout-session.repository.ts` (update — set `paymentId`)

**API endpoints:**
- `POST /api/v1/customer/payments/create-order`

**DB fields:** Creates `payments`; sets `checkout_sessions.paymentId`.

**Implementation steps:**
1. Idempotency: return existing payment if same `idempotencyKey` and not failed.
2. Validate checkout session (Ticket 10).
3. `createRazorpayOrder` with amount from `summarySnapshot.grandTotal`.
4. Persist payment `status=created`, `signatureVerified=false`.
5. Audit `payment.order_created`.

**Acceptance criteria:**
- Service returns `paymentId`, `razorpayOrderId`, `amount`, `currency`, `keyId`.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 9–11.

---

## Ticket 13 — Payment verify service (no order creation)

**Ticket:** 13 — Payment verify service (no order creation)

**Objective:** Implement `verifyPaymentForCustomer` — signature check, idempotent paid state; defer order to Module 10.

**Files to create/update:**
- `backend/api/src/modules/payment/services/payment.service.ts` (update — verify method)

**API endpoints:**
- `POST /api/v1/customer/payments/verify`

**DB fields:** Updates `gatewayPaymentId`, `status=paid`, `signatureVerified=true`.

**Implementation steps:**
1. Load payment + checkout session; verify customer ownership.
2. If already `paid` and `signatureVerified` → return idempotent success (`PAYMENT_ALREADY_PAID` or 200 with same payload per contract).
3. Validate signature via `razorpay-signature.util`.
4. On failure: `compensateFailedPayment`; throw `PAYMENT_VERIFICATION_FAILED`.
5. On success: update payment; audit `payment.verified`; return `{ paymentId, status: 'paid', orderId: null }`.
6. **Do not** call order service (Module 10).

**Acceptance criteria:**
- Verify succeeds with valid test signature; fails closed on invalid signature.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 12.

---

## Ticket 14 — Razorpay webhook service and raw-body handling

**Ticket:** 14 — Razorpay webhook service and raw-body handling

**Objective:** Webhook endpoint with signature verification and idempotent event handling.

**Files to create/update:**
- `backend/api/src/modules/payment/services/payment-webhook.service.ts` (create)
- `backend/api/src/modules/payment/middlewares/razorpay-webhook-signature.middleware.ts` (create)
- `backend/api/src/routes/v1/webhooks.routes.ts` (create)
- `backend/api/src/routes/v1/index.ts` (update — mount `/webhooks`)
- `backend/api/src/app.ts` or route setup (update — raw body for webhook path only if needed)

**API endpoints:**
- `POST /api/v1/webhooks/razorpay`

**DB fields:** Updates payment status; `webhookReceivedAt`; may trigger same compensation as verify fail.

**Implementation steps:**
1. Verify `X-Razorpay-Signature` with webhook secret + raw body.
2. Handle `payment.captured` → mark paid if not already (align with verify path).
3. Handle `payment.failed` → compensate + `payment.failed`.
4. Idempotent: ignore duplicate events for same `gatewayPaymentId`.
5. No JWT auth on webhook route.

**Acceptance criteria:**
- Webhook route registered; invalid signature returns 401/400.

**Test commands:**
```bash
npm run typecheck -w backend/api && npm run build -w backend/api
```

**Depends on:** Tickets 11, 13.

---

## Ticket 15 — Payment error codes and mapper

**Ticket:** 15 — Payment error codes and mapper

**Objective:** Register payment codes in global catalog and map domain errors.

**Files to create/update:**
- `backend/api/src/errors/error-codes.ts` (update — `PAYMENT_*` codes)
- `backend/api/src/modules/payment/utils/payment-error.mapper.ts` (create)
- `backend/api/src/modules/payment/constants/payment-error-codes.constant.ts` (create)
- `docs/errors/phase-4-error-codes.md` (update — note implemented Module 8)

**API endpoints:** All payment routes.

**DB fields:** N/A.

**Implementation steps:**
1. Map all codes from `phase-4-error-codes.md` Payment section.
2. `PAYMENT_AMOUNT_MISMATCH` when Razorpay amount ≠ checkout grand total.
3. Reuse checkout session errors where appropriate from checkout mapper or re-export.

**Acceptance criteria:**
- All payment codes in `error-codes.ts`.

**Test commands:**
```bash
grep PAYMENT_VERIFICATION_FAILED backend/api/src/errors/error-codes.ts && \
npm run typecheck -w backend/api
```

**Depends on:** Ticket 13.

---

## Ticket 16 — Payment validators

**Ticket:** 16 — Payment validators

**Objective:** Zod validators for create-order, verify, and webhook payload shape (minimal).

**Files to create/update:**
- `backend/api/src/modules/payment/validators/payment.validators.ts` (create)

**API endpoints:**
- `POST /create-order` body
- `POST /verify` body

**DB fields:** N/A.

**Implementation steps:**
1. Create-order: `checkoutSessionId`, `idempotencyKey` (required, max 128).
2. Verify: `paymentId`, `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature` (non-empty strings).
3. Webhook: validate event envelope minimally (`event`, `payload` presence).

**Acceptance criteria:**
- Invalid bodies rejected before service.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 15.

---

## Ticket 17 — Payment customer controller, routes, and mount

**Ticket:** 17 — Payment customer controller, routes, and mount

**Objective:** HTTP layer for customer payment endpoints.

**Files to create/update:**
- `backend/api/src/modules/payment/controllers/payment.controller.ts` (create)
- `backend/api/src/modules/payment/routes/payment.routes.ts` (create)
- `backend/api/src/modules/payment/utils/payment-response.mapper.ts` (create)
- `backend/api/src/routes/v1/customer.routes.ts` (update — `router.use('/payments', ...)`)

**API endpoints:**
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/verify`

**DB fields:** Via service.

**Implementation steps:**
1. Chain: `authenticate` → `requireRole([CUSTOMER])` → validate → controller.
2. Standard API envelope.
3. Return public `keyId` only on create-order (never secret).

**Acceptance criteria:**
- Routes mounted per `phase-4-route-mounting-plan.md`.

**Test commands:**
```bash
npm run typecheck -w backend/api && npm run build -w backend/api
```

**Depends on:** Tickets 16, 13.

---

## Ticket 18 — Payment gateway adapter unit tests

**Ticket:** 18 — Payment gateway adapter unit tests

**Objective:** Unit tests for amount, signature, and gateway (mocked SDK).

**Files to create/update:**
- `backend/api/src/modules/payment/utils/payment-amount.util.test.ts` (create)
- `backend/api/src/modules/payment/utils/razorpay-signature.util.test.ts` (create)
- `backend/api/src/modules/payment/gateways/razorpay.gateway.test.ts` (create — mock SDK)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Amount: rupees to paise edge cases (decimals).
2. Signature: valid/invalid HMAC.
3. Gateway: mock Razorpay client error → `PAYMENT_GATEWAY_ERROR`.

**Acceptance criteria:**
- Util/gateway tests pass.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/payment/utils/payment-amount.util.test.js && \
node --test dist/modules/payment/utils/razorpay-signature.util.test.js && \
node --test dist/modules/payment/gateways/razorpay.gateway.test.js
```

**Depends on:** Tickets 8–9.

---

## Ticket 19 — Payment service unit tests

**Ticket:** 19 — Payment service unit tests

**Objective:** Service tests for create-order, verify, idempotency, and failure compensation (mocked gateway/repo).

**Files to create/update:**
- `backend/api/src/modules/payment/services/payment.service.test.ts` (create)
- `backend/api/src/modules/payment/services/payment-webhook.service.test.ts` (create)

**API endpoints:** Service-level.

**DB fields:** Mocked.

**Implementation steps:**
1. Create-order persists payment and links checkout.
2. Verify success updates status; invalid signature compensates.
3. Idempotent verify returns without double update.
4. Webhook captured/failed paths.

**Acceptance criteria:**
- Service tests pass.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/payment/services/payment.service.test.js && \
node --test dist/modules/payment/services/payment-webhook.service.test.js
```

**Depends on:** Ticket 17.

---

## Ticket 20 — Payment route tests and package script

**Ticket:** 20 — Payment route tests and package script

**Objective:** Route smoke tests and `test:customer-payment` npm script.

**Files to create/update:**
- `backend/api/src/modules/payment/routes/payment.routes.test.ts` (create)
- `backend/api/package.json` (update — `test:customer-payment` script)

**API endpoints:** Route registration for create-order, verify.

**DB fields:** N/A.

**Implementation steps:**
1. Assert router exposes POST `/create-order`, POST `/verify`.
2. Validators reject missing fields.
3. Script runs payment util + service + route tests.

**Acceptance criteria:**
- `npm run test:customer-payment -w backend/api` passes.

**Test commands:**
```bash
npm run test:customer-payment -w backend/api
```

**Depends on:** Tickets 18–19.

---

## Ticket 21 — Contract, registry, and architecture doc updates

**Ticket:** 21 — Contract, registry, and architecture doc updates

**Objective:** Mark payment behavior IMPLEMENTED in docs and registry.

**Files to create/update:**
- `docs/contracts/payment-api.md` (update — status IMPLEMENTED)
- `docs/contracts/backend-route-registry.md` (update — payment + webhook routes)
- `docs/contracts/phase-4-route-mounting-plan.md` (update — Payments + webhooks IMPLEMENTED)
- `docs/architecture/phase-4-backend-file-structure.md` (update — `payment/` IMPLEMENTED)
- `docs/setup/phase-4-env-config.md` (update — env.ts implemented note)

**API endpoints:**
- Customer payment routes + webhook → **IMPLEMENTED**

**DB fields:** Documented as live.

**Implementation steps:**
1. Link architecture + verification docs.
2. Note order creation deferred to Module 10.

**Acceptance criteria:**
- Registry lists create-order, verify, and webhook.

**Test commands:**
```bash
grep -q "payments/create-order" docs/contracts/backend-route-registry.md && \
grep -q "IMPLEMENTED" docs/contracts/payment-api.md && \
grep -q "webhooks/razorpay" docs/contracts/backend-route-registry.md && \
echo PASS
```

**Depends on:** Ticket 20.

---

## Ticket 22 — Module 8 verification checklist and smoke results

**Ticket:** 22 — Module 8 verification checklist and smoke results

**Objective:** Verification checklist and smoke template for payment flows.

**Files to create/update:**
- `docs/testing/payment-gateway-foundation-verification.md` (update — checkboxes)
- `docs/testing/phase-4-module-8-smoke-results.md` (create)

**API endpoints:** Checklist covers create-order, verify, webhook, failure compensation.

**DB fields:** Verify `payments` and `checkout_sessions.paymentId` in MongoDB.

**Implementation steps:**
1. curl: checkout initiate → create-order → verify with Razorpay test payment.
2. Invalid signature → locks released, payment failed.
3. Duplicate idempotency key → same payment returned.
4. Webhook test via Razorpay dashboard or CLI (document).

**Acceptance criteria:**
- Smoke results file exists.

**Test commands:**
```bash
test -f docs/testing/phase-4-module-8-smoke-results.md && echo PASS
```

**Depends on:** Ticket 21.

---

## Ticket 23 — Module 8 handoff and project context closeout

**Ticket:** 23 — Module 8 handoff and project context closeout

**Objective:** Close Module 8; update handoff files.

**Files to create/update:**
- `docs/handoffs/phase-4-payment-gateway-foundation-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — Module 8 DONE)
- `project-context/CURRENT_PROGRESS.md` (update)
- `docs/reviews/phase-4-payment-gateway-foundation-execution-tickets.md` (update — all DONE)

**API endpoints:** Summary of create-order, verify, webhook.

**DB fields:** `payments` collection live; `checkout_sessions.paymentId` populated.

**Implementation steps:**
1. List artifacts, env vars, test commands.
2. Known limitations: no order on verify (Module 10); no customer SDK (Module 9).
3. Next: Module 9 Customer App Payment Flow.

**Acceptance criteria:**
- Handoff complete; Module 9 not started.

**Test commands:**
```bash
test -f docs/handoffs/phase-4-payment-gateway-foundation-complete.md && \
grep "Module 8" project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md
```

**Depends on:** Ticket 22.

---

## Module closeout

**Phase 4 Module 8 — Payment Gateway Foundation:** `DONE` (Tickets 1–23)

**Next module to implement:** **Module 9 — Customer App Payment Flow** (after Ticket 23 DONE)

**Execution order summary:**
```text
1–2 docs → 3–7 model/repo → 8–14 gateway/services/webhook
→ 15–17 HTTP → 18–20 tests → 21–23 closeout
```
