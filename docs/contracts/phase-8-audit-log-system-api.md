# Phase 8 Audit Log System API

Status: **COMPLETE** — Module 16 backend.

Base route: `/api/v1/admin/audit-logs`

## Endpoints

| Method | Path | Permission | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/v1/admin/audit-logs` | `audit_logs:read` | List admin action audits |
| `GET` | `/api/v1/admin/audit-logs/:auditLogId` | `audit_logs:read` | Get one admin action audit |

## List Filters

The list endpoint may accept:

- `adminId`
- `actionType`
- `entityType`
- `entityId`
- `from`
- `to`
- `page`
- `limit`

Results sort newest first by `createdAt`.

## Response Fields

Audit responses include existing `admin_action_audits` fields:

- `_id`
- `adminId`
- `actionType`
- `entityType`
- `entityId`
- `beforeState`
- `afterState`
- `reason`
- `ipAddress`
- `deviceInfo`
- `createdAt`
- `updatedAt`

## Exclusions

This module must not add export, analytics, audit write, audit delete, audit
replay, sensitive reveal, or cross-module mutation endpoints.
