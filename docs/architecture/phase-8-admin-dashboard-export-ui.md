# Phase 8 Admin Dashboard Export UI

Status: **COMPLETE** — Module 21 UI.

## Dependencies

- Phase 8 Module 20 Admin Data Export Foundation.
- Existing Admin Dashboard authentication, protected route, and permission
  visibility utilities.

## Purpose

Admin Dashboard Export UI gives operations admins a bounded dashboard surface to
queue and inspect export request metadata created by Module 20.

## Scope

In scope:

- Permission-gated Admin Dashboard export list and detail routes.
- Export request create form for queued metadata only.
- Supported Module 20 list filters.
- Display of status, filters, requester, timestamps, failure reason, and
  nullable file metadata.
- Loading, error, empty, and permission-denied states.

Out of scope:

- Backend routes, controllers, services, repositories, models, validators, or
  database fields.
- File generation, download streaming, signed download URLs, storage uploads,
  scheduled exports, retry/cancel/delete workflows, email delivery, custom
  report builders, or source-domain mutation workflows.

## Permission Boundary

The route, navigation, and create action must require `reports:export`.
