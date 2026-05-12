# Backend Validation

## Purpose

Backend APIs validate input with Zod before controller execution.

## Validation Middleware

The backend uses `validateRequest()` to validate:

- request body
- request query
- request params

## Error Response

Validation failures return:

```json
{
  "success": false,
  "message": "Request validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "fields": {}
    }
  },
  "meta": {}
}
```

The HTTP status code is `422`.

## Shared Validators

Common validators include:

- Mongo ObjectId placeholder
- pagination fields: `page`, `limit`
- search field: `search`
- status values: `active`, `inactive`, `blocked`, `pending`, `archived`

## Public Validators

The public health, version, and system-info endpoints use empty validation
placeholders so route wiring follows the same pattern as future APIs.
