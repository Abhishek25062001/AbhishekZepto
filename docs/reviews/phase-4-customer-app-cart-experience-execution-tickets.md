# Phase 4 Customer App Cart Experience — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 4 — Customer App Cart Experience  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Module 4 tasks, pages 46–47)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Module 4 micro-tasks, pages 10–12)

**Architecture references (Module 0–3):**  
`docs/architecture/phase-4-customer-shopping-architecture.md`, `docs/architecture/phase-4-customer-app-file-structure.md`, `docs/contracts/cart-api.md`, `docs/contracts/customer-app-home-ui-contract.md`, `docs/errors/phase-4-error-codes.md`, `docs/validation/phase-4-validation-rules.md`, `docs/architecture/customer-cart-backend-foundation.md`, `docs/handoffs/phase-4-cart-backend-foundation-complete.md`

**Prerequisites:**  
Phase 4 **Module 3 complete** (cart APIs live); **Module 1** `useLocationContext` / `selectedStoreId`; **Module 2** shopping-entry home; Phase 3 customer catalog read UI (`ProductDetailScreen` add-to-cart placeholder); Phase 2 customer auth.

**PDF vs Module 0 alignment (implement using existing contracts):**

| PDF / legacy | Implementation |
|--------------|----------------|
| Cart screen with line items | `CartScreen` — `GET /cart`, PATCH/DELETE lines |
| Add to cart on product detail | `ProductDetailScreen` + selected `variantId` |
| Add to cart on listings | `ProductCard` / listing screens using `product.variantId` (default variant from catalog search) |
| Cart bottom bar / mini-cart | `CartBottomBar` on shopping surfaces (Home + Catalog entry) |
| Cart merge / guest cart | **Out of scope** — no `POST /cart/merge` |
| Checkout CTA on cart | **Module 7** — show disabled or “Checkout — coming soon” only |
| Tax / promo breakdown UI | **Module 5** — display `subtotal` + `grandTotal` from Module 3 baseline |
| `CART_PRICE_CHANGED` UX | **Module 5** — not in this module |

**Out of scope for this module:**
- Backend API or MongoDB changes (Module 3 owns cart APIs)
- Checkout, payment, orders (Modules 6–11)
- Inventory locks (Module 6)
- Full pricing engine UI (Module 5)
- Search/browse pagination / OOS polish (Module 13)
- `packages/shared` cart types (use app-local types mirroring `cart-api.md` unless one ticket adds minimal shared mirror)
- Repository & Codebase Setup (Phase 1)
- Admin / vendor surfaces

**Execution order notes:**
- Run **Tickets 1–2** (docs) before customer-app code.
- Run **Tickets 3–9** (scaffold, API client, hooks) before **Tickets 10–16** (UI).
- Run **Tickets 17–20** (add-to-cart wiring) after hooks + `AddToCartButton`.
- Run **Ticket 21** (bottom bar placement) after `CartScreen` + `useCart`.
- Run **Tickets 22–23** (tests) after UI wiring.
- Run **Tickets 24–26** (docs/registry/verification) then **Ticket 27** (handoff).

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-19)

---

## Ticket 1 — Module 4 implementation alignment docs

**Ticket:** 1 — Module 4 implementation alignment docs

**Objective:** Document Module 4 customer-app scope, cart UX flows, and integration points with Module 3 APIs before coding.

**Files to create/update:**
- `docs/architecture/customer-app-cart-experience.md` (create)
- `docs/testing/customer-app-cart-experience-verification.md` (create)

**API endpoints:** Document consumer usage (no backend work):
- `GET|POST|PATCH|DELETE /api/v1/customer/cart/*`

**DB fields:** N/A (client reads cart DTO from API). Reference `docs/database/cart-schema.md` for field meaning.

