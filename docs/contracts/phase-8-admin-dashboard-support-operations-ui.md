# Phase 8 Admin Dashboard Support Operations UI Contract

Status: **COMPLETE** — Module 13 UI.

Base route: `/support`

## UI Routes

| Route | Permission | Purpose |
| --- | --- | --- |
| `/support` | `support:read` | List and filter support tickets |
| `/support/tickets/:ticketId` | `support:read` | View support ticket detail, notes, and audit |

## Backend Endpoints

| UI action | Endpoint | Permission |
| --- | --- | --- |
| Create ticket | `POST /api/v1/admin/support/tickets` | `support:create` |
| List tickets | `GET /api/v1/admin/support/tickets` | `support:read` |
| Ticket detail | `GET /api/v1/admin/support/tickets/:ticketId` | `support:read` |
| Update status | `PATCH /api/v1/admin/support/tickets/:ticketId/status` | `support:update` |
| Update priority | `PATCH /api/v1/admin/support/tickets/:ticketId/priority` | `support:update` |
| Update assignment | `PATCH /api/v1/admin/support/tickets/:ticketId/assignment` | `support:assign` |
| List notes | `GET /api/v1/admin/support/tickets/:ticketId/notes` | `support:read` |
| Create note | `POST /api/v1/admin/support/tickets/:ticketId/notes` | `support:update` |
| List audit | `GET /api/v1/admin/support/tickets/:ticketId/audit` | `support:read` |

## Filter Contract

The ticket list may send only documented Module 12 filters: `status`,
`priority`, `category`, `customerId`, `orderId`, `assignedAdminId`, `search`,
`page`, and `limit`.

## Exclusions

The UI must not call refund, order mutation, customer mutation, delivery
mutation, chat, attachment, realtime support, analytics, export, or settings
endpoints.
