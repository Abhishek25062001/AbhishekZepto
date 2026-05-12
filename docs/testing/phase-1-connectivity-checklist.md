# Phase 1 Connectivity Checklist

## Connectivity Check Goal

This task verifies backend, MongoDB, Redis placeholder, Customer App, Delivery
Agent App, Vendor Panel, and Admin Dashboard work together locally.

## Prerequisites

- Start MongoDB locally or through Docker.
- Start Redis locally or through Docker when a Redis implementation exists.
- Start backend server:

```bash
npm run dev -w backend/api
```

- Confirm backend starts on `http://localhost:5000`.

## Backend Endpoint Checks

Health endpoint:

```bash
curl http://localhost:5000/api/v1/public/health
```

Expected response envelope:

- `success`
- `message`
- `data`
- `meta`

Expected backend status fields:

- `data.status`
- `data.service`
- `data.uptime`
- `data.timestamp`

Expected database status fields:

- `data.database.status`
- `data.database.readyState`

Expected Redis placeholder status field:

- `data.redis.status`

Version endpoint:

```bash
curl http://localhost:5000/api/v1/public/version
```

Expected fields:

- `data.version`
- `data.environment`

System-info endpoint:

```bash
curl http://localhost:5000/api/v1/public/system-info
```

Expected fields:

- `data.environment`
- `data.uptime`
- `data.timestamp`

System-info must not expose:

- `DB_MONGO_URI`
- `REDIS_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `RAZORPAY_SECRET`
- `FCM_PRIVATE_KEY`
- `MAPS_KEY`

Database write check:

```bash
curl -X POST http://localhost:5000/api/v1/internal/system/database-write-check
```

Expected database verification:

- `system_checks` collection exists in MongoDB.
- A `system_checks` document exists with fields:
  - `key`
  - `value`
  - `status`
  - `isDeleted`
  - `deletedAt`
  - `createdAt`
  - `updatedAt`

Auth placeholder request OTP endpoint:

```bash
curl -X POST http://localhost:5000/api/v1/public/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9999999999","role":"customer"}'
```

Expected message:

- `OTP request placeholder ready`

Auth placeholder verify OTP endpoint:

```bash
curl -X POST http://localhost:5000/api/v1/public/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9999999999","role":"customer","otp":"123456"}'
```

Expected fields:

- `accessToken`
- `refreshToken`

Protected internal auth route without token:

```bash
curl http://localhost:5000/api/v1/internal/auth/test-protected
```

Expected status:

- `401`

## Web Connectivity Checks

Start Vendor Panel:

```bash
npm run dev -w apps/vendor-panel
```

- Open `http://localhost:5173`.
- Confirm Vendor Panel loads `/login` when no session exists.
- Confirm Vendor Panel can call `GET /api/v1/public/health`.
- Confirm Vendor Panel dashboard/debug screen shows backend health in
  development mode.

Start Admin Dashboard:

```bash
npm run dev -w apps/admin-dashboard
```

- Open `http://localhost:5174`.
- Confirm Admin Dashboard loads `/login` when no session exists.
- Confirm Admin Dashboard can call `GET /api/v1/public/health`.
- Confirm Admin Dashboard dashboard/debug screen shows backend health in
  development mode.

## Mobile Connectivity Checks

Start Customer App Metro server:

```bash
npm run start -w apps/customer-app
```

- Run Customer App on Android emulator or device.
- Confirm Customer App opens `SplashScreen` during session restore.
- Confirm Customer App routes to `LoginScreen` when no tokens exist.
- Confirm Customer App can call `GET /api/v1/public/health`.

Start Delivery Agent App Metro server:

```bash
npm run start -w apps/delivery-agent-app
```

- Run Delivery Agent App on Android emulator or device.
- Confirm Delivery Agent App opens `SplashScreen` during session restore.
- Confirm Delivery Agent App routes to `LoginScreen` when no tokens exist.
- Confirm Delivery Agent App can call `GET /api/v1/public/health`.

## API Endpoints Verified

- `GET /api/v1/public/health`
- `GET /api/v1/public/version`
- `GET /api/v1/public/system-info`
- `POST /api/v1/internal/system/database-write-check`
- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `GET /api/v1/internal/auth/test-protected`

## DB Fields Verified

- `system_checks.key`
- `system_checks.value`
- `system_checks.status`
- `system_checks.isDeleted`
- `system_checks.deletedAt`
- `system_checks.createdAt`
- `system_checks.updatedAt`
