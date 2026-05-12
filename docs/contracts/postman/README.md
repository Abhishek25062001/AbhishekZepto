# Postman API Contract Collection

## Collection

`docs/contracts/postman/zepto-like-phase-1.postman_collection.json`

## Import

Import the JSON collection into Postman using the Postman import action.

## Base URL

Set or edit the collection variable:

```text
baseUrl = http://localhost:5000
```

Use a different local port only when the backend is intentionally started on that port for smoke testing.

## Temporary Internal APIs

Internal test APIs are temporary Phase 1 verification endpoints:

- `POST {{baseUrl}}/api/v1/internal/system/database-write-check`
- `GET {{baseUrl}}/api/v1/internal/auth/test-protected`

These internal test APIs must be protected or removed before production launch.
