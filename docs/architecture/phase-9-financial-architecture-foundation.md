# Phase 9 Financial Architecture Foundation

## Status

Module 1 documentation artifact. No runtime implementation in this document.

## Financial Architecture Goal

Establish a MongoDB-first financial architecture for Phase 9 that extends the
existing Phase 4 payment foundation with refund processing, order financial
summary fields, vendor settlement placeholders, delivery partner earning
placeholders, commission and fee rules, finance audit trails, and admin finance
visibility — while keeping the backend as the sole source of truth for all
monetary calculations and state transitions.

## Financial Systems Included In Phase 9

| System | Module 1 status | Runtime owner |
|--------|-----------------|---------------|
| Phase 8 admin oversight integration | Documented dependency | Phase 8 audit/permissions patterns |
| Payment records | Schema planned | Module 2+ (extends Phase 4 `payments`) |
| Payment gateway integration | Architecture planned | Phase 4 baseline + Phase 9 extensions |
| Refund records | Schema planned | Refund Backend modules |
| Refund processing | Contract planned | Refund Backend modules |
| Order financial summary | Schema planned | Payment/refund/internal services |
| Vendor settlement placeholder | Schema planned | Vendor settlement modules |
| Delivery partner earnings placeholder | Schema planned | Delivery earnings modules |
| Commission & fee rules | Documented in settlement/earning schemas | Settlement/earning modules |
| Finance audit trail | Spec planned | All finance write services |
| Finance admin visibility | API surface planned | Admin finance modules |

## Financial Ownership Rule

The backend is the source of truth for all payment, refund, earning, settlement,
and commission amounts. Frontend apps (Customer App, Delivery Agent App, Vendor
Panel, Admin Dashboard) must never calculate final payable, refund, settlement,
or earning amounts independently. They display backend-computed values only.

## Financial Surfaces

| Surface | Role |
|---------|------|
| Customer App | Pay for orders, view payment status, request refunds |
| Delivery Agent App | View own delivery earnings |
| Vendor Panel | View settlement summaries (later modules) |
| Admin Dashboard | Payment/refund/settlement/earning oversight |
| Backend APIs | Authoritative finance state and transitions |
| Payment gateway webhooks | Async payment confirmation (Razorpay first launch) |

## First-Launch Finance Scope

- Online payment record creation and gateway order creation
- Payment success/failure capture via verify + webhook
- Refund eligibility tracking and customer refund request creation
- Admin refund review (approve/reject/process placeholders)
- Vendor settlement calculation and visibility placeholder
- Delivery earning calculation and visibility placeholder
- Finance audit logs for all finance mutations

## Out Of Scope

**Deferred within Phase 9 foundation and later scale phases:**

- Live vendor bank payout execution
- Live rider bank payout execution
- Advanced wallet system
- Accounting ledger export
- GST invoice generation
- PostgreSQL double-entry ledger (`KNOWN_DECISIONS.md`)

**Explicitly excluded from Module 1:**

- Runtime models, services, routes, validators, seeds, OpenAPI paths
- Frontend finance UI implementation
- Repository & Codebase Setup

## Existing Phase 4 Alignment

| Planned (Phase 9) | Current repo | Action |
|-------------------|--------------|--------|
| `payment_records` | `payments` collection | Document target schema; migration in Module 2+ |
| `modules/finance/payments/*` | `modules/payment/*` | Extend or wrap existing module |
| `POST .../payments/:paymentId/verify` | `POST .../payments/verify` | Document path evolution |
| `POST .../public/webhooks/payments/razorpay` | `POST .../webhooks/razorpay` | Document mount evolution |

## Planned API Route Families

Status: **PLANNED** unless noted IMPLEMENTED (Phase 4 baseline).

- `/api/v1/customer/payments/*` — partial IMPLEMENTED
- `/api/v1/customer/refunds/*` — PLANNED
- `/api/v1/delivery/earnings/*` — PLANNED
- `/api/v1/admin/finance/*` — PLANNED
- `/api/v1/public/webhooks/payments/razorpay` — PLANNED (baseline: `/api/v1/webhooks/razorpay`)

## Planned DB Collections And Order Fields

| Collection / target | Doc |
|-----------------------|-----|
| `payment_records` | `docs/database/phase-9-payment-record-schema.md` |
| `refund_records` | `docs/database/phase-9-refund-record-schema.md` |
| `orders` finance fields | `docs/database/phase-9-order-financial-summary-schema.md` |
| `vendor_settlements` | `docs/database/phase-9-vendor-settlement-placeholder-schema.md` |
| `delivery_earnings` | `docs/database/phase-9-delivery-earning-placeholder-schema.md` |
| Finance audit events | `docs/security/phase-9-finance-audit-logging.md` |

## Related Documents

- `docs/architecture/phase-9-module-dependencies.md`
- `docs/architecture/phase-9-financial-backend-file-structure.md`
- `docs/architecture/phase-9-payment-gateway-architecture.md`
- `docs/contracts/phase-9-finance-api-surface.md`
