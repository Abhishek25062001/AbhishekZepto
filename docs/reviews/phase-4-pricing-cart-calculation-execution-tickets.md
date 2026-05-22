# Phase 4 Pricing & Cart Calculation — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 5 — Pricing & Cart Calculation  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Module 5 tasks, pages 47–48)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Module 5 micro-tasks, pages 12–14)

**Architecture references (Module 0–4):**  
`docs/architecture/phase-4-customer-shopping-architecture.md`, `docs/architecture/phase-4-backend-file-structure.md`, `docs/contracts/cart-api.md`, `docs/database/cart-schema.md`, `docs/errors/phase-4-error-codes.md`, `docs/validation/phase-4-validation-rules.md`, `docs/architecture/customer-cart-backend-foundation.md`, `docs/handoffs/phase-4-cart-backend-foundation-complete.md`, `docs/handoffs/phase-4-customer-app-cart-experience-complete.md`

**Prerequisites:**  
Phase 4 **Modules 3–4 complete** (cart APIs + customer cart UI); Phase 3 `store_products` with `finalPrice`; Module 1 store selection.

**PDF vs Module 0 alignment (implement using existing contracts):**

| PDF / legacy | Implementation |
|--------------|----------------|
| Full cart totals (tax, delivery, discount) | `pricing` module computes `subtotal`, `taxAmount`, `deliveryFeeAmount`, `discountAmount`, `grandTotal` |
| Price snapshot refresh | Mutations + `POST /cart/recalculate` update `unitPriceSnapshot` from current `store_products.finalPrice` |
| `CART_PRICE_CHANGED` | Thrown when `GET ?validatePrices=true` detects snapshot drift; client refreshes via recalculate |
| Promotions / coupons | **Out of scope** — `discountAmount = 0` unless PDF adds coupon hook (defer Phase 9+) |
| Complex tax categories | **MVP** — flat `CART_TAX_RATE_PERCENT` env (default `0`); per-SKU tax deferred |
| Checkout price validation | **Module 6** — reuse pricing service; `CHECKOUT_PRICE_CHANGED` at initiate |
| New cart collection fields | **None** — use existing `carts` totals fields from `cart-schema.md` |

**Out of scope for this module:**
- Checkout sessions, inventory locks (Module 6)
- Payment, orders (Modules 8–10)
- Customer checkout UI (Module 7)
- Promotion/coupon engine (Phase 9+)
- Admin/vendor pricing tools
- `packages/shared` pricing types unless one ticket adds minimal mirrors
- Repository & Codebase Setup (Phase 1)
- Changing cart CRUD route paths (extend behavior only)

**Execution order notes:**
- Run **Tickets 1–2** (docs/contracts) before backend code.
- Run **Tickets 3–10** (pricing module + error mapping) before **Tickets 11–13** (cart integration + HTTP).
- Run **Tickets 14–16** (backend tests) after HTTP layer.
- Run **Tickets 17–19** (customer app pricing UX) after backend tests pass.
- Run **Tickets 20–22** (docs/registry/verification) then **Ticket 23** (handoff).

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-19)

---

## Ticket 1 — Module 5 implementation alignment docs

**Ticket:** 1 — Module 5 implementation alignment docs

**Objective:** Document pricing scope, calculation rules, snapshot refresh, and `CART_PRICE_CHANGED` flow before coding.

**Files to create/update:**
- `docs/architecture/customer-cart-pricing-calculation.md` (create)
- `docs/testing/customer-cart-pricing-calculation-verification.md` (create)

**API endpoints:** Document consumer usage:
- Existing cart routes (enhanced totals behavior)
- `POST /api/v1/customer/cart/recalculate` (new — Ticket 2)

**DB fields:** `carts` — `items[].unitPriceSnapshot`, `lineTotal`, `subtotal`, `discountAmount`, `taxAmount`, `deliveryFeeAmount`, `grandTotal`, `lastCalculatedAt` (no schema change).

