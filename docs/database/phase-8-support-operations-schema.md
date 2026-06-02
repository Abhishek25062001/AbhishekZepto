# Phase 8 Support Operations Schema

Status: **COMPLETE** — Module 12 backend.

## `support_tickets`

- `ticketNumber`: unique human-readable support ticket number.
- `customerId`: optional referenced customer id for context.
- `orderId`: optional referenced order id for context.
- `subject`: short ticket summary.
- `description`: ticket details captured by an admin workflow.
- `category`: one of the bounded support categories.
- `priority`: bounded priority enum.
- `status`: bounded lifecycle enum.
- `source`: origin marker for this backend surface.
- `assignedAdminId`: optional assigned admin id.
- `createdByAdminId`: optional creating admin id.
- `lastActivityAt`: latest ticket write timestamp.
- `resolvedAt`: timestamp set when resolved.
- `closedAt`: timestamp set when closed.
- `resolutionSummary`: optional resolution text.
- `tags`: optional support labels.
- `isDeleted`: soft-delete guard; Module 12 does not expose delete APIs.
- `createdAt`
- `updatedAt`

Indexes:

- unique `ticketNumber`
- `customerId`
- `orderId`
- `status`
- `priority`
- `assignedAdminId`
- `lastActivityAt`
- compound `status, priority, lastActivityAt`

## `support_ticket_notes`

- `ticketId`: parent support ticket id.
- `authorAdminId`: optional creating admin id.
- `noteType`: bounded note type.
- `body`: note text.
- `isInternal`: support notes remain internal to admin users.
- `createdAt`
- `updatedAt`

Indexes:

- `ticketId`
- compound `ticketId, createdAt`
