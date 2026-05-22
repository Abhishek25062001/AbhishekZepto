# Phase 4 Customer App Payment Flow — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 9 — Customer App Payment Flow  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Module 9 tasks, pages 54–56)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Module 9 micro-tasks, pages 20–22)

**Architecture references (Module 0–8):**  
`docs/architecture/phase-4-customer-shopping-architecture.md`, `docs/architecture/phase-4-customer-app-file-structure.md`, `docs/architecture/customer-app-checkout-flow.md`, `docs/architecture/payment-gateway-foundation.md`, `docs/contracts/payment-api.md`, `docs/contracts/customer-app-checkout-ui-contract.md`, `docs/contracts/checkout-api.md`, `docs/errors/phase-4-error-codes.md`, `docs/validation/phase-4-validation-rules.md`, `docs/setup/phase-4-env-config.md`, `docs/handoffs/phase-4-payment-gateway-foundation-complete.md`, `docs/handoffs/phase-4-customer-app-checkout-flow-complete.md`

**Prerequisites:**  
Phase 4 **Module 8 complete** (payment create-order + verify APIs); **Module 7 complete** (`CheckoutScreen`, checkout session id storage, disabled pay CTA).

**PDF vs Module 0 alignment (implement using existing contracts):**

| PDF / legacy | Implementation |
|--------------|----------------|
| Razorpay SDK checkout | `react-native-razorpay` via `modules/payment/services/razorpay-checkout.service.ts` |
| Pay from checkout | Enable `CheckoutScreen` **Pay now** → create-order → open SDK → verify |
| Create payment order | `POST /customer/payments/create-order` with `checkoutSessionId`, `idempotencyKey` |
| Verify after pay | `POST /customer/payments/verify` with Razorpay callback ids + signature |
| Public key | `keyId` from create-order response; optional `RAZORPAY_KEY_ID` in app `.env` fallback |
| Amount | Use API `amount` (paise) + `currency` for SDK — do not recompute totals client-side |
| Failure / retry | `PaymentErrorState` + retry pay; map `PAYMENT_*` errors |
| Success UX | Interim success UI on checkout (`paymentId`); **no** `OrderSuccess` route until Module 11 |
| Order after pay | **Module 10** — verify returns `orderId: null`; do not call order APIs |
| Webhook | **Module 8** — server only; no client webhook |
| Cancel on pay | **Do not** call `POST /checkout/cancel` when starting payment (Module 7 policy) |

**Out of scope for this module:**
- Backend API, MongoDB, or `payments` schema changes (Module 8)
- Order creation, cart clear, lock confirm (Module 10)
- `OrderSuccess`, `OrderDetail`, `OrderHistory` screens (Module 11)
- Coupons / split payments / refunds
- `packages/shared` payment types unless one ticket adds minimal mirrors
- Repository & Codebase Setup (Phase 1)
- Admin / vendor surfaces

**Execution order notes:**
- Run **Tickets 1–2** (docs/contracts) before customer-app code.
- Run **Tickets 3–5** (env, SDK dependency, scaffold) before **Tickets 6–14** (API, services, hooks).
- Run **Tickets 15–17** (UI components) before **Tickets 18–19** (CheckoutScreen wiring).
- Run **Tickets 20–22** (unit tests) after hooks/utils.
- Run **Tickets 23–25** (docs/registry/verification) then **Ticket 26** (handoff).

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-19)

---

## Ticket 1 — Module 9 implementation alignment docs

**Ticket:** 1 — Module 9 implementation alignment docs

**Objective:** Document customer-app payment scope, Razorpay SDK flow, verify sequence, failure/retry, and Module 10/11 boundaries before coding.

**Files to create/update:**
- `docs/architecture/customer-app-payment-flow.md` (create)
- `docs/testing/customer-app-payment-flow-verification.md` (create)