**Implementation steps:**
1. Pricing formula (MVP): `lineTotal = quantity * unitPriceSnapshot`; `subtotal = sum(lineTotal)`; `taxAmount = subtotal * taxRate`; `deliveryFeeAmount = flat fee`; `grandTotal = subtotal - discount + tax + delivery`.
2. Snapshots sourced from `store_products.finalPrice` at mutation/recalculate time.
3. Drift detection: compare stored snapshot vs current `finalPrice` per line.
4. Module 6 will call same pricing service for checkout summary validation.
5. QA: seeded cart + change store product price in DB to trigger drift test.

**Acceptance criteria:**
- Docs match AllPhase Module 5 + PDF pages 12–14; no application code.

**Test commands:**
```bash
test -f docs/architecture/customer-cart-pricing-calculation.md && \
test -f docs/testing/customer-cart-pricing-calculation-verification.md && \
echo PASS
```

**Depends on:** Phase 4 Modules 3–4 complete.

---

## Ticket 2 — Cart pricing contract and validation expansion

**Ticket:** 2 — Cart pricing contract and validation expansion

**Objective:** Expand `cart-api.md` with full totals, recalculate endpoint, and price-validation query; add validation rules.

**Files to create/update:**
- `docs/contracts/cart-api.md` (update — totals breakdown, `POST /recalculate`, `GET ?validatePrices=`)
- `docs/contracts/cart-pricing-calculation.md` (create — calculation rules reference)
- `docs/validation/phase-4-validation-rules.md` (update — Pricing section)

**API endpoints:**
- `GET /api/v1/customer/cart?storeId=&validatePrices=` (optional boolean)
- `POST /api/v1/customer/cart/recalculate` (body/query: `storeId`)
- Existing mutation endpoints return updated totals fields

**DB fields:** Document all pricing fields on cart response; no new fields.

**Implementation steps:**
1. Document response: non-zero `taxAmount` / `deliveryFeeAmount` when env configured.
2. `CART_PRICE_CHANGED` response shape (code + optional `details.changedItems[]`).
3. `POST /recalculate` idempotent refresh of snapshots + totals.
4. Cross-link `CHECKOUT_PRICE_CHANGED` (Module 6) as checkout-time strict validation.

**Acceptance criteria:**
- Contract implementable without guessing pricing behavior.

