# Phase 8 Admin Dashboard Support Operations UI

Status: **COMPLETE** — Module 13 UI.

## Dependencies

- Phase 8 Module 12 Support Operations Backend.
- Existing Admin Dashboard authentication, route protection, permission
  visibility utilities, API client, and query provider.

## Purpose

Module 13 gives admin users a bounded dashboard UI for support tickets,
internal notes, assignment, status, priority, and audit inspection.

## Scope

In scope:

- Support ticket list and detail views.
- Support ticket create form.
- Status, priority, assignment, and unassignment controls.
- Internal support ticket notes.
- Read-only support ticket audit view.
- Permission gates for `support:read`, `support:create`, `support:update`, and
  `support:assign`.

Out of scope:

- Backend route, database, or OpenAPI changes.
- Customer-facing support UI.
- Live chat, attachments, realtime support events, or external helpdesk
  integration.
- Refund execution, order mutation, delivery mutation, customer mutation,
  analytics, exports, and settings workflows.

## Ownership

The UI consumes only Module 12 `/api/v1/admin/support/*` endpoints. It may
display customer and order ids as ticket context, but it must not mutate
customer, order, delivery, payment, refund, inventory, vendor, or store state.
