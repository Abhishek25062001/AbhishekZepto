# Phase 4 Customer App Order Confirmation — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 11 — Customer App Order Confirmation  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Module 11 tasks, pages 58–60)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Module 11 micro-tasks, pages 24–26)

**Architecture references (Module 0–10):**  
`docs/architecture/phase-4-customer-shopping-architecture.md`, `docs/architecture/phase-4-customer-app-file-structure.md`, `docs/architecture/customer-app-payment-flow.md`, `docs/architecture/customer-app-checkout-flow.md`, `docs/architecture/order-creation-backend.md`, `docs/contracts/order-customer-api.md`, `docs/contracts/customer-app-payment-ui-contract.md`, `docs/contracts/customer-app-checkout-ui-contract.md`, `docs/database/order-schema.md`, `docs/errors/phase-4-error-codes.md`, `docs/validation/phase-4-validation-rules.md`, `docs/handoffs/phase-4-order-creation-backend-complete.md`, `docs/handoffs/phase-4-customer-app-payment-flow-complete.md`

**Prerequisites:**  
Phase 4 **Module 10 complete** (order APIs + verify returns `orderId`); **Module 9 complete** (`useCheckoutPayment`, `PaymentSuccessBanner` on `CheckoutScreen`).

**PDF vs Module 0 alignment (implement using existing contracts):**

| PDF / legacy | Implementation |
|--------------|----------------|
| Order success after payment | `OrderSuccess` screen — navigate with `orderId` from verify response |
| Order details | `OrderDetail` screen — `GET /customer/orders/:orderId` |
| Order history | `OrderHistory` screen — `GET /customer/orders` (paginated) |
| Post-pay UX | Replace interim checkout banner-only success with navigation to `OrderSuccess` when `orderId` present |
| Order status | Display `placed` only (Phase 4); no fulfillment timeline UI |
| Retry placement | **Out of scope** — server handles via verify/webhook/POST orders; client shows error if `orderId` null |
| Profile orders | Link **My orders** from `Profile` → `OrderHistory` (read-only entry) |
| Backend changes | **None** — consume Module 10 APIs only |

**Out of scope for this module:**
- Backend API, MongoDB, or `orders` schema changes (Module 10)
- Razorpay SDK / payment create-verify changes beyond success navigation (Module 9)
- Order status transitions UI (picking, out for delivery) — Phase 5
- Cancel order / refunds / reorder
- Push notifications for order updates
- `packages/shared` order types unless one ticket adds minimal client mirrors
- Repository & Codebase Setup (Phase 1)
- Admin / vendor / delivery surfaces
- Module 12 profile GET/PATCH (only add orders navigation link on existing Profile screen)

**Execution order notes:**
- Run **Tickets 1–2** (docs/contracts) before customer-app code.
- Run **Tickets 3–5** (scaffold, types, API client) before **Tickets 6–10** (utils, hooks).
- Run **Tickets 11–14** (shared order UI components) before **Tickets 15–17** (screens).
- Run **Tickets 18–20** (navigation, payment success wiring, Profile entry) after screens exist.
- Run **Tickets 21–22** (checkout session cleanup, unit tests) after wiring.
- Run **Tickets 23–25** (docs/registry/verification) then handoff (Ticket 25).

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-19)

---

## Ticket 1 — Module 11 implementation alignment docs

**Ticket:** 1 — Module 11 implementation alignment docs

**Objective:** Document customer-app order confirmation scope, screens, navigation, and Module 9/10 boundaries before coding.

**Files to create/update:**
- `docs/architecture/customer-app-order-confirmation.md` (create)
- `docs/testing/customer-app-order-confirmation-verification.md` (create)

**API endpoints:** Document consumer usage:
- `GET /api/v1/customer/orders`
- `GET /api/v1/customer/orders/:orderId`
- (Read-only) `orderId` from `POST /api/v1/customer/payments/verify` — no client POST `/orders` in Phase 4 app

