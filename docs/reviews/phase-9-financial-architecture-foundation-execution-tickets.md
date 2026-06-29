# Phase 9 Financial Architecture Foundation — CODEX Execution Tickets

**Phase:** Phase 9 — Payments, Refunds & Settlements  
**Module:** 1 — Financial Architecture Foundation  
**Status:** COMPLETE (Tickets 1–23 DONE, 2026-06-17)

## Sources

- `projectin micro/docone/AllPhase&Modules.pdf` — Phase 9 objective and module order
- `projectin micro/docsix/PhaesDetail9.pdf` — Module 1 Financial Architecture Foundation micro-tasks

## Prerequisites

- Phase 8 Module 23 — Phase 8 Integration & Review complete.
- Phase 4 payment gateway foundation implemented (`backend/api/src/modules/payment/`, `payments` collection).
- Phase 5 order lifecycle and Phase 6 delivery completion events available for finance dependency rules.

## Scope Rules

- Documentation and architecture artifacts only.
- No backend models, services, controllers, routes, validators, seed changes, OpenAPI paths, or tests.
- No frontend screens, hooks, navigation, or UI contracts beyond planned-route references.
- No `packages/shared` `.ts` files (documentation plan only).
- No Repository & Codebase Setup (Phase 1 Module 2).
- Do not merge Module 2 Payment Records Backend or later modules into this module.
- Where Phase 4 already implemented payment flows, document **alignment and migration notes** rather than inventing duplicate runtime behavior.

## Ticket List

| Ticket | Objective | Status | Depends on |
|--------|-----------|--------|------------|
| 1 | Source alignment and Module 1 boundary | DONE | Phase 8 Module 23 |
| 2 | Financial architecture foundation document | DONE | 1 |
| 3 | Phase 9 module dependencies map | DONE | 2 |
| 4 | Financial backend file structure plan | DONE | 2 |
| 5 | Payment record schema | DONE | 2 |
| 6 | Refund record schema | DONE | 5 |
| 7 | Order financial summary schema | DONE | 5, 6 |
| 8 | Vendor settlement placeholder schema | DONE | 7 |
| 9 | Delivery earning placeholder schema | DONE | 7 |
| 10 | Payment gateway architecture | DONE | 5, 7 |
| 11 | Finance API surface contract | DONE | 5–10 |
| 12 | Finance permissions and role mapping | DONE | 11 |
| 13 | Finance validation rules | DONE | 5–7, 11 |
| 14 | Finance error codes | DONE | 11, 13 |
| 15 | Finance audit logging specification | DONE | 11 |
| 16 | Finance database index plan | DONE | 5–9 |
| 17 | Finance shared contracts plan | DONE | 5–9, 11 |
| 18 | Finance environment configuration matrix | DONE | 10, 11 |
| 19 | Finance route mounting plan | DONE | 11 |
| 20 | Finance integration dependencies | DONE | 7, 10 |
| 21 | Backend route registry PLANNED finance entries | DONE | 11, 19 |
| 22 | Module 1 foundation verification checklist | DONE | 1–21 |
| 23 | Module 1 handoff and closeout | DONE | 22 |

## Module 1 Boundary

Module 1 owns:

- financial architecture goal and Phase 9 finance boundaries
- planned finance collections and order finance fields
- payment gateway architecture (Razorpay first launch)
- finance API surface, route mount plan, permissions, validation, errors, audit, indexes
- shared type plan and environment matrix
- cross-phase dependency rules for payment, refund, earning, and settlement flows

Module 1 defers:

- payment record runtime implementation (Module 2+)
- refund processing runtime (later modules)
- settlement and earning calculation services
- admin/customer/delivery/vendor finance UI
- permission seed or `env.ts` runtime validation code
- PostgreSQL ledger, live bank payout, wallet, GST invoice generation

## Existing Repo Alignment Notes

| PDF / planned | Current repo (Phase 4+) | Module 1 action |
|---------------|-------------------------|-----------------|
| `payment_records` collection | `payments` collection (`docs/database/payment-schema.md`) | Document target finance schema and migration alignment |
| `/backend/api/src/modules/finance/payments/*` | `/backend/api/src/modules/payment/*` | Document planned finance module tree with extension path |
| `POST /api/v1/customer/payments/:paymentId/verify` | `POST /api/v1/customer/payments/verify` | Document planned contract; mark existing route as IMPLEMENTED baseline |
| `POST /api/v1/public/webhooks/payments/razorpay` | `POST /api/v1/webhooks/razorpay` | Document planned public webhook mount; mark existing route |

---

## Ticket 1 — Source alignment and Module 1 boundary

**Ticket:** 1 — Source alignment and Module 1 boundary

**Objective:** Confirm Phase 9 Module 1 scope against source PDFs and record explicit in/out-of-scope boundaries before writing architecture docs.

**Files to create/update:**
- `docs/reviews/phase-9-financial-architecture-foundation-execution-tickets.md` (this file — boundary section only in Ticket 1)
- `project-context/PHASE_HANDOFFS/PHASE_9_HANDOFF.md` (update — Module 1 started, status in progress)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Record Phase 9 objective from `AllPhase&Modules.pdf`: payment handling, refund flow, vendor earnings, delivery payouts, basic financial visibility.
2. List Module 1 micro-task groups from `PhaesDetail9.pdf` (architecture, schemas, contracts, security, validation, errors, audit, indexes, shared plan, env, routes, dependencies, handoff).
3. Document prerequisite completion: Phases 1–8, existing Phase 4 payment module.
4. Explicitly exclude Repository & Codebase Setup and all runtime code from Module 1.
5. List deferred Phase 9 modules after Module 1 (Payment Records Backend onward per PDF).