**Test commands:**
```bash
grep -q "CART_PRICE_CHANGED" docs/contracts/cart-api.md && \
grep -q "recalculate" docs/contracts/cart-api.md && \
grep -q "taxAmount" docs/validation/phase-4-validation-rules.md && \
echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Pricing env configuration

**Ticket:** 3 — Pricing env configuration

**Objective:** Add env-backed tax rate and flat delivery fee for cart calculation MVP.

**Files to create/update:**
- `backend/api/src/config/env.ts` (update — `CART_TAX_RATE_PERCENT`, `CART_DELIVERY_FEE_AMOUNT`)
- `backend/api/.env.example` (update — document vars)
- `docs/setup/phase-4-env-config.md` (update — Module 5 vars)

**API endpoints:** None.

**DB fields:** N/A.

**Implementation steps:**
1. `CART_TAX_RATE_PERCENT`: number 0–100, default `0`.
2. `CART_DELIVERY_FEE_AMOUNT`: non-negative number, default `0` (same currency units as store prices).
3. Export getters in `modules/pricing/constants/` or `config` helper (Ticket 5).

**Acceptance criteria:**
- Env parses; defaults documented.

**Test commands:**
```bash
grep CART_TAX_RATE_PERCENT backend/api/.env.example && \
npm run typecheck -w backend/api
```

**Depends on:** Ticket 2.

---

## Ticket 4 — Pricing module scaffold

**Ticket:** 4 — Pricing module scaffold

**Objective:** Create `backend/api/src/modules/pricing/` per `phase-4-backend-file-structure.md`.

**Files to create/update:**
- `backend/api/src/modules/pricing/` (create dirs: `services/`, `utils/`, `types/`, `constants/`)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Scaffold only; no business logic.
2. No new collection constants.

**Acceptance criteria:**
- Folder tree exists; `npm run typecheck -w backend/api` passes.

**Test commands:**
```bash
test -d backend/api/src/modules/pricing/services && \
npm run typecheck -w backend/api
```

**Depends on:** Tickets 1–3.

---

## Ticket 5 — Pricing types and configuration constants

**Ticket:** 5 — Pricing types and configuration constants

**Objective:** Define pricing input/output types and env-backed config accessors.

**Files to create/update:**
- `backend/api/src/modules/pricing/types/cart-pricing.types.ts` (create)
- `backend/api/src/modules/pricing/constants/cart-pricing-config.constant.ts` (create)

**API endpoints:** N/A.

**DB fields:** Maps to cart document pricing fields.

**Implementation steps:**
1. `CartPricingLineInput` — variantId, storeProductId, quantity, unitPriceSnapshot.
2. `CartPricingResult` — subtotal, discountAmount, taxAmount, deliveryFeeAmount, grandTotal, lastCalculatedAt.
3. `getCartTaxRatePercent()`, `getCartDeliveryFeeAmount()` from env.

**Acceptance criteria:**
- Types compile.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 4.

---

## Ticket 6 — Line price snapshot resolver

**Ticket:** 6 — Line price snapshot resolver

**Objective:** Resolve current selling price per cart line from `store_products` (reuse Phase 3 repos).

**Files to create/update:**
- `backend/api/src/modules/pricing/utils/cart-line-price.util.ts` (create)
- Reuse `store-products` repository and `cart` product validation patterns

**API endpoints:** Used by pricing service and cart mutations.

**DB fields:** Reads `store_products.finalPrice`; writes `items[].unitPriceSnapshot`.

**Implementation steps:**
1. `resolveLinePricesForCart(storeId, items[])` → map of itemId/variantId to current price + storeProductId.
2. Throw `CART_PRODUCT_UNAVAILABLE` if mapping missing (delegate to cart error mapper).
3. Return `productNameSnapshot` refresh from `products.name` when recalculating.

**Acceptance criteria:**
- Util returns current prices for all cart lines.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 5; Module 3 cart module.

---

## Ticket 7 — Cart pricing calculation service

**Ticket:** 7 — Cart pricing calculation service

**Objective:** Core service to compute line totals and cart-level tax/delivery/grand total.

**Files to create/update:**
- `backend/api/src/modules/pricing/services/cart-pricing.service.ts` (create)
- `backend/api/src/modules/pricing/utils/cart-pricing-math.util.ts` (create — pure math)

**API endpoints:** N/A (called by cart service).

**DB fields:** Updates computed totals on in-memory `CartRecord`.

**Implementation steps:**
1. `applyLineTotals(cart)` — set each `lineTotal = quantity * unitPriceSnapshot`.
2. `calculateCartPricing(cart)` — set subtotal, tax, delivery, discount (0), grandTotal, `lastCalculatedAt`.
3. Pure math util unit-testable separately.
4. Round currency to 2 decimal places (paise/rupees per existing catalog convention — match `store_products` integer storage if applicable).

**Acceptance criteria:**
- Service computes totals for multi-line cart fixture.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 6.

---

## Ticket 8 — Price drift detection utility

**Ticket:** 8 — Price drift detection utility

**Objective:** Detect when cart snapshots differ from current store product prices.

**Files to create/update:**
- `backend/api/src/modules/pricing/utils/cart-price-drift.util.ts` (create)

**API endpoints:** Used by GET `validatePrices` and checkout (Module 6).

**DB fields:** Compares `items[].unitPriceSnapshot` vs live `finalPrice`.

**Implementation steps:**
1. `detectCartPriceDrift(cart, currentPrices)` → `{ hasDrift, changedItems: [{ itemId, oldPrice, newPrice }] }`.
2. Threshold: exact match on numeric price (no tolerance unless PDF specifies).
3. Export for cart error `details`.

**Acceptance criteria:**
- Util detects single-line drift in unit test.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 6.

---

## Ticket 9 — CART_PRICE_CHANGED error registration and mapper

**Ticket:** 9 — CART_PRICE_CHANGED error registration and mapper

**Objective:** Register `CART_PRICE_CHANGED` in global errors and cart/pricing mappers.

**Files to create/update:**
- `backend/api/src/errors/error-codes.ts` (update — ensure `CART_PRICE_CHANGED` present)
- `backend/api/src/modules/cart/utils/cart-error.mapper.ts` (update — `cartPriceChangedError(details)`)
- `backend/api/src/modules/pricing/constants/pricing-error-codes.constant.ts` (create — align with cart)
- `docs/errors/phase-4-error-codes.md` (update — note implemented Module 5)

**API endpoints:** Thrown on `GET ?validatePrices=true` when drift detected.

**DB fields:** N/A.

**Implementation steps:**
1. HTTP 409, code `CART_PRICE_CHANGED`, details include `changedItems`.
2. Do not throw on silent recalculate path.

**Acceptance criteria:**
- Error code in `error-codes.ts`; mapper exports throw helper.

**Test commands:**
```bash
grep CART_PRICE_CHANGED backend/api/src/errors/error-codes.ts && \
npm run typecheck -w backend/api
```

**Depends on:** Ticket 8.

---

## Ticket 10 — Migrate cart totals util to pricing service

**Ticket:** 10 — Migrate cart totals util to pricing service

**Objective:** Delegate `cart-totals.util.ts` to pricing module (keep thin wrapper for backward compat in tests).

**Files to create/update:**
- `backend/api/src/modules/cart/utils/cart-totals.util.ts` (update — call `cart-pricing.service`)
- `backend/api/src/modules/pricing/services/cart-pricing.service.ts` (update — export functions used by cart)

**API endpoints:** N/A.

**DB fields:** Same cart fields recalculated via pricing service.

**Implementation steps:**
1. `recalculateCartTotals(cart)` → delegates to `calculateCartPricing`.
2. Preserve `recalculateLineTotal` export or move to pricing math util.
3. Update existing `cart-totals.util.test.ts` to still pass (or move tests to pricing).

**Acceptance criteria:**
- Existing cart totals tests pass or are relocated without regression.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/cart/utils/cart-totals.util.test.js
```

