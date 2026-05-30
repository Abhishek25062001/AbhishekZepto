# Phase 6 Release Notes — Delivery Lifecycle

**Version:** `1.1.0-phase6`  
**Date:** 2026-05-29  
**Status:** Operator Ready  

---

## 1. Executive Summary

Phase 6 implements the complete **Delivery Lifecycle** for our quick-commerce system. This phase acts as the active handoff bridge between the store picking/packing pipeline (completed in Phase 5) and the customer's front door. It introduces onboarding and online tracking for delivery partners, a dispatch matching engine, location-based transit tracking, OTP-secured completion handovers, concurrent SLA stage breach sweeps, and comprehensive operational dashboards for vendors and admins.

---

## 2. What's New in Phase 6

### 2.1 Rider Onboarding & Availability
- **Delivery Agent Profiles**: Onboarding capabilities for riders, registering names, vehicle details, contact information, and operating city IDs.
- **Availability Engine**: Multi-state toggle (`online` \| `offline` \| `inactive`) managing active rider capacity. Allows riders to go online and auto-registers their current operating city coordinate boundaries.

### 2.2 Auto-Assignment Matching Engine (Dispatch)
- **Automatic Matching**: The dispatch matching engine processes incoming orders marked ready-for-pickup, sweeps online and available riders in the matching city, sorts by distance/priority, and automatically assigns a rider to avoid order stagnation.
- **Acceptance/Rejection Guards**: Prevents multiple assignments per rider. Auto-releases a rider back to the available pool when their active delivery is completed or cancelled.

### 2.3 Rider Active Workflow & Transit Tracking
- **Sequential Location Markers**: Strict, sequential stage validation preventing riders from jumping steps:
  - Arrived at Store (`arrived_at_store`)
  - Picked Up package with verification (`picked_up`)
  - En Route to Customer (`en_route_to_customer`)
  - Arrived at Customer building (`arrived_at_customer`)
  - Delivered handover with OTP (`delivered`)
- **Completion Safety**: Delivery completion requires an OTP/Pin verification matching the customer's order receipt, triggering automated parent order synchronization to `delivered` status.

### 2.4 Concurrent SLA Monitoring & Breaches
- **Stage SLAs**: Independent timers tracking three distinct operational windows:
  - **Assignment SLA**: Max 5 minutes to match a rider from order check-in.
  - **Pickup SLA**: Max 15 minutes for the rider to reach the store and pick up the package.
  - **Drop SLA**: Max 30 minutes for the rider to transit and hand over the package to the customer.
- **Total Journey SLA**: Concurrent timer monitoring max 45 minutes from order check-in to final customer delivery.
- **SLA Cron Evaluate**: internal cron sweep evaluates delayed active assignments, marks breaches, logs secure audit records, and triggers notifications.

### 2.5 Multi-Surface Operational Dashboards
- **Customer App**: Real-time tracking panel showing rider profile details, current transit states, and progress timeline.
- **Vendor Panel**: Queue visibility showing preparation riders currently `en_route_to_store` and `arrived_at_store`.
- **Admin Dashboard**: Live monitors showing active delivery states, SLA statuses (on-time, at-risk, breached), and administrative override hooks.

---

## 3. Database Schema & Index Changes

Phase 6 introduces two new collections with optimized indexes for high-frequency queries:

### 3.1 `delivery_agents` (Riders)
- **Schema**: Stores profile, cityId, vehicle details, status (`online` \| `offline` \| `inactive`), and `currentAssignmentId`.
- **Key Indexes**:
  - `cityId` + `status` + `currentAssignmentId` (Compound index for rapid available rider sweeps).

### 3.2 `delivery_assignments` (Deliveries)
- **Schema**: Tracks orderId, customerId, storeId, cityId, deliveryAgentId, status, timestamps (`assignedAt`, `pickedUpAt`, etc.), SLA deadlines, and timeline history events.
- **Key Indexes**:
  - `deliveryStatus` (Sparse index for pending queue checks).
  - `slaStatus` (Sparse index for optimized cron evaluation loops).

---

## 4. Environment Variables & Prerequisites

The following environment variables are required in the operating environment for Phase 6 backend servers:
- `JWT_ACCESS_SECRET`: Secret key for validating customer and admin JWT credentials.
- `JWT_REFRESH_SECRET`: Secret key for validating session refreshes.
- `APP_ENV`: Must be set to `production`, `development`, or `test`.
- `APP_PORT`: Set to binding port (default `5000`).
- `APP_VERSION`: Core semver value (e.g., `1.0.0`).
- `JWT_AGENT_SECRET` (Future capability): Dedicated secret for rider application auth. Current build leverages modular `authenticateDeliveryAgent()` passport hooks.