**Acceptance criteria:**
- Module 1 boundary is written and matches PDF micro-tasks.
- No application code or new runtime docs outside Module 1 scope are added.

**Test commands:**
```bash
test -f docs/reviews/phase-9-financial-architecture-foundation-execution-tickets.md && \
grep -q "Module 1 Boundary" docs/reviews/phase-9-financial-architecture-foundation-execution-tickets.md && echo PASS
```

**Depends on:** Phase 8 Module 23 complete.

---

## Ticket 2 — Financial architecture foundation document

**Ticket:** 2 — Financial architecture foundation document

**Objective:** Create the primary Phase 9 finance architecture document with goal, included systems, ownership, surfaces, first-launch scope, and out-of-scope list.

**Files to create/update:**
- `docs/architecture/phase-9-financial-architecture-foundation.md` (create)

**API endpoints:** Document planned route families only (status PLANNED); no implementation:
- `/api/v1/customer/payments/*`
- `/api/v1/customer/refunds/*`
- `/api/v1/delivery/earnings/*`
- `/api/v1/admin/finance/*`
- `/api/v1/public/webhooks/payments/razorpay`

**DB fields:** Summary list only (detail in Tickets 5–9):
- `payment_records` (align with existing `payments`)
- `refund_records`
- `orders` finance fields
- `vendor_settlements`
- `delivery_earnings`
- `admin_action_audits` / finance audit events

**Implementation steps:**
1. Add section **Financial Architecture Goal**.
2. Define financial systems included in Phase 9 per PDF:
   - Phase 8 admin oversight integration points (read-only dependency)
   - Payment Records
   - Payment Gateway Integration
   - Refund Records
   - Refund Processing
   - Order Financial Summary
   - Vendor Settlement Placeholder
   - Delivery Partner Earnings Placeholder
   - Commission & Fee Rules
   - Finance Audit Trail
   - Finance Admin Visibility
3. Define financial ownership rule: backend is source of truth for payment, refund, earning, settlement, and commission amounts; frontend apps must never calculate final financial amounts independently.
4. Define financial surfaces: Customer App, Delivery Agent App, Vendor Panel, Admin Dashboard, Backend APIs, Payment Gateway Webhooks.
5. Define first-launch finance scope: online payment record creation, gateway order creation, payment success/failure capture, refund eligibility tracking, refund request creation, admin refund review, vendor settlement placeholder, delivery earning placeholder, finance audit logs.
6. Define out-of-scope for foundation and later-only items: live vendor bank payout, live rider bank payout, advanced wallet, accounting ledger export, GST invoice generation, PostgreSQL double-entry ledger (per `KNOWN_DECISIONS.md`).
7. Add cross-reference to existing Phase 4 payment implementation.

**Acceptance criteria:**
- Architecture doc exists with all PDF Task 1 sections.
- No API or DB runtime artifacts created.

