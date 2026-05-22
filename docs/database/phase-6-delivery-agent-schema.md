# Phase 6 Delivery Agent Schema Plan

## Scope

This document plans the `delivery_agents` MongoDB collection: all fields,
types, required flags, default values, enum values, and indexes. It does
not create a Mongoose schema, migration, seed data, or runtime code.

**Sources:**

- `projectin micro/docfive/PhaesDetail6,7&8.pdf` (Phase 6 delivery lifecycle micro-tasks)
- `docs/architecture/phase-6-delivery-ownership-rules.md` (`deliveryAgentId` scope rules)
- `docs/architecture/phase-6-delivery-sla-timing-rules.md` (`cityId` usage in SLA config lookup)
- `docs/database/phase-5-order-lifecycle-schema.md` (consistency reference)

---

## Collection

`delivery_agents`

The `delivery_agents` collection is the foundational identity and status record
for the Phase 6 delivery lifecycle. It is linked to `user_identities` via
`userId` for authentication scope. Every delivery, assignment, and availability
operation in Phase 6 requires a valid `delivery_agents` record.

---

## Planned Fields

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `_id` | ObjectId | yes | auto | MongoDB default primary key |
| `userId` | ObjectId | yes | — | Ref to `user_identities` — the linked auth identity. **Unique.** |
| `name` | string | yes | — | Agent display name (trimmed) |
| `phone` | string | yes | — | Agent contact phone (trimmed). **Unique.** |
| `email` | string | no | null | Agent contact email (trimmed, lowercase) |
| `profilePhotoUrl` | string | no | null | URL to profile photo |
| `vehicleType` | enum | yes | — | One of `VEHICLE_TYPE` values (see below) |
| `vehicleNumber` | string | no | null | Vehicle registration or ID (trimmed) |
| `availabilityStatus` | enum | yes | `offline` | One of `AVAILABILITY_STATUS` values. Toggled by Module 3. |
| `isVerified` | boolean | yes | `false` | Admin-verified profile flag |
| `isActive` | boolean | yes | `true` | Account active flag |
| `isDeleted` | boolean | yes | `false` | Soft-delete flag |
| `deletedAt` | Date | no | null | Soft-delete timestamp (set when `isDeleted = true`) |
| `cityId` | ObjectId | no | null | Operating city ref — used for zone assignment dispatch (Module 4) and SLA config lookup |
| `currentAssignmentId` | ObjectId | no | null | Ref to active delivery assignment (null if idle). Module 4 creates the assignment model. |
| `totalDeliveries` | number | yes | `0` | Lifetime completed delivery count. Min: 0. |
| `createdAt` | Date | yes | auto | Managed by Mongoose `timestamps: true` |
| `updatedAt` | Date | yes | auto | Managed by Mongoose `timestamps: true` |

---

## Enum Values

### `vehicleType` (VEHICLE_TYPE)

| Constant | DB value | Description |
|----------|----------|-------------|
| `BIKE` | `'bike'` | Motorbike |
| `SCOOTER` | `'scooter'` | Scooter |
| `BICYCLE` | `'bicycle'` | Bicycle |
| `FOOT` | `'foot'` | On foot |

### `availabilityStatus` (AVAILABILITY_STATUS)

| Constant | DB value | Description |
|----------|----------|-------------|
| `OFFLINE` | `'offline'` | Agent is not available for assignment (default) |
| `ONLINE` | `'online'` | Agent is available for assignment dispatch |

**Note:** `availabilityStatus` is only writable through the
`PATCH /api/v1/delivery/availability` endpoint (Module 3). The
`PATCH /api/v1/delivery/profile` endpoint (Module 2) does NOT allow
updating `availabilityStatus`.

---

## Planned Indexes

| Index fields | Uniqueness | Rationale |
|-------------|------------|-----------|
| `{ userId: 1 }` | **unique** | Fast identity lookup, prevents duplicate agent per user |
| `{ phone: 1 }` | **unique** | Identity check and login scope |
| `{ availabilityStatus: 1, cityId: 1 }` | non-unique | Module 4 assignment dispatch query: find online agents in a city |
| `{ isDeleted: 1, isActive: 1, availabilityStatus: 1 }` | non-unique | Availability list query filter |
| `{ createdAt: -1 }` | non-unique | Admin list sort by newest first |

---

## Fields NOT Patchable via Profile Endpoint

The following fields are read-only or system-managed — they cannot be updated
through the Module 2 `PATCH /api/v1/delivery/profile` endpoint:

- `availabilityStatus` — Module 3 owns the toggle
- `userId` — immutable identity link
- `phone` — identity field (not changeable via profile PATCH)
- `isVerified` — Admin-only via admin panel (future module)
- `isActive` — Account active state (not a profile field)
- `isDeleted` / `deletedAt` — Soft-delete lifecycle (not a profile field)
- `totalDeliveries` — system-managed counter
- `currentAssignmentId` — system-managed (Module 4)

---

## Cross-References

- Ownership rules (scope by `deliveryAgentId`): `docs/architecture/phase-6-delivery-ownership-rules.md`
- SLA timing rules (use of `cityId` for SLA config lookup): `docs/architecture/phase-6-delivery-sla-timing-rules.md`
- Route plan (planned routes for this module): `docs/contracts/phase-6-delivery-route-plan.md`
- Error codes: `docs/errors/phase-6-delivery-error-codes.md`

---

## Implementation Tickets

| Ticket | Action |
|--------|--------|
| 2.4 | Creates Mongoose schema and model (`delivery-agent.model.ts`) with all fields and indexes above |
| 2.5 | Creates repository using the model |

---

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document. All entries above are planned
schema additions for Ticket 2.4.