**API endpoints:** Document consumer usage:
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/verify`

**DB fields:** N/A (client DTOs: `paymentId`, `razorpayOrderId`, `amount`, `currency`, `keyId`; verify `status`, `orderId`).

**Implementation steps:**
1. Flow: active checkout session → **Pay now** → `create-order` → open Razorpay → success callback → `verify` → interim success UI.
2. `checkoutSessionId` from `checkout-session-storage.util`; new `idempotencyKey` (UUID) per pay attempt.
3. SDK options: `key`, `order_id`, `amount`, `currency`, `name`/`description` from store/cart context (minimal).
4. On `PAYMENT_VERIFICATION_FAILED` / user dismiss: show retry; do not cancel checkout unless user leaves screen.
5. On verify success with `orderId: null`: show “Payment successful” + `paymentId`; note order placement is Module 10/11.
6. Block pay when reservation expired, no session, or payment in flight.
7. QA: Razorpay test keys, customer `9999999999`, Module 8 API running, checkout initiated.

**Acceptance criteria:**
- Docs match AllPhase Module 9 + PDF pages 20–22; no application code.

**Test commands:**
```bash
test -f docs/architecture/customer-app-payment-flow.md && \
test -f docs/testing/customer-app-payment-flow-verification.md && \
echo PASS
```

**Depends on:** Phase 4 Modules 7–8 complete.

---

## Ticket 2 — Customer app payment UI contract

**Ticket:** 2 — Customer app payment UI contract

**Objective:** Define payment module layout, hooks, Razorpay service, error UX, and checkout integration (mirror `customer-app-checkout-ui-contract.md`).

**Files to create/update:**
- `docs/contracts/customer-app-payment-ui-contract.md` (create)
- `docs/contracts/customer-app-checkout-ui-contract.md` (update — enable Pay CTA, link payment contract)
- `docs/validation/phase-4-validation-rules.md` (update — **Customer app payment** section)

**API endpoints:** Maps UI actions to:
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/verify`

**DB fields:** N/A — DTO fields per `payment-api.md`.

**Implementation steps:**
1. Module path: `apps/customer-app/src/modules/payment/`.
2. Service: `razorpay-checkout.service.ts` — `openRazorpayCheckout(options)`.
3. Hooks: `useCreatePaymentOrder`, `useVerifyPayment`, `useCheckoutPayment` (orchestrator).
4. Components: `PaymentProcessingOverlay`, `PaymentErrorState`, `PaymentSuccessBanner`.
5. Error table: `PAYMENT_*`, `CHECKOUT_SESSION_EXPIRED` on create-order.
6. Checkout: replace disabled pay button with wired `useCheckoutPayment`.
7. Success: inline on `CheckoutScreen` — no new stack route in Module 9.

**Acceptance criteria:**
- Contract implementable without guessing hook/service names.

**Test commands:**
```bash
test -f docs/contracts/customer-app-payment-ui-contract.md && \
grep -q "customer-app-payment-ui-contract" docs/contracts/customer-app-checkout-ui-contract.md && \
grep -q "Customer app payment" docs/validation/phase-4-validation-rules.md && \
echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Customer app Razorpay env configuration

**Ticket:** 3 — Customer app Razorpay env configuration

**Objective:** Add optional `RAZORPAY_KEY_ID` to customer-app env for SDK fallback (prefer `keyId` from create-order API).

**Files to create/update:**
- `apps/customer-app/src/config/env.ts` (update — `RAZORPAY_KEY_ID` optional)
- `apps/customer-app/.env.example` (update — uncomment `RAZORPAY_KEY_ID`)
- `docs/setup/phase-4-env-config.md` (update — Module 9 implements customer-app `env.ts`)

**API endpoints:** None.

**DB fields:** N/A.

**Implementation steps:**
1. Export `RAZORPAY_KEY_ID` from runtime env (optional string).
2. Document: create-order `keyId` takes precedence over env when both present.
3. Never store `RAZORPAY_KEY_SECRET` in the app.

**Acceptance criteria:**
- `npm run typecheck -w apps/customer-app` passes.

**Test commands:**
```bash
grep RAZORPAY_KEY_ID apps/customer-app/.env.example && \
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 2.

---

## Ticket 4 — Razorpay React Native SDK dependency

**Ticket:** 4 — Razorpay React Native SDK dependency

**Objective:** Add `react-native-razorpay` dependency and document native linking expectations.

**Files to create/update:**
- `apps/customer-app/package.json` (update — add `react-native-razorpay`)
- `docs/architecture/customer-app-payment-flow.md` (update — SDK package name, native build note)

