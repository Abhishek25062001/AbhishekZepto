# Main System Blueprint

## Purpose

This document is the primary Phase 1 system blueprint for the Zepto-like
quick-commerce platform.

It ties together the architecture decision, system context, app boundaries, tech
stack, future-scale notes, and foundation standards created in the System
Architecture Foundation module.

## Phase 1 Architecture Summary

Phase 1 uses:

- Modular Monolith Backend
- Separate Frontend Apps
- MongoDB-first persistence
- Redis-ready supporting infrastructure
- TypeScript across backend, mobile apps, and web panels

The backend will be one Node.js + Express + TypeScript application with clear
internal module boundaries. The frontend surfaces will remain separate because
each one serves a different user group and operational workflow.

## System Surfaces

The system has five primary surfaces:

- Customer App
- Delivery Agent App
- Vendor Panel
- Admin Dashboard
- Backend

Each surface has a clear boundary and should be implemented according to the
responsibilities documented in `app-boundaries.md`.

## Customer App Summary

The Customer App is a React Native mobile application for end customers.

It owns customer-facing UI and local interaction flows, including:

- login UI
- location selection UI
- catalog browsing UI
- cart UI
- checkout UI
- payment handoff UI
- order tracking UI
- order history UI
- profile UI
- notification display

It does not own final pricing, inventory, payment verification, refund
decisions, delivery assignment, or order state authority.

## Delivery Agent App Summary

The Delivery Agent App is a React Native mobile application for delivery
partners.

It owns delivery partner UI and local interaction flows, including:

- login UI
- online/offline availability UI
- assignment request UI
- pickup UI
- active delivery UI
- delivery completion UI
- location permission prompts
- earnings visibility UI
- notification display

It does not own assignment selection logic, payout calculation, SLA decisions,
delivery lifecycle authority, or admin override decisions.

## Vendor Panel Summary

The Vendor Panel is a React.js web application for vendor and store operations.

It owns scoped store-operation UI, including:

- vendor/store login UI
- store dashboard UI
- inventory management UI
- incoming order queue UI
- picking and packing UI
- ready-for-pickup action UI
- store history UI
- stock alert display
- settlement visibility UI

It does not own global platform settings, cross-store access, payment
verification, refund approval, settlement calculation, or delivery assignment.

## Admin Dashboard Summary

The Admin Dashboard is a React.js web application for platform operations.

It owns admin and operations UI, including:

- user management UI
- delivery agent management UI
- vendor and store management UI
- catalog oversight UI
- inventory oversight UI
- order operations UI
- delivery operations UI
- support operations UI
- payment and refund operations UI
- promotions UI
- audit log visibility UI
- analytics and export UI
- platform settings UI

It does not own backend permission enforcement, direct database mutation,
financial truth, inventory reservation truth, or order state machine truth.

## Backend Summary

The Backend is the system of record and owns business-critical behavior.

It owns:

- authentication
- authorization
- role and permission enforcement
- tenant and store scope enforcement
- request validation
- response and error standards
- database persistence
- catalog rules
- inventory rules
- cart and pricing calculation
- checkout validation
- order creation
- order lifecycle transitions
- delivery assignment state
- delivery lifecycle transitions
- payment records and verification
- refund records and decisions
- vendor settlement records
- delivery earning records
- notification orchestration
- audit logging foundation
- real-time update foundation

Frontend apps consume backend APIs and must not replace backend authority for
business-critical state.

## Foundation Standards

Future implementation must follow the standards created in this module:

- `../standards/naming-conventions.md`
- `../standards/api-conventions.md`
- `../standards/database-conventions.md`
- `../standards/environment-conventions.md`

These standards define naming, API shape, database conventions, and environment
handling before source code exists.

## Phase 1 Exclusions

The following are not part of Phase 1 implementation:

- Microservices
- Kafka
- Kubernetes
- API gateway and separate BFF services
- Elasticsearch or Meilisearch
- PostgreSQL double-entry ledger
- H3 geospatial dispatch optimization
- Advanced dispatch algorithms
- Advanced production monitoring stack
- Production secret manager
- Multi-region infrastructure
- ML-based fraud or dispatch automation

Future-scale topics are captured in `future-scale-notes.md`.

## Module Boundary

This blueprint completes architecture foundation documentation only.

It does not create:

- backend source folders
- frontend app folders
- package manifests
- environment example files
- database models
- API routes
- validators
- middleware
- tests
- deployment files

Those belong to later Phase 1 modules.
