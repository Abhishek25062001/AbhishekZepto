# Phase 4 Customer App Checkout Flow — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 7 — Customer App Checkout Flow  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Module 7 tasks, pages 50–52)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Module 7 micro-tasks, pages 16–18)

**Architecture references (Module 0–6):**  
`docs/architecture/phase-4-customer-shopping-architecture.md`, `docs/architecture/phase-4-customer-app-file-structure.md`, `docs/contracts/checkout-api.md`, `docs/contracts/customer-app-cart-ui-contract.md`, `docs/errors/phase-4-error-codes.md`, `docs/validation/phase-4-validation-rules.md`, `docs/architecture/customer-checkout-preparation-backend.md`, `docs/handoffs/phase-4-checkout-preparation-backend-complete.md`, `docs/handoffs/phase-4-customer-app-cart-experience-complete.md`, `docs/handoffs/phase-4-pricing-cart-calculation-complete.md`

**Prerequisites:**  
Phase 4 **Modules 4–6 complete** (cart UI, pricing breakdown, checkout backend APIs); Module 1 (`useLocationContext`, addresses, `selectedAddressId` / `selectedStoreId`).

**PDF vs Module 0 alignment (implement using existing contracts):**

| PDF / legacy | Implementation |
|--------------|----------------|
| Checkout screen | `CheckoutScreen` on Main stack route `Checkout` |
| Delivery address on checkout | `CheckoutAddressSelector` — default from `selectedAddressId` or address list |
| Order summary / totals | `CheckoutSummaryBreakdown` from initiate/summary API `summary` |
| Reservation timer | `CheckoutReservationBanner` countdown from `reservationExpiresAt` |
| Proceed to pay | **Module 9** — `Pay now` disabled or “Payment — coming soon” |
| Razorpay SDK | **Module 9** — not in this module |
| Checkout errors | Map `CHECKOUT_*` (+ reuse `CART_*` / `ADDRESS_*` where applicable) |
| Cart → Checkout CTA | Enable `CartSummaryFooter` button → `navigation.navigate('Checkout')` |
| Backend checkout APIs | **Module 6** — client only; no backend files |

**Out of scope for this module:**
- Backend API, MongoDB, or `checkout_sessions` schema changes (Module 6)
- Payment create/verify, Razorpay SDK (Modules 8–9)
- Order success/history screens (Module 11)
- Inventory lock logic (server-side Module 6)
- Promotions / coupon UI
- `packages/shared` checkout types unless one ticket adds minimal mirrors
- Repository & Codebase Setup (Phase 1)
- Admin / vendor surfaces

**Execution order notes:**
- Run **Tickets 1–2** (docs/contracts) before customer-app code.
- Run **Tickets 3–10** (scaffold, API client, hooks) before **Tickets 11–17** (UI).
- Run **Ticket 18** (cart CTA wiring) after `CheckoutScreen` exists.
- Run **Tickets 19–21** (error UX, navigation edge cases, tests) after UI.
- Run **Tickets 22–24** (docs/registry/verification) then **Ticket 25** (handoff).

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-19)

---

## Ticket 1 — Module 7 implementation alignment docs

**Ticket:** 1 — Module 7 implementation alignment docs

**Objective:** Document customer-app checkout scope, flows, reservation timer, and integration with Module 6 APIs before coding.

**Files to create/update:**
- `docs/architecture/customer-app-checkout-flow.md` (create)
- `docs/testing/customer-app-checkout-flow-verification.md` (create)

**API endpoints:** Document consumer usage:
- `POST /api/v1/customer/checkout/initiate`
- `GET /api/v1/customer/checkout/summary`
- `POST /api/v1/customer/checkout/cancel`

**DB fields:** N/A (client reads checkout DTOs). Reference `docs/database/checkout-session-schema.md` for field meaning.

**Implementation steps:**
1. Flow: `Cart` → `Checkout` → select/confirm address → `POST initiate` → show summary + reservation timer.
2. Default `addressId` from `useLocationContext().selectedAddressId`; fallback prompt to pick address or open `Addresses`.
3. On `CHECKOUT_PRICE_CHANGED`: message + CTA to return to cart / recalculate (reuse Module 5 cart refresh patterns).
4. On `CHECKOUT_SESSION_EXPIRED`: show expired state + “Start over” (re-initiate or back to cart).
5. On screen leave/back: optional `POST cancel` if session active (document choice — recommend cancel on explicit back, not on payment Module 9).
6. Payment CTA disabled until Module 9.
7. QA: dev customer `9999999999`, cart with items, default address, running Module 6 API.