**API endpoints:** None.

**DB fields:** N/A.

**Implementation steps:**
1. Pin `react-native-razorpay` version compatible with project RN `0.85.x`.
2. Document Android/iOS rebuild required after install.
3. No custom native code beyond autolinking unless SDK docs require ProGuard/manifest entries (document only).

**Acceptance criteria:**
- `npm install` succeeds; `npm run typecheck -w apps/customer-app` passes.

**Test commands:**
```bash
grep react-native-razorpay apps/customer-app/package.json && \
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 3.

---

## Ticket 5 — Payment module scaffold

**Ticket:** 5 — Payment module scaffold

**Objective:** Create `apps/customer-app/src/modules/payment/` folder layout per `phase-4-customer-app-file-structure.md`.

**Files to create/update:**
- `apps/customer-app/src/modules/payment/` (create dirs: `api/`, `hooks/`, `services/`, `components/`, `types/`, `utils/`)

**API endpoints:** None.

**DB fields:** N/A.

**Implementation steps:**
1. Scaffold only; mirror `checkout/` layout + `services/` for Razorpay.
2. No screens folder in Module 9 (payment embedded in `CheckoutScreen`).

**Acceptance criteria:**
- Folder tree exists; typecheck passes.

**Test commands:**
```bash
test -d apps/customer-app/src/modules/payment/services && \
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 1–4.

---

## Ticket 6 — Payment types

**Ticket:** 6 — Payment types

**Objective:** Define TypeScript types mirroring `payment-api.md` request/response shapes.

**Files to create/update:**
- `apps/customer-app/src/modules/payment/types/payment.types.ts` (create)

**API endpoints:** DTO shapes for create-order and verify.

**DB fields:** N/A — types for `paymentId`, `razorpayOrderId`, `amount` (paise), `currency`, `keyId`, verify `status`, `orderId`.

**Implementation steps:**
1. `CreatePaymentOrderInput`: `checkoutSessionId`, `idempotencyKey`.
2. `CreatePaymentOrderResponse`: `paymentId`, `razorpayOrderId`, `amount`, `currency`, `keyId`.
3. `VerifyPaymentInput`: `paymentId`, `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`.
4. `VerifyPaymentResponse`: `paymentId`, `status`, `orderId` (nullable).
5. `RazorpayCheckoutSuccess`: SDK callback shape (`razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`).

**Acceptance criteria:**
- Types align with `docs/contracts/payment-api.md` JSON examples.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 5.

---

## Ticket 7 — Payment API client

**Ticket:** 7 — Payment API client

**Objective:** HTTP client functions for Module 8 payment endpoints.

**Files to create/update:**
- `apps/customer-app/src/modules/payment/api/customer-payment.api.ts` (create)

