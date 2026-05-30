# Phase 6 Delivery SLA & Escalation — API Contract

**Module:** Phase 6, Module 16 — Delivery SLA & Escalation  
**Status:** IMPLEMENTED  
**Implemented:** 2026-05-29

---

## Overview

This document defines the delivery SLA evaluation contract for Phase 6. It covers SLA stages, thresholds, DB fields, breach events, and the internal job trigger endpoint.

**No new public API routes are introduced.** The only HTTP surface is the internal job trigger.  
**No new permission codes are introduced.** SLA evaluation is a system-only action.

---

## SLA Stages

| Stage | Starts at | Ends at (success) | Breach event |
|-------|-----------|-------------------|--------------|
| `assignment` | Delivery record created (`createdAt`) | `assignedAt` set | `delivery.sla.breached` (stage: assignment) |
| `pickup` | `assignedAt` | `pickedUpAt` set | `delivery.sla.breached` (stage: pickup) |
| `drop` | `pickedUpAt` | `deliveredAt` set | `delivery.sla.breached` (stage: drop) |
| `total` | `createdAt` (concurrent with all stages) | `deliveredAt` set | `delivery.sla.breached` (stage: total) |

---

## SLA Status Values

| Value | Meaning |
|-------|---------|
| `not_started` | Delivery created but no SLA deadline is active yet |
| `on_time` | All active SLA deadlines are in the future |
| `at_risk` | Approaching the active stage deadline (> at-risk threshold elapsed) |
| `breached` | One or more stage deadlines have passed without completion |
| `not_applicable` | Delivery is in a terminal state (`delivered`, `failed`, `cancelled`) |

---

## Static SLA Thresholds

Thresholds are code-level defaults. Runtime admin configuration is deferred to Phase 7+.

| Stage | At-risk after | Breach after | Notes |
|-------|---------------|--------------|-------|
| `assignment` | 3 min | 5 min | From `createdAt` to `assignedAt` |
| `pickup` | 10 min | 15 min | From `assignedAt` to `pickedUpAt` |
| `drop` | 20 min | 30 min | From `pickedUpAt` to `deliveredAt` |
| `total` | — | 45 min | Concurrent from `createdAt`; no at-risk threshold |

---

## DB Fields Added to `deliveries` Collection

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `slaStatus` | `DeliverySlaStatus` enum | `'not_started'` | Current SLA status |
| `slaBreachedStage` | `DeliverySlaStage \| null` | `null` | First stage that was breached |
| `slaAssignmentDeadline` | `Date \| null` | `null` | Deadline for rider assignment |
| `slaPickupDeadline` | `Date \| null` | `null` | Deadline for store pickup |
| `slaDropDeadline` | `Date \| null` | `null` | Deadline for customer delivery |
| `slaTotalDeadline` | `Date \| null` | `null` | Total delivery deadline |
| `slaBreachedAt` | `Date \| null` | `null` | Timestamp when first breach was recorded |

---

## Internal Job Trigger Endpoint

### `POST /api/v1/internal/delivery-sla/evaluate`

**Auth:** Internal only — requires `x-internal-secret` header matching `INTERNAL_SECRET` env var (same middleware as other internal routes).  
**Permission:** No RBAC permission required. Internal route.

**Request Body (optional):**
```json
{
  "limit": 100
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `limit` | number | No | Max deliveries to evaluate per run (default: 100, max: 500) |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Delivery SLA evaluation complete",
  "data": {
    "evaluatedCount": 47,
    "breachedCount": 3,
    "skippedCount": 44
  }
}
```

**Error Responses:**
| Status | Code | Condition |
|--------|------|-----------|
| 401 | `UNAUTHORIZED` | Missing or invalid `x-internal-secret` |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected error during evaluation |

---

## SLA Breach Event

Every newly detected SLA breach writes:

1. **Timeline event** on the `DeliveryAssignment` document:
```json
{
  "actorType": "system",
  "actorId": null,
  "fromStatus": "<current deliveryStatus>",
  "toStatus": "<current deliveryStatus>",
  "reason": "delivery.sla.breached:<stage>",
  "createdAt": "<evaluatedAt timestamp>"
}
```

2. **Audit log entry:**
- `eventType`: `delivery.sla.breached`
- `actorId`: null
- `actorRole`: `system`
- `actorSurface`: `backend`
- `entityType`: `delivery`
- `entityId`: delivery `_id`
- `metadata`: `{ evaluatedAt, deliveryId, slaBreachedStage, previousSlaStatus, newSlaStatus }`

---

## SLA Evaluation Rules

1. Evaluation applies only to **active, non-terminal** deliveries (`deliveryStatus NOT IN ['delivered', 'failed', 'cancelled']`).
2. Terminal deliveries receive `slaStatus = 'not_applicable'`.
3. Breach marking is **idempotent** — if a delivery's `slaStatus` is already `breached` with the same `slaBreachedStage`, it is skipped.
4. The `total` SLA timer runs **concurrently** with all active stage timers. Whichever threshold fires first determines the breach stage.
5. All deadline timestamps (`slaAssignmentDeadline`, etc.) are informational only in Phase 6 — they can be computed but are not yet written to DB by the evaluation job (deferred to Phase 7).

---

## Admin Dashboard Visibility

SLA fields are surfaced in existing admin routes:

- `GET /api/v1/admin/deliveries` — list items include `slaStatus`, `slaBreachedStage`
- `GET /api/v1/admin/deliveries/:deliveryId` — detail includes all 7 SLA fields

No new routes are added.

---

## Out of Scope

- External escalation provider integrations
- Customer-facing delay messaging
- Auto-reassignment on assignment breach
- Production scheduler activation
- Admin-configurable SLA threshold UI
