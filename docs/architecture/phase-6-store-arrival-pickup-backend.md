# Phase 6 Store Arrival & Pickup Backend — Architecture & Boundaries

## Purpose
This document defines the architecture, boundary scope, allowed state transitions, and timeline logging protocols for the Store Arrival and Pickup backend modules of Phase 6.

## State Transitions

### 1. `en_route_to_store` → `arrived_at_store`
* **Actor:** Delivery Agent (authenticated via JWT)
* **Preconditions:**
  * Assignment must exist in `en_route_to_store` state.
  * Assigner identity check: `deliveryAgentId` on assignment must match authenticated agent's `_id`.
* **Blocked if:**
  * Assignment is in any terminal state (`delivered`, `failed`, `cancelled`).
  * Assignment is already advanced (`picked_up`, `en_route_to_customer`, etc.).
  * Assignment belongs to a different agent.
* **Mutations:**
  * Set `deliveryStatus` = `arrived_at_store`.
  * Set `arrivedAtStoreAt` = current server timestamp.
  * Push an event to `timeline` array capturing agent identity, transition states, and optional comments.

### 2. `arrived_at_store` → `picked_up`
* **Actor:** Delivery Agent (authenticated via JWT)
* **Preconditions:**
  * Assignment must exist in `arrived_at_store` state.
  * Assigner identity check: `deliveryAgentId` on assignment must match authenticated agent's `_id`.
* **Blocked if:**
  * Assignment is in any terminal state (`delivered`, `failed`, `cancelled`).
  * Assignment has not yet reached `arrived_at_store` (e.g. still in `en_route_to_store` or `assigned`).
* **Mutations:**
  * Set `deliveryStatus` = `picked_up`.
  * Set `pickedUpAt` = current server timestamp.
  * Push an event to `timeline` array capturing agent identity, transition states, and verification metadata.

## Boundaries & Out of Scope for Phase 6
* **Geolocation / GPS Fencing:** Strictly out of scope. Geofencing check (verifying if coordinates of the rider are within `N` meters of the store coordinates) is deferred to later phases. No GPS checking is performed during state transitions in this module.
* **Hardware OTP or Barcode Scanning Verification:** Strictly out of scope. No live barcode scanning decoder or real-time SMS OTP generation/validation is implemented. The API supports a mock/placeholder metadata object `verificationMetadata` in the request body for transition to `picked_up` to capture scanned info/notes.
* **Auto-Assignment / Matching:** Handled in Module 4. This module strictly handles state transitions of an already assigned rider.

## Timeline Audit Protocol
For every state transition, the application must push an event to the `timeline` sub-document array:
* `actorType`: `'delivery_agent'`
* `actorId`: The ObjectId of the authenticated `DeliveryAgent`.
* `fromStatus`: Previous delivery status (e.g. `'en_route_to_store'`).
* `toStatus`: New target delivery status (e.g. `'arrived_at_store'`).
* `reason`: String describing details or optional verification metadata.
* `createdAt`: Server timestamp of the transition event.