**Implementation steps:**
1. Flow: `selectedStoreId` → add item → bottom bar updates → open `CartScreen` → adjust qty / remove / clear.
2. Treat `CART_NOT_FOUND` on GET as empty cart (0 items) until first add.
3. All mutations pass `storeId` from `useLocationContext`.
4. Listing add-to-cart uses `CustomerProduct.variantId` when present; detail uses `ProductVariantSelector` selection.
5. QA: dev customer `9999999999`, store `STORE-000001`, seeded cart via `seedDemoCart`.
6. Explicitly defer checkout navigation to Module 7.

**Acceptance criteria:**
- Docs match AllPhase Module 4 + PDF pages 10–12; no application code.

**Test commands:**
```bash
test -f docs/architecture/customer-app-cart-experience.md && \
test -f docs/testing/customer-app-cart-experience-verification.md && \
echo PASS
```

**Depends on:** Phase 4 Module 3 complete.

---

## Ticket 2 — Customer app cart UI contract

**Ticket:** 2 — Customer app cart UI contract

**Objective:** Define screens, components, hooks, navigation, and error UX for the cart module (mirror `customer-app-home-ui-contract.md` pattern).

**Files to create/update:**
- `docs/contracts/customer-app-cart-ui-contract.md` (create)
- `docs/contracts/customer-app-home-ui-contract.md` (update — remove “no add-to-cart” note; point to Module 4 contract)
- `docs/validation/phase-4-validation-rules.md` (update — add **Customer app cart** section: client must send `storeId`, quantity min 1)

**API endpoints:** Maps UI actions to:
- `POST /api/v1/customer/cart/items`
- `GET /api/v1/customer/cart`
- `PATCH /api/v1/customer/cart/items/:itemId`
- `DELETE /api/v1/customer/cart/items/:itemId`
- `DELETE /api/v1/customer/cart`

**DB fields:** N/A (DTO fields: `items[].id`, `quantity`, `unitPriceSnapshot`, `lineTotal`, `grandTotal`).

**Implementation steps:**
1. Screen table: `Cart` route, `CartScreen`.
2. Components: `CartBottomBar`, `CartLineItem`, `AddToCartButton`, `CartSummaryFooter`.
3. Hooks: `useCart`, `useAddToCart`, `useUpdateCartItem`, `useRemoveCartItem`, `useClearCart`.
4. Error mapping table for `CART_*` codes → toast/inline messages.
5. Bottom bar visibility rules (Home + Catalog stack; hidden on Cart screen itself).

**Acceptance criteria:**
- Contract implementable without guessing component names or navigation params.

**Test commands:**
```bash
grep -q "CartBottomBar" docs/contracts/customer-app-cart-ui-contract.md && \
grep -q "storeId" docs/validation/phase-4-validation-rules.md && \
echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Customer app cart module scaffold

**Ticket:** 3 — Customer app cart module scaffold

**Objective:** Create `apps/customer-app/src/modules/cart/` folder layout per `phase-4-customer-app-file-structure.md`.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/api/` (create)
- `apps/customer-app/src/modules/cart/hooks/` (create)
- `apps/customer-app/src/modules/cart/screens/` (create)
- `apps/customer-app/src/modules/cart/components/` (create)
- `apps/customer-app/src/modules/cart/types/` (create)
- `apps/customer-app/src/modules/cart/utils/` (create)
- `apps/customer-app/src/modules/cart/store/` (create — optional optimistic badge; may use React Query only)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Mirror `modules/home/` and `modules/addresses/` folder pattern.
2. No screens or API calls yet.

**Acceptance criteria:**
- Folder tree exists; `npm run typecheck -w apps/customer-app` passes.

**Test commands:**
```bash
test -d apps/customer-app/src/modules/cart/api && \
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 1–2.

---

## Ticket 4 — Cart types and query keys

**Ticket:** 4 — Cart types and query keys

**Objective:** App-local TypeScript types and React Query keys aligned with `cart-api.md`.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/types/cart.types.ts` (create)
- `apps/customer-app/src/modules/cart/utils/cart-query-keys.util.ts` (create)