**DB fields:** N/A (client DTOs per `order-customer-api.md` and `order-schema.md` field meanings).

**Implementation steps:**
1. Screens: `OrderSuccess`, `OrderDetail`, `OrderHistory` per `phase-4-customer-app-file-structure.md`.
2. Post-payment flow: verify `orderId` → `navigation.replace('OrderSuccess', { orderId })` → fetch detail.
3. History: paginated list (`page`, `limit`); tap row → `OrderDetail`.
4. Status copy: `placed` = “Order placed” (no Phase 5 pipeline UI).
5. Error UX: `ORDER_NOT_FOUND`, network errors; if verify succeeds without `orderId`, show error state (no silent success).
6. QA: Module 10 API running; customer `9999999999`; complete checkout → pay → verify.

**Acceptance criteria:**
- Docs match AllPhase Module 11 + PDF pages 24–26; no application code.

**Test commands:**
```bash
test -f docs/architecture/customer-app-order-confirmation.md && \
test -f docs/testing/customer-app-order-confirmation-verification.md && \
echo PASS
```

**Depends on:** Phase 4 Modules 9–10 complete.

---

## Ticket 2 — Customer app order UI contract

**Ticket:** 2 — Customer app order UI contract

**Objective:** Define orders module layout, API client, hooks, screens, navigation, and payment/checkout integration (mirror `customer-app-payment-ui-contract.md`).

**Files to create/update:**
- `docs/contracts/customer-app-order-ui-contract.md` (create)
- `docs/contracts/customer-app-payment-ui-contract.md` (update — navigate to `OrderSuccess` when `orderId` set)
- `docs/validation/phase-4-validation-rules.md` (update — client Order section: display-only, no client placement)

**API endpoints:**
- `GET /api/v1/customer/orders`
- `GET /api/v1/customer/orders/:orderId`

**DB fields:** Document response fields used in UI (`orderNumber`, `grandTotal`, `items[]`, `addressSnapshot`, `placedAt`, `orderStatus`).

**Implementation steps:**
1. Module path: `apps/customer-app/src/modules/orders/`.
2. Hooks: `useOrderDetail`, `useOrderHistory`.
3. Navigation params: `OrderSuccess: { orderId }`, `OrderDetail: { orderId }`, `OrderHistory: undefined`.
4. Payment: on verify success with `orderId`, leave `Checkout` for `OrderSuccess` (replace stack entry).
5. Profile: **My orders** → `OrderHistory`.
6. No backend files.

**Acceptance criteria:**
- Contract implementable without guessing screen fields or navigation.

**Test commands:**
```bash
grep -q "OrderSuccess" docs/contracts/customer-app-order-ui-contract.md && \
grep -q "GET /api/v1/customer/orders" docs/contracts/customer-app-order-ui-contract.md && \
grep -q "Order" docs/validation/phase-4-validation-rules.md && \
echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Orders module scaffold

**Ticket:** 3 — Orders module scaffold

**Objective:** Create `orders/` folder layout per `phase-4-customer-app-file-structure.md`.

**Files to create/update:**
- `apps/customer-app/src/modules/orders/` (create dirs: `api/`, `hooks/`, `screens/`, `components/`, `types/`, `utils/`)

**API endpoints:** None.

**DB fields:** N/A.

**Implementation steps:**
1. Scaffold empty index files or placeholders only if needed for imports; no business logic.
2. Do not add screens until later tickets.

**Acceptance criteria:**
- Folder tree exists; `npm run typecheck -w apps/customer-app` passes.

**Test commands:**
```bash
test -d apps/customer-app/src/modules/orders/api && \
test -d apps/customer-app/src/modules/orders/screens && \
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 2.

---

## Ticket 4 — Order client types

**Ticket:** 4 — Order client types

**Objective:** TypeScript types for order list, detail, and navigation params aligned with Module 10 API responses.

**Files to create/update:**
- `apps/customer-app/src/modules/orders/types/order.types.ts` (create)

