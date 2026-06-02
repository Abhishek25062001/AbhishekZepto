# Phase 8 Admin Dashboard Audit Log UI Contract

Status: **COMPLETE** — Admin Dashboard Audit Log UI.

## UI Routes

| Route | Permission | Purpose |
| --- | --- | --- |
| `/audit-logs` | `audit_logs:read` | List and filter admin action audit logs |
| `/audit-logs/:auditLogId` | `audit_logs:read` | View one admin action audit log |

## Backend Endpoints Consumed

| UI action | Endpoint | Permission |
| --- | --- | --- |
| List audit logs | `GET /api/v1/admin/audit-logs` | `audit_logs:read` |
| Audit log detail | `GET /api/v1/admin/audit-logs/:auditLogId` | `audit_logs:read` |

## Filter Contract

The list UI may send only documented Module 16 filters:

- `adminId`
- `actionType`
- `entityType`
- `entityId`
- `from`
- `to`
- `page`
- `limit`

## Exclusions

The UI must not call export, analytics, replay, restore, edit, delete, audit
mutation, sensitive reveal, or unrelated domain endpoints.