**Acceptance criteria:**
- Docs match AllPhase Module 7 + PDF pages 16–18; no application code.

**Test commands:**
```bash
test -f docs/architecture/customer-app-checkout-flow.md && \
test -f docs/testing/customer-app-checkout-flow-verification.md && \
echo PASS
```

**Depends on:** Phase 4 Modules 4–6 complete.

---

## Ticket 2 — Customer app checkout UI contract

**Ticket:** 2 — Customer app checkout UI contract

**Objective:** Define screens, components, hooks, navigation, and error UX for the checkout module (mirror `customer-app-cart-ui-contract.md`).

**Files to create/update:**
- `docs/contracts/customer-app-checkout-ui-contract.md` (create)
- `docs/contracts/customer-app-cart-ui-contract.md` (update — enable Checkout CTA, link checkout contract)
- `docs/validation/phase-4-validation-rules.md` (update — **Customer app checkout** section)

**API endpoints:** Maps UI actions to:
- `POST /api/v1/customer/checkout/initiate`
- `GET /api/v1/customer/checkout/summary`
- `POST /api/v1/customer/checkout/cancel`

**DB fields:** N/A (DTO: `checkoutSessionId`, `reservationExpiresAt`, `summary`, `lockTokens`).

**Implementation steps:**
1. Screen table: `Checkout` route, `CheckoutScreen`.
2. Components: `CheckoutAddressSelector`, `CheckoutSummaryBreakdown`, `CheckoutReservationBanner`, `CheckoutErrorState`.
3. Hooks: `useInitiateCheckout`, `useCheckoutSummary`, `useCancelCheckout`, `useCheckoutReservationTimer`.
4. Error mapping table for `CHECKOUT_*` codes.
5. Navigation: `Cart` → `Checkout`; `Checkout` → `Addresses` for add/change address.
6. Payment button: disabled / placeholder until Module 9.

**Acceptance criteria:**
- Contract implementable without guessing component names or navigation params.

**Test commands:**
```bash
test -f docs/contracts/customer-app-checkout-ui-contract.md && \
grep -q "Checkout" docs/contracts/customer-app-cart-ui-contract.md && \
echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Checkout module scaffold

**Ticket:** 3 — Checkout module scaffold

**Objective:** Create `apps/customer-app/src/modules/checkout/` folder layout per `phase-4-customer-app-file-structure.md`.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/` (create dirs: `api/`, `hooks/`, `screens/`, `components/`, `types/`, `utils/`)

**API endpoints:** None.

**DB fields:** N/A.

**Implementation steps:**
1. Scaffold only; no business logic.
2. Mirror `cart/` module layout.

**Acceptance criteria:**
- Folder tree exists; `npm run typecheck -w apps/customer-app` passes.

**Test commands:**
```bash
test -d apps/customer-app/src/modules/checkout/api && \
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 1–2.

---

## Ticket 4 — Checkout types

**Ticket:** 4 — Checkout types

**Objective:** Define TypeScript types mirroring `checkout-api.md` request/response shapes.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/types/checkout.types.ts` (create)

**API endpoints:** DTO shapes for initiate, summary, cancel.

**DB fields:** N/A — types for `summary` (totals + line items), `CheckoutSession` response fields.

**Implementation steps:**
1. `InitiateCheckoutInput`: `addressId`, optional `storeId`, optional `idempotencyKey`.
2. `InitiateCheckoutResponse`: `checkoutSessionId`, `reservationExpiresAt`, `lockTokens`, `summary`.
3. `CheckoutSummary`: `currency`, `itemCount`, `subtotal`, `discountAmount`, `taxAmount`, `deliveryFeeAmount`, `grandTotal`, `items[]`.
4. `CheckoutSummaryItem`: `itemId`, `productId`, `variantId`, `storeProductId`, `productName`, `quantity`, `unitPrice`, `lineTotal`.
5. `CancelCheckoutInput`, `GetCheckoutSummaryQuery`, `CheckoutSessionResponse`.

**Acceptance criteria:**
- Types align with `docs/contracts/checkout-api.md` JSON examples.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 3.

---

## Ticket 5 — Checkout API client

**Ticket:** 5 — Checkout API client