**Depends on:** Ticket 7.

---

## Ticket 11 — Integrate pricing into cart service mutations

**Ticket:** 11 — Integrate pricing into cart service mutations

**Objective:** Cart add/update flows refresh price snapshots and use full pricing calculation.

**Files to create/update:**
- `backend/api/src/modules/cart/services/cart.service.ts` (update)
- `backend/api/src/modules/cart/utils/cart-product-validation.util.ts` (update — return price for snapshot)

**API endpoints:**
- `POST /cart/items`, `PATCH /cart/items/:itemId` return full totals

**DB fields:** Persist updated snapshots and all total fields on save.

**Implementation steps:**
1. On add/update: set `unitPriceSnapshot` from resolved `storeProduct.finalPrice`.
2. Call pricing service before `persistCart`.
3. Refresh `productNameSnapshot` on recalculate paths.

**Acceptance criteria:**
- Add item returns non-zero tax/delivery when env set.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 9–10.

---

## Ticket 12 — Cart service: get with validatePrices and recalculate

**Ticket:** 12 — Cart service: get with validatePrices and recalculate

**Objective:** GET supports price validation; new recalculate method refreshes snapshots.

**Files to create/update:**
- `backend/api/src/modules/cart/services/cart.service.ts` (update)
- `backend/api/src/modules/cart/types/cart.types.ts` (update — `GetCartQuery.validatePrices?`)

