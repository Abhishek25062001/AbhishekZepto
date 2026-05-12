# Backend Auth Core Protected Route Test

## Goal

Document the planned protected auth test endpoint behavior for Backend Auth Core.

## Planned Files

- `/backend/api/src/modules/auth/routes/auth-test.routes.ts`
- `/backend/api/src/modules/auth/controllers/auth-test.controller.ts`

## Endpoint

- `GET /api/v1/internal/auth/test-protected`

## Planned Middleware

- `authenticate()`
- `requirePermission('auth:read')`

## Planned Response

```json
{
  "success": true,
  "message": "Protected auth test route working",
  "data": {
    "user": {}
  },
  "meta": {}
}
```

## Curl Test

- Add curl test with real access token in `docs/setup/backend-api-smoke-test.md`
