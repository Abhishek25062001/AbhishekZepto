# Phase 8 Admin Dashboard Platform Settings UI Contract

Status: **COMPLETE** — Module 15 UI.

Base routes:

- `/settings/platform`
- `/settings/platform/:settingKey`

## UI Routes

| Route | Permission | Purpose |
| --- | --- | --- |
| `/settings/platform` | `settings:read` | List and filter platform settings |
| `/settings/platform/:settingKey` | `settings:read` | View setting detail, update form, and audit |

## Backend Endpoints

| UI action | Endpoint | Permission |
| --- | --- | --- |
| List settings | `GET /api/v1/admin/settings` | `settings:read` |
| Setting detail | `GET /api/v1/admin/settings/:settingKey` | `settings:read` |
| Update setting | `PATCH /api/v1/admin/settings/:settingKey` | `settings:manage` |
| List setting audit | `GET /api/v1/admin/settings/:settingKey/audit` | `settings:read` |

## Filter Contract

The list UI may send only documented Module 14 filters: `category`,
`scopeType`, `scopeId`, `search`, `page`, and `limit`.

## Update Contract

The update UI may submit only:

```json
{
  "value": true,
  "reason": "Enable controlled rollout"
}
```

Non-editable settings must not render a submit path. Editable setting updates
must be permission-gated with `settings:manage`.

## Exclusions

The UI must not call pricing, finance, order mutation, delivery mutation,
customer mutation, support mutation, catalog mutation, vendor/store mutation,
analytics, export, backend setup, or future settings workflow endpoints.