**API endpoints:**
- `GET /api/v1/customer/cart?storeId=&validatePrices=true|false`
- `POST /api/v1/customer/cart/recalculate` (service method `recalculateCartForCustomer`)

**DB fields:** Full cart pricing fields after recalculate.

**Implementation steps:**
1. `getCart`: if `validatePrices=true`, detect drift → throw `CART_PRICE_CHANGED` (no save).
2. `recalculateCart`: resolve current prices, update snapshots, run pricing, persist, audit `customer.cart.recalculated`.
3. Default GET: return stored cart (recalculate totals from snapshots only, no live price fetch).

**Acceptance criteria:**
- validatePrices throws when seed price manually changed in DB.
- recalculate updates cart and clears drift.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 11.

---

## Ticket 13 — Cart HTTP: recalculate route and query validation

**Ticket:** 13 — Cart HTTP: recalculate route and query validation

**Objective:** Expose recalculate endpoint and `validatePrices` query on GET.

**Files to create/update:**
- `backend/api/src/modules/cart/controllers/cart.controller.ts` (update)
- `backend/api/src/modules/cart/routes/cart.routes.ts` (update)
- `backend/api/src/modules/cart/validators/cart.validators.ts` (update)
- `backend/api/src/modules/cart/constants/cart-audit-events.constant.ts` (update — `RECALCULATED`)

**API endpoints:**
- `GET /api/v1/customer/cart?storeId=&validatePrices=`
- `POST /api/v1/customer/cart/recalculate`

**DB fields:** Via service.

**Implementation steps:**
1. `recalculateCartQueryValidator` / body: `storeId` required.
2. `getCartQueryValidator` add optional `validatePrices` boolean (coerce from string).
3. Standard success envelope.

**Acceptance criteria:**
- Manual curl: recalculate after price change updates totals.

**Test commands:**
```bash
npm run typecheck -w backend/api && npm run build -w backend/api
```

**Depends on:** Ticket 12.

---

## Ticket 14 — Pricing math and drift unit tests

**Ticket:** 14 — Pricing math and drift unit tests

**Objective:** Unit tests for pricing math and price drift detection.

**Files to create/update:**
- `backend/api/src/modules/pricing/utils/cart-pricing-math.util.test.ts` (create)
- `backend/api/src/modules/pricing/utils/cart-price-drift.util.test.ts` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Math: subtotal + tax + delivery = grandTotal with discount 0.
2. Drift: detects one changed line; no drift when prices match.

**Acceptance criteria:**
- Both test files pass.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/pricing/utils/cart-pricing-math.util.test.js && \
node --test dist/modules/pricing/utils/cart-price-drift.util.test.js
```

**Depends on:** Tickets 7–8.

---

## Ticket 15 — Cart service pricing integration tests

**Ticket:** 15 — Cart service pricing integration tests

**Objective:** Service tests for validatePrices, recalculate, and priced mutations.

**Files to create/update:**
- `backend/api/src/modules/cart/services/cart.service.pricing.test.ts` (create)

**API endpoints:** Service-level.

**DB fields:** Mocked.

**Implementation steps:**
1. Add item applies tax/delivery from config mock.
2. validatePrices throws `CART_PRICE_CHANGED` when drift mocked.
3. recalculate updates snapshots and totals.

**Acceptance criteria:**
- Service pricing tests pass.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/cart/services/cart.service.pricing.test.js
```

**Depends on:** Ticket 13.

---

## Ticket 16 — Cart pricing route tests and package script

**Ticket:** 16 — Cart pricing route tests and package script

**Objective:** Route tests for recalculate + validatePrices; extend `test:customer-cart` script.

**Files to create/update:**
- `backend/api/src/modules/cart/routes/cart.routes.test.ts` (update)
- `backend/api/package.json` (update — extend `test:customer-cart` to include pricing tests)

**API endpoints:** `POST /recalculate`, GET with `validatePrices`.

**DB fields:** N/A.