**Test commands:**
```bash
test -f docs/architecture/phase-9-financial-architecture-foundation.md && \
grep -q "Financial Architecture Goal" docs/architecture/phase-9-financial-architecture-foundation.md && echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Phase 9 module dependencies map

**Ticket:** 3 — Phase 9 module dependencies map

**Objective:** Record Phase 9 module execution order and cross-module dependencies for planning gates.

**Files to create/update:**
- `docs/architecture/phase-9-module-dependencies.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_9_HANDOFF.md` (update — module list table, Module 1 in progress)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Table: module number, name, depends on, blocks.
2. Gate: Module 1 complete before Module 2 Payment Records Backend.
3. Include PDF module sequence starting at Financial Architecture Foundation → Payment Records Backend → later finance modules.
4. Mark Phase 10 boundary (Offers, Coupons & Growth Layer) after Phase 9 closeout.
5. Note dependency on Phase 4 payment, Phase 5 orders, Phase 6 delivery completion, Phase 8 admin audit/permissions patterns.

**Acceptance criteria:**
- Dependency doc matches PDF module order.
- `PHASE_9_HANDOFF.md` lists Phase 9 modules with Module 1 status.

**Test commands:**
```bash
test -f docs/architecture/phase-9-module-dependencies.md && \
grep -q "Financial Architecture Foundation" project-context/PHASE_HANDOFFS/PHASE_9_HANDOFF.md && echo PASS
```

**Depends on:** Ticket 2.

---

## Ticket 4 — Financial backend file structure plan

**Ticket:** 4 — Financial backend file structure plan

**Objective:** Document planned backend finance folder layout and file paths per PDF; no `.ts` files created.

**Files to create/update:**
- `docs/architecture/phase-9-financial-backend-file-structure.md` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Define finance root: `backend/api/src/modules/finance/`.
2. Define shared finance folders: `controllers`, `routes`, `services`, `repositories`, `models`, `validators`, `types`, `constants`, `utils`, `webhooks`.
3. Document planned payment files under `finance/payments/` per PDF (model, repository, service, controller, customer/admin routes, validator, types).
4. Document planned refund files under `finance/refunds/`.
5. Document planned settlement files under `finance/settlements/`.
6. Document planned earning files under `finance/earnings/`.
7. Document shared finance files: `finance-permissions.constant.ts`, `finance-error-codes.constant.ts`, `finance-audit-events.constant.ts`, `money.util.ts`, response mappers, sanitizer util.
8. Add **Existing repo alignment** section: current `backend/api/src/modules/payment/` remains Phase 4 baseline until Module 2+ migration ticket explicitly moves or wraps it.

**Acceptance criteria:**
- Structure doc lists all PDF file paths.
- Zero new files under `backend/api/src/modules/finance/`.

**Test commands:**
```bash
test -f docs/architecture/phase-9-financial-backend-file-structure.md && \
grep -q "modules/finance" docs/architecture/phase-9-financial-backend-file-structure.md && echo PASS
```

**Depends on:** Ticket 2.

---

## Ticket 5 — Payment record schema

**Ticket:** 5 — Payment record schema

**Objective:** Document `payment_records` collection schema, enums, uniqueness, amount rules, and planned payment APIs per PDF.

**Files to create/update:**
- `docs/database/phase-9-payment-record-schema.md` (create)

**API endpoints:** Document planned (PLANNED):
- `POST /api/v1/customer/payments/create-order`
- `GET /api/v1/customer/payments/:paymentId`
- `GET /api/v1/admin/finance/payments`
- `GET /api/v1/admin/finance/payments/:paymentId`
- `POST /api/v1/public/webhooks/payments/razorpay`

**DB fields:** Document at minimum:
- `_id`, `orderId`, `customerId`, `storeId`, `vendorId`, `cityId`
- `gateway`, `gatewayOrderId`, `gatewayPaymentId`, `gatewaySignature`, `gatewayStatus`
- `paymentMethod`, `amount`, `currency`, `payableAmount`, `discountAmount`, `deliveryFee`, `platformFee`, `taxAmount`, `refundedAmount`
- `paymentStatus`, `failureCode`, `failureReason`, `webhookEventIds`, `metadata`
- `paidAt`, `failedAt`, `cancelledAt`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- Enums: `gateway` (`razorpay`, placeholders), `paymentStatus` (`created`, `pending`, `authorized`, `paid`, `failed`, `cancelled`, `refunded`, `partially_refunded`, `expired`), `paymentMethod` (`upi`, `card`, `netbanking`, `wallet`, `cod_placeholder`, `unknown`)
- Rules: unique sparse `gatewayOrderId`, unique sparse `gatewayPaymentId`, one active payment per `orderId`, amounts in smallest currency unit

**Implementation steps:**
1. Document all PDF fields and allowed enum values.
2. Add alignment table mapping existing `payments` collection fields from `docs/database/payment-schema.md`.
3. Mark migration/consolidation as Module 2+ work, not Module 1.
4. Cross-reference existing IMPLEMENTED routes in `docs/contracts/payment-api.md`.

**Acceptance criteria:**
- Schema doc complete; no Mongoose model created.

**Test commands:**
```bash
test -f docs/database/phase-9-payment-record-schema.md && \
grep -q "payment_records" docs/database/phase-9-payment-record-schema.md && echo PASS
```

**Depends on:** Ticket 2.

---

## Ticket 6 — Refund record schema

**Ticket:** 6 — Refund record schema

**Objective:** Document `refund_records` collection schema, enums, refund code format, amount rules, and planned refund APIs.

**Files to create/update:**
- `docs/database/phase-9-refund-record-schema.md` (create)

**API endpoints:** Document planned (PLANNED):
- `POST /api/v1/customer/refunds`
- `GET /api/v1/customer/refunds`
- `GET /api/v1/customer/refunds/:refundId`
- `GET /api/v1/admin/finance/refunds`
- `GET /api/v1/admin/finance/refunds/:refundId`
- `POST /api/v1/admin/finance/refunds/:refundId/approve`
- `POST /api/v1/admin/finance/refunds/:refundId/reject`
- `POST /api/v1/admin/finance/refunds/:refundId/process`

**DB fields:** Document at minimum:
- `_id`, `orderId`, `paymentRecordId`, `customerId`, `storeId`, `vendorId`, `cityId`
- `refundCode`, `refundReason`, `refundType`, `refundSource`
- `requestedAmount`, `approvedAmount`, `refundedAmount`, `currency`, `refundStatus`
- `gateway`, `gatewayRefundId`, `gatewayPaymentId`, `gatewayStatus`
- `failureCode`, `failureReason`
- Actor/timestamp fields: `requestedBy`, `reviewedBy`, `approvedBy`, `rejectedBy`, `processedBy`, `requestedAt`, `reviewedAt`, `approvedAt`, `rejectedAt`, `processedAt`, `completedAt`
- `metadata`, `createdAt`, `updatedAt`
- Enums: `refundType`, `refundSource`, `refundStatus` per PDF
- Rules: `refundCode` format `REF-YYYYMMDD-000001`; `approvedAmount <= payment.amount - payment.refundedAmount`

**Implementation steps:**
1. Document all PDF refund fields and enum values.
2. Link to payment record schema for refundable amount rules.
3. Note `REFUND_PROCESSING_ENABLED=false` default for first launch (env doc Ticket 18).

**Acceptance criteria:**
- Refund schema doc complete; no runtime code.

**Test commands:**
```bash
test -f docs/database/phase-9-refund-record-schema.md && \
grep -q "REF-YYYYMMDD" docs/database/phase-9-refund-record-schema.md && echo PASS
```

**Depends on:** Ticket 5.

---

## Ticket 7 — Order financial summary schema

**Ticket:** 7 — Order financial summary schema

**Objective:** Document order-level finance fields and update rules; payment/refund services own mutations.

**Files to create/update:**
- `docs/database/phase-9-order-financial-summary-schema.md` (create)

**API endpoints:** None (finance fields updated via payment/refund/internal services per PDF).

**DB fields:** Document/add-verify on `orders`:
- `paymentStatus`, `paymentRecordId`, `paymentMethod`, `paymentGateway`
- `itemSubtotal`, `discountAmount`, `deliveryFee`, `platformFee`, `taxAmount`, `grandTotal`, `payableAmount`
- `refundStatus`, `refundedAmount`, `financeStatus`
- `paidAt`, `paymentFailedAt`, `refundCompletedAt`
- Enums: `paymentStatus`, `refundStatus`, `financeStatus` per PDF
- Rule: webhook updates `payment_records` first, then order finance summary

**Implementation steps:**
1. Map PDF allowed values for payment, refund, and finance status fields.
2. Cross-reference existing `orders` model fields in repo; mark already-present vs new planned fields.
3. Document that no direct order finance mutation endpoint is created in schema planning.

**Acceptance criteria:**
- Order finance schema doc complete; aligns with existing order schema where fields already exist.

**Test commands:**
```bash
test -f docs/database/phase-9-order-financial-summary-schema.md && \
grep -q "financeStatus" docs/database/phase-9-order-financial-summary-schema.md && echo PASS
```

**Depends on:** Tickets 5, 6.

---

## Ticket 8 — Vendor settlement placeholder schema

**Ticket:** 8 — Vendor settlement placeholder schema

**Objective:** Document `vendor_settlements` placeholder collection for calculation and visibility only; bank payout execution disabled.

**Files to create/update:**
- `docs/database/phase-9-vendor-settlement-placeholder-schema.md` (create)

**API endpoints:** Document planned (PLANNED):
- `GET /api/v1/admin/finance/vendor-settlements`
- `GET /api/v1/admin/finance/vendor-settlements/:settlementId`
- `POST /api/v1/admin/finance/vendor-settlements/generate`
- `POST /api/v1/admin/finance/vendor-settlements/:settlementId/approve`
- `POST /api/v1/admin/finance/vendor-settlements/:settlementId/mark-paid-placeholder`

**DB fields:** Document at minimum:
- `_id`, `vendorId`, `storeId`, `cityId`, `settlementCode`
- `periodStartAt`, `periodEndAt`
- `grossOrderAmount`, `commissionAmount`, `platformFeeAmount`, `deliveryFeeCollected`, `refundDeductionAmount`, `adjustmentAmount`, `netPayableAmount`, `currency`
- `orderIds`, `refundIds`, `status`, actor/timestamp fields, `notes`, `createdAt`, `updatedAt`
- Enum `status`: `draft`, `generated`, `under_review`, `approved`, `paid_placeholder`, `on_hold`, `cancelled`
- Rule: Phase 9 creates settlement calculation/visibility only; actual bank payout remains disabled unless future provider added

**Implementation steps:**
1. Document all PDF settlement fields and status values.
2. Link commission/fee rules to architecture doc (Ticket 2).
3. Mark payout execution out of scope for Module 1 and early Phase 9 modules.

**Acceptance criteria:**
- Vendor settlement schema doc complete; no models created.

**Test commands:**
```bash
test -f docs/database/phase-9-vendor-settlement-placeholder-schema.md && \
grep -q "paid_placeholder" docs/database/phase-9-vendor-settlement-placeholder-schema.md && echo PASS
```

**Depends on:** Ticket 7.

---

## Ticket 9 — Delivery earning placeholder schema

**Ticket:** 9 — Delivery earning placeholder schema

**Objective:** Document `delivery_earnings` placeholder collection and earning trigger rules.

**Files to create/update:**
- `docs/database/phase-9-delivery-earning-placeholder-schema.md` (create)

**API endpoints:** Document planned (PLANNED):
- `GET /api/v1/delivery/earnings`
- `GET /api/v1/delivery/earnings/:earningId`
- `GET /api/v1/admin/finance/delivery-earnings`
- `GET /api/v1/admin/finance/delivery-earnings/:earningId`
- `POST /api/v1/admin/finance/delivery-earnings/:earningId/approve`
- `POST /api/v1/admin/finance/delivery-earnings/:earningId/adjust`

**DB fields:** Document at minimum:
- `_id`, `deliveryAgentId`, `assignmentId`, `orderId`, `cityId`, `storeId`
- `baseEarning`, `distanceInKm`, `distanceEarning`, `incentiveAmount`, `penaltyAmount`, `adjustmentAmount`, `totalEarning`, `currency`
- `earningStatus`, `payoutStatus`, `calculatedAt`, `approvedAt`, `paidAt`, `createdAt`, `updatedAt`
- Enums per PDF; rule: earning created only after delivery completion

**Implementation steps:**
1. Document all PDF earning fields and status enums.
2. Link trigger to Phase 6 delivery completion (`delivery_assignments.completedAt`).
3. Mark live rider bank payout as disabled placeholder.

**Acceptance criteria:**
- Delivery earning schema doc complete; no models created.

**Test commands:**
```bash
test -f docs/database/phase-9-delivery-earning-placeholder-schema.md && \
grep -q "delivery_earnings" docs/database/phase-9-delivery-earning-placeholder-schema.md && echo PASS
```

**Depends on:** Ticket 7.

---

## Ticket 10 — Payment gateway architecture

**Ticket:** 10 — Payment gateway architecture

**Objective:** Document Razorpay-first payment creation, verify, webhook, and failure flows.

**Files to create/update:**
- `docs/architecture/phase-9-payment-gateway-architecture.md` (create)

**API endpoints:** Document planned flows using:
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/:paymentId/verify`
- `POST /api/v1/public/webhooks/payments/razorpay`
- Note existing: `POST /api/v1/customer/payments/verify`, `POST /api/v1/webhooks/razorpay`

