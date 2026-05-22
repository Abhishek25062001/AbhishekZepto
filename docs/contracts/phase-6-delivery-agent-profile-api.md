# Phase 6 Delivery Agent Profile API — Contract

## Scope

This document defines the exact API contract for the four endpoints implemented
by **Phase 6 Module 2 — Delivery Partner Profile Backend**.

**Module:** 2 — Delivery Partner Profile Backend
**Source:** `docs/architecture/phase-6-delivery-partner-profile-backend.md`

---

## Endpoint Summary

| Method | Path | Actor | Permission | Purpose |
|--------|------|-------|------------|---------|
| GET | `/api/v1/delivery/profile` | Delivery Agent | Authenticated agent | Get own profile |
| PATCH | `/api/v1/delivery/profile` | Delivery Agent | Authenticated agent | Update own profile |
| GET | `/api/v1/admin/agents` | Admin | `delivery:monitor` | List all agents (paginated) |
| GET | `/api/v1/admin/agents/:agentId` | Admin | `delivery:read` | Get single agent by ID |

---

## Auth

### Delivery Agent Routes (`GET /delivery/profile`, `PATCH /delivery/profile`)

**Module 2 placeholder auth:** These routes use a placeholder middleware that
reads `agentId` from the `x-agent-id` request header. This is annotated with
`// TODO: replace with real delivery agent auth middleware` in the route file.

Real JWT authentication for delivery agents is deferred to Module 5 or 6
(frontend integration). The `x-agent-id` value is treated as the agent's
`_id` in the `delivery_agents` collection.

### Admin Routes (`GET /admin/agents`, `GET /admin/agents/:agentId`)

Standard admin JWT authentication via `authenticate()` middleware, restricted
to `SUPER_ADMIN`, `SUPPORT_ADMIN`, `OPERATIONS_ADMIN` roles. Permissions
`delivery:monitor` (list) and `delivery:read` (single) are declared in this
contract and should be seeded in a future permissions pass.

---

## Endpoint 1 — GET /api/v1/delivery/profile

**Purpose:** Retrieve the authenticated delivery agent's own profile.

**Auth:** Placeholder `x-agent-id` header (Module 5 will replace with JWT).

**Request:**

```
GET /api/v1/delivery/profile
x-agent-id: <agentId>
```

No request body. No query params.

**Success Response — 200 OK:**

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "agentId": "string (ObjectId)",
    "userId": "string (ObjectId)",
    "name": "string",
    "phone": "string",
    "email": "string | null",
    "profilePhotoUrl": "string | null",
    "vehicleType": "bike | scooter | bicycle | foot",
    "vehicleNumber": "string | null",
    "availabilityStatus": "offline | online",
    "cityId": "string (ObjectId) | null",
    "currentAssignmentId": "string (ObjectId) | null",
    "totalDeliveries": 0,
    "createdAt": "ISO8601 string",
    "updatedAt": "ISO8601 string"
  },
  "meta": {}
}
```

**Error Responses:**

| Code | HTTP | Description |
|------|------|-------------|
| `DELIVERY_AGENT_NOT_FOUND` | 404 | No delivery agent record found for the given `x-agent-id` |

**Notes:**
- `availabilityStatus` is read-only in this endpoint. Use `PATCH /api/v1/delivery/availability` (Module 3) to toggle it.
- `isVerified`, `isActive`, `isDeleted` are NOT included in this response.

---

## Endpoint 2 — PATCH /api/v1/delivery/profile

**Purpose:** Update the authenticated delivery agent's own profile.

**Auth:** Placeholder `x-agent-id` header (Module 5 will replace with JWT).

**Request Body (all fields optional):**

```json
{
  "name": "string (optional)",
  "email": "string | null (optional)",
  "profilePhotoUrl": "string | null (optional)",
  "vehicleType": "bike | scooter | bicycle | foot (optional)",
  "vehicleNumber": "string | null (optional)"
}
```

**Validation rules:**
- `vehicleType`, if provided, must be one of: `bike`, `scooter`, `bicycle`, `foot`
- Returns 422 on invalid `vehicleType`

**NOT patchable via this endpoint:**
- `availabilityStatus` — owned by Module 3 (`PATCH /api/v1/delivery/availability`)
- `userId` — immutable identity link
- `phone` — identity field (requires separate verification flow)
- `isVerified` — admin-managed flag
- `isActive` — account lifecycle flag
- `isDeleted` / `deletedAt` — soft-delete lifecycle
- `totalDeliveries` — system-managed counter
- `currentAssignmentId` — system-managed (Module 4)

**Success Response — 200 OK:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "agentId": "string",
    "userId": "string",
    "name": "string",
    "phone": "string",
    "email": "string | null",
    "profilePhotoUrl": "string | null",
    "vehicleType": "bike | scooter | bicycle | foot",
    "vehicleNumber": "string | null",
    "availabilityStatus": "offline | online",
    "cityId": "string | null",
    "currentAssignmentId": "string | null",
    "totalDeliveries": 0,
    "createdAt": "ISO8601 string",
    "updatedAt": "ISO8601 string"
  },
  "meta": {}
}
```

