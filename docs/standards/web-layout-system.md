# Web Layout System

## Scope

This standard applies to the Phase 1 Vendor Panel and Admin Dashboard foundations.

## Vendor Panel

- Sidebar: provides the primary Vendor Panel navigation for Dashboard, Orders, Inventory, Products, and Settings.
- Header: provides the Vendor workspace title placeholder and user menu placeholder.
- Content area: renders routed page content inside `PageContainer`.

## Admin Dashboard

- Sidebar: provides the primary Admin Dashboard navigation for Dashboard, Users, Stores, Products, Orders, Delivery Agents, Finance, Support, and Settings.
- Header: provides the Admin workspace title placeholder and admin user menu placeholder.
- Content area: renders routed page content inside `PageContainer`.

## Component Boundary

- `Sidebar`, `Header`, and `PageContainer` are layout components.
- Feature pages render their own page content inside the layout content area.
- Route guards remain separate from layout components.
