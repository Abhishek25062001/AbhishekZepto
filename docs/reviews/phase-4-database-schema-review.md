# Phase 4 Database Schema Review

**Date:** 2026-05-19  
**Reference:** `docs/database/*-schema.md`, Phase 4 index plan

## customer_addresses — PASS

| Field (doc) | Model | Status |
|-------------|-------|--------|
| customerId, label, lines, city, cityId, coordinates | Present | PASS |
| isDefault, status, soft-delete | Present | PASS |

Model: `customer-addresses/models/customer-address.model.ts`

## customer_store_selections — PASS

| Field (doc) | Model | Status |
|-------------|-------|--------|
| customerId, storeId, addressId, isSelected | Present | PASS |

Model: `customer-addresses/models/customer-store-selection.model.ts`

## carts — PASS

| Field (doc) | Model | Status |
|-------------|-------|--------|
| customerId, storeId, status | Present | PASS |
| items[] with variantId, snapshots, quantity | Present | PASS |
| subtotal, tax, delivery, grandTotal | Present | PASS |

Model: `cart/models/cart.model.ts`

## checkout_sessions — PASS

| Field (doc) | Model | Status |
|-------------|-------|--------|
| customerId, cartId, storeId, addressId | Present | PASS |
| addressSnapshot, summarySnapshot | Present | PASS |
| lockTokens[], reservationExpiresAt | Present | PASS |
| status, paymentId, orderId, idempotencyKey | Present | PASS |

Model: `checkout/models/checkout-session.model.ts`

## payments — PASS

| Field (doc) | Model | Status |
|-------------|-------|--------|
| checkoutSessionId, gatewayOrderId, idempotencyKey | Present | PASS |
| amount, status, Razorpay refs | Present | PASS |

Model: `payment/models/payment.model.ts`

## orders — PASS

| Field (doc) | Model | Status |
|-------------|-------|--------|
| orderNumber, customerId, storeId, paymentId | Present | PASS |
| status (placed), line snapshots, totals, placedAt | Present | PASS |

Model: `orders/models/order.model.ts`

## profile (user_identities) — PASS

Profile module uses Phase 2 `user_identities` via repository; writable `name`, `email` per Module 12 contract.

## Overall

All Phase 4 owned collections: **PASS**. No schema gaps blocking validation.
