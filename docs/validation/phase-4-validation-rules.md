# Phase 4 Validation Rules

Status: **PLANNED** — implement in Module 1+ validators.

## Global

| Rule | Applies to |
|------|------------|
| Authenticated customer only | All `/api/v1/customer/*` Phase 4 routes |
| `customerId` from JWT must match resource owner | addresses, cart, checkout, payments, orders |
| ObjectId format for path/body ids | All `:id` params |

## Home (Module 2)

| Field | Rule |
|-------|------|
| `storeId` | Required; valid ObjectId; should match customer selected store when enforced |
| `cityId` | Optional ObjectId; required for catalog scope when filtering by `storeId` |
| `categoryLimit` | Integer 1–50; default 20 |
| `featuredLimit` | Integer 1–50; default 20 |

## Address (Module 1)

| Field | Rule |
|-------|------|
| `label` | 1–50 chars |
| `line1` | 1–200 chars |
| `latitude` | -90 to 90 |
| `longitude` | -180 to 180 |
| `isDefault` | At most one true per customer |

## Cart (Module 3)

| Field / Rule | Detail |
|--------------|--------|
| `storeId` | Required on GET (query), POST body, PATCH/DELETE query |
| `variantId` | Required on add; must exist on store |
| `itemId` | Path param; must exist on cart `items[]` |
| `quantity` | Integer, min 1, max `CART_MAX_QUANTITY_PER_LINE` (default 10, env) |
| Stock | `availableQuantity >= quantity` at mutation time |
| Price | Recalculate snapshot on add/update; totals in Module 3 baseline |

## Customer app cart (Module 4)

| Rule | Detail |
|------|--------|
| `storeId` | Client must send `selectedStoreId` on every cart API call |
| `quantity` | Min 1 on add/update; default add quantity `1` |
| `variantId` | Required for add; from product detail selector or listing `variantId` |
| GET empty | Treat `CART_NOT_FOUND` as zero items in UI |

## Pricing (Module 5)

| Field / Rule | Detail |
|--------------|--------|
| `validatePrices` | Optional boolean on GET cart |
| `POST /recalculate` | Requires `storeId`; refreshes snapshots |
| Totals | `taxAmount`, `deliveryFeeAmount` from env; `discountAmount = 0` MVP |
| Drift | `unitPriceSnapshot` must match `store_products.finalPrice` when validating |

## Checkout (Module 6)

| Field / Rule | Detail |
|--------------|--------|
| `addressId` | Required ObjectId on initiate |
| `storeId` | Optional ObjectId; must match cart when provided |
| `idempotencyKey` | Optional string, max 128 chars |
| `checkoutSessionId` | Required ObjectId on cancel; optional on summary GET |
| `reason` | Optional string on cancel, max 200 chars |
| Cart | Non-empty, `status=active` |
| Address | Belongs to customer; `isDeleted=false` |
| Serviceability | Address coordinates within store `serviceRadiusKm` |
| Store | `status=active`, `isOpen=true`, `isAcceptingOrders=true` |
| Pricing | `unitPriceSnapshot` must match `store_products.finalPrice` at initiate |
| Stock | `availableQuantity >= quantity` per line before locks |
| Session | One active `initiated` per customer; prior session cancelled on new initiate |
| Reservation | `reservationExpiresAt` from `CHECKOUT_RESERVATION_TTL_SECONDS` (default 900) |
| Locks | `lockType=checkout`; released on cancel/expiry |
| Totals | `summarySnapshot.grandTotal` authoritative for payment (Module 8) |

## Customer app checkout (Module 7)

| Rule | Detail |
|------|--------|
| Address | `selectedAddressId` or user-picked address required before initiate |
| Initiate | Client sends `addressId`; optional `storeId` from `selectedStoreId` |
| Session | Store `checkoutSessionId` locally after initiate for summary/cancel |
| Cancel | Confirm before back; call `POST /checkout/cancel` |
| Timer | UI countdown from `reservationExpiresAt`; block pay when expired |
| Payment CTA | Enabled Module 9 — see customer app payment rules |

## Customer app payment (Module 9)

| Rule | Detail |
|------|--------|
| Session | `checkoutSessionId` from active initiate before pay |
| Idempotency | New `idempotencyKey` per pay attempt (max 128 chars) |
| Amount | Use create-order `amount` (paise) + `currency` for SDK only |
| Verify | Send SDK `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature` + `paymentId` |
| Cancel | Do not call checkout cancel when starting payment |
| Success | Show `paymentId`; `orderId` may be null until Module 10 |
| Guards | Disable pay when reservation expired or no session |

## Payment (Module 8)

| Field / Rule | Detail |
|--------------|--------|
| `checkoutSessionId` | Required ObjectId; session `status=initiated`; `customerId` matches JWT |
| `idempotencyKey` | Required on create-order; string 1–128 chars |
| `paymentId` | Required ObjectId on verify; owned by customer |
| `razorpayOrderId` | Required non-empty; must match `payments.gatewayOrderId` |
| `razorpayPaymentId` | Required non-empty on verify |
| `razorpaySignature` | Required non-empty; HMAC `order_id\|payment_id` with key secret |
| Amount | `payments.amount` (paise) = `summarySnapshot.grandTotal` × 100 at create |
| Session | Not expired (`reservationExpiresAt` > now) on create-order |
| Signature | Valid on verify; invalid → compensation + `PAYMENT_VERIFICATION_FAILED` |
| Webhook | `X-Razorpay-Signature` with raw body + webhook secret |
| Idempotency | Duplicate create → same payment; duplicate verify → same 200 payload |
| Module 8 verify | Response includes `orderId` after Module 10 placement |

## Order (Module 10 — server)

| Field / Rule | Detail |
|--------------|--------|
| `paymentId` | Required ObjectId on POST; payment must be `paid` + `signatureVerified` |
| Idempotency | Unique `paymentId` → one order document |
| `orderId` path | Valid ObjectId; owned by customer |
| List query | `page` ≥ 1, `limit` 1–50, optional `status=placed` |
| Placement | Confirm all checkout `lockTokens`; clear cart; complete checkout session |
| Verify response | Includes `orderId` after successful placement |

## Order (Module 11 — customer app, display-only)

| Field / Rule | Detail |
|--------------|--------|
| Client placement | **No** `POST /orders` from app in Phase 4 |
| Navigation | `orderId` from verify only; required for `OrderSuccess` |
| List/detail | Read-only; `page` ≥ 1, `limit` default 20 |
| Status UI | Display `placed` only; no client status mutation |

## Profile (Module 12)

| Field / Rule | Detail |
|--------------|--------|
| `name` | Optional on PATCH; 1–100 chars when string; `null` clears |
| `email` | Optional on PATCH; valid email when string; lowercase trim; `null` clears |
| `phone` | Read-only — not in PATCH body |
| PATCH body | At least one of `name` or `email` required |
| Scope | Customer may only read/update own `user_identities` row |
| Role | `role=customer`, `isDeleted=false` |

## API Mapping

| Domain | Contract |
|--------|----------|
| Home | `docs/contracts/customer-home-shopping-entry-api.md` |
| Address | `docs/contracts/customer-address-api.md` |
| Cart | `docs/contracts/cart-api.md` |
| Checkout | `docs/contracts/checkout-api.md` |
| Payment | `docs/contracts/payment-api.md` |
| Order | `docs/contracts/order-customer-api.md` |