**Objective:** HTTP client functions for Module 6 checkout endpoints.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/api/customer-checkout.api.ts` (create)

**API endpoints:**
- `POST /api/v1/customer/checkout/initiate`
- `GET /api/v1/customer/checkout/summary`
- `POST /api/v1/customer/checkout/cancel`

**DB fields:** N/A.

**Implementation steps:**
1. `initiateCheckout(input)` — POST body; unwrap standard API envelope.
2. `getCheckoutSummary(query?)` — GET with optional `checkoutSessionId`.
3. `cancelCheckout(input)` — POST body.
4. Pass `storeId` on initiate when needed (from `selectedStoreId`).
5. Reuse `apiClient` from `services/api/client`.

**Acceptance criteria:**
- Client compiles; paths match `checkout-api.md`.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 4.

---

## Ticket 6 — Checkout query keys and session id storage util

**Ticket:** 6 — Checkout query keys and session id storage util

**Objective:** React Query keys and optional in-memory session id helper for summary refetch.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/utils/checkout-query-keys.util.ts` (create)
- `apps/customer-app/src/modules/checkout/utils/checkout-session-storage.util.ts` (create — optional AsyncStorage or module-level ref for `checkoutSessionId`)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Query keys: `['customer-checkout', 'summary', sessionId?]`.
2. Store `checkoutSessionId` after successful initiate for GET summary / cancel.
3. Clear session id on cancel or expiry.

**Acceptance criteria:**
- Utils compile.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 5.

---

## Ticket 7 — Checkout error message util

**Ticket:** 7 — Checkout error message util

**Objective:** Map `CHECKOUT_*` (and related) API error codes to user-facing messages and type guards.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/utils/customer-checkout-error-message.util.ts` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. `getCheckoutErrorCode`, `getCheckoutErrorMessage` (axios error shape).
2. Guards: `isCheckoutPriceChangedError`, `isCheckoutSessionExpiredError`, `isCheckoutStockUnavailableError`, etc.
3. Messages per `phase-4-error-codes.md` Checkout section.
4. `CHECKOUT_PRICE_CHANGED` → suggest return to cart and refresh prices.

**Acceptance criteria:**
- Util exports all guards used by `CheckoutScreen`.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 5.

---

## Ticket 8 — useInitiateCheckout hook

**Ticket:** 8 — useInitiateCheckout hook

**Objective:** Mutation hook to initiate checkout with address and store context.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/hooks/useInitiateCheckout.ts` (create)

**API endpoints:**
- `POST /api/v1/customer/checkout/initiate`

**DB fields:** N/A.

**Implementation steps:**
1. Read `selectedStoreId` from `useLocationContext`.
2. Accept `addressId` (required) and optional `idempotencyKey`.
3. On success: persist `checkoutSessionId`, invalidate checkout summary query.
4. Surface error via React Query `mutation.error` for screen handling.

**Acceptance criteria:**
- Hook compiles; calls API with correct body.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 6–7.

---

## Ticket 9 — useCheckoutSummary hook

**Ticket:** 9 — useCheckoutSummary hook

**Objective:** Query hook for active checkout session summary.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/hooks/useCheckoutSummary.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/checkout/summary`

**DB fields:** N/A (summary DTO).

**Implementation steps:**
1. Enabled when `checkoutSessionId` is set (or after initiate success).
2. Refetch on focus optional (resume checkout).
3. Handle `CHECKOUT_SESSION_EXPIRED` / `CHECKOUT_SESSION_NOT_FOUND` for UI states.

**Acceptance criteria:**
- Hook compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 6–8.

---

## Ticket 10 — useCancelCheckout hook

**Ticket:** 10 — useCancelCheckout hook

**Objective:** Mutation hook to cancel checkout and release server-side locks.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/hooks/useCancelCheckout.ts` (create)

**API endpoints:**
- `POST /api/v1/customer/checkout/cancel`

**DB fields:** N/A.

**Implementation steps:**
1. Requires `checkoutSessionId` from session storage.
2. On success: clear session id; invalidate summary query.
3. Used on explicit back / “Cancel checkout” — not on successful payment (Module 9).

**Acceptance criteria:**
- Hook compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 6–8.

---

## Ticket 11 — useCheckoutReservationTimer hook

**Ticket:** 11 — useCheckoutReservationTimer hook