**API endpoints:**
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/verify`

**DB fields:** N/A.

**Implementation steps:**
1. `createPaymentOrder(input)` — POST body; unwrap standard API envelope.
2. `verifyPayment(input)` — POST body.
3. Reuse `apiClient` from `services/api/client` (auth headers automatic).

**Acceptance criteria:**
- Client compiles; paths match `payment-api.md`.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 6.

---

## Ticket 8 — Payment query keys and idempotency util

**Ticket:** 8 — Payment query keys and idempotency util

**Objective:** React Query keys and client idempotency key generator for create-order.

**Files to create/update:**
- `apps/customer-app/src/modules/payment/utils/payment-query-keys.util.ts` (create)
- `apps/customer-app/src/modules/payment/utils/payment-idempotency.util.ts` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Query keys: `['customer-payment', 'create-order', checkoutSessionId?]`.
2. `createPaymentIdempotencyKey()` — UUID v4 or equivalent unique string (max 128 chars).
3. New key per user-initiated pay attempt (not reused after failed verify unless contract idempotency applies to create-order only).

**Acceptance criteria:**
- Utils compile.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 7.

---

## Ticket 9 — Payment error message util

**Ticket:** 9 — Payment error message util

**Objective:** Map `PAYMENT_*` and related checkout errors to user-facing messages and type guards.

**Files to create/update:**
- `apps/customer-app/src/modules/payment/utils/customer-payment-error-message.util.ts` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. `getPaymentErrorCode`, `getPaymentErrorMessage` (axios error shape).
2. Guards: `isPaymentVerificationFailedError`, `isPaymentGatewayError`, `isCheckoutSessionExpiredOnPaymentError`, etc.
3. Messages per `phase-4-error-codes.md` Payment section.
4. Razorpay SDK user-cancel → friendly “Payment cancelled” (non-API error).

**Acceptance criteria:**
- Util exports guards used by payment UI components.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 7.

---

## Ticket 10 — Razorpay checkout service

**Ticket:** 10 — Razorpay checkout service

**Objective:** Wrap `react-native-razorpay` `open` call with typed options from create-order response.

**Files to create/update:**
- `apps/customer-app/src/modules/payment/services/razorpay-checkout.service.ts` (create)

**API endpoints:** External Razorpay SDK (uses `keyId`, `razorpayOrderId`, `amount`, `currency` from create-order).

**DB fields:** N/A.

**Implementation steps:**
1. `openRazorpayCheckout({ keyId, orderId, amount, currency, name?, description?, prefill? })` → Promise with payment ids + signature.
2. Map SDK success payload to `VerifyPaymentInput` fields.
3. Reject on user dismiss / SDK error with distinguishable error type for UI.
4. Use env `RAZORPAY_KEY_ID` only if API `keyId` missing (dev fallback).

**Acceptance criteria:**
- Service compiles; no verify HTTP call inside service (verify in hook).

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 4, 6.

---

## Ticket 11 — useCreatePaymentOrder hook

**Ticket:** 11 — useCreatePaymentOrder hook

**Objective:** React Query mutation for `POST /payments/create-order`.

**Files to create/update:**
- `apps/customer-app/src/modules/payment/hooks/useCreatePaymentOrder.ts` (create)

**API endpoints:**
- `POST /api/v1/customer/payments/create-order`

**DB fields:** N/A.

**Implementation steps:**
1. Input: `checkoutSessionId`, optional `idempotencyKey` (generate if omitted).
2. Return create-order response for Razorpay service.
3. Surface API errors via mutation `error`.

**Acceptance criteria:**
- Hook compiles; uses `customer-payment.api.ts`.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 8, 7.

---

## Ticket 12 — useVerifyPayment hook

**Ticket:** 12 — useVerifyPayment hook

**Objective:** React Query mutation for `POST /payments/verify`.

**Files to create/update:**
- `apps/customer-app/src/modules/payment/hooks/useVerifyPayment.ts` (create)

**API endpoints:**
- `POST /api/v1/customer/payments/verify`

**DB fields:** N/A.

**Implementation steps:**
1. Accept `VerifyPaymentInput` from Razorpay success payload + stored `paymentId`.
2. Return `VerifyPaymentResponse` (`orderId` may be `null`).
3. Idempotent success handled by API (200 with same payload).

**Acceptance criteria:**
- Hook compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 7.

---

## Ticket 13 — useCheckoutPayment orchestration hook

**Ticket:** 13 — useCheckoutPayment orchestration hook

**Objective:** Single hook coordinating create-order → Razorpay open → verify for `CheckoutScreen`.

**Files to create/update:**
- `apps/customer-app/src/modules/payment/hooks/useCheckoutPayment.ts` (create)

**API endpoints:**
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/verify`

**DB fields:** N/A.

**Implementation steps:**
1. Read `checkoutSessionId` from `getActiveCheckoutSessionId()`.
2. `pay()` async: create-order → open Razorpay → verify.
3. Expose `isProcessing`, `error`, `paymentResult` (verify response), `reset`.
4. Do not call checkout cancel on failure.
5. Throw if no active checkout session id.

**Acceptance criteria:**
- Hook compiles; documents state machine in JSDoc or architecture doc.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 10–12.

---

## Ticket 14 — Payment processing overlay component

**Ticket:** 14 — Payment processing overlay component

**Objective:** Loading UI while create-order, SDK, or verify is in progress.

**Files to create/update:**
- `apps/customer-app/src/modules/payment/components/PaymentProcessingOverlay.tsx` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Full-screen or modal overlay with spinner + “Processing payment…”.
2. Block duplicate pay taps while visible.
3. Use existing `Loader` / theme tokens.