**API endpoints:** N/A (types only).

**DB fields:** Mirror response: `CartResponse`, `CartItemResponse`, `AddCartItemRequest`, `UpdateCartItemRequest`.

**Implementation steps:**
1. Types match backend mapper fields (`id`, `storeId`, `items[]`, totals, `currency`).
2. Query key factory: `['customer-cart', storeId]`.
3. No `packages/shared` unless explicitly needed for compile.

**Acceptance criteria:**
- Types compile; keys exported for hooks.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 3.

---

## Ticket 5 — Cart API client

**Ticket:** 5 — Cart API client

**Objective:** Typed HTTP client for all five cart endpoints using existing `apiClient`.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/api/customer-cart.api.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/cart?storeId=`
- `POST /api/v1/customer/cart/items`
- `PATCH /api/v1/customer/cart/items/:itemId?storeId=`
- `DELETE /api/v1/customer/cart/items/:itemId?storeId=`
- `DELETE /api/v1/customer/cart?storeId=`

**DB fields:** N/A.

**Implementation steps:**
1. Functions: `getCustomerCart`, `addCartItem`, `updateCartItem`, `removeCartItem`, `clearCustomerCart`.
2. Use standard success envelope parsing (same pattern as `customer-home.api.ts`).
3. Pass `storeId` on every call.

**Acceptance criteria:**
- Client compiles; no UI.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 4.

---

## Ticket 6 — Cart error message utility

**Ticket:** 6 — Cart error message utility

**Objective:** Map `CART_*` API error codes to user-facing strings.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/utils/customer-cart-error-message.util.ts` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Handle: `CART_NOT_FOUND`, `CART_ITEM_NOT_FOUND`, `CART_PRODUCT_UNAVAILABLE`, `CART_INSUFFICIENT_STOCK`, `CART_MAX_QUANTITY_EXCEEDED`, `CART_STORE_MISMATCH`, `STORE_NOT_FOUND`.
2. Default fallback for unknown errors.
3. Export `isCartNotFoundError` helper for empty-state handling.

**Acceptance criteria:**
- Util compiles; used by hooks/screens in later tickets.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 5.

---

## Ticket 7 — useCustomerCart query hook

**Ticket:** 7 — useCustomerCart query hook

**Objective:** React Query hook to load active cart for `selectedStoreId`.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/hooks/useCustomerCart.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/cart`

**DB fields:** N/A.

**Implementation steps:**
1. Read `selectedStoreId` from `useLocationContext`.
2. `enabled: Boolean(selectedStoreId)`.
3. On `CART_NOT_FOUND`, return synthetic empty cart (`items: []`, counts 0) — do not surface as fatal error.
4. Expose `itemCount` (sum of quantities) and `grandTotal` selectors for bottom bar.

**Acceptance criteria:**
- Hook compiles; query key includes `storeId`.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 5–6; Module 1 `useLocationContext`.

---

## Ticket 8 — Cart mutation hooks

**Ticket:** 8 — Cart mutation hooks

**Objective:** React Query mutations for add, update quantity, remove line, and clear cart.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/hooks/useAddToCart.ts` (create)
- `apps/customer-app/src/modules/cart/hooks/useUpdateCartItem.ts` (create)
- `apps/customer-app/src/modules/cart/hooks/useRemoveCartItem.ts` (create)
- `apps/customer-app/src/modules/cart/hooks/useClearCart.ts` (create)

**API endpoints:**
- `POST /api/v1/customer/cart/items`
- `PATCH /api/v1/customer/cart/items/:itemId`
- `DELETE /api/v1/customer/cart/items/:itemId`
- `DELETE /api/v1/customer/cart`

**DB fields:** N/A.

**Implementation steps:**
1. Invalidate `['customer-cart', storeId]` on success.
2. `useAddToCart`: accept `{ variantId, quantity }`; default quantity `1`.
3. Surface mutation errors via `customer-cart-error-message.util`.
4. Optional: `isPending` per mutation for button loading states.

