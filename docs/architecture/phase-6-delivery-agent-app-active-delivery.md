# Phase 6 Module 10 — Delivery Agent App: Active Delivery Architecture

## Goal

This document defines the architecture, boundary, screen flow, navigation design, API integration pattern, and state management strategy for **Module 10 — Delivery Agent App: Active Delivery**.

Module 10 builds the React Native mobile screens that allow a delivery agent to:
1. View order and departure details when packages are collected from the store (`picked_up` state).
2. Depart the store toward the customer and start navigation (`picked_up` → `en_route_to_customer`).
3. Track their active journey to the customer with an elegant mock map layout and customer details (`en_route_to_customer` state).
4. Confirm physical arrival at the customer's delivery address (`en_route_to_customer` → `arrived_at_customer`).
5. Complete handover checklists and view continuation placeholders (`arrived_at_customer` state).

The backend transitions are already implemented in **Module 8 — Delivery Progress Backend**. This module is the UI layer only.

**Sources:**
- `docs/contracts/phase-6-delivery-progress-api.md`
- `projectin micro/docfive/PhaesDetail6,7&8.pdf` (Phase 6 micro-tasks)

---

## 1. Boundary & Scope

### In Scope
1. **Delivery Type Extensions:** Adding `enRouteToCustomerAt` and `arrivedAtCustomerAt` timestamp types to `DeliveryAssignmentResponse` in the agent app.
2. **API Client Extension:** Adding `markEnRouteToCustomer` and `markArrivedAtCustomer` Axios functions to `delivery.api.ts`.
3. **ActiveDeliveryScreen:** Detailed screen supporting both the departure phase (`picked_up` state) and active transit phase (`en_route_to_customer` state) with a premium mock map and customer info panel.
4. **CustomerArrivalScreen:** Full screen for confirming physical arrival at the destination with interactive package handover checklists.
5. **Navigation Wiring:** Registering and parameters typing for both screens in `MainStackParamList` and `MainNavigator`.
6. **DeliveryHomeScreen Integration:** Modifying active assignment cards to show specific buttons for `picked_up`, `en_route_to_customer`, and `arrived_at_customer` states.

### Out of Scope (Deferred to Phase 7+)
1. **Real GPS Proximity / Geofencing:** No coordinate comparing or distance radius checking.
2. **Google Maps / Mapbox SDK Integration:** No live map tiles, route calculation, or map canvas layers.
3. **WebSockets Location Push:** No real-time agent position broadcasts to backend.
4. **Delivery Handover OTP Validation:** SMS or customer PIN verification code checking is owned by Module 12 (Completion Flow).

---

## 2. Screen Flow Diagram

```
DeliveryHomeScreen
│
├── [currentDeliveryStatus === 'picked_up']
│   └── "Depart Store & Start Navigation" button
│       └── navigate → ActiveDeliveryScreen { assignmentId }
│           └── [Tap "Depart Store & Navigate"]
│               └── POST /assignments/:id/en-route-to-customer
│                   ├── Success → setCurrentDeliveryStatus('en_route_to_customer')
│                   │           → Render ActiveTransit View
│                   └── Error  → show inline error
│
├── [currentDeliveryStatus === 'en_route_to_customer']
│   └── "View Active Route Progress" button
│       └── navigate → ActiveDeliveryScreen { assignmentId }
│           └── [Tap "I've Arrived at Customer"]
│               └── POST /assignments/:id/arrived-at-customer
│                   ├── Success → setCurrentDeliveryStatus('arrived_at_customer')
│                   │           → navigate → CustomerArrivalScreen { assignmentId }
│                   └── Error  → show inline error
│
└── [currentDeliveryStatus === 'arrived_at_customer']
    └── "Confirm Handover" button
        └── navigate → CustomerArrivalScreen { assignmentId }
            └── [Check Handover Checklist items]
            └── [Tap "Confirm Handover & Deliver"]
                └── Show informational popup
                └── navigate back → DeliveryHomeScreen
```

---

## 3. Navigation Architecture

### Param List Changes

`MainStackParamList` in `navigation.types.ts` will update:
- `ActiveDelivery` → `{ assignmentId: string }` (previously `undefined`)
- Add `CustomerArrival: { assignmentId: string }`

### Stack Registration

Both screens are registered in `MainNavigator.tsx` with descriptive titles:
- `ActiveDelivery` → `ActiveDeliveryScreen` — "Active Delivery"
- `CustomerArrival` → `CustomerArrivalScreen` — "Arrived at Customer"

---

## 4. State Management Strategy

### Zustand Store Update Flow

Updates use **TanStack Query mutations** wrapping the Axios client calls. On successful transitions:
1. `setCurrentDeliveryStatus(...)` updates the Zustand state client-side.
2. React components re-render instantly to display the correct state/buttons.
3. On fresh app launch, the store is hydrated from the query endpoint `fetchAgentAvailabilityStatus`.

---

## 5. Mock Map & Customer Panel Visual Design

Since real maps are out of scope for Phase 6, we implement a beautiful placeholder:
* **Background:** Deep navy blue canvas (`#0D1526`) with a clean grid border and grid mesh background.
* **Store Node:** A neon-green circle with a shopping bag/store emoji (`🏪`) representing the departure point.
* **Rider Node:** A pulsing bicycle/rider emoji (`🚴`) positioned on a dotted transit trail. Pulsing animation runs on a loop using React Native `Animated`.
* **Customer Node:** A neon-purple circle with a home/customer pin (`🏡`) representing the target address.
* **Customer Panel:** A styled glassmorphic sheet showing customer info:
  * Name: `Shivam Chowdhry`
  * Address: `123 Indiranagar Main Road, Bangalore`
  * Button: "📞 Call Customer" (visual action).

---

## 6. Design Tokens

Matches the existing Zepto premium mobile theme system:

| Token | Value | Usage |
|-------|-------|-------|
| Dark background | `#0D1526` | Main screen canvas |
| Glass card | `rgba(31, 45, 75, 0.85)` | Profile/assignment cards |
| Card border | `rgba(60, 80, 120, 0.5)` | Borders and dividers |
| Success green | `#22C55E` | En-route start status, glow effects |
| Purple accent | `#8B5CF6` | Customer arrival highlights |
| Text secondary | `rgba(200, 210, 230, 0.75)` | Helper notes and labels |