**DB fields:** Reference fields touched in flows:
- `payment_records.gateway*`, `paymentStatus`, `webhookEventIds`
- `orders.paymentStatus`, `paymentRecordId`, `paidAt`

**Implementation steps:**
1. Define first-launch provider: Razorpay.
2. Document payment creation flow (checkout → payment record → Razorpay order → client checkout → verify).
3. Document webhook flow (signature verify, dedupe via `webhookEventIds`, update payment + order + audit + optional internal event).
4. Document gateway failure flow (`paymentStatus=failed`, order finance reset, safe failure reason storage).
5. Cross-reference existing Phase 4 payment module services as baseline implementation.

**Acceptance criteria:**
- Gateway architecture doc covers create, verify, webhook, and failure sequences.
- No payment service code changes in Module 1.

**Test commands:**
```bash
test -f docs/architecture/phase-9-payment-gateway-architecture.md && \
grep -q "Razorpay" docs/architecture/phase-9-payment-gateway-architecture.md && echo PASS
```

**Depends on:** Tickets 5, 7.

---

## Ticket 11 — Finance API surface contract

**Ticket:** 11 — Finance API surface contract

**Objective:** Consolidate all planned Phase 9 finance endpoints into one contract document.

**Files to create/update:**
- `docs/contracts/phase-9-finance-api-surface.md` (create)

