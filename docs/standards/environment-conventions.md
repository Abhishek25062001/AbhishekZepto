# Environment Conventions

## Purpose

This document defines environment naming and configuration rules for the project.

It does not create `.env`, `.env.example`, repository bootstrap files, backend
config files, frontend config files, or deployment files. Those belong to later
Phase 1 modules.

## Environment Names

The project uses three primary environments:

- `development`
- `staging`
- `production`

Each application and backend service should read its runtime behavior from the
active environment.

## Environment Variable Naming

Environment variable names should use uppercase snake_case.

Examples:

- `APP_ENV`
- `APP_NAME`
- `APP_VERSION`
- `APP_PORT`
- `API_BASE_URL`
- `DB_MONGO_URI`
- `REDIS_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

Frontend tools may require prefixes later, such as `VITE_` for Vite-based web
apps. Those prefixes should be documented when repository setup begins.

## Secret Handling

Secrets must not be committed.

Examples of secrets:

- JWT secrets
- SMS provider credentials
- Razorpay keys and webhook secrets
- Firebase credentials
- Media storage credentials
- Internal API keys
- Database credentials
- Redis credentials

Only safe placeholder values should appear in future example files.

## Environment File Rule

Actual environment files are not created in this module.

Future repository setup may introduce example files such as:

- root `.env.example`
- backend `.env.example`
- Customer App `.env.example`
- Delivery Agent App `.env.example`
- Vendor Panel `.env.example`
- Admin Dashboard `.env.example`

Real `.env` files must stay local and uncommitted.

## Backend Configuration Rule

The backend should later validate required environment variables at startup.

Validation should confirm:

- Required variables are present.
- Numeric variables are valid numbers.
- URL variables are valid URLs where applicable.
- Production does not use insecure defaults.
- Production does not use development-only test credentials.

Backend environment validation belongs to the Backend Core Foundation module.

## Frontend Configuration Rule

Frontend applications should later read environment-specific values through their
framework-supported configuration mechanism.

Frontend applications must not include server secrets, database URLs, private
provider keys, internal API secrets, or signing secrets.

Allowed frontend configuration examples:

- API base URL
- App environment name
- Public map key when provider rules allow it
- Public analytics key when provider rules allow it

## Production Safety Rule

Production configuration must be stricter than development configuration.

Production must not allow:

- default JWT secrets
- wildcard browser CORS origins
- OTP development mode
- fake payment gateway mode
- missing webhook secrets
- committed private keys
- debug-only internal routes

The exact enforcement belongs to later security and production-readiness modules.

## Documentation Rule

Every future module that introduces environment variables must document:

- Variable name
- Required or optional status
- Default value if safe
- Owning app or backend module
- Whether the value is public or secret
- Which environments need it