**API endpoints:** Maps responses from:
- `GET /api/v1/customer/orders`
- `GET /api/v1/customer/orders/:orderId`

**DB fields:** N/A — mirror API DTOs: `orderId`, `orderNumber`, `orderStatus`, `grandTotal`, `currency`, `placedAt`, `itemCount` (list); detail adds `items[]`, `addressSnapshot`, totals, `paymentStatus`.

**Implementation steps:**
1. `OrderListItem`, `OrderDetail`, `OrderListResponse` (with pagination meta if API returns standard envelope).
2. `OrderLineItem` type for embedded items.
3. `OrderStatus` union: `'placed'` for Phase 4 write/read display.
4. Navigation param types exported for `navigation.types.ts` consumption.

**Acceptance criteria:**
- Types compile; match `order-customer-api.md` examples.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 3.

---

## Ticket 5 — Customer order API client

**Ticket:** 5 — Customer order API client

**Objective:** HTTP client for order list and detail (mirror `customer-cart.api.ts` / `customer-payment.api.ts`).

**Files to create/update:**
- `apps/customer-app/src/modules/orders/api/customer-order.api.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/orders` — query `page`, `limit`, optional `status`
- `GET /api/v1/customer/orders/:orderId`

**DB fields:** N/A.

**Implementation steps:**
1. `getCustomerOrders({ page, limit, status? })` → paginated list.
2. `getCustomerOrderById(orderId)` → detail.
3. Use `apiClient` + `ApiSuccessResponse` unwrap pattern from cart module.
4. Base path: `/api/v1/customer/orders`.

**Acceptance criteria:**
- API client compiles; no hooks yet.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 4.

---

## Ticket 6 — Order query keys util

**Ticket:** 6 — Order query keys util

**Objective:** React Query key factory for order list and detail (mirror cart/checkout/payment key utils).

**Files to create/update:**
- `apps/customer-app/src/modules/orders/utils/order-query-keys.util.ts` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. `orderKeys.detail(orderId)`.
2. `orderKeys.list({ page, limit, status? })`.
3. Export stable string/tuple keys for invalidation from payment success if needed.

**Acceptance criteria:**
- Util compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 3.

---

## Ticket 7 — Order error message util

**Ticket:** 7 — Order error message util

**Objective:** Map `ORDER_*` API error codes to user-facing strings (mirror payment/checkout error utils).

**Files to create/update:**
- `apps/customer-app/src/modules/orders/utils/customer-order-error-message.util.ts` (create)

**API endpoints:** N/A (maps error responses from GET order APIs).

**DB fields:** N/A.

**Implementation steps:**
1. Handle `ORDER_NOT_FOUND`, `ORDER_NOT_OWNED`, generic network/unknown.
2. Export `getOrderErrorMessage(error, fallback)`.
3. Reuse shared `ApiErrorResponse` pattern from cart/payment modules.

**Acceptance criteria:**
- Util compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 3.

---

## Ticket 8 — useOrderDetail hook

**Ticket:** 8 — useOrderDetail hook

**Objective:** React Query hook to fetch single order for success and detail screens.

**Files to create/update:**
- `apps/customer-app/src/modules/orders/hooks/useOrderDetail.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/orders/:orderId`

**DB fields:** N/A.

**Implementation steps:**
1. `useQuery` with `orderKeys.detail(orderId)`.
2. `enabled: Boolean(orderId)`.
3. Expose `data`, `isLoading`, `isError`, `error`, `refetch`.
4. Map errors via `customer-order-error-message.util`.

**Acceptance criteria:**
- Hook compiles; disabled when `orderId` missing.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 5–7.

---

## Ticket 9 — useOrderHistory hook

**Ticket:** 9 — useOrderHistory hook

**Objective:** React Query hook for paginated order history list.

**Files to create/update:**
- `apps/customer-app/src/modules/orders/hooks/useOrderHistory.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/orders`