**Error Responses:**

| Code | HTTP | Description |
|------|------|-------------|
| `DELIVERY_AGENT_NOT_FOUND` | 404 | No delivery agent found for `x-agent-id` |
| `VALIDATION_ERROR` | 422 | Invalid `vehicleType` or other validation failure |

---

## Endpoint 3 — GET /api/v1/admin/agents

**Purpose:** List all delivery agents with optional filters. Paginated.

**Auth:** Admin JWT, roles: `SUPER_ADMIN`, `SUPPORT_ADMIN`, `OPERATIONS_ADMIN`.
Permission: `delivery:monitor`.

**Query Parameters (all optional):**

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `page` | number | 1 | Page number (min 1) |
| `limit` | number | 20 | Page size (max 100) |
| `availabilityStatus` | string | — | Filter by `offline` or `online` |
| `cityId` | ObjectId | — | Filter by operating city |
| `isActive` | boolean | — | Filter by account active state |

**Success Response — 200 OK:**

```json
{
  "success": true,
  "message": "Agents fetched successfully",
  "data": [
    {
      "agentId": "string",
      "userId": "string",
      "name": "string",
      "phone": "string",
      "email": "string | null",
      "profilePhotoUrl": "string | null",
      "vehicleType": "bike | scooter | bicycle | foot",
      "vehicleNumber": "string | null",
      "availabilityStatus": "offline | online",
      "cityId": "string | null",
      "currentAssignmentId": "string | null",
      "totalDeliveries": 0,
      "createdAt": "ISO8601 string",
      "updatedAt": "ISO8601 string",
      "isVerified": false,
      "isActive": true
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 0
    }
  }
}
```

**Error Responses:**

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 422 | Invalid query params (e.g. negative `page`) |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Authenticated but not an admin role |

---

## Endpoint 4 — GET /api/v1/admin/agents/:agentId

**Purpose:** Get a single delivery agent by ID for admin inspection.

**Auth:** Admin JWT, roles: `SUPER_ADMIN`, `SUPPORT_ADMIN`, `OPERATIONS_ADMIN`.
Permission: `delivery:read`.

**Path Parameters:**

| Param | Type | Required | Notes |
|-------|------|----------|-------|
| `agentId` | ObjectId | yes | The `_id` of the delivery agent |

**Success Response — 200 OK:**

```json
{
  "success": true,
  "message": "Agent fetched successfully",
  "data": {
    "agentId": "string",
    "userId": "string",
    "name": "string",
    "phone": "string",
    "email": "string | null",
    "profilePhotoUrl": "string | null",
    "vehicleType": "bike | scooter | bicycle | foot",
    "vehicleNumber": "string | null",
    "availabilityStatus": "offline | online",
    "cityId": "string | null",
    "currentAssignmentId": "string | null",
    "totalDeliveries": 0,
    "createdAt": "ISO8601 string",
    "updatedAt": "ISO8601 string",
    "isVerified": false,
    "isActive": true
  },
  "meta": {}
}
```

**Error Responses:**

| Code | HTTP | Description |
|------|------|-------------|
| `DELIVERY_AGENT_NOT_FOUND` | 404 | No delivery agent with the given `agentId` |
| `VALIDATION_ERROR` | 422 | Invalid `agentId` format (not a valid ObjectId) |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Authenticated but not an admin role |

---

## Module 3 Boundary Note

**`availabilityStatus` is MODULE 3 territory.**

- Module 2 creates the `availabilityStatus` field with a default of `offline`.
- Module 2 exposes `availabilityStatus` as a **read-only** field in all responses above.
- Module 3 implements `PATCH /api/v1/delivery/availability` to toggle `online`/`offline`.
- Sending `availabilityStatus` in the `PATCH /delivery/profile` body will be silently ignored.

---

## Error Codes Reference

All error codes below are registered in `docs/errors/phase-6-delivery-error-codes.md` and
`backend/api/src/errors/error-codes.ts`.

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `DELIVERY_AGENT_NOT_FOUND` | 404 | No agent with the given ID |
| `DELIVERY_ACCESS_FORBIDDEN` | 403 | Agent trying to access another agent's data |
| `DELIVERY_SCOPE_REQUIRED` | 400 | Required delivery agent scope missing |
| `DELIVERY_AGENT_PROFILE_INCOMPLETE` | 422 | Agent profile is missing required fields |
| `VALIDATION_ERROR` | 422 | Request body or query failed validation |