**Objective:** Countdown hook from `reservationExpiresAt` ISO string for reservation banner.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/hooks/useCheckoutReservationTimer.ts` (create)

**API endpoints:** N/A.

**DB fields:** N/A (`reservationExpiresAt` from initiate/summary response).

**Implementation steps:**
1. Input: `expiresAt: string | null`.
2. Output: `remainingSeconds`, `isExpired`, formatted `mm:ss` label.
3. Tick every 1s; set `isExpired` when `Date.now() >= expiresAt`.
4. Callback optional for parent to trigger cancel or show expired UI.

**Acceptance criteria:**
- Hook returns correct countdown for future timestamp in unit test or manual check.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 4.

---

## Ticket 12 — CheckoutSummaryBreakdown component

**Ticket:** 12 — CheckoutSummaryBreakdown component

**Objective:** Display order summary lines and totals (mirror `CartSummaryFooter` Module 5 breakdown rules).

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/components/CheckoutSummaryBreakdown.tsx` (create)
- Reuse `formatCartGrandTotal` from cart price util or shared formatter

**API endpoints:** Consumes `summary` from initiate/summary response.

**DB fields:** Display `subtotal`, `taxAmount`, `deliveryFeeAmount`, `discountAmount`, `grandTotal`, line items.

**Implementation steps:**
1. List `summary.items` with name, qty, line total.
2. Hide tax/delivery/discount rows when amount is `0` (same as cart Module 5).
3. Prominent `grandTotal` row.

**Acceptance criteria:**
- Component compiles with mock `CheckoutSummary`.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 4.

---

## Ticket 13 — CheckoutAddressSelector component

**Ticket:** 13 — CheckoutAddressSelector component

**Objective:** Show selected delivery address and allow change via address list navigation.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/components/CheckoutAddressSelector.tsx` (create)
- Integrate `useCustomerAddresses` or address fetch for label/line display

**API endpoints:** N/A (uses Module 1 address APIs indirectly via existing hooks).

**DB fields:** N/A — display address fields from address DTO.

**Implementation steps:**
1. Props: `selectedAddressId`, `onAddressChange`, `onAddAddress`.
2. Show label + `line1`, city; “Change” → navigate to `Addresses` / `AddressList`.
3. If no address selected: CTA “Add delivery address”.
4. Use `selectedAddressId` from location store as default.

**Acceptance criteria:**
- Component compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 4; Module 1 addresses.

---

## Ticket 14 — CheckoutReservationBanner component

**Ticket:** 14 — CheckoutReservationBanner component

**Objective:** Reservation countdown banner with warning when time is low.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/components/CheckoutReservationBanner.tsx` (create)

**API endpoints:** N/A.

**DB fields:** N/A (`reservationExpiresAt`).

**Implementation steps:**
1. Use `useCheckoutReservationTimer`.
2. Copy: “Items reserved for {mm:ss}” / “Reservation expired”.
3. Visual emphasis when &lt; 2 minutes remaining (optional styling).

**Acceptance criteria:**
- Component compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 11.

---

## Ticket 15 — CheckoutErrorState component

**Ticket:** 15 — CheckoutErrorState component

**Objective:** Reusable error UI for checkout failures with contextual actions.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/components/CheckoutErrorState.tsx` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Props: `message`, `primaryAction` (label + onPress), optional `secondaryAction`.
2. Presets: price changed → “Go to cart”; stock unavailable → “Update cart”; session expired → “Try again”.
3. Match `CartErrorState` styling conventions.

**Acceptance criteria:**
- Component compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 7.

---

## Ticket 16 — CheckoutScreen

**Ticket:** 16 — CheckoutScreen

**Objective:** Full checkout screen: address, initiate, summary, timer, disabled pay CTA, error handling.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/screens/CheckoutScreen.tsx` (create)

**API endpoints:**
- `POST initiate` on mount or “Continue” when address confirmed
- `GET summary` when resuming with stored session id
- `POST cancel` on back / cancel action

**DB fields:** Full checkout DTOs in UI state.

**Implementation steps:**
1. Require `hasStore` and cart has items (redirect to `Cart` if empty — optional guard).
2. Address section → `CheckoutAddressSelector`.
3. On address ready: call `useInitiateCheckout` (or load existing summary if session id present).
4. Show `CheckoutReservationBanner` + `CheckoutSummaryBreakdown`.
5. Disabled button: “Pay now — coming soon” (Module 9).
6. Header/back: confirm cancel → `useCancelCheckout` then `goBack`.
7. Map mutation/query errors to `CheckoutErrorState` with actions.
8. Loading states during initiate/summary fetch.