**DB fields:** N/A.

**Implementation steps:**
1. Default `page=1`, `limit=20`; optional `status: 'placed'`.
2. `useQuery` with `orderKeys.list({ page, limit, status })`.
3. Expose pagination helpers: `page`, `setPage`, `hasNextPage` (from API meta or list length vs limit).
4. Keep Phase 4 simple — no infinite scroll required unless API returns cursor; use “Load more” or page buttons if meta exists.

**Acceptance criteria:**
- Hook compiles; fetches list for `OrderHistory` screen.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 5–7.

---

## Ticket 10 — Order status label util

**Ticket:** 10 — Order status label util

**Objective:** Pure util for Phase 4 order status display copy (`placed` only).

**Files to create/update:**
- `apps/customer-app/src/modules/orders/utils/order-status-label.util.ts` (create)

**API endpoints:** N/A.

**DB fields:** N/A — maps `orderStatus` enum to label.

**Implementation steps:**
1. `getOrderStatusLabel(status)` → e.g. `placed` → “Order placed”.
2. Unknown status → safe fallback string (read-only).

**Acceptance criteria:**
- Util compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 4.

---

## Ticket 11 — Order line item component

**Ticket:** 11 — Order line item component

**Objective:** Presentational row for a single order line (name, qty, line total).

**Files to create/update:**
- `apps/customer-app/src/modules/orders/components/OrderLineItem.tsx` (create)

**API endpoints:** N/A.

**DB fields:** Displays `productName`, `quantity`, `unitPrice`, `lineTotal` from detail `items[]`.

**Implementation steps:**
1. Props: `OrderLineItem` type from Ticket 4.
2. Match visual density of `CartLineItem` / checkout summary rows.
3. Format currency in INR (reuse existing `Text` / formatting patterns from cart).

**Acceptance criteria:**
- Component compiles; no screen coupling.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 4.

---

## Ticket 12 — Order totals breakdown component

**Ticket:** 12 — Order totals breakdown component

**Objective:** Subtotal, tax, delivery, discount, grand total block (mirror checkout/cart summary components).

**Files to create/update:**
- `apps/customer-app/src/modules/orders/components/OrderTotalsBreakdown.tsx` (create)

**API endpoints:** N/A.

**DB fields:** `subtotal`, `taxAmount`, `deliveryFeeAmount`, `discountAmount`, `grandTotal`, `currency`.

**Implementation steps:**
1. Hide zero optional rows (same as cart/checkout).
2. Props accept detail order totals fields.

**Acceptance criteria:**
- Component compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 4.

---

## Ticket 13 — Order address snapshot component

**Ticket:** 13 — Order address snapshot component

**Objective:** Read-only delivery address display from `addressSnapshot`.

**Files to create/update:**
- `apps/customer-app/src/modules/orders/components/OrderAddressSnapshot.tsx` (create)

**API endpoints:** N/A.

**DB fields:** `addressSnapshot` fields (label, line1, city, pincode, etc. per schema).

**Implementation steps:**
1. Props: snapshot object from order detail.
2. Reuse address formatting patterns from checkout address display where possible.

**Acceptance criteria:**
- Component compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 4.

---

## Ticket 14 — Order list row component

**Ticket:** 14 — Order list row component

**Objective:** Pressable row for history list (`orderNumber`, date, total, item count, status).

**Files to create/update:**
- `apps/customer-app/src/modules/orders/components/OrderHistoryListItem.tsx` (create)

**API endpoints:** N/A.

**DB fields:** List item: `orderId`, `orderNumber`, `placedAt`, `grandTotal`, `itemCount`, `orderStatus`.

**Implementation steps:**
1. Props: `OrderListItem`, `onPress`.
2. Format `placedAt` for locale display (simple `Date` formatting).

**Acceptance criteria:**
- Component compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 10–11.

---

## Ticket 15 — Order error and empty state components

**Ticket:** 15 — Order error and empty state components