**Acceptance criteria:**
- Mutations compile; invalidate cart query.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 7.

---

## Ticket 9 — Cart price display utility

**Ticket:** 9 — Cart price display utility

**Objective:** Format cart money fields (`unitPriceSnapshot`, `lineTotal`, `grandTotal`) consistently with catalog pricing.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/utils/cart-price.util.ts` (create)

**API endpoints:** N/A.

**DB fields:** Uses numeric snapshot fields from cart DTO (paise/cents per existing catalog convention).

**Implementation steps:**
1. Reuse or wrap `formatProductPrice` from catalog utils if amounts share units.
2. Export `formatCartLineTotal`, `formatCartGrandTotal`.

**Acceptance criteria:**
- Util compiles; documents unit assumption in comment if needed.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 4.

---

## Ticket 10 — AddToCartButton component

**Ticket:** 10 — AddToCartButton component

**Objective:** Reusable add-to-cart control with loading and disabled states.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/components/AddToCartButton.tsx` (create)

**API endpoints:**
- `POST /api/v1/customer/cart/items` (via `useAddToCart`)

**DB fields:** N/A.

**Implementation steps:**
1. Props: `variantId`, `quantity?`, `disabled?`, `compact?` (for cards).
2. Disable when no `selectedStoreId` or product unavailable.
3. Show loading spinner while mutation pending.
4. On success: brief feedback (optional toast or label flash).

**Acceptance criteria:**
- Component renders with mock props; typecheck passes.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 8.

---

## Ticket 11 — Cart line item and quantity controls

**Ticket:** 11 — Cart line item and quantity controls

**Objective:** Single cart row with name, unit price, quantity stepper, line total, remove action.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/components/CartLineItem.tsx` (create)
- `apps/customer-app/src/modules/cart/components/CartQuantityStepper.tsx` (create)

**API endpoints:**
- `PATCH /api/v1/customer/cart/items/:itemId`
- `DELETE /api/v1/customer/cart/items/:itemId`

**DB fields:** `items[].id`, `quantity`, `unitPriceSnapshot`, `lineTotal`, `productNameSnapshot`.

**Implementation steps:**
1. Stepper: decrement to remove at qty 1 (confirm or direct remove — document choice in architecture doc).
2. Increment calls PATCH with `quantity + 1`; handle `CART_INSUFFICIENT_STOCK`.
3. Remove button calls DELETE line.

**Acceptance criteria:**
- Components compile; accept cart item DTO as props.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 8–9.

---

## Ticket 12 — Cart summary and empty/error states

**Ticket:** 12 — Cart summary and empty/error states

**Objective:** Footer totals and cart screen empty/error UI.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/components/CartSummaryFooter.tsx` (create)
- `apps/customer-app/src/modules/cart/components/CartEmptyState.tsx` (create)
- `apps/customer-app/src/modules/cart/components/CartErrorState.tsx` (create)

**API endpoints:** N/A (display only).

**DB fields:** `subtotal`, `grandTotal`, `currency`; Module 3 zeros for tax/discount/delivery.

**Implementation steps:**
1. Footer shows item count, subtotal, grandTotal (no tax/discount rows in Module 4).
2. Checkout button **disabled** with label “Checkout — coming soon” (Module 7).
3. Empty state CTA: “Start shopping” → navigate to `Catalog` or `Home`.

**Acceptance criteria:**
- Components compile with mock cart data.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 9.

---

## Ticket 13 — CartScreen

**Ticket:** 13 — CartScreen

