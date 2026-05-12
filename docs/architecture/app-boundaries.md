# App Boundaries

## Purpose

This document defines the high-level responsibility boundaries for each system
surface in Phase 1.

The goal is to prevent customer, delivery, vendor, admin, and backend concerns
from being mixed during future implementation tickets.

## Boundary Rule

Each frontend application owns its user experience, local UI state, navigation,
screen composition, and API interaction layer.

The backend owns business-critical state, calculations, permissions, validation,
and persistence.

Frontend applications must not own final truth for:

- Pricing
- Inventory
- Payment status
- Refund status
- Settlement status
- Delivery partner earnings
- Order lifecycle state
- Delivery lifecycle state
- Role and permission decisions
- Tenant and store access decisions

## Customer App Boundary

The Customer App is responsible for the customer-facing mobile experience.

It owns:

- Customer onboarding screens
- Phone/OTP login UI
- Session-aware navigation
- Location selection UI
- Serviceability display
- Home and catalog browsing UI
- Product search and filtering UI
- Cart UI
- Checkout UI
- Payment gateway handoff UI
- Order confirmation UI
- Order history UI
- Order tracking UI
- Customer profile UI
- Push notification display
- Local loading, empty, and error states

It does not own:

- Final product availability
- Final inventory quantity
- Final price calculation
- Final discount calculation
- Final tax calculation
- Order creation authority
- Payment verification
- Refund decisions
- Delivery assignment
- Order state transitions

## Delivery Agent App Boundary

The Delivery Agent App is responsible for the delivery partner mobile
experience.

It owns:

- Delivery agent login UI
- Session-aware navigation
- Online/offline toggle UI
- Assignment request UI
- Accept/reject action UI
- Store arrival UI
- Pickup confirmation UI
- Active delivery UI
- Delivery completion UI
- Location permission prompts
- Delivery status display
- Basic earnings display
- Push notification display
- Local loading, empty, and error states

It does not own:

- Assignment selection logic
- Delivery payout calculation
- Delivery SLA decisions
- Order lifecycle state
- Delivery lifecycle authority
- Customer payment or refund state
- Store inventory state
- Admin override decisions

## Vendor Panel Boundary

The Vendor Panel is responsible for store, vendor, and dark-store operational
workflows.

It owns:

- Vendor/store login UI
- Store-scoped dashboard UI
- Store catalog visibility UI
- Inventory management UI
- Incoming order queue UI
- Picking workflow UI
- Packing workflow UI
- Ready-for-pickup action UI
- Store order history UI
- Stock alert display
- Store settings UI
- Vendor earnings and settlement visibility UI
- Local loading, empty, and error states

It does not own:

- Global catalog authority unless allowed by admin APIs
- Cross-store data access
- Cross-vendor data access
- Final inventory reservation logic
- Final order lifecycle rules
- Payment verification
- Refund approval
- Settlement calculation
- Delivery assignment
- Admin-level platform settings

## Admin Dashboard Boundary

The Admin Dashboard is responsible for platform operations and control tower
workflows.

It owns:

- Admin login UI
- Role-aware dashboard UI
- User management UI
- Customer management UI
- Delivery agent management UI
- Vendor and store management UI
- Catalog oversight UI
- Inventory oversight UI
- Order operations UI
- Delivery operations UI
- Support operations UI
- Payment and refund operations UI
- Promotion and coupon management UI
- Audit log visibility UI
- Operational analytics UI
- Export UI
- Platform settings UI
- Local loading, empty, and error states

It does not own:

- Backend permission enforcement
- Tenant scope enforcement
- Direct database mutation
- Payment gateway verification
- Financial ledger truth
- Delivery assignment algorithm truth
- Inventory reservation truth
- Order state machine truth

## Backend Boundary

The Backend is responsible for all business-critical platform rules and data
ownership.

It owns:

- Authentication
- JWT and session validation
- Role-based access control
- Permission checks
- Tenant, vendor, store, city, customer, and delivery-agent scope checks
- Request validation
- API response standards
- Error handling standards
- Audit logging
- Database persistence
- Catalog rules
- Inventory rules
- Cart calculation
- Checkout validation
- Order creation
- Order lifecycle state transitions
- Delivery assignment state
- Delivery lifecycle state transitions
- Payment records
- Payment verification
- Refund records
- Refund decisions
- Vendor settlement records
- Delivery partner earning records
- Notification orchestration
- Real-time event foundation

The backend exposes versioned APIs for each surface and keeps final authority for
state transitions and calculations.

## Surface Routing Boundary

Future backend routes should remain grouped by surface and purpose:

- Public routes for unauthenticated access
- Customer routes for Customer App workflows
- Delivery routes for Delivery Agent App workflows
- Vendor routes for Vendor Panel workflows
- Admin routes for Admin Dashboard workflows
- Internal routes for backend-only operations
- Webhook routes for external provider callbacks

This document defines boundaries only. It does not create API endpoints, database
models, permissions, validators, app folders, backend folders, or repository
bootstrap files.
