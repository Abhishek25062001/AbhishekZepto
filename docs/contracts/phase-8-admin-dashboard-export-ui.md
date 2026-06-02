# Phase 8 Admin Dashboard Export UI Contract

Status: **IMPLEMENTED** — Module 21 UI.

Base route: `/exports`

## Route Permission

| Route | Permission | Purpose |
|-------|------------|---------|
| `/exports` | `reports:export` | List and queue admin export request metadata |
| `/exports/:exportId` | `reports:export` | Inspect one admin export request |

## Consumed APIs

| UI area | API endpoint | Permission |
|---------|--------------|------------|
| Create request | `POST /api/v1/admin/data-exports` | `reports:export` |
| List requests | `GET /api/v1/admin/data-exports` | `reports:export` |
| Detail request | `GET /api/v1/admin/data-exports/:exportId` | `reports:export` |

## Create Fields

- `exportType`
- `format`
- `filters`
- `reason`

## Supported Filters

- `exportType`
- `format`
- `status`
- `requestedByAdminId`
- `fromDate`
- `toDate`
- `page`
- `limit`

## Unsupported Workflows

Module 21 must not add file generation, download, signed URL, scheduled export,
retry, cancel, delete, email delivery, backend setup, database, source-domain
mutation, or future export module behavior.
