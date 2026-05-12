# Coding Patterns

## Backend Current Patterns

Backend source root:

```text
backend/api/src
```

Current folders:

```text
config/
controllers/
database/
errors/
middlewares/
modules/
routes/
services/
types/
utils/
validators/
```

Backend package:

```text
backend/api/package.json
```

Backend scripts currently available:

```bash
npm run dev -w backend/api
npm run build -w backend/api
npm run start -w backend/api
npm run typecheck -w backend/api
npm run lint -w backend/api
```

## Request Flow

Current Express flow:

```text
requestIdMiddleware
-> requestLoggerMiddleware
-> securityMiddleware
-> corsMiddleware
-> bodyParserMiddleware
-> routes
-> notFoundMiddleware
-> globalErrorMiddleware
```

Routes mount under:

```text
/api/v1
```

Current route files:

```text
backend/api/src/routes/index.ts
backend/api/src/routes/v1/index.ts
backend/api/src/routes/v1/public.routes.ts
backend/api/src/routes/v1/customer.routes.ts
backend/api/src/routes/v1/delivery.routes.ts
backend/api/src/routes/v1/vendor.routes.ts
backend/api/src/routes/v1/admin.routes.ts
backend/api/src/routes/v1/internal.routes.ts
```

Only public health/version/system-info endpoints are real foundation endpoints. Surface placeholder endpoints must not be treated as completed feature APIs.

Authentication Foundation adds public auth placeholder routes under:

```text
/api/v1/public/auth
```

Current auth placeholder endpoints:

```text
POST /api/v1/public/auth/request-otp
POST /api/v1/public/auth/verify-otp
POST /api/v1/public/auth/refresh-token
POST /api/v1/public/auth/logout
GET /api/v1/internal/auth/test-protected
```

These are Phase 1 placeholders. Real OTP, JWT signing, token rotation, and
production session behavior are deferred.

## Response Helpers

Use helpers in:

```text
backend/api/src/utils/api-response.ts
```

Available helpers:

- `sendSuccessResponse`
- `sendCreatedResponse`
- `sendAcceptedResponse`
- `sendErrorResponse`
- `sendPaginatedResponse`

## Error Pattern

Use:

```text
backend/api/src/errors/AppError.ts
backend/api/src/errors/error-codes.ts
backend/api/src/middlewares/error.middleware.ts
```

Do not throw raw strings. Use `AppError` for expected operational errors.

## Async Controller Pattern

Use:

```text
backend/api/src/utils/async-handler.ts
```

Controllers should call services and response helpers. Controllers should not contain business logic.

## Validation Pattern

Use:

```text
backend/api/src/middlewares/validate-request.middleware.ts
backend/api/src/validators/
```

Every route with input must have body/query/params validation.

## Module Folder Pattern

Backend feature modules should use:

```text
modules/{module-name}/controllers
modules/{module-name}/services
modules/{module-name}/repositories
modules/{module-name}/models
modules/{module-name}/validators
modules/{module-name}/routes
modules/{module-name}/types
```

Current module folders prepared:

- `auth`
- `users`
- `catalog`
- `orders`
- `delivery`
- `system`

Additional modules should be created only by their owning tickets.

Repositories and models are not implemented yet. Create them only when a module ticket requires persistence.

## Environment Pattern

Use:

```text
backend/api/src/config/env.ts
```

Current required variables:

- `APP_ENV`
- `APP_PORT`
- `APP_VERSION`

Current optional placeholders:

- `DB_MONGO_URI`
- `REDIS_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

Database Foundation now requires `DB_MONGO_URI` for backend startup because the
server connects to MongoDB before listening.

Real `.env` files must not be committed.

## Frontend Current Patterns

Customer App and Delivery Agent App now have React Native foundation source:
navigation, placeholder screens, API clients, Zustand stores, TanStack Query
providers, secure storage services, session restore hooks, common UI components,
backend health hooks, and root error boundaries.

Vendor Panel and Admin Dashboard still have package and TypeScript skeletons
plus React web foundation source: routes, placeholder pages, API clients,
Zustand stores, TanStack Query providers, layout components, common UI
components, session storage services, session restore hooks, backend health
hooks, permission visibility components, and root error boundaries.

Current app roots:

```text
apps/customer-app
apps/delivery-agent-app
apps/vendor-panel
apps/admin-dashboard
```

Do not add frontend screens, navigators, stores, API clients, or components unless the current module/ticket explicitly requires them.

Web panel environment values use Vite names:

```text
VITE_API_BASE_URL
VITE_APP_ENV
```

Do not add production browser auth behavior, secure-cookie strategy, or real web
login flows until their owning module requires them.