**Acceptance criteria:**
- Screen compiles; happy path against running Module 6 API with seeded cart + address.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 8–15.

---

## Ticket 17 — Navigation: Checkout route registration

**Ticket:** 17 — Navigation: Checkout route registration

**Objective:** Register `Checkout` on Main stack and update navigation types.

**Files to create/update:**
- `apps/customer-app/src/app/navigation.types.ts` (update — `Checkout: undefined`)
- `apps/customer-app/src/app/MainNavigator.tsx` (update — `Stack.Screen` for `CheckoutScreen`)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Add screen with title “Checkout”.
2. Hide `CartBottomBar` on checkout screen (document in contract — checkout is not a catalog/home surface).

**Acceptance criteria:**
- `navigation.navigate('Checkout')` typechecks.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 16.

---

## Ticket 18 — Enable cart Checkout CTA navigation

**Ticket:** 18 — Enable cart Checkout CTA navigation

**Objective:** Wire `CartSummaryFooter` checkout button to navigate to `Checkout` when cart has items.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/components/CartSummaryFooter.tsx` (update)
- `apps/customer-app/src/modules/cart/screens/CartScreen.tsx` (update — pass `onCheckout` handler)

**API endpoints:** N/A (navigation only).

**DB fields:** N/A.

**Implementation steps:**
1. Replace disabled “Checkout — coming soon” with enabled “Proceed to checkout” when `hasItems`.
2. `CartScreen`: `navigation.navigate('Checkout')`.
3. Guard: disabled when cart empty or no store.

**Acceptance criteria:**
- Cart → Checkout navigation works in app.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 17.

---

## Ticket 19 — CHECKOUT_PRICE_CHANGED and cart recovery UX

**Ticket:** 19 — CHECKOUT_PRICE_CHANGED and cart recovery UX

**Objective:** On price drift at initiate, guide user back to cart with clear messaging (align Module 5 recalculate).

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/screens/CheckoutScreen.tsx` (update)
- `apps/customer-app/src/modules/checkout/components/CheckoutErrorState.tsx` (update — price-changed preset)

**API endpoints:**
- Failed `POST initiate` with `CHECKOUT_PRICE_CHANGED`

**DB fields:** N/A.

**Implementation steps:**
1. Detect `isCheckoutPriceChangedError` on initiate failure.
2. Show message + “Update cart” → navigate to `Cart` (user can use Module 5 refresh).
3. Optional: cancel any partial session if server created one (initiate is atomic on Module 6 — no partial session).

**Acceptance criteria:**
- Price-changed error shows recovery path without dead-end.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 16–18.

---

## Ticket 20 — Checkout session expiry UX

**Ticket:** 20 — Checkout session expiry UX

**Objective:** Handle reservation expiry in UI (timer hits zero or `CHECKOUT_SESSION_EXPIRED` on summary).

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/screens/CheckoutScreen.tsx` (update)
- `apps/customer-app/src/modules/checkout/hooks/useCheckoutReservationTimer.ts` (update — `onExpired` callback)

**API endpoints:**
- `GET summary` may return `CHECKOUT_SESSION_EXPIRED`

**DB fields:** N/A.

**Implementation steps:**
1. When timer expires: show expired state; clear local session id.
2. CTA: “Start checkout again” → re-initiate or navigate to `Cart`.
3. Disable pay button when expired.

**Acceptance criteria:**
- Expired session does not allow proceed-to-pay.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 14, 16.

---

## Ticket 21 — Checkout error message unit tests

**Ticket:** 21 — Checkout error message unit tests

**Objective:** Unit tests for checkout error mapping (mirror cart error tests).

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/utils/customer-checkout-error-message.util.test.ts` (create)
- `apps/customer-app/tsconfig.checkout-test.json` (create — mirror `tsconfig.cart-test.json`)
- `apps/customer-app/package.json` (update — `test:customer-checkout` script for app)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Assert `CHECKOUT_PRICE_CHANGED`, `CHECKOUT_SESSION_EXPIRED`, `CHECKOUT_STOCK_UNAVAILABLE` mappings.
2. Add npm script parallel to `test:customer-cart`.

**Acceptance criteria:**
- `npm run test:customer-checkout -w apps/customer-app` passes.

