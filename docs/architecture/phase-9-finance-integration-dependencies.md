# Phase 9 Finance Integration Dependencies

Cross-phase dependency rules for Phase 9 finance flows.

## Phase 5 — Order System

Payment creation must not proceed until:

- Order payable amount is finalized (`grandTotal` / `payableAmount`)
- Order status allows payment (not cancelled terminal state)

Referenced fields:

- `orders._id`, `orders.customerId`, `orders.storeId`
- `orders.orderStatus`, `orders.payableAmount`, `orders.paymentStatus`

## Phase 6 — Delivery Lifecycle

Delivery earning must be created only after delivery completion:

- `delivery_assignments.status` indicates completion
- `delivery_assignments.completedAt` is set
- `delivery_assignments.deliveryAgentId` and `orderId` populated

## Phase 8 — Admin & Support

Refund flows may reference:

- `support_tickets.orderId` for operational context
- `admin_action_audits` for admin finance mutations
- Phase 8 permission and audit patterns

Platform settings (`platform_settings`) may gate finance feature flags in later
modules — no settings mutation in Module 1.

## Payment Dependency Rule

```
Order finalized → payment record created → gateway order → verify/webhook → order paid
```

Payment must validate order ownership and payable state before gateway call.

## Refund Dependency Rule

```
Paid payment → refund eligibility check → refund request → admin review → process (if enabled)
```

Refund creation must validate:

- Order/payment ownership
- Payment status is paid
- Refundable balance
- Optional cancellation/support context (later modules)

## Earning Dependency Rule

```
Delivery completed → earning calculated → admin review → payout placeholder (disabled by default)
```

## No New API Endpoints

This document records dependencies only. Endpoint definitions:
`docs/contracts/phase-9-finance-api-surface.md`.

## Related Documents

- `docs/architecture/phase-9-payment-gateway-architecture.md`
- `docs/architecture/phase-5-order-lifecycle-architecture.md`
- `docs/architecture/phase-6-delivery-lifecycle-architecture.md` (handoff)
