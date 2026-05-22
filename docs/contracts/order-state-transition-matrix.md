# Order State Transition Matrix

## Scope

This matrix is a Phase 5 architecture artifact. It documents allowed and blocked
transition intent for later implementation. It does not create runtime
constants, validators, services, routes, or tests.

## Baseline Transitions

| From | To | Actor | Owning module | Notes |
|------|----|-------|---------------|-------|
| `placed` | `accepted` | Store/vendor, admin | Store Acceptance Flow | Store accepts incoming order |
| `placed` | `cancelled` | Customer, store/vendor, admin | Order Cancellation Backend / Store Acceptance Flow | Customer cancellation or store rejection before acceptance |
| `placed` | `cancelled` | System/job | Store Acceptance Flow | Acceptance timeout may cancel or escalate according to Module 3 rules |
| `accepted` | `picking` | Store/vendor, admin | Picking Workflow Backend | Store begins picking |
| `accepted` | `cancelled` | Store/vendor, admin | Order Cancellation Backend | Requires cancellation reason and inventory release |
| `picking` | `packing` | Store/vendor, admin | Packing & Ready-for-Pickup Flow | All items resolved for picking |
| `picking` | `cancelled` | Store/vendor, admin | Order Cancellation Backend | Requires cancellation reason and inventory reconciliation |
| `packing` | `ready_for_pickup` | Store/vendor, admin | Packing & Ready-for-Pickup Flow | Packing completed |
| `packing` | `cancelled` | Store/vendor, admin | Order Cancellation Backend | Requires cancellation reason and inventory/payment placeholder handling |
| `ready_for_pickup` | `shipped_placeholder` | Admin/system placeholder | Phase 6 boundary | Delivery-specific implementation is later-phase work |
| `shipped_placeholder` | `delivered_placeholder` | Admin/system placeholder | Phase 6 boundary | Delivery-specific implementation is later-phase work |

## Invalid Baseline Transitions

| From | To | Reason |
|------|----|--------|
| `placed` | `delivered_placeholder` | Order cannot skip lifecycle stages |
| `placed` | `picking` | Store must accept before picking starts |
| `accepted` | `ready_for_pickup` | Order cannot bypass picking and packing |
| `picking` | `ready_for_pickup` | Order cannot bypass packing |
| `packing` | `accepted` | Active lifecycle cannot move backward |
| `ready_for_pickup` | `picking` | Active lifecycle cannot move backward |
| `delivered_placeholder` | `picking` | Terminal state cannot move backward |
| `cancelled` | any non-cancelled state | Cancelled state is terminal |

## Per-State Allowed Next States

| Current state | Allowed next states |
|---------------|---------------------|
| `placed` | `accepted`, `cancelled` |
| `accepted` | `picking`, `cancelled` |
| `picking` | `packing`, `cancelled` |
| `packing` | `ready_for_pickup`, `cancelled` |
| `ready_for_pickup` | `shipped_placeholder` |
| `shipped_placeholder` | `delivered_placeholder` |
| `delivered_placeholder` | none |
| `cancelled` | none |

## Enforcement Boundary

Transition enforcement belongs to Phase 5 Module 2 — Backend Order State
Management and later state-changing modules. This document is the architecture
source for that implementation and does not provide runtime validation.

Planned transition service architecture:

- `docs/architecture/phase-5-order-transition-service.md`

## State Machine Reference

Module 1 state machine:

```text
placed -> accepted -> picking -> packing -> ready_for_pickup
```

Delivery progress beyond ready-for-pickup belongs to Phase 6+. Phase 5 keeps
`shipped_placeholder` and `delivered_placeholder` only as source-aligned
lifecycle placeholders until delivery modules own the real states.

## Cancellation Rule Placeholder

Cancellation rules are defined by Phase 5 Module 1 and implemented by Order
Cancellation Backend. The rules must identify:

- who can cancel
- cutoff state
- inventory release behavior
- payment/refund placeholder behavior
- audit/timeline event requirements

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
