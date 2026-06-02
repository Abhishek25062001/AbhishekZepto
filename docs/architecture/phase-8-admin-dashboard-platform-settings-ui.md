# Phase 8 Admin Dashboard Platform Settings UI

Status: **COMPLETE** — Module 15 UI.

## Dependencies

- Phase 8 Module 14 Platform Settings Backend.
- Existing Admin Dashboard authentication, route protection, permission
  visibility utilities, API client, and query provider.

## Purpose

Module 15 gives admin users a bounded dashboard UI for viewing platform
settings, inspecting setting audit history, and updating editable setting
values with reason capture.

## Implemented Surface

- `/settings/platform` list view with category, scope type, scope ID, search,
  and pagination controls.
- `/settings/platform/:settingKey` detail view with current value, metadata,
  audit history, and refresh controls.
- Update form for editable settings only, gated by `settings:manage`.
- Sidebar and settings-page navigation for the platform settings surface.

## Scope

In scope:

- Platform settings list and detail views.
- Platform setting audit panel.
- Editable setting update form.
- Permission gates for `settings:read` and `settings:manage`.

Out of scope:

- Backend route, database, or OpenAPI changes.
- Runtime feature-flag evaluation in customer, vendor, delivery, or automation
  code paths.
- Pricing engine, commission engine, finance, payout, refund, promotion, tax,
  order mutation, delivery mutation, customer mutation, support mutation,
  catalog mutation, vendor/store mutation, analytics, exports, and future
  settings workflows.

## Ownership

The UI consumes only Module 14 `/api/v1/admin/settings/*` endpoints. It may
display persisted setting records and audit entries, but it must not execute or
duplicate the business behavior controlled by those settings.