**API endpoints:** Document planned (PLANNED) — full surface:
- Customer payments: create-order, verify, get by id
- Customer refunds: create, list, detail
- Admin finance: payments list/detail, refunds list/detail/approve/reject/process
- Admin vendor settlements: list/detail/generate/approve/mark-paid-placeholder
- Delivery earnings: agent list/detail; admin list/detail/approve/adjust
- Webhook: `POST /api/v1/public/webhooks/payments/razorpay`

**DB fields:** Reference schema docs Tickets 5–9 for response field sources.

**Implementation steps:**
1. Group endpoints by surface (customer, delivery, admin, public webhook).
2. Use standard envelope per `API_STANDARDS.md`.
3. Mark existing Phase 4 payment endpoints as IMPLEMENTED baseline with path differences noted.
4. Link each group to owning future module (Module 2+).

**Acceptance criteria:**
- Single finance API contract doc lists all PDF endpoints.
- No OpenAPI path files created.

**Test commands:**
```bash
test -f docs/contracts/phase-9-finance-api-surface.md && \
grep -q "/api/v1/admin/finance/refunds" docs/contracts/phase-9-finance-api-surface.md && echo PASS
```

**Depends on:** Tickets 5–10.

---

## Ticket 12 — Finance permissions and role mapping

**Ticket:** 12 — Finance permissions and role mapping

**Objective:** Document finance access rules, permission codes, role mapping, and webhook auth boundary. **Docs only — no seed or constant file changes in Module 1.**

**Files to create/update:**
- `docs/security/phase-9-finance-permissions.md` (create)

**API endpoints:** Permission gates for:
- All `/api/v1/admin/finance/*`
- All `/api/v1/customer/payments/*`, `/api/v1/customer/refunds/*`
- All `/api/v1/delivery/earnings/*`
- Webhook route: no user auth; provider signature required

**DB fields:** Reference scope fields:
- `payment_records.customerId`, `refund_records.customerId`, `delivery_earnings.deliveryAgentId`
- `roles.permissions`, `user_identities.permissions` (planning reference only)

**Implementation steps:**
1. Customer rule: access only own payment/refund records.
2. Delivery agent rule: access only own earnings.
3. Document admin permission codes per PDF: `finance:payments:read`, `finance:refunds:read`, `finance:refunds:approve`, `finance:refunds:reject`, `finance:refunds:process`, `finance:settlements:*`, `finance:delivery_earnings:*`, `finance:reports:read`.
4. Document role mapping: `super_admin`, `finance_admin`, `operations_admin`, `support_admin` per PDF intent.
5. Document **planned** updates to `backend/api/src/modules/auth/constants/auth-permission.constants.ts` and seed role matrix — defer implementation to Module 2+.
6. Do **not** modify `auth-permission.constants.ts` or `seed-roles.ts` in Module 1.

**Acceptance criteria:**
- Permissions doc complete with role matrix table.
- No auth constant or seed file changes.

**Test commands:**
```bash
test -f docs/security/phase-9-finance-permissions.md && \
grep -q "finance:refunds:approve" docs/security/phase-9-finance-permissions.md && echo PASS
```

**Depends on:** Ticket 11.

---

## Ticket 13 — Finance validation rules

**Ticket:** 13 — Finance validation rules

**Objective:** Centralize validation rules for payment create/verify, refund request, admin approval, settlement generation, and earning adjustment.

**Files to create/update:**
- `docs/validation/phase-9-finance-validation-rules.md` (create)

