# Local Development Overview

## Goal

Local development should let a developer run the backend API, MongoDB, Customer
App, Delivery Agent App, Vendor Panel, and Admin Dashboard with predictable
commands and environment files.

Redis is documented as a local service placeholder for future modules. The
current backend does not require Redis to start.

## Required Local Tools

- Node.js 20 or compatible current LTS.
- npm.
- MongoDB, either installed locally or provided through Docker.
- Docker Desktop or another Docker Engine compatible with Docker Compose.
- Redis, reserved for later Redis-owned modules.
- Android Studio for Android mobile runtime checks.
- Java JDK for React Native Android tooling.
- Git.
- VS Code or another TypeScript-capable editor.
- Postman or another HTTP client for manual API checks.

## Local Surfaces

- Backend API: `backend/api`.
- Customer App: `apps/customer-app`.
- Delivery Agent App: `apps/delivery-agent-app`.
- Vendor Panel: `apps/vendor-panel`.
- Admin Dashboard: `apps/admin-dashboard`.
- Shared package: `packages/shared`.

## Current Runtime Notes

Backend startup requires a reachable `DB_MONGO_URI`. Use a local MongoDB
connection string, a safe development Atlas database with current network
access, or the Docker MongoDB service documented in
`docs/setup/docker-backend-services.md`.

Real `.env` files must stay local and must never be committed.
