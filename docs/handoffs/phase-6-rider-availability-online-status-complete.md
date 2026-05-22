# Handoff: Phase 6 Module 3 — Rider Availability & Online Status

## Module Objective
This module successfully establishes the presence and availability state machine for delivery riders. Toggling availability status (`PATCH /api/v1/delivery/availability`) and retrieving lightweight status summaries (`GET /api/v1/delivery/status`) are fully operational and verified, laying the groundwork for active assignment matching in Module 4.

## Key Changes & Implementations

### 1. Database & Repository Layer
- Implemented `updateDeliveryAgentAvailability` in `delivery-agent.repository.ts` to perform atomic updates to `availabilityStatus`.

### 2. Service Layer Completeness Guards
- Enforced profile completeness criteria in `setAgentAvailability` service method before allowing riders to change availability to `online`:
  1. `cityId` must be non-null (crucial for geographic routing/serviceability).
  2. `vehicleNumber` must be present and non-empty.
  3. `isVerified` must be `true` (approved by admin).
  4. `isActive` must be `true` (agent active).
- Attempts to toggle online when these conditions are breached throw a 409 Conflict with error code `DELIVERY_AGENT_PROFILE_INCOMPLETE`.
- Setting availability to `offline` is always allowed and carries no validation restrictions.

### 3. Controller & Routing
- Handlers in `delivery-agent.controller.ts` successfully extract identity using `x-agent-id` headers as a proxy for delivery agents.
- Body payloads are validated against Zod `updateAvailabilityBodySchema` (Zod validation throws a 422 payload error for values other than `online` or `offline`).

---

## Downstream Handoff Info (For Module 4 — Delivery Assignment Backend)

The Delivery Assignment backend (Module 4) must use the outputs of this module to pair active/serviceable delivery agents with orders ready for pickup.

### Key Considerations for Module 4:
1. **Agent Queries**: To find eligible riders for assignment, query the database for agents with:
   - `availabilityStatus: 'online'`
   - `isVerified: true`
   - `isActive: true`
   - `cityId: [Order Store City]`
   - `currentAssignmentId: null` (rider is not currently occupied with another delivery)
2. **Assignments Status Interaction**: Once an agent is assigned an active order, update `currentAssignmentId` in `DeliveryAgent` to lock the rider. The status API `GET /api/v1/delivery/status` will automatically reflect this assignment back to the mobile agent.

---

## Technical Health & Verification Summary
- **Typecheck & Lint:** Passing 100% cleanly.
- **Service & Route Tests:** 29 tests verified passing.
- **Modular OpenAPI Paths:** Dynamically registered under `deliveryPaths`.
