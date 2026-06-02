# Phase 8 Support Operations API

Status: **COMPLETE** — Module 12 backend.

Base path: `/api/v1/admin/support`

All routes are admin-only and require the existing admin authentication and
role boundary before route-level support permissions are evaluated.

## Endpoints

| Method | Path | Permission |
|--------|------|------------|
| POST | `/tickets` | `support:create` |
| GET | `/tickets` | `support:read` |
| GET | `/tickets/:ticketId` | `support:read` |
| PATCH | `/tickets/:ticketId/status` | `support:update` |
| PATCH | `/tickets/:ticketId/priority` | `support:update` |
| PATCH | `/tickets/:ticketId/assignment` | `support:assign` |
| GET | `/tickets/:ticketId/notes` | `support:read` |
| POST | `/tickets/:ticketId/notes` | `support:update` |
| GET | `/tickets/:ticketId/audit` | `support:read` |

## Supported Filters

Ticket list supports: `status`, `priority`, `category`, `customerId`,
`orderId`, `assignedAdminId`, `search`, `page`, and `limit`.

## Write Payload Boundaries

- Ticket creation may capture customer/order ids, subject, description,
  category, priority, tags, and assignment.
- Status updates may capture status and an optional resolution summary.
- Priority updates may capture priority only.
- Assignment updates may capture an admin id or `null` to unassign.
- Notes may capture body and internal-note metadata only.

## Response Conventions

Responses follow `docs/standards/backend-response-format.md`.

## Exclusions

The API does not execute refunds, update orders, update customers, update
delivery assignments, send notifications, stream realtime events, or manage
support attachments.
