# Phase 6 Rider Availability API & Integration Contracts

## Goal

This document defines the exact **API and Contract Specifications** for the four authenticated delivery agent endpoints. It outlines request/response structures, authorization rules, and manual verification procedures.

---

## 1. Authentication & Security Headers

All requests under `/api/v1/delivery/*` require a standard secure JWT token passed in the `Authorization` header:

```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

### Authorization Guards
1. **Valid Access Token:** The token must decode to a non-expired, non-revoked session.
2. **Role Verification:** The session must be linked to a user with role `delivery_agent`.
3. **Identity Resolution:** The server will resolve the agent identity by querying `DeliveryAgentModel` with `userId = req.user.userId`.

---

## 2. API Endpoints

### 1. GET /api/v1/delivery/profile
Returns the authenticated delivery agent's complete profile.

* **Headers:**
  - `Authorization: Bearer <token>`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile fetched successfully",
    "data": {
      "_id": "603d7b97e6824a1b8cfa3b21",
      "userId": "603d7b97e6824a1b8cfa3b20",
      "name": "Shivam Chowdhry",
      "phone": "+919876543210",
      "email": "shivam@zepto-like.com",
      "profilePhotoUrl": "https://assets.zepto-like.com/profiles/shivam.jpg",
      "vehicleType": "two_wheeler",
      "vehicleNumber": "MH-12-AB-1234",
      "availabilityStatus": "offline",
      "isVerified": true,
      "isActive": true,
      "cityId": "603d7b97e6824a1b8cfa3b19",
      "currentAssignmentId": null,
      "totalDeliveries": 12,
      "createdAt": "2026-05-20T10:00:00.000Z",
      "updatedAt": "2026-05-21T18:00:00.000Z"
    }
  }
  ```

---

### 2. PATCH /api/v1/delivery/profile
Updates lightweight profile fields.

* **Headers:**
  - `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  {
    "email": "shivam.new@zepto-like.com",
    "profilePhotoUrl": "https://assets.zepto-like.com/profiles/shivam_new.jpg",
    "vehicleNumber": "MH-12-AB-5678"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "data": {
      "_id": "603d7b97e6824a1b8cfa3b21",
      "userId": "603d7b97e6824a1b8cfa3b20",
      "name": "Shivam Chowdhry",
      "phone": "+919876543210",
      "email": "shivam.new@zepto-like.com",
      "profilePhotoUrl": "https://assets.zepto-like.com/profiles/shivam_new.jpg",
      "vehicleType": "two_wheeler",
      "vehicleNumber": "MH-12-AB-5678",
      "availabilityStatus": "offline",
      "isVerified": true,
      "isActive": true,
      "cityId": "603d7b97e6824a1b8cfa3b19",
      "currentAssignmentId": null,
      "totalDeliveries": 12
    }
  }
  ```

---

### 3. PATCH /api/v1/delivery/availability
Updates the agent's availability status.

* **Headers:**
  - `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  {
    "status": "online"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Availability status updated successfully",
    "data": {
      "_id": "603d7b97e6824a1b8cfa3b21",
      "availabilityStatus": "online",
      "cityId": "603d7b97e6824a1b8cfa3b19",
      "vehicleNumber": "MH-12-AB-5678",
      "isVerified": true,
      "isActive": true,
      "currentAssignmentId": null
    }
  }
  ```

---

### 4. GET /api/v1/delivery/status
Lightweight presence and active assignment status polling API.

* **Headers:**
  - `Authorization: Bearer <token>`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Availability status fetched successfully",
    "data": {
      "availabilityStatus": "online",
      "currentAssignmentId": null
    }
  }
  ```

---

## 3. Error Contract Payloads

### 1. Incomplete Profile Warning (409 Conflict)
Returned when trying to go `online` while failing checklist validations.
```json
{
  "success": false,
  "error": {
    "code": "DELIVERY_AGENT_PROFILE_INCOMPLETE",
    "message": "Cannot go online: operating city and vehicle number must be configured, and profile must be verified by admin."
  }
}
```

### 2. Unauthorized Token Error (401 Unauthorized)
Returned if session has been revoked, expired, or Bearer format is invalid.
```json
{
  "success": false,
  "error": {
    "code": "SESSION_EXPIRED",
    "message": "Session has expired"
  }
}
```

---

## 4. Manual Verification Snippets

Operations teams can verify routes manually using the following commands (assuming local server runs on port 3000):

```bash
# 1. Fetch current status
curl -H "Authorization: Bearer <JWT_ACCESS_TOKEN>" http://localhost:3000/api/v1/delivery/status

# 2. Toggle Status Online
curl -X PATCH \
  -H "Authorization: Bearer <JWT_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"online"}' \
  http://localhost:3000/api/v1/delivery/availability
```
