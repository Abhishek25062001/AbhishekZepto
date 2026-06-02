# Phase 8 Module 5 — Delivery Agent Management Schema

## Status

Implemented as a schema contract. No new collection is required.

## Existing Collection

Module 5 uses the existing `delivery_agents` collection created by Phase 6.

| Field | Source | Admin visibility | Notes |
| --- | --- | --- | --- |
| `_id` | `delivery_agents` | yes | Returned as `agentId`. |
| `userId` | `delivery_agents` | yes | Linked auth identity. |
| `name` | `delivery_agents` | yes | Delivery agent profile name. |
| `phone` | `delivery_agents` | yes | Existing unique phone value. |
| `email` | `delivery_agents` | yes | Nullable. |
| `profilePhotoUrl` | `delivery_agents` | yes | Nullable. |
| `vehicleType` | `delivery_agents` | yes | Existing vehicle enum. |
| `vehicleNumber` | `delivery_agents` | yes | Nullable. |
| `availabilityStatus` | `delivery_agents` | yes | Existing `online` / `offline` availability. |
| `forcedOfflineAt` | `delivery_agents` | yes | Admin-forced offline timestamp when present. |
| `forcedOfflineReason` | `delivery_agents` | yes | Admin-forced offline reason when present. |
| `forcedOfflineBy` | `delivery_agents` | yes | Admin actor id when present. |
| `isVerified` | `delivery_agents` | yes | Admin verification flag. |
| `isActive` | `delivery_agents` | yes | Admin activation flag. |
| `isDeleted` | `delivery_agents` | no | Used internally to exclude soft-deleted records. |
| `deletedAt` | `delivery_agents` | no | Used internally for soft deletion. |
| `cityId` | `delivery_agents` | yes | Admin city scoping and filters. |
| `currentAssignmentId` | `delivery_agents` | yes | Read-only active assignment pointer. |
| `totalDeliveries` | `delivery_agents` | yes | Existing delivery count. |
| `createdAt` | base schema | yes | Created timestamp. |
| `updatedAt` | base schema | yes | Updated timestamp. |

## No New Fields

Module 5 must not add delivery-agent payroll, incentive, export, analytics,
location-history, or assignment-matching fields. Assignment history remains in
`delivery_assignments`; admin action history remains in `admin_action_audits`.
