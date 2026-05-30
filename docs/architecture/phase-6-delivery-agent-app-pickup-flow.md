# Phase 6 Module 7 — Delivery Agent App: Pickup Flow Architecture

## Goal

This document defines the architecture, boundary, screen flow, navigation design, API
integration pattern, and state management strategy for **Module 7 — Delivery Agent App:
Pickup Flow**.

Module 7 builds the React Native mobile screens that allow a delivery agent to:
1. Confirm they have arrived at the store (`en_route_to_store` → `arrived_at_store`).
2. Confirm they have picked up the order packages (`arrived_at_store` → `picked_up`).

The backend transitions are already implemented in **Module 6 — Store Arrival & Pickup
Backend**. This module is the UI layer only.

**Sources:**
- `docs/architecture/phase-6-store-arrival-pickup-backend.md`
- `docs/contracts/phase-6-store-arrival-pickup-api.md`
- `projectin micro/docfive/PhaesDetail6,7&8.pdf` (Phase 6 micro-tasks)

---

## 1. Boundary & Scope

### In Scope
1. **Delivery Type Extensions:** Adding `DeliveryStatus`, `DeliveryAssignmentResponse`, and
   `PickupVerificationPayload` TypeScript types to the agent app.
2. **API Client Extension:** Adding `markArrivedAtStore` and `markPickedUp` Axios functions
   to `delivery.api.ts`.
3. **Zustand Store Upgrade:** Typing `currentDeliveryStatus` as `DeliveryStatus | null`
   and adding a `setCurrentDeliveryStatus` action.
4. **StoreArrivalScreen:** Full screen for confirming store arrival.
5. **PickupConfirmationScreen:** Full screen for confirming package pickup with optional
   verification metadata form.
6. **Navigation Wiring:** Registering both screens in `MainStackParamList` and
   `MainNavigator`.
7. **DeliveryHomeScreen Routing:** Adding an active assignment card that routes agents to
   the correct screen based on `currentDeliveryStatus`.

### Out of Scope (Deferred)
1. **GPS / Geofencing:** No coordinate checking or proximity validation (Phase 7+).
2. **Real Barcode Scanner:** No hardware camera integration or decode library (Phase 7+).
3. **Real OTP Validation:** No SMS OTP generation or verification (Phase 7+).
4. **Delivery Progress Beyond `picked_up`:** En-route-to-customer and delivery completion
   screens are owned by Modules 10 and 12.
5. **Customer Tracking Screen:** Owned by Module 13.
6. **Vendor Pickup Visibility:** Owned by Module 14.

---

## 2. Screen Flow Diagram

```
DeliveryHomeScreen
│
├── [currentDeliveryStatus === 'en_route_to_store']
│   └── "I've Arrived at Store" button
│       └── navigate → StoreArrivalScreen { assignmentId }
│           └── [Tap "Confirm Store Arrival"]
│               └── POST /assignments/:id/arrived-at-store
│                   ├── Success → setCurrentDeliveryStatus('arrived_at_store')
│                   │           → navigate → PickupConfirmationScreen { assignmentId }
│                   └── Error  → show inline error
│
├── [currentDeliveryStatus === 'arrived_at_store']
│   └── "Confirm Package Pickup" button
│       └── navigate → PickupConfirmationScreen { assignmentId }
│           └── [Fill optional verification form]
│           └── [Tap "Confirm Package Pickup"]
│               └── POST /assignments/:id/picked-up { verificationData? }
│                   ├── Success → setCurrentDeliveryStatus('picked_up')
│                   │           → navigate back to DeliveryHome (success card)
│                   └── Error  → show inline error
│
└── [Other statuses] → status-only info card, no action button
```

---

## 3. Navigation Architecture

### Param List Changes

`MainStackParamList` in `navigation.types.ts` will add:
```ts
StoreArrival: { assignmentId: string };
PickupConfirmation: { assignmentId: string };
```

### Stack Registration

Both screens are registered in `MainNavigator.tsx` with descriptive titles:
- `StoreArrival` → `StoreArrivalScreen` — "Store Arrival"
- `PickupConfirmation` → `PickupConfirmationScreen` — "Confirm Pickup"

### Navigation Flow

- **StoreArrivalScreen** is accessed from `DeliveryHomeScreen` with a deep-link style
  push containing `assignmentId`.
- **PickupConfirmationScreen** is accessed from `StoreArrivalScreen` on successful
  arrival confirmation, or directly from `DeliveryHomeScreen` if status is already
  `arrived_at_store`.
