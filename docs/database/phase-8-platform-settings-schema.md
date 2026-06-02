# Phase 8 Platform Settings Schema

Status: **COMPLETE** — Module 14 backend.

## `platform_settings`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `key` | string | yes | Stable unique setting key |
| `category` | string | yes | `platform`, `city`, `store`, `feature`, or `operational` |
| `value` | mixed | yes | Stored setting value |
| `valueType` | string | yes | `boolean`, `number`, `string`, `json` |
| `scopeType` | string | yes | `global`, `city`, or `store` |
| `scopeId` | string/null | no | Required for non-global scoped records |
| `description` | string | yes | Admin-facing setting description |
| `isSensitive` | boolean | yes | Marks sensitive setting values |
| `isEditable` | boolean | yes | Controls whether admin updates are allowed |
| `updatedBy` | string/null | no | Last admin actor id |
| `createdAt` | date | yes | Mongoose timestamp |
| `updatedAt` | date | yes | Mongoose timestamp |

## Indexes

- Unique `key`.
- `category`, `scopeType`, and `scopeId` for filtered lists.

## Audit

Setting updates write to existing `admin_action_audits` with before/after state,
reason, admin actor, IP address, and device information.
