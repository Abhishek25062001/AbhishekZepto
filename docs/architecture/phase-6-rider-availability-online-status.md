# Phase 6 Rider Availability & Online Status Architecture

## Goal

Module 3 implements the rider availability toggle and online presence state machine. It provides the mechanism for a delivery agent to toggle their availability status between `online` and `offline` and fetch their current availability status.

This presence record is a strict prerequisite for the Module 4 dispatch engine, which restricts delivery assignments to verified, active, and online agents.

**Sources:**
- `projectin micro/docfive/PhaesDetail6,7&8.pdf` (Phase 6 delivery lifecycle)

---

## Presence Boundary & Scope

Module 3 defines the business rules, validations, and API routes that modify the `availabilityStatus` of a delivery agent.

### In Scope

1. **Repository Method:** A single-purpose database update function (`updateDeliveryAgentAvailability`) that mutates the `availabilityStatus` field of the Mongoose `DeliveryAgent` model.
2. **Service Mutation:** A service method (`setAgentAvailability`) that runs validations and transitions the status.
3. **Completeness Rules:** Strict business rules that block an agent from going `online` if their profile is incomplete or unverified.
4. **Endpoints:**
   - `PATCH /api/v1/delivery/availability` — Toggle presence status.
   - `GET /api/v1/delivery/status` — Fetch current presence and active assignment status.
5. **Types and Schemas:** Zod validator payload schema and TypeScript type definitions for status payloads.
6. **Tests:** Service unit tests and route integration tests.

### Out of Scope (Deferred to Phase 7+)

1. **Real-time Geolocation Stream:** Continuously sending latitude/longitude updates from the mobile app to the backend.
2. **Redis Presence Cache:** Using Redis geo-indexing (e.g. `GEOADD`) or ephemeral key expirations for heartbeat presence tracking.
3. **WebSockets Presence:** Utilizing stateful socket connections (e.g. Socket.io) to monitor network-level connection state.
4. **Assignment Dispatching:** Automatically pairing orders with riders (owned by Module 4).

---

## Profile Completeness Rules

To ensure only qualified and ready riders receive delivery assignments, an agent **MUST NOT** toggle their status to `online` unless their profile is complete and verified.

If an agent attempts to go `online` while failing any of the following rules, the backend must throw a `DELIVERY_AGENT_PROFILE_INCOMPLETE` (HTTP 409) error:

1. **City Assignment (`cityId`):** The profile must have an assigned operating city (`cityId` is not null). This is required for location-based zone dispatching.
2. **Vehicle Registration (`vehicleNumber`):** The profile must have a valid vehicle registration number recorded (`vehicleNumber` is not null, not empty, and not whitespace).
3. **Verification Approved (`isVerified`):** The admin verification flag must be `true`. Unverified profiles are blocked from going online.
4. **Account Active (`isActive`):** The account status flag must be `true`. Suspended, deactivated, or soft-deleted profiles cannot go online.

*Note: There are no completeness checks when toggling to `offline`—this transition is always allowed for safety.*

---

## Upstream Dependencies

| Dependency | Source | Purpose |
|------------|--------|---------|
| `DeliveryAgentModel` | `backend/api/src/modules/delivery/models/delivery-agent.model.ts` | Data schema and active record querying |
| `AVAILABILITY_STATUS` | `backend/api/src/modules/delivery/constants/delivery-agent-status.constant.ts` | Allowed status enum values (`online`, `offline`) |
| `findDeliveryAgentById` | `backend/api/src/modules/delivery/repositories/delivery-agent.repository.ts` | Read-only agent existence checks |
| `ERROR_CODES` | `backend/api/src/errors/error-codes.ts` | Pre-registered delivery agent error codes |

---

## Downstream Consumers

| Consumer | What it relies on from Module 3 |
|----------|---------------------------------|
| **Module 4 — Assignment Backend** | Relies on `availabilityStatus = 'online'` and `cityId` to query available riders. |
| **Module 5 — Agent App Availability** | Frontend screen that consumes `PATCH /delivery/availability` and `GET /delivery/status`. |

---

## API Endpoints Implemented

| Method | Path | Actor | Auth | Purpose |
|--------|------|-------|------|---------|
| PATCH | `/api/v1/delivery/availability` | Delivery Agent | Placeholder header (`x-agent-id`) | Toggle status between `online` and `offline` |
| GET | `/api/v1/delivery/status` | Delivery Agent | Placeholder header (`x-agent-id`) | Lightweight query for presence status and current assignment |

---

## DB Fields

No database migrations or new schema fields are introduced. This module operates on the existing fields defined in the Mongoose `delivery_agents` schema:
- `availabilityStatus` (`'online'` | `'offline'`)
- `cityId`
- `vehicleNumber`
- `isVerified`
- `isActive`
- `isDeleted`