**Objective:** Full cart screen with line list, clear cart, pull-to-refresh, and summary footer.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/screens/CartScreen.tsx` (create)

**API endpoints:**
- `GET /api/v1/customer/cart`
- `PATCH|DELETE` line, `DELETE` clear (via hooks)

**DB fields:** Full cart DTO.

**Implementation steps:**
1. `useCustomerCart` drives list; pull-to-refresh → `refetch`.
2. Map `items[]` to `CartLineItem`.
3. “Clear cart” action → `useClearCart` with confirm dialog.
4. Loading skeleton; `CartEmptyState` / `CartErrorState`.
5. Hide `CartBottomBar` when this screen is focused (document in contract).

**Acceptance criteria:**
- Screen compiles; shows seeded cart against running API + Module 3 backend.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 11–12.

---

## Ticket 14 — CartBottomBar component

**Ticket:** 14 — CartBottomBar component

**Objective:** Persistent mini-cart bar showing item count, grand total, and navigation to cart.

**Files to create/update:**
- `apps/customer-app/src/modules/cart/components/CartBottomBar.tsx` (create)

**API endpoints:**
- `GET /api/v1/customer/cart` (via `useCustomerCart`)

**DB fields:** `grandTotal`, sum of `items[].quantity`.

**Implementation steps:**
1. Hidden when `itemCount === 0`.
2. Tap → navigate to `Cart` screen.
3. Safe-area padding for notched devices.
4. Use `cart-price.util` for total display.

**Acceptance criteria:**
- Bar compiles; renders when cart has items (mock or live query).

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 7.

---

## Ticket 15 — Navigation: Cart route and bottom bar placement

**Ticket:** 15 — Navigation: Cart route and bottom bar placement

**Objective:** Register `Cart` screen and show `CartBottomBar` on primary shopping surfaces.

**Files to create/update:**
- `apps/customer-app/src/app/MainNavigator.tsx` (update — `Cart` screen)
- `apps/customer-app/src/app/navigation.types.ts` (update — `Cart: undefined`)
- `apps/customer-app/src/modules/home/screens/CustomerHomeScreen.tsx` (update — overlay `CartBottomBar`)
- `apps/customer-app/src/modules/catalog/navigation/catalog.navigator.tsx` (update — wrapper or screen option for bottom bar on catalog stack entry)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Add `Stack.Screen` `Cart` → `CartScreen`.
2. Mount `CartBottomBar` on `CustomerHomeScreen` (absolute bottom).
3. For catalog: wrap `CatalogNavigator` parent or add bar to `CatalogHomeScreen` + propagate visibility policy in architecture doc (avoid duplicate bars).
4. `CustomerHome` header optional cart icon → `Cart` (if in contract).

**Acceptance criteria:**
- User can open Cart from bottom bar after adding an item on Home/Catalog.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 13–14.

---

## Ticket 16 — Product detail: add to cart

**Ticket:** 16 — Product detail: add to cart

**Objective:** Replace placeholder add-to-cart on `ProductDetailScreen` with live cart integration.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/screens/ProductDetailScreen.tsx` (update)
- `apps/customer-app/src/modules/catalog/components/ProductVariantSelector.tsx` (update — ensure parent receives selected variant via callback; avoid duplicate `onSelect` churn if needed)

**API endpoints:**
- `POST /api/v1/customer/cart/items`

**DB fields:** `variantId` from selected variant; `storeId` from location context.

**Implementation steps:**
1. Track `selectedVariant` state from `ProductVariantSelector`.
2. Replace disabled button with `AddToCartButton` (`variantId={selectedVariant.id}`).
3. Respect `addToCartDisabled` for OOS/unavailable.
4. On success, bottom bar updates via query invalidation.

**Acceptance criteria:**
- User can add selected variant from product detail to cart.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Tickets 10, 15.

---

## Ticket 17 — Listing screens: add to cart on product cards

**Ticket:** 17 — Listing screens: add to cart on product cards

