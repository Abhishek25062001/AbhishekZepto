# OpenAPI Setup

## Local Swagger URL

```text
http://localhost:5000/api/v1/public/docs
```

## Local OpenAPI JSON URL

```text
http://localhost:5000/api/v1/public/openapi.json
```

## Environment Rule

Swagger UI and OpenAPI JSON routes are exposed only outside `production` through the backend `APP_ENV` check.

Production API documentation must be disabled or protected before launch.