**Implementation steps:**
1. Assert router exposes `POST /recalculate`.
2. Validator accepts `validatePrices` on GET query.
3. Script runs totals + service + pricing util + route tests.

**Acceptance criteria:**
- `npm run test:customer-cart -w backend/api` passes (includes pricing tests).

**Test commands:**
```bash
npm run test:customer-cart -w backend/api
```

**Depends on:** Tickets 14–15.

---

## Ticket 17 — Customer app cart types and API client for pricing

**Ticket:** 17 — Customer app cart types and API client for pricing

**Objective:** Extend cart client with recalculate and validatePrices support.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/types/cart.types.ts` (update — ensure all total fields)
- `apps/customer-app/src/modules/cart/api/customer-cart.api.ts` (update — `recalculateCustomerCart`, `getCustomerCart` optional validatePrices)
- `apps/customer-app/src/modules/cart/utils/customer-cart-error-message.util.ts` (update — `CART_PRICE_CHANGED` message + `isCartPriceChangedError`)

**API endpoints:**
- `GET /cart?validatePrices=`
- `POST /cart/recalculate`

**DB fields:** N/A (DTO).

**Implementation steps:**
1. Types include `taxAmount`, `deliveryFeeAmount`, `discountAmount`.
2. Error util suggests "Refresh prices" action.

**Acceptance criteria:**
- Client compiles.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 13.

---

## Ticket 18 — Customer app: cart totals breakdown UI

**Ticket:** 18 — Customer app: cart totals breakdown UI

**Objective:** Show subtotal, tax, delivery, discount, and grand total on cart screen and bottom bar uses `grandTotal`.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/components/CartSummaryFooter.tsx` (update)
- `apps/customer-app/src/modules/cart/components/CartBottomBar.tsx` (update — label optional "incl. tax & delivery")
- `docs/contracts/customer-app-cart-ui-contract.md` (update — breakdown rows)

**API endpoints:** Consumes enriched cart GET response.

**DB fields:** Display `subtotal`, `taxAmount`, `deliveryFeeAmount`, `discountAmount`, `grandTotal`.

**Implementation steps:**
1. Hide tax/delivery rows when amount is 0.
2. Show discount row only when `discountAmount > 0` (future-proof).
3. Bottom bar continues to show `grandTotal`.

**Acceptance criteria:**
- Cart screen shows breakdown when backend returns non-zero tax/delivery.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 17.

---

## Ticket 19 — Customer app: CART_PRICE_CHANGED UX

**Ticket:** 19 — Customer app: CART_PRICE_CHANGED UX

**Objective:** Handle stale prices with banner + refresh action calling recalculate.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/hooks/useRecalculateCart.ts` (create)
- `apps/customer-app/src/modules/cart/components/CartPriceChangedBanner.tsx` (create)
- `apps/customer-app/src/modules/cart/screens/CartScreen.tsx` (update)
- `apps/customer-app/src/modules/cart/hooks/useCustomerCart.ts` (update — optional validate on focus)

**API endpoints:**
- `POST /cart/recalculate`
- Optional: `GET ?validatePrices=true` on cart screen focus

**DB fields:** N/A.

**Implementation steps:**
1. On cart screen mount/focus: optional lightweight validate (or rely on mutation errors).
2. Banner: "Prices updated" + "Refresh" button → `useRecalculateCart`.
3. After refresh, invalidate cart query and clear banner.

**Acceptance criteria:**
- User can recover from `CART_PRICE_CHANGED` without leaving cart screen.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 18.

---

## Ticket 20 — Customer app pricing error unit tests

**Ticket:** 20 — Customer app pricing error unit tests

**Objective:** Extend customer-app cart tests for price-changed error mapping.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/utils/customer-cart-error-message.util.test.ts` (update)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Assert `CART_PRICE_CHANGED` maps to refresh-oriented message.
2. `npm run test:customer-cart -w apps/customer-app` still passes.

**Acceptance criteria:**
- Customer cart tests pass.

**Test commands:**
```bash
npm run test:customer-cart -w apps/customer-app
```