**Acceptance criteria:**
- Component renders; typecheck passes.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 5.

---

## Ticket 15 — Payment error state component

**Ticket:** 15 — Payment error state component

**Objective:** Error UI with retry for failed payment or verify.

**Files to create/update:**
- `apps/customer-app/src/modules/payment/components/PaymentErrorState.tsx` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Props: `message`, `onRetry`, optional `onDismiss`.
2. Use `customer-payment-error-message.util` for message text.
3. Retry calls `useCheckoutPayment().pay()` again with **new** idempotency key.

**Acceptance criteria:**
- Component compiles; matches checkout error component patterns.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 9.

---

## Ticket 16 — Payment success banner component

**Ticket:** 16 — Payment success banner component

**Objective:** Interim success UI after verify (`paymentId`, note order pending Module 10/11).

**Files to create/update:**
- `apps/customer-app/src/modules/payment/components/PaymentSuccessBanner.tsx` (create)

**API endpoints:** N/A (displays verify response).

**DB fields:** N/A — show `paymentId`; hide or label `orderId` when `null`.

**Implementation steps:**
1. Props: `paymentId`, optional `orderId`.
2. Copy: “Payment successful” — order confirmation coming in a later step (no navigation to Module 11 screens).
3. Optional CTA: “Continue shopping” → `Home` or `Cart` (document in contract).

**Acceptance criteria:**
- Component compiles; does not assume `orderId` is set.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 6.

---

## Ticket 17 — CheckoutScreen pay CTA wiring

**Ticket:** 17 — CheckoutScreen pay CTA wiring

**Objective:** Replace disabled pay button with live `useCheckoutPayment` flow and payment UI states.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/screens/CheckoutScreen.tsx` (update)

**API endpoints:**
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/verify`

**DB fields:** N/A.

**Implementation steps:**
1. Remove `Pay now — coming soon` disabled button.
2. Enable **Pay now** when `checkoutData` exists, not expired, not `sessionExpired`, not processing.
3. Wire `onPress` → `pay()` from `useCheckoutPayment`.
4. Render `PaymentProcessingOverlay`, `PaymentErrorState`, `PaymentSuccessBanner` as appropriate.
5. Keep **Cancel checkout** behavior unchanged (Module 7).

**Acceptance criteria:**
- Pay button active on valid checkout session; typecheck passes.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 13–16.

---

## Ticket 18 — Pay guard rules and reservation integration

**Ticket:** 18 — Pay guard rules and reservation integration

