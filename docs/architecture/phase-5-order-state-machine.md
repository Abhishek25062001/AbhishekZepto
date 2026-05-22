# Phase 5 Order State Machine

## Scope

This document finalizes the Phase 5 order state machine at architecture level.
It does not create runtime constants, enums, models, services, validators,
routes, jobs, or tests.

**Sources:**

- `projectin micro/docone/AllPhase&Modules.pdf` (Order Lifecycle Architecture)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (order lifecycle/status constants micro-tasks)

## Entry State

Phase 5 starts from the Phase 4 placement state:

```text
placed
```

Phase 4 owns payment verification, inventory confirmation, cart clearing, and
order placement. Phase 5 owns store operations after placement.

## State Machine

```text
placed
  -> accepted
  -> picking
  -> packing
  -> ready_for_pickup
  -> shipped_placeholder
  -> delivered_placeholder

placed / accepted / picking / packing
  -> cancelled
```

## State Definitions

| State | Terminal | Customer visible | Primary actor | Meaning |
|-------|----------|------------------|---------------|---------|
| `placed` | no | yes | Customer/system | Order was created after payment verification |
| `accepted` | no | yes | Store/vendor | Store accepted the incoming order |
| `picking` | no | yes | Store/vendor | Store is picking order items |
| `packing` | no | yes | Store/vendor | Store completed picking and is packing items |
| `ready_for_pickup` | no | yes | Store/vendor | Store marked order ready for delivery pickup |
| `shipped_placeholder` | no | limited | Admin/system placeholder | Delivery handoff placeholder; Phase 6 owns real delivery progress |
| `delivered_placeholder` | yes | limited | Admin/system placeholder | Delivery completion placeholder from source lifecycle constants |
| `cancelled` | yes | yes | Customer/store/admin/system | Order cancelled by eligible actor/rule |

## Store Operation Status Mapping

The implementation module may keep a customer-facing `orderStatus` and more
specific operation fields. Architecture-level mapping:

| Lifecycle state | Planned field area |
|-----------------|--------------------|
| `placed` | `orderStatus` |
| `accepted` | `storeStatus` |
| `picking` | `pickerStatus` |
| `packing` | `packingStatus` |
| `ready_for_pickup` | `packingStatus`, `readyForPickupAt` |
| `cancelled` | `orderStatus`, cancellation fields |

## Terminal States

Terminal states:

- `cancelled`
- `delivered_placeholder`

Terminal states cannot move back into active store operations.

## Delivery Boundary

Delivery partner assignment, rider acceptance, pickup verification, live
delivery progress, customer arrival, delivery OTP, and failed delivery handling
belong to Phase 6+. Phase 5 keeps only placeholder lifecycle labels where the
source micro-tasks mention shipped/delivered constants.

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document. Planned field areas:

- `orderStatus`
- `storeStatus`
- `pickerStatus`
- `packingStatus`
- `statusTimestamp`
