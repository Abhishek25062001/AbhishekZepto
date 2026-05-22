# Phase 4 Permissions Review

**Date:** 2026-05-19  
**Reference:** `docs/security/phase-4-permissions.md`

## Route-level auth

| Route group | authenticate | requireRole CUSTOMER | Status |
|-------------|--------------|----------------------|--------|
| addresses | Yes | Yes | **PASS** |
| serviceability | Yes | Yes | **PASS** |
| store-selection | Yes | Yes | **PASS** |
| home | Yes | Yes | **PASS** |
| cart | Yes | Yes | **PASS** |
| checkout | Yes | Yes | **PASS** |
| payments | Yes | Yes | **PASS** |
| orders | Yes | Yes | **PASS** |
| profile | Yes | Yes | **PASS** |
| webhooks/razorpay | Signature middleware (no JWT) | N/A | **PASS** |

## Data scoping

| Domain | Scoping mechanism | Status |
|--------|-------------------|--------|
| Addresses | `customerId` from `req.user.userId` | **PASS** |
| Cart | Per customer + store | **PASS** |
| Checkout | Per customer session | **PASS** |
| Payments | Linked to customer checkout | **PASS** |
| Orders | `listOrdersByCustomer(customerId)` | **PASS** |
| Profile | Own `userId` only | **PASS** |

## Fine-grained permissions

Phase 4 uses role-only `CUSTOMER` gate; `profile:read` / `profile:update` deferred — **documented**, not a blocker.

## Overall: **PASS**