**Test commands:**
```bash
npm run test:customer-checkout -w apps/customer-app
```

**Depends on:** Ticket 7.

---

## Ticket 22 — Reservation timer unit test

**Ticket:** 22 — Reservation timer unit test

**Objective:** Unit test countdown / expiry logic for reservation timer hook.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/hooks/useCheckoutReservationTimer.test.ts` (create)
- `apps/customer-app/package.json` (update — include in `test:customer-checkout` script)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Test future `expiresAt` → positive `remainingSeconds`.
2. Test past `expiresAt` → `isExpired` true.

**Acceptance criteria:**
- Timer tests pass (may use mocked `Date` if needed).

**Test commands:**
```bash
npm run test:customer-checkout -w apps/customer-app
```

**Depends on:** Ticket 11.

---

## Ticket 23 — Architecture and cart contract doc updates

**Ticket:** 23 — Architecture and cart contract doc updates

**Objective:** Mark checkout UI IMPLEMENTED in architecture and file-structure docs.

**Files to create/update:**
- `docs/architecture/phase-4-customer-app-file-structure.md` (update — `checkout/` IMPLEMENTED)
- `docs/architecture/customer-app-cart-experience.md` (update — checkout CTA enabled, link Module 7)
- `docs/contracts/customer-app-checkout-ui-contract.md` (update — status IMPLEMENTED note placeholder)

**API endpoints:** Documented as consumed (Module 6).

**DB fields:** N/A.

**Implementation steps:**
1. Link verification doc.
2. Note payment deferred Module 9.

**Acceptance criteria:**
- File structure lists `checkout/` as implemented.

**Test commands:**
```bash
grep -q "checkout/" docs/architecture/phase-4-customer-app-file-structure.md && \
grep -q "Module 7" docs/architecture/customer-app-cart-experience.md && \
echo PASS
```

**Depends on:** Tickets 16–20.

---

## Ticket 24 — Module 7 verification checklist and smoke results

**Ticket:** 24 — Module 7 verification checklist and smoke results

**Objective:** Verification checklist and device smoke template for checkout UI.

**Files to create/update:**
- `docs/testing/customer-app-checkout-flow-verification.md` (update — checkboxes)
- `docs/testing/phase-4-module-7-smoke-results.md` (create)

**API endpoints:** Checklist covers initiate, summary display, cancel, timer, cart CTA.

**DB fields:** N/A.

**Implementation steps:**
1. Device: Cart → Proceed to checkout → see summary + timer.
2. Change address → re-initiate.
3. Back → cancel releases reservation (verify via API or stock).
4. Price drift scenario documented.
5. Pay button remains disabled.

**Acceptance criteria:**
- Smoke results file exists.

**Test commands:**
```bash
test -f docs/testing/phase-4-module-7-smoke-results.md && echo PASS
```

**Depends on:** Ticket 23.

---

## Ticket 25 — Module 7 handoff and project context closeout

**Ticket:** 25 — Module 7 handoff and project context closeout

**Objective:** Close Module 7; update handoff files.

**Files to create/update:**
- `docs/handoffs/phase-4-customer-app-checkout-flow-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — Module 7 DONE)
- `project-context/CURRENT_PROGRESS.md` (update)
- `docs/reviews/phase-4-customer-app-checkout-flow-execution-tickets.md` (update — all DONE)

**API endpoints:** Summary of client usage of Module 6 checkout APIs.

**DB fields:** N/A.

**Implementation steps:**
1. List artifacts, test commands, navigation routes.
2. Known limitations: no payment SDK, pay CTA disabled.
3. Next: Module 8 Payment Gateway Foundation.

**Acceptance criteria:**
- Handoff complete; Module 8 backend not started.

**Test commands:**
```bash
test -f docs/handoffs/phase-4-customer-app-checkout-flow-complete.md && \
grep "Module 7" project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md
```

**Depends on:** Ticket 24.

---

## Module closeout

**Phase 4 Module 7 — Customer App Checkout Flow:** `COMPLETE` (Tickets 1–25 DONE)

**Next module to implement:** **Module 8 — Payment Gateway Foundation** (after Ticket 25 DONE)

**Execution order summary:**
```text
1–2 docs → 3–11 scaffold/API/hooks → 12–16 UI → 17–18 navigation/cart CTA
→ 19–22 error/expiry/tests → 23–25 closeout
```
