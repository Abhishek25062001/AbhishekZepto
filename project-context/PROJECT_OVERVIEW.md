# Project Overview

## Product

This repository is for a Zepto-like quick-commerce platform. The system supports customer shopping, vendor or dark-store operations, delivery-agent operations, and admin control workflows.

## Primary Surfaces

- Customer App: React Native + TypeScript.
- Delivery Agent App: React Native + TypeScript.
- Vendor Panel: React.js + TypeScript.
- Admin Dashboard: React.js + TypeScript.
- Backend: Node.js + Express + TypeScript with MongoDB.

## Backend Role

The backend is the system of record. It owns authentication, authorization, validation, business state transitions, pricing, inventory authority, order lifecycle, delivery lifecycle, payments, refunds, settlements, audit logs, notifications, and real-time event coordination.

Frontend apps own user experience, local UI state, navigation, and API interaction only. They must not own final business-critical calculations or state transitions.

## Core Business Areas

- Customer onboarding, location, catalog, cart, checkout, payments, order tracking, notifications, profile.
- Delivery-agent login, online/offline status, assignments, pickup, active delivery, location updates, completion, earnings.
- Vendor/store login, scoped catalog visibility, inventory operations, order picking and packing, ready-for-pickup, settlement visibility.
- Admin user management, vendor/store management, delivery-agent management, catalog oversight, inventory oversight, order operations, support, payments, refunds, promotions, audit logs, analytics, exports, settings.

## Current Architecture Direction

Phase 1 uses a modular monolith backend, separate frontend apps, MongoDB-first persistence, and Redis-ready foundations. Microservices, Kafka, Kubernetes, Elasticsearch, H3 dispatch optimization, strict PostgreSQL ledger architecture, and advanced production infrastructure are deferred until later scale-readiness phases.

## Current Repository Root

Expected root:

```text
ZeptoProject/
```

Current main folders:

```text
apps/
backend/api/
docs/
packages/shared/
project-context/
```

## Source Documents

Important project PDFs exist outside the repository root:

- `research/admin.pdf`
- `research/backend.pdf`
- `research/deliverypartner.pdf`
- `research/vendor.pdf`
- `research/mobileapp.pdf`
- `projectin micro/docone/AllPhase&Modules.pdf`
- `projectin micro/doctwo/PhaesDetail1&2.pdf`
- `projectin micro/docthree/PhaesDetail3.pdf`
- `projectin micro/docfour/PhaesDetail4&5.pdf`
- `projectin micro/docfive/PhaesDetail6,7&8.pdf`
- `projectin micro/docsix/PhaesDetail9.pdf`
- `projectin micro/docseven/PhaesDetail10.pdf`
- `projectin micro/doceight/PhaesDetail11.pdf`
- `projectin micro/docnine/PhaesDetail12.pdf`

PDF extraction was not available through the local `pdftotext` command during this context creation. When exact phase or micro-task detail matters, verify directly against the PDFs.