**Objective:** Reusable error and empty states for order screens (mirror cart/checkout patterns).

**Files to create/update:**
- `apps/customer-app/src/modules/orders/components/OrderErrorState.tsx` (create)
- `apps/customer-app/src/modules/orders/components/OrderEmptyState.tsx` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. `OrderErrorState`: message + optional `onRetry` (`refetch`).
2. `OrderEmptyState`: “No orders yet” + CTA to `Home` or `Catalog`.

**Acceptance criteria:**
- Components compile.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 7.

---

## Ticket 16 — OrderSuccess screen

**Ticket:** 16 — OrderSuccess screen

**Objective:** Post-payment confirmation screen showing order summary and CTAs.

**Files to create/update:**
- `apps/customer-app/src/modules/orders/screens/OrderSuccessScreen.tsx` (create)

**API endpoints:**
- `GET /api/v1/customer/orders/:orderId` (via `useOrderDetail`)

**DB fields:** Display `orderNumber`, `grandTotal`, `placedAt`, `orderStatus`.

**Implementation steps:**
1. Route param `orderId` required.
2. Loading / error states via `useOrderDetail`.
3. Success UI: confirmation message, order number, total, status label.
4. CTAs: **View order details** → `OrderDetail`; **Continue shopping** → `Home`.
5. No pay or cart actions on this screen.

**Acceptance criteria:**
- Screen compiles; handles loading and `ORDER_NOT_FOUND`.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 8, 10–12, 15.

---

## Ticket 17 — OrderDetail screen

**Ticket:** 17 — OrderDetail screen

**Objective:** Full order detail with items, address, and totals.

**Files to create/update:**
- `apps/customer-app/src/modules/orders/screens/OrderDetailScreen.tsx` (create)

**API endpoints:**
- `GET /api/v1/customer/orders/:orderId`

**DB fields:** Full detail per contract: `items[]`, `addressSnapshot`, totals, `paymentStatus`, `inventoryConfirmed` (display-only badge optional).

**Implementation steps:**
1. Route param `orderId`.
2. Render `OrderLineItem` list, `OrderAddressSnapshot`, `OrderTotalsBreakdown`.
3. Header: `orderNumber`, `placedAt`, status label.
4. Error/loading via `useOrderDetail`.

**Acceptance criteria:**
- Screen compiles; read-only (no cancel/edit).

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 8, 11–13, 15.

---

## Ticket 18 — OrderHistory screen

**Ticket:** 18 — OrderHistory screen

**Objective:** Paginated list of past orders with navigation to detail.

**Files to create/update:**
- `apps/customer-app/src/modules/orders/screens/OrderHistoryScreen.tsx` (create)

**API endpoints:**
- `GET /api/v1/customer/orders`

**DB fields:** List fields per `OrderListItem`.

**Implementation steps:**
1. `FlatList` of `OrderHistoryListItem`.
2. `useOrderHistory` for data + pagination.
3. Tap row → `navigation.navigate('OrderDetail', { orderId })`.
4. Empty and error states.

**Acceptance criteria:**
- Screen compiles; list renders when API returns orders.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 9, 14–15.

---

## Ticket 19 — Navigation types and MainNavigator routes

**Ticket:** 19 — Navigation types and MainNavigator routes

**Objective:** Register `OrderSuccess`, `OrderDetail`, `OrderHistory` on Main stack.

**Files to create/update:**
- `apps/customer-app/src/app/navigation.types.ts` (update)
- `apps/customer-app/src/app/MainNavigator.tsx` (update)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Add to `MainStackParamList`:
   - `OrderSuccess: { orderId: string }`
   - `OrderDetail: { orderId: string }`
   - `OrderHistory: undefined`
2. Register screens in `MainNavigator` with titles (“Order confirmed”, “Order details”, “My orders”).
3. Import screens from `modules/orders/screens/`.

**Acceptance criteria:**
- Navigation typecheck passes; routes reachable in dev build.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 16–18.