- On successful pickup, the agent is navigated back to `DeliveryHome` where the
  assignment card will update to reflect `picked_up` status.

---

## 4. State Management Strategy

### Zustand Delivery Store (`delivery.store.ts`)

The store already holds:
- `currentAssignmentId: string | null`
- `currentDeliveryStatus: string | null` → upgraded to `DeliveryStatus | null`

New action added:
- `setCurrentDeliveryStatus(status: DeliveryStatus | null): void`

### State Update Flow

```
API success callback
  → setCurrentDeliveryStatus('arrived_at_store' | 'picked_up')
  → React component re-renders
  → DeliveryHomeScreen card updates to new status
```

The status is not re-fetched from the network after each mutation. The Zustand store is
the source of truth for the current session's delivery status. On app restart, the
existing `useDeliveryStatusQuery` re-fetches from the backend and re-hydrates the store.

---

## 5. API Integration Pattern

Both screens use **TanStack Query mutations** wrapping the delivery API functions:

```
useMutation({
  mutationFn: () => markArrivedAtStore(assignmentId),
  onSuccess: (data) => {
    setCurrentDeliveryStatus('arrived_at_store');
    navigate('PickupConfirmation', { assignmentId });
  },
  onError: (err) => showErrorMessage(err),
})
```

The pattern mirrors the existing `useUpdateAvailabilityMutation` hook in
`useDeliveryStatus.ts`.

---

## 6. Verification Form (Placeholder)

The `PickupConfirmationScreen` includes an optional verification metadata form:

| Field | Type | Backend field |
|-------|------|---------------|
| Verification Method | Segmented control: `OTP \| Barcode \| Manual` | `verificationMethod` |
| Verification Value | Text input (free text) | `verificationValue` |
| Notes | Text area | `notes` |

All fields are optional. The backend accepts them as placeholder metadata only — no real
OTP delivery, barcode decoding, or validation happens in Phase 6.

---

## 7. Design Tokens

Consistent with existing `DeliveryHomeScreen` design:

| Token | Value | Usage |
|-------|-------|-------|
| Dark background | `hsl(222, 47%, 11%)` | Screen background |
| Glass card | `hsla(217, 33%, 17%, 0.75)` + `blur(12px)` | Info cards |
| Card border | `hsla(217, 33%, 25%, 0.5)` | Card borders |
| Online/success green | `hsl(142, 70%, 45%)` | Success state glow |
| Amber accent | `hsl(45, 90%, 48%)` | Status badge, arrived state |
| Error red | `hsl(0, 85%, 60%)` | Error messages |

---

## 8. API Endpoints Consumed

| Method | Path | Screen |
|--------|------|--------|
| POST | `/api/v1/delivery/assignments/:assignmentId/arrived-at-store` | StoreArrivalScreen |
| POST | `/api/v1/delivery/assignments/:assignmentId/picked-up` | PickupConfirmationScreen |

Both endpoints require `Authorization: Bearer <accessToken>` header with `delivery_agent`
role. The `apiClient` in `services/api/client.ts` handles auth header injection.

---

## 9. Files Changed in Module 7

| File | Change |
|------|--------|
| `apps/delivery-agent-app/src/types/delivery.types.ts` | Add `DeliveryStatus`, `DeliveryAssignmentResponse`, `PickupVerificationPayload` |
| `apps/delivery-agent-app/src/services/api/delivery.api.ts` | Add `markArrivedAtStore`, `markPickedUp` |
| `apps/delivery-agent-app/src/store/delivery.store.ts` | Upgrade status type, add `setCurrentDeliveryStatus` |
| `apps/delivery-agent-app/src/screens/main/StoreArrivalScreen.tsx` | New screen |
| `apps/delivery-agent-app/src/screens/main/PickupConfirmationScreen.tsx` | New screen |
| `apps/delivery-agent-app/src/app/navigation.types.ts` | Add `StoreArrival`, `PickupConfirmation` params |
| `apps/delivery-agent-app/src/app/MainNavigator.tsx` | Register both new screens |
| `apps/delivery-agent-app/src/screens/main/DeliveryHomeScreen.tsx` | Add active assignment routing card |

---

## 10. DB Fields

No new database fields are introduced by this module. All backend schema work was
completed in Module 6.

## 11. API Endpoints

No new backend API endpoints are introduced by this module. Both endpoints consumed
(`arrived-at-store`, `picked-up`) were implemented in Module 6.