**Objective:** Quick add-to-cart on catalog listing grids/lists using default `variantId` from search results.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/components/ProductCard.tsx` (update — optional `onAddToCart` or embedded compact `AddToCartButton`)
- `apps/customer-app/src/modules/catalog/screens/CategoryProductsScreen.tsx` (update)
- `apps/customer-app/src/modules/catalog/screens/BrandProductsScreen.tsx` (update)
- `apps/customer-app/src/modules/catalog/screens/CatalogSearchScreen.tsx` (update)

**API endpoints:**
- `POST /api/v1/customer/cart/items`

**DB fields:** `CustomerProduct.variantId` required for quick add; hide button if missing.

**Implementation steps:**
1. Show compact add control only when `variantId` present and product available.
2. Prevent card `onPress` when tapping add button (`stopPropagation` / separate pressable).
3. Do not fetch variants on listing — detail screen remains place for multi-variant pick.

**Acceptance criteria:**
- User can quick-add from category/brand/search listings when variant is known.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 10.

---

## Ticket 18 — Home featured: add to cart

**Ticket:** 18 — Home featured: add to cart

**Objective:** Enable add-to-cart on home featured products (Module 2 deferred this to Module 4).

**Files to create/update:**
- `apps/customer-app/src/modules/home/components/HomeFeaturedSection.tsx` (update)
- `apps/customer-app/src/modules/home/screens/CustomerHomeScreen.tsx` (update — pass handlers if needed)
- `docs/contracts/customer-app-home-ui-contract.md` (update — featured may show add control)

**API endpoints:**
- `POST /api/v1/customer/cart/items`

**DB fields:** `variantId` on featured product DTO.

**Implementation steps:**
1. Extend featured card row to include compact `AddToCartButton` when `variantId` set.
2. Keep category taps as browse-only (no cart on category chips unless PDF requires — default: products only).

**Acceptance criteria:**
- Featured product with `variantId` can be added from home without opening detail.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 10.

---

## Ticket 19 — Catalog home quick add (optional listing)

**Ticket:** 19 — Catalog home quick add

**Objective:** Align `CatalogHomeScreen` product sections with same quick-add pattern as other listings (if catalog home shows product grid).

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/screens/CatalogHomeScreen.tsx` (update — only if product cards rendered; comment-only if no product grid)

**API endpoints:**
- `POST /api/v1/customer/cart/items`

**DB fields:** `variantId` on listing products.

**Implementation steps:**
1. If `CatalogHomeScreen` renders `ProductCard`, wire `AddToCartButton` same as Ticket 17.
2. If browse-only sections, document no change in architecture doc.

**Acceptance criteria:**
- No duplicate cart UX; catalog home consistent with other listings.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 17.

---

## Ticket 20 — Dev navigation entry to cart (development)

**Ticket:** 20 — Dev navigation entry to cart (development)

**Objective:** Expose Cart screen from dev menu for QA without requiring add-to-cart first.

**Files to create/update:**
- `apps/customer-app/src/screens/main/HomeScreen.tsx` (update — dev link to `Cart` if `isDevelopment`)
- `docs/testing/customer-app-cart-experience-verification.md` (update — dev navigation note)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Dev-only button: “Open Cart” → `navigation.navigate('Cart')`.
2. Production users rely on bottom bar / future header icon only.

