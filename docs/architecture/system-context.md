# System Context

## Purpose

This document defines the overall system context for the Zepto-like quick-commerce
platform in Phase 1.

The system has five primary surfaces:

- Customer App
- Delivery Agent App
- Vendor Panel
- Admin Dashboard
- Backend

The backend is the central system of record. All frontend applications interact
with the backend through versioned APIs and must not own final business-critical
state such as pricing, inventory, order status, payment status, refunds,
settlements, or delivery earnings.

## Customer App

The Customer App is a React Native mobile application for end customers.

Its core context includes:

- Customer authentication and session use
- Location and serviceability selection
- Product discovery and catalog browsing
- Cart and checkout experience
- Payment initiation through backend-approved payment data
- Order status visibility
- Delivery tracking visibility
- Order history and basic profile access
- Push notification handling

The Customer App consumes backend APIs for catalog, cart, checkout, payments,
orders, tracking, notifications, and profile data.

## Delivery Agent App

The Delivery Agent App is a React Native mobile application for delivery
partners.

Its core context includes:

- Delivery agent authentication and session use
- Online and offline availability
- Assignment visibility and accept/reject flow
- Store arrival and pickup flow
- Active delivery progress
- Delivery completion flow
- Location update submission
- Basic earnings visibility
- Delivery notification handling

The Delivery Agent App consumes backend APIs for authentication, availability,
assignments, pickup, delivery progress, delivery completion, location updates,
notifications, and earnings.

## Vendor Panel

The Vendor Panel is a React.js web application for vendor, store, and dark-store
operations.

Its core context includes:

- Vendor/store user authentication
- Store-scoped access
- Product and catalog visibility
- Inventory management
- Incoming order visibility
- Picking and packing workflows
- Ready-for-pickup status updates
- Store operation reports
- Vendor earnings and settlement visibility

The Vendor Panel consumes backend APIs for vendor authentication, scoped catalog
data, inventory, order operations, store operations, notifications, and finance
visibility.

## Admin Dashboard

The Admin Dashboard is a React.js web application for platform operations and
control.

Its core context includes:

- Admin authentication and role-based access
- User management
- Delivery agent management
- Vendor and store management
- Catalog and inventory oversight
- Order monitoring and operational intervention
- Support operations
- Payment and refund operations
- Coupon, offer, and campaign management
- Audit log visibility
- Operational analytics and exports

The Admin Dashboard consumes backend APIs for admin authentication, users,
stores, vendors, delivery agents, catalog, inventory, orders, support, finance,
promotions, audit logs, analytics, and platform settings.

## Backend

The Backend is a Node.js + Express + TypeScript application using MongoDB as the
primary Phase 1 database.

Its core context includes:

- Authentication and authorization
- Role and permission enforcement
- Tenant and store access control
- API request validation
- Catalog and inventory rules
- Cart and pricing calculations
- Checkout and order creation
- Order lifecycle state management
- Delivery lifecycle state management
- Real-time update foundation
- Payment, refund, earning, and settlement records
- Admin operations and audit logging
- Notification orchestration
- Shared API response and error standards

The backend owns all final state transitions and business-critical calculations.

## High-Level Operational Flows

### Customer Shopping Flow

The customer authenticates, selects a location, browses available products,
manages cart items, prepares checkout, initiates payment, and tracks the order
through backend-provided order and delivery status.

### Vendor and Store Operations Flow

Vendor or store staff authenticate into the Vendor Panel, manage scoped catalog
and inventory data, receive incoming orders, perform picking and packing, and
mark orders ready for delivery pickup.

### Delivery Operations Flow

Delivery agents authenticate, go online, receive assignments, accept or reject
orders, reach the store, confirm pickup, update delivery progress, and complete
the order through backend-controlled state transitions.

### Admin Oversight Flow

Admins authenticate into the Admin Dashboard, manage users, vendors, stores,
delivery agents, catalog, orders, support cases, payments, refunds, promotions,
audit logs, and operational analytics based on assigned permissions and scope.

## Phase 1 Context Boundary

Phase 1 establishes the foundation for these system surfaces and their backend
coordination. It does not introduce microservices, Kafka, Kubernetes,
Elasticsearch, H3 dispatch optimization, or advanced production infrastructure.
