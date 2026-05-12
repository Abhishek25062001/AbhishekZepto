# Backend Route Registry

## Public Routes

- `GET /api/v1/public/health`
- `GET /api/v1/public/version`
- `GET /api/v1/public/system-info`
- `GET /api/v1/public/docs`
- `GET /api/v1/public/openapi.json`
- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`

## Customer Routes

Placeholder route group:

```text
/api/v1/customer/*
```

## Delivery Routes

Placeholder route group:

```text
/api/v1/delivery/*
```

## Vendor Routes

Placeholder route group:

```text
/api/v1/vendor/*
```

## Admin Routes

Placeholder route group:

```text
/api/v1/admin/*
```

## Internal Routes

- `POST /api/v1/internal/system/database-write-check`
- `GET /api/v1/internal/auth/test-protected`

Internal test routes must be protected or removed before production.