**API endpoints:** Map rules to:
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/:paymentId/verify`
- `POST /api/v1/customer/refunds`
- `POST /api/v1/admin/finance/refunds/:refundId/approve`
- `POST /api/v1/admin/finance/vendor-settlements/generate`
- `POST /api/v1/admin/finance/delivery-earnings/:earningId/adjust`

**DB fields:** Reference constraints on:
- `orders.payableAmount`, `orders.paymentStatus`
- `payment_records.amount`, `payment_records.refundedAmount`, `payment_records.paymentStatus`
- `refund_records.requestedAmount`, `refund_records.approvedAmount`
- `vendor_settlements.periodStartAt`, `vendor_settlements.periodEndAt`
- `delivery_earnings.adjustmentAmount`

**Implementation steps:**
1. Payment create: `orderId` required; order belongs to customer; not already paid; payable > 0; order status allows payment.
2. Payment verify: gateway ids + signature required.
3. Refund request: `orderId`, `refundReason` required; paid payment; amount bounds; block duplicate active refund.
4. Admin refund approval: `approvedAmount` > 0; optional admin note.
5. Settlement generation: valid period; vendor/store scope.
6. Earning adjustment: `adjustmentAmount`, `adjustmentReason` required.

**Acceptance criteria:**
- Validation doc covers all PDF rules; no Zod files created.

**Test commands:**
```bash
test -f docs/validation/phase-9-finance-validation-rules.md && \
grep -q "duplicate active refund" docs/validation/phase-9-finance-validation-rules.md && echo PASS
```

**Depends on:** Tickets 5–7, 11.

---

## Ticket 14 — Finance error codes

**Ticket:** 14 — Finance error codes

**Objective:** Define stable finance error codes for payment, refund, settlement, and delivery earning domains.

**Files to create/update:**
- `docs/errors/phase-9-finance-error-codes.md` (create)

**API endpoints:** Map codes to finance endpoints in Ticket 11.

**DB fields:** None.

**Implementation steps:**
1. Payment codes per PDF: `PAYMENT_RECORD_NOT_FOUND`, `PAYMENT_ALREADY_EXISTS_FOR_ORDER`, `ORDER_NOT_PAYABLE`, `ORDER_ALREADY_PAID`, `INVALID_PAYMENT_AMOUNT`, `PAYMENT_GATEWAY_ORDER_FAILED`, `PAYMENT_SIGNATURE_INVALID`, `PAYMENT_WEBHOOK_SIGNATURE_INVALID`, `PAYMENT_WEBHOOK_DUPLICATE_EVENT`, `PAYMENT_STATUS_TRANSITION_INVALID`.
2. Refund codes per PDF: `REFUND_RECORD_NOT_FOUND`, `REFUND_NOT_ALLOWED`, `REFUND_AMOUNT_EXCEEDS_PAID_AMOUNT`, `REFUND_ALREADY_EXISTS`, `REFUND_APPROVAL_REQUIRED`, `REFUND_ALREADY_PROCESSED`, `REFUND_STATUS_TRANSITION_INVALID`, `REFUND_GATEWAY_PROCESSING_FAILED`, `REFUND_REJECTION_REASON_REQUIRED`.
3. Settlement codes per PDF: `SETTLEMENT_NOT_FOUND`, `SETTLEMENT_PERIOD_INVALID`, `SETTLEMENT_ALREADY_GENERATED`, `SETTLEMENT_NO_ELIGIBLE_ORDERS`, `SETTLEMENT_STATUS_TRANSITION_INVALID`, `SETTLEMENT_PAYOUT_DISABLED`.
4. Delivery earning codes per PDF: `DELIVERY_EARNING_NOT_FOUND`, `DELIVERY_EARNING_ALREADY_EXISTS`, `DELIVERY_EARNING_NOT_ADJUSTABLE`, `DELIVERY_EARNING_ADJUSTMENT_REASON_REQUIRED`, `DELIVERY_EARNING_STATUS_TRANSITION_INVALID`.
5. HTTP status mapping per `API_STANDARDS.md`.

**Acceptance criteria:**
- Error doc lists all PDF codes; no `finance-error-codes.constant.ts` created in Module 1.

**Test commands:**
```bash
test -f docs/errors/phase-9-finance-error-codes.md && \
grep -q "PAYMENT_WEBHOOK_DUPLICATE_EVENT" docs/errors/phase-9-finance-error-codes.md && echo PASS
```

**Depends on:** Tickets 11, 13.

---

## Ticket 15 — Finance audit logging specification

**Ticket:** 15 — Finance audit logging specification

**Objective:** Define finance audit events, allowed metadata, forbidden sensitive fields, and planned service write points.

**Files to create/update:**
- `docs/security/phase-9-finance-audit-logging.md` (create)

**API endpoints:** Map audit events to finance write endpoints and webhook route.

**DB fields:** Reference audit metadata fields:
- `admin_action_audits` / finance events: `entityType`, `entityId`, `orderId`, `paymentRecordId`, `refundRecordId`, `actorId`, `actorRole`, `actorSurface`, `changedFields`, `requestId`, `traceId`

**Implementation steps:**
1. List PDF finance audit events (`finance.payment_record_created`, `finance.payment_verified`, `finance.refund_requested`, `finance.refund_approved`, settlement and earning events, webhook received/rejected).
2. Define metadata must include and must not include (no gateway secrets, raw webhook payload, tokens, card/UPI/bank details).
3. Map planned write points to future services: `payment-record.service.ts`, `refund.service.ts`, `vendor-settlement.service.ts`, `delivery-earning.service.ts`, `razorpay-webhook.service.ts`.
4. Align with Phase 8 `admin_action_audits` pattern where admin finance actions occur.

**Acceptance criteria:**
- Audit spec doc complete; no audit writer code changes in Module 1.

**Test commands:**
```bash
test -f docs/security/phase-9-finance-audit-logging.md && \
grep -q "finance.refund_approved" docs/security/phase-9-finance-audit-logging.md && echo PASS
```

**Depends on:** Ticket 11.

---

## Ticket 16 — Finance database index plan

**Ticket:** 16 — Finance database index plan

**Objective:** Define MongoDB indexes for all Phase 9 finance collections.

**Files to create/update:**
- `docs/database/phase-9-finance-index-plan.md` (create)

**API endpoints:** None.

**DB fields:** Indexes for:
- `payment_records`: `orderId`, `customerId`, `storeId`, `vendorId`, `cityId`, unique sparse `gatewayOrderId`, unique sparse `gatewayPaymentId`, `paymentStatus`, `createdAt`
- `refund_records`: `orderId`, `paymentRecordId`, `customerId`, unique `refundCode`, `refundStatus`, sparse `gatewayRefundId`, `createdAt`
- `vendor_settlements`: `vendorId`, `storeId`, `cityId`, unique `settlementCode`, period fields, `status`
- `delivery_earnings`: `deliveryAgentId`, `orderId`, `assignmentId`, `cityId`, `earningStatus`, `payoutStatus`, `createdAt`

**Implementation steps:**
1. Document each index with purpose (list, lookup, uniqueness, dedupe).
2. Note partial/sparse index use for soft-deleted or nullable gateway ids per `DATABASE_STANDARDS.md`.
3. Cross-link schema docs Tickets 5–9.

**Acceptance criteria:**
- Index plan doc only; no migration scripts.

**Test commands:**
```bash
test -f docs/database/phase-9-finance-index-plan.md && \
grep -q "gatewayOrderId" docs/database/phase-9-finance-index-plan.md && echo PASS
```

**Depends on:** Tickets 5–9.

---

## Ticket 17 — Finance shared contracts plan

**Ticket:** 17 — Finance shared contracts plan

**Objective:** Plan `packages/shared` finance types and DTO names; no `.ts` files in Module 1.

**Files to create/update:**
- `docs/architecture/phase-9-finance-shared-contracts.md` (create)

**API endpoints:** Map DTO names to Ticket 11 contract groups.

**DB fields:** Map types to schema docs Tickets 5–9.

**Implementation steps:**
1. Planned folder: `packages/shared/api/finance/`.
2. Planned files: `payment-record.types.ts`, `refund-record.types.ts`, `vendor-settlement.types.ts`, `delivery-earning.types.ts`, `finance-api.types.ts`, `finance-error.types.ts`, `money.types.ts`.
3. List exports planned for `packages/shared/api/index.ts`.
4. Document consuming apps: Customer App, Delivery Agent App, Vendor Panel, Admin Dashboard.
5. List key DTOs: `CreatePaymentOrderRequest`, `VerifyPaymentRequest`, `PaymentRecordResponse`, `CreateRefundRequest`, `RefundRecordResponse`, admin list responses, settlement/earning responses.

**Acceptance criteria:**
- Shared contracts plan doc exists; no new files under `packages/shared/api/finance/`.

**Test commands:**
```bash
test -f docs/architecture/phase-9-finance-shared-contracts.md && \
grep -q "money.types.ts" docs/architecture/phase-9-finance-shared-contracts.md && echo PASS
```

**Depends on:** Tickets 5–9, 11.

---

## Ticket 18 — Finance environment configuration matrix

**Ticket:** 18 — Finance environment configuration matrix

**Objective:** Document finance env vars and production validation rules; update `.env.example` placeholders only. **No `env.ts` code changes in Module 1.**

**Files to create/update:**
- `docs/setup/phase-9-finance-env-config.md` (create)
- `backend/api/.env.example` (update — commented placeholders only)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Document vars per PDF: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `PAYMENT_GATEWAY`, `PAYMENT_CURRENCY`, `PAYMENT_CAPTURE_MODE`, `REFUND_PROCESSING_ENABLED`, `VENDOR_PAYOUTS_ENABLED`, `DELIVERY_PAYOUTS_ENABLED`, `FINANCE_WEBHOOK_LOGGING_ENABLED`.
2. Document production startup requirements (missing secret keys blocked when `APP_ENV=production`).
3. Document logging must never print secrets or raw signatures.
4. Add commented placeholders to `backend/api/.env.example` where not already present; cross-ref `docs/setup/phase-4-env-config.md`.
5. Document **planned** `backend/api/src/config/env.ts` validation — defer to Module 2+.

**Acceptance criteria:**
- Env doc complete; `.env.example` has finance placeholders; no `env.ts` edits.

**Test commands:**
```bash
test -f docs/setup/phase-9-finance-env-config.md && \
grep -q "REFUND_PROCESSING_ENABLED" docs/setup/phase-9-finance-env-config.md && echo PASS
```

**Depends on:** Tickets 10, 11.

---

## Ticket 19 — Finance route mounting plan

**Ticket:** 19 — Finance route mounting plan

**Objective:** Plan how finance routers mount under existing v1 route files.

**Files to create/update:**
- `docs/contracts/phase-9-finance-route-mounting-plan.md` (create)

**API endpoints:** Table all planned routes with mount file, middleware chain, status PLANNED:
- Customer: `/api/v1/customer/payments`, `/api/v1/customer/refunds` via `customer.routes.ts`
- Delivery: `/api/v1/delivery/earnings` via `delivery.routes.ts`
- Admin: `/api/v1/admin/finance` via `admin.routes.ts`
- Public webhook: `/api/v1/public/webhooks/payments/razorpay` via `public.routes.ts`
- Note existing webhook mount at `/api/v1/webhooks/razorpay`

**DB fields:** None.

**Implementation steps:**
1. List mount files under `backend/api/src/routes/v1/`.
2. Document middleware: authenticate + permission + scope per surface.
3. Rule: do not mount until owning module implements controllers.
4. Mark Phase 4 payment routes as already mounted baseline.

**Acceptance criteria:**
- Route mount plan references all PDF finance endpoints.
- No route file changes in Module 1.

**Test commands:**
```bash
test -f docs/contracts/phase-9-finance-route-mounting-plan.md && \
grep -q "admin/finance" docs/contracts/phase-9-finance-route-mounting-plan.md && echo PASS
```

**Depends on:** Ticket 11.

---

## Ticket 20 — Finance integration dependencies

**Ticket:** 20 — Finance integration dependencies

**Objective:** Document cross-phase dependencies and finance mutation rules for payment, refund, and earning flows.

**Files to create/update:**
- `docs/architecture/phase-9-finance-integration-dependencies.md` (create)

**API endpoints:** None (dependency references only).

**DB fields:** Reference cross-module fields:
- `orders.*` finance fields, `delivery_assignments.completedAt`, `support_tickets.orderId`, `admin_action_audits`, `platform_settings`

**Implementation steps:**
1. Phase 5 order dependency: payment must wait for finalized payable amount and allowed order status.
2. Phase 6 delivery dependency: earning created only after delivery completion event.
3. Phase 8 admin/support dependency: refund may validate support/cancellation context; admin audit pattern reuse.
4. Payment dependency rule per PDF.
5. Refund dependency rule per PDF.
6. Earning dependency rule per PDF.

**Acceptance criteria:**
- Integration dependency doc links Phases 5, 6, 8 without adding new APIs.

**Test commands:**
```bash
test -f docs/architecture/phase-9-finance-integration-dependencies.md && \
grep -q "delivery_assignments.completedAt" docs/architecture/phase-9-finance-integration-dependencies.md && echo PASS
```

**Depends on:** Tickets 7, 10.

---

## Ticket 21 — Backend route registry PLANNED finance entries

**Ticket:** 21 — Backend route registry PLANNED finance entries

**Objective:** Register planned Phase 9 finance routes in the central route registry without marking them IMPLEMENTED.

**Files to create/update:**
- `docs/contracts/backend-route-registry.md` (update)

**API endpoints:** Add PLANNED entries for all routes in Ticket 11 not already IMPLEMENTED; preserve existing Phase 4 payment entries as IMPLEMENTED.

**DB fields:** None.

**Implementation steps:**
1. Group by customer payments, customer refunds, delivery earnings, admin finance, public webhook.
2. Link each entry to `phase-9-finance-api-surface.md`.
3. Do not mark new finance routes IMPLEMENTED in Module 1.

**Acceptance criteria:**
- Registry includes `/api/v1/admin/finance/refunds` as PLANNED.
- Existing Phase 4 payment routes remain IMPLEMENTED.

**Test commands:**
```bash
grep -q "admin/finance/refunds" docs/contracts/backend-route-registry.md && \
grep -q "PLANNED" docs/contracts/backend-route-registry.md && echo PASS
```

**Depends on:** Tickets 11, 19.

---

## Ticket 22 — Module 1 foundation verification checklist

**Ticket:** 22 — Module 1 foundation verification checklist

**Objective:** Manual/doc verification checklist before starting Module 2 implementation.

**Files to create/update:**
- `docs/testing/phase-9-financial-architecture-foundation-verification.md` (create)

**API endpoints:** Checklist confirms all planned endpoints documented in Ticket 11 and registry Ticket 21.

**DB fields:** Checklist confirms schema docs cover all finance collections and order finance fields.

**Implementation steps:**
1. Checklist items for Tickets 1–21 artifact paths.
2. Internal consistency checks: schema ↔ API ↔ permissions ↔ errors ↔ audit ↔ indexes ↔ routes.
3. Existing Phase 4 payment alignment review item.
4. Sign-off section: Module 1 complete → unlock Module 2 ticketization.

**Acceptance criteria:**
- Verification doc lists all Module 1 artifacts with paths.

**Test commands:**
```bash
test -f docs/testing/phase-9-financial-architecture-foundation-verification.md && echo PASS
```

**Depends on:** Tickets 1–21.

---

## Ticket 23 — Module 1 handoff and closeout

**Ticket:** 23 — Module 1 handoff and closeout

**Objective:** Close Module 1; update project context; record artifacts and next module gate.

**Files to create/update:**
- `docs/handoffs/phase-9-financial-architecture-foundation-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_9_HANDOFF.md` (update — Module 1 DONE, Module 2 next)
- `project-context/CURRENT_PROGRESS.md` (update — Phase 9 Module 1 complete)
- `project-context/PHASE_STATUS.md` (update — Phase 9 in progress)
- `docs/reviews/phase-9-financial-architecture-foundation-execution-tickets.md` (update — mark Tickets 1–23 DONE)

**API endpoints:** Summary table of PLANNED finance endpoints by domain; note IMPLEMENTED Phase 4 payment baseline routes.

**DB fields:** Summary table of documented collections and order finance fields; no live new collections created in Module 1.

**Implementation steps:**
1. List all Module 1 artifacts with paths (architecture, database, contracts, security, validation, errors, setup, testing).
2. Set foundation status: `ready_for_payment_records_backend`.
3. Explicit next step: ticketize **Module 2 — Payment Records Backend** (do not start implementation in this ticket).
4. Confirm Repository & Codebase Setup was **not** part of Module 1.
5. Record risks: Phase 4 `payments` vs Phase 9 `payment_records` naming; webhook path migration; permission seed timing.

**Acceptance criteria:**
- Handoff complete; progress docs updated; all tickets 1–23 marked DONE.

**Test commands:**
```bash
test -f docs/handoffs/phase-9-financial-architecture-foundation-complete.md && \
grep -q "Module 1" project-context/PHASE_HANDOFFS/PHASE_9_HANDOFF.md && echo PASS
```

**Depends on:** Ticket 22.

---

## Module closeout

**Phase 9 Module 1 — Financial Architecture Foundation:** **COMPLETE** (Tickets 1–23 DONE, 2026-06-17)

**Next module to ticketize:** **Module 2 — Payment Records Backend**

**Execution order summary:**
```text
Tickets 1–3 (boundary + architecture + dependencies)
  → 4 (backend file structure)
  → 5–9 (schemas)
  → 10 (payment gateway architecture)
  → 11 (API surface)
  → 12–15 (permissions, validation, errors, audit)
  → 16–17 (indexes, shared plan)
  → 18–20 (env, routes, integration dependencies)
  → 21 (route registry)
  → 22–23 (verification + handoff)
```
