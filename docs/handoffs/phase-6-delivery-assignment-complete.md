# Handoff: Phase 6 Module 4 — Delivery Assignment Backend

## Module Objective
This module successfully designs and deploys the **Delivery Assignment Backend** dispatch engine core. It establishes the `deliveries` MongoDB collection and corresponding schema, implements oldest-idle auto-matching geographical algorithms with double-allocation locks, hooks packed-orders to automatically spawn unassigned deliveries, publishes placeholder agent alert notifications, and exposes manual administrative controls.

## Key Changes & Implementations

### 1. Database & Repository Layer
- **Model & Schema:** Created `DeliveryAssignmentModel` (bound to `deliveries` collection) containing fields for `orderId`, `customerId`, `storeId`, `cityId`, `deliveryAgentId`, `deliveryStatus`, `assignedAt`, `timeline`, and cancellation audits.
- **Robust Indexes:**
  - Unique index `{ orderId: 1 }` to prevent multiple assignments for the same order.
  - Compound indexes `{ deliveryAgentId: 1, deliveryStatus: 1 }` and `{ cityId: 1, deliveryStatus: 1 }` for high-performance active queue scans.

### 2. Matching Engine & Dispatch logic
- **Oldest-Idle Matching:** Queries available agents filter: `availabilityStatus: 'online'`, `isActive: true`, `isVerified: true`, `cityId: [order city]`, and `currentAssignmentId: null`. Sorts by `updatedAt` asc to match the rider who has been idle the longest.
- **Atomic Double-Allocation Locks:**
  - Secures the agent by atomically changing `currentAssignmentId = deliveryId`.
  - Concurrently locks the delivery record by updating `deliveryAgentId = agentId` and `deliveryStatus = 'assigned'`.
  - Rolles back agent lease if the delivery was concurrently snatched or cancelled.

### 3. Integration Hooks
- **Order Handoff:** Hooks into Phase 5 packing completion. Once packing is marked complete, `initializeDeliveryForOrder` creates the delivery record and `runDispatchEngineForOrder` triggers dispatch matching.
- **Fail-Safe Isolation:** Wrapped in deep try/catch blocks; any assignment or placeholder notification failure only logs a warning and *never* blocks checkout loops or vendor packing success responses.
- **Agent Notification:** Creates a mock record in `order_notification_placeholders` for recipientType `'agent'` containing order details.

### 4. Admin Routing & Queue Management
- Exposes administrative routes under `/api/v1/admin/deliveries`:
  - `GET /pending?cityId=`: inspects unassigned delivery queue.
  - `POST /:deliveryId/dispatch`: re-triggers the matching pass for a stuck assignment.
- Both routes enforce authentication and require administrative role clearance.

---

## Downstream Handoff Info (For Modules 5 & 6)

Subsequent modules (Delivery Agent App integration) must utilize these entities and properties to display active assignment queues and statuses:

### Key Integration Points:
1. **Rider Online Status Hook:** When a delivery agent toggles status to `online` (Module 3/5), call `runDispatchEngineForAgent(agentId)` to immediately attempt pairing them with the oldest unassigned pending order in their city.
2. **Agent Assignment Screens (Module 6):**
   - The agent app status polling (`GET /api/v1/delivery/status`) will return the updated agent profile.
   - If `currentAssignmentId` is non-null, fetch the delivery details using that ID.
   - The active assignment flow (accept/reject) will mutate this assignment state (transitioning from `'assigned'` to `'en_route_to_store'`).

---

## Technical Health Summary
- **Typecheck & Lint:** 100% green.
- **Tests passing:** 39 tests passing cleanly in **390ms** (`npm run test:delivery-agents -w backend/api` and `npm run test:customer-orders -w backend/api`).
