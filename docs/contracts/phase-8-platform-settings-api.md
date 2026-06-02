# Phase 8 Platform Settings API Contract

Status: **COMPLETE** — Module 14 backend.

Base path: `/api/v1/admin/settings`

## Endpoints

| Method | Path | Permission | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/v1/admin/settings` | `settings:read` | List platform settings |
| `GET` | `/api/v1/admin/settings/:settingKey` | `settings:read` | Fetch one setting |
| `PATCH` | `/api/v1/admin/settings/:settingKey` | `settings:manage` | Update one editable setting |
| `GET` | `/api/v1/admin/settings/:settingKey/audit` | `settings:read` | List audit entries for one setting |

## List Filters

- `category`
- `scopeType`
- `scopeId`
- `search`
- `page`
- `limit`

## Update Payload

```json
{
  "value": true,
  "reason": "Enable controlled rollout"
}
```

The value type must match the stored setting `valueType`. Update requests must
include a reason.

## Exclusions

The API must not expose pricing, finance, order mutation, delivery mutation,
customer mutation, support mutation, catalog mutation, vendor/store mutation,
analytics, export, or Admin Dashboard UI workflows.