**Objective:** Enforce pay disabled when reservation expired or missing session; align with `CheckoutReservationBanner` expiry.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/screens/CheckoutScreen.tsx` (update)
- `docs/architecture/customer-app-payment-flow.md` (update — guard table)

**API endpoints:** N/A (client guards before create-order).

**DB fields:** N/A.

**Implementation steps:**
1. Disable pay when `sessionExpired` or timer `onExpired` fired.
2. Disable pay while `initiateMutation.isPending` or no `checkoutData`.
3. Clear payment error/success state on re-initiate checkout.
4. Do not auto-cancel checkout when payment fails.

**Acceptance criteria:**
- Pay cannot fire without `getActiveCheckoutSessionId()` and valid reservation.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 17.

---

## Ticket 19 — Payment error message unit tests

**Ticket:** 19 — Payment error message unit tests

**Objective:** Unit tests for payment error mapping (mirror checkout/cart error tests).

**Files to create/update:**
- `apps/customer-app/src/modules/payment/utils/customer-payment-error-message.util.test.ts` (create)
- `apps/customer-app/tsconfig.payment-test.json` (create — mirror `tsconfig.checkout-test.json`)
- `apps/customer-app/package.json` (update — `test:customer-payment` script)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Assert `PAYMENT_VERIFICATION_FAILED`, `PAYMENT_GATEWAY_ERROR`, `CHECKOUT_SESSION_EXPIRED` mappings.
2. Add npm script parallel to `test:customer-checkout`.

**Acceptance criteria:**
- `npm run test:customer-payment -w apps/customer-app` passes.

**Test commands:**
```bash
npm run test:customer-payment -w apps/customer-app
```

**Depends on:** Ticket 9.

---

## Ticket 20 — Payment idempotency util unit tests

**Ticket:** 20 — Payment idempotency util unit tests

**Objective:** Unit tests for idempotency key format/uniqueness.

**Files to create/update:**
- `apps/customer-app/src/modules/payment/utils/payment-idempotency.util.test.ts` (create)
- `apps/customer-app/package.json` (update — include in `test:customer-payment` script)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Assert key non-empty, max length 128, unique across calls.

**Acceptance criteria:**
- Tests pass via `test:customer-payment` script.

**Test commands:**
```bash
npm run test:customer-payment -w apps/customer-app
```

**Depends on:** Ticket 8.

---

## Ticket 21 — Architecture and checkout contract doc updates

**Ticket:** 21 — Architecture and checkout contract doc updates

**Objective:** Mark payment UI IMPLEMENTED in architecture and file-structure docs.

**Files to create/update:**
- `docs/architecture/phase-4-customer-app-file-structure.md` (update — `payment/` IMPLEMENTED)
- `docs/architecture/customer-app-checkout-flow.md` (update — pay enabled, link Module 9)
- `docs/contracts/customer-app-payment-ui-contract.md` (update — status IMPLEMENTED placeholder)

**API endpoints:** Documented as consumed (Module 8).

**DB fields:** N/A.

**Implementation steps:**
1. Link verification doc.
2. Note order screens deferred Module 11.

**Acceptance criteria:**
- File structure lists `payment/` as implemented.

**Test commands:**
```bash
grep -q "payment/" docs/architecture/phase-4-customer-app-file-structure.md && \
grep -q "Module 9" docs/architecture/customer-app-checkout-flow.md && \
echo PASS
```

**Depends on:** Tickets 17–20.

---

## Ticket 22 — Module 9 verification checklist and smoke results

**Ticket:** 22 — Module 9 verification checklist and smoke results

**Objective:** Verification checklist and device smoke template for payment flow.

**Files to create/update:**
- `docs/testing/customer-app-payment-flow-verification.md` (update — checkboxes)
- `docs/testing/phase-4-module-9-smoke-results.md` (create)

**API endpoints:** Checklist covers create-order, Razorpay test pay, verify, retry on failure.

**DB fields:** N/A.

**Implementation steps:**
1. Device: Checkout → Pay now → Razorpay test card → success banner with `paymentId`.
2. User cancel → error + retry.
3. Expired reservation → pay disabled.
4. Backend: `payments.status=paid` after verify (operator Mongo check).
5. `orderId` remains null until Module 10.

**Acceptance criteria:**
- Smoke results file exists.

**Test commands:**
```bash
test -f docs/testing/phase-4-module-9-smoke-results.md && echo PASS
```

**Depends on:** Ticket 21.

---

## Ticket 23 — Module 9 handoff and project context closeout

**Ticket:** 23 — Module 9 handoff and project context closeout

**Objective:** Close Module 9; update handoff files.

**Files to create/update:**
- `docs/handoffs/phase-4-customer-app-payment-flow-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — Module 9 DONE)
- `project-context/CURRENT_PROGRESS.md` (update)
- `docs/reviews/phase-4-customer-app-payment-flow-execution-tickets.md` (update — all DONE)

**API endpoints:** Summary of client usage of Module 8 payment APIs.

**DB fields:** N/A.

**Implementation steps:**
1. List artifacts, env vars, test commands, SDK package.
2. Known limitations: no order screens, `orderId` null, native rebuild for Razorpay.
3. Next: Module 10 Order Creation Backend.

**Acceptance criteria:**
- Handoff complete; Module 10 not started.

**Test commands:**
```bash
test -f docs/handoffs/phase-4-customer-app-payment-flow-complete.md && \
grep "Module 9" project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md
```

**Depends on:** Ticket 22.

---

## Module closeout

**Phase 4 Module 9 — Customer App Payment Flow:** `DONE` (Tickets 1–23)

**Next module to implement:** **Module 10 — Order Creation Backend** (after Ticket 23 DONE)

**Execution order summary:**
```text
1–2 docs → 3–5 env/SDK/scaffold → 6–13 API/hooks/service
→ 14–16 UI components → 17–18 CheckoutScreen wiring
→ 19–20 tests → 21–23 closeout
```
