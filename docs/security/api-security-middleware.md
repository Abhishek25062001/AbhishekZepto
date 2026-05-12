# API Security Middleware

## Middleware Files

- `/backend/api/src/middlewares/security.middleware.ts`
- `/backend/api/src/middlewares/cors.middleware.ts`
- `/backend/api/src/middlewares/body-parser.middleware.ts`
- `/backend/api/src/middlewares/request-sanitizer.middleware.ts`
- `/backend/api/src/middlewares/rate-limit.middleware.ts`

## Middleware Behavior

- Helmet default security headers are enabled.
- Express `x-powered-by` is disabled in the app.
- CORS allows local Vendor Panel and Admin Dashboard origins.
- CORS credentials are enabled as a placeholder.
- JSON and URL-encoded body limits are `1mb`.
- Request body, query, and params remove prototype pollution keys:
  `__proto__`, `constructor`, and `prototype`.
- Global API rate limit placeholder is 100 requests per 15 minutes per IP.
- Auth API rate limit placeholder is 5 requests per 5 minutes per phone/IP.
- Rate limited requests return the standard API error envelope with
  `RATE_LIMITED`.

## API Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`

## DB Fields

No new database fields created in this task.