---

## Ticket 20 — Post-payment navigation from CheckoutScreen

**Ticket:** 20 — Post-payment navigation from CheckoutScreen

**Objective:** After verify success with `orderId`, navigate to `OrderSuccess` instead of staying on interim banner-only UX.

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/screens/CheckoutScreen.tsx` (update)
- `docs/architecture/customer-app-payment-flow.md` (update — success navigation)

**API endpoints:**
- `POST /api/v1/customer/payments/verify` (consumer — read `orderId` from response)

**DB fields:** N/A.

**Implementation steps:**
1. `useEffect` or success handler: when `paymentResult?.orderId` is set, `navigation.replace('OrderSuccess', { orderId })`.
2. If verify `paid` but `orderId` is null: show error state (do not navigate to success).
3. Remove or reduce reliance on inline `PaymentSuccessBanner` for happy path (banner optional until navigate).
4. Do not break pay retry / error flows.

**Acceptance criteria:**
- Successful pay with `orderId` lands on `OrderSuccess`; typecheck passes.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 9 (Module 9 payment hook), 16, 19.

---

## Ticket 21 — PaymentSuccessBanner and Profile orders entry

**Ticket:** 21 — PaymentSuccessBanner and Profile orders entry

**Objective:** Update interim payment banner for edge cases; add Profile entry to order history.

**Files to create/update:**
- `apps/customer-app/src/modules/payment/components/PaymentSuccessBanner.tsx` (update)
- `apps/customer-app/src/screens/main/ProfileScreen.tsx` (update)
- `docs/contracts/customer-app-payment-ui-contract.md` (update — banner vs navigation)

**API endpoints:** N/A (navigation only).

**DB fields:** N/A.

**Implementation steps:**
1. Banner: when `orderId` present, optional **View order** → `OrderSuccess`; remove “confirmed shortly” copy when `orderId` set.
2. Profile: add **My orders** button → `OrderHistory`.
3. Keep banner usable if navigation delayed (edge case / dev).

**Acceptance criteria:**
- Profile navigates to `OrderHistory`; banner copy accurate when `orderId` present.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 19–20.

---

## Ticket 22 — Clear checkout session after order success

**Ticket:** 22 — Clear checkout session after order success

**Objective:** Clear active checkout session storage when leaving checkout for confirmed order (mirror post-place cleanup expectations).

**Files to create/update:**
- `apps/customer-app/src/modules/checkout/utils/checkout-session-storage.util.ts` (update — export clear if missing)
- `apps/customer-app/src/modules/checkout/screens/CheckoutScreen.tsx` (update) or `OrderSuccessScreen.tsx` (update)

**API endpoints:** N/A.

**DB fields:** N/A — clears client `checkoutSessionId` only.

**Implementation steps:**
1. Call `clearActiveCheckoutSessionId()` (or equivalent) when navigating to `OrderSuccess`.
2. Do not call `POST /checkout/cancel` after successful pay (session completed server-side).
3. Document in architecture doc.

**Acceptance criteria:**
- Returning to `Checkout` after success does not reuse stale session id without re-initiate.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 20.

---

## Ticket 23 — Order error and status label unit tests

**Ticket:** 23 — Order error and status label unit tests

**Objective:** Unit tests for order error mapping and status labels; add `test:customer-orders` npm script.

**Files to create/update:**
- `apps/customer-app/src/modules/orders/utils/customer-order-error-message.util.test.ts` (create)
- `apps/customer-app/src/modules/orders/utils/order-status-label.util.test.ts` (create)
- `apps/customer-app/tsconfig.orders-test.json` (create — mirror `tsconfig.payment-test.json`)
- `apps/customer-app/package.json` (update — `test:customer-orders` script)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Assert `ORDER_NOT_FOUND`, `ORDER_NOT_OWNED` messages.
2. Assert `placed` label.
3. Script: compile test tsconfig + `node --test` on dist output.

**Acceptance criteria:**
- `npm run test:customer-orders -w apps/customer-app` passes.

**Test commands:**
```bash
npm run test:customer-orders -w apps/customer-app
```

**Depends on:** Tickets 7, 10.

---

## Ticket 24 — Architecture and contract doc updates

**Ticket:** 24 — Architecture and contract doc updates

**Objective:** Mark order UI IMPLEMENTED in architecture and payment/checkout contracts.

**Files to create/update:**
- `docs/architecture/phase-4-customer-app-file-structure.md` (update — `orders/` IMPLEMENTED)
- `docs/architecture/customer-app-payment-flow.md` (update — `OrderSuccess` navigation)
- `docs/architecture/customer-app-checkout-flow.md` (update — post-pay leaves checkout)
- `docs/contracts/customer-app-order-ui-contract.md` (update — status IMPLEMENTED)

**API endpoints:** Documented as consumed (Module 10).

**DB fields:** N/A.

**Implementation steps:**
1. Link verification doc.
2. Note Phase 5 status UI out of scope.

**Acceptance criteria:**
- File structure lists `orders/` as implemented.

**Test commands:**
```bash
grep -q "orders/" docs/architecture/phase-4-customer-app-file-structure.md && \
grep -q "IMPLEMENTED" docs/contracts/customer-app-order-ui-contract.md && \
echo PASS
```

**Depends on:** Tickets 20–23.

---

## Ticket 25 — Module 11 verification checklist and smoke results

**Ticket:** 25 — Module 11 verification checklist and smoke results

**Objective:** Verification checklist and device smoke template for order confirmation flow.

**Files to create/update:**
- `docs/testing/customer-app-order-confirmation-verification.md` (update — checkboxes)
- `docs/testing/phase-4-module-11-smoke-results.md` (create)

**API endpoints:** Checklist covers verify → `OrderSuccess`, detail, history list, Profile entry.

**DB fields:** N/A (operator may verify MongoDB `orders` via Module 10 smoke).

**Implementation steps:**
1. Device: Checkout → Pay → lands on `OrderSuccess` with order number.
2. View details → items and address visible.
3. Profile → My orders → history contains order.
4. Automated rows for typecheck + `test:customer-orders`.

**Acceptance criteria:**
- Smoke results file exists.

**Test commands:**
```bash
test -f docs/testing/phase-4-module-11-smoke-results.md && echo PASS
```

**Depends on:** Ticket 24.

---

## Ticket 26 — Module 11 handoff and project context closeout

**Ticket:** 26 — Module 11 handoff and project context closeout

**Objective:** Close Module 11; update handoff files.

**Files to create/update:**
- `docs/handoffs/phase-4-customer-app-order-confirmation-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — Module 11 DONE)
- `project-context/CURRENT_PROGRESS.md` (update)
- `docs/reviews/phase-4-customer-app-order-confirmation-execution-tickets.md` (update — all DONE)

**API endpoints:** Summary of `GET` order APIs + navigation from verify.

**DB fields:** N/A.

**Implementation steps:**
1. List artifacts, test commands, screen routes.
2. Known limitations: `placed` status only; no POST `/orders` retry UI.
3. Next: Module 12 Basic Customer Profile.

**Acceptance criteria:**
- Handoff complete; Module 12 profile API not started.

**Test commands:**
```bash
test -f docs/handoffs/phase-4-customer-app-order-confirmation-complete.md && \
grep "Module 11" project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md
```

**Depends on:** Ticket 25.

---

## Module closeout

**Phase 4 Module 11 — Customer App Order Confirmation:** `DONE` (Tickets 1–26)

**Next module to implement:** **Module 12 — Basic Customer Profile**

**Execution order summary:**
```text
1–2 docs → 3–5 scaffold/types/API → 6–10 utils/hooks
→ 11–15 components → 16–18 screens → 19 navigation
→ 20–22 payment/profile/cleanup wiring → 23 tests → 24–26 closeout
```