**Acceptance criteria:**
- Dev build can open Cart screen directly.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app
```

**Depends on:** Ticket 15.

---

## Ticket 21 — Cart module unit tests

**Ticket:** 21 — Cart module unit tests

**Objective:** Unit tests for cart price formatting and error message mapping (mirror catalog test pattern).

**Files to create/update:**
- `apps/customer-app/src/modules/cart/utils/cart-price.util.test.ts` (create)
- `apps/customer-app/src/modules/cart/utils/customer-cart-error-message.util.test.ts` (create)
- `apps/customer-app/package.json` (update — add `test:customer-cart` script)
- `apps/customer-app/tsconfig.cart-test.json` (create — mirror `tsconfig.catalog-test.json` if needed)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Test price formatting edge cases (0, large values).
2. Test each `CART_*` code maps to non-empty string.
3. Script runs compiled tests from `dist-cart-test/` or equivalent pattern.

**Acceptance criteria:**
- `npm run test:customer-cart -w apps/customer-app` passes.

**Test commands:**
```bash
npm run test:customer-cart -w apps/customer-app
```

**Depends on:** Tickets 6, 9.

---

## Ticket 22 — Cart UI contract and architecture doc finalization

**Ticket:** 22 — Cart UI contract and architecture doc finalization

**Objective:** Mark customer cart UI contract **IMPLEMENTED** after screens ship; cross-link backend cart API.

**Files to create/update:**
- `docs/contracts/customer-app-cart-ui-contract.md` (update — status IMPLEMENTED)
- `docs/architecture/customer-app-cart-experience.md` (update — navigation diagram, bottom bar placement)
- `docs/architecture/phase-4-customer-app-file-structure.md` (update — cart module status IMPLEMENTED)

**API endpoints:** Document client mapping to Module 3 endpoints (already IMPLEMENTED).

**DB fields:** N/A.

**Implementation steps:**
1. Add mermaid or ASCII flow: browse → add → bottom bar → cart screen.
2. Link `docs/contracts/cart-api.md` and verification doc.

**Acceptance criteria:**
- Docs reflect shipped screens and hooks.

**Test commands:**
```bash
grep -q "IMPLEMENTED" docs/contracts/customer-app-cart-ui-contract.md && \
grep -q "CartScreen" docs/architecture/customer-app-cart-experience.md && \
echo PASS
```

**Depends on:** Tickets 13–20.

---

## Ticket 23 — Module 4 verification checklist and smoke results

**Ticket:** 23 — Module 4 verification checklist and smoke results

**Objective:** Verification checklist and smoke results template for manual device QA.

**Files to create/update:**
- `docs/testing/customer-app-cart-experience-verification.md` (update — checkboxes)
- `docs/testing/phase-4-module-4-smoke-results.md` (create)

**API endpoints:** Checklist covers add, view cart, update qty, remove, clear, bottom bar.

**DB fields:** Verify cart in MongoDB optional for QA (`carts` collection).

**Implementation steps:**
1. Device steps: login → select store → add from detail → bottom bar → cart screen → clear.
2. Error cases: insufficient stock message, unavailable product.
3. PASS/FAIL template per step.

**Acceptance criteria:**
- Smoke results file exists.

**Test commands:**
```bash
test -f docs/testing/phase-4-module-4-smoke-results.md && echo PASS
```

**Depends on:** Ticket 22.

---

## Ticket 24 — Module 4 handoff and project context closeout

**Ticket:** 24 — Module 4 handoff and project context closeout

**Objective:** Close Module 4; update handoff files; mark execution tracker DONE.

**Files to create/update:**
- `docs/handoffs/phase-4-customer-app-cart-experience-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — Module 4 DONE)
- `project-context/CURRENT_PROGRESS.md` (update)
- `docs/reviews/phase-4-customer-app-cart-experience-execution-tickets.md` (update — all DONE)

**API endpoints:** Summary — client consumes Module 3 cart APIs only.

**DB fields:** N/A (client-only module).

**Implementation steps:**
1. List artifacts: module path, screens, test commands.
2. Known limitations: no checkout, basic totals, listing add requires `variantId`.
3. Next: Module 5 Pricing & Cart Calculation.

**Acceptance criteria:**
- Handoff complete; Module 5 not started.

**Test commands:**
```bash
test -f docs/handoffs/phase-4-customer-app-cart-experience-complete.md && \
grep "Module 4" project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md
```

**Depends on:** Ticket 23.

---

## Module closeout

**Phase 4 Module 4 — Customer App Cart Experience:** `DONE` (Tickets 1–24, 2026-05-19)

**Next module to implement:** **Module 5 — Pricing & Cart Calculation** (after Ticket 24 DONE)

**Execution order summary:**
```text
1–2 docs → 3–9 client foundation → 10–14 UI → 15 navigation/bottom bar
→ 16–19 add-to-cart surfaces → 20 dev QA → 21 tests → 22–24 closeout
```