**Depends on:** Ticket 17.

---

## Ticket 21 — Contract, registry, and architecture doc updates

**Ticket:** 21 — Contract, registry, and architecture doc updates

**Objective:** Mark pricing behavior IMPLEMENTED in docs and registry.

**Files to create/update:**
- `docs/contracts/cart-api.md` (update — status note Module 5 IMPLEMENTED)
- `docs/contracts/backend-route-registry.md` (update — `POST /cart/recalculate`)
- `docs/architecture/customer-cart-backend-foundation.md` (update — pricing delegated to Module 5)
- `docs/architecture/phase-4-backend-file-structure.md` (update — `pricing/` IMPLEMENTED)
- `docs/database/cart-schema.md` (update — pricing fields active)

**API endpoints:**
- `POST /api/v1/customer/cart/recalculate` → **IMPLEMENTED**
- Enhanced totals on all cart routes

**DB fields:** Documented as live.

**Implementation steps:**
1. Link `cart-pricing-calculation.md` contract.
2. Link verification doc.

**Acceptance criteria:**
- Registry lists recalculate endpoint.

**Test commands:**
```bash
grep -q "recalculate" docs/contracts/backend-route-registry.md && \
grep -q "IMPLEMENTED" docs/contracts/cart-pricing-calculation.md && \
echo PASS
```

**Depends on:** Tickets 16, 19.

---

## Ticket 22 — Module 5 verification checklist and smoke results

**Ticket:** 22 — Module 5 verification checklist and smoke results

**Objective:** Verification checklist and smoke template for pricing scenarios.

**Files to create/update:**
- `docs/testing/customer-cart-pricing-calculation-verification.md` (update — checkboxes)
- `docs/testing/phase-4-module-5-smoke-results.md` (create)

**API endpoints:** Checklist covers recalculate, validatePrices, priced GET.

**DB fields:** Verify cart document totals in MongoDB after recalculate.

**Implementation steps:**
1. curl: add item → verify tax/delivery in response (with env set).
2. Change `store_products.finalPrice` in DB → GET validatePrices → 409 → POST recalculate → 200.
3. Customer app: breakdown visible; refresh works.

**Acceptance criteria:**
- Smoke results file exists.

**Test commands:**
```bash
test -f docs/testing/phase-4-module-5-smoke-results.md && echo PASS
```

**Depends on:** Ticket 21.

---

## Ticket 23 — Module 5 handoff and project context closeout

**Ticket:** 23 — Module 5 handoff and project context closeout

**Objective:** Close Module 5; update handoff files.

**Files to create/update:**
- `docs/handoffs/phase-4-pricing-cart-calculation-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — Module 5 DONE)
- `project-context/CURRENT_PROGRESS.md` (update)
- `docs/reviews/phase-4-pricing-cart-calculation-execution-tickets.md` (update — all DONE)

**API endpoints:** Summary including `POST /cart/recalculate`.

**DB fields:** `carts` pricing fields populated by calculation service.

**Implementation steps:**
1. List artifacts, env vars, test commands.
2. Known limitations: flat tax/delivery, no promotions, checkout uses pricing in Module 6.
3. Next: Module 6 Checkout Preparation Backend.

**Acceptance criteria:**
- Handoff complete; Module 6 not started.

**Test commands:**
```bash
test -f docs/handoffs/phase-4-pricing-cart-calculation-complete.md && \
grep "Module 5" project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md
```

**Depends on:** Ticket 22.

---

## Module closeout

**Phase 4 Module 5 — Pricing & Cart Calculation:** `COMPLETE` (Tickets 1–23 DONE)

**Next module to implement:** **Module 6 — Checkout Preparation Backend** (after Ticket 23 DONE)

**Execution order summary:**
```text
1–2 docs → 3–10 pricing core → 11–13 cart integration/HTTP → 14–16 backend tests
→ 17–20 customer app pricing UX → 21–23 closeout
```
